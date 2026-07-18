import { rpc, xdr } from "@stellar/stellar-sdk";
import { createLogger } from "../lib/logger.js";
import * as eventRepo from "../repositories/event.repository.js";
import * as campaignService from "../services/campaign.service.js";
import * as caseService from "../services/case.service.js";
import * as jurorService from "../services/juror.service.js";
import * as identityService from "../services/identity.service.js";
import * as indexerCursorRepo from "../repositories/indexer-cursor.repository.js";
import {
  parseCampaignEvent,
  parseCaseEvent,
  parseJurorEvent,
  parseIdentityEvent,
} from "./parsers.js";

const POLL_INTERVAL_MS = parseInt(
  process.env.POLL_INTERVAL_MS ?? "5000",
  10,
);

interface ContractSpec {
  contractId: string;
  type: "campaign" | "case" | "juror" | "identity";
}

function scValToHex(val: xdr.ScVal): string {
  return val.toXDR().toString("hex");
}

function scValToString(val: xdr.ScVal): string | undefined {
  try {
    if (val.switch() === xdr.ScValType.scvBytes()) {
      return val.bytes().toString();
    }
  } catch {
    // fall through
  }
  return undefined;
}

function scValToNumber(val: xdr.ScVal): number | undefined {
  try {
    if (val.switch() === xdr.ScValType.scvU32()) {
      return val.u32();
    }
    if (val.switch() === xdr.ScValType.scvI32()) {
      return val.i32();
    }
    if (val.switch() === xdr.ScValType.scvU64()) {
      return Number(val.u64());
    }
    if (val.switch() === xdr.ScValType.scvI64()) {
      return Number(val.i64());
    }
    if (val.switch() === xdr.ScValType.scvBytes()) {
      const str = val.bytes().toString();
      const n = Number(str);
      if (!Number.isNaN(n)) return n;
    }
  } catch {
    // fall through
  }
  return undefined;
}

export class EventIndexer {
  private readonly logger = createLogger("indexer");
  private readonly rpcClient: rpc.Server;
  private readonly contracts: ContractSpec[];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private lastCursor = 0;

  constructor(rpcClient: rpc.Server, contracts: ContractSpec[]) {
    this.rpcClient = rpcClient;
    this.contracts = contracts;
  }

  async start(): Promise<void> {
    const cursor = await indexerCursorRepo.getCursor();
    this.lastCursor = cursor.lastLedgerSeq;
    this.running = true;
    this.logger.info(
      { lastCursor: this.lastCursor, contracts: this.contracts.length },
      "Indexer started",
    );
    this.poll();
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.logger.info("Indexer stopped");
  }

  private poll(): void {
    if (!this.running) return;

    this.timer = setTimeout(async () => {
      try {
        await this.fetchAndProcess();
      } catch (err) {
        this.logger.error({ err }, "Poll cycle failed");
      } finally {
        this.poll();
      }
    }, POLL_INTERVAL_MS);
  }

  private async fetchAndProcess(): Promise<void> {
    const filters: rpc.Api.EventFilter[] = this.contracts.map((c) => ({
      type: "contract",
      contractIds: [c.contractId],
    }));

    const response = await this.rpcClient.getEvents({
      filters,
      startLedger: this.lastCursor + 1,
      limit: 200,
    });

    if (!response.events || response.events.length === 0) {
      return;
    }

    this.logger.info({ count: response.events.length }, "Fetched events");

    const maxLedger = response.events.reduce<number>(
      (max, ev) => Math.max(max, ev.ledger),
      this.lastCursor,
    );

    await this.processEvents(response.events);

    await indexerCursorRepo.updateCursor(maxLedger);
    this.lastCursor = maxLedger;
  }

  async processEvents(events: rpc.Api.EventResponse[]): Promise<void> {
    for (const event of events) {
      try {
        const contractId = typeof event.contractId === "string"
          ? event.contractId
          : event.contractId?.toString() ?? "";

        const contractSpec = this.contracts.find(
          (c) => c.contractId === contractId,
        );
        if (!contractSpec) {
          this.logger.warn({ contractId }, "Unknown contract, skipping");
          continue;
        }

        const topicXdr = event.topic.map(scValToHex).join(",");
        const dataHex = scValToHex(event.value);

        const topicStrings = event.topic.map(
          (t) => scValToString(t) ?? scValToHex(t),
        );
        const eventName = event.type === "contract"
          ? topicStrings[0] ?? "unknown"
          : event.type;

        await eventRepo.upsertEvent({
          contractId,
          contractType: contractSpec.type,
          eventName,
          ledgerSeq: event.ledger,
          ledgerCloseAt: new Date(event.ledgerClosedAt),
          txHash: event.txHash,
          topicXdr,
          dataXdr: dataHex,
        });

        const dataValue = event.value;

        switch (contractSpec.type) {
          case "campaign":
            await campaignService.processCampaignEvent({
              eventName,
              ...parseCampaignEvent(eventName, dataValue, topicStrings),
            });
            break;
          case "case":
            await caseService.processCaseEvent({
              eventName,
              ...parseCaseEvent(eventName, dataValue, topicStrings),
            });
            break;
          case "juror":
            await jurorService.processJurorEvent({
              eventName,
              ...parseJurorEvent(eventName, dataValue, topicStrings),
            });
            break;
          case "identity":
            await identityService.processIdentityEvent({
              eventName,
              ...parseIdentityEvent(eventName, dataValue, topicStrings),
            });
            break;
        }

        this.logger.debug(
          { eventName, contractType: contractSpec.type },
          "Processed event",
        );
      } catch (err) {
        this.logger.error(
          {
            err,
            txHash: event.txHash,
            contractId: event.contractId?.toString(),
          },
          "Failed to process event; remains unprocessed for retry",
        );
      }
    }
  }
}

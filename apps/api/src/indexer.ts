import { rpc, Contract, Address, nativeToScVal, scValToNative } from "@stellar/stellar-sdk";
import { db } from "./db";

const RPC_URL = "https://soroban-testnet.stellar.org";
const PLATFORM_CONTRACT_ID = process.env.PLATFORM_CONTRACT_ID || "CB3X25J5HTYZJT5YETSU7EJDL237L7DFBKPQNC3ZMKVNDR7RTZDD2BEV";
const ESCROW_CONTRACT_ID = process.env.ESCROW_CONTRACT_ID || "CC5YIIBETTIJ2DTYK5H5V4MIM574QH6KL3INPDTSFA5O43LRUVN6H3C3";

const server = new rpc.Server(RPC_URL);

let lastLedger = 0;

export async function startIndexer() {
  console.log("Starting event indexer...");
  console.log(`  Platform contract: ${PLATFORM_CONTRACT_ID}`);
  console.log(`  Escrow contract: ${ESCROW_CONTRACT_ID}`);

  if (!PLATFORM_CONTRACT_ID && !ESCROW_CONTRACT_ID) {
    console.log("No contract IDs configured, indexer disabled.");
    return;
  }

  // Initialize lastLedger from DB or start from latest
  const lastEvent = db
    .prepare("SELECT ledger FROM event_log ORDER BY ledger DESC LIMIT 1")
    .get() as any;

  if (lastEvent && lastEvent.ledger > 0) {
    lastLedger = lastEvent.ledger;
  } else {
    const latest = await server.getLatestLedger();
    lastLedger = latest.sequence - 1;
  }

  setInterval(pollEvents, 5000);
}

async function pollEvents() {
  try {
    const latestLedger = await server.getLatestLedger();
    const currentLedger = latestLedger.sequence;

    if (currentLedger <= lastLedger) return;

    const events = await server.getEvents({
      startLedger: lastLedger + 1,
      endLedger: currentLedger,
      filters: [
        { type: "contract", contractIds: [PLATFORM_CONTRACT_ID, ESCROW_CONTRACT_ID].filter(Boolean) },
      ],
    });

    for (const event of events.events) {
      await processEvent(event);
    }

    lastLedger = currentLedger;
  } catch (err) {
    console.error("Indexer poll error:", err);
  }
}

async function processEvent(event: any) {
  const txHash = event.transactionHash || "";
  const contractId = event.contractId || "";
  const topicXdr = event.topic?.[0];
  const eventType = topicXdr ? event.type || "unknown" : "unknown";

  // Check if already processed
  const existing = db
    .prepare("SELECT id FROM event_log WHERE tx_hash = ? AND contract = ?")
    .get(txHash, contractId);

  if (existing) return;

  try {
    const topics = event.topic || [];
    const topicStr = topics.length > 0 ? topics[0] : "";

    if (contractId === PLATFORM_CONTRACT_ID) {
      await processPlatformEvent(topicStr, event, txHash);
    } else if (contractId === ESCROW_CONTRACT_ID) {
      await processEscrowEvent(topicStr, event, txHash);
    }

    db.prepare(
      "INSERT INTO event_log (tx_hash, contract, event_type, data, ledger) VALUES (?, ?, ?, ?, ?)"
    ).run(txHash, contractId, eventType, JSON.stringify(event), event.ledger || 0);
  } catch (err) {
    console.error(`Failed to process event ${eventType}:`, err);
  }
}

async function processPlatformEvent(topic: string, event: any, txHash: string) {
  const data = event.value || event;

  if (topic.includes("APP_SUB")) {
    const [id, startup, name, askAmount] = data || [];
    if (id !== undefined) {
      db.prepare(
        "INSERT OR REPLACE INTO applications (id, startup, name, pitch, ask_amount, status) VALUES (?, ?, ?, '', ?, 'Submitted')"
      ).run(Number(id), startup || "", name || "", Number(askAmount) || 0);
    }
  }

  if (topic.includes("VOTE")) {
    const [appId, voter, approve, commentHash] = data || [];
    if (appId !== undefined) {
      db.prepare(
        "INSERT OR REPLACE INTO votes (app_id, voter, approve, comment_hash, timestamp) VALUES (?, ?, ?, ?, ?)"
      ).run(Number(appId), voter || "", approve ? 1 : 0, commentHash || "", Math.floor(Date.now() / 1000));

      // Update application status to UnderReview on first vote
      db.prepare(
        "UPDATE applications SET status = 'UnderReview' WHERE id = ? AND status = 'Submitted'"
      ).run(Number(appId));
    }
  }

  if (topic.includes("APP_APR")) {
    const [appId] = data || [];
    if (appId !== undefined) {
      db.prepare("UPDATE applications SET status = 'Approved' WHERE id = ?").run(Number(appId));
    }
  }

  if (topic.includes("APP_REJ")) {
    const [appId] = data || [];
    if (appId !== undefined) {
      db.prepare("UPDATE applications SET status = 'Rejected' WHERE id = ?").run(Number(appId));
    }
  }

  if (topic.includes("CAMP_CR")) {
    const [campaignId, appId, escrowAddr] = data || [];
    if (campaignId !== undefined) {
      const app = db.prepare("SELECT * FROM applications WHERE id = ?").get(Number(appId)) as any;
      db.prepare(
        "INSERT OR REPLACE INTO campaigns (id, app_id, escrow_addr, creator, goal, status) VALUES (?, ?, ?, ?, ?, 'Active')"
      ).run(
        Number(campaignId),
        Number(appId),
        escrowAddr || "",
        app?.startup || "",
        app?.ask_amount || 0
      );
    }
  }
}

async function processEscrowEvent(topic: string, event: any, txHash: string) {
  const data = event.value || event;

  if (topic.includes("DEPOSIT")) {
    const [investor, amount] = data || [];
    if (investor !== undefined) {
      // Find the campaign for this escrow contract
      const campaign = db
        .prepare("SELECT id FROM campaigns WHERE escrow_addr = ?")
        .get(event.contractId) as any;

      if (campaign) {
        const existing = db
          .prepare("SELECT amount FROM deposits WHERE campaign_id = ? AND investor = ?")
          .get(campaign.id, investor) as any;

        const newAmount = (existing?.amount || 0) + Number(amount);

        db.prepare(
          "INSERT OR REPLACE INTO deposits (campaign_id, investor, amount, updated_at) VALUES (?, ?, ?, ?)"
        ).run(campaign.id, investor, newAmount, Math.floor(Date.now() / 1000));

        db.prepare(
          "UPDATE campaigns SET total_deposited = total_deposited + ? WHERE id = ?"
        ).run(Number(amount), campaign.id);
      }
    }
  }

  if (topic.includes("MS_REL")) {
    const [index, msAmount] = data || [];
    if (index !== undefined) {
      const campaign = db
        .prepare("SELECT id FROM campaigns WHERE escrow_addr = ?")
        .get(event.contractId) as any;

      if (campaign) {
        db.prepare(
          "UPDATE campaign_milestones SET released = 1 WHERE campaign_id = ? AND idx = ?"
        ).run(campaign.id, Number(index));

        db.prepare(
          "UPDATE campaigns SET released_count = released_count + 1 WHERE id = ?"
        ).run(campaign.id);

        // Check if all milestones released
        const c = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(campaign.id) as any;
        if (c && c.released_count >= c.milestone_count) {
          db.prepare("UPDATE campaigns SET status = 'Completed' WHERE id = ?").run(campaign.id);
        }
      }
    }
  }

  if (topic.includes("REFUND")) {
    const [investor, amount] = data || [];
    if (investor !== undefined) {
      const campaign = db
        .prepare("SELECT id FROM campaigns WHERE escrow_addr = ?")
        .get(event.contractId) as any;

      if (campaign) {
        db.prepare(
          "UPDATE deposits SET amount = amount - ? WHERE campaign_id = ? AND investor = ? AND amount >= ?"
        ).run(Number(amount), campaign.id, investor, Number(amount));

        db.prepare(
          "UPDATE campaigns SET total_deposited = total_deposited - ? WHERE id = ?"
        ).run(Number(amount), campaign.id);
      }
    }
  }
}

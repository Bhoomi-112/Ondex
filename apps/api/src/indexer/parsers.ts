import { xdr } from "@stellar/stellar-sdk";

export interface CampaignEventData {
  campaignId: number;
  startup?: string;
  investor?: string;
  amount?: string;
  asset?: string;
  state?: string;
  approvedAt?: string;
  disputeDeadline?: string;
}

export interface CaseEventData {
  caseId: number;
  campaignId?: number;
  status?: string;
  forVotes?: number;
  againstVotes?: number;
  totalVotes?: number;
  resolvedAt?: string;
}

export interface JurorEventData {
  address: string;
  xlmStake?: string;
  platformStake?: string;
  isActive?: boolean;
  registeredAt?: string;
}

export interface IdentityEventData {
  identityId: string;
  commitmentHash?: string;
  isCommitted?: boolean;
  isRevealed?: boolean;
  linkedCaseId?: number;
  backendRef?: string;
  revealedAt?: string;
}

function scValToString(val: xdr.ScVal): string | undefined {
  try {
    if (val.switch() === xdr.ScValType.scvBytes()) {
      return val.bytes().toString();
    }
    if (val.switch() === xdr.ScValType.scvString()) {
      return val.str().toString();
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
  } catch {
    // fall through
  }
  return undefined;
}

function scValToBool(val: xdr.ScVal): boolean | undefined {
  try {
    if (val.switch() === xdr.ScValType.scvBool()) {
      return val.b();
    }
  } catch {
    // fall through
  }
  return undefined;
}

function extractArgs(
  dataVal: xdr.ScVal,
  topicStrings: string[],
): Record<string, unknown> {
  const map: Record<string, unknown> = {};

  if (dataVal.switch() === xdr.ScValType.scvVec()) {
    const items = dataVal.vec();
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item) {
          map[`arg${i}`] = scValToString(item) ?? scValToNumber(item) ?? scValToBool(item);
        }
      }
    }
  } else if (dataVal.switch() === xdr.ScValType.scvMap()) {
    const entries = dataVal.map();
    if (entries) {
      for (const entry of entries) {
        const key = scValToString(entry.key());
        const val = entry.val();
        if (key) {
          map[key] = scValToString(val) ?? scValToNumber(val) ?? scValToBool(val);
        }
      }
    }
  } else {
    map.value = scValToString(dataVal) ?? scValToNumber(dataVal) ?? scValToBool(dataVal);
  }

  if (topicStrings.length > 0) {
    map._eventName = topicStrings[0];
  }

  return map;
}

function str(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function num(val: unknown): number | undefined {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function bool(val: unknown): boolean | undefined {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true";
  return undefined;
}

export function parseCampaignEvent(
  _eventName: string,
  dataVal: xdr.ScVal,
  topicStrings: string[],
): CampaignEventData {
  const data = extractArgs(dataVal, topicStrings);
  return {
    campaignId: num(data.campaignId) ?? num(data.campaign_id) ?? 0,
    startup: str(data.startup) ?? str(data.startup_address),
    investor: str(data.investor) ?? str(data.investor_address),
    amount: str(data.amount),
    asset: str(data.asset),
    state: str(data.state),
    approvedAt: str(data.approvedAt) ?? str(data.approved_at),
    disputeDeadline:
      str(data.disputeDeadline) ?? str(data.dispute_deadline),
  };
}

export function parseCaseEvent(
  _eventName: string,
  dataVal: xdr.ScVal,
  topicStrings: string[],
): CaseEventData {
  const data = extractArgs(dataVal, topicStrings);
  return {
    caseId: num(data.caseId) ?? num(data.case_id) ?? 0,
    campaignId: num(data.campaignId) ?? num(data.campaign_id),
    status: str(data.status),
    forVotes: num(data.forVotes) ?? num(data.for_votes),
    againstVotes: num(data.againstVotes) ?? num(data.against_votes),
    totalVotes: num(data.totalVotes) ?? num(data.total_votes),
    resolvedAt: str(data.resolvedAt) ?? str(data.resolved_at),
  };
}

export function parseJurorEvent(
  _eventName: string,
  dataVal: xdr.ScVal,
  topicStrings: string[],
): JurorEventData {
  const data = extractArgs(dataVal, topicStrings);
  return {
    address: str(data.address) ?? "",
    xlmStake: str(data.xlmStake) ?? str(data.xlm_stake),
    platformStake:
      str(data.platformStake) ?? str(data.platform_stake),
    isActive: bool(data.isActive) ?? bool(data.is_active),
    registeredAt: str(data.registeredAt) ?? str(data.registered_at),
  };
}

export function parseIdentityEvent(
  _eventName: string,
  dataVal: xdr.ScVal,
  topicStrings: string[],
): IdentityEventData {
  const data = extractArgs(dataVal, topicStrings);
  return {
    identityId: str(data.identityId) ?? str(data.identity_id) ?? "",
    commitmentHash:
      str(data.commitmentHash) ?? str(data.commitment_hash),
    isCommitted: bool(data.isCommitted) ?? bool(data.is_committed),
    isRevealed: bool(data.isRevealed) ?? bool(data.is_revealed),
    linkedCaseId:
      num(data.linkedCaseId) ?? num(data.linked_case_id),
    backendRef: str(data.backendRef) ?? str(data.backend_ref),
    revealedAt: str(data.revealedAt) ?? str(data.revealed_at),
  };
}

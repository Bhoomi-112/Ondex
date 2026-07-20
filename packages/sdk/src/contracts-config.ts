import fs from "node:fs";
import path from "node:path";

export type ContractsConfig = {
  deployedAt?: string;
  network?: string;
  contracts: {
    escrow_contract?: string;
    jury_registry?: string;
    identity_registry?: string;
    platform_token?: string;
    xlm_token?: string;
  };
};

export function loadContractsJson(filePath?: string): ContractsConfig {
  const resolved =
    filePath ||
    process.env.CONTRACTS_JSON_PATH ||
    path.join(process.cwd(), "contracts.json");

  if (!fs.existsSync(resolved)) {
    throw new Error(
      `contracts.json not found at ${resolved}. Deploy contracts first or set CONTRACTS_JSON_PATH.`,
    );
  }

  const raw = JSON.parse(fs.readFileSync(resolved, "utf-8")) as ContractsConfig;
  if (!raw.contracts || typeof raw.contracts !== "object") {
    throw new Error(`Invalid contracts.json at ${resolved}`);
  }
  return raw;
}

export function requireContractId(
  config: ContractsConfig,
  key: keyof ContractsConfig["contracts"],
): string {
  const id = config.contracts[key];
  if (!id) {
    throw new Error(`Missing contract id for ${String(key)} in contracts.json`);
  }
  return id;
}

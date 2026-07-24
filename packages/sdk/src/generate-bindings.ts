import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../../..");

const CONTRACTS = [
  { name: "escrow-contract", crateName: "escrow_contract" },
  { name: "identity-registry", crateName: "identity_registry" },
];

const generatedDir = path.join(__dirname, "generated");
const webBindingsDir = path.join(ROOT, "apps/web/src/lib/bindings");

function hasStellarCli(): boolean {
  try {
    execSync("stellar --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function writeStub(contractName: string): void {
  const dir = path.join(generatedDir, contractName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.ts"),
    `export class Client {\n  static from(_options: unknown) {\n    return new Client();\n  }\n}\n`,
  );
}

function copyGenerated(srcIndex: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcIndex, path.join(destDir, "index.ts"));
  fs.writeFileSync(
    path.join(destDir, "client.ts"),
    `export { Client } from "./index";\nexport type { Client as ClientType } from "./index";\n`,
  );
  fs.writeFileSync(
    path.join(destDir, "types.ts"),
    `export type * from "./index";\n`,
  );
}

function generateForContract(
  contract: { name: string; crateName: string },
  useCli: boolean,
): void {
  const wasmPath = path.join(
    ROOT,
    "contracts/target/wasm32v1-none/release",
    `${contract.crateName}.wasm`,
  );

  if (!useCli || !fs.existsSync(wasmPath)) {
    console.warn(`Stub: ${contract.name} (wasm or CLI missing)`);
    writeStub(contract.name);
    return;
  }

  const tmpDir = path.join(ROOT, "packages/sdk/.bindings-tmp", contract.name);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    execSync(
      `stellar contract bindings typescript --wasm "${wasmPath}" --output-dir "${tmpDir}" --overwrite`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    );

    const srcIndex = path.join(tmpDir, "src", "index.ts");
    if (!fs.existsSync(srcIndex)) {
      throw new Error(`No src/index.ts for ${contract.name}`);
    }

    const destDir = path.join(generatedDir, contract.name);
    copyGenerated(srcIndex, destDir);

    const webName =
      contract.crateName === "escrow_contract"
        ? "escrow"
        : "identity";
    copyGenerated(srcIndex, path.join(webBindingsDir, webName));

    console.log(`Generated: ${contract.name}`);
  } catch (err) {
    console.error(`Failed ${contract.name}:`, err);
    writeStub(contract.name);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const useCli = hasStellarCli();
if (!useCli) {
  console.warn("stellar CLI not found — writing stubs");
}

for (const contract of CONTRACTS) {
  generateForContract(contract, useCli);
}

console.log("SDK + web bindings generated.");
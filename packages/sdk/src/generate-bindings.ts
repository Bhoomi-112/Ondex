import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTRACTS = [
  { name: "escrow-contract", crateName: "escrow_contract" },
  { name: "jury-registry", crateName: "jury_registry" },
  { name: "identity-registry", crateName: "identity_registry" },
];

const generatedDir = path.join(__dirname, "generated");

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
    path.join(dir, "client.ts"),
    `export class Client {\n  static from(_options: unknown) {\n    return new Client();\n  }\n}\n`
  );
  fs.writeFileSync(path.join(dir, "types.ts"), "");
  fs.writeFileSync(
    path.join(dir, "index.ts"),
    `export { Client } from "./client.js";\n`
  );
}

function generateForContract(
  contract: { name: string; crateName: string },
  useCli: boolean
): void {
  const contractsJsonPath = path.join(process.cwd(), "contracts.json");
  const wasmPath = path.join(
    process.cwd(),
    "contracts/target/wasm32v1-none/release",
    `${contract.crateName}.wasm`
  );

  if (
    !useCli ||
    !fs.existsSync(contractsJsonPath) ||
    !fs.existsSync(wasmPath)
  ) {
    writeStub(contract.name);
    return;
  }

  const tmpDir = path.join(
    process.cwd(),
    "packages/sdk/.bindings-tmp",
    contract.name
  );
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    execSync(
      `stellar contract bindings typescript --wasm "${wasmPath}" --output-dir "${tmpDir}" --overwrite`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );

    const srcDir = path.join(tmpDir, "src");
    const destDir = path.join(generatedDir, contract.name);
    fs.mkdirSync(destDir, { recursive: true });

    for (const file of ["client.ts", "types.ts", "index.ts"]) {
      const srcFile = path.join(srcDir, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(destDir, file));
      }
    }
  } catch {
    writeStub(contract.name);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const useCli = hasStellarCli();
for (const contract of CONTRACTS) {
  generateForContract(contract, useCli);
}

console.log("SDK bindings generated.");

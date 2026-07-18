import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "..", "ondex.db");

export const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY,
    startup TEXT NOT NULL,
    name TEXT NOT NULL,
    pitch TEXT NOT NULL,
    ask_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Submitted',
    mask_name INTEGER NOT NULL DEFAULT 0,
    mask_address INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id INTEGER NOT NULL,
    idx INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (app_id) REFERENCES applications(id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id INTEGER NOT NULL,
    voter TEXT NOT NULL,
    approve INTEGER NOT NULL,
    comment_hash TEXT NOT NULL DEFAULT '',
    timestamp INTEGER NOT NULL,
    UNIQUE(app_id, voter),
    FOREIGN KEY (app_id) REFERENCES applications(id)
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY,
    app_id INTEGER NOT NULL,
    escrow_addr TEXT NOT NULL,
    creator TEXT NOT NULL,
    goal INTEGER NOT NULL,
    total_deposited INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    milestone_count INTEGER NOT NULL DEFAULT 0,
    released_count INTEGER NOT NULL DEFAULT 0,
    deadline INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (app_id) REFERENCES applications(id)
  );

  CREATE TABLE IF NOT EXISTS campaign_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    idx INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    released INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
  );

  CREATE TABLE IF NOT EXISTS deposits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    investor TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    UNIQUE(campaign_id, investor),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
  );

  CREATE TABLE IF NOT EXISTS event_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tx_hash TEXT NOT NULL,
    contract TEXT NOT NULL,
    event_type TEXT NOT NULL,
    data TEXT NOT NULL,
    ledger INTEGER NOT NULL,
    processed_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

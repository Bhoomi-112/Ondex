import express from "express";
<<<<<<< HEAD

const app = express();
const port = process.env.PORT ?? 3001;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
=======
import cors from "cors";
import { db } from "./db";
import { router } from "./routes";
import { startIndexer } from "./indexer";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Ondex API running on http://localhost:${PORT}`);
  startIndexer().catch((err) => {
    console.error("Failed to start indexer:", err);
  });
});

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
>>>>>>> b2133f6 (Initial frontend setup)
});

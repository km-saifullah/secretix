import express from "express";
import { getRedis } from "./cache/redis.js";
import { loadSecrets } from "./config/loadSecrets.js";
import { connectDb } from "./db/connectDb.js";

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  res.json({ ok: true, service: "api", time: new Date().toISOString() });
});

app.get("/ping", async (req, res) => {
  const r = getRedis();
  const key = "ping_count";
  const count = await r.incr(key);
  res.json({ message: "pong", count });
});

async function start() {
  await loadSecrets();
  await connectDb();
  connectRedis();

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`API running on port ${port}`));
}

start().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});

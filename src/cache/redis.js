import Redis from "ioredis";

let redis;

export function connectRedis() {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is missing");

  redis = new Redis(url);

  redis.on("connect", () => console.log("redis connected....!"));
  redis.on("error", (e) => console.error("Redis error:", e.message));

  return redis;
}

export function getRedis() {
  if (!redis) throw new Error("Redis not initialized");
  return redis;
}

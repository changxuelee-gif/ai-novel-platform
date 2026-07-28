import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

const globalForRedis = globalThis as unknown as {
  redis: RedisClient | undefined;
};

let redisClient: RedisClient | undefined;

export function getRedis(): RedisClient {
  if (!redisClient) {
    const url = process.env.REDIS_URL || "";
    const isTls = url.startsWith("rediss://");

    redisClient =
      globalForRedis.redis ??
      createClient({
        url,
        socket: isTls ? { tls: true, rejectUnauthorized: false } : undefined,
      });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    if (process.env.NODE_ENV !== "production") {
      globalForRedis.redis = redisClient;
    }
  }

  if (!redisClient.isOpen) {
    redisClient.connect().catch((err) => {
      console.error("Redis connect error:", err);
    });
  }

  return redisClient;
}

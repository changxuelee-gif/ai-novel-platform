import { createClient, type RedisClientType } from "redis";

type RedisClient = RedisClientType;

const globalForRedis = globalThis as unknown as {
  redis: RedisClient | undefined;
  redisAvailable: boolean | undefined;
};

let redisClient: RedisClient | undefined;
let redisAvailable = globalForRedis.redisAvailable ?? true;

function createFallbackClient(): RedisClient {
  const handler = {
    get() {
      return async () => undefined;
    },
  };
  return new Proxy({} as RedisClient, handler);
}

export function getRedis(): RedisClient {
  if (!redisClient) {
    const url = process.env.REDIS_URL || "";

    if (!url) {
      console.warn("[Redis] REDIS_URL not configured, using fallback client");
      redisAvailable = false;
      redisClient = createFallbackClient();
      return redisClient;
    }

    const isTls = url.startsWith("rediss://");

    redisClient =
      globalForRedis.redis ??
      createClient({
        url,
        socket: isTls ? { tls: true, rejectUnauthorized: false } : undefined,
      });

    redisClient.on("error", (err) => {
      console.error("[Redis] Client Error:", err.message);
      redisAvailable = false;
    });

    redisClient.on("connect", () => {
      redisAvailable = true;
    });

    redisClient.on("end", () => {
      redisAvailable = false;
    });

    if (process.env.NODE_ENV !== "production") {
      globalForRedis.redis = redisClient;
      globalForRedis.redisAvailable = redisAvailable;
    }
  }

  if (redisAvailable && redisClient && !redisClient.isOpen) {
    redisClient.connect().catch((err) => {
      console.warn("[Redis] Connect failed, using fallback:", err.message);
      redisAvailable = false;
    });
  }

  return redisAvailable && redisClient ? redisClient : createFallbackClient();
}

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

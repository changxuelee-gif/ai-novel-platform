import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis: any;
};

function createRedisClient() {
  const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false,
    },
  });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  if (!client.isOpen) {
    client.connect().catch(console.error);
  }

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

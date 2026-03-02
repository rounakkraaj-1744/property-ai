import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  reconnectOnError: (err) => {
    logger.warn(err, "Redis reconnecting...");
    return true;
  },
});

redis.on("connect", () => logger.info("Connected to Redis"));
redis.on("error", (err) => logger.error(err, "Redis connection error"));

export async function disconnectRedis() {
  await redis.quit();
}
import { createClient } from "redis";
import { logger } from "./logger";

const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT || "6379";

const redisUrl =
    process.env.REDIS_URL ||
    (redisPassword
        ? `redis://:${encodeURIComponent(redisPassword)}@${redisHost}:${redisPort}`
        : `redis://${redisHost}:${redisPort}`);

const redisClient = createClient({ url: redisUrl });

redisClient.on("connect", () => {
    logger.info("🔌 Redis connecting...");
});

redisClient.on("ready", () => {
    logger.info("✅ Redis ready");
});

redisClient.on("error", (err) => {
    logger.error("❌ Redis Client Error:", err?.message || err);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
            logger.info("✅ Redis connected successfully");
        } catch (err) {
            logger.error("❌ Failed to connect to Redis:", (err instanceof Error ? err.message : String(err)) || err);
        }
    }
};

export default redisClient;


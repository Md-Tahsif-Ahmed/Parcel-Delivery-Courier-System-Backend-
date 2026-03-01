"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = require("./logger");
const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT || "6379";
const redisUrl = process.env.REDIS_URL ||
    (redisPassword
        ? `redis://:${encodeURIComponent(redisPassword)}@${redisHost}:${redisPort}`
        : `redis://${redisHost}:${redisPort}`);
const redisClient = (0, redis_1.createClient)({ url: redisUrl });
redisClient.on("connect", () => {
    logger_1.logger.info("🔌 Redis connecting...");
});
redisClient.on("ready", () => {
    logger_1.logger.info("✅ Redis ready");
});
redisClient.on("error", (err) => {
    logger_1.logger.error("❌ Redis Client Error:", (err === null || err === void 0 ? void 0 : err.message) || err);
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisClient.isOpen) {
        try {
            yield redisClient.connect();
            logger_1.logger.info("✅ Redis connected successfully");
        }
        catch (err) {
            logger_1.logger.error("❌ Failed to connect to Redis:", (err instanceof Error ? err.message : String(err)) || err);
        }
    }
});
exports.connectRedis = connectRedis;
exports.default = redisClient;

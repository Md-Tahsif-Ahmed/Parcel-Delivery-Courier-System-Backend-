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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardCache = void 0;
const redisClient_1 = __importDefault(require("../../shared/redisClient"));
const logger_1 = require("../../shared/logger");
const dashboardCache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const year = req.query.year
        ? Number(req.query.year)
        : new Date().getFullYear();
    const cacheKey = `dashboard:overview:${year}`;
    // If Redis is not connected, skip cache gracefully
    if (!redisClient_1.default.isOpen) {
        return next();
    }
    let cachedData = null;
    try {
        cachedData = yield redisClient_1.default.get(cacheKey);
    }
    catch (err) {
        logger_1.logger.error("Redis get error in dashboardCache:", err);
        // On Redis errors, skip cache and continue to controller
        return next();
    }
    if (cachedData) {
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Dashboard data retrieved successfully (cache)",
            data: JSON.parse(cachedData),
        });
    }
    // cache miss → controller run হবে
    res.locals.cacheKey = cacheKey;
    next();
});
exports.dashboardCache = dashboardCache;

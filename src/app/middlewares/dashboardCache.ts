import { Request, Response, NextFunction } from "express";
import redisClient from "../../shared/redisClient";
import { logger } from "../../shared/logger";
 

export const dashboardCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const year = req.query.year
    ? Number(req.query.year)
    : new Date().getFullYear();

  const cacheKey = `dashboard:overview:${year}`;

  // If Redis is not connected, skip cache gracefully
  if (!redisClient.isOpen) {
    return next();
  }

  let cachedData: string | null = null;
  try {
    cachedData = await redisClient.get(cacheKey);
  } catch (err) {
    logger.error("Redis get error in dashboardCache:", err);
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
};

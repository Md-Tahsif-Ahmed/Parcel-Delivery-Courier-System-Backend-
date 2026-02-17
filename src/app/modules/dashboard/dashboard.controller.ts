import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DashboardService } from "./dashboard.service";
 

// const getDashboard = catchAsync(async (req: Request, res: Response) => {
//   const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

//   const result = await DashboardService.getDashboardData(year);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Dashboard data retrieved successfully",
//     data: result,
//   });
// });


const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const year = req.query.year
    ? Number(req.query.year)
    : new Date().getFullYear();

  const result = await DashboardService.getDashboardData(year);

  // 🔥 Redis cache set (5 minutes)
  if (res.locals.cacheKey) {
    const redisClient = (await import("../../../shared/redisClient")).default;
    await redisClient.setEx(
      res.locals.cacheKey,
      300,
      JSON.stringify(result)
    );
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard data retrieved successfully",
    data: result,
  });
});
export const DashboardController = {
  getDashboard,
};
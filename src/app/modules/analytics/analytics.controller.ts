import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getAnalytics =catchAsync(async(req ,res)=>{
    const result = await AnalyticsServices.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: result,
    });
});

const getDriverDetails =catchAsync(async(req ,res)=>{
    const driverId = req.params.driverId;
    const result = await AnalyticsServices.getDriverDetailsService(driverId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Driver details fetched successfully",
        data: result,
    });
});

const getAllDriversDetails =catchAsync(async(req ,res)=>{
    const result = await AnalyticsServices.getAllDriversDetailsService(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Driver details fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getCustomerDetails =catchAsync(async(req ,res)=>{
    const customerId = req.params.customerId;
    const result = await AnalyticsServices.getCustomerDetailsService(customerId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Customer details fetched successfully",
        data: result,
    });
});

const getAllCustomersDetails =catchAsync(async(req ,res)=>{
    const result = await AnalyticsServices.getAllCustomersDetailsService(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Customer details fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});



export const AnalyticsControllers={
    getAnalytics,
    getDriverDetails,
    getAllDriversDetails,
    getCustomerDetails,
    getAllCustomersDetails,
}
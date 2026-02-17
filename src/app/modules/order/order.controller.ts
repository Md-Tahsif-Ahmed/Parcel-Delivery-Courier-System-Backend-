import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrderService } from "./order.service";
import { Types } from "mongoose";

const reserveTicket = catchAsync(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      userId: new Types.ObjectId(req.user.id),
      
    };
  const result = await OrderService.reserveTicketToDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "reserve ticket successfully",
    data: result,
  });
});

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      userId: new Types.ObjectId(req.user.id),
      
    };
  const result = await OrderService.createOrderToDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.getOrderByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.updateOrderToDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order updated successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.deleteOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order deleted successfully",
    data: result,
  });
});

// My order list for ticket booking
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await OrderService.getMyOrdersFromDB(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "My orders retrieved successfully",
    data: result,
  });
});

// cencell order with refund
const cancelOrderController = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;

  const result = await OrderService.cancelOrder(orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order cancelled and refund processed",
    data: result,
  });
});


export const OrderController = {
  reserveTicket,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders,
  cancelOrderController,
};

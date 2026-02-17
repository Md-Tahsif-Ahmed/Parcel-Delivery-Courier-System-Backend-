import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EventService } from "./event.service";
 
const createEvent = catchAsync(async (req: Request, res: Response) => {
  const { ...eventData } = req.body;

  const result = await EventService.createEventToDB(eventData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Event created successfully",
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;

  const result = await EventService.updateEventToDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Event updated successfully",
    data: result,
  });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventService.getEventByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Event retrieved successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getAllEventsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Events retrieved successfully",
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventService.deleteEventFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Event deleted successfully",
    data: result,
  });
});

// Home Page Data Retrieval
const getHomePageData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await EventService.getHomePageData(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Home page data retrieved successfully",
      data: result,
    });
  }
);

export const EventController = {
    createEvent,
    updateEvent,
    getEventById,
    getAllEvents,
    deleteEvent,
    getHomePageData,
};

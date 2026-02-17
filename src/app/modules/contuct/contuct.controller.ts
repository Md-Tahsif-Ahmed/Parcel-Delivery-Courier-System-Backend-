import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ContactService } from "./contuct.service";

const createContact = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ContactService.createContactToDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Contact created successfully",
      data: result,
    });
  }
);

const getContact = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await ContactService.getContactFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Contact retrieved successfully",
      data: result,
    });
  }
);

const updateContact = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ContactService.updateContactInDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Contact updated successfully",
      data: result,
    });
  }
);

const deleteContact = catchAsync(
  async (_req: Request, res: Response) => {
    await ContactService.deleteContactFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Contact deleted successfully",
    });
  }
);

export const ContactController = {
  createContact,
  getContact,
  updateContact,
  deleteContact,
};

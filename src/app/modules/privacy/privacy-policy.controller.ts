import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IPrivacy } from "./privacy-policy.interface";
import { PrivacyService } from "./privacy-policy.service";

const createPrivacy = catchAsync(async (req: Request, res: Response) => {
  const payload: IPrivacy = req.body;
  const result = await PrivacyService.upsertPrivacyToDB(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Privacy Created Successfully",
    data: result,
  });
});

// const updatePrivacy = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const payload: Partial<IPrivacy> = req.body;
//   const result = await PrivacyService.updatePrivacyToDB(id, payload);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Privacy Updated Successfully",
//     data: result,
//   });
// });

const getPrivacy = catchAsync(async (_req: Request, res: Response) => {
  const result = await PrivacyService.getPrivacyFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Privacy Retrieved Successfully",
    data: result,
  });
});

const deletePrivacy = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await PrivacyService.deletePrivacyToDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Privacy Deleted Successfully",
    data: null,
  });
});

export const PrivacyController = {
  createPrivacy,
  // updatePrivacy,
  getPrivacy,
  deletePrivacy,
};

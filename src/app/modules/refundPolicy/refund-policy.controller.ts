import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IRefundPolicy } from "./refund-policy.interface";
import { RefundPolicyService } from "./refund-policy.service";

const createRefundPolicy = catchAsync(async (req: Request, res: Response) => {
  const payload: IRefundPolicy = req.body;
  const result = await RefundPolicyService.upsertRefundPolicyToDB(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Refund Policy Created Successfully",
    data: result,
  });
});

// const updateRefundPolicy = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const payload: Partial<IRefundPolicy> = req.body;
//   const result = await RefundPolicyService.updateRefundPolicyToDB(id, payload);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Refund Policy Updated Successfully",
//     data: result,
//   });
// });

const getRefundPolicy = catchAsync(async (_req: Request, res: Response) => {
  const result = await RefundPolicyService.getRefundPolicyFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Refund Policy Retrieved Successfully",
    data: result,
  });
});

const deleteRefundPolicy = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await RefundPolicyService.deleteRefundPolicyToDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Refund Policy Deleted Successfully",
    data: null,
  });
});

export const RefundPolicyController = {
  createRefundPolicy,
  // updateRefundPolicy,
  getRefundPolicy,
  deleteRefundPolicy,
};

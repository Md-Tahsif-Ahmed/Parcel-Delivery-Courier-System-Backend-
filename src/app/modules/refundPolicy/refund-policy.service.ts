import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { IRefundPolicy } from "./refund-policy.interface";
import { RefundPolicy } from "./refund-policy.model";

const upsertRefundPolicyToDB = async (
  payload: IRefundPolicy,
): Promise<IRefundPolicy> => {
  const existingRefundPolicy = await RefundPolicy.findOne();

  if (existingRefundPolicy) {
    const updatedRefundPolicy = await RefundPolicy.findByIdAndUpdate(
      existingRefundPolicy._id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedRefundPolicy) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to update Refund Policy",
      );
    }

    return updatedRefundPolicy;
  }

  const createdRefundPolicy = await RefundPolicy.create(payload);

  if (!createdRefundPolicy) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create Refund Policy",
    );
  }

  return createdRefundPolicy;
};

const getRefundPolicyFromDB = async (): Promise<IRefundPolicy | null> => {
  return await RefundPolicy.findOne().lean();
};

const deleteRefundPolicyToDB = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }
  const deleted = await RefundPolicy.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Refund Policy not found");
  }
};

export const RefundPolicyService = {
  upsertRefundPolicyToDB,
  getRefundPolicyFromDB,
  deleteRefundPolicyToDB,
};

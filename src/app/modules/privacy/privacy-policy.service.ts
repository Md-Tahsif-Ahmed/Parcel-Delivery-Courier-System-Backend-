import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { IPrivacy } from "./privacy-policy.interface";
import { Privacy } from "./privacy-policy.model";

const upsertPrivacyToDB = async (payload: IPrivacy): Promise<IPrivacy> => {
  const existingPrivacy = await Privacy.findOne();

  if (existingPrivacy) {
    const updatedPrivacy = await Privacy.findByIdAndUpdate(
      existingPrivacy._id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPrivacy) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to update Privacy Policy",
      );
    }

    return updatedPrivacy;
  }


  const createdPrivacy = await Privacy.create(payload);

  if (!createdPrivacy) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create Privacy Policy",
    );
  }

  return createdPrivacy;
};

const getPrivacyFromDB = async (): Promise<IPrivacy | null> => {
  return await Privacy.findOne().lean();
};

const deletePrivacyToDB = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }
  const deleted = await Privacy.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Privacy not found");
  }
};

export const PrivacyService = {
  upsertPrivacyToDB,
  getPrivacyFromDB,
  deletePrivacyToDB,
};

import { AboutUs } from "./about-us.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { IAboutUs } from "./about-us.interface";

// const createAboutUsToDB = async (payload: IAboutUs): Promise<IAboutUs> => {
//     const aboutUs = await AboutUs.create(payload);
//     if (!aboutUs) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create About Us');
//     }

//     return aboutUs;
// };

// const updateAboutUsToDB = async (id: string, payload: Partial<IAboutUs>): Promise<IAboutUs> => {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID');
//     }

//     const updatedAboutUs = await AboutUs.findByIdAndUpdate(id, payload, { new: true });
//     if (!updatedAboutUs) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update About Us');
//     }

//     return updatedAboutUs;
// };

const upsertAboutUsToDB = async (payload: IAboutUs): Promise<IAboutUs> => {
  const existingAboutUs = await AboutUs.findOne();

  if (existingAboutUs) {
    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      existingAboutUs._id,
      payload,
      { new: true, runValidators: true },
    );

    if (!updatedAboutUs) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update About Us");
    }

    return updatedAboutUs;
  }

  const createdAboutUs = await AboutUs.create(payload);

  if (!createdAboutUs) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create About Us");
  }

  return createdAboutUs;
};

const getAboutUsFromDB = async () => {
  const result = await AboutUs.findOne().lean();
  return result;
};

const deleteAboutUsToDB = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  await AboutUs.findByIdAndDelete(id);
};

export const AboutUsService = {
  upsertAboutUsToDB,
  getAboutUsFromDB,
  deleteAboutUsToDB,
};

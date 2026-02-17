import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ArtistService } from "./artist.service";

const createArtist = catchAsync(async (req: Request, res: Response) => {
  const artistData = req.body;

  const result = await ArtistService.createArtistToDB(artistData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Artist created successfully",
    data: result,
  });
});

const updateArtist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;

  const result = await ArtistService.updateArtistToDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Artist updated successfully",
    data: result,
  });
});

const getAllArtists = catchAsync(async (req: Request, res: Response) => {
  const result = await ArtistService.getAllArtistsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Artists retrieved successfully",
    data: result,
  });
});

const getArtistById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ArtistService.getArtistByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Artist retrieved successfully",
    data: result,
  });
});

const deleteArtist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ArtistService.deleteArtistFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Artist deleted successfully",
    data: result,
  });
});
export const ArtistController = {
  createArtist,
  updateArtist,
  getAllArtists,
  getArtistById,
  deleteArtist,
};

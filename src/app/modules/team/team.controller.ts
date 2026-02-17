import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TeamService } from "./team.service";

const createTeam = catchAsync(async (req: Request, res: Response) => {
  const TeamData = req.body;

  const result = await TeamService.createTeamToDB(TeamData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Team created successfully",
    data: result,
  });
});

const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;

  const result = await TeamService.updateTeamToDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Team updated successfully",
    data: result,
  });
});

const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.getAllTeamsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Teams retrieved successfully",
    data: result,
  });
});

const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TeamService.getTeamByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Team retrieved successfully",
    data: result,
  });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TeamService.deleteTeamFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Team deleted successfully",
    data: result,
  });
});
export const TeamController = {
  createTeam,
  updateTeam,
  getAllTeams,
  getTeamById,
  deleteTeam,
};

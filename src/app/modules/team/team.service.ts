import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../builder/queryBuilder";
import { ITeam, ITeamWithEvents } from "./team.interface"; 

import { EventModel } from "../event/event.model";
import { TeamModel } from "./team.model";
 

 

const createTeamToDB = async (
  payload: any
): Promise<ITeam> => {
  const isExistTeam = await TeamModel.findOne({
    name: { $regex: new RegExp(`^${payload.name}$`, "i") },
  });

  if (isExistTeam) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Team with this name already exists"
    );
  }

  const Team = await TeamModel.create({
    ...payload,
    isVerified: payload.isVerified ?? false,
  });

  if (!Team) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Team");
  }

  return Team;
};

const updateTeamToDB = async (
  id: string,
  payload: Partial<ITeam>
): Promise<Partial<ITeam | null>> => {
  const isExistTeam = await TeamModel.findById(id);

  if (!isExistTeam) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Team not found");
  }

  if (payload.name) {
    const duplicateTeam = await TeamModel.findOne({
      name: { $regex: new RegExp(`^${payload.name}$`, "i") },
      _id: { $ne: id },
    });

    if (duplicateTeam) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Another Team with this name already exists"
      );
    }
  }

  const updatedTeam = await TeamModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedTeam) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update Team");
  }

  return updatedTeam;
};

const getAllTeamsFromDB = async (query: any) => {
  const baseQuery = TeamModel.find(
    {},
    {
      name: 1,
      image: 1,
      genre: 1,
      isVerified: 1,
    }
  ).sort({ name: 1 });

  const queryBuilder = new QueryBuilder<ITeam>(baseQuery, query)
    .search(["name", "genre"])
    .sort()
    .fields()
    .paginate();

  const Teams = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    data: Teams,
    meta,
  };
};

const getTeamByIdFromDB = async (id: string): Promise<ITeamWithEvents> => {
    const Team = await TeamModel.findById(id).lean(); // lean() for performance, plain JS object

    if (!Team) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    const now = new Date();


  const events = await EventModel.find({
    $or: [{ teamA: Team._id }, { teamB: Team._id }],
    eventDate: { $gte: now },
  })
    .select(
      'title category eventDate startTime city venueName fullAddress ticketSold ticketCategories'
    )
    .sort({ eventDate: 1 })
    .lean();

    // Team + events  
    const TeamWithEvents: ITeamWithEvents = {
      ...Team,
      events,
    };

    return TeamWithEvents;
  };

const deleteTeamFromDB = async (id: string): Promise<ITeam> => {
  const Team = await TeamModel.findById(id);

  if (!Team) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Team not found");
  }

  const result = await TeamModel.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete Team");
  }

  return result;
};
export const TeamService = {
  createTeamToDB,
  updateTeamToDB,
  getAllTeamsFromDB,
  getTeamByIdFromDB,
  deleteTeamFromDB,
};

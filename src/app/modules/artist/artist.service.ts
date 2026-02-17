import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../builder/queryBuilder";
import { IArtist, IArtistWithEvents } from "./artist.interface";
import { ArtistModel } from "./artist.model";
import { EventModel } from "../event/event.model";

 

const createArtistToDB = async (
  payload: any
): Promise<IArtist> => {
  const isExistArtist = await ArtistModel.findOne({
    name: { $regex: new RegExp(`^${payload.name}$`, "i") },
  });

  if (isExistArtist) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Artist with this name already exists"
    );
  }

  const artist = await ArtistModel.create({
    ...payload,
    isVerified: payload.isVerified ?? false,
  });

  if (!artist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create artist");
  }

  return artist;
};

const updateArtistToDB = async (
  id: string,
  payload: Partial<IArtist>
): Promise<Partial<IArtist | null>> => {
  const isExistArtist = await ArtistModel.findById(id);

  if (!isExistArtist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
  }

  if (payload.name) {
    const duplicateArtist = await ArtistModel.findOne({
      name: { $regex: new RegExp(`^${payload.name}$`, "i") },
      _id: { $ne: id },
    });

    if (duplicateArtist) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Another artist with this name already exists"
      );
    }
  }

  const updatedArtist = await ArtistModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedArtist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update artist");
  }

  return updatedArtist;
};

const getAllArtistsFromDB = async (query: any) => {
  const baseQuery = ArtistModel.find(
    {},
    {
      name: 1,
      image: 1,
      genre: 1,
      isVerified: 1,
      instagram: 1,
      twitter: 1,
      facebook: 1,
      website: 1,
    }
  ).sort({ name: 1 });

  const queryBuilder = new QueryBuilder<IArtist>(baseQuery, query)
    .search(["name", "genre"])
    .sort()
    .fields()
    .paginate();

  const artists = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    data: artists,
    meta,
  };
};

 const getArtistByIdFromDB = async (id: string): Promise<IArtist> => {
    const artist = await ArtistModel.findById(id).lean(); // lean() for performance, plain JS object

    if (!artist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Artist not found');
    }

    const now = new Date();


  const events = await EventModel.find({
    artistId: artist._id,
    eventDate: { $gte: now },
  })
    .select(
      'title category eventDate startTime city venueName fullAddress ticketSold ticketCategories'
    )
    .sort({ eventDate: 1 })
    .lean();

    // Artist + events  
    const artistWithEvents: IArtistWithEvents = {
      ...artist,
      events,
    };

    return artistWithEvents;
  };

const deleteArtistFromDB = async (id: string): Promise<IArtist> => {
  const artist = await ArtistModel.findById(id);

  if (!artist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
  }

  const result = await ArtistModel.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete artist");
  }

  return result;
};
export const ArtistService = {
  createArtistToDB,
  updateArtistToDB,
  getAllArtistsFromDB,

  getArtistByIdFromDB,

  deleteArtistFromDB,
};

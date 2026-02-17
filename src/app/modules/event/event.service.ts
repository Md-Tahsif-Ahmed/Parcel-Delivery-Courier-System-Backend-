import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../builder/queryBuilder";
import { CreateEventInput, EventCategory, IEvent } from "./event.interface";
import { EventModel } from "./event.model";
import { ArtistModel } from "../artist/artist.model";
import { TeamModel } from "../team/team.model";

const createEventToDB = async (payload: CreateEventInput): Promise<IEvent> => {
  // Validate artistId or teamId based on the category
  if (payload.category === EventCategory.CONCERT) {
    // For concert, ensure artistId is provided and valid
    if (!payload.artistId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Artist ID is required for concerts");
    }

    // Validate if the artist exists
    const artist = await ArtistModel.findById(payload.artistId);
    if (!artist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
    }

    // do not mutate payload; we'll control DB fields below
  } else if (payload.category === EventCategory.SPORTS) {
    // For sports, ensure teamId is provided and valid
    if (!payload.teamA || !payload.teamB) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Team A and Team B are required for sports events");
    }

    // Ensure the teamId is valid (you can add a check to validate if the team exists, if necessary)
    // const team = await TeamModel.findById(payload.teamId);
    // if (!team) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, "Team not found");
    // }

    // do not mutate payload; we'll control DB fields below
  }

  // Prepare DB IDs without assigning null to payload (avoid Type 'null' is not assignable to type 'string')
  const artistIdForDB = payload.artistId ? new Types.ObjectId(payload.artistId) : undefined;
  const teamAForDB = payload.teamA ? new Types.ObjectId(payload.teamA) : undefined;
  const teamBForDB = payload.teamB ? new Types.ObjectId(payload.teamB) : undefined;

  // Create event data to insert into the DB
  const eventData: Partial<IEvent> = {
    ...payload,
    artistId: artistIdForDB,
    teamA: teamAForDB,
    teamB: teamBForDB,
  };

  // Create the event in the database
  const event = await EventModel.create(eventData);

  if (!event) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create event");
  }

  return event;
};


const updateEventToDB = async (
  eventId: string,
  payload: Partial<IEvent>
): Promise<IEvent> => {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  /**
   * 🔐 Determine final category
   * payload.category না থাকলে existing category ধরবে
   */
  const finalCategory = payload.category ?? event.category;

  /**
   * ===============================
   * ❌ INVALID FIELD GUARDS
   * ===============================
   */

  if (finalCategory === EventCategory.SPORTS && payload.artistId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Artist is not allowed for sports events'
    );
  }

  if (
    finalCategory === EventCategory.CONCERT &&
    (payload.teamA || payload.teamB)
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Teams are not allowed for concert events'
    );
  }

  /**
   * ===============================
   * ✅ REFERENCE VALIDATION
   * ===============================
   */

  const updateData: Partial<IEvent> = { ...payload };

  if (payload.artistId) {
    const artist = await ArtistModel.findById(payload.artistId);
    if (!artist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Artist not found');
    }
    updateData.artistId = new Types.ObjectId(payload.artistId);
  }

  if (payload.teamA) {
    const teamA = await TeamModel.findById(payload.teamA);
    if (!teamA) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Team A not found');
    }
    updateData.teamA = new Types.ObjectId(payload.teamA);
  }

  if (payload.teamB) {
    const teamB = await TeamModel.findById(payload.teamB);
    if (!teamB) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Team B not found');
    }
    updateData.teamB = new Types.ObjectId(payload.teamB);
  }

  /**
   * ===============================
   * 🔄 CATEGORY SWITCH CLEANUP
   * ===============================
   */

  if (payload.category === EventCategory.SPORTS) {
    updateData.artistId = undefined;
  }

  if (payload.category === EventCategory.CONCERT) {
    updateData.teamA = undefined;
    updateData.teamB = undefined;
  }

  /**
   * ===============================
   * 🚀 UPDATE EVENT
   * ===============================
   */

  const updatedEvent = await EventModel.findByIdAndUpdate(
    eventId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate('artistId teamA teamB');

  if (!updatedEvent) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to update event'
    );
  }

  return updatedEvent;
};



const getEventByIdFromDB = async (id: string): Promise<IEvent> => {
  const event = await EventModel.findById(id).populate("artistId teamA teamB");

  if (!event) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Event not found");
  }

  return event;
};

const getAllEventsFromDB = async (query: any) => {
  const now = new Date();

  const baseQuery = EventModel.find().populate("artistId teamA teamB");

  // status filter
  if (query.type === "upcoming") {
    query.eventDate = { $gt: now };
  }

  if (query.type === "completed") {
    query.eventDate = { $lt: now };
  }

  if (query.type === "cancelled") {
    query.status = "CANCELLED";
  }

  const queryBuilder = new QueryBuilder<IEvent>(baseQuery, query)
    .searchByTitle()
    .filter()
    .sort()
    .paginate()
    .fields();

  const events = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    data: events,
    meta,
  };
};


const deleteEventFromDB = async (id: string): Promise<IEvent> => {
  const event = await EventModel.findById(id);

  if (!event) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Event not found");
  }

  const result = await EventModel.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete event");
  }

  return result;
};

 

 
// const getHomePageData = async () => {
//   const [topEvents, featuredConcerts, featuredSports] = await Promise.all([
//     EventModel.find({ })
//       .sort({ ticketSold: -1 })
//       .limit(6)
//       .populate("artistId", "name genre "),

//     EventModel.find({
//       category: "Concert",
      
//     })
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .populate("artistId", "name image"),

//     EventModel.find({
//       category: "Sports",
  
//     })
//       .sort({ createdAt: -1 })
//       .limit(6),
//   ]);

//   return {
//     topEvents,
//     featuredConcerts,
//     featuredSports,
//   };
// };

const getHomePageData = async (query: Record<string, any>) => {
  const baseQuery = EventModel.find();

  const qb = new QueryBuilder(baseQuery, query).searchByTitle();

  const filter = qb.modelQuery.getFilter();

  const [
    topEvents,
    featuredConcerts,
    featuredSports,
    totalEvents,
    ticketAgg,
  ] = await Promise.all([
    EventModel.find(filter)
      .sort({ ticketSold: -1 })
      .limit(6)
      .populate("artistId teamA teamB", "name genre image")
      .select("title thumbnail ticketSold eventDate city venueName"),

    EventModel.find({
      ...filter,
      category: "Concert",
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("artistId", "name image")
      .select("title thumbnail ticketSold eventDate city venueName"),

    EventModel.find({
      ...filter,
      category: "Sports",
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("teamA teamB", "name genre image")
      .select("title thumbnail ticketSold eventDate city venueName"),

    EventModel.countDocuments(),

    EventModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$ticketSold" },
        },
      },
    ]),
  ]);

  return {
    stats: {
      totalEvents,
      totalTicketsSold: ticketAgg[0]?.total || 0,
    },
    topEvents,
    featuredConcerts,
    featuredSports,
  };
};

 

export const EventService = {
  createEventToDB,
  updateEventToDB,
  getEventByIdFromDB,
  getAllEventsFromDB,
  deleteEventFromDB,
  getHomePageData,
};

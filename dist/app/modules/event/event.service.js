"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const mongoose_1 = require("mongoose");
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const event_interface_1 = require("./event.interface");
const event_model_1 = require("./event.model");
const artist_model_1 = require("../artist/artist.model");
const team_model_1 = require("../team/team.model");
const createEventToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate artistId or teamId based on the category
    if (payload.category === event_interface_1.EventCategory.CONCERT) {
        // For concert, ensure artistId is provided and valid
        if (!payload.artistId) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Artist ID is required for concerts");
        }
        // Validate if the artist exists
        const artist = yield artist_model_1.ArtistModel.findById(payload.artistId);
        if (!artist) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Artist not found");
        }
        // do not mutate payload; we'll control DB fields below
    }
    else if (payload.category === event_interface_1.EventCategory.SPORTS) {
        // For sports, ensure teamId is provided and valid
        if (!payload.teamA || !payload.teamB) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Team A and Team B are required for sports events");
        }
        // Ensure the teamId is valid (you can add a check to validate if the team exists, if necessary)
        // const team = await TeamModel.findById(payload.teamId);
        // if (!team) {
        //   throw new ApiError(StatusCodes.NOT_FOUND, "Team not found");
        // }
        // do not mutate payload; we'll control DB fields below
    }
    // Prepare DB IDs without assigning null to payload (avoid Type 'null' is not assignable to type 'string')
    const artistIdForDB = payload.artistId ? new mongoose_1.Types.ObjectId(payload.artistId) : undefined;
    const teamAForDB = payload.teamA ? new mongoose_1.Types.ObjectId(payload.teamA) : undefined;
    const teamBForDB = payload.teamB ? new mongoose_1.Types.ObjectId(payload.teamB) : undefined;
    // Create event data to insert into the DB
    const eventData = Object.assign(Object.assign({}, payload), { artistId: artistIdForDB, teamA: teamAForDB, teamB: teamBForDB });
    // Create the event in the database
    const event = yield event_model_1.EventModel.create(eventData);
    if (!event) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create event");
    }
    return event;
});
const updateEventToDB = (eventId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const event = yield event_model_1.EventModel.findById(eventId);
    if (!event) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Event not found');
    }
    /**
     * 🔐 Determine final category
     * payload.category না থাকলে existing category ধরবে
     */
    const finalCategory = (_a = payload.category) !== null && _a !== void 0 ? _a : event.category;
    /**
     * ===============================
     * ❌ INVALID FIELD GUARDS
     * ===============================
     */
    if (finalCategory === event_interface_1.EventCategory.SPORTS && payload.artistId) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Artist is not allowed for sports events');
    }
    if (finalCategory === event_interface_1.EventCategory.CONCERT &&
        (payload.teamA || payload.teamB)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Teams are not allowed for concert events');
    }
    /**
     * ===============================
     * ✅ REFERENCE VALIDATION
     * ===============================
     */
    const updateData = Object.assign({}, payload);
    if (payload.artistId) {
        const artist = yield artist_model_1.ArtistModel.findById(payload.artistId);
        if (!artist) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Artist not found');
        }
        updateData.artistId = new mongoose_1.Types.ObjectId(payload.artistId);
    }
    if (payload.teamA) {
        const teamA = yield team_model_1.TeamModel.findById(payload.teamA);
        if (!teamA) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Team A not found');
        }
        updateData.teamA = new mongoose_1.Types.ObjectId(payload.teamA);
    }
    if (payload.teamB) {
        const teamB = yield team_model_1.TeamModel.findById(payload.teamB);
        if (!teamB) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Team B not found');
        }
        updateData.teamB = new mongoose_1.Types.ObjectId(payload.teamB);
    }
    /**
     * ===============================
     * 🔄 CATEGORY SWITCH CLEANUP
     * ===============================
     */
    if (payload.category === event_interface_1.EventCategory.SPORTS) {
        updateData.artistId = undefined;
    }
    if (payload.category === event_interface_1.EventCategory.CONCERT) {
        updateData.teamA = undefined;
        updateData.teamB = undefined;
    }
    /**
     * ===============================
     * 🚀 UPDATE EVENT
     * ===============================
     */
    const updatedEvent = yield event_model_1.EventModel.findByIdAndUpdate(eventId, updateData, {
        new: true,
        runValidators: true,
    }).populate('artistId teamA teamB');
    if (!updatedEvent) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update event');
    }
    return updatedEvent;
});
const getEventByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.EventModel.findById(id).populate("artistId teamA teamB");
    if (!event) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
    }
    return event;
});
const getAllEventsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const baseQuery = event_model_1.EventModel.find().populate("artistId teamA teamB");
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
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        .searchByTitle()
        .filter()
        .sort()
        .paginate()
        .fields();
    const events = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return {
        data: events,
        meta,
    };
});
const deleteEventFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.EventModel.findById(id);
    if (!event) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
    }
    const result = yield event_model_1.EventModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to delete event");
    }
    return result;
});
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
const getHomePageData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const baseQuery = event_model_1.EventModel.find();
    const qb = new queryBuilder_1.default(baseQuery, query).searchByTitle();
    const filter = qb.modelQuery.getFilter();
    const [topEvents, featuredConcerts, featuredSports, totalEvents, ticketAgg,] = yield Promise.all([
        event_model_1.EventModel.find(filter)
            .sort({ ticketSold: -1 })
            .limit(6)
            .populate("artistId teamA teamB", "name genre image")
            .select("title thumbnail ticketSold eventDate city venueName"),
        event_model_1.EventModel.find(Object.assign(Object.assign({}, filter), { category: "Concert" }))
            .sort({ createdAt: -1 })
            .limit(6)
            .populate("artistId", "name image")
            .select("title thumbnail ticketSold eventDate city venueName"),
        event_model_1.EventModel.find(Object.assign(Object.assign({}, filter), { category: "Sports" }))
            .sort({ createdAt: -1 })
            .limit(6)
            .populate("teamA teamB", "name genre image")
            .select("title thumbnail ticketSold eventDate city venueName"),
        event_model_1.EventModel.countDocuments(),
        event_model_1.EventModel.aggregate([
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
            totalTicketsSold: ((_a = ticketAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        },
        topEvents,
        featuredConcerts,
        featuredSports,
    };
});
exports.EventService = {
    createEventToDB,
    updateEventToDB,
    getEventByIdFromDB,
    getAllEventsFromDB,
    deleteEventFromDB,
    getHomePageData,
};

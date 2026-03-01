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
exports.TeamService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const event_model_1 = require("../event/event.model");
const team_model_1 = require("./team.model");
const createTeamToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isExistTeam = yield team_model_1.TeamModel.findOne({
        name: { $regex: new RegExp(`^${payload.name}$`, "i") },
    });
    if (isExistTeam) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Team with this name already exists");
    }
    const Team = yield team_model_1.TeamModel.create(Object.assign(Object.assign({}, payload), { isVerified: (_a = payload.isVerified) !== null && _a !== void 0 ? _a : false }));
    if (!Team) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Team");
    }
    return Team;
});
const updateTeamToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTeam = yield team_model_1.TeamModel.findById(id);
    if (!isExistTeam) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Team not found");
    }
    if (payload.name) {
        const duplicateTeam = yield team_model_1.TeamModel.findOne({
            name: { $regex: new RegExp(`^${payload.name}$`, "i") },
            _id: { $ne: id },
        });
        if (duplicateTeam) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Another Team with this name already exists");
        }
    }
    const updatedTeam = yield team_model_1.TeamModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedTeam) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update Team");
    }
    return updatedTeam;
});
const getAllTeamsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = team_model_1.TeamModel.find({}, {
        name: 1,
        image: 1,
        genre: 1,
        isVerified: 1,
    }).sort({ name: 1 });
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        .search(["name", "genre"])
        .sort()
        .fields()
        .paginate();
    const Teams = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return {
        data: Teams,
        meta,
    };
});
const getTeamByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const Team = yield team_model_1.TeamModel.findById(id).lean(); // lean() for performance, plain JS object
    if (!Team) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Team not found');
    }
    const now = new Date();
    const events = yield event_model_1.EventModel.find({
        $or: [{ teamA: Team._id }, { teamB: Team._id }],
        eventDate: { $gte: now },
    })
        .select('title category eventDate startTime city venueName fullAddress ticketSold ticketCategories')
        .sort({ eventDate: 1 })
        .lean();
    // Team + events  
    const TeamWithEvents = Object.assign(Object.assign({}, Team), { events });
    return TeamWithEvents;
});
const deleteTeamFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const Team = yield team_model_1.TeamModel.findById(id);
    if (!Team) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Team not found");
    }
    const result = yield team_model_1.TeamModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to delete Team");
    }
    return result;
});
exports.TeamService = {
    createTeamToDB,
    updateTeamToDB,
    getAllTeamsFromDB,
    getTeamByIdFromDB,
    deleteTeamFromDB,
};

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
exports.ArtistService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const artist_model_1 = require("./artist.model");
const event_model_1 = require("../event/event.model");
const createArtistToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isExistArtist = yield artist_model_1.ArtistModel.findOne({
        name: { $regex: new RegExp(`^${payload.name}$`, "i") },
    });
    if (isExistArtist) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Artist with this name already exists");
    }
    const artist = yield artist_model_1.ArtistModel.create(Object.assign(Object.assign({}, payload), { isVerified: (_a = payload.isVerified) !== null && _a !== void 0 ? _a : false }));
    if (!artist) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create artist");
    }
    return artist;
});
const updateArtistToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistArtist = yield artist_model_1.ArtistModel.findById(id);
    if (!isExistArtist) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Artist not found");
    }
    if (payload.name) {
        const duplicateArtist = yield artist_model_1.ArtistModel.findOne({
            name: { $regex: new RegExp(`^${payload.name}$`, "i") },
            _id: { $ne: id },
        });
        if (duplicateArtist) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Another artist with this name already exists");
        }
    }
    const updatedArtist = yield artist_model_1.ArtistModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedArtist) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update artist");
    }
    return updatedArtist;
});
const getAllArtistsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = artist_model_1.ArtistModel.find({}, {
        name: 1,
        image: 1,
        genre: 1,
        isVerified: 1,
        instagram: 1,
        twitter: 1,
        facebook: 1,
        website: 1,
    }).sort({ name: 1 });
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        .search(["name", "genre"])
        .sort()
        .fields()
        .paginate();
    const artists = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return {
        data: artists,
        meta,
    };
});
const getArtistByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const artist = yield artist_model_1.ArtistModel.findById(id).lean(); // lean() for performance, plain JS object
    if (!artist) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Artist not found');
    }
    const now = new Date();
    const events = yield event_model_1.EventModel.find({
        artistId: artist._id,
        eventDate: { $gte: now },
    })
        .select('title category eventDate startTime city venueName fullAddress ticketSold ticketCategories')
        .sort({ eventDate: 1 })
        .lean();
    // Artist + events  
    const artistWithEvents = Object.assign(Object.assign({}, artist), { events });
    return artistWithEvents;
});
const deleteArtistFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const artist = yield artist_model_1.ArtistModel.findById(id);
    if (!artist) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Artist not found");
    }
    const result = yield artist_model_1.ArtistModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to delete artist");
    }
    return result;
});
exports.ArtistService = {
    createArtistToDB,
    updateArtistToDB,
    getAllArtistsFromDB,
    getArtistByIdFromDB,
    deleteArtistFromDB,
};

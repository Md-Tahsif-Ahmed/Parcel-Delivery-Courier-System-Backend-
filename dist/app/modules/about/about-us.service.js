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
exports.AboutUsService = void 0;
const about_us_model_1 = require("./about-us.model");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
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
const upsertAboutUsToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAboutUs = yield about_us_model_1.AboutUs.findOne();
    if (existingAboutUs) {
        const updatedAboutUs = yield about_us_model_1.AboutUs.findByIdAndUpdate(existingAboutUs._id, payload, { new: true, runValidators: true });
        if (!updatedAboutUs) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update About Us");
        }
        return updatedAboutUs;
    }
    const createdAboutUs = yield about_us_model_1.AboutUs.create(payload);
    if (!createdAboutUs) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create About Us");
    }
    return createdAboutUs;
});
const getAboutUsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield about_us_model_1.AboutUs.findOne().lean();
    return result;
});
const deleteAboutUsToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    yield about_us_model_1.AboutUs.findByIdAndDelete(id);
});
exports.AboutUsService = {
    upsertAboutUsToDB,
    getAboutUsFromDB,
    deleteAboutUsToDB,
};

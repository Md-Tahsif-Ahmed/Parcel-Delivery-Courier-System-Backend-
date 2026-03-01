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
exports.TermsAndConditionsService = void 0;
const terms_and_conditions_model_1 = require("./terms-and-conditions.model");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
// const createTermsAndConditionsToDB = async (
//   payload: ITermsAndConditions
// ): Promise<ITermsAndConditions> => {
//   const terms = await TermsAndConditions.create(payload);
//   if (!terms) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Terms and Conditions');
//   }
//   return terms;
// };
// const updateTermsAndConditionsToDB = async (
//   id: string,
//   payload: Partial<ITermsAndConditions>  
// ): Promise<ITermsAndConditions> => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID');
//   }
//   const updatedTerms = await TermsAndConditions.findByIdAndUpdate(
//     id,
//     payload,
//     {
//       new: true,
//       runValidators: true,               
//     }
//   );
//   if (!updatedTerms) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and Conditions not found');  
//   }
//   return updatedTerms;
// };
// const getTermsAndConditionsFromDB = async (): Promise<ITermsAndConditions[]> => {
//   return await TermsAndConditions.find({}).lean();  
// };
const upsertTermsAndConditionsToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTerms = yield terms_and_conditions_model_1.TermsAndConditions.findOne();
    if (existingTerms) {
        const updatedTerms = yield terms_and_conditions_model_1.TermsAndConditions.findByIdAndUpdate(existingTerms._id, payload, {
            new: true,
            runValidators: true,
        });
        if (!updatedTerms) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update Terms and Conditions");
        }
        return updatedTerms;
    }
    const createdTerms = yield terms_and_conditions_model_1.TermsAndConditions.create(payload);
    if (!createdTerms) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Terms and Conditions");
    }
    return createdTerms;
});
const getTermsAndConditionsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield terms_and_conditions_model_1.TermsAndConditions.findOne().lean();
});
const deleteTermsAndConditionsToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    const deleted = yield terms_and_conditions_model_1.TermsAndConditions.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Terms and Conditions not found');
    }
});
exports.TermsAndConditionsService = {
    // createTermsAndConditionsToDB,
    // updateTermsAndConditionsToDB,
    upsertTermsAndConditionsToDB,
    getTermsAndConditionsFromDB,
    deleteTermsAndConditionsToDB
};

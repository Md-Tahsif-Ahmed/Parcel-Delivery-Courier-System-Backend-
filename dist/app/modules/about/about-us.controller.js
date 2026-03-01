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
exports.AboutUsController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const about_us_service_1 = require("./about-us.service");
const createAboutUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield about_us_service_1.AboutUsService.upsertAboutUsToDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'About Us Created Successfully',
        data: result,
    });
}));
// const updateAboutUs = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const payload: Partial<IAboutUs> = req.body;         
//   const result = await AboutUsService.updateAboutUsToDB(id, payload);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'About Us Updated Successfully',
//     data: result,
//   });
// });
const getAboutUs = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield about_us_service_1.AboutUsService.getAboutUsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'About Us Retrieved Successfully',
        data: result,
    });
}));
const deleteAboutUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield about_us_service_1.AboutUsService.deleteAboutUsToDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'About Us Deleted Successfully',
        data: null,
    });
}));
exports.AboutUsController = {
    createAboutUs,
    // updateAboutUs,
    getAboutUs,
    deleteAboutUs,
};

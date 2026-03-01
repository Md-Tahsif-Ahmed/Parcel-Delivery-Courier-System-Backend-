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
exports.PrivacyController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const privacy_policy_service_1 = require("./privacy-policy.service");
const createPrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield privacy_policy_service_1.PrivacyService.upsertPrivacyToDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Privacy Created Successfully",
        data: result,
    });
}));
// const updatePrivacy = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const payload: Partial<IPrivacy> = req.body;
//   const result = await PrivacyService.updatePrivacyToDB(id, payload);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Privacy Updated Successfully",
//     data: result,
//   });
// });
const getPrivacy = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield privacy_policy_service_1.PrivacyService.getPrivacyFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Privacy Retrieved Successfully",
        data: result,
    });
}));
const deletePrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield privacy_policy_service_1.PrivacyService.deletePrivacyToDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Privacy Deleted Successfully",
        data: null,
    });
}));
exports.PrivacyController = {
    createPrivacy,
    // updatePrivacy,
    getPrivacy,
    deletePrivacy,
};

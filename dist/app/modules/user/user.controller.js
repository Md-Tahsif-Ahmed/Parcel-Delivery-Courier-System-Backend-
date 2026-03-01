"use strict";
// import bcrypt from "bcrypt";
// import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { UserService } from "./user.service";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import { JwtPayload } from "jsonwebtoken";
// import config from "../../../config";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
// // register user
// const createUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { ...userData } = req.body;
//     console.log(userData, "payload");
//     const result = await UserService.createUserToDB(userData);
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message:
//         "Your account has been successfully created. Verify Your Email By OTP. Check your email",
//       data: result,
//     });
//   }
// );
// // register admin
// const createAdmin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { ...userData } = req.body;
//     const result = await UserService.createAdminToDB(userData);
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "Admin created successfully",
//       data: result,
//     });
//   }
// );
// const getAdmin = catchAsync(async (req: Request, res: Response) => {
//   const result = await UserService.getAdminFromDB(req.query);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Admin retrieved Successfully",
//     data: result,
//   });
// });
// const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.params.id;
//   const result = await UserService.deleteAdminFromDB(payload);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Admin Deleted Successfully",
//     data: result,
//   });
// });
// // retrieved user profile
// const getUserProfile = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user;
//   const result = await UserService.getUserProfileFromDB(user as JwtPayload);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Profile data retrieved successfully",
//     data: result,
//   });
// });
// //update profile
// const updateProfile = catchAsync(async (req, res) => {
//   const user: any = req.user;
//   // if ("role" in req.body) {
//   //   delete req.body.role;
//   // }
//   // If password is provided
//   if (req.body.password) {
//     req.body.password = await bcrypt.hash(
//       req.body.password,
//       Number(config.bcrypt_salt_rounds)
//     );
//   }
//   const result = await UserService.updateProfileToDB(user, req.body);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Profile updated successfully",
//     data: result,
//   });
// });
// const getAllUsers = catchAsync(async (req, res) => {
//   const result = await UserService.getAllUsersFromDB(req.query);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Successfully retrieved are users data",
//     data: result,
//   });
// });
// const getUserById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await UserService.getUserByIdFromDB(id);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Successfully retrieve user by ID",
//     data: result,
//   });
// });
// const deleteUserById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await UserService.deleteUserByIdFromD(id);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "User is deleted successfully",
//     data: result,
//   });
// });
// const deleteProfile = catchAsync(async (req, res) => {
//   const { id: userId } = req.user;
//   const result = await UserService.deleteProfileFromDB(userId);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Successfully delete your account",
//     data: result,
//   });
// });
// export const UserController = {
//   createUser,
//   createAdmin,
//   getAdmin,
//   deleteAdmin,
//   getUserProfile,
//   updateProfile,
//   getAllUsers,
//   getUserById,
//   deleteUserById,
//   deleteProfile,
// };
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const config_1 = __importDefault(require("../../../config"));
// register user
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = __rest(req.body, []);
    console.log(userData, "payload");
    const result = yield user_service_1.UserService.createUserToDB(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Your account has been successfully created. Verify Your Email By OTP. Check your email",
        data: result,
    });
}));
// register admin
const createAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = __rest(req.body, []);
    const result = yield user_service_1.UserService.createAdminToDB(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Admin created successfully",
        data: result,
    });
}));
const getAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAdminFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin retrieved Successfully",
        data: result,
    });
}));
const deleteAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.params.id;
    const result = yield user_service_1.UserService.deleteAdminFromDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin Deleted Successfully",
        data: result,
    });
}));
// retrieved user profile
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.UserService.getUserProfileFromDB(user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Profile data retrieved successfully",
        data: result,
    });
}));
//update profile
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // if ("role" in req.body) {
    //   delete req.body.role;
    // }
    // If password is provided
    if (req.body.password) {
        req.body.password = yield bcrypt_1.default.hash(req.body.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const result = yield user_service_1.UserService.updateProfileToDB(user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Profile updated successfully",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Successfully retrieved are users data",
        data: result,
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.getUserByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Successfully retrieve user by ID",
        data: result,
    });
}));
const deleteUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.deleteUserByIdFromD(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User is deleted successfully",
        data: result,
    });
}));
const deleteProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const result = yield user_service_1.UserService.deleteProfileFromDB(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Successfully delete your account",
        data: result,
    });
}));
// ============================ Driver Registration ============================
const getMyDriverRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getMyDriverRegistrationFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver registration retrieved successfully",
        data: result,
    });
}));
const updateDriverBasicInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateDriverBasicInfoToDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver basic info updated successfully",
        data: result,
    });
}));
const updateDriverVehicleInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateDriverVehicleInfoToDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver vehicle info updated successfully",
        data: result,
    });
}));
const updateDriverRequiredDocs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateDriverRequiredDocsToDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver required documents updated successfully",
        data: result,
    });
}));
const updateDriverReferral = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateDriverReferralToDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver referral updated successfully",
        data: result,
    });
}));
const submitDriverApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.submitDriverApplicationToDB(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Application sent",
        data: result,
    });
}));
exports.UserController = {
    createUser,
    createAdmin,
    getAdmin,
    deleteAdmin,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    deleteUserById,
    deleteProfile,
    // driver registration
    getMyDriverRegistration,
    updateDriverBasicInfo,
    updateDriverVehicleInfo,
    updateDriverRequiredDocs,
    updateDriverReferral,
    submitDriverApplication,
};

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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const googleLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    const result = yield auth_service_1.AuthService.googleLogin(idToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Google login successful",
        data: result,
    });
}));
// const verifyEmail = catchAsync(async (req: Request, res: Response) => {
//   const verifyData = req.body;
//   const result = await AuthService.verifyEmailToDB(verifyData);
//   const { message, token, user } = result as any;
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message,
//     data: { token, user },
//   });
// });
const verifyEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const result = yield auth_service_1.AuthService.verifyEmailToDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: result.message,
        data: {
            token: (_a = result.token) !== null && _a !== void 0 ? _a : null,
            resetToken: (_b = result.resetToken) !== null && _b !== void 0 ? _b : null,
            user: (_c = result.user) !== null && _c !== void 0 ? _c : null,
        },
    });
}));
const verifyPhone = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.verifyPhoneToDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Phone verified successfully",
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield auth_service_1.AuthService.loginUserFromDB(loginData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User login successfully",
        data: result,
    });
}));
const forgetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const result = yield auth_service_1.AuthService.forgetPasswordToDB(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Please check your email, we send a OTP!",
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.resettoken;
    const resetData = __rest(req.body, []);
    const result = yield auth_service_1.AuthService.resetPasswordToDB(token, resetData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Your password has been successfully reset.",
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const passwordData = __rest(req.body, []);
    yield auth_service_1.AuthService.changePasswordToDB(user, passwordData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Password changed successfully",
    });
}));
const newAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const result = yield auth_service_1.AuthService.newAccessTokenToUser(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Generate Access Token successfully",
        data: result,
    });
}));
const resendVerification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.resendVerification(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Generate OTP and send successfully",
        data: result,
    });
}));
// delete user
// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthService.deleteUserFromDB(
//     req.user as JwtPayload,
//     req.body.password,
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Account Deleted successfully",
//     data: result,
//   });
// });
exports.AuthController = {
    googleLogin,
    verifyEmail,
    verifyPhone,
    loginUser,
    forgetPassword,
    resetPassword,
    changePassword,
    newAccessToken,
    resendVerification,
    // deleteUser,
};

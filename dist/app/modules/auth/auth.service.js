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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const resetToken_model_1 = require("../resetToken/resetToken.model");
const user_model_1 = require("../user/user.model");
const user_1 = require("../../../enums/user");
const google_auth_library_1 = require("google-auth-library");
const smsHelper_1 = require("../../../helpers/smsHelper");
const cryptoToken_1 = __importDefault(require("../../../util/cryptoToken"));
// google login 
const client = new google_auth_library_1.OAuth2Client(config_1.default.google.clientId);
const googleLogin = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    // 1 Verify Google token
    const ticket = yield client.verifyIdToken({
        idToken,
        // audience: config.google.clientId,
        audience: "196053531094-8jrlncksn61cot0oni87ctfekd8hn5k6.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
        throw new Error("Invalid Google token");
    }
    const { email, name, picture } = payload;
    //  Check user exists
    let user = yield user_model_1.User.findOne({ email });
    // If not exists → create user
    if (!user) {
        user = yield user_model_1.User.create({
            fullName: name,
            email,
            profileImage: picture,
            role: user_1.USER_ROLES.CUSTOMER,
            verified: true,
            agreedToTerms: true,
            password: undefined, // social login
        });
    }
    //  Generate JWT
    const token = jwtHelper_1.jwtHelper.createToken({
        id: user._id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    return {
        token,
        user,
    };
});
// login
// const loginUserFromDB = async (payload: ILoginData) => {
//   const { email, password } = payload;
//   const isExistUser = await User.findOne({ email }).select("+password");
//   if (!isExistUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
//   }
//   // check verified and status
//   if (!isExistUser.verified) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       "Please verify your account, then try to login again",
//     );
//   }
//   // check user status
//   // if (isExistUser.status === STATUS.INACTIVE) {
//   //   throw new ApiError(
//   //     StatusCodes.BAD_REQUEST,
//   //     "You don’t have permission to access this content. It looks like your account has been deactivated.",
//   //   );
//   // }
//   // check match password
//   if (
//     password &&
//     !(await User.isMatchPassword(password, isExistUser.password))
//   ) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Password is incorrect!");
//   }
//   // create token
//   const createToken = jwtHelper.createToken(
//     { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.jwt_expire_in as string,
//   );
//   const result = {
//     token: createToken,
//     user: isExistUser,
//   };
//   return result;
// };
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier, password } = payload;
    const user = yield user_model_1.User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    }).select("+password");
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!user.verified) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please verify your account first");
    }
    const isMatch = yield user_model_1.User.isMatchPassword(password, user.password);
    if (!isMatch) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password is incorrect");
    }
    const accessToken = jwtHelper_1.jwtHelper.createToken({
        id: user._id,
        role: user.role,
        email: user.email,
        phone: user.phone,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    return {
        token: accessToken,
        user,
    };
});
// forget password
// const forgetPasswordToDB = async (email: string) => {
//   const isExistUser = await User.isExistUserByEmail(email);
//   if (!isExistUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
//   }
//   // send mail
//   const otp = generateOTP();
//   const value = {
//     otp,
//     email: isExistUser.email,
//   };
//   const forgetPassword = emailTemplate.resetPassword(value);
//   emailHelper.sendEmail(forgetPassword);
//   // save to DB
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60000),
//   };
//   await User.findOneAndUpdate({ email }, { $set: { authentication } });
// };
// ==================twilio forget password system==========================
const forgetPasswordToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone, countryCode } = payload;
    if (!email && !phone) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Provide phone or email!");
    }
    let user;
    // ===============================
    //  1 ) PHONE FLOW (priority 1)
    // ===============================
    if (phone) {
        if (!countryCode) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "countryCode is required for phone");
        }
        user = yield user_model_1.User.findOne({ phone, countryCode });
        if (!user) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
        }
        // generate OTP
        const otp = (0, generateOTP_1.default)();
        // Twilio send
        yield smsHelper_1.twilioService.sendOTPWithVerify(phone, countryCode);
        // save OTP
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes
        };
        yield user_model_1.User.findOneAndUpdate({ phone, countryCode }, { $set: { authentication } });
        return { via: "phone", phone, countryCode };
    }
    // ===============================
    //  2 ) EMAIL FLOW (priority 2)
    // ===============================
    if (email) {
        const userByEmail = yield user_model_1.User.isExistUserByEmail(email);
        if (!userByEmail) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
        }
        // generate OTP
        const otp = (0, generateOTP_1.default)();
        // template
        const value = { otp, email: userByEmail.email };
        const forgetPassword = emailTemplate_1.emailTemplate.resetPassword(value);
        // send mail
        emailHelper_1.emailHelper.sendEmail(forgetPassword);
        // save in DB
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60 * 1000),
        };
        yield user_model_1.User.findOneAndUpdate({ email }, { $set: { authentication } }, { new: true });
        return { via: "email", email };
    }
});
// ======================= verify email start ========================
const verifyEmailToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, oneTimeCode } = payload;
    const user = yield user_model_1.User.findOne({ email }).select("+authentication");
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!oneTimeCode) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please provide OTP");
    }
    if (((_a = user.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== oneTimeCode) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wrong OTP");
    }
    if (new Date() > ((_b = user.authentication) === null || _b === void 0 ? void 0 : _b.expireAt)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP expired");
    }
    // 🔹 CASE 1: Email Verify
    if (!user.verified) {
        user.verified = true;
        user.authentication = {
            oneTimeCode: null,
            expireAt: null,
        };
        yield user.save();
        const token = jwtHelper_1.jwtHelper.createToken({
            id: user._id,
            email: user.email,
            role: user.role,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
        return {
            message: "Email verified successfully",
            token,
            user,
        };
    }
    // 🔹 CASE 2: Forgot Password
    const resetToken = (0, cryptoToken_1.default)();
    yield resetToken_model_1.ResetToken.create({
        user: user._id,
        token: resetToken,
        expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    user.authentication = {
        isResetPassword: true,
        oneTimeCode: null,
        expireAt: null,
    };
    yield user.save();
    return {
        message: "OTP verified. Use reset token to change password",
        resetToken,
    };
});
// ======================= verify email end ==========================
// ======================== verify phone by otp start ================
const verifyPhoneToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, code, countryCode } = payload;
    const user = yield user_model_1.User.findOne({ phone });
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
    }
    const isApproved = yield smsHelper_1.twilioService.verifyOTP(phone, code, countryCode);
    if (!isApproved) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
    }
    // 🔹 CASE 1: Phone Verify
    if (!user.verified) {
        user.verified = true;
        yield user.save();
        const token = jwtHelper_1.jwtHelper.createToken({
            id: user._id,
            role: user.role,
            email: user.email,
            phone: user.phone,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
        return {
            message: "Phone verified successfully",
            token,
            user,
        };
    }
    // 🔹 CASE 2: Forgot Password for phone users
    const resetToken = (0, cryptoToken_1.default)();
    yield resetToken_model_1.ResetToken.create({
        user: user._id,
        token: resetToken,
        expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });
    yield user.save();
    return {
        message: "OTP verified. Use reset token to change password",
        resetToken,
    };
});
// ======================== verify phone by otp end ==================
// reset password
const resetPasswordToDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPassword, confirmPassword } = payload;
    // isExist token
    const isExistToken = yield resetToken_model_1.ResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
    // user permission check
    const isExistUser = yield user_model_1.User.findById(isExistToken.user).select("+authentication");
    console.log("=======", isExistUser);
    if (!((_a = isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.isResetPassword)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    // validity check
    const isValid = yield resetToken_model_1.ResetToken.isExpireToken(token);
    if (!isValid) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Token expired, Please click again to the forget password");
    }
    // check password
    if (newPassword !== confirmPassword) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
        authentication: { isResetPassword: false },
    };
    yield user_model_1.User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
        new: true,
    });
});
const changePasswordToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = yield user_model_1.User.findById(user.id).select("+password");
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // current password match
    if (currentPassword &&
        !(yield user_model_1.User.isMatchPassword(currentPassword, isExistUser.password))) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password is incorrect");
    }
    // newPassword and current password
    if (currentPassword === newPassword) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please give different password from current password");
    }
    // new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
    }
    // hash password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
    };
    yield user_model_1.User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
});
const newAccessTokenToUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the token is provided
    if (!token) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Token is required!");
    }
    const verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwtRefreshSecret);
    const isExistUser = yield user_model_1.User.findById(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }
    // create token
    const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    return { accessToken };
});
// const resendVerificationEmailToDB = async (email: string) => {
//   const existingUser = await User.findOne({ email }).select(
//     "email firstName verified"
//   );
//   if (!existingUser) {
//     throw new ApiError(
//       StatusCodes.NOT_FOUND,
//       "User with this email does not exist!"
//     );
//   }
//   if (existingUser.verified) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       "User is already verified!"
//     );
//   }
//   const otp = generateOTP();
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60 * 1000),
//   };
//   await User.updateOne(
//     { _id: existingUser._id },
//     { $set: { authentication } }
//   );
//   const template = emailTemplate.createAccount({
//     name: existingUser.firstName,
//     email: existingUser.email,
//     otp,
//   });
//   await emailHelper.sendEmail({
//     to: existingUser.email,
//     subject: template.subject,
//     html: template.html,
//   });
//   return null;
// };
// const deleteUserFromDB = async (user: JwtPayload, password: string) => {
//   const isExistUser = await User.findById(user.id).select("+password");
//   if (!isExistUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
//   }
//   // check match password
//   if (
//     password &&
//     !(await User.isMatchPassword(password, isExistUser.password))
//   ) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Password is incorrect");
//   }
//   const updateUser = await User.findByIdAndDelete(user.id);
//   if (!updateUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
//   }
//   return;
// };
const resendVerification = (email, phone, countryCode) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (email) {
        user = yield user_model_1.User.findOne({ email }).select("email firstName phone countryCode verified");
    }
    else if (phone && countryCode) {
        user = yield user_model_1.User.findOne({ phone, countryCode }).select("email firstName phone countryCode verified");
    }
    else {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email or phone must be provided");
    }
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    if (user.verified) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is already verified!");
    }
    // If email exists, send email OTP
    if (user.email) {
        const otp = (0, generateOTP_1.default)();
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60 * 1000),
        };
        yield user_model_1.User.updateOne({ _id: user._id }, { $set: { authentication } });
        const template = emailTemplate_1.emailTemplate.createAccount({
            name: user.firstName,
            email: user.email,
            otp,
        });
        yield emailHelper_1.emailHelper.sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
        });
        return { method: "email", message: "OTP sent to email" };
    }
    // If phone exists, send SMS OTP
    if (user.phone && user.countryCode) {
        const result = yield smsHelper_1.twilioService.sendOTPWithVerify(user.phone, user.countryCode);
        return { method: "phone", message: "OTP sent to phone", twilioResult: result };
    }
    throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No valid verification method available for this user");
});
exports.AuthService = {
    googleLogin,
    verifyEmailToDB,
    verifyPhoneToDB,
    loginUserFromDB,
    forgetPasswordToDB,
    resetPasswordToDB,
    changePasswordToDB,
    newAccessTokenToUser,
    resendVerification,
    // deleteUserFromDB,
};

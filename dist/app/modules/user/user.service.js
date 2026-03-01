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
exports.UserService = void 0;
const user_1 = require("../../../enums/user");
const user_model_1 = require("./user.model");
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const emailTemplate_1 = require("../../../shared/emailTemplate");
const emailHelper_1 = require("../../../helpers/emailHelper");
const smsHelper_1 = require("../../../helpers/smsHelper");
// ---------------- Driver registration helpers ----------------
const assertDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    if (user.role !== user_1.USER_ROLES.DRIVER) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Only driver can access this resource");
    }
    return user;
});
const isBasicInfoComplete = (doc) => {
    var _a, _b, _c, _d;
    const dob = (_b = (_a = doc === null || doc === void 0 ? void 0 : doc.driverRegistration) === null || _a === void 0 ? void 0 : _a.basicInfo) === null || _b === void 0 ? void 0 : _b.dateOfBirth;
    const addr = (_d = (_c = doc === null || doc === void 0 ? void 0 : doc.driverRegistration) === null || _c === void 0 ? void 0 : _c.basicInfo) === null || _d === void 0 ? void 0 : _d.address;
    const hasAddress = !!((addr === null || addr === void 0 ? void 0 : addr.street) && (addr === null || addr === void 0 ? void 0 : addr.city) && (addr === null || addr === void 0 ? void 0 : addr.state) && (addr === null || addr === void 0 ? void 0 : addr.zip));
    return !!dob && hasAddress;
};
const isVehicleInfoComplete = (doc) => {
    var _a;
    const v = (_a = doc === null || doc === void 0 ? void 0 : doc.driverRegistration) === null || _a === void 0 ? void 0 : _a.vehicleInfo;
    const hasImg = Array.isArray(v === null || v === void 0 ? void 0 : v.vehicleImage) && v.vehicleImage.length > 0;
    return !!((v === null || v === void 0 ? void 0 : v.vehicleType) && (v === null || v === void 0 ? void 0 : v.licensePlateNumber) && hasImg);
};
const isDocsComplete = (doc) => {
    var _a;
    const d = (_a = doc === null || doc === void 0 ? void 0 : doc.driverRegistration) === null || _a === void 0 ? void 0 : _a.requiredDocs;
    return !!((d === null || d === void 0 ? void 0 : d.vehicleRegistrationDoc) && (d === null || d === void 0 ? void 0 : d.stateIdDoc) && (d === null || d === void 0 ? void 0 : d.driversLicenseDoc));
};
const createAdminToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAdmin = yield user_model_1.User.findOne({ email: payload.email });
    if (isExistAdmin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This Email already taken");
    }
    payload.verified = true;
    const admin = yield user_model_1.User.create(payload);
    if (!admin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Admin");
    }
    return admin;
});
const getAdminFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = user_model_1.User.find({
        role: { $in: [user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN] },
    }).select("firstName lastName email role profileImage createdAt updatedAt");
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        .search(["fullName", "email"])
        .sort()
        .fields()
        .paginate();
    const admins = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return {
        data: admins,
        meta,
    };
});
const deleteAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAdmin = yield user_model_1.User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to delete Admin");
    }
    return isExistAdmin;
});
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.email && !payload.phone) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Either email or phone is required");
    }
    const user = yield user_model_1.User.create(payload);
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create user");
    }
    // ✅ EMAIL REGISTRATION FLOW
    if (user.email) {
        const otp = (0, generateOTP_1.default)();
        yield user_model_1.User.findByIdAndUpdate(user._id, {
            authentication: {
                oneTimeCode: otp,
                expireAt: new Date(Date.now() + 3 * 60000),
            },
        });
        const template = emailTemplate_1.emailTemplate.createAccount({
            name: user.fullName || "User",
            otp,
            email: user.email,
        });
        emailHelper_1.emailHelper.sendEmail(template);
    }
    // ✅ PHONE REGISTRATION FLOW
    if (user.phone) {
        try {
            yield smsHelper_1.twilioService.sendOTPWithVerify(user.phone, user.countryCode);
        }
        catch (error) {
            // Log the SMS error but don't fail the registration flow
            // so users can still be created even if SMS service issues occur.
            console.error("Failed to send SMS OTP:", (error === null || error === void 0 ? void 0 : error.message) || error);
        }
    }
    return { user };
});
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profileImage && isExistUser.profileImage) {
        (0, unlinkFile_1.default)(isExistUser.profileImage);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateDoc;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = user_model_1.User.find({
        role: user_1.USER_ROLES.CUSTOMER,
    });
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        .search(["fullName", "email", "phone"])
        .sort()
        .fields()
        .filter()
        .paginate();
    const users = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    if (!users)
        throw new ApiErrors_1.default(404, "No users are found in the database");
    return {
        data: users,
        meta,
    };
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({
        _id: id,
        role: user_1.USER_ROLES.CUSTOMER,
    });
    if (!result)
        throw new ApiErrors_1.default(404, "No user is found in the database by this ID");
    return result;
});
const deleteUserByIdFromD = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new ApiErrors_1.default(404, "User doest not exist in the database");
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new ApiErrors_1.default(400, "Failed to delete user by this ID");
    }
    return result;
});
const deleteProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new ApiErrors_1.default(400, "Failed to delete this user");
    }
    return result;
});
// ============================ Driver Registration ============================
const getMyDriverRegistrationFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const doc = yield assertDriver(id);
    return {
        user: {
            _id: doc._id,
            firstName: doc.firstName,
            lastName: doc.lastName,
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            countryCode: doc.countryCode,
            profileImage: doc.profileImage,
            role: doc.role,
        },
        driverRegistration: doc.driverRegistration || {},
    };
});
const updateDriverBasicInfoToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const doc = yield assertDriver(id);
    // unlink profile image if replacing
    if (payload.profileImage && doc.profileImage) {
        (0, unlinkFile_1.default)(doc.profileImage);
    }
    const updatePayload = {};
    // top-level user fields
    [
        "firstName",
        "lastName",
        "email",
        "phone",
        "countryCode",
        "profileImage",
    ].forEach((k) => {
        if ((payload === null || payload === void 0 ? void 0 : payload[k]) !== undefined)
            updatePayload[k] = payload[k];
    });
    // nested driver basic info
    if (payload.dateOfBirth !== undefined) {
        updatePayload["driverRegistration.basicInfo.dateOfBirth"] =
            payload.dateOfBirth;
    }
    if (payload.ssn !== undefined) {
        updatePayload["driverRegistration.basicInfo.ssn"] = payload.ssn;
    }
    if (payload.address !== undefined) {
        Object.entries(payload.address || {}).forEach(([k, v]) => {
            updatePayload[`driverRegistration.basicInfo.address.${k}`] = v;
        });
    }
    const updated = yield user_model_1.User.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
    if (!updated)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update driver basic info");
    const basicOk = isBasicInfoComplete(updated);
    yield user_model_1.User.findByIdAndUpdate(id, {
        $set: { "driverRegistration.steps.basicInfoCompleted": basicOk },
    });
    return getMyDriverRegistrationFromDB({ id });
    // 1) steps update করার পর latest user আবার fetch করো (full)
    // const finalUser = await User.findById(id)
    //   .select("-password -authentication") // security
    //   .lean();
    // if (!finalUser) {
    //   throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to load updated user");
    // }
    // return finalUser;
});
const updateDriverVehicleInfoToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = user;
    const doc = yield assertDriver(id);
    const updatePayload = {};
    ["vehicleType", "make", "year", "licensePlateNumber", "color"].forEach((k) => {
        if ((payload === null || payload === void 0 ? void 0 : payload[k]) !== undefined) {
            updatePayload[`driverRegistration.vehicleInfo.${k}`] = payload[k];
        }
    });
    if (payload.vehicleImage) {
        const imagePath = Array.isArray(payload.vehicleImage)
            ? payload.vehicleImage[0]
            : payload.vehicleImage;
        const old = (_b = (_a = doc.driverRegistration) === null || _a === void 0 ? void 0 : _a.vehicleInfo) === null || _b === void 0 ? void 0 : _b.vehicleImage;
        if (old) {
            if (Array.isArray(old)) {
                old.forEach((p) => p && (0, unlinkFile_1.default)(p));
            }
            else {
                (0, unlinkFile_1.default)(old);
            }
        }
        updatePayload["driverRegistration.vehicleInfo.vehicleImage"] = imagePath;
    }
    if (Object.keys(updatePayload).length === 0) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No vehicle info provided");
    }
    const updated = yield user_model_1.User.findByIdAndUpdate(id, { $set: updatePayload }, { new: true, runValidators: true });
    if (!updated)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update driver vehicle info");
    const vehicleOk = isVehicleInfoComplete(updated);
    yield user_model_1.User.findByIdAndUpdate(id, {
        $set: { "driverRegistration.steps.vehicleInfoCompleted": vehicleOk },
    });
    // return await User.findById(id).select("-password -authentication").lean();
    return getMyDriverRegistrationFromDB({ id });
});
const updateDriverRequiredDocsToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = user;
    const doc = yield assertDriver(id);
    const docs = ((_a = doc.driverRegistration) === null || _a === void 0 ? void 0 : _a.requiredDocs) || {};
    const fields = [
        "vehicleRegistrationDoc",
        "stateIdDoc",
        "driversLicenseDoc",
        "ssnDoc",
        "insuranceDoc",
    ];
    const updatePayload = {};
    for (const f of fields) {
        if ((payload === null || payload === void 0 ? void 0 : payload[f]) !== undefined) {
            const prev = docs[f];
            if (prev && prev !== payload[f])
                (0, unlinkFile_1.default)(prev);
            updatePayload[`driverRegistration.requiredDocs.${f}`] = payload[f];
        }
    }
    const updated = yield user_model_1.User.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
    if (!updated)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update required documents");
    const docsOk = isDocsComplete(updated);
    yield user_model_1.User.findByIdAndUpdate(id, {
        $set: { "driverRegistration.steps.requiredDocsCompleted": docsOk },
    });
    return getMyDriverRegistrationFromDB({ id });
});
const updateDriverReferralToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    yield assertDriver(id);
    const updated = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            "driverRegistration.referralCode": payload.referralCode === undefined ? null : payload.referralCode,
            "driverRegistration.steps.referralCompleted": true,
        },
    }, { new: true });
    if (!updated)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update referral");
    return getMyDriverRegistrationFromDB({ id });
});
const submitDriverApplicationToDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = user;
    yield assertDriver(id);
    const current = yield user_model_1.User.findById(id);
    if (!current)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    const steps = ((_a = current.driverRegistration) === null || _a === void 0 ? void 0 : _a.steps) || {};
    const basicOk = steps.basicInfoCompleted || isBasicInfoComplete(current);
    const vehicleOk = steps.vehicleInfoCompleted || isVehicleInfoComplete(current);
    const docsOk = steps.requiredDocsCompleted || isDocsComplete(current);
    if (!basicOk || !vehicleOk || !docsOk) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Driver registration is incomplete. Please complete Basic info, Vehicle info and Required docs.");
    }
    const updated = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            "driverRegistration.applicationStatus": "SUBMITTED",
            "driverRegistration.submittedAt": new Date(),
        },
    }, { new: true });
    return {
        message: "Application sent",
        submittedAt: (_b = updated === null || updated === void 0 ? void 0 : updated.driverRegistration) === null || _b === void 0 ? void 0 : _b.submittedAt,
        applicationStatus: (_c = updated === null || updated === void 0 ? void 0 : updated.driverRegistration) === null || _c === void 0 ? void 0 : _c.applicationStatus,
    };
});
exports.UserService = {
    createUserToDB,
    getAdminFromDB,
    deleteAdminFromDB,
    getUserProfileFromDB,
    updateProfileToDB,
    createAdminToDB,
    getAllUsersFromDB,
    getUserByIdFromDB,
    deleteUserByIdFromD,
    deleteProfileFromDB,
    // driver registration
    getMyDriverRegistrationFromDB,
    updateDriverBasicInfoToDB,
    updateDriverVehicleInfoToDB,
    updateDriverRequiredDocsToDB,
    updateDriverReferralToDB,
    submitDriverApplicationToDB,
};

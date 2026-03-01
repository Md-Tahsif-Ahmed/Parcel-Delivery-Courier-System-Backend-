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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../../../enums/user");
const user_interface_1 = require("./user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
// ====================Driver Code====================
const DriverAddressSchema = new mongoose_1.Schema({
    street: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zip: { type: String, default: null },
    country: { type: String, default: null },
}, { _id: false });
const DriverBasicInfoSchema = new mongoose_1.Schema({
    dateOfBirth: { type: Date, default: null },
    address: { type: DriverAddressSchema, default: {} },
    ssn: { type: String, default: null },
}, { _id: false });
const DriverVehicleInfoSchema = new mongoose_1.Schema({
    vehicleType: {
        type: String,
        enum: Object.values(user_interface_1.VEHICLE_TYPE),
        default: null,
    },
    make: { type: String, default: null },
    year: { type: Number, default: null },
    licensePlateNumber: { type: String, default: null },
    color: { type: String, default: null },
    vehicleImage: { type: [String], default: [] },
}, { _id: false });
const DriverRequiredDocsSchema = new mongoose_1.Schema({
    vehicleRegistrationDoc: { type: String, default: null },
    stateIdDoc: { type: String, default: null },
    driversLicenseDoc: { type: String, default: null },
    ssnDoc: { type: String, default: null },
    insuranceDoc: { type: String, default: null },
}, { _id: false });
const DriverStepsSchema = new mongoose_1.Schema({
    basicInfoCompleted: { type: Boolean, default: false },
    vehicleInfoCompleted: { type: Boolean, default: false },
    requiredDocsCompleted: { type: Boolean, default: false },
    referralCompleted: { type: Boolean, default: false },
}, { _id: false });
const DriverRegistrationSchema = new mongoose_1.Schema({
    basicInfo: { type: DriverBasicInfoSchema, default: {} },
    vehicleInfo: { type: DriverVehicleInfoSchema, default: {} },
    requiredDocs: { type: DriverRequiredDocsSchema, default: {} },
    referralCode: { type: String, default: null },
    steps: { type: DriverStepsSchema, default: {} },
    applicationStatus: {
        type: String,
        enum: Object.values(user_interface_1.DRIVER_APPLICATION_STATUS),
        default: user_interface_1.DRIVER_APPLICATION_STATUS.NONE,
    },
    submittedAt: { type: Date, default: null },
}, { _id: false });
// ===================Driver Code End====================
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    fullName: {
        type: String,
        // required: true,
    },
    // email: {
    //   type: String,
    //   required: false,
    //   unique: true,
    //   lowercase: true,
    //   sparse: true,
    // },
    countryCode: {
        type: String,
        // required: true,
    },
    // phone: {
    //   type: String,
    //   // required: true,
    //   unique: true,
    //   sparse: true,
    // },
    email: {
        type: String,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(user_1.USER_ROLES),
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
        select: 0,
        minlength: 8,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    // agreedToTerms: {
    //   type: Boolean,
    //   required: true,
    // },
    // stripe ....
    connectedAccountId: {
        type: String,
        required: false,
        default: null,
    },
    onboardingCompleted: {
        type: Boolean,
        default: false,
    },
    payoutsEnabled: {
        type: Boolean,
        default: false,
    },
    // .... stripe
    // Stripe & Membership Logic +  // Subscription
    stripeCustomerId: {
        type: String,
        default: null,
    },
    stripeSubscriptionId: {
        type: String,
        default: null,
    },
    membershipType: {
        type: String,
        enum: Object.values(user_interface_1.MEMBERSHIP_TYPE),
        default: user_interface_1.MEMBERSHIP_TYPE.NONE,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    premiumExpiresAt: {
        type: Date,
        default: null,
    },
    subscriptionStatus: {
        type: String,
        enum: Object.values(user_interface_1.SUBSCRIPTION_STATUS),
        default: user_interface_1.SUBSCRIPTION_STATUS.NONE,
    },
    currentPlanPrice: { type: Number, default: 0 },
    currency: { type: String, default: "usd" },
    // .... Subscription
    authentication: {
        type: {
            isResetPassword: {
                type: Boolean,
                default: false,
            },
            oneTimeCode: {
                type: Number,
                default: null,
            },
            expireAt: {
                type: Date,
                default: null,
            },
        },
        select: 0,
    },
    // ====================Driver Code====================
    driverRegistration: {
        type: DriverRegistrationSchema,
        default: {},
    },
    // ==================Driver Code End====================
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret.id;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret.id;
            return ret;
        },
    },
});
// indexing
userSchema.index({ email: 1 }, {
    unique: true,
    partialFilterExpression: {
        email: { $exists: true, $ne: null },
    },
});
userSchema.index({ phone: 1 }, {
    unique: true,
    partialFilterExpression: {
        phone: { $exists: true, $ne: null },
    },
});
//exist user check
userSchema.statics.isExistUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.User.findById(id);
    return isExist;
});
userSchema.statics.isExistUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.User.findOne({ email });
    return isExist;
});
//account check
userSchema.statics.isAccountCreated = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield exports.User.findById(id);
    return isUserExist.accountInformation.status;
});
//is match password
userSchema.statics.isMatchPassword = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashPassword);
});
//check user
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("firstName") || this.isModified("lastName")) {
            this.fullName = `${this.firstName} ${this.lastName}`.trim();
        }
        if (this.isNew) {
            // Email duplicate check
            if (this.email) {
                const emailExist = yield exports.User.findOne({ email: this.email });
                if (emailExist) {
                    throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email already exist!");
                }
            }
            // Phone duplicate check
            if (this.phone) {
                const phoneExist = yield exports.User.findOne({ phone: this.phone });
                if (phoneExist) {
                    throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Phone already exist!");
                }
            }
        }
        if (this.isModified("password") && this.password) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);

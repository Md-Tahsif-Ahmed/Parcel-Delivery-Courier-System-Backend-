import { model, Schema } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
import {
  IUser,
  MEMBERSHIP_TYPE,
  SUBSCRIPTION_STATUS,
  UserModal,
} from "./user.interface";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModal>(
  {
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
      enum: Object.values(USER_ROLES),
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
      enum: Object.values(MEMBERSHIP_TYPE),
      default: MEMBERSHIP_TYPE.NONE,
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
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.NONE,
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
  },
  {
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
  },
);

// indexing


userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $ne: null }
    },
  }
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $ne: null }
    },
  }
);


//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//account check
userSchema.statics.isAccountCreated = async (id: string) => {
  const isUserExist: any = await User.findById(id);
  return isUserExist.accountInformation.status;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre("save", async function (next) {
  if (this.isModified("firstName") || this.isModified("lastName")) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }

  if (this.isNew) {
    // Email duplicate check
    if (this.email) {
      const emailExist = await User.findOne({ email: this.email });
      if (emailExist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exist!");
      }
    }

    // Phone duplicate check
    if (this.phone) {
      const phoneExist = await User.findOne({ phone: this.phone });
      if (phoneExist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Phone already exist!");
      }
    }
  }

  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

export const User = model<IUser, UserModal>("User", userSchema);

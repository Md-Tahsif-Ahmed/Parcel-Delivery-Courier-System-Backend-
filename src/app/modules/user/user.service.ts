import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload, Secret } from "jsonwebtoken";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/queryBuilder";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import { twilioService } from "../../../helpers/smsHelper";

const createAdminToDB = async (payload: any): Promise<IUser> => {
  const isExistAdmin = await User.findOne({ email: payload.email });
  if (isExistAdmin) {
    throw new ApiError(StatusCodes.CONFLICT, "This Email already taken");
  }

  payload.verified = true;

  const admin = await User.create(payload);

  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Admin");
  }

  return admin;
};

const getAdminFromDB = async (query: any) => {
  const baseQuery = User.find({
    role: { $in: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] },
  }).select("firstName lastName email role profileImage createdAt updatedAt");

  const queryBuilder = new QueryBuilder<IUser>(baseQuery, query)
    .search(["fullName", "email"])
    .sort()
    .fields()
    .paginate();

  const admins = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();

  return {
    data: admins,
    meta,
  };
};

const deleteAdminFromDB = async (id: any) => {
  const isExistAdmin = await User.findByIdAndDelete(id);

  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete Admin");
  }

  return isExistAdmin;
};

// const createUserToDB = async (payload: any) => {
//   const createUser = await User.create(payload);
//   console.log(createUser, "Create User");
//   if (!createUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
//   }

//   //send email
//   const otp = generateOTP();
//   const values = {
//     name: createUser.fullName || "User",
//     otp: otp,
//     email: createUser.email!,
//   };

//   const createAccountTemplate = emailTemplate.createAccount(values);
//   emailHelper.sendEmail(createAccountTemplate);

//   //save to DB
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60000),
//   };

//   await User.findOneAndUpdate(
//     { _id: createUser._id },
//     { $set: { authentication } }
//   );

//   // const createToken = jwtHelper.createToken(
//   //   {
//   //     id: createUser._id,
//   //     email: createUser.email,
//   //     role: createUser.role,
//   //   },
//   //   config.jwt.jwt_secret as Secret,
//   //   config.jwt.jwt_expire_in as string
//   // );

//   const result = {
//     // token: createToken,
//     user: createUser,
//   };

//   return result;
// };


// ================================= Create USER  ================================

const createUserToDB = async (payload: any) => {

  if (!payload.email && !payload.phone) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Either email or phone is required"
    );
  }

  const user = await User.create(payload);

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }

  // ✅ EMAIL REGISTRATION FLOW
  if (user.email) {
    const otp = generateOTP();

    await User.findByIdAndUpdate(user._id, {
      authentication: {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
      },
    });

    const template = emailTemplate.createAccount({
      name: user.fullName||"User",
      otp,
      email: user.email,
    });

    emailHelper.sendEmail(template);
  }

  // ✅ PHONE REGISTRATION FLOW
  if (user.phone) {
    try {
      await twilioService.sendOTPWithVerify(user.phone, user.countryCode);
    } catch (error: any) {
      // Log the SMS error but don't fail the registration flow
      // so users can still be created even if SMS service issues occur.
      console.error("Failed to send SMS OTP:", error?.message || error);
    }
  }

  return { user };
};



const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.profileImage && isExistUser.profileImage) {
    unlinkFile(isExistUser.profileImage);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updateDoc;
};

const getAllUsersFromDB = async (query: any) => {
  const baseQuery = User.find({
    role: USER_ROLES.CUSTOMER,
  });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(["fullName", "email", "phone"])
    .sort()
    .fields()
    .filter()
    .paginate();

  const users = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();

  if (!users) throw new ApiError(404, "No users are found in the database");

  return {
    data: users,
    meta,
  };
};

const getUserByIdFromDB = async (id: string) => {
  const result = await User.findOne({
    _id: id,
    role: USER_ROLES.CUSTOMER,
  });

  if (!result)
    throw new ApiError(404, "No user is found in the database by this ID");

  return result;
};

const deleteUserByIdFromD = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User doest not exist in the database");
  }

  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(400, "Failed to delete user by this ID");
  }

  return result;
};

const deleteProfileFromDB = async (id: string) => {
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(400, "Failed to delete this user");
  }
  return result;
};

export const UserService = {
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
};

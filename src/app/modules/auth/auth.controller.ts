import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";


const googleLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;

  const result = await AuthService.googleLogin(idToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Google login successful",
    data: result,
  });
});


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

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmailToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: {
      token: result.token ?? null,
      resetToken: result.resetToken ?? null,
      user: result.user ?? null,
    },
  });
});

const verifyPhone = catchAsync(async (req, res) => {
  const result = await AuthService.verifyPhoneToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: {
      token: (result as any).token ?? null,
      resetToken: (result as any).resetToken ?? null,
      user: (result as any).user ?? null,
    },
  });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserFromDB(loginData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, phone, countryCode } = req.body;
  const identifier = email || phone;
  const result = await AuthService.forgetPasswordToDB(identifier, countryCode);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Please check your email or phone, we send a OTP!",
    data: result,
  });
});

const requestLoginOTP = catchAsync(async (req, res) => {
  const { phone, countryCode } = req.body;
  const result = await AuthService.requestLoginOTP(phone, countryCode);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "OTP sent to your phone number",
    data: result,
  });
});

const verifyLoginOTP = catchAsync(async (req, res) => {
  const result = await AuthService.verifyLoginOTP(req.body);
  console.log("Verify Login OTP Result:", result);
  console.log(req.body,"BODY")

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Login successful",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token: any = req.headers.resettoken;
  const { ...resetData } = req.body;
  const result = await AuthService.resetPasswordToDB(token!, resetData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Your password has been successfully reset.",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthService.changePasswordToDB(user as JwtPayload, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password changed successfully",
  });
});

const newAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await AuthService.newAccessTokenToUser(token);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Generate Access Token successfully",
    data: result,
  });
});

const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.resendVerificationEmailToDB(email);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Generate OTP and send successfully",
      data: result,
    });
  },
);

export const AuthController = {
  googleLogin,
  verifyEmail,
  verifyPhone,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  newAccessToken,
  resendVerificationEmail,
  requestLoginOTP,
  verifyLoginOTP,
};

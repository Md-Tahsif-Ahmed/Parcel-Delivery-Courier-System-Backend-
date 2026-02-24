import { IUser } from "../app/modules/user/user.interface";

export type IVerifyEmail = {
  email: string;
  oneTimeCode: number;
};

export type IVerifyEmailResponse = {
  message: string;
  token?: string;
  user?: IUser;
  resetToken?: string;
}

export type ILoginData = {
  email?: string;
  phone: string;
  password: string;
};

export type IAuthResetPassword = {
  newPassword: string;
  confirmPassword: string;
};

export type IChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

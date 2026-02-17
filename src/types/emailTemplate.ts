export type ICreateAccount = {
  name: string;
  email: string;
  otp: number;
};

export type IResetPassword = {
  email: string;
  otp: number;
};

export type IContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type IContactEmailValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};




import { Request, Response } from 'express';
 
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiErrors';
import { IContactMessage } from '../../../types/emailTemplate';
import { ContactService } from './mailAdmin.service';
import { StatusCodes } from 'http-status-codes';
 
export const ContactController = {
  sendContactMessage: catchAsync(async (req: Request, res: Response) => {
    const { email, name, subject, message } = req.body;
    // const email = req.user?.email;

    if (!email) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User email not found. Please login.');
    }

    const payload: IContactMessage = { name, email, subject, message };
    const result = await ContactService.sendContactMessage(payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Your message has been sent successfully to admin.',
      data: result,
    });
  }),
};
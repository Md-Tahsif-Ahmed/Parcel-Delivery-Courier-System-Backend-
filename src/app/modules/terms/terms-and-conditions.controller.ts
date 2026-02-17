// terms-and-conditions.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { ITermsAndConditions } from './terms-and-conditions.interface';

const createTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const payload: ITermsAndConditions = req.body;
  const result = await TermsAndConditionsService.upsertTermsAndConditionsToDB(payload);

  sendResponse(res, {
    statusCode: 201,                         
    success: true,
    message: 'Terms and Conditions Created Successfully',
    data: result
  });
});

// const updateTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const payload: Partial<ITermsAndConditions> = req.body;  
//   const result = await TermsAndConditionsService.updateTermsAndConditionsToDB(id, payload);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Terms and Conditions Updated Successfully',
//     data: result
//   });
// });

const getTermsAndConditions = catchAsync(async (_req: Request, res: Response) => {
  const result = await TermsAndConditionsService.getTermsAndConditionsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms and Conditions Retrieved Successfully',
    data: result,
  });
});

const deleteTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await TermsAndConditionsService.deleteTermsAndConditionsToDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms and Conditions Deleted Successfully',
    data: null,
  });
});

export const TermsAndConditionsController = {
  createTermsAndConditions,
  // updateTermsAndConditions,
  getTermsAndConditions,
  deleteTermsAndConditions
};

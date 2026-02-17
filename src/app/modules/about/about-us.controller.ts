import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AboutUsService } from './about-us.service';
import { IAboutUs } from './about-us.interface';

const createAboutUs = catchAsync(async (req: Request, res: Response) => {
  const payload: IAboutUs = req.body;                
  const result = await AboutUsService.upsertAboutUsToDB(payload);

  sendResponse(res, {
    statusCode: 201,                                  
    success: true,
    message: 'About Us Created Successfully',
    data: result,
  });
});

// const updateAboutUs = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const payload: Partial<IAboutUs> = req.body;         
//   const result = await AboutUsService.updateAboutUsToDB(id, payload);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'About Us Updated Successfully',
//     data: result,
//   });
// });

const getAboutUs = catchAsync(async (_req: Request, res: Response) => {
  const result = await AboutUsService.getAboutUsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us Retrieved Successfully',
    data: result,
  });
});

const deleteAboutUs = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AboutUsService.deleteAboutUsToDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us Deleted Successfully',
    data: null,
  });
});

export const AboutUsController = {
  createAboutUs,
  // updateAboutUs,
  getAboutUs,
  deleteAboutUs,
};

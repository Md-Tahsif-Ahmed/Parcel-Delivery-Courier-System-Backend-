import { Request, Response, NextFunction } from "express";

export const normalizeDeliveryBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.parcelPhotos) {
    req.body.parcel = {
      ...(req.body.parcel || {}),
      photos: req.body.parcelPhotos,
    };

    delete req.body.parcelPhotos;
  }

  next();
};
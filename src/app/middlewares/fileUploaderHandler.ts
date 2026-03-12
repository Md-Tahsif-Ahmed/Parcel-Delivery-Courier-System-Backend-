import { Request } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import ApiError from "../../errors/ApiErrors";

const fileUploadHandler = () => {
  const baseUploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir: string;

      switch (file.fieldname) {
        case "image":
          uploadDir = path.join(baseUploadDir, "image");
          break;
        case "seatingView":
          uploadDir = path.join(baseUploadDir, "seatingView");
          break;
        case "profileImage":
          uploadDir = path.join(baseUploadDir, "profileImage");
          break;
        case "thumbnail":
          uploadDir = path.join(baseUploadDir, "thumbnail");
          break;
        case "vehicleImage":
          uploadDir = path.join(baseUploadDir, "vehicleImage");
          break;
        case "vehicleRegistrationDoc":
          uploadDir = path.join(baseUploadDir, "vehicleRegistrationDoc");
          break;
        case "stateIdDoc":
          uploadDir = path.join(baseUploadDir, "stateIdDoc");
          break;
        case "driversLicenseDoc":
          uploadDir = path.join(baseUploadDir, "driversLicenseDoc");
          break;
        case "ssnDoc":
          uploadDir = path.join(baseUploadDir, "ssnDoc");
          break;
        case "insuranceDoc":
          uploadDir = path.join(baseUploadDir, "insuranceDoc");
          break;
        case "logo":
          uploadDir = path.join(baseUploadDir, "logo");
          break;
        case "audio":
          uploadDir = path.join(baseUploadDir, "audio");
          break;
        case "video":
          uploadDir = path.join(baseUploadDir, "video");
          break;
        case "attachments":
          uploadDir = path.join(baseUploadDir, "attachments");
          break;
        default:
          uploadDir = path.join(baseUploadDir, "others");
      }

      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const baseName = path
        .basename(file.originalname, fileExt)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");

      cb(null, `${baseName}-${Date.now()}${fileExt}`);
    },
  });

  const imageMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
    "image/webp",
    "application/octet-stream",
  ];

  const attachmentMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
    "application/octet-stream",
  ];

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
      [
        "image",
        "profileImage",
        "seatingView",
        "thumbnail",
        "vehicleImage",
        "logo",
        "banner",
        "cover",
      ].includes(file.fieldname)
    ) {
      if (imageMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
      }

      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only .jpeg, .jpg, .png, .svg, .webp files are supported",
        ),
      );
    }

    if (
      [
        "vehicleRegistrationDoc",
        "stateIdDoc",
        "driversLicenseDoc",
        "ssnDoc",
        "insuranceDoc",
      ].includes(file.fieldname)
    ) {
      if (
        [
          "application/pdf",
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/webp",
          "application/octet-stream",
        ].includes(file.mimetype)
      ) {
        return cb(null, true);
      }

      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only PDF or image files are supported for driver documents",
        ),
      );
    }

    if (file.fieldname === "attachments") {
      if (attachmentMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
      }

      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only image or PDF files are supported for message attachments",
        ),
      );
    }

    if (file.fieldname === "audio") {
      if (
        [
          "audio/mpeg",
          "audio/mp3",
          "audio/wav",
          "audio/ogg",
          "audio/webm",
        ].includes(file.mimetype)
      ) {
        return cb(null, true);
      }

      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only .mp3, .wav, .ogg, .webm audio files are supported",
        ),
      );
    }

    if (file.fieldname === "video") {
      if (
        [
          "video/mp4",
          "video/webm",
          "video/quicktime",
          "video/x-msvideo",
          "video/x-matroska",
          "video/mpeg",
        ].includes(file.mimetype)
      ) {
        return cb(null, true);
      }

      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only .mp4, .webm, .mov, .avi, .mkv, .mpeg video files are supported",
        ),
      );
    }

    if (file.fieldname === "document") {
      if (
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
          "application/rtf",
          "application/zip",
          "application/x-7z-compressed",
          "application/x-rar-compressed",
        ].includes(file.mimetype)
      ) {
        return cb(null, true);
      }

      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only PDF, Word, Excel, PowerPoint, text, RTF, zip, 7z, and rar files are supported",
        ),
      );
    }

    return cb(
      new ApiError(StatusCodes.BAD_REQUEST, "This file type is not supported"),
    );
  };

  const upload = multer({
    storage,
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
    fileFilter,
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "seatingView", maxCount: 10 },
    { name: "nidFrontPic", maxCount: 1 },
    { name: "thumbnail", maxCount: 5 },
    { name: "vehicleImage", maxCount: 5 },
    { name: "vehicleRegistrationDoc", maxCount: 1 },
    { name: "stateIdDoc", maxCount: 1 },
    { name: "driversLicenseDoc", maxCount: 1 },
    { name: "ssnDoc", maxCount: 1 },
    { name: "insuranceDoc", maxCount: 1 },
    { name: "logo", maxCount: 5 },
    { name: "banner", maxCount: 5 },
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 5 },
    { name: "video", maxCount: 5 },
    { name: "attachments", maxCount: 10 },
  ]);

  return upload;
};

export default fileUploadHandler;
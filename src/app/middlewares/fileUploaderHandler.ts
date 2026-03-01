import { Request } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import ApiError from "../../errors/ApiErrors";

const fileUploadHandler = () => {
  // Create upload folder
  const baseUploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  // Folder create for different file types
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  // Create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
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
        // ---------------- Driver registration ----------------
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
        default:
          uploadDir = path.join(baseUploadDir, "others");
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  // File filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (
      file.fieldname === "image" ||
      file.fieldname === "profileImage" ||
      file.fieldname === "seatingView" ||
      file.fieldname === "thumbnail" || // Added the 'thumbnail' field here
      file.fieldname === "vehicleImage" ||
      file.fieldname === "logo" ||
      file.fieldname === "banner" ||
      file.fieldname === "cover"
   
    ) {
      if (
        file.mimetype === "images/png" ||
        file.mimetype === "images/jpg" ||
        file.mimetype === "images/jpeg" ||
        file.mimetype === "images/svg" ||
        file.mimetype === "images/webp" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "application/octet-stream" ||
        file.mimetype === "image/svg+xml"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .jpeg, .png, .jpg .svg .webp .octet-stream .svg+xml file supported",
          ),
        );
      }
    } else if (
      // Driver docs (PDF only, but image also allow)
      file.fieldname === "vehicleRegistrationDoc" ||
      file.fieldname === "stateIdDoc" ||
      file.fieldname === "driversLicenseDoc" ||
      file.fieldname === "ssnDoc" ||
      file.fieldname === "insuranceDoc"
    ) {
      if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "application/octet-stream"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only PDF or image files are supported for driver documents",
          ),
        );
      }
    } else if (file.fieldname === "audio") {
      if (
        file.mimetype === "audio/mpeg" ||
        file.mimetype === "audio/mp3" ||
        file.mimetype === "audio/wav" ||
        file.mimetype === "audio/ogg" ||
        file.mimetype === "audio/webm"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .mp3, .wav, .ogg, .webm audio files are supported",
          ),
        );
      }
    } else if (file.fieldname === "video") {
      if (
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/webm" ||
        file.mimetype === "video/quicktime" ||
        file.mimetype === "video/x-msvideo" ||
        file.mimetype === "video/x-matroska" ||
        file.mimetype === "video/mpeg"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .mp4, .webm, .mov, .avi, .mkv, .mpeg video files are supported",
          ),
        );
      }
    } else if (file.fieldname === "document") {
      if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-powerpoint" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.mimetype === "text/plain" ||
        file.mimetype === "application/rtf" ||
        file.mimetype === "application/zip" ||
        file.mimetype === "application/x-7z-compressed" ||
        file.mimetype === "application/x-rar-compressed"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only PDF, Word, Excel, PowerPoint, text, RTF, zip, 7z, and rar files are supported",
          ),
        );
      }
    } else {
      // Allow PDF files for all other field types
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "This file type is not supported",
          ),
        );
      }
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB file size limit
    },
    fileFilter: filterFilter,
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "seatingView", maxCount: 10 },
    { name: "nidFrontPic", maxCount: 1 },
    { name: "thumbnail", maxCount: 5 }, // Added this line for thumbnail
    // ---------------- Driver registration ----------------
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
  ]);
  return upload;
};

export default fileUploadHandler;

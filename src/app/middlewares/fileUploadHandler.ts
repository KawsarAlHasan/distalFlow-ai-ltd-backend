import { Request } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import ApiError from "../../errors/ApiError";

const fileUploadHandler = () => {
  // create upload folder
  const baseUploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  // folder create for different file types
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  // create filename and destination
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case "image":
        case "doctorImage":
        case "logo":
        case "videoPoster":
        case "poster":
          uploadDir = path.join(baseUploadDir, "images");
          break;
        case "media":
        case "video":
          uploadDir = path.join(baseUploadDir, "medias");
          break;
        case "doc":
          uploadDir = path.join(baseUploadDir, "docs");
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, `File field ${file.fieldname} is not supported`);
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const cleanName = path
        .basename(file.originalname, fileExt)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

      const fileName = `${cleanName}-${Date.now()}${fileExt}`;
      cb(null, fileName);
    },
  });

  // file filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (["image", "doctorImage", "logo", "videoPoster", "poster"].includes(file.fieldname)) {
      const allowedImages = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
        "image/svg+xml",
      ];

      if (allowedImages.includes(file.mimetype)) {
        cb(null, true);
      } else {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only .jpeg, .png, .webp, .gif, .avif, .svg image files are supported",
        );
      }
    } else if (["media", "video"].includes(file.fieldname)) {
      const allowedMedia = [
        "video/mp4",
        "video/webm",
        "video/x-matroska", // mkv
        "video/quicktime", // mov
        "audio/mpeg", // mp3
        "audio/wav",
        "audio/ogg",
      ];

      if (allowedMedia.includes(file.mimetype)) {
        cb(null, true);
      } else {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only mp4, webm, mkv, mov, mp3, wav, ogg media files are supported",
        );
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Only pdf supported");
      }
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, "This file is not supported");
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB max limit
    },
  }).fields([
    { name: "image", maxCount: 3 },
    { name: "doctorImage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "videoPoster", maxCount: 1 },
    { name: "poster", maxCount: 1 },
    { name: "media", maxCount: 3 },
    { name: "video", maxCount: 1 },
    { name: "doc", maxCount: 3 },
  ]);

  return upload;
};

export default fileUploadHandler;

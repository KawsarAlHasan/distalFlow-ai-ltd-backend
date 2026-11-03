import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import fs from "fs";

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg", // .jpg .jpeg
  "image/png", // .png
  "image/webp", // .webp
  "image/gif", // .gif
  "image/svg+xml", // .svg
  "image/avif", // .avif
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/x-matroska", // .mkv
  "video/x-msvideo", // .avi
  "video/quicktime", // .mov
  "video/x-ms-wmv", // .wmv
  "video/mpeg", // .mpeg
  "video/3gpp", // .3gp
];

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 1000 * 1024 * 1024; // 1000MB

// Ensure directories exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage config (disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
    const folder = isVideo ? "uploads/videos" : "uploads/images";

    // Ensure directory exists
    ensureDirectoryExists(folder);

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const isAllowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(
    file.mimetype,
  );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Only image (jpeg, png, webp, gif) or video (mp4, mpeg, mov, webm) files are allowed",
      ),
    );
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
});

// Main middleware with file type and URL
export const imageOrVideoUploadHandler = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadSingle = upload.single("media");

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new ApiError(
              StatusCodes.BAD_REQUEST,
              `File too large. Max size: Images ${MAX_IMAGE_SIZE / (1024 * 1024)}MB, Videos ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`,
            ),
          );
        }
        return next(new ApiError(StatusCodes.BAD_REQUEST, err.message));
      }

      if (err) {
        return next(err);
      }

      // Extra check: enforce image-specific size limit
      if (req.file) {
        const isImage = ALLOWED_IMAGE_TYPES.includes(req.file.mimetype);
        if (isImage && req.file.size > MAX_IMAGE_SIZE) {
          // Delete the uploaded file if it exceeds size limit
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr)
              console.error("Error deleting oversized file:", unlinkErr);
          });

          return next(
            new ApiError(
              StatusCodes.BAD_REQUEST,
              `Image file too large. Max size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
            ),
          );
        }

        // Attach file info to request for controller use
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const isVideo = ALLOWED_VIDEO_TYPES.includes(req.file.mimetype);
        const folder = isVideo ? "videos" : "images";

        (req as any).uploadedFile = {
          url: `${baseUrl}/${folder}/${req.file.filename}`,
          type: isVideo ? "video" : "image",
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        };
      }

      next();
    });
  };
};

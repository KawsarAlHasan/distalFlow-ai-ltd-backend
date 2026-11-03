import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Video files
    if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    }

    // Image files
    else if (
      file.fieldname === "thumbnail" ||
      file.fieldname === "profilePic" ||
      file.fieldname === "logo"
    ) {
      cb(null, "uploads/images/");
    } else {
      cb(new Error("Invalid field name"), "");
    }
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Video validation
  if (file.fieldname === "video") {
    const allowedVideos = [
      "video/mp4",
      "video/webm",
      "video/x-matroska", // mkv
      "video/x-msvideo", // avi
      "video/quicktime", // mov
      "video/x-ms-wmv", // wmv
      "video/mpeg", // mpeg
      "video/3gpp", // 3gp
    ];

    if (allowedVideos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  }

  // Image validation
  else if (
    file.fieldname === "thumbnail" ||
    file.fieldname === "profilePic" ||
    file.fieldname === "logo"
  ) {
    const allowedImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  } else {
    cb(new Error("Invalid field name"));
  }
};

// Video + Thumbnail Upload
export const uploadVideoWithThumbnail = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// ProfilePic + Logo Upload
export const uploadProfilePicAndLogo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
}).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);

import multer from "multer";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
  const allowedMimeTypes = /^image\/(jpeg|png|gif)$/;

  const isValid =
    allowedExtensions.test(path.extname(file.originalname)) &&
    allowedMimeTypes.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadStudentPhoto = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("photo")(req, res, (error: unknown) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image file must be 5MB or smaller"
          : error.message;

      return res.status(400).json({ message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(400).json({ message: "Invalid upload" });
  });
};

export default upload;

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 5
});
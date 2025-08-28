import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "db_pha",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

export const upload = multer({ storage });
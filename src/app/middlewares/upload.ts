import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file): Promise<Record<string, string>> => {
    const nameWithoutExt = file.originalname
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const extension = file.originalname.split(".").pop();

    const uniqueFileName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      nameWithoutExt;

    return {
      folder: "uploads", 
      public_id: uniqueFileName,
    };
  },
});

export const upload = multer({ storage });

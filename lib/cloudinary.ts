import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export const uploadToCloudinary = async (fileUri: string) => {
  if (!fileUri) {
    throw new Error("File URI is required");
  }

  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      resource_type: "auto",
    });

    return res;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};
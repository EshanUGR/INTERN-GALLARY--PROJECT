import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (filePath, options = {}) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "media-gallery",
    resource_type: "auto",
    ...options,
  });
};

export const generateThumbnail = async (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 200, height: 200, crop: "fill" },
      ...(options.transformation || []),
    ],
  });
};

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export const downloadImage = async (publicId) => {
  return cloudinary.url(publicId, {
    flags: "attachment",
    quality: "auto",
    fetch_format: "auto",
  });
};

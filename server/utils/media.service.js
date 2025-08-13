import Media from "../models/Media.js";
import { uploadImage, generateThumbnail } from "./cloudinary.service.js";
import fs from "fs/promises";

export const createMedia = async (file, metadata) => {
  try {
    // Convert buffer to temp file if needed
    let filePath = file.path;
    if (!filePath && file.buffer) {
      filePath = `/tmp/${file.originalname}`;
      await fs.writeFile(filePath, file.buffer);
    }

    const result = await uploadImage(filePath);
    const thumbnailUrl = await generateThumbnail(result.public_id);

    const media = new Media({
      userId: metadata.userId,
      public_id: result.public_id,
      url: result.secure_url,
      thumbnail_url: thumbnailUrl,
      original_filename: result.original_filename || file.originalname,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      title: metadata.title,
      description: metadata.description,
      tags: Array.isArray(metadata.tags)
        ? metadata.tags
        : JSON.parse(metadata.tags || "[]"),
      isShared: metadata.isShared || false,
    });

    await media.save();

    // Clean up temp file if it exists
    if (filePath && (file.buffer || file.path)) {
      await fs.unlink(filePath).catch(console.error);
    }

    return media;
  } catch (error) {
    // Clean up temp file if it exists
    if (file?.path || file?.buffer) {
      const filePath = file.path || `/tmp/${file.originalname}`;
      await fs.unlink(filePath).catch(console.error);
    }
    throw error;
  }
};

export const getAllMedia = async (userId, filters = {}) => {
  const { search, tags, isShared } = filters;
  const query = { userId };

  if (isShared) {
    query.isShared = true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (tags?.length > 0) {
    query.tags = { $all: tags };
  }

  return await Media.find(query).sort({ createdAt: -1 });
};

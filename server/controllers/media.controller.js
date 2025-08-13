import { createMedia, getAllMedia } from "../utils/media.service.js";
import { upload, validateMedia } from "../utils/upload.middleware.js";
import { validationResult } from "express-validator";

export const uploadMedia = [
  upload.single("image"),
  ...validateMedia,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const media = await createMedia(req.file, {
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        isShared: req.body.isShared === "true" || req.body.isShared === true,
      });

      res.status(201).json(media);
    } catch (error) {
      next(error);
    }
  },
];

export const getMedia = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { search, tags, isShared } = req.query;

    const tagsArray = tags ? tags.split(",") : [];

    const media = await getAllMedia(userId, {
      search,
      tags: tagsArray,
      isShared: isShared === "true",
    });

    res.json(media);
  } catch (error) {
    next(error);
  }
};

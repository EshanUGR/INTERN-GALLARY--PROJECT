import express from "express";
import { downloadMediaAsZip } from "../controllers/zip.controller.js";

import { check } from "express-validator";
import { checkAuth } from "../controllers/auth.controller.js";
const router = express.Router();

router.post(
  "/:userId/download",
  checkAuth,
  [
    check("mediaIds")
      .isArray({ min: 1 })
      .withMessage("At least one media ID is required"),
    check("mediaIds.*").isMongoId().withMessage("Invalid media ID format"),
  ],
  downloadMediaAsZip
);

export default router;

import express from "express";
import { uploadMedia, getMedia } from "../controllers/media.controller.js";

import {
  checkAuth
} from "../controllers/auth.controller.js";

import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/check-auth",verifyToken,checkAuth);


router.post("/",verifyToken,uploadMedia);
router.get("/:userId", verifyToken, getMedia);

export default router;

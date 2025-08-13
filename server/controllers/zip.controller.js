import Media from "../models/Media.js";
import JSZip from "jszip";
import axios from "axios";
import { downloadImage } from "../services/cloudinary.service.js";

export const downloadMediaAsZip = async (req, res, next) => {
  try {
    const { mediaIds } = req.body;
    const { userId } = req.params;

    if (!mediaIds || !Array.isArray(mediaIds)) {
      return res.status(400).json({ error: "Invalid media IDs" });
    }

    // Find media items that belong to the user
    const mediaItems = await Media.find({
      _id: { $in: mediaIds },
      userId,
    });

    if (mediaItems.length === 0) {
      return res.status(404).json({ error: "No media items found" });
    }

    // Create a new ZIP archive
    const zip = new JSZip();

    // Download each image and add to the ZIP
    const downloadPromises = mediaItems.map(async (media) => {
      try {
        const downloadUrl = await downloadImage(media.public_id);
        const response = await axios.get(downloadUrl, {
          responseType: "arraybuffer",
          maxContentLength: 10 * 1024 * 1024, // 10MB limit per file
        });

        const extension = media.format.toLowerCase();
        const filename = `${
          media.title || media.original_filename
        }.${extension}`;

        zip.file(filename, response.data);
      } catch (error) {
        console.error(`Failed to download media ${media._id}:`, error);
        // Continue with other files even if one fails
      }
    });

    await Promise.all(downloadPromises);

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    // Set response headers
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=media.zip",
      "Content-Length": zipContent.length,
      "Cache-Control": "no-store", // Prevent caching of ZIP files
    });

    // Send the ZIP file
    res.send(zipContent);
  } catch (error) {
    console.error("ZIP creation error:", error);
    next(error);
  }
};

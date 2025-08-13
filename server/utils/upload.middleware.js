import multer from "multer";
import { extname } from "path";

const storage = multer.memoryStorage(); // Use memory storage for better handling

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
});

const validateMedia = [
  // Add any additional validation here
];

export { upload, validateMedia };

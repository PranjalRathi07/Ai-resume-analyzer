/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/auth");
const resumeController = require("../controllers/resumeController");

// Multer storage — save to server/uploads/
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(__dirname, "..", "uploads");
		if (!require("fs").existsSync(uploadDir)) {
			require("fs").mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, unique + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	const allowed = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
		"image/bmp",
		"application/pdf",
	];
	if (allowed.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Only images (JPG, PNG, WEBP) and PDF files are allowed."), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Routes
router.post("/upload", protect, upload.single("resume"), resumeController.uploadAndAnalyze);
router.get("/latest", protect, resumeController.getLatestAnalysis);
router.get("/my", protect, resumeController.getMyResumes);

module.exports = router;

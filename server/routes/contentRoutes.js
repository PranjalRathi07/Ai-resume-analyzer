/** @format */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
	getLearningPath,
	getCareerPath,
	getCoverLetter,
} = require("../controllers/contentController");

router.get("/learning-path", protect, getLearningPath);
router.get("/career-path", protect, getCareerPath);
router.get("/cover-letter", protect, getCoverLetter);

module.exports = router;

/** @format */

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Resume = require("../models/Resume");
const { analyzeResumeFromImage, analyzeResumeFromText, analyzeResumeFromPDF } = require("../utils/analyzeWithGemini");
const { extractTextFromPDF } = require("../utils/extractText");
const { canCallAI, runOnce } = require("../utils/aiUtils");

// POST /api/resume/upload
exports.uploadAndAnalyze = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded." });
		}

		const { originalname, filename, path: filePath, mimetype, size } = req.file;
		const isPdf = mimetype === "application/pdf";
		const fileType = isPdf ? "pdf" : "image";
		const fileUrl = `/uploads/${filename}`;

		// ── Step 0: Check if the exact same file was uploaded recently ──────────
		// By generating SHA-256 hash
		const fileBuffer = fs.readFileSync(filePath);
		const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

		// Run once to deduplicate concurrent duplicate uploads
		const resumeResult = await runOnce(`upload-${req.userId}-${fileHash}`, async () => {
			const recentResume = await Resume.findOne({
				userId: req.userId,
				fileHash: fileHash,
			}).sort({ createdAt: -1 });

			// We assume if it has analysisData.overallScore, it's a valid completed analysis.
			if (recentResume && recentResume.analysisData && recentResume.analysisData.overallScore > 0) {
				console.log(`[Cache] Returning cached analysis for recently uploaded resume: ${originalname}`);
				return recentResume;
			}

			if (!canCallAI(req.userId, "upload", 15000)) {
				const err = new Error("Too many upload requests. Please wait a few seconds.");
				err.status = 429;
				throw err;
			}

			let analysisData;
			let resumeText = "";

			if (isPdf) {
				// ── Step 1: Try text extraction with pdf-parse ──────────────────
				try {
					resumeText = await extractTextFromPDF(filePath);
				} catch (e) {
					console.warn("pdf-parse failed:", e.message);
				}

				if (resumeText && resumeText.trim().length >= 50) {
					// ── Step 2a: Text-based PDF — send text to Gemini ───────────
					console.log(`✅ PDF text extracted (${resumeText.trim().length} chars) — using text analysis`);
					analysisData = await analyzeResumeFromText(resumeText);
				} else {
					// ── Step 2b: Scanned/image PDF — send PDF bytes to Gemini Vision
					console.log("⚠️  Insufficient text from pdf-parse — falling back to Gemini PDF Vision");
					analysisData = await analyzeResumeFromPDF(filePath);
				}
			} else {
				// ── Image file — send directly to Gemini Vision ─────────────────
				analysisData = await analyzeResumeFromImage(filePath);
			}

			// Save to MongoDB
			return await Resume.create({
				userId: req.userId,
				fileName: originalname,
				fileHash,
				fileUrl,
				fileType,
				resumeText,
				analysisData,
			});
		});

		res.status(200).json({
			message: "Resume analyzed successfully",
			resumeId: resumeResult._id,
			fileUrl: resumeResult.fileUrl,
			analysisData: resumeResult.analysisData,
		});
	} catch (error) {
		console.error("Upload/Analyze error:", error);
		if (error.isDailyQuota) {
			return res.status(429).json({ 
				message: "Google AI Daily API Limit Reached (20 requests/day). This free tier project has exhausted its quota. Please try again tomorrow, or update your GEMINI_API_KEY." 
			});
		}

		if (
			error.status === 429 ||
			(error.message && error.message.includes("429")) ||
			(error.message && error.message.includes("quota")) ||
			(error.statusText && error.statusText.includes("Too Many Requests"))
		) {
			return res.status(429).json({ 
				message: "AI Rate Limit Reached. Google's free tier allows 15 requests per minute. Please wait a few minutes and try again." 
			});
		}
		res.status(500).json({
			message: "Analysis failed. " + (error.message || "Please try again."),
		});
	}
};

// GET /api/resume/latest
exports.getLatestAnalysis = async (req, res) => {
	try {
		const resume = await Resume.findOne({ userId: req.userId })
			.sort({ createdAt: -1 })
			.lean();

		if (!resume) {
			return res.status(404).json({ message: "No resume found." });
		}

		res.status(200).json(resume);
	} catch (error) {
		console.error("Get latest error:", error);
		res.status(500).json({ message: "Server error." });
	}
};

// GET /api/resume/my
exports.getMyResumes = async (req, res) => {
	try {
		const resumes = await Resume.find({ userId: req.userId })
			.sort({ createdAt: -1 })
			.select("fileName fileUrl fileType analysisData.overallScore analysisData.verdict createdAt")
			.lean();

		res.status(200).json(resumes);
	} catch (error) {
		console.error("Get resumes error:", error);
		res.status(500).json({ message: "Server error." });
	}
};

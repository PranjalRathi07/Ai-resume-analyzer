/** @format */

const mongoose = require("mongoose");

const AnalysisDataSchema = new mongoose.Schema(
	{
		overallScore: { type: Number, default: 0 },
		verdict: { type: String, default: "" },
		formatScore: { type: Number, default: 0 },
		contentScore: { type: Number, default: 0 },
		skillMatchScore: { type: Number, default: 0 },
		keywordMatchScore: { type: Number, default: 0 },
		missingSectionScore: { type: Number, default: 0 },
		extractedSkills: [String],
		missingKeywords: {
			technical: [String],
			tools: [String],
			softSkills: [String],
			domain: [String],
		},
		suggestions: [String],
		missingStats: {
			missingSkills: { type: Number, default: 0 },
			weakSections: { type: Number, default: 0 },
			keywordMatch: { type: String, default: "0%" },
		},
		careerSuggestions: [String],
		learningPath: [String],
		topMatchRole: { type: String, default: "" },
		topMatchPercentage: { type: Number, default: 0 },
		atsTips: [String],
	},
	{ _id: false },
);

const ResumeSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	fileName: { type: String },
	fileUrl: { type: String },
	fileType: { type: String, enum: ["image", "pdf"], default: "image" },
	fileHash: { type: String, default: "" },
	resumeText: { type: String, default: "" },
	analysisData: { type: AnalysisDataSchema, default: () => ({}) },
	learningPathData: { type: Object, default: null },
	careerPathData: { type: Object, default: null },
	coverLetterData: { type: Object, default: null },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);

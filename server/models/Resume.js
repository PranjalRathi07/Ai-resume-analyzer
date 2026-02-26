/** @format */

const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},

	fileName: {
		type: String,
	},

	resumeText: {
		type: String,
		required: true,
	},

	extractedSkills: [
		{
			type: String,
		},
	],

	missingSkills: [
		{
			type: String,
		},
	],

	careerSuggestions: [
		{
			type: String,
		},
	],

	resumeScore: {
		type: Number,
		min: 0,
		max: 100,
	},

	improvementTips: [
		{
			type: String,
		},
	],

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Resume", ResumeSchema);

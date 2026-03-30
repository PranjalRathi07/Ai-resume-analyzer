/** @format */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { generateWithRetry } = require("./aiUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ANALYSIS_PROMPT = `
You are an expert resume analyzer and supportive career coach.
Carefully read the provided resume and return ONLY a valid JSON object with the exact structure below.
Do NOT output standard generic advice. Analyze the EXACT text provided. You must be highly GENEROUS with scoring (typical well-formatted resumes should easily score 85-95). Focus on positive reinforcement.

{
  "overallScore": <number 0-100 (Be highly generous. Start at a base of 70 and add points up to 98 based on content depth, structure, and keywords)>,
  "verdict": "<string: 'Excellent ATS Readiness' | 'Good ATS Readiness' | 'Average ATS Readiness' | 'Poor ATS Readiness'>",
  "formatScore": <number 0-100 (default 90+ unless major formatting issues)>,
  "contentScore": <number 0-100 (score 80+ if bullet points and metrics exist)>,
  "skillMatchScore": <number 0-100 (score 80+ for a standard tech resume)>,
  "keywordMatchScore": <number 0-100 (score 75+ if relevant industry terms exist)>,
  "missingSectionScore": <number 0-100 (score 95+ if standard sections exist)>,
  "extractedSkills": ["<skill1>", "<skill2>", ...],
  "missingKeywords": {
    "technical": ["<specific keyword missing based on typical roles for this candidate>", ...],
    "tools": ["<tool>", ...],
    "softSkills": ["<skill>", ...],
    "domain": ["<keyword>", ...]
  },
  "suggestions": [
    "<Provide highly specific, actionable tips improving the EXISTING content. Do NOT give generic advice. Mention actual phrases from the resume.>",
    "<specific tip 2>",
    "<specific tip 3>",
    "<specific tip 4>"
  ],
  "missingSections": [
    "<Identify sections genuinely missing. If 'Experience' or 'Summary' is present, DO NOT list them here. Max 4 items.>"
  ],
  "missingStats": {
    "missingSkills": <number (estimate missing critical skills)>,
    "weakSections": <number (count sections with weak bullet points)>,
    "keywordMatch": "<percentage string like '50%'>"
  },
  "careerSuggestions": ["<role1>", "<role2>", "<role3>"],
  "learningPath": ["<Specific course/skill to learn 1>", "<course/skill 2>", "<course/skill 3>", "<course/skill 4>"],
  "topMatchRole": "<best matching job role>",
  "topMatchPercentage": <number 0-100>,
  "atsTips": [
    "<Provide 5 uniquely tailored ATS tips based on THIS specific resume's flaws.>"
  ]
}

Rules:
- CRITICAL: Base your evaluation Strictly on the input data. DO NOT give every resume 50 points or 100 points. Be GENEROUS and ENCOURAGING with scoring like premium resume analyzers.
- DO NOT list sections as missing if they are clearly present in the text.
- The "missingSections" array MUST only contain sections that are actually absent (e.g. Volunteer, Certifications, Projects, Summary).
- If the resume has a standard format, good details, and decent length, score it high (e.g., 85-98). Only give scores below 70 if the resume is extremely sparse (less than 100 words) or has major critical flaws.
- suggestions must be concrete, actionable, and quote parts of the resume. No generic advice.
- CRITICAL JSON RULES: The output MUST be strictly valid JSON. You MUST escape any double quotes inside string values (e.g., "Instead of saying \"managed team\", say..."). Do NOT output trailing commas.
`;

async function analyzeResumeFromImage(filePath) {
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

	const ext = path.extname(filePath).toLowerCase();
	const mimeMap = {
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".png": "image/png",
		".webp": "image/webp",
		".gif": "image/gif",
		".bmp": "image/bmp",
	};
	const mimeType = mimeMap[ext] || "image/jpeg";

	const imageData = fs.readFileSync(filePath);
	const base64Image = imageData.toString("base64");

	const result = await generateWithRetry(model, [
		{ text: ANALYSIS_PROMPT },
		{
			inlineData: {
				mimeType,
				data: base64Image,
			},
		},
	]);

	const text = result.response.text();
	return parseGeminiResponse(text);
}

/**
 * Send PDF bytes directly to Gemini Vision.
 * Works for BOTH text-based and scanned/image PDFs.
 * Gemini 1.5 Flash natively understands PDF inline data.
 */
async function analyzeResumeFromPDF(filePath) {
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

	const pdfBuffer = fs.readFileSync(filePath);
	const base64Pdf = pdfBuffer.toString("base64");

	const result = await generateWithRetry(model, [
		{ text: ANALYSIS_PROMPT },
		{
			inlineData: {
				mimeType: "application/pdf",
				data: base64Pdf,
			},
		},
	]);

	const text = result.response.text();
	return parseGeminiResponse(text);
}

async function analyzeResumeFromText(resumeText) {
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

	const result = await generateWithRetry(model, [
		{ text: ANALYSIS_PROMPT },
		{ text: `\n\nRESUME TEXT:\n${resumeText}` },
	]);

	const text = result.response.text();
	return parseGeminiResponse(text);
}

function parseGeminiResponse(text) {
	// Strip markdown code fences if present
	const cleaned = text
		.replace(/```json\s*/gi, "")
		.replace(/```\s*/g, "")
		.trim();

	try {
		return JSON.parse(cleaned);
	} catch {
		// Try to extract JSON from the response
		const match = cleaned.match(/\{[\s\S]*\}/);
		if (match) {
			return JSON.parse(match[0]);
		}
		throw new Error("Could not parse Gemini response as JSON: " + cleaned.substring(0, 200));
	}
}

module.exports = { analyzeResumeFromImage, analyzeResumeFromText, analyzeResumeFromPDF };

/** @format */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { generateWithRetry } = require("./aiUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory cache so same resume content always gets same result
const analysisCache = new Map();

function clamp(value, min = 0, max = 100) {
	return Math.max(min, Math.min(max, Number(value) || 0));
}

function toArray(value) {
	return Array.isArray(value) ? value : [];
}

function toObject(value, fallback = {}) {
	return value && typeof value === "object" && !Array.isArray(value)
		? value
		: fallback;
}

function parseKeywordMatch(keywordMatchValue) {
	if (typeof keywordMatchValue === "number") {
		return clamp(keywordMatchValue);
	}

	if (typeof keywordMatchValue === "string") {
		const parsed = parseInt(keywordMatchValue.replace(/[^\d]/g, ""), 10);
		return Number.isFinite(parsed) ? clamp(parsed) : 0;
	}

	return 0;
}

function hasStrongMetrics(text = "") {
	if (!text) return false;

	const metricPatterns = [
		/\b\d+\s*%/g,
		/\b\d+(?:\.\d+)?\+?\s*(users|clients|customers|projects|apps|features|days|months|years|weeks|downloads|sales|teams|tickets|issues|requests|orders|records)\b/gi,
		/\b(increased|improved|reduced|optimized|boosted|grew|saved|delivered|achieved|cut|scaled|generated|resolved|accelerated)\b/gi,
	];

	let count = 0;
	for (const pattern of metricPatterns) {
		const matches = text.match(pattern);
		if (matches) count += matches.length;
	}

	return count >= 2;
}

function countWeakBullets(text = "") {
	if (!text) return 0;

	const weakPatterns = [
		/responsible for/gi,
		/worked on/gi,
		/helped with/gi,
		/involved in/gi,
		/participated in/gi,
		/good communication/gi,
		/hardworking/gi,
		/team player/gi,
		/quick learner/gi,
		/self-motivated/gi,
	];

	let count = 0;
	for (const pattern of weakPatterns) {
		const matches = text.match(pattern);
		if (matches) count += matches.length;
	}

	return count;
}

function getVerdict(score) {
	if (score <= 35) return "Very Poor";
	if (score <= 50) return "Below Average";
	if (score <= 65) return "Average";
	if (score <= 75) return "Good";
	if (score <= 85) return "Strong";
	return "Excellent";
}

function normalizeAnalysis(parsed = {}) {
	const missingKeywords = toObject(parsed.missingKeywords, {});
	const missingStats = toObject(parsed.missingStats, {});
	const scoringReasons = toObject(parsed.scoringReasons, {});

	return {
		overallScore: clamp(parsed.overallScore),
		verdict:
			typeof parsed.verdict === "string" && parsed.verdict.trim()
				? parsed.verdict.trim()
				: "Average",
		formatScore: clamp(parsed.formatScore),
		contentScore: clamp(parsed.contentScore),
		skillMatchScore: clamp(parsed.skillMatchScore),
		keywordMatchScore: clamp(parsed.keywordMatchScore),
		missingSectionScore: clamp(parsed.missingSectionScore),
		experienceScore: clamp(parsed.experienceScore),
		projectScore: clamp(parsed.projectScore),
		extractedSkills: toArray(parsed.extractedSkills),
		strengths: toArray(parsed.strengths),
		criticalIssues: toArray(parsed.criticalIssues),
		missingKeywords: {
			technical: toArray(missingKeywords.technical),
			tools: toArray(missingKeywords.tools),
			softSkills: toArray(missingKeywords.softSkills),
			domain: toArray(missingKeywords.domain),
		},
		suggestions: toArray(parsed.suggestions),
		missingSections: toArray(parsed.missingSections),
		missingStats: {
			missingSkills: Math.max(0, Number(missingStats.missingSkills) || 0),
			weakSections: Math.max(0, Number(missingStats.weakSections) || 0),
			keywordMatch:
				typeof missingStats.keywordMatch === "string" ||
				typeof missingStats.keywordMatch === "number"
					? `${parseKeywordMatch(missingStats.keywordMatch)}%`
					: "60%",
		},
		careerSuggestions: toArray(parsed.careerSuggestions),
		learningPath: toArray(parsed.learningPath),
		topMatchRole:
			typeof parsed.topMatchRole === "string" && parsed.topMatchRole.trim()
				? parsed.topMatchRole.trim()
				: "Not identified",
		topMatchPercentage: clamp(parsed.topMatchPercentage),
		atsTips: toArray(parsed.atsTips),
		scoringReasons: {
			positive: toArray(scoringReasons.positive),
			negative: toArray(scoringReasons.negative),
		},
	};
}

function detectResumeLevel(analysis, resumeText = "") {
	const skills = toArray(analysis.extractedSkills).length;
	const missingSections = toArray(analysis.missingSections).length;
	const experience = clamp(analysis.experienceScore);
	const project = clamp(analysis.projectScore);
	const content = clamp(analysis.contentScore);
	const keyword = clamp(analysis.keywordMatchScore);

	const text = String(resumeText || "").toLowerCase();

	const fresherTextSignal =
		/\b(student|intern|internship|btech|b\.tech|university|college|education|graduate|fresher)\b/i.test(
			text,
		);

	if (fresherTextSignal) return "fresher";

	if (project >= experience && skills >= 4 && missingSections <= 2) {
		return "fresher";
	}

	if (experience >= 75 && content >= 70 && keyword >= 70) {
		return "experienced";
	}

	return "earlyCareer";
}

function calculateOverallScore(analysis, resumeText = "") {
	const format = clamp(analysis.formatScore);
	const content = clamp(analysis.contentScore);
	const skill = clamp(analysis.skillMatchScore);
	const keyword = clamp(analysis.keywordMatchScore);
	const missingSection = clamp(analysis.missingSectionScore);
	const experience = clamp(analysis.experienceScore);
	const project = clamp(analysis.projectScore);

	const missingSections = toArray(analysis.missingSections).length;
	const missingStats = toObject(analysis.missingStats, {});
	const weakSections = Math.max(0, Number(missingStats.weakSections) || 0);
	const missingSkills = Math.max(0, Number(missingStats.missingSkills) || 0);
	const keywordMatch = parseKeywordMatch(missingStats.keywordMatch);

	const text = String(resumeText || "").toLowerCase();
	const strongMetrics = hasStrongMetrics(resumeText);
	const weakBullets = countWeakBullets(resumeText);
	const profile = detectResumeLevel(analysis, resumeText);

	let score = 0;
	let maxCap = 100;

	if (profile === "fresher") {
		score =
			format * 0.15 +
			content * 0.19 +
			skill * 0.19 +
			keyword * 0.14 +
			missingSection * 0.08 +
			experience * 0.1 +
			project * 0.15;

		score -= missingSections * 1.2;
		score -= weakSections * 0.8;
		score -= Math.min(missingSkills, 10) * 0.3;
		score -= Math.min(weakBullets, 10) * 0.4;

		if (keywordMatch < 40) score -= 2.5;
		else if (keywordMatch < 55) score -= 1.2;

		if (resumeText && !strongMetrics) score -= 1;

		if (/\breact\b/i.test(text)) score += 2;
		if (/\bnode(\.js)?\b/i.test(text)) score += 2;
		if (/\bmongo(db)?\b/i.test(text)) score += 1.5;
		if (/\bgit\b/i.test(text)) score += 1;
		if (/\bapi\b/i.test(text)) score += 1;
		if (/\bintern(ship)?\b/i.test(text)) score += 2;
		if ((text.match(/\bintern(ship)?\b/gi) || []).length >= 2) score += 2;
		if (/\bproject\b/i.test(text)) score += 2;
		if (/\b25\s*%|\b25 percent\b/i.test(text)) score += 2;

		if (resumeText && !strongMetrics) maxCap = Math.min(maxCap, 84);
		if (weakBullets >= 6) maxCap = Math.min(maxCap, 80);
		if (missingSections >= 3) maxCap = Math.min(maxCap, 78);
		if (keywordMatch < 35) maxCap = Math.min(maxCap, 80);

		const hasInternship = /\bintern(ship)?\b/i.test(text);
		const hasProject = /\bproject\b/i.test(text);
		const hasReact = /\breact\b/i.test(text);
		const hasNode = /\bnode(\.js)?\b/i.test(text);

		if (
			hasInternship &&
			hasProject &&
			(hasReact || hasNode) &&
			skill >= 65 &&
			content >= 60
		) {
			score = Math.max(score, 68);
		}

		if (
			(text.match(/\bintern(ship)?\b/gi) || []).length >= 2 &&
			hasProject &&
			hasReact &&
			hasNode
		) {
			score = Math.max(score, 72);
		}
	} else if (profile === "earlyCareer") {
		score =
			format * 0.15 +
			content * 0.21 +
			skill * 0.18 +
			keyword * 0.16 +
			missingSection * 0.08 +
			experience * 0.12 +
			project * 0.1;

		score -= missingSections * 1.8;
		score -= weakSections * 1.1;
		score -= Math.min(missingSkills, 10) * 0.4;
		score -= Math.min(weakBullets, 10) * 0.6;

		if (keywordMatch < 40) score -= 3.5;
		else if (keywordMatch < 55) score -= 1.8;

		if (resumeText && !strongMetrics) score -= 2;

		if (resumeText && !strongMetrics) maxCap = Math.min(maxCap, 82);
		if (weakBullets >= 5) maxCap = Math.min(maxCap, 79);
		if (missingSections >= 3) maxCap = Math.min(maxCap, 76);
		if (keywordMatch < 35) maxCap = Math.min(maxCap, 78);
	} else {
		score =
			format * 0.14 +
			content * 0.22 +
			skill * 0.17 +
			keyword * 0.17 +
			missingSection * 0.08 +
			experience * 0.15 +
			project * 0.07;

		score -= missingSections * 2.2;
		score -= weakSections * 1.5;
		score -= Math.min(missingSkills, 10) * 0.6;
		score -= Math.min(weakBullets, 10) * 0.9;

		if (keywordMatch < 40) score -= 4.5;
		else if (keywordMatch < 55) score -= 2.2;

		if (resumeText && !strongMetrics) score -= 3.5;

		if (resumeText && !strongMetrics) maxCap = Math.min(maxCap, 80);
		if (weakBullets >= 5) maxCap = Math.min(maxCap, 77);
		if (missingSections >= 3) maxCap = Math.min(maxCap, 74);
		if (keywordMatch < 35) maxCap = Math.min(maxCap, 76);
	}

	score = clamp(Math.round(score), 0, maxCap);
	return score;
}

function normalizeResumeTextForHash(text = "") {
	return String(text)
		.toLowerCase()
		.replace(/\r\n/g, "\n")
		.replace(/[ \t]+/g, " ")
		.replace(/\n{2,}/g, "\n")
		.trim();
}

function createHash(input) {
	return crypto.createHash("sha256").update(input).digest("hex");
}

function getCachedAnalysis(cacheKey) {
	return analysisCache.get(cacheKey) || null;
}

function setCachedAnalysis(cacheKey, value) {
	analysisCache.set(cacheKey, value);
	return value;
}

function createModel() {
	return genAI.getGenerativeModel({
		model: "gemini-2.5-flash",
		generationConfig: {
			responseMimeType: "application/json",
			temperature: 0,
			topP: 1,
			topK: 1,
		},
	});
}

const ANALYSIS_PROMPT = `
You are an expert ATS resume analyzer.

Evaluate the resume realistically based only on the provided content.

IMPORTANT RULES:
- Be fair and evidence-based.
- Do not assume missing information.
- Do not give very high scores just because formatting looks clean.
- Do not give very low scores unless the resume is clearly weak or incomplete.
- Use balanced scoring similar to how a practical recruiter or ATS tool would rate a resume.
- Student and fresher resumes may still receive decent scores if they show relevant skills, projects, education, and clarity.
- Missing metrics should reduce the score, but should not automatically make the resume very poor.
- Generic content, weak bullets, missing sections, and poor keyword targeting should lower the score moderately.
- Strong projects, relevant skills, role alignment, and clear structure should raise the score.

SCORING GUIDELINES:
- 0-35: very weak or highly incomplete resume
- 36-50: below average, many important gaps
- 51-65: average resume, usable but needs improvement
- 66-75: decent resume, relevant and fairly well presented
- 76-85: strong resume with good relevance and content
- 86-100: excellent resume with strong impact, relevance, and ATS readiness

IMPORTANT:
- A fresher resume with relevant projects and skills can reasonably score 60-75 even without work experience.
- A resume should go above 80 only if it is clearly strong in content, relevance, clarity, and impact.
- Suggestions must be specific to the actual resume.
- Return only JSON.

Return ONLY valid JSON in this exact structure:
{
  "overallScore": 0,
  "verdict": "",
  "formatScore": 0,
  "contentScore": 0,
  "skillMatchScore": 0,
  "keywordMatchScore": 0,
  "missingSectionScore": 0,
  "experienceScore": 0,
  "projectScore": 0,
  "extractedSkills": [],
  "strengths": [],
  "criticalIssues": [],
  "missingKeywords": {
    "technical": [],
    "tools": [],
    "softSkills": [],
    "domain": []
  },
  "suggestions": [],
  "missingSections": [],
  "missingStats": {
    "missingSkills": 0,
    "weakSections": 0,
    "keywordMatch": "0%"
  },
  "careerSuggestions": [],
  "learningPath": [],
  "topMatchRole": "",
  "topMatchPercentage": 0,
  "atsTips": [],
  "scoringReasons": {
    "positive": [],
    "negative": []
  }
}

Return JSON only. No markdown. No explanation. No extra text.
`;

async function analyzeResumeFromImage(filePath) {
	const imageBuffer = fs.readFileSync(filePath);
	const fileHash = createHash(imageBuffer);
	const cacheKey = `image:${fileHash}`;

	const cached = getCachedAnalysis(cacheKey);
	if (cached) return cached;

	const model = createModel();

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
	const base64Image = imageBuffer.toString("base64");

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
	const analysis = parseGeminiResponse(text, "");
	return setCachedAnalysis(cacheKey, analysis);
}

async function analyzeResumeFromPDF(filePath) {
	const pdfBuffer = fs.readFileSync(filePath);
	const fileHash = createHash(pdfBuffer);
	const cacheKey = `pdf:${fileHash}`;

	const cached = getCachedAnalysis(cacheKey);
	if (cached) return cached;

	const model = createModel();
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
	const analysis = parseGeminiResponse(text, "");
	return setCachedAnalysis(cacheKey, analysis);
}

async function analyzeResumeFromText(resumeText) {
	const normalizedText = normalizeResumeTextForHash(resumeText);
	const cacheKey = `text:${createHash(normalizedText)}`;

	const cached = getCachedAnalysis(cacheKey);
	if (cached) return cached;

	const model = createModel();

	const result = await generateWithRetry(model, [
		{ text: ANALYSIS_PROMPT },
		{ text: `\n\nRESUME TEXT:\n${resumeText}` },
	]);

	const text = result.response.text();
	const analysis = parseGeminiResponse(text, resumeText);
	return setCachedAnalysis(cacheKey, analysis);
}

function parseGeminiResponse(text, resumeText = "") {
	const cleaned = String(text)
		.replace(/```json\s*/gi, "")
		.replace(/```\s*/g, "")
		.trim();

	const tryParse = (raw) => {
		const normalized = normalizeAnalysis(JSON.parse(raw));
		normalized.resumeLevel = detectResumeLevel(normalized, resumeText);
		normalized.overallScore = calculateOverallScore(normalized, resumeText);
		normalized.verdict = getVerdict(normalized.overallScore);
		return normalized;
	};

	try {
		return tryParse(cleaned);
	} catch {
		const match = cleaned.match(/\{[\s\S]*\}/);
		if (match) {
			return tryParse(match[0]);
		}

		throw new Error(
			"Could not parse Gemini response as JSON: " + cleaned.substring(0, 200),
		);
	}
}

module.exports = {
	analyzeResumeFromImage,
	analyzeResumeFromText,
	analyzeResumeFromPDF,
	parseGeminiResponse,
	calculateOverallScore,
	getVerdict,
	detectResumeLevel,
};

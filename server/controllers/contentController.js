/** @format */

const Resume = require("../models/Resume");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { canCallAI, runOnce, generateWithRetry } = require("../utils/aiUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: get user's latest resume analysis
async function getLatestResume(userId) {
	return Resume.findOne({ userId }).sort({ createdAt: -1 }).lean();
}

// Helper: call Gemini with text prompt
async function askGemini(prompt) {
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
	const result = await generateWithRetry(model, prompt, 2);
	const text = result.response.text();
	const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
	try {
		return JSON.parse(cleaned);
	} catch {
		const match = cleaned.match(/\{[\s\S]*\}/);
		if (match) return JSON.parse(match[0]);
		throw new Error("Could not parse Gemini response: " + cleaned.substring(0, 200));
	}
}

// ─── LEARNING PATH ─────────────────────────────────────────────────────────────
// GET /api/content/learning-path
exports.getLearningPath = async (req, res) => {
	try {
		const resume = await getLatestResume(req.userId);
		if (!resume) return res.status(404).json({ message: "No resume found. Please upload first." });

		// Check cache first to avoid locks/cooldowns optionally, but it's checked below too.
		// However, it's fine.

		if (!canCallAI(req.userId, "learning-path", 15000)) {
			return res.status(429).json({ message: "Too many AI requests. Please wait a few seconds." });
		}

		// Use in-flight lock to deduplicate concurrent requests
		const data = await runOnce(`learning-path-${req.userId}`, async () => {
			if (resume.learningPathData) {
				console.log(`[Cache] Returning cached Learning Path for resume ${resume._id}`);
				return resume.learningPathData;
			}

		const { analysisData } = resume;
		const knownSkills = (analysisData?.extractedSkills ?? []).join(", ") || "general web development skills";
		const missingSkills = [
			...(analysisData?.missingKeywords?.technical ?? []),
			...(analysisData?.missingKeywords?.tools ?? []),
		].join(", ") || "advanced frameworks and deployment";
		const learningPath = (analysisData?.learningPath ?? []).join(", ");
		const careerGoal = (analysisData?.careerSuggestions?.[0]) ?? "Full Stack Developer";

		const prompt = `
You are an expert software engineering career coach. Based on this candidate's resume analysis, generate a personalized learning path.

CANDIDATE DATA:
- Known skills: ${knownSkills}
- Missing skills: ${missingSkills}
- Recommended courses per analysis: ${learningPath}
- Career goal: ${careerGoal}
- Overall resume score: ${analysisData?.overallScore ?? 60}/100

Return ONLY valid JSON with this exact structure (no markdown):
{
  "currentLevel": {
    "title": "YOUR CURRENT LEVEL (Based on Resume)",
    "known": ["<skill they have>", ...],
    "missing": ["<skill gap>", ...]
  },
  "learningSteps": [
    {
      "id": 1,
      "title": "<topic title>",
      "importance": "<optional: 'VERY IMPORTANT' or 'CRITICAL 🚨'>",
      "topics": ["<subtopic>", ...],
      "courses": [{"name": "<course name>", "tag": "<optional: Free/Paid>"}],
      "personalNote": {"text": "<personalized advice>", "items": ["<item>"]}
    }
  ],
  "recommendedCombination": [
    {"area": "<area>", "course": "<course recommendation>"}
  ],
  "weeklyPlan": [
    {"weeks": "Week 1-3", "task": "<task>"}
  ],
  "finalAdvice": {
    "strengths": ["<strength>", ...],
    "focusOn": ["<focus area>", ...]
  }
}
Generate 6-8 learning steps relevant to the candidate's actual skills and gaps.
`;

		const data = await askGemini(prompt);

		// Save to cache
		await Resume.findByIdAndUpdate(resume._id, { learningPathData: data });
		return data;
		});

		res.json(data);
	} catch (err) {
		console.error("Learning path error:", err.message);
		if (err.message && err.message.includes("429")) {
			return res.status(429).json({ message: "AI rate limit reached. Please wait a minute and try again." });
		}
		res.status(500).json({ message: "Failed to generate learning path: " + err.message });
	}
};

// ─── CAREER PATH ──────────────────────────────────────────────────────────────
// GET /api/content/career-path
exports.getCareerPath = async (req, res) => {
	try {
		const resume = await getLatestResume(req.userId);
		if (!resume) return res.status(404).json({ message: "No resume found. Please upload first." });

		if (!canCallAI(req.userId, "career-path", 15000)) {
			return res.status(429).json({ message: "Too many AI requests. Please wait a few seconds." });
		}

		// Use in-flight lock to deduplicate concurrent requests
		const data = await runOnce(`career-path-${req.userId}`, async () => {
			if (resume.careerPathData) {
				console.log(`[Cache] Returning cached Career Path for resume ${resume._id}`);
				return resume.careerPathData;
			}

		const { analysisData } = resume;
		const knownSkills = (analysisData?.extractedSkills ?? []).join(", ") || "web development";
		const careerSuggestions = (analysisData?.careerSuggestions ?? ["Full Stack Developer", "Frontend Developer", "Software Engineer"]).join(", ");
		const overallScore = analysisData?.overallScore ?? 60;
		const topRole = analysisData?.topMatchRole ?? "Full Stack Developer";
		const topPct = analysisData?.topMatchPercentage ?? 65;

		const prompt = `
You are a tech career advisor. Based on this resume analysis, generate a personalized career path guide.

CANDIDATE DATA:
- Known skills: ${knownSkills}
- Career suggestions from AI: ${careerSuggestions}
- Best matching role: ${topRole} (${topPct}% match)
- Resume score: ${overallScore}/100

Return ONLY valid JSON with this exact structure (no markdown):
{
  "careerPaths": [
    {
      "id": 1,
      "title": "<role title>",
      "tag": "<e.g. BEST FIT / SAFE PATH / General SDE>",
      "icon": "<single emoji>",
      "hook": "<one-line reason for this path>",
      "sections": [
        {"title": "Why?", "subtitle": "<optional>", "items": ["<item>"], "text": "<optional>"},
        {"title": "Roles you can target:", "items": ["<role>"]},
        {"title": "Growth:", "text": "Junior → SDE → Senior → Lead"}
      ]
    }
  ],
  "notIdealPaths": [
    {"role": "<role>", "reason": "<why not ideal right now>"}
  ],
  "strategy": {
    "rules": ["<rule 1>", "<rule 2>"],
    "recommendation": {
      "primary": "<primary career path>",
      "secondary": "<secondary / backup path>"
    }
  },
  "nextSteps": [
    {
      "title": "<step title>",
      "subtext": "<optional note>",
      "actions": ["<action>", ...]
    }
  ]
}
Generate 3 career paths (best fit first), 2-3 not-ideal paths, and 4 next steps. Be specific to the candidate's skills.
`;

		console.log(`[AI] Generating Career Path for resume ${resume._id}...`);
		const data = await askGemini(prompt);

		// Save to cache
		await Resume.findByIdAndUpdate(resume._id, { careerPathData: data });
		return data;
		});

		res.json(data);
	} catch (err) {
		console.error("Career path error:", err.message);
		if (err.message && err.message.includes("429")) {
			return res.status(429).json({ message: "AI rate limit reached. Please wait a minute and try again." });
		}
		res.status(500).json({ message: "Failed to generate career path: " + err.message });
	}
};

// ─── COVER LETTER ─────────────────────────────────────────────────────────────
// GET /api/content/cover-letter
exports.getCoverLetter = async (req, res) => {
	try {
		const resume = await getLatestResume(req.userId);
		if (!resume) return res.status(404).json({ message: "No resume found. Please upload first." });

		if (!canCallAI(req.userId, "cover-letter", 15000)) {
			return res.status(429).json({ message: "Too many AI requests. Please wait a few seconds." });
		}

		// Use in-flight lock to deduplicate concurrent requests
		const data = await runOnce(`cover-letter-${req.userId}`, async () => {
			if (resume.coverLetterData) {
				console.log(`[Cache] Returning cached Cover Letter for resume ${resume._id}`);
				return resume.coverLetterData;
			}

		const { analysisData, resumeText, fileName } = resume;
		const skills = (analysisData?.extractedSkills ?? []).slice(0, 10).join(", ") || "web development";
		const targetRole = analysisData?.careerSuggestions?.[0] ?? "Software Developer";
		const topRole = analysisData?.topMatchRole ?? targetRole;

		// Get user name from User model
		const User = require("../models/User");
		const user = await User.findById(req.userId).select("name email").lean();
		const userName = user?.name ?? "Applicant";
		const userEmail = user?.email ?? "";

		const resumeSnippet = resumeText ? resumeText.substring(0, 1500) : "No resume text available";

		const prompt = `
You are a professional resume writer. Generate a tailored cover letter for this candidate.

CANDIDATE DATA:
- Name: ${userName}
- Email: ${userEmail}
- Known skills: ${skills}
- Target role: ${topRole}
- Resume score: ${analysisData?.overallScore ?? 60}/100
- Resume text excerpt: ${resumeSnippet}

Return ONLY valid JSON with this exact structure (no markdown):
{
  "subject": "Application for ${topRole} Position",
  "salutation": "Dear Hiring Manager,",
  "paragraphs": [
    "<opening paragraph: express interest and introduce yourself>",
    "<experience paragraph: highlight key experience/internships from resume>",
    "<project paragraph: mention a key project with tech stack>",
    "<skills paragraph: summarize technical skills>",
    "<closing paragraph: enthusiasm and call to action>",
    "<thank you line>"
  ],
  "signOff": "Sincerely,",
  "signature": {
    "name": "${userName}",
    "email": "${userEmail}"
  }
}
Make the letter professional, personalized, and specific to the candidate's actual resume content. 4-5 strong paragraphs.
`;

		console.log(`[AI] Generating Cover Letter for resume ${resume._id}...`);
		const data = await askGemini(prompt);

		// Save to cache
		await Resume.findByIdAndUpdate(resume._id, { coverLetterData: data });
		return data;
		});

		res.json(data);
	} catch (err) {
		console.error("Cover letter error:", err.message);
		if (err.message && err.message.includes("429")) {
			return res.status(429).json({ message: "AI rate limit reached. Please wait a minute and try again." });
		}
		res.status(500).json({ message: "Failed to generate cover letter: " + err.message });
	}
};

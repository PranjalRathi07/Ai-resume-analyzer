/** @format */

const Resume = require("../models/Resume");

// Helper: get user's latest resume analysis
async function getLatestResume(userId) {
	return Resume.findOne({ userId }).sort({ createdAt: -1 }).lean();
}

// ─── LEARNING PATH ─────────────────────────────────────────────────────────────
// GET /api/content/learning-path
exports.getLearningPath = async (req, res) => {
	try {
		const resume = await getLatestResume(req.userId);
		if (!resume) return res.status(404).json({ message: "No resume found. Please upload first." });

		if (resume.learningPathData) {
			console.log(`[Cache] Returning cached Learning Path for resume ${resume._id}`);
			return res.json(resume.learningPathData);
		}

		console.log(`[Static] Generating Learning Path locally for resume ${resume._id}...`);
		
		const { analysisData } = resume;
		const knownArray = analysisData?.extractedSkills || ["Web Development Basics"];
		const missingArray = [
			...(analysisData?.missingKeywords?.technical ?? []),
			...(analysisData?.missingKeywords?.tools ?? []),
		];
		if (missingArray.length === 0) missingArray.push("Advanced Frameworks", "Cloud Deployment");
		
		const learningTopics = analysisData?.learningPath ?? ["Foundations", "Advanced Concepts", "Projects"];
		const careerGoal = (analysisData?.careerSuggestions?.[0]) ?? "Full Stack Developer";

		const data = {
			currentLevel: {
				title: `Aspiring ${careerGoal}`,
				known: knownArray.slice(0, 10),
				missing: missingArray.slice(0, 8)
			},
			learningSteps: learningTopics.slice(0, 6).map((topic, index) => ({
				id: index + 1,
				title: topic,
				importance: index === 0 ? "CRITICAL 🚨" : (index <= 2 ? "VERY IMPORTANT" : ""),
				topics: [`Core principles of ${topic}`, `Libraries and Tools for ${topic}`, `Best Practices`],
				courses: [{ name: `Comprehensive ${topic} Guide`, tag: index % 2 === 0 ? "Free" : "Recommended" }],
				personalNote: { 
					text: `Prioritize this to strengthen your profile for ${careerGoal} roles.`, 
					items: [`Practice building a mini-project focusing on ${topic}.`] 
				}
			})),
			recommendedCombination: [
				{ area: "Core Foundations", course: `${learningTopics[0] || "Programming"} Masterclass` },
				{ area: "Advanced Skills", course: `${learningTopics[1] || "Frameworks"} Deep Dive` }
			],
			weeklyPlan: [
				{ weeks: "Week 1-2", task: `Focus entirely on grasping ${learningTopics[0]}` },
				{ weeks: "Week 3-4", task: `Build 2 projects using ${learningTopics[1]} and integrate with previous skills` },
				{ weeks: "Week 5-6", task: `Review missing gaps like ${missingArray[0] || "Testing"}` }
			],
			finalAdvice: {
				strengths: knownArray.slice(0, 3),
				focusOn: missingArray.slice(0, 3)
			}
		};

		// Save to cache
		await Resume.findByIdAndUpdate(resume._id, { learningPathData: data });

		res.json(data);
	} catch (err) {
		console.error("Learning path error:", err.message);
		res.status(500).json({ message: "Failed to generate learning path: " + err.message });
	}
};

// ─── CAREER PATH ──────────────────────────────────────────────────────────────
// GET /api/content/career-path
exports.getCareerPath = async (req, res) => {
	try {
		const resume = await getLatestResume(req.userId);
		if (!resume) return res.status(404).json({ message: "No resume found. Please upload first." });

		if (resume.careerPathData) {
			console.log(`[Cache] Returning cached Career Path for resume ${resume._id}`);
			return res.json(resume.careerPathData);
		}

		console.log(`[Static] Generating Career Path locally for resume ${resume._id}...`);
		
		const { analysisData } = resume;
		const careerSuggestions = analysisData?.careerSuggestions ?? ["Software Engineer", "Frontend Developer", "Backend Developer"];
		const topRole = analysisData?.topMatchRole ?? careerSuggestions[0] ?? "Software Developer";
		const topPct = analysisData?.topMatchPercentage ?? 70;

		const data = {
			careerPaths: careerSuggestions.slice(0, 3).map((role, idx) => ({
				id: idx + 1,
				title: role,
				tag: idx === 0 ? "BEST FIT" : (idx === 1 ? "SAFE PATH" : "ALTERNATIVE"),
				icon: idx === 0 ? "🌟" : (idx === 1 ? "🚀" : "💡"),
				hook: idx === 0 ? `Strong ${topPct}% match based on your core skills.` : `A viable secondary career path to consider.`,
				sections: [
					{ title: "Why?", items: [`Leverages your existing background in tech.`], text: "A highly demanded role in the current market." },
					{ title: "Roles you can target:", items: [`Junior ${role}`, `Mid-level ${role}`] },
					{ title: "Growth:", text: `Associate ${role} → ${role} → Senior ${role} → Technical Lead` }
				]
			})),
			notIdealPaths: [
				{ role: "Product Manager", reason: "Requires more cross-functional leading experience than currently shown on your resume." },
				{ role: "Data Scientist", reason: "Lacking heavy statistical and machine learning academic background." }
			],
			strategy: {
				rules: ["Keep building hands-on projects", "Iterate on missing skills rapidly", "Focus on impact-driven bullet points"],
				recommendation: {
					primary: topRole,
					secondary: careerSuggestions[1] ?? "Quality Assurance Engineer"
				}
			},
			nextSteps: [
				{ title: "Fill Key Gaps", subtext: "Urgent", actions: ["Learn the missing frameworks identified in your analysis"] },
				{ title: "Update Resume", subtext: "Before applying", actions: ["Incorporate the targeted keywords we recommended"] },
				{ title: "Apply Actively", subtext: "Target 5-10 apps/week", actions: [`Search for ${topRole} roles on LinkedIn and Indeed`] }
			]
		};

		// Save to cache
		await Resume.findByIdAndUpdate(resume._id, { careerPathData: data });

		res.json(data);
	} catch (err) {
		console.error("Career path error:", err.message);
		res.status(500).json({ message: "Failed to generate career path: " + err.message });
	}
};

// ─── COVER LETTER ─────────────────────────────────────────────────────────────
// GET /api/content/cover-letter
exports.getCoverLetter = async (req, res) => {
	try {
		const resume = await getLatestResume(req.userId);
		if (!resume) return res.status(404).json({ message: "No resume found. Please upload first." });

		if (resume.coverLetterData) {
			console.log(`[Cache] Returning cached Cover Letter for resume ${resume._id}`);
			return res.json(resume.coverLetterData);
		}

		console.log(`[Static] Generating Cover Letter locally for resume ${resume._id}...`);

		const { analysisData } = resume;
		const skills = (analysisData?.extractedSkills ?? []).slice(0, 6).join(", ") || "problem-solving and software development";
		const targetRole = analysisData?.careerSuggestions?.[0] ?? "Software Developer";
		const topRole = analysisData?.topMatchRole ?? targetRole;

		// Get user name from User model
		const User = require("../models/User");
		const user = await User.findById(req.userId).select("name email").lean();
		const userName = user?.name ?? "Applicant";
		const userEmail = user?.email ?? "";

		const data = {
			subject: `Application for ${topRole} Position`,
			salutation: "Dear Hiring Manager,",
			paragraphs: [
				`I am writing to express my strong interest in the ${topRole} position at your company. With a solid foundation in technology and a drive for creating effective solutions, I am confident in my ability to contribute meaningfully to your engineering team.`,
				`Throughout my background, I have developed professional experience that aligns with the core requirements of this role. I consider myself a highly adaptable professional with a proven track record of continuously improving my technical depth and collaborating extensively to overcome complex challenges.`,
				`Particularly, my expertise in ${skills} has equipped me to build robust applications and scale effectively. Some highlights of my background include optimizing existing systems and quickly adapting to modern frameworks, matching specifically what an innovative company looks for.`,
				`I am highly enthusiastic about the possibility of bringing my unique blend of technical expertise and problem-solving skills to your team. Enclosed is my resume which details my background further.`,
				`Thank you for your time and consideration. I look forward to the opportunity to discuss my qualifications.`
			],
			signOff: "Sincerely,",
			signature: {
				name: userName,
				email: userEmail
			}
		};

		// Save to cache
		await Resume.findByIdAndUpdate(resume._id, { coverLetterData: data });

		res.json(data);
	} catch (err) {
		console.error("Cover letter error:", err.message);
		res.status(500).json({ message: "Failed to generate cover letter: " + err.message });
	}
};

/** @format */
import { motion } from "framer-motion";

interface CurrentLevelData {
	title: string;
	known: string[];
	missing: string[];
}

interface Course {
	name: string;
	tag?: string;
}

interface PersonalNote {
	text: string;
	items?: string[];
}

interface LearningStep {
	id: number;
	title: string;
	importance?: string;
	topics: string[];
	courses?: Course[];
	personalNote?: PersonalNote;
}

interface RecommendedCourse {
	area: string;
	course: string;
}

interface WeekPlan {
	weeks: string;
	task: string;
}

interface LearningPathData {
	currentLevel: CurrentLevelData;
	learningSteps: LearningStep[];
	recommendedCombination: RecommendedCourse[];
	weeklyPlan: WeekPlan[];
	finalAdvice: {
		strengths: string[];
		focusOn: string[];
	};
}

const learningPathData: LearningPathData = {
	currentLevel: {
		title: "YOUR CURRENT LEVEL (Based on Resume)",
		known: [
			"React + Node + MongoDB",
			"Built full-stack project",
			"Internships (huge advantage 🔥)",
		],
		missing: [
			"Advanced React (hooks, optimization)",
			"Backend architecture (scalable APIs)",
			"System design basics",
			"Production-level deployment",
			"Testing & security",
		],
	},
	learningSteps: [
		{
			id: 1,
			title: "JavaScript (Advanced Level)",
			topics: [
				"Closures, Hoisting",
				"Event Loop",
				"Promises, Async/Await",
				"ES6+ (destructuring, spread, modules)",
			],
			courses: [
				{ name: "freeCodeCamp – JavaScript Algorithms course", tag: "Free" },
				{ name: "Frontend Masters – Advanced JS", tag: "Paid but 🔥" },
			],
		},
		{
			id: 2,
			title: "Advanced React",
			importance: "VERY IMPORTANT",
			topics: [
				"Custom Hooks",
				"Context API / Zustand",
				"Performance optimization (memo, lazy)",
				"Routing (React Router)",
				"Component architecture",
			],
			courses: [
				{ name: "Scrimba – React Course" },
				{ name: 'Udemy – "React - The Complete Guide" by Maximilian' },
			],
			personalNote: {
				text: "You already used React → now focus on:",
				items: [
					"Reusable components (you did this 👍)",
					"Performance optimization (important for interviews)",
				],
			},
		},
		{
			id: 3,
			title: "Backend (Node + Express Deep Dive)",
			topics: [
				"REST API design",
				"MVC architecture",
				"Authentication (JWT, OAuth)",
				"Middleware",
				"Error handling",
				"File uploads",
			],
			courses: [
				{ name: "Udemy – Node.js Bootcamp by Jonas Schmedtmann" },
				{ name: "freeCodeCamp – Backend APIs course" },
			],
		},
		{
			id: 4,
			title: "Database (MongoDB + Beyond)",
			topics: [
				"Aggregation pipeline",
				"Indexing",
				"Schema design",
				"Relations (NoSQL thinking)",
			],
			courses: [
				{ name: "MongoDB University – Free courses", tag: "BEST for Mongo" },
			],
		},
		{
			id: 5,
			title: "Full Stack Integration (REAL PROJECTS)",
			topics: [
				"🔹 E-commerce app",
				"🔹 Social media app",
				"🔹 SaaS dashboard (best for your profile)",
			],
			personalNote: {
				text: "THIS is where you grow fast. Use:",
				items: ["Redux or Zustand", "Axios", "Socket.IO"],
			},
		},
		{
			id: 6,
			title: "Authentication & Security",
			topics: [
				"JWT auth",
				"Password hashing (bcrypt)",
				"Rate limiting",
				"XSS, CORS",
			],
			personalNote: {
				text: "This is what separates beginners from professionals",
			},
		},
		{
			id: 7,
			title: "Deployment",
			importance: "CRITICAL 🚨",
			topics: ["CI/CD basics", "Hosting frontend + backend"],
			personalNote: {
				text: "Platforms to use:",
				items: ["Vercel (Frontend)", "Render (Backend)", "MongoDB Atlas"],
			},
		},
		{
			id: 8,
			title: "System Design (Starter Level)",
			topics: ["How apps scale", "Load balancing basics", "Database design"],
			courses: [{ name: "Scaler (YouTube free system design)" }],
		},
		{
			id: 9,
			title: "DSA (for interviews)",
			topics: ["Arrays, HashMap, Sliding Window"],
			personalNote: {
				text: "You already did DSA 👍 → Now practice:",
				items: ["LeetCode (daily 1–2 problems)"],
			},
		},
	],
	recommendedCombination: [
		{ area: "React", course: "Scrimba / Udemy" },
		{ area: "Backend", course: "Jonas Node course" },
		{ area: "Mongo", course: "MongoDB University" },
		{ area: "Practice", course: "Build 2 big projects" },
		{ area: "Deploy", course: "Deploy everything" },
	],
	weeklyPlan: [
		{ weeks: "Week 1–3", task: "Advanced React + performance" },
		{ weeks: "Week 4–6", task: "Backend architecture + auth" },
		{ weeks: "Week 7–10", task: "Build BIG project (SaaS dashboard 🔥)" },
		{ weeks: "Week 11–12", task: "Deployment + polish + resume update" },
	],
	finalAdvice: {
		strengths: ["Internships ✅", "Full-stack project ✅"],
		focusOn: [
			"1–2 HIGH QUALITY projects (not many small ones)",
			"Clean UI + performance + deployment",
		],
	},
};

const CurrentLevelCard = ({ data }: { data: CurrentLevelData }) => (
	<div className='bg-linear-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-5 rounded-xl'>
		<h2 className='text-lg font-bold text-white flex items-center gap-2 mb-4'>
			🚀 {data.title}
		</h2>
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
			<div className='bg-green-950/30 border border-green-500/20 p-4 rounded-lg'>
				<p className='text-sm font-semibold text-green-400 mb-2'>
					You already know:
				</p>
				<ul className='space-y-2'>
					{data.known.map((item, i) => (
						<li
							key={i}
							className='text-sm text-gray-300 flex items-start gap-2'>
							<span className='text-green-400 shrink-0'>✅</span> {item}
						</li>
					))}
				</ul>
			</div>
			<div className='bg-red-950/30 border border-red-500/20 p-4 rounded-lg'>
				<p className='text-sm font-semibold text-red-400 mb-2'>
					👉 Missing pieces:
				</p>
				<ul className='space-y-2'>
					{data.missing.map((item, i) => (
						<li
							key={i}
							className='text-sm text-gray-300 flex items-start gap-2'>
							<span className='text-red-400 shrink-0'>❌</span> {item}
						</li>
					))}
				</ul>
			</div>
		</div>
	</div>
);

const LearningStepCard = ({ step }: { step: LearningStep }) => (
	<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10'>
		<div className='flex flex-wrap items-center gap-2 mb-3'>
			<h2 className='text-lg font-bold text-white flex items-center gap-2'>
				🔹 {step.id}. {step.title}
			</h2>
			{step.importance && (
				<span className='text-[10px] md:text-xs font-bold bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30'>
					{step.importance}
				</span>
			)}
		</div>

		<div className='bg-black/20 p-3 rounded-lg border border-white/5 mb-3'>
			<h3 className='font-semibold text-gray-200 text-sm mb-2'>📌 Topics:</h3>
			<ul className='list-disc list-outside ml-4 text-sm text-gray-300 space-y-1'>
				{step.topics.map((topic, i) => (
					<li key={i}>{topic}</li>
				))}
			</ul>
		</div>

		{step.courses && step.courses.length > 0 && (
			<div className='bg-blue-950/20 p-3 rounded-lg border border-blue-500/10 mb-3'>
				<h3 className='font-semibold text-blue-300 text-sm mb-2'>
					🎓 Courses:
				</h3>
				<ul className='space-y-2'>
					{step.courses.map((course, i) => (
						<li
							key={i}
							className='text-sm text-gray-300 flex items-start gap-2'>
							<span className='shrink-0'>•</span>
							<span>
								{course.name}
								{course.tag && (
									<span className='ml-2 text-[10px] md:text-xs font-bold bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded-full'>
										{course.tag}
									</span>
								)}
							</span>
						</li>
					))}
				</ul>
			</div>
		)}

		{step.personalNote && (
			<div className='bg-purple-950/20 p-3 rounded-lg border border-purple-500/10'>
				<p className='text-sm text-purple-300 font-medium mb-1'>
					👉 For YOU: {step.personalNote.text}
				</p>
				{step.personalNote.items && (
					<ul className='list-disc list-outside ml-4 text-sm text-gray-300 space-y-1 mt-2'>
						{step.personalNote.items.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				)}
			</div>
		)}
	</div>
);

const RecommendedCombo = ({ courses }: { courses: RecommendedCourse[] }) => (
	<div className='bg-linear-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/20 p-5 rounded-xl'>
		<h2 className='text-lg font-bold text-white flex items-center gap-2 mb-4'>
			🔥 BEST COURSE COMBINATION
		</h2>
		<p className='text-sm text-yellow-300 mb-4'>
			Follow this clear path without confusion:
		</p>
		<div className='space-y-2'>
			{courses.map((c, i) => (
				<div
					key={i}
					className='flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5'>
					<span className='text-yellow-400 font-bold text-sm bg-yellow-500/20 px-2 py-0.5 rounded shrink-0'>
						{c.area}
					</span>
					<span className='text-sm text-gray-300'>→ {c.course}</span>
				</div>
			))}
		</div>
	</div>
);

const WeeklyPlanCard = ({ plan }: { plan: WeekPlan[] }) => (
	<div className='bg-linear-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 p-5 rounded-xl'>
		<h2 className='text-lg font-bold text-white flex items-center gap-2 mb-4'>
			💡 WHAT YOU SHOULD DO NEXT (PERSONAL PLAN)
		</h2>
		<div className='space-y-3'>
			{plan.map((w, i) => (
				<div
					key={i}
					className='flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5'>
					<span className='text-green-400 shrink-0'>✅</span>
					<div>
						<span className='text-sm font-bold text-blue-300'>{w.weeks}</span>
						<p className='text-sm text-gray-300 mt-0.5'>{w.task}</p>
					</div>
				</div>
			))}
		</div>
	</div>
);

const FinalAdviceCard = ({
	data,
}: {
	data: LearningPathData["finalAdvice"];
}) => (
	<div className='bg-linear-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 p-5 rounded-xl'>
		<h2 className='text-lg font-bold text-white flex items-center gap-2 mb-4'>
			🚀 FINAL ADVICE
			<span className='text-[10px] md:text-xs font-bold bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30'>
				IMPORTANT
			</span>
		</h2>

		<div className='bg-black/20 p-4 rounded-lg border border-white/5 mb-3'>
			<p className='text-sm font-semibold text-green-400 mb-2'>
				You already have:
			</p>
			<ul className='space-y-1'>
				{data.strengths.map((s, i) => (
					<li key={i} className='text-sm text-gray-300'>
						{s}
					</li>
				))}
			</ul>
		</div>

		<div className='bg-purple-950/20 p-4 rounded-lg border border-purple-500/10'>
			<p className='text-sm font-semibold text-purple-300 mb-2'>
				👉 Now focus on:
			</p>
			<ul className='space-y-1'>
				{data.focusOn.map((f, i) => (
					<li key={i} className='text-sm text-gray-300 flex items-start gap-2'>
						<span className='shrink-0'>•</span> {f}
					</li>
				))}
			</ul>
		</div>

		<p className='text-sm text-yellow-300 font-semibold mt-4 text-center'>
			That's what gets jobs. 💼
		</p>
	</div>
);

const Learning_path = () => {
	const data: LearningPathData = learningPathData;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}>
			<div className='border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 backdrop-blur-md rounded-2xl flex flex-col shadow-lg h-min-[calc(100vh-11rem)]'>
				<h1 className='text-center text-2xl font-bold mb-6 underline bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent shrink-0'>
					🧠 COMPLETE MERN STACK LEARNING PATH
				</h1>

				<div className='flex-1 min-h-0 h-full pr-2 no-scrollbar flex flex-col gap-5'>
					<CurrentLevelCard data={data.currentLevel} />

					{data.learningSteps.map((step) => (
						<LearningStepCard key={step.id} step={step} />
					))}

					<RecommendedCombo courses={data.recommendedCombination} />

					<WeeklyPlanCard plan={data.weeklyPlan} />

					<FinalAdviceCard data={data.finalAdvice} />
				</div>
			</div>
		</motion.div>
	);
};

export default Learning_path;

/** @format */
import { motion } from "framer-motion";

const careerPathsData = [
	{
		id: 1,
		title: "Full Stack Developer",
		tag: "BEST FIT",
		icon: "🔥",
		hook: "This is your strongest and most natural path",
		sections: [
			{
				title: "Why?",
				subtitle: "You already know:",
				items: [
					"Frontend → React, Tailwind",
					"Backend → Node.js",
					"Database → MongoDB",
				],
			},
			{
				title: "Roles you can target:",
				items: [
					"Full Stack Developer (Fresher)",
					"MERN Stack Developer",
					"Software Engineer (Web)",
				],
			},
			{
				title: "Growth:",
				text: "Junior → SDE → Senior → Tech Lead",
			},
		],
	},
	{
		id: 2,
		title: "Frontend Developer",
		tag: "SAFE + FAST JOB PATH",
		icon: "🔥",
		hook: "If you want faster placement",
		sections: [
			{
				title: "Why?",
				subtitle: "Your React skills + UI work are solid",
				items: ["You’ve built reusable components"],
			},
			{
				title: "Focus:",
				items: [
					"Advanced React",
					"Animations (you’re already exploring this 👀)",
					"Performance + UI/UX polish",
				],
			},
		],
	},
	{
		id: 3,
		title: "Software Engineer",
		tag: "General SDE Role",
		icon: "⚡",
		hook: "If you improve DSA",
		sections: [
			{
				title: "Why?",
				subtitle: "Companies like this profile",
				items: ["You’re already learning DSA + Java"],
			},
			{
				title: "Requirement:",
				items: ["Strong DSA", "Problem solving (LeetCode)", "System basics"],
			},
		],
	},
];

const notIdealPaths = [
	{ role: "Data Science", reason: "no Python/stats focus" },
	{ role: "DevOps", reason: "no cloud/infra yet" },
	{ role: "AI/ML", reason: "no math/ML base yet" },
];

const jobSuggestionData = {
	strategy: {
		rules: [
			"Don’t confuse yourself with multiple paths",
			"Pick ONE primary + ONE secondary",
		],
		recommendation: {
			primary: "Full Stack Developer",
			secondary: "Frontend Developer (backup for quick job)",
		},
	},
	nextSteps: [
		{
			title: "Strengthen your profile",
			actions: [
				"Build 2–3 advanced projects",
				"Auth system (JWT)",
				"Real-time app (chat / notifications)",
				"Dashboard (like your internship work)",
			],
		},
		{
			title: "Improve DSA (for better companies)",
			actions: [
				"Arrays, Strings, Sliding Window (you already touched this)",
				"Target: 150–200 questions",
			],
		},
		{
			title: "Portfolio Website",
			subtext: "One-page smooth scroll (you were asking earlier 😉)",
			actions: ["Show: Projects, Skills, Experience"],
		},
		{
			title: "Apply smartly",
			actions: ["Start with:", "Startups", "Internships → PPO", "Remote roles"],
		},
	],
};

const CareerPath = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 h-[calc(100vh-11rem)] rounded-2xl'>
				{/* Career Path Section */}
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col shadow-lg overflow-hidden'>
					<h1 className='text-center text-2xl font-bold mb-6 underline bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent shrink-0'>
						Career Path
					</h1>
					<div className='flex-1 min-h-0 h-full overflow-y-auto pr-2 no-scrollbar flex flex-col gap-5'>
						{careerPathsData.map((path) => (
							<div
								key={path.id}
								className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10'>
								<div className='flex flex-wrap items-center gap-2 mb-1'>
									<h2 className='text-xl font-bold text-white flex items-center gap-2'>
										{path.icon} {path.id}. {path.title}
									</h2>
									<span className='text-[10px] md:text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30'>
										{path.tag}
									</span>
								</div>
								<p className='text-sm text-purple-300 font-medium mb-4'>
									👉 {path.hook}
								</p>

								<div className='space-y-4'>
									{path.sections.map((sec, idx) => (
										<div
											key={idx}
											className='bg-black/20 p-3 rounded-lg border border-white/5'>
											<h3 className='font-semibold text-gray-200 text-sm'>
												{sec.title}
											</h3>
											{sec.subtitle && (
												<p className='text-xs text-gray-400 mt-1 mb-2'>
													{sec.subtitle}
												</p>
											)}
											{sec.items && (
												<ul className='list-disc list-outside ml-4 text-sm text-gray-300 mt-1 space-y-1'>
													{sec.items.map((item, i) => (
														<li key={i}>{item}</li>
													))}
												</ul>
											)}
											{sec.text && (
												<p className='text-sm text-gray-300 mt-1'>{sec.text}</p>
											)}
										</div>
									))}
								</div>
							</div>
						))}

						{/* Not Ideal Section */}
						<div className='bg-red-500/5 border border-red-500/20 p-5 rounded-xl'>
							<h2 className='text-lg font-bold text-red-400 flex items-center gap-2 mb-3'>
								❌ Not ideal for you (right now)
							</h2>
							<div className='flex flex-col gap-3'>
								{notIdealPaths.map((path, idx) => (
									<div
										key={idx}
										className='flex items-start md:items-center gap-2 text-sm text-gray-300 bg-red-950/20 p-2 rounded-lg'>
										<span className='text-red-300 font-semibold w-28 shrink-0 flex items-center h-full'>
											{path.role}
										</span>
										<span className='text-gray-400 text-xs md:text-sm flex-1'>
											❌ {path.reason}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Job Suggestion Section */}
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col shadow-lg overflow-hidden'>
					<h1 className='text-center text-2xl font-bold mb-6 underline bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent shrink-0'>
						Job Suggestion
					</h1>
					<div className='flex-1 min-h-0 h-full overflow-y-auto pr-2 no-scrollbar flex flex-col gap-5'>
						{/* Strategy */}
						<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10'>
							<div className='flex flex-wrap items-center gap-2 mb-4'>
								<h2 className='text-xl font-bold text-white flex items-center gap-2'>
									🧠 Best Strategy
								</h2>
								<span className='text-[10px] md:text-xs font-bold bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30'>
									IMPORTANT
								</span>
							</div>

							<ul className='space-y-3 mb-5'>
								{jobSuggestionData.strategy.rules.map((rule, idx) => (
									<li
										key={idx}
										className='text-sm text-gray-300 flex items-start gap-2 bg-black/20 p-2 rounded-lg'>
										<span className='shrink-0'>👉</span> {rule}
									</li>
								))}
							</ul>

							<div className='bg-linear-to-br from-blue-900/40 to-purple-900/40 p-4 rounded-xl border border-blue-500/20'>
								<p className='text-sm font-semibold text-purple-300 mb-3'>
									💡 My recommendation for YOU:
								</p>
								<div className='space-y-2 flex flex-col'>
									<div className='text-sm text-gray-200 flex items-center flex-wrap gap-2'>
										<span className='text-blue-400 font-bold bg-blue-500/20 px-2 py-0.5 rounded'>
											🎯 Primary
										</span>
										{jobSuggestionData.strategy.recommendation.primary}
									</div>
									<div className='text-sm text-gray-200 flex items-center flex-wrap gap-2'>
										<span className='text-yellow-400 font-bold bg-yellow-500/20 px-2 py-0.5 rounded'>
											⚡ Secondary
										</span>
										{jobSuggestionData.strategy.recommendation.secondary}
									</div>
								</div>
							</div>
						</div>

						{/* Next Steps */}
						<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10'>
							<div className='flex flex-wrap items-center gap-2 mb-5'>
								<h2 className='text-xl font-bold text-white flex items-center gap-2'>
									📈 Your Next Steps
								</h2>
								<span className='text-[10px] md:text-xs font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30'>
									Very Practical
								</span>
							</div>

							<div className='space-y-4'>
								{jobSuggestionData.nextSteps.map((step, idx) => (
									<div
										key={idx}
										className='relative flex items-start flex-col xl:flex-row gap-4 p-4 bg-black/20 rounded-xl border border-white/5'>
										<div className='h-8 w-8 shrink-0 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]'>
											{idx + 1}
										</div>
										<div className='flex-1 mt-1'>
											<h3 className='font-semibold text-gray-100 flex items-center gap-2'>
												Step {idx + 1}: {step.title}
											</h3>
											{step.subtext && (
												<p className='text-xs text-purple-300 mt-1 font-medium'>
													{step.subtext}
												</p>
											)}
											<ul className='list-disc list-outside ml-4 text-sm text-gray-400 mt-3 space-y-1'>
												{step.actions.map((act, i) => (
													<li key={i}>{act}</li>
												))}
											</ul>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CareerPath;

/** @format */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
	BookOpen,
	ChevronDown,
	ChevronUp,
	Loader2,
	Sparkles,
	AlertCircle,
	CheckCircle2,
	XCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Course { name: string; tag?: string; }
interface PersonalNote { text: string; items?: string[]; }
interface LearningStep {
	id: number;
	title: string;
	importance?: string;
	topics: string[];
	courses?: Course[];
	personalNote?: PersonalNote;
}
interface LearningPathData {
	currentLevel: { title: string; known: string[]; missing: string[] };
	learningSteps: LearningStep[];
	recommendedCombination: { area: string; course: string }[];
	weeklyPlan: { weeks: string; task: string }[];
	finalAdvice: { strengths: string[]; focusOn: string[] };
}

// ── Collapsible Card ──────────────────────────────────────────────────────────
const CollapseCard = ({
	children,
	defaultOpen = true,
	header,
}: {
	children: React.ReactNode;
	defaultOpen?: boolean;
	header: React.ReactNode;
}) => {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className='bg-white/5 border border-white/10 rounded-xl overflow-hidden'>
			<button
				onClick={() => setOpen((o) => !o)}
				className='w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition'>
				{header}
				{open ? (
					<ChevronUp size={16} className='text-slate-400 shrink-0' />
				) : (
					<ChevronDown size={16} className='text-slate-400 shrink-0' />
				)}
			</button>
			{open && <div className='px-5 pb-5'>{children}</div>}
		</div>
	);
};

// ── Empty / Error / Loading states ─────────────────────────────────────────────
const EmptyState = () => (
	<div className='flex flex-col items-center justify-center gap-4 py-16 text-center'>
		<div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5'>
			<BookOpen size={28} className='text-emerald-400' />
		</div>
		<div>
			<h3 className='text-lg font-bold text-white mb-1'>No Resume Analyzed Yet</h3>
			<p className='text-slate-400 text-sm max-w-xs'>
				Upload your resume on the home page first. Your personalized learning path will appear here.
			</p>
		</div>
		<Link
			to='/'
			className='flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500 transition'>
			<Sparkles size={15} /> Analyze My Resume
		</Link>
	</div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const LearningPath = () => {
	const [data, setData] = useState<LearningPathData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [noResume, setNoResume] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			const hasLocalAnalysis = localStorage.getItem("resumeAnalysis");
			if (!token || !hasLocalAnalysis) {
				setNoResume(true);
				setLoading(false);
				return;
			}
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/learning-path`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.status === 404) { setNoResume(true); setLoading(false); return; }
				const json = await res.json();
				if (!res.ok) throw new Error(json.message || "Failed to load");
				setData(json);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : "Something went wrong");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}>
			<div className='border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 backdrop-blur-md rounded-2xl flex flex-col shadow-lg'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6 shrink-0'>
					<h1 className='text-xl sm:text-2xl font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
						Your Learning Path
					</h1>
					{loading && (
						<div className='flex items-center gap-2 text-sm text-slate-400'>
							<Loader2 size={15} className='animate-spin' />
							Generating with AI…
						</div>
					)}
				</div>

				{loading ? (
					<div className='flex flex-col items-center justify-center gap-4 py-20'>
						<div className='relative'>
							<div className='h-16 w-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin' />
							<Sparkles size={20} className='absolute inset-0 m-auto text-emerald-300' />
						</div>
						<p className='text-slate-300 font-medium'>Generating your personalized learning path…</p>
						<p className='text-slate-500 text-sm'>This uses Gemini AI — takes ~10 seconds</p>
					</div>
				) : noResume ? (
					<EmptyState />
				) : error ? (
					<div className='flex flex-col items-center gap-3 py-10'>
						<AlertCircle size={32} className='text-red-400' />
						<p className='text-red-300 text-sm text-center'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='text-xs text-slate-400 underline hover:text-white'>
							Retry
						</button>
					</div>
				) : data ? (
					<div className='flex flex-col gap-4'>
						{/* Current Level */}
						<CollapseCard
							header={
								<h2 className='text-base font-bold text-white flex items-center gap-2'>
									🚀 {data.currentLevel.title}
								</h2>
							}>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-1'>
								<div className='bg-green-950/30 border border-green-500/20 p-4 rounded-lg'>
									<p className='text-sm font-semibold text-green-400 mb-2'>You already know:</p>
									<ul className='space-y-1'>
										{data.currentLevel.known.map((item, i) => (
											<li key={i} className='text-sm text-gray-300 flex items-start gap-2'>
												<CheckCircle2 size={14} className='text-green-400 shrink-0 mt-0.5' /> {item}
											</li>
										))}
									</ul>
								</div>
								<div className='bg-red-950/30 border border-red-500/20 p-4 rounded-lg'>
									<p className='text-sm font-semibold text-red-400 mb-2'>👉 Missing pieces:</p>
									<ul className='space-y-1'>
										{data.currentLevel.missing.map((item, i) => (
											<li key={i} className='text-sm text-gray-300 flex items-start gap-2'>
												<XCircle size={14} className='text-red-400 shrink-0 mt-0.5' /> {item}
											</li>
										))}
									</ul>
								</div>
							</div>
						</CollapseCard>

						{/* Learning Steps */}
						{data.learningSteps.map((step) => (
							<CollapseCard
								key={step.id}
								defaultOpen={step.id <= 2}
								header={
									<div className='flex items-center gap-2 flex-wrap'>
										<h2 className='text-base font-bold text-white'>
											🔹 {step.id}. {step.title}
										</h2>
										{step.importance && (
											<span className='text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30'>
												{step.importance}
											</span>
										)}
									</div>
								}>
								<div className='space-y-3 mt-1'>
									<div className='bg-black/20 p-3 rounded-lg border border-white/5'>
										<h3 className='font-semibold text-gray-200 text-sm mb-2'>📌 Topics:</h3>
										<ul className='list-disc list-outside ml-4 text-sm text-gray-300 space-y-1'>
											{step.topics.map((t, i) => <li key={i}>{t}</li>)}
										</ul>
									</div>
									{step.courses && step.courses.length > 0 && (
										<div className='bg-blue-950/20 p-3 rounded-lg border border-blue-500/10'>
											<h3 className='font-semibold text-blue-300 text-sm mb-2'>🎓 Courses:</h3>
											<ul className='space-y-1.5'>
												{step.courses.map((c, i) => (
													<li key={i} className='text-sm text-gray-300 flex items-start gap-2'>
														<span className='shrink-0'>•</span>
														<span>
															{c.name}
															{c.tag && (
																<span className='ml-2 text-[10px] font-bold bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded-full'>
																	{c.tag}
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
												<ul className='list-disc list-outside ml-4 text-sm text-gray-300 space-y-1 mt-1'>
													{step.personalNote.items.map((item, i) => <li key={i}>{item}</li>)}
												</ul>
											)}
										</div>
									)}
								</div>
							</CollapseCard>
						))}

						{/* Recommended Combo */}
						<div className='bg-linear-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/20 p-5 rounded-xl'>
							<h2 className='text-base font-bold text-white flex items-center gap-2 mb-3'>
								🔥 BEST COURSE COMBINATION
							</h2>
							<p className='text-sm text-yellow-300 mb-3'>Follow this clear path without confusion:</p>
							<div className='space-y-2'>
								{data.recommendedCombination.map((c, i) => (
									<div key={i} className='flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5'>
										<span className='text-yellow-400 font-bold text-sm bg-yellow-500/20 px-2 py-0.5 rounded shrink-0'>
											{c.area}
										</span>
										<span className='text-sm text-gray-300'>→ {c.course}</span>
									</div>
								))}
							</div>
						</div>

						{/* Weekly Plan */}
						<div className='bg-linear-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 p-5 rounded-xl'>
							<h2 className='text-base font-bold text-white flex items-center gap-2 mb-3'>
								💡 PERSONAL WEEKLY PLAN
							</h2>
							<div className='space-y-2'>
								{data.weeklyPlan.map((w, i) => (
									<div key={i} className='flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5'>
										<CheckCircle2 size={15} className='text-green-400 shrink-0 mt-0.5' />
										<div>
											<span className='text-sm font-bold text-blue-300'>{w.weeks}</span>
											<p className='text-sm text-gray-300 mt-0.5'>{w.task}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Final Advice */}
						<div className='bg-linear-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 p-5 rounded-xl'>
							<h2 className='text-base font-bold text-white flex items-center gap-2 mb-3'>
								🚀 FINAL ADVICE
								<span className='text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30'>
									IMPORTANT
								</span>
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
								<div className='bg-black/20 p-4 rounded-lg border border-white/5'>
									<p className='text-sm font-semibold text-green-400 mb-2'>You already have:</p>
									<ul className='space-y-1'>
										{data.finalAdvice.strengths.map((s, i) => (
											<li key={i} className='text-sm text-gray-300'>{s}</li>
										))}
									</ul>
								</div>
								<div className='bg-purple-950/20 p-4 rounded-lg border border-purple-500/10'>
									<p className='text-sm font-semibold text-purple-300 mb-2'>👉 Now focus on:</p>
									<ul className='space-y-1'>
										{data.finalAdvice.focusOn.map((f, i) => (
											<li key={i} className='text-sm text-gray-300 flex items-start gap-2'>
												<span className='shrink-0'>•</span> {f}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</motion.div>
	);
};

export default LearningPath;

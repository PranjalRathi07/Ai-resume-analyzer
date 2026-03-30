/** @format */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, Sparkles, AlertCircle, Target } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface PathSection {
	title: string;
	subtitle?: string;
	items?: string[];
	text?: string;
}
interface CareerPathItem {
	id: number;
	title: string;
	tag: string;
	icon: string;
	hook: string;
	sections: PathSection[];
}
interface NextStep {
	title: string;
	subtext?: string;
	actions: string[];
}
interface CareerPathData {
	careerPaths: CareerPathItem[];
	notIdealPaths: { role: string; reason: string }[];
	strategy: {
		rules: string[];
		recommendation: { primary: string; secondary: string };
	};
	nextSteps: NextStep[];
}

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = () => (
	<div className='flex flex-col items-center justify-center gap-4 py-12 text-center'>
		<div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5'>
			<Briefcase size={24} className='text-cyan-400' />
		</div>
		<div>
			<h3 className='text-base font-bold text-white mb-1'>
				No Resume Analyzed Yet
			</h3>
			<p className='text-slate-400 text-sm max-w-xs'>
				Upload your resume on the home page to get a personalized career path.
			</p>
		</div>
		<Link
			to='/'
			className='flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition'>
			<Sparkles size={14} /> Analyze My Resume
		</Link>
	</div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const CareerPath = () => {
	const [data, setData] = useState<CareerPathData | null>(null);
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
				const res = await fetch(
					"http://localhost:5000/api/content/career-path",
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				if (res.status === 404) {
					setNoResume(true);
					setLoading(false);
					return;
				}
				const json = await res.json();
				if (!res.ok) throw new Error(json.message || "Failed to load");
				setData(json);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : "Failed to load");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const LoadingSpinner = () => (
		<div className='flex flex-col items-center justify-center gap-4 py-16'>
			<div className='relative'>
				<div className='h-14 w-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin' />
				<Sparkles size={18} className='absolute inset-0 m-auto text-cyan-300' />
			</div>
			<p className='text-slate-300 text-sm font-medium'>
				Generating your career path…
			</p>
		</div>
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 h-[calc(100vh-11rem)] rounded-2xl'>
				{/* ── Left: Career Paths ── */}
				<div className='border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 backdrop-blur-md rounded-2xl flex flex-col shadow-lg overflow-hidden'>
					<h1 className='text-center text-xl sm:text-2xl font-bold mb-5 underline bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent shrink-0'>
						Career Path
					</h1>
					<div className='flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-4'>
						{loading ? (
							<LoadingSpinner />
						) : noResume ? (
							<EmptyState />
						) : error ? (
							<div className='flex flex-col items-center gap-3 py-8'>
								<AlertCircle size={28} className='text-red-400' />
								<p className='text-red-300 text-sm text-center'>{error}</p>
							</div>
						) : data ? (
							<>
								{data.careerPaths.map((path) => (
									<div
										key={path.id}
										className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10'>
										<div className='flex flex-wrap items-center gap-2 mb-1'>
											<h2 className='text-lg font-bold text-white flex items-center gap-2'>
												{path.icon} {path.id}. {path.title}
											</h2>
											<span className='text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30'>
												{path.tag}
											</span>
										</div>
										<p className='text-sm text-purple-300 font-medium mb-4'>
											👉 {path.hook}
										</p>
										<div className='space-y-3'>
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
														<p className='text-sm text-gray-300 mt-1'>
															{sec.text}
														</p>
													)}
												</div>
											))}
										</div>
									</div>
								))}

								{/* Not Ideal */}
								<div className='bg-red-500/5 border border-red-500/20 p-4 rounded-xl'>
									<h2 className='text-base font-bold text-red-400 flex items-center gap-2 mb-3'>
										❌ Not ideal for you (right now)
									</h2>
									<div className='flex flex-col gap-2'>
										{data.notIdealPaths.map((path, idx) => (
											<div
												key={idx}
												className='flex items-start md:items-center gap-2 text-sm text-gray-300 bg-red-950/20 p-2 rounded-lg'>
												<span className='text-red-300 font-semibold w-28 shrink-0'>
													{path.role}
												</span>
												<span className='text-gray-400 text-xs flex-1'>
													❌ {path.reason}
												</span>
											</div>
										))}
									</div>
								</div>
							</>
						) : null}
					</div>
				</div>

				{/* ── Right: Job Suggestion ── */}
				<div className='border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 backdrop-blur-md rounded-2xl flex flex-col shadow-lg overflow-hidden'>
					<h1 className='text-center text-xl sm:text-2xl font-bold mb-5 underline bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent shrink-0'>
						Job Suggestion
					</h1>
					<div className='flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-4'>
						{loading ? (
							<LoadingSpinner />
						) : noResume ? (
							<EmptyState />
						) : data ? (
							<>
								{/* Strategy */}
								<div className='bg-white/5 border border-white/10 p-5 rounded-xl'>
									<div className='flex flex-wrap items-center gap-2 mb-4'>
										<h2 className='text-lg font-bold text-white flex items-center gap-2'>
											🧠 Best Strategy
										</h2>
										<span className='text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30'>
											IMPORTANT
										</span>
									</div>
									<ul className='space-y-2 mb-4'>
										{data.strategy.rules.map((rule, idx) => (
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
										<div className='space-y-2'>
											<div className='text-sm text-gray-200 flex items-center flex-wrap gap-2'>
												<span className='text-blue-400 font-bold bg-blue-500/20 px-2 py-0.5 rounded'>
													🎯 Primary
												</span>
												{data.strategy.recommendation.primary}
											</div>
											<div className='text-sm text-gray-200 flex items-center flex-wrap gap-2'>
												<span className='text-yellow-400 font-bold bg-yellow-500/20 px-2 py-0.5 rounded'>
													⚡ Secondary
												</span>
												{data.strategy.recommendation.secondary}
											</div>
										</div>
									</div>
								</div>

								{/* Next Steps */}
								<div className='bg-white/5 border border-white/10 p-5 rounded-xl'>
									<div className='flex flex-wrap items-center gap-2 mb-4'>
										<h2 className='text-lg font-bold text-white flex items-center gap-2'>
											<Target size={18} className='text-green-400' /> Your Next
											Steps
										</h2>
										<span className='text-[10px] font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30'>
											Very Practical
										</span>
									</div>
									<div className='space-y-3'>
										{data.nextSteps.map((step, idx) => (
											<div
												key={idx}
												className='flex items-start gap-3 p-4 bg-black/20 rounded-xl border border-white/5'>
												<div className='h-7 w-7 shrink-0 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-xs'>
													{idx + 1}
												</div>
												<div className='flex-1 mt-0.5'>
													<h3 className='font-semibold text-gray-100 text-sm'>
														Step {idx + 1}: {step.title}
													</h3>
													{step.subtext && (
														<p className='text-xs text-purple-300 mt-0.5 font-medium'>
															{step.subtext}
														</p>
													)}
													<ul className='list-disc list-outside ml-4 text-sm text-gray-400 mt-2 space-y-1'>
														{step.actions.map((act, i) => (
															<li key={i}>{act}</li>
														))}
													</ul>
												</div>
											</div>
										))}
									</div>
								</div>
							</>
						) : null}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CareerPath;

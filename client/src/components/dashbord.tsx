/** @format */
import AnimatedContent from "./ui/AnimatedContent";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect, useRef } from "react";
import {
	Gauge,
	SearchCheck,
	Briefcase,
	BookOpen,
	FileText,
	Sparkles,
	ArrowRight,
	X,
	Download,
	LayoutTemplate,
	Zap,
	Target,
	CheckSquare,
	AlertTriangle,
	Lightbulb,
	MessageSquare,
	Route,
} from "lucide-react";
import { Link } from "react-router-dom";

type CardProps = {
	title: string;
	icon: React.ReactNode;
	badge?: string;
	accent?: string;
	children?: React.ReactNode;
	className?: string;
};

const DashboardCard = ({
	title,
	icon,
	badge,
	accent = "from-violet-500 to-fuchsia-500",
	children,
	className = "",
}: CardProps) => (
	<div
		className={`group relative flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] ${className}`}>
		<div
			className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${accent}`}
		/>
		<div className='mb-4 flex items-center gap-3 shrink-0'>
			<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-inner'>
				{icon}
			</div>
			<div className='flex-1 min-w-0'>
				<h2 className='text-base sm:text-lg font-bold tracking-tight text-white truncate'>
					{title}
				</h2>
				{badge && (
					<span className='mt-0.5 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300'>
						{badge}
					</span>
				)}
			</div>
		</div>
		<div className='flex-1 flex flex-col overflow-y-auto no-scrollbar rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-5 transition-all duration-300 group-hover:bg-black/25'>
			{children}
		</div>
	</div>
);

const anim = (delay = 0) => ({
	distance: 50,
	duration: 0.55,
	ease: "cubic-bezier(0.22, 1, 0.36, 1)" as "cubic-bezier(0.22, 1, 0.36, 1)",
	initialOpacity: 0,
	animateOpacity: true,
	scale: 1 as number,
	threshold: 0.05,
	delay,
});

type AnalysisSection = {
	icon: React.ReactNode;
	title: string;
	score: number;
	color: string;
	barColor: string;
	details: string[];
};

type AnalysisData = {
	overallScore: number;
	verdict: string;
	formatScore: number;
	contentScore: number;
	skillMatchScore: number;
	keywordMatchScore: number;
	missingSectionScore: number;
	extractedSkills: string[];
	missingKeywords: {
		technical: string[];
		tools: string[];
		softSkills: string[];
		domain: string[];
	};
	suggestions: string[];
	missingSections?: string[];
	missingStats: {
		missingSkills: number;
		weakSections: number;
		keywordMatch: string;
	};
	careerSuggestions: string[];
	learningPath: string[];
	topMatchRole: string;
	topMatchPercentage: number;
	atsTips: string[];
};

const buildAnalysisSections = (data: AnalysisData): AnalysisSection[] => [
	{
		icon: <LayoutTemplate size={16} />,
		title: "Format Analysis",
		score: data.formatScore,
		color: "text-blue-300",
		barColor: "from-blue-400 to-violet-500",
		details: data.suggestions.slice(0, 4),
	},
	{
		icon: <Zap size={16} />,
		title: "Content Impact",
		score: data.contentScore,
		color: "text-fuchsia-300",
		barColor: "from-violet-400 to-fuchsia-500",
		details: data.suggestions.slice(1, 5),
	},
	{
		icon: <Target size={16} />,
		title: "Skill Match",
		score: data.skillMatchScore,
		color: "text-cyan-300",
		barColor: "from-cyan-400 to-blue-500",
		details: [
			`${data.extractedSkills.length} skills detected on resume`,
			...(data.missingKeywords.technical.slice(0, 2).map((k) => `Missing: ${k}`)),
			"Add soft skills section for completeness",
		],
	},
	{
		icon: <CheckSquare size={16} />,
		title: "ATS Keyword Check",
		score: data.keywordMatchScore,
		color: "text-emerald-300",
		barColor: "from-emerald-400 to-teal-500",
		details: [
			`${data.missingStats.keywordMatch} keyword match with target JD`,
			...(data.missingKeywords.tools.slice(0, 2).map((k) => `Missing: ${k}`)),
			"Use standard section names like 'Experience'",
		],
	},
	{
		icon: <AlertTriangle size={16} />,
		title: "Missing Sections",
		score: data.missingSectionScore,
		color: "text-orange-300",
		barColor: "from-orange-400 to-pink-500",
		details: data.missingSections && data.missingSections.length > 0 
			? data.missingSections 
			: data.suggestions.slice(-4),
	},
];


type KeywordCategory = {
	title: string;
	color: string;
	badgeColor: string;
	keywords: string[];
};



const atsTips = [
	"Use exact keyword phrases from the job description — ATS matches verbatim.",
	"Avoid putting keywords only in headers or graphics; place them in the body text.",
	"Distribute keywords naturally across multiple sections (Summary, Skills, Experience).",
	"Don't keyword-stuff. Relevance matters more than raw count.",
	"Use both full forms and abbreviations: 'Artificial Intelligence (AI)'.",
];

type ImproveKeywordsModalProps = {
	open: boolean;
	onClose: () => void;
	analysisData?: AnalysisData | null;
};

const ImproveKeywordsModal = ({ open, onClose, analysisData }: ImproveKeywordsModalProps) => {
	const overlayRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	const [animOut, setAnimOut] = useState(false);

	useEffect(() => {
		if (open) {
			setAnimOut(false);
			requestAnimationFrame(() => {
				requestAnimationFrame(() => setVisible(true));
			});
			document.body.style.overflow = "hidden";
		} else {
			setVisible(false);
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const triggerClose = () => {
		setAnimOut(true);
		setVisible(false);
		setTimeout(() => {
			document.body.style.overflow = "";
			onClose();
			setAnimOut(false);
		}, 320);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === overlayRef.current) triggerClose();
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) triggerClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	if (!open && !animOut) return null;

	return (
		<div
			ref={overlayRef}
			onClick={handleOverlayClick}
			className='fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6'
			style={{
				background: visible ? "rgba(3,7,18,0.80)" : "rgba(3,7,18,0)",
				backdropFilter: visible ? "blur(14px)" : "blur(0px)",
				transition: "background 0.32s ease, backdrop-filter 0.32s ease",
			}}>
			<div
				className='relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-[0_0_80px_rgba(168,85,247,0.25)] backdrop-blur-xl'
				style={{
					transform: visible
						? "scale(1) translateY(0)"
						: "scale(0.92) translateY(28px)",
					opacity: visible ? 1 : 0,
					transition:
						"transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease",
				}}>
				{/* Top accent bar */}
				<div className='absolute left-0 top-0 h-1 w-full bg-linear-to-r from-fuchsia-500 via-violet-500 to-cyan-500 rounded-t-3xl' />

				{/* Header */}
				<div className='flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0'>
					<div className='flex items-center gap-3'>
						<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300'>
							<SearchCheck size={20} />
						</div>
						<div>
							<h2 className='text-xl font-bold text-white'>Improve Keywords</h2>
							<p className='text-sm text-fuchsia-300 font-medium mt-0.5'>
								50% ATS keyword match — let's close the gap
							</p>
						</div>
					</div>
					<button
						id='close-keywords-modal-btn'
						onClick={triggerClose}
						className='flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white shrink-0'>
						<X size={16} />
					</button>
				</div>

				{/* Scrollable body */}
				<div
					className='flex-1 overflow-y-auto px-6 pb-6 space-y-4 no-scrollbar'
					style={{ scrollbarWidth: "none" }}>
					{/* Keyword match summary bar */}
					<div
						className='rounded-2xl border border-white/5 bg-white/5 p-4'
						style={{
							opacity: visible ? 1 : 0,
							transform: visible ? "translateY(0)" : "translateY(12px)",
							transition: "opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s",
						}}>
						<div className='flex items-center justify-between mb-2 text-sm'>
							<span className='text-slate-300 font-medium'>
								Current Keyword Match Score
							</span>
							<span className='font-bold text-white'>{analysisData?.keywordMatchScore ?? 0}%</span>
						</div>
						<div className='h-2 rounded-full bg-white/10 mb-2'>
							<div
								className='h-2 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500'
								style={{
									width: visible ? `${analysisData?.keywordMatchScore ?? 0}%` : "0%",
									transition: "width 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s",
								}}
							/>
						</div>
						<p className='text-xs text-slate-400'>
							Target: ≥ 80% match for higher ATS shortlisting chances
						</p>
					</div>

					{/* Missing keyword categories */}
					<div className='space-y-3'>
						{([
							{ title: "Technical Skills", color: "text-violet-300", badgeColor: "border-violet-400/25 bg-violet-500/10 text-violet-300", keywords: analysisData?.missingKeywords?.technical ?? [] },
							{ title: "Tools & Platforms", color: "text-cyan-300", badgeColor: "border-cyan-400/25 bg-cyan-500/10 text-cyan-300", keywords: analysisData?.missingKeywords?.tools ?? [] },
							{ title: "Soft Skills", color: "text-fuchsia-300", badgeColor: "border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-300", keywords: analysisData?.missingKeywords?.softSkills ?? [] },
							{ title: "Domain Keywords", color: "text-emerald-300", badgeColor: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300", keywords: analysisData?.missingKeywords?.domain ?? [] },
						] as KeywordCategory[]).filter(cat => cat.keywords.length > 0).map((cat, i) => (
							<div
								key={cat.title}
								className='rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]'
								style={{
									opacity: visible ? 1 : 0,
									transform: visible ? "translateY(0)" : "translateY(12px)",
									transition: `opacity 0.4s ease ${0.1 + i * 0.07}s, transform 0.4s ease ${0.1 + i * 0.07}s`,
								}}>
								<p className={`text-sm font-semibold mb-3 ${cat.color}`}>
									{cat.title}
								</p>
								<div className='flex flex-wrap gap-2'>
									{cat.keywords.map((kw) => (
										<span
											key={kw}
											className={`rounded-full border px-3 py-1 text-xs font-medium ${cat.badgeColor}`}>
											{kw}
										</span>
									))}
								</div>
							</div>
						))}
					</div>

					{/* ATS Tips */}
					<div
						className='rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/5 p-4'
						style={{
							opacity: visible ? 1 : 0,
							transform: visible ? "translateY(0)" : "translateY(12px)",
							transition: "opacity 0.4s ease 0.42s, transform 0.4s ease 0.42s",
						}}>
						<div className='flex items-center gap-2 mb-3 text-sm font-semibold text-fuchsia-300'>
							<Zap size={15} /> ATS Keyword Tips
						</div>
						<ul className='space-y-2'>
							{(analysisData?.atsTips ?? atsTips).map((tip, i) => (
								<li
									key={i}
									className='flex items-start gap-2.5 text-sm text-slate-300'>
									<span className='mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-[10px] font-bold text-fuchsia-300'>
										{i + 1}
									</span>
									{tip}
								</li>
							))}
						</ul>
					</div>

					{/* CTA buttons */}
					<div
						className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'
						style={{
							opacity: visible ? 1 : 0,
							transform: visible ? "translateY(0)" : "translateY(12px)",
							transition: "opacity 0.4s ease 0.50s, transform 0.4s ease 0.50s",
						}}>
						<Link
							to='/cover-letter'
							id='keywords-generate-cover-letter-cta'
							className='flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/15 px-4 py-3 text-sm font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/25 hover:border-fuchsia-400/50'>
							<MessageSquare size={15} /> Generate Cover Letter
						</Link>
						<Link
							to='/learning-path'
							id='keywords-learning-path-cta'
							className='flex items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/15 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/25 hover:border-violet-400/50'>
							<BookOpen size={15} /> Start Learning Path
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

type FullAnalysisModalProps = {
	open: boolean;
	onClose: () => void;
	score: number;
	analysisData?: AnalysisData | null;
};

const FullAnalysisModal = ({
	open,
	onClose,
	score,
	analysisData,
}: FullAnalysisModalProps) => {
	const overlayRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	const [animOut, setAnimOut] = useState(false);

	useEffect(() => {
		if (open) {
			setAnimOut(false);
			requestAnimationFrame(() => {
				requestAnimationFrame(() => setVisible(true));
			});
			document.body.style.overflow = "hidden";
		} else {
			setVisible(false);
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === overlayRef.current) triggerClose();
	};
	const triggerClose = () => {
		setAnimOut(true);
		setVisible(false);
		setTimeout(() => {
			document.body.style.overflow = "";
			onClose();
			setAnimOut(false);
		}, 320);
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) triggerClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	if (!open && !animOut) return null;

	const verdict =
		score >= 80
			? "Excellent ATS Readiness"
			: score >= 65
				? "Good ATS Readiness"
				: score >= 50
					? "Average ATS Readiness"
					: "Poor ATS Readiness";

	const verdictColor =
		score >= 80
			? "text-emerald-300"
			: score >= 65
				? "text-cyan-300"
				: score >= 50
					? "text-yellow-300"
					: "text-red-400";

	return (
		<div
			ref={overlayRef}
			onClick={handleOverlayClick}
			className='fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6'
			style={{
				background: visible ? "rgba(3,7,18,0.80)" : "rgba(3,7,18,0)",
				backdropFilter: visible ? "blur(14px)" : "blur(0px)",
				transition: "background 0.32s ease, backdrop-filter 0.32s ease",
			}}>
			<div
				ref={modalRef}
				className='relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-[0_0_80px_rgba(139,92,246,0.25)] backdrop-blur-xl'
				style={{
					transform: visible
						? "scale(1) translateY(0)"
						: "scale(0.92) translateY(28px)",
					opacity: visible ? 1 : 0,
					transition:
						"transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease",
				}}>
				<div className='absolute left-0 top-0 h-1 w-full bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500 rounded-t-3xl' />

				<div className='flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0'>
					<div className='flex items-center gap-4'>
						<div className='relative h-16 w-16 shrink-0'>
							<CircularProgressbar
								value={score}
								circleRatio={0.73}
								strokeWidth={10}
								styles={buildStyles({
									rotation: 0.635,
									trailColor: "#1e293b",
									strokeLinecap: "round",
									pathColor: "#8B5CF6",
								})}
							/>
							<span className='absolute bottom-0.5 left-1/2 -translate-x-1/2 text-sm font-extrabold text-white'>
								{score}
							</span>
						</div>
						<div>
							<h2 className='text-xl font-bold text-white'>
								Full Resume Analysis
							</h2>
							<p className={`text-sm font-semibold mt-0.5 ${verdictColor}`}>
								{verdict}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2 shrink-0'>
						<button
							id='download-report-btn'
							className='hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:border-violet-400/30'>
							<Download size={13} /> Download Report
						</button>
						<button
							id='close-analysis-modal-btn'
							onClick={triggerClose}
							className='flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white'>
							<X size={16} />
						</button>
					</div>
				</div>

				<div
					className='flex-1 overflow-y-auto px-6 pb-6 space-y-4 no-scrollbar'
					style={{ scrollbarWidth: "none" }}>
					<div className='space-y-3'>
						{(analysisData ? buildAnalysisSections(analysisData) : []).map((sec, i) => (
							<div
								key={sec.title}
								className='rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]'
								style={{
									opacity: visible ? 1 : 0,
									transform: visible ? "translateY(0)" : "translateY(12px)",
									transition: `opacity 0.4s ease ${0.1 + i * 0.07}s, transform 0.4s ease ${0.1 + i * 0.07}s`,
								}}>
								<div className='flex items-center justify-between mb-3'>
									<div
										className={`flex items-center gap-2 text-sm font-semibold ${sec.color}`}>
										{sec.icon}
										{sec.title}
									</div>
									<span className='text-sm font-bold text-white'>
										{sec.score}%
									</span>
								</div>
								<div className='h-1.5 rounded-full bg-white/10 mb-3'>
									<div
										className={`h-1.5 rounded-full bg-linear-to-r ${sec.barColor}`}
										style={{
											width: visible ? `${sec.score}%` : "0%",
											transition: `width 0.8s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.07}s`,
										}}
									/>
								</div>
								<ul className='space-y-1'>
									{sec.details.map((d) => (
										<li
											key={d}
											className='flex items-start gap-2 text-xs text-slate-400'>
											<span className='mt-0.5 h-1 w-1 rounded-full bg-slate-500 shrink-0' />
											{d}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<div
						className='rounded-2xl border border-violet-400/20 bg-violet-500/5 p-4'
						style={{
							opacity: visible ? 1 : 0,
							transform: visible ? "translateY(0)" : "translateY(12px)",
							transition: "opacity 0.4s ease 0.5s, transform 0.4s ease 0.5s",
						}}>
						<div className='flex items-center gap-2 mb-3 text-sm font-semibold text-violet-300'>
							<Lightbulb size={15} /> Improvement Suggestions
						</div>
						<ul className='space-y-2'>
							{(analysisData?.suggestions ?? []).map((s, i) => (
								<li
									key={i}
									className='flex items-start gap-2.5 text-sm text-slate-300'>
									<span className='mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-300'>
										{i + 1}
									</span>
									{s}
								</li>
							))}
						</ul>
					</div>

					<div
						className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'
						style={{
							opacity: visible ? 1 : 0,
							transform: visible ? "translateY(0)" : "translateY(12px)",
							transition: "opacity 0.4s ease 0.58s, transform 0.4s ease 0.58s",
						}}>
						<Link
							to='/cover-letter'
							id='generate-cover-letter-cta'
							className='flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/15 px-4 py-3 text-sm font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/25 hover:border-fuchsia-400/50'>
							<MessageSquare size={15} /> Generate Cover Letter
						</Link>
						<Link
							to='/career-path'
							id='see-career-path-cta'
							className='flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25 hover:border-cyan-400/50'>
							<Route size={15} /> See Career Path
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

const Dashboard = () => {
	const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
	const [value, setValue] = useState(0);
	const [progress, setProgress] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [keywordsModalOpen, setKeywordsModalOpen] = useState(false);

	// Load analysis from localStorage (set after upload)
	useEffect(() => {
		const stored = localStorage.getItem("resumeAnalysis");
		if (stored) {
			try {
				const data: AnalysisData = JSON.parse(stored);
				setAnalysis(data);
			} catch {
				console.error("Failed to parse resume analysis");
			}
		}
	}, []);

	const targetScore = analysis?.overallScore ?? 0;

	// Animate progress bar (keyword match score)
	useEffect(() => {
		const target = analysis?.keywordMatchScore ?? 0;
		setProgress(0);
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= target) { clearInterval(interval); return target; }
				return prev + 1;
			});
		}, 30);
		return () => clearInterval(interval);
	}, [analysis]);

	// Animate circular score counter
	useEffect(() => {
		setValue(0);
		const duration = 1400;
		let startTime: number | null = null;
		const animate = (time: number) => {
			if (!startTime) startTime = time;
			const elapsed = time - startTime;
			const t = Math.min(elapsed / duration, 1);
			const ease = 1 - Math.pow(1 - t, 3);
			setValue(targetScore * ease);
			if (t < 1) requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);
	}, [targetScore]);

	// Derived data with fallbacks
	const missingKeywordsFlat = analysis
		? [
				...( analysis.missingKeywords?.technical ?? []),
				...( analysis.missingKeywords?.tools ?? []),
				...( analysis.missingKeywords?.softSkills ?? []),
		  ].slice(0, 6)
		: [];

	const scoreBreakdown = [
		{ label: "Format", pct: `${analysis?.formatScore ?? 0}%`, val: analysis?.formatScore ?? 0, color: "from-blue-400 to-violet-500" },
		{ label: "Content Impact", pct: `${analysis?.contentScore ?? 0}%`, val: analysis?.contentScore ?? 0, color: "from-violet-400 to-fuchsia-500" },
		{ label: "Skill Match", pct: `${analysis?.skillMatchScore ?? 0}%`, val: analysis?.skillMatchScore ?? 0, color: "from-cyan-400 to-blue-500" },
	];

	// No resume uploaded yet
	if (!analysis) {
		return (
			<div className='flex flex-col items-center justify-center gap-6 py-20 text-center'>
				<div className='flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5'>
					<Gauge size={36} className='text-violet-400' />
				</div>
				<div>
					<h2 className='text-2xl font-bold text-white mb-2'>No Resume Analyzed Yet</h2>
					<p className='text-slate-400 max-w-sm'>
						Upload your resume on the home page to get a full AI-powered analysis with scores, keyword gaps, and career suggestions.
					</p>
				</div>
				<Link
					to='/'
					className='flex items-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-violet-500 hover:to-fuchsia-500 transition'>
					<Sparkles size={16} /> Analyze My Resume
				</Link>
			</div>
		);
	}

	return (
		<>
			<FullAnalysisModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				score={Math.round(value) || targetScore}
				analysisData={analysis}
			/>
			<ImproveKeywordsModal
				open={keywordsModalOpen}
				onClose={() => setKeywordsModalOpen(false)}
				analysisData={analysis}
			/>

			<div className='flex flex-col lg:flex-row gap-4 sm:gap-5 w-full pb-8'>
				<AnimatedContent
					className='w-full lg:w-[300px] xl:w-[330px] shrink-0'
					direction='horizontal'
					reverse={false}
					{...anim(0)}>
					<DashboardCard
						title='Resume Score'
						icon={<Gauge size={22} className='text-violet-300' />}
						badge='ATS Readiness'
						accent='from-blue-500 via-violet-500 to-fuchsia-500'
						className='shadow-[0_0_40px_rgba(139,92,246,0.10)]'>
						<div className='flex flex-col justify-between gap-6 h-full'>
							<div className='flex items-start justify-between gap-3'>
								<div className='flex-1'>
									<p className='text-sm font-medium text-slate-400'>
										Overall resume evaluation
									</p>
									<p className={`mt-2 text-sm font-semibold ${
										targetScore >= 80 ? 'text-emerald-300' :
										targetScore >= 65 ? 'text-cyan-300' :
										targetScore >= 50 ? 'text-yellow-300' : 'text-red-400'
									}`}>{analysis.verdict}</p>
									<p className='mt-1 text-sm leading-relaxed text-slate-400'>
										{analysis.suggestions[0] ?? "Upload a resume to see analysis."}
									</p>
								</div>
								<div className='relative h-20 w-20 shrink-0'>
									<CircularProgressbar
										value={value}
										circleRatio={0.73}
										strokeWidth={10}
										styles={buildStyles({
											rotation: 0.635,
											trailColor: "#111827",
											strokeLinecap: "round",
											pathColor: targetScore >= 80 ? "#10b981" : targetScore >= 65 ? "#06b6d4" : targetScore >= 50 ? "#eab308" : "#ef4444",
										})}
									/>
									<span className='absolute bottom-1 left-1/2 -translate-x-1/2 text-lg font-extrabold text-white'>
										{Math.round(value)}
									</span>
								</div>
							</div>

							<div className='flex flex-col gap-3'>
								{scoreBreakdown.map(({ label, pct, val, color }) => (
									<div
										key={label}
										className='rounded-2xl border border-white/5 bg-white/5 p-3'>
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm text-slate-300'>{label}</span>
											<span className='text-sm font-semibold text-white'>{pct}</span>
										</div>
										<div className='h-2 rounded-full bg-white/10'>
											<div
												className={`h-2 rounded-full bg-linear-to-r ${color} transition-all duration-700`}
												style={{ width: `${val}%` }}
											/>
										</div>
									</div>
								))}
							</div>

							<button
								id='view-full-analysis-btn'
								onClick={() => setModalOpen(true)}
								className='flex w-fit items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 hover:border-violet-400/50 hover:shadow-[0_0_18px_rgba(139,92,246,0.18)]'>
								View Full Analysis <ArrowRight size={16} />
							</button>
						</div>
					</DashboardCard>
				</AnimatedContent>

				<div className='flex-1 flex flex-col gap-4 sm:gap-5 min-w-0'>
					<AnimatedContent
						className='w-full'
						direction='vertical'
						reverse={false}
						{...anim(0.1)}>
						<DashboardCard
							title='Skill, Section & Keyword Gap'
							icon={<SearchCheck size={22} className='text-fuchsia-300' />}
							badge='Gap Analysis'
							accent='from-fuchsia-500 via-violet-500 to-purple-500'
							className='shadow-[0_0_30px_rgba(168,85,247,0.08)]'>
							<div className='flex flex-col justify-between gap-4 h-full'>
								<div className='flex flex-col gap-4'>
									<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
										<p className='text-sm text-slate-400'>
											How closely your resume aligns with job requirements
										</p>
										<div className='w-full sm:w-48 shrink-0'>
											<div className='mb-1.5 flex items-center justify-between text-xs text-slate-300'>
												<span>Match Score</span>
												<span>{progress}%</span>
											</div>
											<div className='relative h-2.5 rounded-full bg-white/10'>
												<div
													className='h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-300'
													style={{ width: `${progress}%` }}
												/>
											</div>
										</div>
									</div>

									<div className='grid grid-cols-3 gap-3'>
										{[
											{ label: "Missing Skills", val: String(analysis.missingStats?.missingSkills ?? 0).padStart(2, '0') },
											{ label: "Weak Sections", val: String(analysis.missingStats?.weakSections ?? 0).padStart(2, '0') },
											{ label: "Keyword Match", val: analysis.missingStats?.keywordMatch ?? '0%' },
										].map(({ label, val }) => (
											<div
												key={label}
												className='rounded-2xl border border-white/5 bg-white/5 p-3'>
												<p className='text-[10px] uppercase tracking-wider text-slate-400'>
													{label}
												</p>
												<p className='mt-1.5 text-xl font-bold text-white'>
													{val}
												</p>
											</div>
										))}
									</div>

									<div>
										<p className='mb-2 text-sm font-medium text-slate-300'>
											Top missing keywords
										</p>
										<div className='flex flex-wrap gap-2'>
											{missingKeywordsFlat.map((item) => (
												<span
													key={item}
													className='rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300'>
													{item}
												</span>
											))}
										</div>
									</div>
								</div>

								<button
									id='improve-keywords-btn'
									onClick={() => setKeywordsModalOpen(true)}
									className='flex w-fit items-center gap-2 rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/20 hover:border-fuchsia-400/50 hover:shadow-[0_0_18px_rgba(168,85,247,0.18)]'>
									Improve Keywords <ArrowRight size={16} />
								</button>
							</div>
						</DashboardCard>
					</AnimatedContent>

					<div className='flex flex-col sm:flex-row gap-4 sm:gap-5'>
						<AnimatedContent
							className='flex-1 min-w-0'
							direction='vertical'
							reverse={false}
							{...anim(0.15)}>
							<DashboardCard
								title='Career Path & Job Suggestion'
								icon={<Briefcase size={22} className='text-cyan-300' />}
								badge='Role Recommendations'
								accent='from-cyan-500 to-blue-500'>
								<div className='flex flex-col justify-between gap-4 h-full'>
									<p className='text-sm text-slate-400 mb-4'>
										Recommended roles based on resume strength
									</p>
									<div className='flex flex-wrap gap-2 mb-5'>
										{(analysis.careerSuggestions ?? []).map((role) => (
											<span
												key={role}
												className='rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300'>
												{role}
											</span>
										))}
									</div>
									<div className='rounded-2xl border border-white/5 bg-white/5 p-4'>
										<div className='flex items-center justify-between mb-2.5'>
											<span className='text-sm text-slate-300'>
												{analysis.topMatchRole || "Top Match"}
											</span>
											<span className='text-sm font-semibold text-white'>
												{analysis.topMatchPercentage ?? 0}%
											</span>
										</div>
										<div className='h-2 rounded-full bg-white/10'>
											<div className='h-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-700' style={{ width: `${analysis.topMatchPercentage ?? 0}%` }} />
										</div>
									</div>
									<button className='flex w-fit items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_18px_rgba(6,182,212,0.18)]'>
										<Link to='/career-path'>
											Explore Careers <ArrowRight size={16} />
										</Link>
									</button>
								</div>
							</DashboardCard>
						</AnimatedContent>

						<AnimatedContent
							className='flex-1 min-w-0'
							direction='vertical'
							reverse={false}
							{...anim(0.2)}>
							<DashboardCard
								title='Cover Letter'
								icon={<FileText size={22} className='text-orange-300' />}
								badge='Generated Draft'
								accent='from-orange-500 to-pink-500'>
								<div className='flex flex-col justify-between gap-4 h-full'>
									<div>
										<p className='text-sm text-slate-400 mb-3'>
											AI-generated personalized cover letter summary
										</p>
										<p className='text-sm leading-relaxed text-slate-300'>
											A tailored draft can highlight your technical skills,
											projects, and strengths for the selected role.
										</p>
										<div className='mt-5 flex flex-wrap gap-2'>
											<span className='rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300'>
												Personalized
											</span>
											<span className='rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300'>
												Ready to Edit
											</span>
										</div>
									</div>
									<button className='flex w-fit items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-200 transition hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-[0_0_18px_rgba(249,115,22,0.18)]'>
										<Link to='/cover-letter'>
											Generate Letter <ArrowRight size={16} />
										</Link>
									</button>
								</div>
							</DashboardCard>
						</AnimatedContent>
					</div>

					<AnimatedContent
						className='w-full'
						direction='vertical'
						reverse={false}
						{...anim(0.1)}>
						<DashboardCard
							title='Learning Path & Course Suggestion'
							icon={<BookOpen size={22} className='text-emerald-300' />}
							badge='Recommended Learning'
							accent='from-emerald-500 to-teal-500'>
							<div className='flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 h-full'>
								<div className='flex-1 w-full'>
									<p className='text-sm text-slate-400 mb-4'>
										Skills to learn next for stronger job readiness
									</p>
									<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3'>
										{(analysis.learningPath ?? []).map((course, index) => (
											<div
												key={course}
												className='flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10'>
												<div className='flex items-center gap-3 min-w-0'>
													<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-300'>
														{index + 1}
													</div>
													<span className='text-sm text-slate-200 truncate'>
														{course}
													</span>
												</div>
												<Sparkles
													size={15}
													className='shrink-0 text-emerald-300 ml-2'
												/>
											</div>
										))}
									</div>
								</div>
								<button className='flex w-fit items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_18px_rgba(16,185,129,0.18)]'>
									<Link to='/learning-path'>
										Start Learning <ArrowRight size={16} />
									</Link>
								</button>
							</div>
						</DashboardCard>
					</AnimatedContent>
				</div>
			</div>
		</>
	);
};

export default Dashboard;

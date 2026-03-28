/** @format */
import AnimatedContent from "./ui/AnimatedContent";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import {
	Gauge,
	SearchCheck,
	Briefcase,
	BookOpen,
	FileText,
	Sparkles,
	ArrowRight,
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

const Dashboard = () => {
	const targetScore = 50;
	const [value, setValue] = useState(0);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= targetScore) {
					clearInterval(interval);
					return targetScore;
				}
				return prev + 1;
			});
		}, 30);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
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
	}, []);

	return (
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
								<p className='mt-2 text-sm leading-relaxed text-slate-300'>
									Good foundation, but your resume still needs stronger
									keywords, clearer impact, and better section optimization.
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
										pathColor: "#8B5CF6",
									})}
								/>
								<span className='absolute bottom-1 left-1/2 -translate-x-1/2 text-lg font-extrabold text-white'>
									{Math.round(value)}
								</span>
							</div>
						</div>

						<div className='flex flex-col gap-3'>
							{[
								{
									label: "Format",
									pct: "78%",
									w: "w-[78%]",
									color: "from-blue-400 to-violet-500",
								},
								{
									label: "Content Impact",
									pct: "54%",
									w: "w-[54%]",
									color: "from-violet-400 to-fuchsia-500",
								},
								{
									label: "Skill Match",
									pct: "63%",
									w: "w-[63%]",
									color: "from-cyan-400 to-blue-500",
								},
							].map(({ label, pct, w, color }) => (
								<div
									key={label}
									className='rounded-2xl border border-white/5 bg-white/5 p-3'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm text-slate-300'>{label}</span>
										<span className='text-sm font-semibold text-white'>
											{pct}
										</span>
									</div>
									<div className='h-2 rounded-full bg-white/10'>
										<div
											className={`h-2 ${w} rounded-full bg-linear-to-r ${color}`}
										/>
									</div>
								</div>
							))}
						</div>

						<button className='flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10'>
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
										{ label: "Missing Skills", val: "08" },
										{ label: "Weak Sections", val: "03" },
										{ label: "Keyword Match", val: "50%" },
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
										{[
											"React",
											"Node.js",
											"MongoDB",
											"REST API",
											"GitHub",
											"Problem Solving",
										].map((item) => (
											<span
												key={item}
												className='rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300'>
												{item}
											</span>
										))}
									</div>
								</div>
							</div>

							<button className='flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10'>
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
								<div>
									<p className='text-sm text-slate-400 mb-4'>
										Recommended roles based on resume strength
									</p>
									<div className='flex flex-wrap gap-2 mb-5'>
										{[
											"Frontend Developer",
											"MERN Developer",
											"Web Developer",
										].map((role) => (
											<span
												key={role}
												className='rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300'>
												{role}
											</span>
										))}
									</div>
									<div className='rounded-2xl border border-white/5 bg-white/5 p-4'>
										<div className='flex items-center justify-between mb-2.5'>
											<span className='text-sm text-slate-300'>Top Match</span>
											<span className='text-sm font-semibold text-white'>
												72%
											</span>
										</div>
										<div className='h-2 rounded-full bg-white/10'>
											<div className='h-2 w-[72%] rounded-full bg-linear-to-r from-cyan-400 to-blue-500' />
										</div>
									</div>
								</div>
								<button className='flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10'>
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
								<button className='flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10'>
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
									{[
										"Advanced React & Hooks",
										"Backend APIs with Node.js",
										"MongoDB Integration",
										"Deployment & Git Workflow",
									].map((course, index) => (
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
							<button className='mt-2 xl:mt-0 flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10'>
								<Link to='/learning-path'>
									Start Learning <ArrowRight size={16} />
								</Link>
							</button>
						</div>
					</DashboardCard>
				</AnimatedContent>
			</div>
		</div>
	);
};

export default Dashboard;

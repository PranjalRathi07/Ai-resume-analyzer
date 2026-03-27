/** @format */
import AnimatedContent from "./ui/AnimatedContent";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";

const Dashboard = () => {
	const targetScore = 50;
	const [Value, setValue] = useState(0);
	const [Progress, setProgress] = useState(0);

	useEffect(() => {
		let Interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 50) {
					clearInterval(Interval);
					return 50;
				}
				return prev + 1;
			});
		}, 30);
		return () => clearInterval(Interval);
	}, []);

	useEffect(() => {
		const duration = 1400;
		let startTime: number | null = null;

		const animate = (time: number) => {
			if (!startTime) startTime = time;

			const elapsed = time - startTime;
			const t = Math.min(elapsed / duration, 1);

			const ease = 1 - Math.pow(1 - t, 3);

			const current = targetScore * ease;
			setValue(current);

			if (t < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	}, []);

	return (
		<div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-4 gap-x-2 gap-y-4 min-h-screen'>
			<AnimatedContent
				className='min-w-[35%] row-span-4'
				distance={-150}
				direction='horizontal'
				reverse={false}
				duration={0.5}
				ease='cubic-bezier(0.25, 0.1, 0.25, 1)'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0}>
				<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10 font-bold text-2xl h-full '>
					<h1 className='pb-4 text-4xl flex flex-row justify-between'>
						{" "}
						<span className='bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
							Resume Score
						</span>{" "}
						<div className='relative w-15 h-15'>
							<CircularProgressbar
								value={Value}
								circleRatio={0.73}
								strokeWidth={10}
								styles={buildStyles({
									rotation: 0.635,
									trailColor: "#111827",
									strokeLinecap: "round",
									pathColor: "#8B5CF6",
								})}
							/>
							<span className='absolute bottom-0 left-1/2 -translate-x-1/2 text-[18px] font-extraboldbold text-white-300 tracking-wide'>
								{Math.round(Value)}
							</span>
						</div>
					</h1>
					<div className='w-full h-[90%] bg-black/20 p-3 rounded-lg border border-white/5'></div>
				</div>
			</AnimatedContent>

			<AnimatedContent
				className='min-w-[45%] col-span-2 row-span-2'
				distance={-150}
				direction='vertical'
				reverse={false}
				duration={0.5}
				ease='cubic-bezier(0.25, 0.1, 0.25, 1)'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0}>
				<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10 font-bold text-2xl h-full'>
					<h1 className='pb-4 text-3xl flex flex-row justify-between'>
						<span>Skill, Section & Keyword Gap</span>{" "}
						<div className='mt-3 relative w-60 h-3	 bg-white/10 rounded-full'>
							<div
								className='h-full bg-purple-500 transition-all duration-300 rounded-full'
								style={{ width: `${Progress}%` }}
							/>
						</div>
					</h1>
					<div className='w-full h-[85%] bg-black/20 p-3 rounded-lg border border-white/5'></div>
				</div>
			</AnimatedContent>

			<AnimatedContent
				className='min-w-[45%]'
				distance={0}
				direction='vertical'
				reverse={false}
				duration={0.5}
				ease='cubic-bezier(0.25, 0.1, 0.25, 1)'
				initialOpacity={0}
				animateOpacity
				scale={1.5}
				threshold={0.1}
				delay={0}>
				<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10 font-bold text-2xl h-full'>
					<h1 className='pb-3'>Career Path & Job Suggestion</h1>
					<div className='w-full h-[75%] bg-black/20 p-3 rounded-lg border border-white/5'></div>
				</div>
			</AnimatedContent>

			<AnimatedContent
				className='min-w-[45%] row-span-2'
				distance={-150}
				direction='horizontal'
				reverse={true}
				duration={0.5}
				ease='cubic-bezier(0.25, 0.1, 0.25, 1)'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0}>
				<div className='bg-white/5 border border-white/1	0 p-5 rounded-xl transition-all hover:bg-white/10 font-bold text-2xl h-full'>
					<h1 className='pb-3'>Learning Path & Course Suggestion</h1>
					<div className='w-full h-[80%] bg-black/20 p-3 rounded-lg border border-white/5'></div>
				</div>
			</AnimatedContent>

			<div className='min-w-[45%] animate-[fadeIn_0.5s_cubic-bezier(0.25,0.1,0.25,1)_0s_both]'>
				<div className='bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10 font-bold text-2xl h-full'>
					<h1 className='pb-3'>Cover Letter</h1>
					<div className='w-full h-[75%] bg-black/20 p-3 rounded-lg border border-white/5'></div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

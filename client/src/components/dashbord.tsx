/** @format */
import AnimatedContent from "./ui/AnimatedContent";

const Dashboard = () => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-4 gap-x-2 gap-y-4 min-h-screen'>
			<AnimatedContent
				className='min-w-[35%] row-span-4'
				distance={-150}
				direction='horizontal'
				reverse={false}
				duration={0.8}
				ease='back.out'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0.1}>
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-5 font-bold text-2xl h-full'>
					<h1 className='pb-7 text-4xl'>
						{" "}
						<span className='bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
							Resume Score
						</span>{" "}
						<span className='text-2xl'>/100</span>
					</h1>
					<div className='w-full h-[90%] bg-gray-300 rounded-lg shadow-2xl'></div>
				</div>
			</AnimatedContent>

			<AnimatedContent
				className='min-w-[45%] col-span-2 row-span-2'
				distance={-150}
				direction='vertical'
				reverse={false}
				duration={0.8}
				ease='back.out'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0.2}>
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-5 font-bold text-2xl h-full'>
					<h1 className='pb-3'>Skill, Section & Keyword Gap</h1>
					<div className='w-full h-[85%] bg-gray-300 rounded-lg shadow-2xl'></div>
				</div>
			</AnimatedContent>

			<AnimatedContent
				className='min-w-[45%]'
				distance={0}
				direction='vertical'
				reverse={false}
				duration={0.8}
				ease='back.out'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0.3}>
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-5 font-bold text-2xl h-full'>
					<h1 className='pb-3'>Career Path & Job Suggestion</h1>
					<div className='w-full h-[75%] bg-gray-300 rounded-lg shadow-2xl'></div>
				</div>
			</AnimatedContent>

			<AnimatedContent
				className='min-w-[45%] row-span-2'
				distance={-150}
				direction='horizontal'
				reverse={true}
				duration={0.8}
				ease='back.out'
				initialOpacity={0}
				animateOpacity
				scale={1}
				threshold={0.1}
				delay={0.4}>
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-5 font-bold text-2xl h-full'>
					<h1 className='pb-3'>Learning Path & Course Suggestion</h1>
					<div className='w-full h-[80%] bg-gray-300 rounded-lg shadow-2xl'></div>
				</div>
			</AnimatedContent>

			<div className='min-w-[45%] animate-[fadeIn_0.8s_ease-out_0.3s_both]'>
				<div className='bg-sidebar rounded-lg shadow-2xl p-5 font-bold text-2xl border-2 border-gray-800 h-full'>
					<h1 className='pb-3'>Cover Letter</h1>
					<div className='w-full h-[75%] bg-gray-300 rounded-lg shadow-2xl'></div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

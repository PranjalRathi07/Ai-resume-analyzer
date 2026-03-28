/** @format */
import { motion } from "framer-motion";

const coverLetterData = {
	subject: "Application for Web Developer Position",
	salutation: "Dear Hiring Manager,",
	paragraphs: [
		"I am writing to express my interest in the Web Developer position at your esteemed organization. I am currently pursuing a Bachelor of Computer Applications from G.L. Bajaj Institute of Management, Greater Noida, and have gained hands-on experience through multiple internships and projects in full-stack web development.",
		"During my internship at Acmegrade, I worked extensively with React and Node.js, where I developed new features and optimized dashboard performance, reducing load time by 25%. I also contributed reusable components to the company’s design system, which enhanced development efficiency. My experience at Codtech IT Solutions and Prodigy InfoTech further strengthened my skills in responsive design, API integration, and real-world project development.",
		"One of my key projects, the Online Complaint Management System, demonstrates my ability to build scalable web applications. I used technologies such as ReactJS, Node.js, MongoDB, and SendGrid to create a platform that allows users to submit complaints and enables administrators to manage and resolve them effectively.",
		"I am proficient in JavaScript (React.js), HTML/CSS (TailwindCSS, Bootstrap), MongoDB, and have a solid foundation in Data Structures and Algorithms. I am also experienced with Git, GitHub, and modern development tools, and I enjoy working in Agile environments.",
		"I am eager to contribute my technical skills, problem-solving abilities, and passion for development to your team. I would welcome the opportunity to discuss how I can add value to your organization.",
		"Thank you for your time and consideration.",
	],
	signOff: "Sincerely,",
	signature: {
		name: "Pranjal Rathi",
		phone: "7302368443",
		email: "rathipranjal123@gmail.com",
		linkedin: "https://www.linkedin.com/in/pranjal-rathi-07",
	},
};

const CoverLetter = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}
			className='h-min-[calc(100vh-11rem)] w-full max-w-5xl mx-auto'>
			<div className='border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 backdrop-blur-md rounded-2xl md:p-8 lg:p-10 flex flex-col shadow-lg h-full'>
				<h1 className='text-center text-2xl md:text-3xl font-bold mb-6 underline bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent shrink-0'>
					Cover Letter
				</h1>

				<div className='flex-1 min-h-0 h-full pr-2 md:pr-4 no-scrollbar flex flex-col gap-6 text-gray-200'>
					<div className='bg-black/20 border border-white/5 p-6 md:p-8 rounded-xl leading-relaxed text-sm md:text-base font-light font-sans mt-2 shadow-inner'>
						<div className='mb-6 border-b border-white/10 pb-4'>
							<h2 className='text-white font-semibold'>
								<span className='text-purple-400 mr-2'>Subject:</span>
								{coverLetterData.subject}
							</h2>
						</div>

						<div className='space-y-4 text-gray-300 text-justify'>
							<p className='text-white font-medium mb-4'>
								{coverLetterData.salutation}
							</p>

							{coverLetterData.paragraphs.map((para, idx) => (
								<p key={idx}>{para}</p>
							))}
						</div>

						<div className='mt-8 pt-6 border-t border-white/10'>
							<p className='text-gray-300 mb-4'>{coverLetterData.signOff}</p>
							<h3 className='text-xl md:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent w-fit mb-3'>
								{coverLetterData.signature.name}
							</h3>
							<div className='flex flex-col gap-1.5 text-sm text-gray-400'>
								<p className='flex items-center gap-3'>
									<span className='text-blue-400 text-lg'>📱</span>{" "}
									{coverLetterData.signature.phone}
								</p>
								<p className='flex items-center gap-3'>
									<span className='text-purple-400 text-lg'>✉️</span>{" "}
									{coverLetterData.signature.email}
								</p>
								<p className='flex items-center gap-3'>
									<span className='text-blue-500 text-lg'>🔗</span>
									<a
										href={coverLetterData.signature.linkedin}
										target='_blank'
										rel='noreferrer'
										className='hover:text-purple-400 transition-colors underline-offset-4 hover:underline'>
										LinkedIn Profile
									</a>
								</p>
							</div>
						</div>
					</div>

					<div className='flex justify-end gap-3 mt-2 shrink-0 pb-4'>
						<button
							className='px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white font-medium transition-colors flex items-center gap-2'
							onClick={() =>
								navigator.clipboard.writeText(
									coverLetterData.paragraphs.join("\n\n"),
								)
							}>
							📋 Copy Text
						</button>
						<button className='px-4 py-2.5 bg-linear-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-blue-500/30 text-blue-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.15)]'>
							📥 Download PDF
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CoverLetter;

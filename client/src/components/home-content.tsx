/** @format */
import { ImageUpload } from "./file-uploder";
import dasbordimg from "../assets/homimage.png";

const HomeContent = () => {
	return (
		<div className='max-w-6xl mx- text-5xl font-bold mt-15'>
			<h1>
				Get Expert Feedback on <br /> Your{" "}
				<span className='leading-12 tracking-tighter bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
					Resume
				</span>
				{""}, instantly.
			</h1>

			<p className='text-base mt-7 text-slate-400'>
				Our free AI-powered resume analyzer provides instant <br /> feedback on
				your resume's strengths and weaknesses, <br /> helping you optimize it
				for success. <br />
				Try it now and take the first step towards landing your dream job!
			</p>
			<ImageUpload />

			<div className='bg-blend-overlay'>
				<img
					src={dasbordimg}
					alt='poster'
					className='w-2xl h-auto absolute top-1/2 right-0 transform -translate-y-1/2'
				/>
			</div>
		</div>
	);
};

export default HomeContent;

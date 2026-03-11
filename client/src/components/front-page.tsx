/** @format */
import { AppSidebar } from "./whatsapp-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { Header } from "./navbar";
import { ImageUpload } from "./file-uploder";
import dasbordimg from "../assets/homimage.png";

const FrontPage = () => {
	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			<aside className='w-20 '>
				<SidebarProvider>
					<AppSidebar></AppSidebar>
				</SidebarProvider>
			</aside>

			<div className='flex flex-col flex-1'>
				{/* Navbar */}
				<nav className='bg-transparent flex items-center justify-between px-8'>
					<Header />
				</nav>

				{/* White Content Div */}
				<main className='flex-1 text-slate-100 rounded-tl-3xl p-8 mt-24'>
					<div className='max-w-6xl mx-auto text-5xl font-bold mt-20'>
						<h1>
							Get Expert Feedback on <br /> Your{" "}
							<span className='leading-12 tracking-tighter bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
								Resume
							</span>
							{""}, instantly.
						</h1>

						<p className='text-base mt-7 text-slate-400 '>
							Our free AI-powered resume analyzer provides instant <br />{" "}
							feedback on your resume's strengths and weaknesses, <br /> helping
							you optimize it for success. <br />
							Try it now and take the first step towards landing your dream job!
						</p>
						<ImageUpload></ImageUpload>
					</div>
					<div className='bg-blend-overlay '>
						<img
							src={dasbordimg}
							alt='poster'
							className='w-2xl h-auto absolute top-1/2 right-0 transform -translate-y-1/2'
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default FrontPage;

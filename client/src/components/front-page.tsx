/** @format */
import { AppSidebar } from "./whatsapp-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { useSidebar } from "./ui/sidebar-context";
import { Header } from "./navbar";
import Home from "./home-content";
import Dashboard from "./dashbord";
import CareerPath from "./Career-path";
import Learning_path from "./Learning_path";
import CoverLetter from "./Cover_letter";

const PageContent = () => {
	const { open } = useSidebar();

	return (
		<div
			className='flex flex-col flex-1 transition-all duration-200 ease-in-out'
			style={{ marginLeft: open ? "12rem" : "2rem" }}>
			{/* Navbar */}
			<nav className='bg-transparent flex items-center justify-between px-8'>
				<Header />
			</nav>

			{/* Content Div */}
			<main className='flex-1 text-slate-100 rounded-tl-3xl p-8 mt-24 '>
				<Home />
				<Dashboard />
				<CareerPath />
				<Learning_path />
				<CoverLetter />
			</main>
		</div>
	);
};

const FrontPage = () => {
	return (
		<SidebarProvider>
			<div className='flex w-full'>
				<AppSidebar />
				<PageContent />
			</div>
		</SidebarProvider>
	);
};

export default FrontPage;

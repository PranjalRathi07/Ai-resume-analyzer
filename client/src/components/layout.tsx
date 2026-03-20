/** @format */
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./whatsapp-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { useSidebar } from "./ui/sidebar-context";
import { Header } from "./navbar";

const LayoutContent = () => {
	const { open } = useSidebar();

	return (
		<div
			className='flex flex-col flex-1 min-h-screen transition-all duration-200 ease-linear'
			style={{ marginLeft: open ? "12rem" : "1rem" }}>
			<nav className='flex items-center justify-between px-8'>
				<Header />
			</nav>
			<main className='flex-1 text-slate-100 rounded-tl-3xl p-8 mt-24 mx-4'>
				<Outlet />
			</main>
		</div>
	);
};

const Layout = () => {
	return (
		<SidebarProvider>
			<div className='flex  w-full'>
				<AppSidebar />
				<LayoutContent />
			</div>
		</SidebarProvider>
	);
};

export default Layout;

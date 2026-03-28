/** @format */

import { useState, useEffect } from "react";
import {
	ChevronUp,
	GraduationCap,
	Menu,
	LayoutDashboard,
	Mails,
	ChartNoAxesCombined,
	User2,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar-context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
	const [userName, setUserName] = useState<string | null>(null);

	useEffect(() => {
		const loadUser = () => {
			const stored = localStorage.getItem("user");
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					setUserName(parsed.name || null);
				} catch {
					setUserName(null);
				}
			} else {
				setUserName(null);
			}
		};

		loadUser();
		window.addEventListener("storage", loadUser);
		return () => window.removeEventListener("storage", loadUser);
	}, []);

	const items = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
		},
		{
			title: "Career Path",
			url: "/career-path",
			icon: ChartNoAxesCombined,
		},
		{
			title: "Learning Path",
			url: "/Learning-path",
			icon: GraduationCap,
		},
		{
			title: "Cover Letter",
			url: "/cover-letter",
			icon: Mails,
		},
	];
	const { toggleSidebar } = useSidebar();
	const location = useLocation();
	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem("user");
		window.dispatchEvent(new Event("storage"));
		navigate("/");
	};
	return (
		<Sidebar variant='floating' collapsible='icon'>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={toggleSidebar} asChild>
									<span>
										<Menu />
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
						<SidebarMenu>
							{items.map((item) => {
								const active = location.pathname === item.url;
								return (
									<SidebarMenuItem key={item.title}>
										<NavLink to={item.url} style={{ textDecoration: "none" }}>
											<SidebarMenuButton
												style={
													active
														? {
																backgroundColor: "white",
																color: "black",
																fontWeight: 500,
															}
														: {}
												}>
												<item.icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			{userName && (
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> {userName}
									<ChevronUp className='ml-auto' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side='top'
								className='w-[--radix-popper-anchor-width]'>
								<DropdownMenuItem onClick={handleSignOut}>
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			)}
		</Sidebar>
	);
}

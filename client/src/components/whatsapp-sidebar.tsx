/** @format */

import {
	ChevronUp,
	GraduationCap,
	Menu,
	FileSpreadsheet,
	LayoutDashboard,
	Puzzle,
	Settings,
	ChartNoAxesCombined,
	User2,
} from "lucide-react";

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
	const items = [
		{
			title: "Dashboard",
			url: "#",
			icon: LayoutDashboard,
		},
		{
			title: "Resume Score",
			url: "#",
			icon: FileSpreadsheet,
		},
		{
			title: "Skill Gap",
			url: "#",
			icon: Puzzle,
		},
		{
			title: "Career Path",
			url: "#",
			icon: ChartNoAxesCombined,
		},
		{
			title: "Learning Path",
			url: "#",
			icon: GraduationCap,
		},
	];
	const { toggleSidebar } = useSidebar();
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
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<Settings /> Settings
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> Pranjal Rathi
									<ChevronUp className='ml-auto' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side='top'
								className='w-[--radix-popper-anchor-width]'>
								<DropdownMenuItem>
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

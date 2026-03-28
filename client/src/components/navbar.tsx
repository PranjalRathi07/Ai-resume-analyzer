/** @format */

"use client";
import { Link } from "react-router-dom";
import { Equal, X } from "lucide-react";
import { Button } from "@/components/ui/liquid-glass-button";
import React from "react";
import { cn } from "@/lib/utils";

export const Header = () => {
	const [menuState, setMenuState] = React.useState(false);
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	React.useEffect(() => {
		const checkAuth = () => {
			const user = localStorage.getItem("user");
			setIsLoggedIn(!!user);
		};
		checkAuth();
		window.addEventListener("storage", checkAuth);
		return () => window.removeEventListener("storage", checkAuth);
	}, []);

	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className='fixed w-11/12 rounded-b-2xl shadow-2xl backdrop-blur-3xl z-50'>
				<div
					className={cn("max-w-7xl px-6 transition-all duration-300 lg:px-5")}>
					<div className='relative flex flex-wrap items-center justify-between gap-6 lg:gap-0 py-2'>
						<div className='flex w-full justify-between lg:w-auto'>
							<Link
								to='/'
								aria-label='home'
								className='flex gap-2 items-center'>
								<p className='font-bold text-4xl leading-12 tracking-tighter bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
									Resume Analyzer
								</p>
							</Link>

							<button
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState ? "Close Menu" : "Open Menu"}
								className='relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden'>
								<Equal className='in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200' />
								<X className='in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200' />
							</button>
						</div>

						<div className='bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent'>
							<div className='flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit'>
								{!isLoggedIn && (
									<Button
										asChild
										variant='outline'
										size='sm'
										className={cn(isLoggedIn && "lg:hidden")}>
										<Link to='/login'>
											<span>Login</span>
										</Link>
									</Button>
								)}
								<Button
									asChild
									size='sm'
									className={cn(isLoggedIn && "lg:inline-flex")}>
									<Link to='/'>
										<span>Get Started</span>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

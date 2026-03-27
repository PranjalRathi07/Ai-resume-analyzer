/** @format */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

const Login_page = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const resetForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setError("");
		setSuccess("");
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		resetForm();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		const endpoint = isLogin ? "/login" : "/register";
		const body = isLogin ? { email, password } : { name, email, password };

		try {
			const res = await fetch(`${API_BASE}${endpoint}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message || "Something went wrong");
				setLoading(false);
				return;
			}

			setSuccess(data.message);
			setTimeout(() => {
				if (isLogin) {
					localStorage.setItem("user", JSON.stringify(data.user));
					navigate("/");
				} else {
					setIsLogin(true);
					resetForm();
					setSuccess("Account created! Please login.");
				}
			}, 1200);
		} catch {
			setError("Cannot connect to server. Is it running?");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-dvh bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4'>
			<div className='fixed inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
				<div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000' />
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl' />
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className='relative w-full max-w-md z-10'>
				<Link
					to='/'
					className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm group'>
					<span className='group-hover:-translate-x-1 transition-transform'>
						←
					</span>
					Back to Home
				</Link>

				<div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20'>
					<div className='text-center mb-8'>
						<h1 className='text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2'>
							Resume Analyzer
						</h1>
						<p className='text-gray-400 text-sm'>
							{isLogin
								? "Welcome back! Sign in to continue"
								: "Create your account to get started"}
						</p>
					</div>

					<div className='flex bg-white/5 rounded-xl p-1 mb-8 border border-white/5'>
						<button
							type='button'
							onClick={() => {
								if (!isLogin) toggleMode();
							}}
							className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
								isLogin
									? "bg-linear-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
									: "text-gray-400 hover:text-gray-200"
							}`}>
							Sign In
						</button>
						<button
							type='button'
							onClick={() => {
								if (isLogin) toggleMode();
							}}
							className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
								!isLogin
									? "bg-linear-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
									: "text-gray-400 hover:text-gray-200"
							}`}>
							Sign Up
						</button>
					</div>

					<AnimatePresence mode='wait'>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className='bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2'>
								<span>⚠️</span> {error}
							</motion.div>
						)}
						{success && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className='bg-green-500/10 border border-green-500/20 text-green-300 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2'>
								<span>✅</span> {success}
							</motion.div>
						)}
					</AnimatePresence>

					<form onSubmit={handleSubmit} className='space-y-5'>
						<AnimatePresence mode='wait'>
							{!isLogin && (
								<motion.div
									key='name-field'
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Full Name
									</label>
									<div className='relative'>
										<span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
											👤
										</span>
										<input
											type='text'
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder='John Doe'
											required={!isLogin}
											className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all'
										/>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Email Address
							</label>
							<div className='relative'>
								<span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
									📧
								</span>
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='you@example.com'
									required
									className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Password
							</label>
							<div className='relative'>
								<span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
									🔒
								</span>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder='••••••••'
									required
									minLength={6}
									className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all'
								/>
							</div>
							{!isLogin && (
								<p className='text-xs text-gray-500 mt-1.5 ml-1'>
									Must be at least 6 characters
								</p>
							)}
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm'>
							{loading ? (
								<span className='flex items-center justify-center gap-2'>
									<span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
									{isLogin ? "Signing in..." : "Creating account..."}
								</span>
							) : isLogin ? (
								"Sign In"
							) : (
								"Create Account"
							)}
						</button>
					</form>

					<p className='text-center text-gray-500 text-xs mt-6'>
						{isLogin ? "Don't have an account? " : "Already have an account? "}
						<button
							type='button'
							onClick={toggleMode}
							className='text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer'>
							{isLogin ? "Sign up" : "Sign in"}
						</button>
					</p>
				</div>

				<p className='text-center text-gray-600 text-xs mt-4'>
					By continuing, you agree to our Terms of Service
				</p>
			</motion.div>
		</div>
	);
};

export default Login_page;

/** @format */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
	FileText,
	Loader2,
	Sparkles,
	AlertCircle,
	Copy,
	Check,
	Download,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Signature {
	name: string;
	email: string;
	phone?: string;
	linkedin?: string;
}
interface CoverLetterData {
	subject: string;
	salutation: string;
	paragraphs: string[];
	signOff: string;
	signature: Signature;
}

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = () => (
	<div className='flex flex-col items-center justify-center gap-4 py-16 text-center flex-1'>
		<div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5'>
			<FileText size={24} className='text-orange-400' />
		</div>
		<div>
			<h3 className='text-base font-bold text-white mb-1'>No Resume Analyzed Yet</h3>
			<p className='text-slate-400 text-sm max-w-xs'>
				Upload your resume on the home page to get an AI-generated cover letter personalized to your experience.
			</p>
		</div>
		<Link
			to='/'
			className='flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white hover:from-orange-500 hover:to-pink-500 transition'>
			<Sparkles size={14} /> Analyze My Resume
		</Link>
	</div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const CoverLetter = () => {
	const [data, setData] = useState<CoverLetterData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [noResume, setNoResume] = useState(false);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			const hasLocalAnalysis = localStorage.getItem("resumeAnalysis");
			if (!token || !hasLocalAnalysis) { setNoResume(true); setLoading(false); return; }
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/cover-letter`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.status === 404) { setNoResume(true); setLoading(false); return; }
				const json = await res.json();
				if (!res.ok) throw new Error(json.message || "Failed to load");
				setData(json);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : "Failed to load");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleCopy = () => {
		if (!data) return;
		const text = [
			`Subject: ${data.subject}`,
			"",
			data.salutation,
			"",
			...data.paragraphs,
			"",
			data.signOff,
			data.signature.name,
			data.signature.email,
			data.signature.phone ?? "",
			data.signature.linkedin ?? "",
		].join("\n");
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = () => {
		if (!data) return;
		const text = [
			`Subject: ${data.subject}`,
			"",
			data.salutation,
			"",
			...data.paragraphs,
			"",
			data.signOff,
			data.signature.name,
			data.signature.email,
			data.signature.phone ?? "",
			data.signature.linkedin ?? "",
		].join("\n");
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "cover-letter.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}
			className='h-min-[calc(100vh-11rem)] w-full max-w-5xl mx-auto'>
			<div className='border-white/10 bg-linear-to-br from-slate-800/90 to-slate-900/95 p-5 sm:p-6 md:p-8 backdrop-blur-md rounded-2xl flex flex-col shadow-lg h-full'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6 shrink-0'>
					<h1 className='text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent'>
						Cover Letter
					</h1>
					{loading && (
						<div className='flex items-center gap-2 text-sm text-slate-400'>
							<Loader2 size={14} className='animate-spin' />
							Generating…
						</div>
					)}
				</div>

				{/* Content area */}
				<div className='flex-1 min-h-0 flex flex-col'>
					{loading ? (
						<div className='flex flex-col items-center justify-center gap-4 py-16 flex-1'>
							<div className='relative'>
								<div className='h-14 w-14 rounded-full border-2 border-orange-500/20 border-t-orange-400 animate-spin' />
								<Sparkles size={18} className='absolute inset-0 m-auto text-orange-300' />
							</div>
							<p className='text-slate-300 text-sm font-medium'>Generating your cover letter…</p>
							<p className='text-slate-500 text-xs'>Powered by Gemini AI — ~10 seconds</p>
						</div>
					) : noResume ? (
						<EmptyState />
					) : error ? (
						<div className='flex flex-col items-center gap-3 py-10 flex-1 justify-center'>
							<AlertCircle size={28} className='text-red-400' />
							<p className='text-red-300 text-sm text-center'>{error}</p>
							<button
								onClick={() => window.location.reload()}
								className='text-xs text-slate-400 underline hover:text-white'>
								Retry
							</button>
						</div>
					) : data ? (
						<>
							{/* Letter body */}
							<div className='flex-1 overflow-y-auto pr-1 no-scrollbar'>
								<div className='bg-black/20 border border-white/5 p-6 md:p-8 rounded-xl leading-relaxed text-sm md:text-base font-light font-sans shadow-inner'>
									{/* Subject */}
									<div className='mb-5 border-b border-white/10 pb-4'>
										<h2 className='text-white font-semibold'>
											<span className='text-purple-400 mr-2'>Subject:</span>
											{data.subject}
										</h2>
									</div>

									{/* Salutation + body */}
									<div className='space-y-4 text-gray-300 text-justify'>
										<p className='text-white font-medium'>{data.salutation}</p>
										{data.paragraphs.map((para, idx) => (
											<p key={idx} className='leading-7'>{para}</p>
										))}
									</div>

									{/* Sign-off */}
									<div className='mt-8 pt-6 border-t border-white/10 space-y-1'>
										<p className='text-gray-300 mb-3'>{data.signOff}</p>
										<h3 className='text-xl md:text-2xl font-bold bg-linear-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent w-fit'>
											{data.signature.name}
										</h3>
										<div className='flex flex-col gap-1.5 text-sm text-gray-400 mt-2'>
											{data.signature.email && (
												<p className='flex items-center gap-2'>
													<span className='text-purple-400'>✉️</span> {data.signature.email}
												</p>
											)}
											{data.signature.phone && (
												<p className='flex items-center gap-2'>
													<span className='text-blue-400'>📱</span> {data.signature.phone}
												</p>
											)}
											{data.signature.linkedin && (
												<p className='flex items-center gap-2'>
													<span className='text-blue-500'>🔗</span>
													<a
														href={data.signature.linkedin}
														target='_blank'
														rel='noreferrer'
														className='hover:text-purple-400 transition-colors underline-offset-4 hover:underline'>
														LinkedIn Profile
													</a>
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Action buttons */}
							<div className='flex justify-end gap-3 mt-4 shrink-0'>
								<button
									onClick={handleCopy}
									className='flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white font-medium transition'>
									{copied ? (
										<><Check size={14} className='text-green-400' /> Copied!</>
									) : (
										<><Copy size={14} /> Copy Text</>
									)}
								</button>
								<button
									onClick={handleDownload}
									className='flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-orange-600/30 to-pink-600/30 hover:from-orange-500/40 hover:to-pink-500/40 border border-orange-500/30 text-orange-200 rounded-xl text-sm font-medium transition shadow-[0_0_15px_rgba(249,115,22,0.15)]'>
									<Download size={14} /> Download TXT
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</motion.div>
	);
};

export default CoverLetter;

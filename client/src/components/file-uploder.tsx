/** @format */

import { Input } from "@/components/ui/input";
import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	FileText,
	ImagePlus,
	Upload,
	Loader2,
	Sparkles,
	CheckCircle2,
	AlertCircle,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "selected" | "uploading" | "success" | "error";

export function ImageUpload() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [uploadState, setUploadState] = useState<UploadState>("idle");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [progress, setProgress] = useState(0);

	const isPdf = file?.type === "application/pdf";

	const handleFileSelect = useCallback((selected: File) => {
		const allowed = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif",
			"image/bmp",
			"application/pdf",
		];
		if (!allowed.includes(selected.type)) {
			setErrorMsg("Please upload a PDF or image file (JPG, PNG, WEBP).");
			setUploadState("error");
			return;
		}
		if (selected.size > 10 * 1024 * 1024) {
			setErrorMsg("File is too large. Maximum size is 10MB.");
			setUploadState("error");
			return;
		}
		setFile(selected);
		setErrorMsg("");
		setUploadState("selected");
		if (selected.type.startsWith("image/")) {
			const url = URL.createObjectURL(selected);
			setPreviewUrl(url);
		} else {
			setPreviewUrl(null);
		}
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (f) handleFileSelect(f);
	};

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
			const f = e.dataTransfer.files?.[0];
			if (f) handleFileSelect(f);
		},
		[handleFileSelect],
	);

	const handleRemove = () => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setFile(null);
		setPreviewUrl(null);
		setUploadState("idle");
		setErrorMsg("");
		setProgress(0);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleAnalyze = async () => {
		if (!file) return;

		const token = localStorage.getItem("token");
		if (!token) {
			setErrorMsg("Please log in to analyze your resume.");
			setUploadState("error");
			setTimeout(() => navigate("/login"), 1500);
			return;
		}

		setUploadState("uploading");
		setProgress(0);
		setErrorMsg("");

		// Fake incremental progress for UX
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 85) {
					clearInterval(progressInterval);
					return 85;
				}
				return prev + Math.random() * 12;
			});
		}, 600);

		try {
			const formData = new FormData();
			formData.append("resume", file);

			const res = await fetch("http://localhost:5000/api/resume/upload", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			const data = await res.json();
			clearInterval(progressInterval);

			if (!res.ok) {
				throw new Error(data.message || "Analysis failed.");
			}

			setProgress(100);
			setUploadState("success");

			// Store analysis in localStorage for dashboard
			localStorage.setItem("resumeAnalysis", JSON.stringify(data.analysisData));
			localStorage.setItem("resumeFileUrl", data.fileUrl);
			localStorage.setItem("resumeFileName", file.name);

			// Navigate to dashboard after short delay
			setTimeout(() => navigate("/dashboard"), 1200);
		} catch (err: unknown) {
			clearInterval(progressInterval);
			const msg = err instanceof Error ? err.message : "Something went wrong.";
			setErrorMsg(msg);
			setUploadState("error");
			setProgress(0);
		}
	};

	return (
		<div className='w-full max-w-lg space-y-4 mt-8'>
			{/* Hidden file input */}
			<Input
				type='file'
				accept='image/*,.pdf'
				className='hidden'
				ref={fileInputRef}
				onChange={handleInputChange}
			/>

			{/* Drop Zone */}
			{uploadState === "idle" || uploadState === "error" ? (
				<div
					onClick={() => fileInputRef.current?.click()}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragEnter={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						setIsDragging(false);
					}}
					onDrop={handleDrop}
					className={cn(
						"flex h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-200",
						isDragging
							? "border-violet-400/70 bg-violet-500/10 scale-[1.01]"
							: "border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/25",
					)}>
					<div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10'>
						<ImagePlus className='h-5 w-5 text-slate-400' />
					</div>
					<div className='text-center'>
						<p className='text-sm font-medium text-slate-200'>
							Drop your resume here, or{" "}
							<span className='text-violet-400 hover:text-violet-300'>browse</span>
						</p>
						<p className='text-xs text-slate-500 mt-1'>
							Supports PDF, JPG, PNG, WEBP — max 10MB
						</p>
					</div>
				</div>
			) : null}

			{/* Error Banner */}
			{uploadState === "error" && (
				<div className='flex items-center gap-2.5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3'>
					<AlertCircle size={15} className='text-red-400 shrink-0' />
					<p className='text-sm text-red-300'>{errorMsg}</p>
				</div>
			)}

			{/* File Selected Preview */}
			{(uploadState === "selected" || uploadState === "uploading" || uploadState === "success") &&
				file && (
					<div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
						<div className='flex items-center gap-3'>
							{/* Thumbnail or PDF icon */}
							{previewUrl ? (
								<img
									src={previewUrl}
									alt='Resume preview'
									className='h-14 w-14 rounded-lg object-cover border border-white/10 shrink-0'
								/>
							) : (
								<div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-red-400/20 bg-red-500/10'>
									<FileText size={24} className='text-red-300' />
								</div>
							)}
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium text-white truncate'>{file.name}</p>
								<p className='text-xs text-slate-400 mt-0.5'>
									{(file.size / 1024).toFixed(0)} KB •{" "}
									{isPdf ? "PDF Document" : "Image File"}
								</p>
							</div>
							{uploadState === "selected" && (
								<button
									onClick={handleRemove}
									className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition'>
									<X size={14} />
								</button>
							)}
							{uploadState === "success" && (
								<CheckCircle2 size={20} className='text-emerald-400 shrink-0' />
							)}
						</div>

						{/* Progress Bar */}
						{uploadState === "uploading" && (
							<div className='mt-3'>
								<div className='flex justify-between text-xs text-slate-400 mb-1.5'>
									<span>Analyzing with AI…</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<div className='h-1.5 rounded-full bg-white/10'>
									<div
										className='flex h-1.5 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-500'
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>
						)}

						{uploadState === "success" && (
							<div className='mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1.5'>
								<CheckCircle2 size={12} />
								Analysis complete! Redirecting to dashboard…
							</div>
						)}
					</div>
				)}

			{/* Analyze Button */}
			{uploadState === "selected" && (
				<button
					id='analyze-resume-btn'
					onClick={handleAnalyze}
					className='flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/30 active:scale-[0.98]'>
					<Sparkles size={16} />
					Analyze My Resume with AI
				</button>
			)}

			{/* Uploading Spinner State */}
			{uploadState === "uploading" && (
				<div className='flex items-center justify-center gap-2.5 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-6 py-3 text-sm font-medium text-violet-200'>
					<Loader2 size={16} className='animate-spin' />
					Running AI analysis… this may take 10–20 seconds
				</div>
			)}

			{/* Replace button after remove */}
			{(uploadState === "selected") && (
				<button
					onClick={() => fileInputRef.current?.click()}
					className='flex w-full items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition py-1'>
					<Upload size={12} /> Replace file
				</button>
			)}
		</div>
	);
}

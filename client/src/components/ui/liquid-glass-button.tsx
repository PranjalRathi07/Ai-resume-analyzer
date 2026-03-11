/** @format */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants, liquidbuttonVariants } from "./button-navbar";
import { cn } from "@/lib/utils";

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, LiquidButton };

function LiquidButton({
	className,
	variant,
	size,
	asChild = false,
	children,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof liquidbuttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot='button'
			className={cn(
				"relative",
				liquidbuttonVariants({ variant, size, className }),
			)}
			{...props}>
			<div
				className='absolute top-0 left-0 z-0 h-full w-full rounded-full 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
        transition-all 
        dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]'
			/>
			<div
				className='absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md'
				style={{ backdropFilter: 'url("#container-glass")' }}
			/>

			<div className='pointer-events-none z-10 '>{children}</div>
			<GlassFilter />
		</Comp>
	);
}

function GlassFilter() {
	return (
		<svg className='hidden'>
			<defs>
				<filter
					id='container-glass'
					x='0%'
					y='0%'
					width='100%'
					height='100%'
					colorInterpolationFilters='sRGB'>
					{/* Generate turbulent noise for distortion */}
					<feTurbulence
						type='fractalNoise'
						baseFrequency='0.05 0.05'
						numOctaves='1'
						seed='1'
						result='turbulence'
					/>

					{/* Blur the turbulence pattern slightly */}
					<feGaussianBlur
						in='turbulence'
						stdDeviation='2'
						result='blurredNoise'
					/>

					{/* Displace the source graphic with the noise */}
					<feDisplacementMap
						in='SourceGraphic'
						in2='blurredNoise'
						scale='70'
						xChannelSelector='R'
						yChannelSelector='B'
						result='displaced'
					/>

					{/* Apply overall blur on the final result */}
					<feGaussianBlur in='displaced' stdDeviation='4' result='finalBlur' />

					{/* Output the result */}
					<feComposite in='finalBlur' in2='finalBlur' operator='over' />
				</filter>
			</defs>
		</svg>
	);
}

type ColorVariant =
	| "default"
	| "primary"
	| "success"
	| "error"
	| "gold"
	| "bronze";

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ColorVariant;
}

const colorVariants: Record<
	ColorVariant,
	{
		outer: string;
		inner: string;
		button: string;
		textColor: string;
		textShadow: string;
	}
> = {
	default: {
		outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
		inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
		button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
		textColor: "text-white",
		textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
	},
	primary: {
		outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
		inner: "bg-gradient-to-b from-primary via-secondary to-muted",
		button: "bg-gradient-to-b from-primary to-primary/40",
		textColor: "text-white",
		textShadow: "[text-shadow:_0_-1px_0_rgb(30_58_138_/_100%)]",
	},
	success: {
		outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
		inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
		button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
		textColor: "text-[#FFF7F0]",
		textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
	},
	error: {
		outer: "bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]",
		inner: "bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]",
		button: "bg-gradient-to-b from-[#F08D8F] to-[#A45253]",
		textColor: "text-[#FFF7F0]",
		textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]",
	},
	gold: {
		outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
		inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
		button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
		textColor: "text-[#FFFDE5]",
		textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_100%)]",
	},
	bronze: {
		outer: "bg-gradient-to-b from-[#864813] to-[#E9B486]",
		inner: "bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]",
		button: "bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]",
		textColor: "text-[#FFF7F0]",
		textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
	},
};

const metalButtonVariants = (
	isPressed: boolean,
	isHovered: boolean,
	isTouchDevice: boolean,
	variant: ColorVariant = "default",
) => {
	const colors = colorVariants[variant];
	const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

	let boxShadow;

	if (isPressed) {
		boxShadow = "0 1px 2px rgba(0, 0, 0, 0.15)";
	} else if (isHovered && !isTouchDevice) {
		boxShadow = "0 4px 12px rgba(0, 0, 0, 0.12)";
	} else {
		boxShadow = "0 3px 8px rgba(0, 0, 0, 0.08)";
	}

	return {
		wrapper: cn(
			"relative inline-flex transform-gpu rounded-md p-[1.25px] will-change-transform",
			colors.outer,
		),
		wrapperStyle: {
			transform: isPressed
				? "translateY(2.5px) scale(0.99)"
				: "translateY(0) scale(1)",
			boxShadow: boxShadow,
			transition: transitionStyle,
			transformOrigin: "center center",
		},
		inner: cn(
			"absolute inset-[1px] transform-gpu rounded-lg will-change-transform",
			colors.inner,
		),
		innerStyle: {
			transition: transitionStyle,
			transformOrigin: "center center",
			filter:
				isHovered && !isPressed && !isTouchDevice ? "brightness(1.05)" : "none",
		},
		button: cn(
			"relative z-10 m-[1px] rounded-md inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-md px-6 py-2 text-sm leading-none font-semibold will-change-transform outline-none",
			colors.button,
			colors.textColor,
			colors.textShadow,
		),
		buttonStyle: {
			transform: isPressed ? "scale(0.97)" : "scale(1)",
			transition: transitionStyle,
			transformOrigin: "center center",
			filter:
				isHovered && !isPressed && !isTouchDevice ? "brightness(1.02)" : "none",
		},
	};
};

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300",
				isPressed ? "opacity-20" : "opacity-0",
			)}>
			<div className='absolute inset-0 rounded-md bg-linear-to-r from-transparent via-neutral-100 to-transparent' />
		</div>
	);
};

export const MetalButton = React.forwardRef<
	HTMLButtonElement,
	MetalButtonProps
>(({ children, className, variant = "default", ...props }, ref) => {
	const [isPressed, setIsPressed] = React.useState(false);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isTouchDevice, setIsTouchDevice] = React.useState(false);

	React.useEffect(() => {
		setIsTouchDevice(
			"ontouchstart" in globalThis || navigator.maxTouchPoints > 0,
		);
	}, []);

	const buttonText = children || "Button";
	const variants = metalButtonVariants(
		isPressed,
		isHovered,
		isTouchDevice,
		variant,
	);

	const handleInternalMouseDown = () => {
		setIsPressed(true);
	};
	const handleInternalMouseUp = () => {
		setIsPressed(false);
	};
	const handleInternalMouseLeave = () => {
		setIsPressed(false);
		setIsHovered(false);
	};
	const handleInternalMouseEnter = () => {
		if (!isTouchDevice) {
			setIsHovered(true);
		}
	};
	const handleInternalTouchStart = () => {
		setIsPressed(true);
	};
	const handleInternalTouchEnd = () => {
		setIsPressed(false);
	};
	const handleInternalTouchCancel = () => {
		setIsPressed(false);
	};

	return (
		<div className={variants.wrapper} style={variants.wrapperStyle}>
			<div className={variants.inner} style={variants.innerStyle}></div>
			<button
				ref={ref}
				className={cn(variants.button, className)}
				style={variants.buttonStyle}
				{...props}
				onMouseDown={handleInternalMouseDown}
				onMouseUp={handleInternalMouseUp}
				onMouseLeave={handleInternalMouseLeave}
				onMouseEnter={handleInternalMouseEnter}
				onTouchStart={handleInternalTouchStart}
				onTouchEnd={handleInternalTouchEnd}
				onTouchCancel={handleInternalTouchCancel}>
				<ShineEffect isPressed={isPressed} />
				{buttonText}
				{isHovered && !isPressed && !isTouchDevice && (
					<div className='pointer-events-none absolute inset-0 bg-linear-to-t rounded-lg from-transparent to-white/5' />
				)}
			</button>
		</div>
	);
});

MetalButton.displayName = "MetalButton";

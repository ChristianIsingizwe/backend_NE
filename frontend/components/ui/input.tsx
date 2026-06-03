"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = Omit<
	InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
	"size"
> & {
	size?: "sm" | "default" | "lg" | number;
	unstyled?: boolean;
	nativeInput?: boolean;
};

export function Input({
	className,
	size = "default",
	unstyled = false,
	nativeInput = false,
	style,
	...props
}: InputProps): React.ReactElement {
	const inputClassName = cn(
		"h-10 w-full min-w-0 rounded-[inherit] bg-transparent px-3.5 text-sm leading-10 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/80",
		size === "sm" && "h-8 px-3 leading-8 text-sm",
		size === "lg" && "h-11 px-4 leading-11 text-base",
		props.type === "search" &&
			"[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
		props.type === "file" &&
			"text-muted-foreground file:me-3 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
	);

	return (
		<span
			className={
				cn(
					!unstyled &&
						"relative inline-flex w-full rounded-xl border border-input bg-background text-foreground transition-[border-color,box-shadow] has-[:focus-visible]:border-ring has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/10 has-aria-invalid:border-destructive/60 has-aria-invalid:ring-4 has-aria-invalid:ring-destructive/10 has-disabled:opacity-60",
					className,
				) || undefined
			}
			data-size={size}
			data-slot="input-control"
		>
			{nativeInput ? (
				<input
					className={inputClassName}
					data-slot="input"
					size={typeof size === "number" ? size : undefined}
					style={typeof style === "function" ? undefined : style}
					{...props}
				/>
			) : (
				<InputPrimitive
					className={inputClassName}
					data-slot="input"
					size={typeof size === "number" ? size : undefined}
					style={style}
					{...props}
				/>
			)}
		</span>
	);
}

export { InputPrimitive };

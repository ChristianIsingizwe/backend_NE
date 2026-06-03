"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2.5 font-medium text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11",
	{
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			size: {
				default: "h-6 min-w-6",
				lg: "h-7 min-w-7 px-3 text-sm",
				sm: "h-5 min-w-5 px-2 text-[11px]",
			},
			variant: {
				default:
					"border-primary bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90",
				destructive:
					"border-destructive bg-destructive text-white [button&,a&]:hover:bg-destructive/90",
				error:
					"border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200",
				info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200",
				outline:
					"border-border bg-background text-foreground [button&,a&]:hover:bg-muted",
				secondary:
					"border-secondary bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/80",
				success:
					"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
				warning:
					"border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
			},
		},
	},
);

export interface BadgeProps extends useRender.ComponentProps<"span"> {
	variant?: VariantProps<typeof badgeVariants>["variant"];
	size?: VariantProps<typeof badgeVariants>["size"];
}

export function Badge({
	className,
	variant,
	size,
	render,
	...props
}: BadgeProps): React.ReactElement {
	const defaultProps = {
		className: cn(badgeVariants({ className, size, variant })),
		"data-slot": "badge",
	};

	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(defaultProps, props),
		render,
	});
}

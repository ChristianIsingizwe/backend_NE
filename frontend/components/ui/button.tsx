"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
	"relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-semibold text-sm outline-none transition-colors duration-150 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 data-loading:select-none data-loading:text-transparent [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			size: {
				default: "h-10 px-4",
				icon: "size-10",
				"icon-lg": "size-11",
				"icon-sm": "size-8",
				"icon-xl": "size-12 [&_svg:not([class*='size-'])]:size-5",
				"icon-xs": "size-7 rounded-md",
				lg: "h-11 px-5",
				sm: "h-8 gap-1.5 px-3",
				xl: "h-12 px-6 text-base",
				xs: "h-7 gap-1 px-2.5 text-xs",
			},
			variant: {
				default:
					"border-primary bg-primary text-primary-foreground hover:bg-primary/92",
				destructive:
					"border-destructive bg-destructive text-white hover:bg-destructive/92",
				"destructive-outline":
					"border-destructive/20 bg-background text-destructive hover:bg-destructive/6",
				ghost:
					"border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
				link: "border-transparent bg-transparent px-0 text-primary hover:text-primary/80",
				outline:
					"border-border bg-background text-foreground hover:bg-muted",
				secondary:
					"border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
			},
		},
	},
);

export interface ButtonProps extends useRender.ComponentProps<"button"> {
	variant?: VariantProps<typeof buttonVariants>["variant"];
	size?: VariantProps<typeof buttonVariants>["size"];
	loading?: boolean;
}

export function Button({
	className,
	variant,
	size,
	render,
	children,
	loading = false,
	disabled: disabledProp,
	...props
}: ButtonProps): React.ReactElement {
	const isDisabled = Boolean(loading || disabledProp);
	const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
		render ? undefined : "button";

	const defaultProps = {
		children: (
			<>
				{children}
				{loading && (
					<Spinner
						className="pointer-events-none absolute"
						data-slot="button-loading-indicator"
					/>
				)}
			</>
		),
		className: cn(buttonVariants({ className, size, variant })),
		"aria-disabled": loading || undefined,
		"data-loading": loading ? "" : undefined,
		"data-slot": "button",
		disabled: isDisabled,
		type: typeValue,
	};

	return useRender({
		defaultTagName: "button",
		props: mergeProps<"button">(defaultProps, props),
		render,
	});
}

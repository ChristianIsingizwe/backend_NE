"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type React from "react";

import { cn } from "@/lib/utils";

export type TableVariant = "default" | "card";

export type TableProps = React.ComponentProps<"table"> & {
	variant?: TableVariant;
	render?: useRender.ComponentProps<"div">["render"];
};

export function Table({
	className,
	variant = "default",
	render,
	...props
}: TableProps): React.ReactElement {
	const defaultProps = {
		children: (
			<table
				className={cn(
					"w-full caption-bottom border-collapse text-sm in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-y-2",
					className,
				)}
				data-slot="table"
				{...props}
			/>
		),
		className: "relative w-full overflow-x-auto",
		"data-slot": "table-container",
		"data-variant": variant,
	};

	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(defaultProps, {}),
		render,
	});
}

export function TableHeader({
	className,
	...props
}: React.ComponentProps<"thead">): React.ReactElement {
	return (
		<thead
			className={cn("bg-muted/70 [&_tr]:border-b [&_tr]:border-border", className)}
			data-slot="table-header"
			{...props}
		/>
	);
}

export function TableBody({
	className,
	...props
}: React.ComponentProps<"tbody">): React.ReactElement {
	return (
		<tbody
			className={cn(
				"[&_tr:last-child]:border-0 in-data-[variant=card]:[&_tr]:rounded-xl",
				className,
			)}
			data-slot="table-body"
			{...props}
		/>
	);
}

export function TableFooter({
	className,
	...props
}: React.ComponentProps<"tfoot">): React.ReactElement {
	return (
		<tfoot
			className={cn("border-t border-border bg-muted/50 font-medium", className)}
			data-slot="table-footer"
			{...props}
		/>
	);
}

export function TableRow({
	className,
	...props
}: React.ComponentProps<"tr">): React.ReactElement {
	return (
		<tr
			className={cn(
				"border-b border-border/80 transition-colors hover:bg-muted/60 data-[state=selected]:bg-muted in-data-[variant=card]:overflow-hidden in-data-[variant=card]:rounded-xl in-data-[variant=card]:border-0 in-data-[variant=card]:bg-card",
				className,
			)}
			data-slot="table-row"
			{...props}
		/>
	);
}

export function TableHead({
	className,
	...props
}: React.ComponentProps<"th">): React.ReactElement {
	return (
		<th
			className={cn(
				"h-12 whitespace-nowrap px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-[0.14em] has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
				className,
			)}
			data-slot="table-head"
			{...props}
		/>
	);
}

export function TableCell({
	className,
	...props
}: React.ComponentProps<"td">): React.ReactElement {
	return (
		<td
			className={cn(
				"whitespace-nowrap px-4 py-3.5 align-middle leading-tight has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
				className,
			)}
			data-slot="table-cell"
			{...props}
		/>
	);
}

export function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">): React.ReactElement {
	return (
		<caption
			className={cn("mt-4 text-muted-foreground text-sm", className)}
			data-slot="table-caption"
			{...props}
		/>
	);
}

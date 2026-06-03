import type React from "react";

import { cn } from "@/lib/utils";

/** Standard page title block: heading, optional description, and right actions. */
export function PageHeader({
	title,
	description,
	actions,
	className,
}: {
	title: string;
	description?: string;
	actions?: React.ReactNode;
	className?: string;
}): React.ReactElement {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				className,
			)}
		>
			<div className="min-w-0 space-y-2">
				<h1 className="font-heading font-semibold text-3xl leading-tight tracking-tight sm:text-4xl">
					{title}
				</h1>
				{description && (
					<p className="max-w-2xl text-muted-foreground text-sm sm:text-base">
						{description}
					</p>
				)}
			</div>
			{actions && (
				<div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
					{actions}
				</div>
			)}
		</div>
	);
}

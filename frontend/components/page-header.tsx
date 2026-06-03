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
				"flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				className,
			)}
		>
			<div className="min-w-0 space-y-1.5">
				<h1 className="font-heading font-bold text-3xl leading-tight tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent dark:from-cyan-400 dark:via-fuchsia-400 dark:to-violet-400">
					{title}
				</h1>
				{description && (
					<p className="text-muted-foreground text-sm">{description}</p>
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

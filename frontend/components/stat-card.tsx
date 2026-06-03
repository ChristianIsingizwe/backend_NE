import type React from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "info";

const TONE_CLASSES: Record<Tone, string> = {
	default: "bg-muted text-foreground shadow-sm",
	success: "bg-success/15 text-success shadow-success/20 shadow-md",
	warning: "bg-warning/15 text-warning shadow-warning/20 shadow-md",
	destructive: "bg-destructive/15 text-destructive shadow-destructive/20 shadow-md",
	info: "bg-info/15 text-info shadow-info/20 shadow-md",
};

export function StatCard({
	label,
	value,
	hint,
	icon,
	tone = "default",
	loading = false,
}: {
	label: string;
	value: React.ReactNode;
	hint?: string;
	icon?: React.ReactNode;
	tone?: Tone;
	loading?: boolean;
}): React.ReactElement {
	return (
		<Card className="p-5">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 space-y-1.5">
					<p className="truncate text-muted-foreground text-sm font-medium">{label}</p>
					{loading ? (
						<Skeleton className="h-8 w-20" />
					) : (
						<p className="font-heading font-bold text-3xl tabular-nums leading-none">
							{value}
						</p>
					)}
					{hint && <p className="text-muted-foreground text-xs">{hint}</p>}
				</div>
				{icon && (
					<span
						className={cn(
							"flex size-10 shrink-0 items-center justify-center rounded-2xl [&_svg]:size-5",
							TONE_CLASSES[tone],
						)}
					>
						{icon}
					</span>
				)}
			</div>
		</Card>
	);
}

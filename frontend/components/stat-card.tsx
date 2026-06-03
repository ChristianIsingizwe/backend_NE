import type React from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "info";

const TONE_CLASSES: Record<Tone, string> = {
	default: "border-border bg-muted text-foreground",
	success: "border-emerald-200 bg-emerald-50 text-emerald-700",
	warning: "border-amber-200 bg-amber-50 text-amber-800",
	destructive: "border-rose-200 bg-rose-50 text-rose-700",
	info: "border-sky-200 bg-sky-50 text-sky-700",
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
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 space-y-2">
					<p className="truncate text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
						{label}
					</p>
					{loading ? (
						<Skeleton className="h-8 w-20" />
					) : (
						<p className="font-heading font-semibold text-3xl tabular-nums leading-none">
							{value}
						</p>
					)}
					{hint && <p className="text-muted-foreground text-xs">{hint}</p>}
				</div>
				{icon && (
					<span
						className={cn(
							"flex size-11 shrink-0 items-center justify-center rounded-xl border [&_svg]:size-5",
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

import Image from "next/image";
import type React from "react";

import { cn } from "@/lib/utils";

export function Brand({
	className,
	iconOnly = false,
	showSubtitle = true,
}: {
	className?: string;
	iconOnly?: boolean;
	showSubtitle?: boolean;
}): React.ReactElement {
	return (
		<span className={cn("flex items-center gap-2.5", className)}>
			<span className="relative flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40 ring-1 ring-white/20">
				<Image
					src="/logo.svg"
					alt={iconOnly ? "TZW Fire Safety" : ""}
					width={22}
					height={22}
					unoptimized
					priority
					className="size-5 shrink-0 brightness-0 invert"
				/>
			</span>
			{!iconOnly && (
				<span className="flex flex-col leading-none">
					<span className="font-heading font-bold text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-cyan-400 dark:to-fuchsia-400">
						TZW Fire Safety
					</span>
					{showSubtitle && (
						<span className="text-muted-foreground text-xs">
							Extinguisher Management
						</span>
					)}
				</span>
			)}
		</span>
	);
}

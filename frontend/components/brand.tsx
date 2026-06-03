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
		<span className={cn("flex items-center gap-3 text-current", className)}>
			<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-heading font-bold text-[11px] tracking-[0.22em] text-primary-foreground">
				TZW
			</span>
			{!iconOnly && (
				<span className="flex flex-col leading-none">
					<span className="font-heading font-semibold text-current text-sm tracking-[0.08em] uppercase">
						TZW Fire Safety
					</span>
					{showSubtitle && (
						<span className="text-[11px] text-current/65 uppercase tracking-[0.16em]">
							Extinguisher Management
						</span>
					)}
				</span>
			)}
		</span>
	);
}

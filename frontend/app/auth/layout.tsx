"use client";

import {
	CheckCircle2Icon,
	Clock3Icon,
	ShieldCheckIcon,
} from "lucide-react";
import { Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Brand } from "@/components/brand";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const highlights = [
	{
		icon: ShieldCheckIcon,
		label: "Compliance tracking",
		copy: "Monitor coverage, expiries, and service status from one place.",
	},
	{
		icon: Clock3Icon,
		label: "Inspection scheduling",
		copy: "Keep inspection cycles moving without spreadsheet follow-up.",
	},
	{
		icon: CheckCircle2Icon,
		label: "Audit readiness",
		copy: "Keep maintenance records and reports ready for every review.",
	},
];

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const isRegister = pathname.includes("/register");

	useEffect(() => {
		if (!isLoading && isAuthenticated && user?.emailVerified) {
			router.replace("/dashboard");
		}
	}, [isLoading, isAuthenticated, user?.emailVerified, router]);

	if (isLoading) {
		return (
			<div className="flex min-h-svh items-center justify-center bg-background">
				<Spinner className="size-5 text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.1fr)_minmax(28rem,0.9fr)]">
			<aside className="hidden border-e border-border bg-stone-950 px-8 py-10 text-stone-100 lg:flex lg:flex-col">
				<Brand className="text-stone-100" />
				<div className="mt-16 space-y-8">
					<Badge variant="secondary" className="bg-white/10 text-white">
						Operations platform
					</Badge>
					<div className="space-y-4">
						<h2 className="max-w-lg font-heading font-semibold text-4xl leading-tight tracking-tight">
							Control extinguisher operations with a cleaner, faster workspace.
						</h2>
						<p className="max-w-lg text-sm leading-6 text-stone-300">
							TZW keeps assets, inspections, maintenance, and reporting aligned in
							one operating surface built for compliance teams.
						</p>
					</div>
					<div className="grid gap-4">
						{highlights.map((item) => {
							const Icon = item.icon;
							return (
								<Card
									key={item.label}
									className="border-white/10 bg-white/6 text-stone-100 shadow-none"
								>
									<div className="flex gap-4 p-5">
										<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-300">
											<Icon className="size-5" />
										</span>
										<div className="space-y-1">
											<p className="font-medium">{item.label}</p>
											<p className="text-sm text-stone-300">{item.copy}</p>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				</div>
				<div className="mt-auto flex items-center justify-between text-sm text-stone-400">
					<span>Security-first fire safety operations</span>
					{isRegister && (
						<a
							href="mailto:help@tzw.test"
							className="inline-flex items-center gap-2 text-stone-200 transition-colors hover:text-white"
						>
							<Mail className="size-4" />
							help@tzw.test
						</a>
					)}
				</div>
			</aside>

			<section className="flex min-h-svh flex-col px-5 py-6 sm:px-8 lg:px-12">
				<div className="lg:hidden">
					<Brand />
				</div>
				<main className="flex flex-1 items-center justify-center py-8 sm:py-12">
					<Card className="w-full max-w-xl p-8 sm:p-10">{children}</Card>
				</main>
				<p className="text-center text-muted-foreground text-sm lg:hidden">
					TZW Fire Safety
				</p>
			</section>
		</div>
	);
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Brand } from "@/components/brand";
import { useAuth } from "@/components/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();

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
			<aside className="hidden border-e border-border bg-stone-950 lg:block" />

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

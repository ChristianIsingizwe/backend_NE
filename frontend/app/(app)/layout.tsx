"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import {
	canRoleAccessPath,
	fallbackPortalRoute,
	rolePortalLabel,
} from "@/lib/role-portal";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { VerifyEmailBanner } from "@/components/verify-email-banner";

const SECTION_TITLES: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/extinguishers": "Extinguishers",
	"/inspections": "Inspections",
	"/maintenance": "Maintenance",
	"/reports": "Reports",
	"/notifications": "Alerts",
	"/users": "Users",
	"/settings": "Settings",
};

function sectionTitle(pathname: string): string {
	const match = Object.keys(SECTION_TITLES).find(
		(href) => pathname === href || pathname.startsWith(`${href}/`),
	);
	return match ? SECTION_TITLES[match] : "TZW Fire Safety";
}

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const canAccessPath = user ? canRoleAccessPath(user.role, pathname) : false;

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			const redirect = encodeURIComponent(pathname);
			router.replace(`/auth/login?redirect=${redirect}`);
		}
	}, [isLoading, isAuthenticated, pathname, router]);

	useEffect(() => {
		if (!isLoading && user && !canAccessPath) {
			router.replace(fallbackPortalRoute());
		}
	}, [canAccessPath, isLoading, router, user]);

	if (isLoading || !isAuthenticated || !user || !canAccessPath) {
		return (
			<div className="flex min-h-svh items-center justify-center bg-background">
				<Spinner className="size-5 text-muted-foreground" />
			</div>
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:px-6">
					<div className="flex items-center gap-3">
						<SidebarTrigger className="md:hidden" />
						<div className="min-w-0">
							<p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
								{rolePortalLabel(user.role)}
							</p>
							<h2 className="truncate font-heading font-semibold text-xl tracking-tight">
								{sectionTitle(pathname)}
							</h2>
						</div>
						<Badge variant="outline" className="ms-auto hidden sm:inline-flex">
							Fire Safety Platform
						</Badge>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-5 p-4 sm:gap-6 sm:p-6">
					<VerifyEmailBanner />
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

"use client";

import {
	CircleCheckIcon,
	ClipboardCheckIcon,
	FireExtinguisherIcon,
	ShieldCheckIcon,
	TriangleAlertIcon,
	UsersIcon,
	WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import { ChartPlaceholder } from "@/components/ui/chart-common";
import { DonutChart } from "@/components/ui/donut-chart";
import { useExtinguishers } from "@/lib/api/extinguishers";
import {
	useComplianceReport,
	useInspectionReport,
	useInventoryReport,
	useMaintenanceReport,
} from "@/lib/api/reports";
import type { UserRole } from "@/lib/api/types";
import { formatDate, humanize } from "@/lib/format";

type CardTone = "default" | "success" | "warning" | "destructive" | "info";

type DashboardMetric = {
	label: string;
	value: number | string;
	icon: React.ReactNode;
	loading: boolean;
	tone?: CardTone;
};

function AttentionList({
	items,
	empty,
	footerHref,
	footerLabel,
}: {
	items: Array<{
		id: string;
		serialNumber: string;
		location: string;
		daysRemaining: number;
	}>;
	empty: string;
	footerHref: string;
	footerLabel: string;
}): React.ReactElement {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Needs attention</CardTitle>
				<CardDescription>
					Expired or soon-to-expire extinguishers that need follow-up.
				</CardDescription>
			</CardHeader>
			<CardPanel className="space-y-2">
				{items.slice(0, 6).map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between gap-3 rounded-lg border p-3"
					>
						<div className="min-w-0">
							<p className="truncate font-medium text-sm">{item.serialNumber}</p>
							<p className="truncate text-muted-foreground text-xs">
								{item.location}
							</p>
						</div>
						<Badge variant={item.daysRemaining < 0 ? "error" : "warning"}>
							{item.daysRemaining < 0
								? `Expired ${Math.abs(item.daysRemaining)}d ago`
								: `${item.daysRemaining}d left`}
						</Badge>
					</div>
				))}
				{items.length === 0 && (
					<p className="py-6 text-center text-muted-foreground text-sm">{empty}</p>
				)}
			</CardPanel>
			<div className="border-t px-6 py-3">
				<Button variant="ghost" size="sm" render={<Link href={footerHref} />}>
					{footerLabel}
				</Button>
			</div>
		</Card>
	);
}

function OverdueInspectionList({
	items,
	serialById,
	empty,
	footerLabel,
}: {
	items: Array<{ id: string; extinguisherId: string; scheduledDate: string }>;
	serialById: Map<string, string>;
	empty: string;
	footerLabel: string;
}): React.ReactElement {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Overdue inspections</CardTitle>
				<CardDescription>
					Inspections that should already have been completed.
				</CardDescription>
			</CardHeader>
			<CardPanel className="space-y-2">
				{items.slice(0, 6).map((inspection) => (
					<div
						key={inspection.id}
						className="flex items-center justify-between gap-3 rounded-lg border p-3"
					>
						<div className="min-w-0">
							<p className="truncate font-medium text-sm">
								{serialById.get(inspection.extinguisherId) ?? "Extinguisher"}
							</p>
							<p className="truncate text-muted-foreground text-xs">
								Due {formatDate(inspection.scheduledDate)}
							</p>
						</div>
						<Badge variant="warning">Overdue</Badge>
					</div>
				))}
				{items.length === 0 && (
					<p className="py-6 text-center text-muted-foreground text-sm">{empty}</p>
				)}
			</CardPanel>
			<div className="border-t px-6 py-3">
				<Button variant="ghost" size="sm" render={<Link href="/inspections" />}>
					{footerLabel}
				</Button>
			</div>
		</Card>
	);
}

function metricsForRole(
	role: UserRole,
	values: {
		total: number;
		active: number;
		expired: number;
		complianceRate: number;
		pending: number;
		overdue: number;
		recentMaintenance: number;
		upcoming: number;
		openAlerts: number;
	},
	loading: {
		inventory: boolean;
		compliance: boolean;
		inspections: boolean;
		maintenance: boolean;
	},
): DashboardMetric[] {
	switch (role) {
		case "user":
			return [
				{
					label: "Extinguishers",
					value: values.total,
					icon: <FireExtinguisherIcon />,
					loading: loading.inventory,
				},
				{
					label: "Active units",
					value: values.active,
					tone: "success",
					icon: <CircleCheckIcon />,
					loading: loading.inventory,
				},
				{
					label: "Scheduled inspections",
					value: values.pending,
					icon: <ClipboardCheckIcon />,
					loading: loading.inspections,
				},
				{
					label: "Overdue inspections",
					value: values.overdue,
					tone: values.overdue > 0 ? "warning" : "default",
					icon: <TriangleAlertIcon />,
					loading: loading.inspections,
				},
			];
		case "inspector":
			return [
				{
					label: "Pending inspections",
					value: values.pending,
					icon: <ClipboardCheckIcon />,
					loading: loading.inspections,
				},
				{
					label: "Overdue inspections",
					value: values.overdue,
					tone: values.overdue > 0 ? "warning" : "default",
					icon: <TriangleAlertIcon />,
					loading: loading.inspections,
				},
				{
					label: "Maintenance (30d)",
					value: values.recentMaintenance,
					icon: <WrenchIcon />,
					loading: loading.maintenance,
				},
				{
					label: "Expiring soon",
					value: values.upcoming,
					tone: values.upcoming > 0 ? "warning" : "default",
					icon: <FireExtinguisherIcon />,
					loading: loading.compliance,
				},
			];
		case "admin":
			return [
				{
					label: "Extinguishers",
					value: values.total,
					icon: <FireExtinguisherIcon />,
					loading: loading.inventory,
				},
				{
					label: "Compliance",
					value: `${values.complianceRate}%`,
					tone: "info",
					icon: <ShieldCheckIcon />,
					loading: loading.compliance,
				},
				{
					label: "Expired",
					value: values.expired,
					tone: values.expired > 0 ? "destructive" : "default",
					icon: <TriangleAlertIcon />,
					loading: loading.compliance,
				},
				{
					label: "Open alerts",
					value: values.openAlerts,
					tone: values.openAlerts > 0 ? "warning" : "default",
					icon: <ClipboardCheckIcon />,
					loading: loading.compliance || loading.inspections,
				},
			];
	}
}

export default function DashboardPage(): React.ReactElement {
	const { user } = useAuth();
	const role: UserRole = user?.role ?? "user";

	const inventory = useInventoryReport();
	const compliance = useComplianceReport();
	const inspections = useInspectionReport();
	const maintenance = useMaintenanceReport();
	const extinguishers = useExtinguishers();

	const serialById = useMemo(() => {
		const map = new Map<string, string>();
		for (const extinguisher of extinguishers.data ?? []) {
			map.set(extinguisher.id, extinguisher.serialNumber);
		}
		return map;
	}, [extinguishers.data]);

	const metrics = metricsForRole(
		role,
		{
			total: inventory.data?.total ?? 0,
			active: inventory.data?.byStatus.active ?? 0,
			expired: compliance.data?.expiredCount ?? 0,
			complianceRate: compliance.data?.complianceRate ?? 100,
			pending: inspections.data?.pending ?? 0,
			overdue: inspections.data?.overdue ?? 0,
			recentMaintenance: maintenance.data?.recentCount ?? 0,
			upcoming: compliance.data?.upcomingCount ?? 0,
			openAlerts:
				(compliance.data?.expiredCount ?? 0) +
				(compliance.data?.upcomingCount ?? 0) +
				(inspections.data?.overdue ?? 0),
		},
		{
			inventory: inventory.isLoading,
			compliance: compliance.isLoading,
			inspections: inspections.isLoading,
			maintenance: maintenance.isLoading,
		},
	);

	const statusData = Object.entries(inventory.data?.byStatus ?? {}).map(
		([key, value]) => ({
			name: humanize(key),
			value,
		}),
	);
	const inspectionData = [
		{ name: "Pending", Inspections: inspections.data?.pending ?? 0 },
		{ name: "Completed", Inspections: inspections.data?.completed ?? 0 },
		{ name: "Overdue", Inspections: inspections.data?.overdue ?? 0 },
		{ name: "Cancelled", Inspections: inspections.data?.cancelled ?? 0 },
	];
	const attentionItems = [
		...(compliance.data?.expired ?? []),
		...(compliance.data?.upcoming ?? []),
	];
	const pendingItems = inspections.data?.items.pending ?? [];
	const overdueItems = inspections.data?.items.overdue ?? [];

	const headerDescription =
		role === "user"
			? "Track extinguisher status and keep your inspection requests moving."
			: role === "inspector"
				? "Work through inspections, maintenance, and the assets that need attention."
				: "Oversee users, compliance posture, and the operational data that keeps the platform trustworthy.";

	return (
		<div className="space-y-6">
			<PageHeader
				title={`Welcome${user ? `, ${user.firstName}` : ""}`}
				description={headerDescription}
			/>

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{metrics.map((metric) => (
					<StatCard
						key={metric.label}
						label={metric.label}
						value={metric.value}
						tone={metric.tone}
						icon={metric.icon}
						loading={metric.loading}
					/>
				))}
			</div>

			{role === "user" && (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Upcoming inspections</CardTitle>
							<CardDescription>
								Inspections you can review and schedule from your portal.
							</CardDescription>
						</CardHeader>
						<CardPanel className="space-y-2">
							{pendingItems.slice(0, 6).map((inspection) => (
								<div
									key={inspection.id}
									className="flex items-center justify-between gap-3 rounded-lg border p-3"
								>
									<div className="min-w-0">
										<p className="truncate font-medium text-sm">
											{serialById.get(inspection.extinguisherId) ?? "Extinguisher"}
										</p>
										<p className="truncate text-muted-foreground text-xs">
											Scheduled for {formatDate(inspection.scheduledDate)}
										</p>
									</div>
									<Badge variant="secondary">Scheduled</Badge>
								</div>
							))}
							{pendingItems.length === 0 && (
								<p className="py-6 text-center text-muted-foreground text-sm">
									No inspections are currently scheduled.
								</p>
							)}
						</CardPanel>
						<div className="border-t px-6 py-3">
							<Button
								variant="ghost"
								size="sm"
								render={<Link href="/inspections" />}
							>
								Open inspections
							</Button>
						</div>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Registry status</CardTitle>
							<CardDescription>
								Read-only lifecycle overview of the extinguisher fleet.
							</CardDescription>
						</CardHeader>
						<CardPanel>
							<div className="h-64">
								{inventory.data ? (
									<DonutChart data={statusData} category="value" index="name" />
								) : (
									<ChartPlaceholder loading={inventory.isLoading} />
								)}
							</div>
						</CardPanel>
					</Card>
				</div>
			)}

			{role === "inspector" && (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Inspection workload</CardTitle>
							<CardDescription>
								Current inspection state across the work you can act on.
							</CardDescription>
						</CardHeader>
						<CardPanel>
							<div className="h-64">
								{inspections.data ? (
									<BarChart
										data={inspectionData}
										index="name"
										categories={["Inspections"]}
										showLegend={false}
									/>
								) : (
									<ChartPlaceholder loading={inspections.isLoading} />
								)}
							</div>
						</CardPanel>
					</Card>

					<AttentionList
						items={attentionItems}
						empty="Nothing currently needs follow-up."
						footerHref="/extinguishers"
						footerLabel="Open extinguishers"
					/>
				</div>
			)}

			{role === "admin" && (
				<>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Inventory by status</CardTitle>
								<CardDescription>
									High-level posture across the platform&apos;s asset data.
								</CardDescription>
							</CardHeader>
							<CardPanel>
								<div className="h-64">
									{inventory.data ? (
										<DonutChart
											data={statusData}
											category="value"
											index="name"
										/>
									) : (
										<ChartPlaceholder loading={inventory.isLoading} />
									)}
								</div>
							</CardPanel>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<UsersIcon className="size-4" />
									Administration
								</CardTitle>
								<CardDescription>
									Jump straight to the admin surfaces for account management and
									oversight.
								</CardDescription>
							</CardHeader>
							<CardPanel className="space-y-3">
								<Button className="w-full justify-start" render={<Link href="/users" />}>
									Manage users
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									render={<Link href="/reports" />}
								>
									Open reports
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									render={<Link href="/notifications" />}
								>
									Review alerts
								</Button>
							</CardPanel>
						</Card>
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<AttentionList
							items={attentionItems}
							empty="Everything is compliant."
							footerHref="/notifications"
							footerLabel="View all alerts"
						/>

						<OverdueInspectionList
							items={overdueItems}
							serialById={serialById}
							empty="No overdue inspections."
							footerLabel="Manage inspections"
						/>
					</div>
				</>
			)}

			{role === "inspector" && (
				<OverdueInspectionList
					items={overdueItems}
					serialById={serialById}
					empty="No overdue inspections."
					footerLabel="Manage inspections"
				/>
			)}
		</div>
	);
}

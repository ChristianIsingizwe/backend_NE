import type { UserRole } from "@/lib/api/types";

export type PortalRoute =
	| "/dashboard"
	| "/extinguishers"
	| "/inspections"
	| "/maintenance"
	| "/reports"
	| "/notifications"
	| "/users"
	| "/settings";

const ROUTE_ACCESS: Record<PortalRoute, UserRole[]> = {
	"/dashboard": ["user", "inspector", "admin"],
	"/extinguishers": ["user", "inspector", "admin"],
	"/inspections": ["user", "inspector", "admin"],
	"/maintenance": ["inspector"],
	"/reports": ["admin"],
	"/notifications": ["inspector", "admin"],
	"/users": ["admin"],
	"/settings": ["user", "inspector", "admin"],
};

export function canRoleAccessRoute(
	role: UserRole,
	route: PortalRoute,
): boolean {
	return ROUTE_ACCESS[route].includes(role);
}

export function canRoleAccessPath(role: UserRole, pathname: string): boolean {
	const route = (Object.keys(ROUTE_ACCESS) as PortalRoute[]).find(
		(href) => pathname === href || pathname.startsWith(`${href}/`),
	);
	return route ? canRoleAccessRoute(role, route) : true;
}

export function rolePortalLabel(role: UserRole): string {
	switch (role) {
		case "user":
			return "User Portal";
		case "inspector":
			return "Inspector Portal";
		case "admin":
			return "Admin Portal";
	}
}

export function fallbackPortalRoute(): PortalRoute {
	return "/dashboard";
}

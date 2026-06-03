import { Agentation } from "agentation";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Sora } from "next/font/google";

import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";

import "./globals.css";

const heading = Sora({ subsets: ["latin"], variable: "--font-heading" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
	title: "TZW Fire Safety - Extinguisher Management",
	description:
		"Track fire extinguishers, schedule inspections, log maintenance and monitor compliance.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				"font-sans",
				sans.variable,
				heading.variable,
				mono.variable,
			)}
		>
			<body className="flex min-h-full flex-col bg-background text-foreground">
				<Providers>{children}</Providers>
				{process.env.NODE_ENV === "development" && <Agentation />}
			</body>
		</html>
	);
}

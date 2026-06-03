import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Agentation } from "agentation";

import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({ subsets: ["latin"], variable: "--font-heading" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "TZW Fire Safety — Extinguisher Management",
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
				outfit.variable,
				outfitHeading.variable,
				spaceGrotesk.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
				<Providers>{children}</Providers>
				{process.env.NODE_ENV === "development" && <Agentation />}
			</body>
		</html>
	);
}

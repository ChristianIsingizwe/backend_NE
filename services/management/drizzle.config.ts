import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const serviceDir = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(serviceDir, ".env") });

if (!process.env.DATABASE_URL) {
	throw new Error(
		`DATABASE_URL is missing. Expected it in ${resolve(serviceDir, ".env")}`,
	);
}

export default {
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
} satisfies Config;

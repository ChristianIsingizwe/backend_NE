import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const seedFilePath = resolve(rootDir, "scripts/seed-dev.sql");
const seededAdmin = {
	email: "admin@tzw.test",
	role: "admin",
	displayName: "CHRISTIAN Admin",
	passwordHash: "$2b$12$HJJ.Ck4K3qhnHgqBLg2ZWukqlPVT.RPXG0e2HAcwPyM3IS43L9LVO",
};

function parseEnvFile(filePath) {
	const content = readFileSync(filePath, "utf8");
	const env = {};

	for (const rawLine of content.split(/\r?\n/u)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) {
			continue;
		}

		const separatorIndex = line.indexOf("=");
		if (separatorIndex === -1) {
			continue;
		}

		const key = line.slice(0, separatorIndex).trim();
		let value = line.slice(separatorIndex + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		env[key] = value;
	}

	return env;
}

function getDatabaseUrl(envPath) {
	const envOverrideKey =
		envPath === "services/auth/.env" ? "AUTH_DATABASE_URL" : undefined;

	const overriddenDatabaseUrl = envOverrideKey ? process.env[envOverrideKey] : undefined;
	if (overriddenDatabaseUrl) {
		return overriddenDatabaseUrl;
	}

	const filePath = resolve(rootDir, envPath);

	if (!existsSync(filePath)) {
		throw new Error(`Missing env file: ${filePath}`);
	}

	const env = parseEnvFile(filePath);
	const databaseUrl = env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(`DATABASE_URL is missing in ${filePath}`);
	}

	return databaseUrl;
}

function escapeLiteral(value) {
	return `'${value.replaceAll("'", "''")}'`;
}

function runPsql(connectionString, sql) {
	return execFileSync(
		"psql",
		["-v", "ON_ERROR_STOP=1", "-tAc", sql, "-d", connectionString],
		{
			cwd: rootDir,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "pipe"],
		},
	).trim();
}

function seededAdminExists(authDatabaseUrl) {
	const sql = `
		select 1
		from users
		where email = ${escapeLiteral(seededAdmin.email)}
			and role = ${escapeLiteral(seededAdmin.role)}
			and display_name = ${escapeLiteral(seededAdmin.displayName)}
			and password = ${escapeLiteral(seededAdmin.passwordHash)}
			and email_verified is not null
		limit 1
	`;

	return runPsql(authDatabaseUrl, sql) === "1";
}

function runSeed(authDatabaseUrl) {
	execFileSync("psql", ["-v", "ON_ERROR_STOP=1", "-d", authDatabaseUrl, "-f", seedFilePath], {
		cwd: rootDir,
		encoding: "utf8",
		stdio: "inherit",
	});
}

try {
	const authDatabaseUrl = getDatabaseUrl("services/auth/.env");

	if (seededAdminExists(authDatabaseUrl)) {
		console.log("[db:seed:if-needed] seeded admin already present; skipping seed");
		process.exit(0);
	}

	console.log("[db:seed:if-needed] seeded admin missing; applying admin seed");
	runSeed(authDatabaseUrl);
} catch (error) {
	console.error("[db:seed:if-needed] failed");
	if (error instanceof Error) {
		console.error(error.message);
	} else {
		console.error(error);
	}
	process.exitCode = 1;
}

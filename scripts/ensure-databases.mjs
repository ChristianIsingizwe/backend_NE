import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const statefulServices = [
	{ name: "auth", envPath: "services/auth/.env" },
	{
		name: "management",
		envPath: "services/management/.env",
	},
	{
		name: "notification",
		envPath: "services/notification/.env",
	},
];

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

function getServiceDatabaseUrl(service) {
	const envFilePath = resolve(rootDir, service.envPath);

	if (!existsSync(envFilePath)) {
		throw new Error(`Missing env file for ${service.name}: ${envFilePath}`);
	}

	const env = parseEnvFile(envFilePath);
	const databaseUrl = env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(`DATABASE_URL is missing in ${envFilePath}`);
	}

	return databaseUrl;
}

function escapeIdentifier(identifier) {
	return `"${identifier.replaceAll('"', '""')}"`;
}

function escapeLiteral(value) {
	return `'${value.replaceAll("'", "''")}'`;
}

function runPsql(connectionString, sql) {
	return execFileSync(
		"psql",
		[
			// Keep flags before the target connection. With psql, passing the
			// connection string first can cause later flags/SQL to be ignored as
			// extra positional arguments.
			"-v",
			"ON_ERROR_STOP=1",
			"-tAc",
			sql,
			"-d",
			connectionString,
		],
		{
			cwd: rootDir,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "pipe"],
		},
	).trim();
}

function ensureDatabaseExists(service) {
	const databaseUrl = getServiceDatabaseUrl(service);
	const targetUrl = new URL(databaseUrl);
	const databaseName = targetUrl.pathname.replace(/^\//u, "");

	if (!databaseName) {
		throw new Error(`DATABASE_URL for ${service.name} does not include a database name`);
	}

	const adminUrl = new URL(databaseUrl);
	adminUrl.pathname = "/postgres";

	const existingDatabase = runPsql(
		adminUrl.toString(),
		`select 1 from pg_database where datname = ${escapeLiteral(databaseName)}`,
	);

	if (existingDatabase === "1") {
		console.log(`[db:ensure] ${databaseName} already exists for ${service.name}`);
		return;
	}

	runPsql(
		adminUrl.toString(),
		`create database ${escapeIdentifier(databaseName)}`,
	);
	console.log(`[db:ensure] created ${databaseName} for ${service.name}`);
}

try {
	for (const service of statefulServices) {
		ensureDatabaseExists(service);
	}
} catch (error) {
	console.error("[db:ensure] failed to ensure databases");
	if (error instanceof Error) {
		console.error(error.message);
	} else {
		console.error(error);
	}
	process.exitCode = 1;
}

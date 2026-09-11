import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = process.env.SEED_PATH || path.join(root, "seed/seed.json");
const databasePath = process.env.DATABASE_PATH || path.join(root, "data.db");
const uploadsDir = process.env.UPLOADS_DIR || path.join(root, "uploads");

const source = JSON.parse(await readFile(sourcePath, "utf8"));
const schemaOnlySeed = {
	$schema: source.$schema,
	version: source.version,
	meta: source.meta,
	collections: source.collections,
};

const temporaryDir = await mkdtemp(path.join(os.tmpdir(), "sustainomics-schema-"));
const temporarySeedPath = path.join(temporaryDir, "schema.json");

try {
	await writeFile(temporarySeedPath, `${JSON.stringify(schemaOnlySeed, null, "\t")}\n`);

	const exitCode = await new Promise((resolve, reject) => {
		const child = spawn(
			path.join(root, "node_modules/.bin/emdash"),
			[
				"seed",
				temporarySeedPath,
				"--database",
				databasePath,
				"--uploads-dir",
				uploadsDir,
				"--on-conflict=update",
			],
			{ cwd: root, stdio: "inherit" },
		);

		child.once("error", reject);
		child.once("exit", (code, signal) => {
			if (signal) reject(new Error(`EmDash schema sync stopped by ${signal}`));
			else resolve(code ?? 1);
		});
	});

	if (exitCode !== 0) process.exitCode = exitCode;
} finally {
	await rm(temporaryDir, { recursive: true, force: true });
}

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const databasePath = process.env.DATABASE_PATH || path.join(root, "data.db");
const uploadsDir = process.env.UPLOADS_DIR || path.join(root, "uploads");
const seed = JSON.parse(fs.readFileSync(path.join(root, "seed/seed.json"), "utf8"));
const db = new Database(databasePath);

const media = new Map();
const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];

function storageKeyFor(value) {
	const explicit = value?.meta?.storageKey;
	if (explicit && fs.existsSync(path.join(uploadsDir, explicit))) return explicit;

	const byId = files.find((file) => file.startsWith(`${value.id}.`));
	if (byId) return byId;

	if (value.filename) {
		const extension = path.extname(value.filename).toLowerCase();
		const exact = files.find((file) => file === value.filename);
		if (exact) return exact;
		const sameType = files.find((file) => file.startsWith(value.id) && path.extname(file).toLowerCase() === extension);
		if (sameType) return sameType;
	}

	return null;
}

function walk(value) {
	if (Array.isArray(value)) return value.forEach(walk);
	if (!value || typeof value !== "object") return;

	if (typeof value.id === "string" && value.provider === "local" && value.filename) {
		const storageKey = storageKeyFor(value);
		if (storageKey) media.set(value.id, { ...value, storageKey });
	}

	Object.values(value).forEach(walk);
}

walk(seed);

const insert = db.prepare(`
	INSERT INTO media (id, filename, mime_type, size, storage_key, status)
	VALUES (?, ?, ?, ?, ?, 'ready')
	ON CONFLICT(id) DO UPDATE SET
		filename = excluded.filename,
		mime_type = excluded.mime_type,
		size = excluded.size,
		storage_key = excluded.storage_key,
		status = 'ready'
`);

let registered = 0;
db.transaction(() => {
	for (const item of media.values()) {
		const filePath = path.join(uploadsDir, item.storageKey);
		if (!fs.existsSync(filePath)) continue;
		insert.run(
			item.id,
			item.filename,
			item.mimeType || "application/octet-stream",
			fs.statSync(filePath).size,
			item.storageKey,
		);
		registered++;
	}
})();

function repairValue(value) {
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const repaired = repairValue(item);
			changed ||= repaired.changed;
			return repaired.value;
		});
		return { value: next, changed };
	}
	if (!value || typeof value !== "object") return { value, changed: false };

	let changed = false;
	const next = {};
	for (const [key, item] of Object.entries(value)) {
		const repaired = repairValue(item);
		next[key] = repaired.value;
		changed ||= repaired.changed;
	}

	if (typeof value.id === "string" && value.provider === "local") {
		const storageKey = media.get(value.id)?.storageKey;
		if (storageKey && value.meta?.storageKey !== storageKey) {
			next.meta = { ...(value.meta || {}), storageKey };
			changed = true;
		}
	}

	return { value: next, changed };
}

let repairedReferences = 0;
db.transaction(() => {
	for (const table of ["ec_posts", "ec_articles", "ec_magazines", "ec_videos", "ec_podcasts", "revisions"]) {
		const exists = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table);
		if (!exists) continue;
		const columns = db.prepare(`PRAGMA table_info(${table})`).all();
		const candidates = table === "revisions"
			? ["data"]
			: columns.map((column) => column.name).filter((name) => /image|thumbnail|cover|pdf|audio|content/.test(name));
		for (const column of candidates) {
			const rows = db.prepare(`SELECT id, ${column} AS value FROM ${table} WHERE ${column} IS NOT NULL`).all();
			const update = db.prepare(`UPDATE ${table} SET ${column} = ? WHERE id = ?`);
			for (const row of rows) {
				let parsed;
				try { parsed = JSON.parse(row.value); } catch { continue; }
				const repaired = repairValue(parsed);
				if (!repaired.changed) continue;
				update.run(JSON.stringify(repaired.value), row.id);
				repairedReferences++;
			}
		}
	}
})();

console.log(`Registered ${registered} bundled media files and repaired ${repairedReferences} content references.`);

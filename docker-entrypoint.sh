#!/bin/sh
set -e

# --- Persisted directories on the mounted /data volume ---------------------
mkdir -p /data/uploads

# Seed the repo's bundled media (magazine covers, PDFs, demo images) into the
# uploads volume. -n => never clobber files an editor uploaded at runtime.
cp -rn /app/uploads/. /data/uploads/ 2>/dev/null || true

# scripts/setup-magazines.mjs (and emdash's default) open ./data.db relative to
# the app root. Bridge that to the real DB on the volume so every tool writes
# the same persisted database.
ln -sf /data/data.db /app/data.db

# --- Database bootstrap ----------------------------------------------------
# First boot only: create schema, run migrations, apply the bundled seed.
# Subsequent boots keep existing content (CMS data persists across updates).
if [ ! -f /data/data.db ]; then
	if [ "${NODE_ENV:-}" = "production" ] && [ "${ALLOW_FRESH_DATABASE:-}" != "1" ]; then
		echo "[entrypoint] ERROR: /data/data.db is missing. Refusing to replace production content with the bundled seed."
		echo "[entrypoint] For a new empty volume, follow the one-time bootstrap steps in DEPLOYMENT.md."
		echo "[entrypoint] Do not enable fresh bootstrap when an existing production database is unexpectedly missing."
		exit 1
	fi
  echo "[entrypoint] fresh database -> seeding"
  node_modules/.bin/emdash seed seed/seed.json --database /data/data.db --uploads-dir /data/uploads --on-conflict=update
else
	# A bundled seed is only applied automatically to an empty database. Keep
	# the schema of an existing CMS database in sync without importing or
	# overwriting any of the seed's sample content.
	echo "[entrypoint] existing database -> syncing schema"
	DATABASE_PATH=/data/data.db UPLOADS_DIR=/data/uploads node scripts/sync-seed-schema.mjs
fi

# Keep bundled seed media resolvable through EmDash. The seed stores media
# references in content, while the actual binaries are copied above.
DATABASE_PATH=/data/data.db UPLOADS_DIR=/data/uploads node scripts/register-seed-media.mjs

# Always run: register magazine issues + their media. Idempotent (ON CONFLICT
# DO NOTHING), so re-running on every deploy just adds anything new.
echo "[entrypoint] running setup-magazines"
node scripts/setup-magazines.mjs

exec "$@"

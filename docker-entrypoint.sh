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
		echo "[entrypoint] Set ALLOW_FRESH_DATABASE=1 only for the first intentional bootstrap."
		exit 1
	fi
  echo "[entrypoint] fresh database -> seeding"
  node_modules/.bin/emdash seed seed/seed.json --database /data/data.db --uploads-dir /data/uploads --on-conflict=update
fi

# Keep bundled seed media resolvable through EmDash. The seed stores media
# references in content, while the actual binaries are copied above.
DATABASE_PATH=/data/data.db UPLOADS_DIR=/data/uploads node scripts/register-seed-media.mjs

# Always run: register magazine issues + their media. Idempotent (ON CONFLICT
# DO NOTHING), so re-running on every deploy just adds anything new.
echo "[entrypoint] running setup-magazines"
node scripts/setup-magazines.mjs

exec "$@"

# Deploying The Sustainomics (Railway)

## Architecture

- **Railway** project `sustainomics`, service `web`
- **Dockerfile** multi-stage build (Node 22 + pnpm + better-sqlite3)
- **Volume** mounted at `/data` for SQLite + uploads (persists across deploys)
- **CI/CD:** GitHub Actions deploys on every push to `main` via Railway CLI

Live URL: https://thesustainomics.com

Railway default domain (still active): https://web-production-e769d.up.railway.app

## First-time setup (already done once)

1. Railway project + `web` service created and linked
2. Volume `web-volume` mounted at `/data`
3. Public domain generated
4. Environment variables set (see below)

Docker Compose first boot of an empty `cms-data` volume:

```bash
ALLOW_FRESH_DATABASE=1 docker compose up --build
# After the site starts, restart without the flag:
docker compose up -d
```

If you recreate the Railway project from scratch:

```bash
cd sustainomics
railway login
railway init --name sustainomics
railway add --service web
railway service link web
railway volume add --mount-path /data
railway domain --port 3000
# Set the normal variables below. Then explicitly approve the first seed:
railway variable set ALLOW_FRESH_DATABASE=1
railway up --service web
# After the site starts successfully, immediately restore the safety guard:
railway variable set ALLOW_FRESH_DATABASE=0
```

`ALLOW_FRESH_DATABASE=1` is only for the first start of a new, empty `/data`
volume. If an existing deployment unexpectedly reports a missing database, do
not enable it—reattach or restore the production volume instead.

## Environment variables

Set on the Railway service (`railway variable set` or dashboard):

| Variable | Purpose |
|----------|---------|
| `EMDASH_ENCRYPTION_KEY` | Stable CMS encryption secret. Generate once; never rotate casually. |
| `EMDASH_SITE_URL` | Public origin, currently `https://thesustainomics.com` |
| `ORIGIN` | Same as `EMDASH_SITE_URL` — baked into Astro `site` at **build** time |
| `DATABASE_URL` | `file:/data/data.db` |
| `UPLOADS_DIR` | `/data/uploads` |
| `HOST` | `0.0.0.0` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `ALLOW_FRESH_DATABASE` | `0` normally. Temporarily set to `1` only for the first intentional bootstrap of an empty volume. |

Generate a new encryption key:

```bash
echo "emdash_enc_v1_$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=')"
```

After changing the public domain, update **both** `EMDASH_SITE_URL` and `ORIGIN`, then redeploy so Astro rebuilds with the correct `site`.

## GitHub Actions CI/CD

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

On every push to `main` (and manual `workflow_dispatch`):

1. Checkout the repo
2. Install Railway CLI
3. `railway up --service web --ci`
4. Smoke-test the public homepage

### Required GitHub secret

| Secret | Value |
|--------|-------|
| `RAILWAY_TOKEN` | Railway **workspace API token** for the `gcpit.tech@gmail.com` workspace that owns project `sustainomics` |

The workflow already has this secret on `sudo-yogi/sustainomics`. GitHub stores it as `RAILWAY_TOKEN`; the job maps it to `RAILWAY_API_TOKEN` because this is a workspace token, not a project token.

To rotate it:

1. Create a workspace token at https://railway.com/account/tokens (or GraphQL `apiTokenCreate` with workspaceId `d3e8caed-0ddd-4c34-9d59-242044f38ddc`)
2. Store it on GitHub:

```bash
gh secret set RAILWAY_TOKEN --repo sudo-yogi/sustainomics
```

The workflow pins `--project c44febb1-a9ae-4984-bd54-4817e910c186 --environment production --service web` so the token only deploys this project.

Optional repository variable:

| Variable | Value |
|----------|-------|
| `SITE_URL` | `https://thesustainomics.com` |

### Alternative: Railway GitHub App (native autodeploy)

The Railway GitHub App currently cannot see `sudo-yogi/sustainomics`, so deploys go through Actions instead of `railway service source connect`. If you later grant the [Railway GitHub App](https://github.com/settings/installations) access to that org:

```bash
railway service source connect --repo sudo-yogi/sustainomics --branch main --service web
```

## Config as code

[`railway.toml`](railway.toml) pins:

- Dockerfile builder
- Healthcheck on `/`
- Restart on failure

## Day-to-day

```bash
# Link local dir (once)
railway link   # project sustainomics, env production, service web

# Deploy from laptop
railway up --service web

# Logs
railway logs --service web
railway logs --build

# Redeploy latest image (no rebuild)
railway restart --service web

# Open dashboard
railway open
```

## First boot / admin

On first start the container entrypoint:

1. Ensures `/data/uploads` exists
2. Seeds bundled media into the volume
3. Refuses to create a missing production database unless `ALLOW_FRESH_DATABASE=1`
4. With that one-time approval, creates `/data/data.db` from `seed/seed.json`
5. On later starts, syncs collection fields without replacing CMS content
6. Registers missing bundled media and magazine issues

After the first successful start, set `ALLOW_FRESH_DATABASE=0`. Then create the
admin account at:

https://thesustainomics.com/_emdash/admin/setup

## Custom domain

1. Railway dashboard → service **web** → **Settings → Networking → Custom Domain**
2. Add your domain and set the DNS records Railway shows
3. Update `EMDASH_SITE_URL` and `ORIGIN` to `https://yourdomain.com`
4. Redeploy so build-time `ORIGIN` is correct

## Data notes

- SQLite + local uploads live on the **volume** at `/data`
- Only **one replica** can mount a Railway volume — do not scale horizontally without switching storage
- Back up the volume periodically (Railway volume backups / export `data.db` + `uploads/`)

# DitakNet — Public Website & Customer Portal

**DitakNet** is a self-hosted local network visibility, discovery, monitoring,
alerting, licensing, and IT-support platform.

This repository is the **public website and customer portal** (`ditaknet-web`):
product pages, registration/login, license requests, support tickets, and admin
tools. It is **not** the on-prem monitoring engine.

| Component | Repository / product | Default port |
| --- | --- | ---: |
| Website + customer portal | **this repo** | **3000** |
| Monitoring engine (LAN discovery, checks, dashboard) | separate `DitakNetMonitoring` release | **5833** |

---

## What this project includes

- Public pages: product, features, pricing, FAQ, news, about, contact, support
- Registration, login, and customer account area (bcrypt password hashing)
- Annual license **request** collection and admin review status updates
- Support tickets / discussions and admin moderation
- Locales: Armenian (`hy`), English (`en`), Russian (`ru`)
- Prisma + SQLite for local development (PostgreSQL-ready schema)
- Docker / Docker Compose packaging for production-style deploys

This portal does **not** ship activation codes, private signing keys, demo keys,
or the LAN scanner. Those belong to the monitoring product and private ops
processes.

---

## Licensing (important)

DitakNet is **commercial software**. Use of paid product areas requires a
**valid annual license** after request, review, and activation on the monitoring
server.

### Official annual packages

| Package | Yearly price | Notes |
| --- | ---: | --- |
| Free / Local Basic | Free | Limited local testing / small local use |
| Lite | $149 / year | Paid — requires license request + activation |
| Pro | $399 / year | Paid — requires license request + activation |
| Corporate | $799 / year | Paid — requires license request + activation |
| Multi-Office | $1,299 / year | Paid — requires license request + activation |
| Enterprise | Custom yearly contract | Paid — contract + activation |

**Clarifications (do not confuse):**

- **Only Free / Local Basic is free.** Lite, Pro, Corporate, Multi-Office, and
  Enterprise are **paid** and **do require** yearly licensing and activation.
- Legacy names such as **Professional** / `PROFESSIONAL` are **not** a free tier
  and are **not** offered as new package codes. Do not treat “Professional” as
  “free / no license required.”
- Website prices are planning labels. Final limits are enforced by the
  **monitoring server** license logic, not only by this website UI.

Details: [`docs/LICENSING.md`](docs/LICENSING.md),
[`docs/LICENSE_REQUEST_FLOW.md`](docs/LICENSE_REQUEST_FLOW.md),
[`docs/legal/EULA.md`](docs/legal/EULA.md).

### Trial

New monitoring-server installs may begin with a **time-limited trial** before
annual activation. Trial availability and length are controlled by the
monitoring product / license process — not invented by this website.

After trial (or instead of it), choose a package, submit a license request in
this portal, and complete activation with the issued activation code on the
monitoring server.

---

## Install (Docker — recommended)

```bash
cp .env.example .env
# Set at least: NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, NEXTAUTH_URL

docker compose build
docker compose up -d
docker compose logs -f ditaknet-web
```

Open `http://<host>:3000` (override with `WEB_PORT=8080 docker compose up -d`).

Full guide: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

### Persistent volumes

| Host path | Purpose |
| --- | --- |
| `./data` | SQLite DB / runtime data (**back this up**) |
| `./logs` | Application logs |
| `./backups` | Backup archives |

These paths are gitignored. Never commit their contents.

### TrueNAS SCALE

See [`docs/TRUENAS.md`](docs/TRUENAS.md) (Custom App + absolute volume paths).
Co-hosting with the monitoring engine on port **5833** is also covered there.

### Local development

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:init:sqlite
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run lint
npm run test
```

---

## Update

Always back up first. Then:

```bash
# 1) Backup
mkdir -p backups/pre-upgrade
STAMP=$(date +%Y%m%d-%H%M%S)
tar -czf backups/pre-upgrade/ditaknet-web-$STAMP.tar.gz data logs

# 2) Update source / image
git pull   # or check out a release tag

# 3) Rebuild and restart
docker compose build --pull
docker compose up -d
docker compose logs -f ditaknet-web
```

Safety rules: [`docs/UPDATE_AND_MIGRATION_SAFETY.md`](docs/UPDATE_AND_MIGRATION_SAFETY.md).

---

## Backup and restore

- Recipes: [`docs/BACKUP_RESTORE.md`](docs/BACKUP_RESTORE.md)
- Back up `data/` (and preferably `logs/`) before every upgrade or migration
- Keep an off-host copy of backup archives when possible

Quick backup (Docker host):

```bash
mkdir -p backups/manual
STAMP=$(date +%Y%m%d-%H%M%S)
tar -czf backups/manual/ditaknet-web-$STAMP.tar.gz data logs
```

---

## Environment

Copy `.env.example` → `.env` and replace placeholders. Minimum:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="https://your-domain.example"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
ADMIN_NAME="DitakNet Admin"

APP_NAME="DitakNet"
NEXT_PUBLIC_DEFAULT_LOCALE="hy"
```

SMTP is optional. If unset, messages stay in the database and the app logs a
safe notification instead of failing.

Never commit `.env`. See [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md).

---

## Support

Configure contact channels in `.env`:

- `APP_SUPPORT_EMAIL`
- `APP_SUPPORT_URL`
- `APP_SUPPORT_TELEGRAM`
- `APP_SUPPORT_PHONE`
- `APP_DOCUMENTATION_URL`

Security disclosures: email `APP_SUPPORT_EMAIL` with subject prefix `[SECURITY]`.
See [`SECURITY.md`](SECURITY.md).

---

## Documentation

| Doc | Topic |
| --- | --- |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Docker / bare-metal deploy |
| [`docs/TRUENAS.md`](docs/TRUENAS.md) | TrueNAS SCALE |
| [`docs/BACKUP_RESTORE.md`](docs/BACKUP_RESTORE.md) | Backup / restore |
| [`docs/UPDATE_AND_MIGRATION_SAFETY.md`](docs/UPDATE_AND_MIGRATION_SAFETY.md) | Safe upgrades |
| [`docs/GITHUB_RELEASES.md`](docs/GITHUB_RELEASES.md) | Release process |
| [`docs/LICENSING.md`](docs/LICENSING.md) | Packages and rules |
| [`docs/LICENSE_REQUEST_FLOW.md`](docs/LICENSE_REQUEST_FLOW.md) | Request pipeline |
| [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) | Admin area |
| [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) | Environment variables |
| [`docs/SECURITY_AND_CLOUDFLARE_DEPLOYMENT.md`](docs/SECURITY_AND_CLOUDFLARE_DEPLOYMENT.md) | Tunnel / hardening |
| [`docs/legal/EULA.md`](docs/legal/EULA.md) | Full EULA |
| [`CHANGELOG.md`](CHANGELOG.md) | Release history |

---

## License

**All rights reserved.** DitakNet is commercial software. Use is allowed only
under a valid license agreement.

- Short notice: [`LICENSE`](LICENSE)
- Full EULA: [`docs/legal/EULA.md`](docs/legal/EULA.md)

This project is **not** MIT / Apache / GPL open source.

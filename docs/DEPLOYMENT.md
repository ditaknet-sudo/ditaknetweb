# DitakNet Brand Website — Deployment

This guide covers running the **DitakNet brand website** (this Next.js app)
with Node.js.

> The DitakNet **monitoring engine** is a separate product (default port
> **5833**) and has its own packaging. This website repo does not include
> Docker files for either product.

---

## Prerequisites

- Node.js 20 LTS or newer
- npm 10+
- Optional: reverse proxy / Cloudflare Tunnel for HTTPS

---

## First-time setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run db:init:sqlite
npm run db:seed
```

Set at least:

- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- `NEXTAUTH_URL` (public site URL)

Keep `.env` out of git.

---

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Production

```bash
npm run build
npm run start
```

Default listen port is `3000`. Put a reverse proxy in front for TLS if needed.

---

## Data folders

| Path | Purpose |
| --- | --- |
| `data/` | Runtime SQLite / app data (create if you move off `dev.db`) |
| `logs/` | Application logs |
| `backups/` | Manual backup archives |

Back these up before upgrades. See `BACKUP_RESTORE.md`.

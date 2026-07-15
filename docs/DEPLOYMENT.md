# DitakNet — Deployment Guide

This guide covers deploying the **DitakNet public website + customer portal**
(this repository, Next.js application).

> The DitakNet **monitoring engine** is a separate product deployed on port
> **5833**. See `DitakNetMonitoring/` (or the monitoring release archive) for
> its own deployment steps.

---

## 1. Prerequisites

- Docker 24+ and Docker Compose v2 (recommended path)
- 1 vCPU / 1 GB RAM minimum, 2 vCPU / 2 GB RAM recommended
- A public domain (optional but recommended) behind a reverse proxy or Cloudflare Tunnel
- Outbound HTTPS access if you enable SMTP or the Cloudflare tunnel

If you are running Node.js directly (no Docker):

- Node.js 20 LTS or newer
- npm 10+

---

## 2. First-time configuration

1. Clone or extract the release into a stable directory (e.g. `/opt/ditaknet-web`).
2. Copy the environment template and fill in real values:

   ```bash
   cp .env.example .env
   ```

3. Change at minimum:

   - `NEXTAUTH_SECRET` — long random 32+ byte string
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - `NEXTAUTH_URL` — public URL your users will visit
   - SMTP variables if you want outbound email

Keep `.env` **out of git** — it is already covered by `.gitignore` and `.dockerignore`.

---

## 3. Docker deployment (recommended)

From the repository root:

```bash
docker compose build
docker compose up -d
docker compose logs -f ditaknet-web
```

The site will be available at `http://<host>:3000`. Change `WEB_PORT` in `.env`
if you need a different published port:

```bash
WEB_PORT=8080 docker compose up -d
```

### Volumes

Compose mounts three persistent volumes so runtime data survives container
rebuilds:

| Host path   | Container path | Purpose                                            |
| ----------- | -------------- | -------------------------------------------------- |
| `./data`    | `/app/data`    | SQLite database, generated content, upload cache   |
| `./logs`    | `/app/logs`    | Application logs                                   |
| `./backups` | `/app/backups` | Manual and scheduled backup archives               |

These paths are gitignored — never commit their contents.

### Updating the container

```bash
git pull                 # or extract a new release
docker compose build --pull
docker compose up -d
```

Always **take a backup first** — see `BACKUP_RESTORE.md` and
`UPDATE_AND_MIGRATION_SAFETY.md`.

---

## 4. Bare-metal / Node.js deployment

```bash
npm ci
cp .env.example .env      # then edit
npm run prisma:generate
npm run db:init:sqlite    # or: npm run prisma:migrate for managed migrations
npm run db:seed
npm run build
npm run start             # binds to $PORT or 3000
```

Run behind a process manager (systemd, pm2) and a reverse proxy (nginx,
Caddy, Cloudflare Tunnel) for TLS termination.

---

## 5. Reverse proxy / TLS

The container listens on plain HTTP on port 3000. Terminate TLS in front of it:

- **Nginx**: `proxy_pass http://127.0.0.1:3000;` with `X-Forwarded-*` headers.
- **Caddy**: `reverse_proxy 127.0.0.1:3000` — Caddy handles Let's Encrypt automatically.
- **Cloudflare Tunnel**: connect the tunnel to `http://ditaknet-web:3000`; see
  `SECURITY_AND_CLOUDFLARE_DEPLOYMENT.md`.

---

## 6. Verifying the deployment

- `curl -I http://127.0.0.1:3000/` should return `200 OK`.
- The compose healthcheck must report `healthy` within ~1 minute.
- The admin can log in with the credentials from `.env` and reach the admin area.

---

## 7. Uninstall / clean removal

```bash
docker compose down
# Keep or archive ./data, ./logs, ./backups first!
```

Never delete the `data/` directory without a backup — it contains the SQLite
database with users, license requests, and support tickets.

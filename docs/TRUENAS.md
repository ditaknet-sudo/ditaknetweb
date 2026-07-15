# DitakNet on TrueNAS SCALE

This document covers deploying **DitakNet** on TrueNAS SCALE. Two products
can be deployed independently:

- **DitakNet Web** — this repository (Next.js portal, port `3000`).
- **DitakNet Monitoring** — the monitoring engine (Python/FastAPI, port
  `5833`), shipped in a separate release.

Deploy either or both. They do **not** need to be on the same host.

---

## 1. Preferred method — Custom App (Docker Compose)

TrueNAS SCALE 24.10+ (Electric Eel) supports launching a Docker Compose
stack from **Apps → Discover → Custom App**.

### Web portal (this repo)

1. Copy the repository to your TrueNAS pool, e.g.
   `/mnt/tank/apps/ditaknet-web/`.
2. Create the runtime directories owned by the app user (default UID 568):

   ```bash
   mkdir -p /mnt/tank/apps/ditaknet-web/{data,logs,backups}
   chown -R 568:568 /mnt/tank/apps/ditaknet-web/{data,logs,backups}
   ```

3. Copy `.env.example` to `.env` on the dataset and edit real values
   (`NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).
4. Apps → Discover → **Custom App** → paste the contents of
   `docker-compose.yml`, then adjust:

   - `ports.published` — pick a free port such as `30300` if `3000` is used.
   - `volumes` — replace `./data`, `./logs`, `./backups` with absolute paths
     under `/mnt/tank/apps/ditaknet-web/`.

5. Save and start. Watch **Logs** until the healthcheck reports healthy.

### Monitoring engine (separate release, port 5833)

Follow the same pattern using the `docker-compose.yml` from the
`DitakNetMonitoring` release. Its persistent volumes are `data/`, `logs/`,
`backups/`, and `plugins/`. Publish the container's port `5833` to a free
host port (e.g. `35833`).

For Linux hosts (including TrueNAS SCALE) where accurate LAN discovery and
ARP visibility matter, the monitoring compose file supports
`network_mode: host` — comment out the `ports:` section and uncomment
`network_mode: host` before starting. This gives the monitoring engine
direct access to the LAN for ping / ARP / MAC discovery.

---

## 2. Alternative — Docker CLI on the host shell

If you prefer the host shell (SSH into TrueNAS as an admin):

```bash
cd /mnt/tank/apps/ditaknet-web
docker compose build
docker compose up -d
docker compose ps
```

---

## 3. Access from the LAN

- Point your browser at `http://<truenas-ip>:<published-port>`.
- Behind Cloudflare Tunnel or a reverse proxy such as Traefik/Caddy, expose
  the service publicly with TLS.

---

## 4. Backups on TrueNAS

Two mechanisms complement each other:

- **In-app backups** — the app writes archives into `/app/backups`, which is
  the dataset you mounted (e.g. `/mnt/tank/apps/ditaknet-web/backups`).
- **TrueNAS periodic snapshots** — enable snapshots on the dataset that
  contains `data/` and `backups/`. This gives you a rollback point at the
  filesystem level even if the application misbehaves during an upgrade.

Restore procedure and cadence live in `BACKUP_RESTORE.md`.

---

## 5. Upgrading

1. Take a snapshot of the dataset.
2. Optionally run the in-app backup.
3. Pull the new image or new source, then:

   ```bash
   docker compose build --pull
   docker compose up -d
   ```

4. Verify the healthcheck and admin login.

Detailed upgrade safety rules live in `UPDATE_AND_MIGRATION_SAFETY.md`.

---

## 6. Troubleshooting

| Symptom                                          | Likely cause / fix                                            |
| ------------------------------------------------ | ------------------------------------------------------------- |
| Container starts and immediately restarts        | Missing `.env` or bad `NEXTAUTH_SECRET`; check the app logs.  |
| Healthcheck stays `starting` for >2 minutes      | Prisma failed to open SQLite — check volume permissions (568).|
| Port already in use                              | Change `WEB_PORT` in `.env` or the published port in the app. |
| Monitoring engine cannot see LAN devices         | Switch its compose file to `network_mode: host`.              |
| Admin login rejects the seeded credentials       | Confirm the seed step ran; recreate with `npm run db:seed`.   |

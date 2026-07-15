# DitakNet — Backup and Restore

DitakNet stores runtime data in three folders that you must back up:

| Folder     | What lives there                                                 |
| ---------- | ---------------------------------------------------------------- |
| `data/`    | SQLite database (users, license requests, tickets, discussions). |
| `logs/`    | Application logs. Useful for post-incident investigation.        |
| `backups/` | Prior backup archives created by the app or by this playbook.    |

> **Golden rule:** always take a backup *before* an upgrade, before any
> Prisma migration, and before restoring from a previous backup.

---

## 1. Manual backup (Docker)

Stop writes for a consistent snapshot, then copy the volumes:

```bash
docker compose exec ditaknet-web sh -c "test -d /app/data && ls /app/data"

STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p ./backups/manual/$STAMP
cp -a ./data ./backups/manual/$STAMP/data
cp -a ./logs ./backups/manual/$STAMP/logs

tar -czf ./backups/manual/ditaknet-web-$STAMP.tar.gz -C ./backups/manual $STAMP
rm -rf ./backups/manual/$STAMP

sha256sum ./backups/manual/ditaknet-web-$STAMP.tar.gz \
  > ./backups/manual/ditaknet-web-$STAMP.tar.gz.sha256
```

The archive `ditaknet-web-$STAMP.tar.gz` is the single artifact you need
to keep. Store its `.sha256` alongside for integrity checks.

---

## 2. Manual backup (bare metal)

Same idea, without Docker:

```bash
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p backups/manual/$STAMP
cp -a data backups/manual/$STAMP/data
cp -a logs backups/manual/$STAMP/logs
tar -czf backups/manual/ditaknet-web-$STAMP.tar.gz -C backups/manual $STAMP
rm -rf backups/manual/$STAMP
```

If the app is running and using SQLite in WAL mode, prefer a quiet moment
or use `sqlite3 data/<name>.db ".backup 'backups/manual/copy.db'"` to get
a transactional snapshot.

---

## 3. Restoring from a backup

1. Stop the running app:

   ```bash
   docker compose down
   ```

2. Move the current `data/` aside (never delete it until the restore is
   verified):

   ```bash
   mv data data.broken-$(date +%Y%m%d-%H%M%S)
   ```

3. Extract the archive:

   ```bash
   tar -xzf backups/manual/ditaknet-web-YYYYMMDD-HHMMSS.tar.gz \
     -C /tmp/ditaknet-restore
   cp -a /tmp/ditaknet-restore/*/data ./data
   ```

4. Start the app:

   ```bash
   docker compose up -d
   docker compose logs -f ditaknet-web
   ```

5. Log in as admin and confirm the expected users, license requests, and
   tickets are present.
6. Once verified, you may remove the `data.broken-*` directory.

---

## 4. Cadence

Recommended schedule for a production deployment:

- **Daily** automated backup at a low-traffic hour (cron / TrueNAS task).
- **Before every upgrade** — mandatory. See
  `UPDATE_AND_MIGRATION_SAFETY.md`.
- **Weekly off-host copy** — replicate the archive to another machine or
  cold storage. Never keep the only copy on the same disk as `data/`.

Retention suggestion: keep 14 daily, 8 weekly, 12 monthly archives.

---

## 5. Verifying a backup

An untested backup is not a backup. Once a quarter:

1. Copy the latest archive to a staging host.
2. Run the restore procedure above against a scratch `data/` directory.
3. Confirm the app boots and admin login works.
4. Record the successful restore date somewhere your team can find it.

---

## 6. Encryption (optional but recommended)

If backups leave the trusted network, encrypt them:

```bash
gpg --symmetric --cipher-algo AES256 \
    ./backups/manual/ditaknet-web-$STAMP.tar.gz
```

Store the passphrase in a password manager, never in the repository or in
`.env`.

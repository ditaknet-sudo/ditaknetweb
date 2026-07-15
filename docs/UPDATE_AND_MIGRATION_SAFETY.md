# DitakNet — Update & Migration Safety

Upgrading DitakNet is safe when you follow this checklist. Do not skip
steps, even for a small patch release.

---

## 1. Before you upgrade — always

1. **Read the release notes** for the version you are upgrading to.
   Look for the sections "Upgrade notes" and "Compatibility".
2. **Take a full backup**. See `BACKUP_RESTORE.md`. The archive path and
   sha256 checksum are the two things you must have before touching the
   running app.
3. **Snapshot the storage** if you are on TrueNAS or ZFS — a filesystem
   snapshot is a cheap rollback point independent of the app-level
   backup.
4. Note the currently deployed version (`docker inspect ditaknet-web`
   or `curl http://127.0.0.1:3000/api/version` if exposed).
5. Verify you have enough free disk for the new image *and* the backup
   archive.

---

## 2. Version jump rules

- **PATCH** (`vX.Y.Z` → `vX.Y.Z+1`): safe by definition. Backup + restart.
- **MINOR** (`vX.Y` → `vX.Y+1`): usually safe. Re-read release notes for
  new required env vars.
- **MAJOR** (`vX` → `vX+1`): may include a breaking DB migration or a
  changed config format. Test the upgrade on a staging copy of `data/`
  first.

**Never skip more than one MAJOR at a time.** For example, `v1 → v3`
must be done as `v1 → v2` then `v2 → v3` so intermediate migrations run
in order.

---

## 3. Migration safety (Prisma / SQLite)

DitakNet uses Prisma with SQLite for local deployments (PostgreSQL is
supported for larger sites).

- Migrations run **automatically** at container startup when using
  `npm run start` behind the packaged entrypoint, or manually via:

  ```bash
  npm run prisma:migrate
  ```

- Before running a MAJOR migration:

  1. Stop the app.
  2. Copy `data/` to `backups/pre-migration-vX.Y.Z/`.
  3. Run the migration in a **dry run** container against the copy:

     ```bash
     docker run --rm \
       -v $(pwd)/backups/pre-migration-vX.Y.Z:/app/data \
       ditaknet-web:vNEW npm run prisma:migrate
     ```

  4. Only start the real container once the dry run succeeds.

- After the migration, spot-check the tables you rely on
  (`sqlite3 data/ditaknet.db ".tables"` and `SELECT COUNT(*) FROM ...`).

---

## 4. Standard upgrade procedure (Docker Compose)

```bash
# 0. Announce the maintenance window to your users.

# 1. Backup.
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p ./backups/pre-upgrade
tar -czf ./backups/pre-upgrade/ditaknet-web-$STAMP.tar.gz data logs
sha256sum ./backups/pre-upgrade/ditaknet-web-$STAMP.tar.gz \
  > ./backups/pre-upgrade/ditaknet-web-$STAMP.tar.gz.sha256

# 2. Pull the new source / image.
git fetch --tags
git checkout vX.Y.Z            # or: docker pull ditaknet-web:vX.Y.Z

# 3. Rebuild and restart.
docker compose build --pull
docker compose up -d

# 4. Watch the logs until healthy.
docker compose logs -f ditaknet-web

# 5. Smoke-test:
curl -I http://127.0.0.1:3000/
# Log in as admin, open the license/tickets pages, confirm data is intact.
```

---

## 5. Rollback

If the new version misbehaves:

```bash
docker compose down
mv data data.broken-$(date +%Y%m%d-%H%M%S)
tar -xzf ./backups/pre-upgrade/ditaknet-web-$STAMP.tar.gz
git checkout vPREVIOUS          # or: docker pull ditaknet-web:vPREVIOUS
docker compose up -d
```

If the migration was destructive (e.g. dropped a column), the rollback
must come from the pre-upgrade backup, not from re-running the app on
the migrated database.

---

## 6. Things that will bite you if you skip them

- Restarting without a backup, then discovering a subtle data-shape
  regression after users have written new rows.
- Editing `.env` in a way that changes `NEXTAUTH_SECRET` — this
  invalidates all existing sessions. Rotate deliberately, not by accident.
- Deploying a new MAJOR version straight to production without a staging
  dry run of the migration.
- Upgrading the DB engine (SQLite ↔ PostgreSQL) without a documented
  data export/import step. That is an explicit migration project, not a
  version bump.
- Deleting `data/` "just to start clean" during a debugging session.
  Always move it aside instead.

---

## 7. Communicating with users

- Send at least one notice before the maintenance window.
- Set a status banner in the app or on the public site during the window.
- Send the "all clear" once the smoke test passes and the healthcheck is
  green.

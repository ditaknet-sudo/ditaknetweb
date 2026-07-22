# DitakNet Brand Website — Backup and Restore

Runtime data lives in:

| Folder | What lives there |
| --- | --- |
| `data/` | SQLite / runtime data when configured for production paths |
| `prisma/dev.db` | Default local SQLite file for development |
| `logs/` | Application logs |
| `backups/` | Manual backup archives |

Always take a backup before upgrades or Prisma migrations.

---

## Manual backup

```bash
mkdir -p backups/manual
STAMP=$(date +%Y%m%d-%H%M%S)
tar -czf "backups/manual/ditaknet-web-$STAMP.tar.gz" \
  prisma/dev.db data logs 2>/dev/null || \
tar -czf "backups/manual/ditaknet-web-$STAMP.tar.gz" prisma/dev.db
```

Keep an off-host copy when possible.

---

## Restore

1. Stop the Node process.
2. Restore the archive into the project directory.
3. Run `npm run prisma:generate` if needed.
4. Start with `npm run start` (or `npm run dev` locally).

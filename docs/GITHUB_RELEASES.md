# DitakNet — GitHub Releases Playbook

This document defines how DitakNet releases are cut and published on
GitHub. It applies to the public website / customer portal in this
repository. The monitoring engine follows the same structure in its own
repository.

---

## 1. Versioning

We use **Semantic Versioning** with a `v` prefix:

- `vMAJOR.MINOR.PATCH` — e.g. `v1.4.2`.
- Bump **PATCH** for bug fixes only (no schema, no config change).
- Bump **MINOR** for new features that are backwards compatible.
- Bump **MAJOR** for breaking changes (data migration required,
  removed config keys, changed API, incompatible license format).

Pre-releases are tagged `-rc.N` or `-beta.N`
(e.g. `v1.5.0-rc.1`). GitHub marks them as "Pre-release".

The version string must match:

- `package.json` → `"version"`
- Any `APP_VERSION` build arg in Dockerfiles
- The release tag on GitHub

---

## 2. Before you tag

Run through this checklist. If any item fails, **do not tag**.

- [ ] `main` is green in CI (build, lint, tests).
- [ ] `npm run lint` and `npm run test` pass locally.
- [ ] `npm run build` completes without errors.
- [ ] Database migrations (Prisma) applied against a copy of production
      data pass without warnings.
- [ ] `.env.example` reflects every new required variable.
- [ ] `docs/` is updated for every user-visible change.
- [ ] `docs/UPDATE_AND_MIGRATION_SAFETY.md` lists any breaking change
      and the pre-upgrade backup step.
- [ ] All secrets / activation codes / receipts are still gitignored.

---

## 3. Writing release notes

Every release note contains four sections. Keep it short — one screen.

```markdown
## What's new
- Concise, user-visible bullet points.

## Fixes
- One line per fix, most important first.

## Upgrade notes
- Any manual step operators must perform (backup, env var, migration).
- Explicitly say "no manual steps required" when true.

## Compatibility
- Minimum Node / Docker / OS versions.
- Any deprecated feature removals.
```

Do **not** include:

- Internal task IDs, personal names, private URLs.
- Screenshots that contain real customer data.
- Any activation code, key, or license seed.

---

## 4. Tagging and publishing

From a clean, up-to-date `main`:

```bash
# 1. Bump the version in package.json.
# 2. Commit and push.
git tag -a vX.Y.Z -m "DitakNet vX.Y.Z"
git push origin vX.Y.Z
```

Then on GitHub:

1. **Releases → Draft a new release**.
2. Choose the tag you just pushed.
3. Title: `DitakNet vX.Y.Z`.
4. Body: paste the release notes template above.
5. Attach artifacts only if they are safe to publish (see §5).
6. Mark as **Pre-release** if it is an `-rc` / `-beta` tag.
7. **Publish release**.

---

## 5. What is safe to attach

Attach only:

- The source archive that GitHub auto-generates (`Source code (zip/tar.gz)`).
- A signed checksum file (`SHA256SUMS`) if you produce release binaries.
- Sample `.env.example` copies for convenience (already in the repo).

Never attach:

- Compiled builds that include `.env` or `data/`.
- SQLite databases, backup archives, or logs.
- Activation codes, private signing keys, or license seed CSVs.
- Anything from `DOCUMENTS_OUTSIDE_SERVER/`, `PrivateActivationCodes/`,
  `payment_receipts/`, or `receipts/`.

Run this quick sanity check right before publishing:

```bash
git ls-files | grep -Ei '\.env$|\.pem$|\.key$|\.sqlite3?$|payment_receipt|PrivateActivation|DOCUMENTS_OUTSIDE_SERVER' && echo "STOP — secrets tracked" || echo "OK — no obvious secrets tracked"
```

---

## 6. After publishing

- Announce the release in the support channels listed in `README.md`.
- Update the demo / staging deployment.
- If the release is a MAJOR bump, keep the previous MAJOR line receiving
  security patches for at least 90 days.

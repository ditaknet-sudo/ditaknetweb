# Changelog

All notable changes to the DitakNet public website and customer portal
(`ditaknet-web`) are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Repository packaging for GitHub publication: `Dockerfile`,
  `docker-compose.yml`, `SECURITY.md`, `CHANGELOG.md`, GitHub Actions CI
- Deployment / TrueNAS / backup / release safety docs under `docs/`
- Proprietary `LICENSE` pointer and full EULA at `docs/legal/EULA.md`

### Changed

- README clarifies licensing: only Free / Local Basic is free; Lite, Pro,
  Corporate, Multi-Office, and Enterprise require paid annual activation
- README explicitly states legacy “Professional” is not a free / no-license
  package
- `.gitignore` / `.dockerignore` hardened against secrets, receipts, and
  runtime data

### Security

- Documented vulnerability reporting path in `SECURITY.md`

## [0.1.0] - 2026-07-08

### Added

- Initial public website and customer portal (Next.js)
- Locales: `hy`, `en`, `ru`
- Registration, login, account area
- License request collection and admin review flows
- Support ticket / discussion flows
- Admin area for users, license requests, contact messages, tickets
- Prisma schema with SQLite local development path

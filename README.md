# DitakNet — Brand Website

**DitakNet** is a self-hosted monitoring and IT-tools platform for local
networks. This repository is the **public brand website** only: product pages,
IT tools overview, pricing/services, and contact.

It is **not** the on-prem monitoring engine and does **not** ship Docker
packaging for that product.

| Component | Repository / product | Default port |
| --- | --- | ---: |
| Brand website | **this repo** | **3000** |
| Monitoring engine | separate `DitakNetMonitoring` release | **5833** |

---

## What this project includes

- Public pages: product, IT tools, features, deployment, pricing, FAQ, about, contact
- Tools overview: LAN Scan, VLAN Scan, DitakNet Cloud, Service Watch
- Free self-installation messaging; paid professional setup/development via contact
- Locales: English (`en`), Armenian (`hy`), Russian (`ru`) — English first
- Prisma + SQLite for local development

Auth and license-request workflows remain in the codebase but are hidden from
the public UI for now.

---

## Pricing model

- **Self-install of the monitoring product (Docker / Linux / TrueNAS):** free
- **Professional service:** paid only when customers want us to install,
  configure, integrate, or customize DitakNet

See [`docs/legal/EULA.md`](docs/legal/EULA.md) for software terms.

---

## Local development / run

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:init:sqlite
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Production start:

```bash
npm run build
npm run start
```

```bash
npm run lint
npm run test
```

Full notes: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

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
```

Never commit `.env`. See [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md).

---

## Documentation

| Doc | Topic |
| --- | --- |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Node.js deploy |
| [`docs/BACKUP_RESTORE.md`](docs/BACKUP_RESTORE.md) | Backup / restore |
| [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) | Environment variables |
| [`docs/DITAKNET_BRAND_STRATEGY.md`](docs/DITAKNET_BRAND_STRATEGY.md) | Brand strategy |
| [`docs/WEBSITE_STRUCTURE.md`](docs/WEBSITE_STRUCTURE.md) | Site map |
| [`docs/legal/EULA.md`](docs/legal/EULA.md) | Full EULA |
| [`CHANGELOG.md`](CHANGELOG.md) | Release history |

---

## License

**All rights reserved.** DitakNet software terms are described in the EULA.
Self-installation of the product is free; professional work is quoted separately.

- Short notice: [`LICENSE`](LICENSE)
- Full EULA: [`docs/legal/EULA.md`](docs/legal/EULA.md)

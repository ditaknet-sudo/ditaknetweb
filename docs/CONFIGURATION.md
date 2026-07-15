# DitakNet Website Configuration

This repository is the public DitakNet website and customer portal. It is safe to publish without activation codes or private signing keys.

## Required Environment

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
ADMIN_NAME="DitakNet Admin"
APP_NAME="DitakNet"
```

## Optional Email

SMTP configuration is optional. Without SMTP, contact messages, license requests, and support tickets are still stored in the database.

## Annual Package Values

The website accepts these package values:

- `FREE`
- `LITE`
- `PRO`
- `CORPORATE`
- `MULTI_OFFICE`
- `ENTERPRISE`

Paid license requests can target only:

- `LITE`
- `PRO`
- `CORPORATE`
- `MULTI_OFFICE`
- `ENTERPRISE`

## Sensitive Files

Do not commit private commercial material. `.gitignore` blocks common private license files:

- `private/`
- `*.license-keys.csv`
- `*.license-inventory.csv`
- `*.pem`

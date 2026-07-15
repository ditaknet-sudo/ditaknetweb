# Security Policy

## Supported versions

Security fixes are applied to the latest published release on the `main`
branch of this repository (`ditaknet-web`). Older tags may not receive
backports unless a support agreement says otherwise.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

1. Email the address configured as `APP_SUPPORT_EMAIL` for your deployment,
   or the DitakNet support contact published on the public website.
2. Use the subject prefix: `[SECURITY]`.
3. Include:
   - Affected component (website portal vs monitoring server, if known)
   - Version / commit / Docker image tag
   - Steps to reproduce
   - Impact (data exposure, auth bypass, RCE, etc.)
   - Whether you have a proof-of-concept (describe; do not attach malware)

We will acknowledge receipt when possible and coordinate a fix before any
public disclosure.

## Scope for this repository

In scope examples:

- Authentication / session handling on the customer portal
- Privilege escalation in the admin area
- Secret leakage via logs, responses, or committed files
- XSS / CSRF / injection in portal forms

Out of scope / not this repo:

- Monitoring-engine LAN scanning behavior (separate product)
- Issues that require a valid production `.env` or private activation keys
  you do not own
- Social engineering against customers

## Secrets and private materials

Never commit:

- `.env` files with real secrets
- Activation codes, private signing keys, PEM private keys
- Customer databases (`*.db`, `data/`)
- Payment receipts or `DOCUMENTS_OUTSIDE_SERVER/` materials

If you accidentally commit a secret, rotate it immediately and contact
support with `[SECURITY]` so history cleanup can be coordinated.

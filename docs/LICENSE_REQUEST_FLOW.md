# License Request Flow

## Purpose

The public website collects annual license activation requests for DitakNet. It does not generate final activation codes and does not store private signing keys.

DitakNet is sold only as yearly licenses. Use annual labels and annual package comparison text in this portal.

## Official Packages

| Package | Yearly price | Label |
| --- | ---: | --- |
| Free / Local Basic | 0 | Free |
| Lite | 149 | $149/year |
| Pro | 399 | $399/year |
| Corporate | 799 | $799/year |
| Multi-Office | 1299 | $1299/year |
| Enterprise | Custom | Custom yearly contract |

## Customer Steps

1. User registers or opens the public license request page.
2. User submits installation ID, current package, requested yearly package, owner details, current scale, and notes.
3. Request is saved in the database with status `NEW`.
4. If SMTP is configured, a safe notification hook is called.
5. Logged-in users can see requests under `/[locale]/account/licenses`.

## Admin Steps

1. Admin opens `/[locale]/admin/license-requests`.
2. Admin reviews the installation ID, package, owner, contact details, and notes.
3. Admin changes status to `IN_REVIEW`, `APPROVED`, `REJECTED`, or `COMPLETED`.
4. Admin adds internal notes if needed.
5. Product owner handles final activation outside this website.

## Security Boundary

This portal is intentionally a request and communication layer. Final activation generation should live in a separate protected tool or internal process.

Activation codes, signing keys, demo keys, and bulk license inventory files must not be committed to this public repository.

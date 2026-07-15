# DitakNet Licensing

DitakNet is sold only as yearly licenses.

## Official Annual Packages

| Package | Yearly price | Label |
| --- | ---: | --- |
| Free / Local Basic | 0 | Free |
| Lite | 149 | $149/year |
| Pro | 399 | $399/year |
| Corporate | 799 | $799/year |
| Multi-Office | 1299 | $1299/year |
| Enterprise | Custom | Custom yearly contract |

## Portal Boundary

This repository is the public website and customer portal. It collects license requests, stores the requested annual package, and lets admins update request status.

The portal must not contain:

- Activation codes
- Demo keys
- Private signing keys
- Bulk license inventory CSV files
- Server-side license signing logic

## Renewal Rules

The monitoring server should treat paid licenses as annual by default.

- A newly issued paid license should default to `expires_at = issued_at + 1 year`.
- A renewal should extend `expires_at` by 1 year from the later of the current expiry or the renewal activation date.
- An upgrade should immediately unlock modules included in the new package.
- A downgrade or expired license should hide and block modules that are no longer included.
- Free / Local Basic remains available for testing and small local use.

## Package Keys

New license requests use these package keys:

- `FREE`
- `LITE`
- `PRO`
- `CORPORATE`
- `MULTI_OFFICE`
- `ENTERPRISE`

Legacy names such as `MEDIUM` or `PROFESSIONAL` should not be offered in new UI flows.

## Clarifications

- **Only Free / Local Basic is free.** Lite, Pro, Corporate, Multi-Office, and Enterprise are paid annual packages and require license request + activation.
- Legacy **Professional** / `PROFESSIONAL` is **not** a free package and must not be described as “no license required.”
- Website UI labels are for planning. Enforcement happens in the monitoring server license logic.

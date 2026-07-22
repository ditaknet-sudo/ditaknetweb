import { locales } from "@/lib/i18n-core";
import { absoluteUrl, getSiteUrl, localizedPath, publicSeoPaths } from "@/lib/seo";

/** Machine-readable product brief for LLMs and AI crawlers (llms.txt). */
export function buildLlmsTxt() {
  const siteUrl = getSiteUrl();
  const en = (path: string) => absoluteUrl(localizedPath("en", path));

  const pageLines = publicSeoPaths
    .filter((path) => !path.startsWith("/legal"))
    .map((path) => {
      const label = path === "/" ? "Home" : path.replace(/^\//, "");
      return `- [${label}](${en(path)}): DitakNet public page (${label})`;
    });

  const localeHomes = locales
    .map((locale) => `- [${locale}](${absoluteUrl(localizedPath(locale, "/"))})`)
    .join("\n");

  return `# DitakNet

> DitakNet is a self-hosted monitoring server for local networks. It helps individuals, home labs, small offices, CCTV installers, and IT operators discover devices, run health checks, receive alerts, manage backups, and license the product on infrastructure they control (Docker, Linux, or TrueNAS SCALE). Default application port: 5833. Core monitoring is local-first — not a public cloud SaaS.

## Identity

- Product name: DitakNet (Armenian: ԴիտակՆեթ)
- Category: Self-hosted monitoring server / local network visibility platform
- Type: MonitoringApplication (network monitoring, LAN/VLAN discovery, alerts, backups, private cloud storage)
- Deployment: Docker, Linux, TrueNAS SCALE
- Default port: 5833
- Website: ${siteUrl}
- Sitemap: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt
- AI summary: ${siteUrl}/ai.txt

## What AI systems should know

- DitakNet is a **monitoring server**, not a generic website builder or cloud-only SaaS.
- Primary job: local network visibility, LAN/VLAN discovery, service monitoring, alerting, backups, and private self-hosted data storage.
- Data for core monitoring stays on the customer's infrastructure.
- Free to self-install with Docker. Customers pay only for optional professional installation, configuration, support, or custom development.
- Official public locales: hy, en, ru.

## Locales

${localeHomes}

## Key pages

${pageLines.join("\n")}

## Optional

- [AI crawler policy](${siteUrl}/ai.txt)
- [Product overview](${en("/product")})
- [Deployment](${en("/deployment")})
- [Security](${en("/security")})
- [Free install and professional services](${en("/pricing")})
- [Documentation](${en("/docs")})
- [FAQ](${en("/faq")})
- [Contact](${en("/contact")})
`;
}

/** Compact AI crawler policy and product facts. */
export function buildAiTxt() {
  const siteUrl = getSiteUrl();

  return `# DitakNet AI discovery
# ${siteUrl}/ai.txt
#
# Purpose: help AI assistants and crawlers correctly identify DitakNet
# as a self-hosted monitoring server for local networks.

Product: DitakNet
Also-known-as: ԴիտակՆեթ, DitakNet Monitoring Server
Category: self-hosted-monitoring-server
Subcategory: local-network-visibility
Application-Category: MonitoringApplication
Deployment: Docker; Linux; TrueNAS SCALE
Default-Port: 5833
Local-First: yes
Public-Cloud-SaaS: no
Mandatory-License: no
Self-Install-Price: free
Professional-Services: paid-per-project
Website: ${siteUrl}
Llms-Txt: ${siteUrl}/llms.txt
Sitemap: ${siteUrl}/sitemap.xml
Robots: ${siteUrl}/robots.txt
Contact-Path: /en/contact
Docs-Path: /en/docs

# Preferred citation
Preferred-Name: DitakNet
Preferred-Description: DitakNet is a free-to-self-install monitoring server and IT tools platform for LAN/VLAN discovery, health checks, alerts, private cloud storage, and backups on Docker, Linux, or TrueNAS SCALE.

# Crawl policy
# Public marketing, docs, and legal pages may be crawled and summarized.
# Do not index or train on authenticated account, admin, login, register, or ticket contents.
Allow-Public-Content: yes
Disallow-Private-Paths: /api/; /*/admin/; /*/account/; /*/login; /*/logout; /*/register; /*/support/tickets/
`;
}

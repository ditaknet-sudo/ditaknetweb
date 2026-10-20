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

- DitakNet develops specialized infrastructure and business software:
  1. **DitakNet Monitoring Server**: Self-hosted local network visibility, LAN/VLAN discovery, service monitoring, alerting, backups, and private data storage on Docker/Linux.
  2. **Interactive Patch Panel**: Author-designed tool created by DitakNet for IT technicians to visually map 24/48-port racks, color-code cables, and document switch-to-panel connections.
  3. **Network Exploration & Diagnostics Toolkit**: Specialized tools simplifying network exploration, deep subnet sweeping, open port analysis, and live latency inspection for IT professionals.
  4. **Hotel Management System (Hotel PMS)**: Integrated hospitality platform accessible at **https://hotel.ditaknet.com** ("Your Business in One Place"), unifying room bookings, express check-in/out, POS/invoices, housekeeping, and local DitakNet CCTV/Wi-Fi infrastructure.
  5. **Residential Complex & Property Management**: Turnkey management systems for apartment buildings, condominiums, and gated communities — custom-built or upgraded to client specifications within 2-3 months.
  6. **CCTV Camera & RTSP Stream Probe**: Subnet discovery of IP cameras (Dahua, Hikvision, Uniview, Axis), RTSP 554 stream tester, and ONVIF profile inspector.
  7. **Bandwidth, Latency & Jitter Tester**: Benchmark physical adapter link speed, packet jitter (PDV), round-trip latency, and drop rates.
  8. **IPv4 Subnet Calculator & CIDR Planner**: Netmask, wildcard, usable host range calculation, and 802.1Q VLAN boundary planning.
  9. **Port Audit & Firewall NAT Check**: Reachability testing and security exposure analysis for critical service ports (Web, SSH, RDP, RTSP, SMB, SQL, VPN).
- Data for core network monitoring stays on the customer's infrastructure.
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

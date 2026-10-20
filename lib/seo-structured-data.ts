import { Locale } from "@/lib/i18n-core";
import { absoluteUrl, getSiteUrl, localizedPath } from "@/lib/seo";

/** JSON-LD so search engines and AI systems classify DitakNet as a monitoring server. */
export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "DitakNet",
    alternateName: ["ԴիտակՆեթ", "Ditak Net Monitoring Server"],
    url: siteUrl,
    logo: absoluteUrl("/images/logo.png"),
    description:
      "DitakNet is a self-hosted monitoring server for local networks, devices, CCTV, Docker, and IT infrastructure visibility.",
    foundingLocation: {
      "@type": "Place",
      name: "Armenia"
    },
    sameAs: [] as string[]
  };
}

export function buildSoftwareApplicationJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  const homeUrl = absoluteUrl(localizedPath(locale, "/"));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    name: "DitakNet",
    alternateName: ["ԴիտակՆեթ", "DitakNet Monitoring Server"],
    applicationCategory: "MonitoringApplication",
    applicationSubCategory: "NetworkMonitoring",
    operatingSystem: "Docker, Linux, TrueNAS SCALE",
    softwareVersion: "1.x",
    url: homeUrl,
    image: absoluteUrl("/images/logo.png"),
    description:
      "Self-hosted monitoring server for individuals, home labs, small offices, CCTV, routers, servers, and local devices. Discovery, health checks, alerts, backups, and licensing on infrastructure you control. Default port 5833.",
    featureList: [
      "Local network device discovery",
      "Service monitoring (ping, TCP, HTTP)",
      "CCTV and NVR availability checks",
      "LAN and VLAN scanning",
      "Private self-hosted team data storage",
      "Docker and host monitoring",
      "Alerts and notifications",
      "Backup workflows",
      "Annual licensing",
      "Self-hosted on Docker, Linux, or TrueNAS SCALE"
    ],
    offers: {
      "@type": "Offer",
      category: "ProfessionalService",
      url: absoluteUrl(localizedPath(locale, "/pricing")),
      price: "0",
      priceCurrency: "USD",
      description: "Free self-installation; professional installation and custom development are quoted separately.",
      availability: "https://schema.org/InStock"
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    provider: { "@id": `${siteUrl}/#organization` },
    keywords: [
      "monitoring server",
      "self-hosted monitoring",
      "local network monitoring",
      "network visibility",
      "device discovery",
      "CCTV monitoring",
      "Docker monitoring",
      "TrueNAS monitoring",
      "DitakNet",
      "ԴիտակՆեթ"
    ].join(", ")
  };
}

export function buildWebSiteJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "DitakNet",
    alternateName: "ԴիտակՆեթ",
    url: siteUrl,
    inLanguage: locale,
    description:
      "Official website for DitakNet — a self-hosted local network monitoring server.",
    publisher: { "@id": `${siteUrl}/#organization` },
    about: { "@id": `${siteUrl}/#software` }
  };
}

export function buildAiProductJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}/#product`,
    name: "DitakNet Monitoring Server",
    alternateName: ["DitakNet", "ԴիտակՆեթ"],
    description:
      "DitakNet is a self-hosted monitoring server that provides local network visibility, device discovery, service checks, alerts, backups, and licensing without requiring a public cloud for core monitoring.",
    brand: {
      "@type": "Brand",
      name: "DitakNet"
    },
    category: "Network Monitoring Software",
    url: absoluteUrl(localizedPath(locale, "/product")),
    image: absoluteUrl("/images/logo.png"),
    manufacturer: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildHotelSoftwareJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://hotel.ditaknet.com/#software",
    name: "DitakNet Hotel Management System (Hotel PMS)",
    alternateName: ["hotel.ditaknet.com", "Քո բիզնեսը մեկ տեղում", "Отельная система DitakNet"],
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "HospitalityManagement",
    url: "https://hotel.ditaknet.com",
    description:
      "All-in-one hotel management platform (hotel.ditaknet.com): room bookings, guest check-in/out, automated billing, housekeeping, CCTV, and local network integration.",
    operatingSystem: "Cloud & Self-Hosted Web",
    featureList: [
      "Room booking and calendar management",
      "Express guest check-in and check-out",
      "POS and automated billing",
      "Housekeeping and maintenance tracking",
      "Integrated CCTV and Wi-Fi monitoring by DitakNet"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildPatchPanelJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#patch-panel`,
    name: "DitakNet Patch Panel & IT Tools",
    alternateName: ["Ինտերակտիվ Պաչ Պանել", "Network Explorer", "DitakNet IT Toolkit", "Интерактивная Патч-Панель"],
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "NetworkManagement",
    url: absoluteUrl(localizedPath(locale, "/tools")),
    description:
      "Interactive patch panel visualizer, rack elevation manager, and network exploration tools created by DitakNet to streamline work for IT technicians and network administrators.",
    operatingSystem: "Web, Docker, Linux, Windows",
    featureList: [
      "Visual 24/48 port patch panel rack mapping",
      "Switch-to-panel port association",
      "Color-coded cable route tracking",
      "Subnet exploration and live host discovery",
      "VLAN segmentation and latency monitoring"
    ],
    author: { "@id": `${siteUrl}/#organization` },
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildResidentialSoftwareJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#residential`,
    name: "DitakNet Residential Complex Management System",
    alternateName: ["Բնակելի համալիրների կառավարման համակարգ", "Smart Property PMS", "Управление ЖК DitakNet"],
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "PropertyManagement",
    url: absoluteUrl(localizedPath(locale, "/contact?service=residential")),
    description:
      "Turnkey residential and property management software for apartment complexes, condominiums, and gated communities. Custom-developed or upgraded to client specifications within 2-3 months.",
    operatingSystem: "Web, Cloud, Local Server",
    featureList: [
      "Resident web and mobile portal",
      "Automated utility billing and payment tracking",
      "Smart intercom and barrier gate control",
      "CCTV integration",
      "Turnkey custom development in 2-3 months"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildLanScanJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#lan-scan`,
    name: "DitakNet LAN Scan",
    alternateName: ["LAN Scan Windows", "Local Network Discovery", "LAN Скан DitakNet"],
    applicationCategory: "NetworkApplication",
    applicationSubCategory: "NetworkScanner",
    url: absoluteUrl(localizedPath(locale, "/tools/lan-scan")),
    downloadUrl: absoluteUrl("/downloads/lan-scan.zip"),
    description:
      "Standalone Windows tool and PWA web scanner for fast local network discovery, ARP & ping sweep, MAC address inventory, and port inspection.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "Subnet ARP and ping sweeps",
      "MAC address and vendor identification",
      "Common service port checks",
      "CSV and JSON reporting",
      "Available as standalone Windows batch/PowerShell tool and PWA"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildVlanScanJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#vlan-scan`,
    name: "DitakNet VLAN Scan",
    alternateName: ["VLAN Scan Windows", "802.1Q Network Segmentation Tool", "VLAN Скан DitakNet"],
    applicationCategory: "NetworkApplication",
    applicationSubCategory: "VLANAuditor",
    url: absoluteUrl(localizedPath(locale, "/tools/vlan-scan")),
    downloadUrl: absoluteUrl("/downloads/vlan-scan.zip"),
    description:
      "Standalone Windows tool and PWA web application for 802.1Q VLAN mapping, gateway reachability, and inter-VLAN isolation audits.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "802.1Q VLAN tag and adapter inspection",
      "Inter-VLAN security and isolation matrix",
      "Gateway reachability testing",
      "JSON audit report export",
      "Available as standalone Windows batch/PowerShell tool and PWA"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildNetworkExplorerJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#network-explorer`,
    name: "DitakNet Network Explorer",
    alternateName: ["Network Explorer Windows", "Ցանցի Ուսումնասիրություն", "Исследование Сети DitakNet"],
    applicationCategory: "NetworkApplication",
    applicationSubCategory: "NetworkDiagnostics",
    url: absoluteUrl(localizedPath(locale, "/tools/network-explorer")),
    downloadUrl: absoluteUrl("/downloads/network-explorer.zip"),
    description:
      "Deep network exploration, active subnet sweep, latency spike analyzer, and open port vulnerability auditing suite for IT professionals on Windows and Web PWA.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "In-depth subnet sweeps and ARP/ICMP discovery",
      "Real-time latency spike and trace hop analysis",
      "Multi-port service identification (HTTP, RTSP, WinBox, RDP)",
      "Instant CSV and JSON diagnostics reporting",
      "Available as standalone Windows batch/PowerShell tool and PWA"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildServiceWatchJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#service-watch`,
    name: "DitakNet Service Watch",
    alternateName: ["Service Watch Windows", "Uptime Monitor", "Мониторинг Доступности DitakNet"],
    applicationCategory: "MonitoringApplication",
    applicationSubCategory: "UptimeMonitor",
    url: absoluteUrl(localizedPath(locale, "/tools/service-watch")),
    downloadUrl: absoluteUrl("/downloads/service-watch.zip"),
    description:
      "Real-time uptime and latency monitoring for servers, websites, APIs, and LAN network hardware with desktop notifications on Windows and Web PWA.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "Continuous HTTP, HTTPS, TCP, and ICMP health checks",
      "Live response time and uptime percentage calculation",
      "Automatic outage logging and desktop notifications",
      "JSON target configuration and CSV export",
      "Available as standalone Windows batch/PowerShell tool and PWA"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildCctvProbeJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#cctv-probe`,
    name: "DitakNet CCTV Probe",
    alternateName: ["CCTV Probe Windows", "ONVIF Camera Scanner", "RTSP Stream Probe"],
    applicationCategory: "SecurityApplication",
    applicationSubCategory: "CameraScanner",
    url: absoluteUrl(localizedPath(locale, "/tools/cctv-probe")),
    downloadUrl: absoluteUrl("/downloads/cctv-probe.zip"),
    description:
      "Automated CCTV IP camera discovery, ONVIF inspection, RTSP stream URL builder, and camera inventory tool for security professionals.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "Subnet discovery of IP cameras and NVRs (Dahua, Hikvision, Uniview, Axis)",
      "RTSP port 554 and ONVIF 8899 discovery",
      "Stream URL generation and test",
      "CSV and JSON camera inventory export"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildBandwidthTestJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#bandwidth-test`,
    name: "DitakNet Bandwidth & Jitter Test",
    alternateName: ["Network Jitter Benchmark", "Bandwidth Test Windows", "Latency Test"],
    applicationCategory: "NetworkApplication",
    applicationSubCategory: "BenchmarkTool",
    url: absoluteUrl(localizedPath(locale, "/tools/bandwidth-test")),
    downloadUrl: absoluteUrl("/downloads/bandwidth-test.zip"),
    description:
      "Physical link speed check, packet jitter (PDV), round-trip latency, and drop rate benchmark tool for local and wide-area networks.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "Adapter link speed identification",
      "Jitter (PDV) calculation over 20-packet bursts",
      "Packet drop rate measurement",
      "Link health rating"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildSubnetCalculatorJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#subnet-calculator`,
    name: "DitakNet Subnet Calculator",
    alternateName: ["IPv4 CIDR Calculator", "Subnet Planner", "IPAM Designer"],
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "NetworkCalculator",
    url: absoluteUrl(localizedPath(locale, "/tools/subnet-calculator")),
    downloadUrl: absoluteUrl("/downloads/subnet-calculator.zip"),
    description:
      "IPv4 CIDR network design and subnet boundary calculator. Computes masks, wildcard, host ranges, and 802.1Q VLAN subdivisions.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "IPv4 /8 to /32 math",
      "Netmask, wildcard, and broadcast calculation",
      "VLAN boundary planning",
      "Host range determination"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

export function buildPortAuditJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#port-audit`,
    name: "DitakNet Port Audit",
    alternateName: ["Port Reachability Checker", "Firewall NAT Auditor", "Port Scanner"],
    applicationCategory: "SecurityApplication",
    applicationSubCategory: "PortScanner",
    url: absoluteUrl(localizedPath(locale, "/tools/port-audit")),
    downloadUrl: absoluteUrl("/downloads/port-audit.zip"),
    description:
      "Service reachability and firewall security auditing tool. Checks critical ports (Web, SSH, RDP, RTSP, SMB, SQL, VPN) with risk analysis.",
    operatingSystem: "Windows 10, Windows 11, Windows Server, Web PWA",
    featureList: [
      "Critical service port checking",
      "Firewall NAT rule audit",
      "Exposure risk assessment",
      "JSON and CSV audit log reporting"
    ],
    provider: { "@id": `${siteUrl}/#organization` }
  };
}

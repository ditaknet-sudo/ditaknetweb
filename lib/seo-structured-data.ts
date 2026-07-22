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

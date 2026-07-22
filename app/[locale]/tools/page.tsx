import type { Metadata } from "next";

import { ItToolsSuite } from "@/components/marketing/it-tools-suite";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const metadata = {
  en: {
    title: "DitakNet IT Tools | LAN Scan, VLAN Scan and Private Cloud",
    description:
      "Self-hosted tools for LAN discovery, VLAN visibility, service monitoring, and private team data storage."
  },
  hy: {
    title: "DitakNet IT Tools | LAN Scan, VLAN Scan և Private Cloud",
    description:
      "Self-hosted գործիքներ՝ LAN discovery-ի, VLAN visibility-ի, service monitoring-ի և թիմային տվյալների մասնավոր պահպանման համար։"
  },
  ru: {
    title: "DitakNet IT Tools | LAN Scan, VLAN Scan и Private Cloud",
    description:
      "Self-hosted инструменты для LAN discovery, VLAN visibility, мониторинга сервисов и приватного хранения данных команды."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: metadata[locale].title,
    fallbackDescription: metadata[locale].description
  });
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-12">
      <ItToolsSuite locale={locale} headingLevel="h1" />
    </main>
  );
}

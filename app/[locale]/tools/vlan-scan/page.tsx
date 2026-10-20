import type { Metadata } from "next";

import { VlanScanClient } from "@/components/tools/vlan-scan-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet VLAN Scan | Ցանցի սեգմենտավորում, տոպոլոգիա և մեկուսացում (Windows & PWA)",
    description: "VLAN 802.1Q սեգմենտավորման և մեկուսացման ստուգման գործիք Windows-ի և Web PWA-ի համար. Gateways, Inter-VLAN routing և զրոյական վստահության գոտիներ։"
  },
  en: {
    title: "DitakNet VLAN Scan | Network Segmentation & Isolation Audit (Windows & PWA)",
    description: "Map 802.1Q VLAN segments, audit gateways, and inspect inter-VLAN isolation rules on Windows and Web PWA."
  },
  ru: {
    title: "DitakNet VLAN Scan | Сегментация сети, топология и аудит изоляции (Windows & PWA)",
    description: "Аудит сегментации VLAN 802.1Q и межсетевой изоляции для Windows и PWA. Шлюзы, подсети и безопасность."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/vlan-scan",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function VlanScanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <VlanScanClient locale={locale} />
    </main>
  );
}

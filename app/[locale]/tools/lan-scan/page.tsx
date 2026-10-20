import type { Metadata } from "next";

import { LanScanClient } from "@/components/tools/lan-scan-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet LAN Scan | Տեղային ցանցի սքանավորում և գույքագրում (Windows & PWA)",
    description: "Տեղային ցանցի սքանավորման հզոր գործիք Windows-ի և Web PWA-ի համար. ARP & ICMP sweep, IP, MAC, արտադրողներ և բաց պորտեր։"
  },
  en: {
    title: "DitakNet LAN Scan | Local Network Discovery & Inventory (Windows & PWA)",
    description: "Deep subnet discovery and ARP sweeper for Windows and Web PWA. Scan active hosts, MAC addresses, hardware vendors, and open ports."
  },
  ru: {
    title: "DitakNet LAN Scan | Сканирование и инвентаризация локальной сети (Windows & PWA)",
    description: "Мощный инструмент сканирования локальной сети для Windows и PWA. Поиск IP, MAC-адресов, вендоров и открытых портов."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/lan-scan",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function LanScanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <LanScanClient locale={locale} />
    </main>
  );
}

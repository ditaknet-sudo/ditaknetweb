import type { Metadata } from "next";

import { SubnetCalculatorClient } from "@/components/tools/subnet-calculator-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet Subnet Calculator | IPv4 Ենթացանցերի Հաշվիչ և CIDR Պլանավորող (Windows & PWA)",
    description: "Անվճար IPv4/CIDR հաշվիչ ՏՏ ինժեներների համար. հասցեների դիապազոններ, broadcast, wildcard mask և 802.1Q VLAN-ների սեգմենտացիա։"
  },
  en: {
    title: "DitakNet Subnet Calculator | IPv4 CIDR Calculator & IPAM Planner (Windows & PWA)",
    description: "Online IPv4 subnet calculator and network design utility. Calculate netmasks, wildcard masks, usable host boundaries, and VLAN segments."
  },
  ru: {
    title: "DitakNet Subnet Calculator | Калькулятор IPv4 подсетей и CIDR планировщик (Windows & PWA)",
    description: "Калькулятор подсетей IPv4/CIDR для сетевых инженеров: маски подсетей, диапазоны хостов, broadcast и сегментация VLAN."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/subnet-calculator",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function SubnetCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <SubnetCalculatorClient locale={locale} />
    </main>
  );
}

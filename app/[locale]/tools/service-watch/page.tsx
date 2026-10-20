import type { Metadata } from "next";

import { ServiceWatchClient } from "@/components/tools/service-watch-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet Service Watch | Կայքերի, Սերվերների և Ծառայությունների Uptime Մոնիթորինգ (Windows & PWA)",
    description: "Սերվերների, կայքերի, API-ների և ներքին պորտերի live հասանելիության ու latency-ի մոնիթորինգ Windows-ի և Web PWA-ի համար։"
  },
  en: {
    title: "DitakNet Service Watch | Uptime, Latency & Health Monitor (Windows & PWA)",
    description: "Real-time service health, uptime, and latency monitoring for servers, APIs, websites, and LAN network hardware on Windows and Web PWA."
  },
  ru: {
    title: "DitakNet Service Watch | Мониторинг доступности серверов, Uptime и Latency (Windows & PWA)",
    description: "Мониторинг работоспособности серверов, веб-сайтов, API и сетевых узлов в реальном времени для Windows и Web PWA."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/service-watch",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function ServiceWatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <ServiceWatchClient locale={locale} />
    </main>
  );
}

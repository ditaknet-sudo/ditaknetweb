import type { Metadata } from "next";

import { BandwidthTestClient } from "@/components/tools/bandwidth-test-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet Bandwidth & Jitter Test | Ցանցի Որակի, Արագության և Jitter-ի Թեստավորում (Windows & PWA)",
    description: "Ցանցային ադապտերների արագության, gateway latency-ի, jitter-ի (PDV) և packet loss-ի իրական բենչմարկ Windows-ի և Web PWA-ի համար։"
  },
  en: {
    title: "DitakNet Bandwidth & Jitter Test | Network Latency, Jitter & Packet Loss Benchmark (Windows & PWA)",
    description: "Benchmark physical link speed, gateway round-trip latency, packet jitter (PDV), and drop rates on Windows and Web PWA."
  },
  ru: {
    title: "DitakNet Bandwidth & Jitter Test | Тест Скорости, Задержки и Джиттера (Windows & PWA)",
    description: "Тестирование пропускной способности сети, задержки шлюза, джиттера (PDV) и потерь пакетов для Windows и Web PWA."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/bandwidth-test",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function BandwidthTestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <BandwidthTestClient locale={locale} />
    </main>
  );
}

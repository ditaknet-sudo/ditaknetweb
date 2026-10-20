import type { Metadata } from "next";

import { ItToolsSuite } from "@/components/marketing/it-tools-suite";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const metadata = {
  en: {
    title: "DitakNet IT Tools | Patch Panel, Network Explorer, LAN Scan & Suite",
    description:
      "Interactive patch panel manager, deep network exploration, LAN/VLAN discovery, service monitoring, and private cloud storage."
  },
  hy: {
    title: "DitakNet ՏՏ Գործիքներ | Պաչ Պանել, Ցանցի Ուսումնասիրություն և LAN/VLAN Scan",
    description:
      "Հեղինակային ինտերակտիվ պաչ պանել, ցանցի խորքային ուսումնասիրություն, LAN discovery, VLAN mapping և մասնավոր պահոց ՏՏ մասնագետների համար։"
  },
  ru: {
    title: "DitakNet IT Инструменты | Патч-Панель, Исследование Сети, LAN/VLAN Скан",
    description:
      "Интерактивная патч-панель, глубокое исследование сети, LAN discovery, VLAN mapping и мониторинг сервисов для IT-специалистов."
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

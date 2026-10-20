import type { Metadata } from "next";

import { IpMessengerClient } from "@/components/tools/ip-messenger-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet LAN Station & Local IP Messenger | Ցանցի Սքանավորում (Ping Scan), Իմ IP և Տեղային Չատ (PWA)",
    description: "Տեղային ցանցի ամբողջական զննում (Ping Subnet Scan), ընթացիկ սարքի IP-ի և ադապտերի տեսանելիություն, պորտերի աուդիտ և ներցանցային P2P չատ ՏՏ մասնագետների համար։"
  },
  en: {
    title: "DitakNet LAN Station & Local IP Messenger | Subnet Ping Scan, My Device IP & LAN Chat (PWA)",
    description: "All-in-one local network suite: Subnet ping sweep, device IP & gateway inspection, port security audit, and peer-to-peer LAN messaging without cloud."
  },
  ru: {
    title: "DitakNet LAN Station & Local IP Messenger | Сканирование Сети (Ping Scan), Мой IP и Локальный Чат (PWA)",
    description: "Полная диагностика локальной сети: Ping сканирование подсетей, инспекция IP и шлюза текущего устройства, аудит портов и прямой чат по IP."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/ip-messenger",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function IpMessengerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-8 md:py-12">
      <IpMessengerClient locale={locale} />
    </main>
  );
}

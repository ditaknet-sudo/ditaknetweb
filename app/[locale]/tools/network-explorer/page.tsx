import type { Metadata } from "next";

import { NetworkExplorerClient } from "@/components/tools/network-explorer-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet Network Explorer | Ցանցի Ուսումնասիրություն և Դիագնոստիկա (Windows & PWA)",
    description: "Խորքային ցանցային հետազոտության և դիագնոստիկայի ծրագիր ՏՏ մասնագետների համար. ակտիվ սարքերի, բաց պորտերի և latency-ի ստուգում։"
  },
  en: {
    title: "DitakNet Network Explorer | Deep Subnet Diagnostics & Port Discovery (Windows & PWA)",
    description: "Deep subnet explorer and diagnostics suite for IT professionals: active host discovery, port probing, latency analysis, and hardware identification."
  },
  ru: {
    title: "DitakNet Network Explorer | Глубокое исследование сети и диагностика (Windows & PWA)",
    description: "Программа глубокого исследования сети для IT-специалистов: обнаружение узлов, сканирование портов, задержка и определение оборудования."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/network-explorer",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function NetworkExplorerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <NetworkExplorerClient locale={locale} />
    </main>
  );
}

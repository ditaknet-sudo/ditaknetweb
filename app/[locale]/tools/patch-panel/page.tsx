import type { Metadata } from "next";

import { PatchPanelStudio } from "@/components/tools/patch-panel-studio";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet Patch Panel Studio | Ինտերակտիվ Պաչ Պանել ՏՏ մասնագետների համար (Windows & PWA)",
    description: "Հեղինակային ծրագիր DitakNet-ի կողմից՝ սերվերային ռեկերի և 24/48 պորտ պաչ պանելների վիզուալ կառավարում, switch-to-panel մապինգ և կաբելային գույքագրում։"
  },
  en: {
    title: "DitakNet Patch Panel Studio | Interactive Visual Rack & Patch Panel Manager (Windows & PWA)",
    description: "Visual patch panel and rack mapping tool created by DitakNet for IT technicians: 24/48-port Cat6A visualization, switch port mapping, color-coded cabling, and inventory export."
  },
  ru: {
    title: "DitakNet Patch Panel Studio | Интерактивная Патч-Панель для IT-специалистов (Windows & PWA)",
    description: "Авторская программа от DitakNet: визуальное управление серверными стойками и патч-панелями 24/48 портов, маппинг свитчей и учет кабелей."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/patch-panel",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function PatchPanelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <PatchPanelStudio locale={locale} />
    </main>
  );
}

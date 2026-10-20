import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Container,
  FileQuestion,
  KeyRound,
  Network,
  Rocket,
  Server,
  Settings,
  Sliders
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { docSlugs } from "@/lib/docs";
import { docsContent } from "@/lib/docs-content";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const docIcons: Record<string, typeof BookOpen> = {
  "getting-started": Rocket,
  "docker-installation": Container,
  "truenas-installation": Server,
  "first-run-setup": Settings,
  "network-discovery": Network,
  licensing: KeyRound,
  configuration: Sliders,
  "telegram-alerts": Bell,
  faq: FileQuestion
};

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/docs",
    titleKey: "docs.title",
    descriptionKey: "docs.description",
    fallbackTitle: "DitakNet documentation",
    fallbackDescription: "Guides for installing, activating, and operating DitakNet."
  });
}

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-10 md:py-14">
      <div className="max-w-3xl">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand)]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>DitakNet Documentation</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
          {t("docs.title")}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--muted)] md:text-lg">
          {t("docs.description")}
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {docSlugs.map((slug) => {
          const Icon = docIcons[slug] || BookOpen;
          const docItem = docsContent[slug]?.[locale] || docsContent[slug]?.en;
          const title = docItem?.title || t(`docs.items.${slug}`);
          const desc = docItem?.description || t("docs.body");

          return (
            <Link key={slug} href={`/${locale}/docs/${slug}`} className="group block">
              <Card className="h-full flex flex-col justify-between p-6 border-[var(--line)] bg-[var(--panel)] shadow-sm group-hover:border-[var(--brand)] group-hover:shadow-md transition-all">
                <div>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors">
                    {title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)] line-clamp-3">
                    {desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--line)] text-xs font-semibold text-[var(--brand)]">
                  <span>
                    {locale === "hy" ? "Կարդալ ուղեցույցը" : locale === "ru" ? "Читать руководство" : "Read Guide"}
                  </span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

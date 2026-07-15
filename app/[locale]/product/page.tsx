import type { Metadata } from "next";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/product",
    titleKey: "home.product.title",
    descriptionKey: "home.product.description",
    fallbackTitle: "DitakNet product",
    fallbackDescription: "Self-hosted monitoring server for local networks, servers, devices, backups, and licensing."
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading eyebrow={t("home.product.eyebrow")} title={t("home.product.title")} description={t("home.product.description")} />
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
          <Card key={index} className="p-5">
            <h2 className="text-lg font-bold">{t(`home.product.items.${index}.title`)}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t(`home.product.items.${index}.description`)}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("home.explain.description")}</p>
    </main>
  );
}

import type { Metadata } from "next";

import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingTable } from "@/components/pricing/pricing-table";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/pricing",
    titleKey: "pricing.title",
    descriptionKey: "pricing.description",
    fallbackTitle: "DitakNet pricing",
    fallbackDescription: "Annual DitakNet license packages for local network monitoring."
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("pricing.title")} description={t("pricing.description")} />
      <p className="mb-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("pricing.licenseEnforcement")}</p>
      <p className="mb-8 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("pricing.commercialNote")}</p>
      <PricingTable locale={locale} messages={messages} planSet="all" />
    </main>
  );
}

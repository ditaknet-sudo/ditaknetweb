import type { Metadata } from "next";
import { Shield } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/security",
    titleKey: "securityPage.title",
    descriptionKey: "securityPage.description",
    fallbackTitle: "DitakNet security and control",
    fallbackDescription: "Local-first deployment, backend permissions, license control, and backup safety."
  });
}

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("securityPage.title")} description={t("securityPage.description")} />
      <p className="mb-8 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("securityPage.body")}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Card key={index} className="flex gap-3 p-5">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand)]" />
            <p className="text-sm leading-6 text-[var(--muted)]">{t(`home.securitySection.items.${index}`)}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm leading-6 text-[var(--muted)]">{t("home.securitySection.caution")}</p>
    </main>
  );
}

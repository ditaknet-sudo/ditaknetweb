import type { Metadata } from "next";
import { Container } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/deployment",
    titleKey: "deploymentPage.title",
    descriptionKey: "deploymentPage.description",
    fallbackTitle: "DitakNet deployment",
    fallbackDescription: "Deploy DitakNet on Docker, Linux, or TrueNAS SCALE inside your own infrastructure."
  });
}

export default async function DeploymentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("deploymentPage.title")} description={t("deploymentPage.description")} />
      <p className="mb-6 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("deploymentPage.body")}</p>
      <div className="mb-8">
        <ButtonLink href={`/${locale}/download`} variant="secondary" size="lg">
          {t("nav.download")}
        </ButtonLink>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Card key={index} className="p-5">
            <Container className="mb-3 h-6 w-6 text-[var(--brand)]" />
            <p className="text-sm font-semibold">{t(`home.deployment.items.${index}`)}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm leading-6 text-[var(--muted)]">{t("home.deployment.note")}</p>
    </main>
  );
}

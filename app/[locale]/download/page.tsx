import type { Metadata } from "next";
import { Cloud, Download, Network, Radar, Server, ServerCog } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDownloadCatalog, type DownloadItemId } from "@/lib/downloads";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const icons: Record<DownloadItemId, typeof Radar> = {
  monitoring: Server,
  "lan-scan": Radar,
  "vlan-scan": Network,
  cloud: Cloud,
  "service-watch": ServerCog
};

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/download",
    titleKey: "downloadPage.metaTitle",
    descriptionKey: "downloadPage.metaDescription",
    fallbackTitle: "Download DitakNet tools",
    fallbackDescription: "Download DitakNet monitoring and IT tools that make customer network work easier."
  });
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const catalog = getDownloadCatalog();

  return (
    <main className="container-page py-10 md:py-14">
      <section className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t("downloadPage.eyebrow")}</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">{t("downloadPage.title")}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)] md:text-lg">{t("downloadPage.description")}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {catalog.map((item) => {
          const Icon = icons[item.id];
          return (
            <Card key={item.id} className="flex flex-col p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--panel-soft)] text-[var(--brand)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-md bg-[var(--panel-soft)] px-2 py-1 text-xs font-bold text-[var(--muted)]">
                  {item.versionLabel}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[var(--foreground)]">{t(`downloadPage.items.${item.id}.name`)}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{t(`downloadPage.items.${item.id}.description`)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-md border border-[var(--line)] px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--muted)]"
                  >
                    {t(`downloadPage.platforms.${platform}`)}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.available ? (
                  <ButtonLink href={item.url} variant="secondary" size="md">
                    <Download className="h-4 w-4" />
                    {t("downloadPage.downloadCta")}
                  </ButtonLink>
                ) : (
                  <ButtonLink href={`/${locale}/contact`} variant="primary" size="md">
                    <Download className="h-4 w-4" />
                    {t("downloadPage.requestCta")}
                  </ButtonLink>
                )}
                <ButtonLink href={`/${locale}/docs`} variant="outline" size="md">
                  {t("downloadPage.docsCta")}
                </ButtonLink>
              </div>

              {!item.available ? (
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{t("downloadPage.comingSoonNote")}</p>
              ) : null}
            </Card>
          );
        })}
      </section>

      <section className="mt-10 rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)] p-5 md:p-6">
        <h2 className="text-lg font-bold">{t("downloadPage.helpTitle")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("downloadPage.helpBody")}</p>
        <div className="mt-4">
          <ButtonLink href={`/${locale}/contact`} variant="outline" size="md">
            {t("downloadPage.helpCta")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

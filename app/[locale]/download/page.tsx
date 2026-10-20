import type { Metadata } from "next";
import {
  Activity,
  BookOpen,
  Calculator,
  Camera,
  Cloud,
  Download,
  ExternalLink,
  Gauge,
  Layers,
  MessageSquare,
  Network,
  Play,
  Radar,
  Server,
  ServerCog,
  ShieldAlert
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDownloadCatalog, type DownloadItemId } from "@/lib/downloads";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const icons: Record<DownloadItemId, typeof Radar> = {
  monitoring: Server,
  "ip-messenger": MessageSquare,
  "patch-panel": Layers,
  "network-explorer": Activity,
  "lan-scan": Radar,
  "vlan-scan": Network,
  "cctv-probe": Camera,
  "bandwidth-test": Gauge,
  "subnet-calculator": Calculator,
  "port-audit": ShieldAlert,
  cloud: Cloud,
  "service-watch": ServerCog
};

const toolAppUrls: Partial<Record<DownloadItemId, string>> = {
  monitoring: "/monitoring",
  "ip-messenger": "/tools/ip-messenger",
  "patch-panel": "/tools/patch-panel",
  "network-explorer": "/tools/network-explorer",
  "lan-scan": "/tools/lan-scan",
  "vlan-scan": "/tools/vlan-scan",
  "cctv-probe": "/tools/cctv-probe",
  "bandwidth-test": "/tools/bandwidth-test",
  "subnet-calculator": "/tools/subnet-calculator",
  "port-audit": "/tools/port-audit",
  "service-watch": "/tools/service-watch"
};

const toolDocSlugs: Partial<Record<DownloadItemId, string>> = {
  monitoring: "docker-installation",
  "ip-messenger": "first-run-setup",
  "patch-panel": "first-run-setup",
  "network-explorer": "network-discovery",
  "lan-scan": "network-discovery",
  "vlan-scan": "network-discovery",
  "cctv-probe": "network-discovery",
  "bandwidth-test": "configuration",
  "subnet-calculator": "configuration",
  "port-audit": "configuration",
  "service-watch": "telegram-alerts",
  cloud: "licensing"
};

const openAppLabels: Record<Locale, string> = {
  hy: "Բացել Ծրագիրը",
  en: "Open Web App",
  ru: "Открыть приложение"
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

      <section className="mb-8 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {locale === "hy"
                ? "📦 Պատրաստի Standalone Փաթեթներ Windows-ի և Docker-ի համար"
                : locale === "ru"
                ? "📦 Готовые Standalone пакеты для Windows и Docker"
                : "📦 Standalone Ready-to-Run Packages for Windows & Docker"}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-2xl">
              {locale === "hy"
                ? "Բոլոր ծրագրերը ներբեռնվում են որպես ZIP արխիվներ, որոնք ներառում են Windows-ի համար պատրաստի `.bat` գործարկիչներ և PowerShell սկրիպտներ։ Տեղադրելուց հետո պարզապես բացեք արխիվը և 2x սեղմեք .bat ֆայլի վրա:"
                : locale === "ru"
                ? "Все программы скачиваются как ZIP-архивы, содержащие готовые лаунчеры `.bat` и PowerShell скрипты. Распакуйте архив и запустите двойным кликом .bat файл:"
                : "All programs download as standalone ZIP archives containing ready-to-run `.bat` launchers and native PowerShell scripts. Unpack and double-click to start immediately."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-[var(--foreground)]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>11 {locale === "hy" ? "Պատրաստի Փաթեթ" : locale === "ru" ? "Готовых Пакетов" : "Ready Packages"}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {catalog.map((item) => {
          const Icon = icons[item.id] || Radar;
          const appUrl = toolAppUrls[item.id];
          const docSlug = toolDocSlugs[item.id] || "getting-started";
          const downloadUrl = `/api/downloads/${item.id}`;
          const isWindowsTool = item.platforms.includes("windows");

          return (
            <Card key={item.id} className="flex flex-col p-6 border-[var(--line)] bg-[var(--panel)] shadow-sm hover:border-[var(--brand)] transition-all">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-2.5 py-1 text-xs font-bold text-[var(--muted)]">
                    {item.versionLabel}
                  </span>
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400">
                    ZIP
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[var(--foreground)]">{t(`downloadPage.items.${item.id}.name`)}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{t(`downloadPage.items.${item.id}.description`)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--muted)]"
                  >
                    {t(`downloadPage.platforms.${platform}`)}
                  </span>
                ))}
                <span className="rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-2 py-0.5 text-[0.7rem] font-medium text-[var(--muted)]">
                  {isWindowsTool ? ".BAT + PowerShell" : "Docker Compose"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--line)]">
                {/* 1. Open Web App button (if available) */}
                {appUrl && (
                  <ButtonLink href={`/${locale}${appUrl}`} variant="primary" size="md">
                    <Play className="h-4 w-4 fill-current" />
                    <span>{openAppLabels[locale]}</span>
                  </ButtonLink>
                )}

                {/* 2. Download ZIP button (forces real file download) */}
                {item.available ? (
                  <ButtonLink
                    href={downloadUrl}
                    download={`ditaknet-${item.id}.zip`}
                    variant={appUrl ? "secondary" : "primary"}
                    size="md"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t("downloadPage.downloadCta")} (.ZIP)</span>
                  </ButtonLink>
                ) : (
                  <ButtonLink href={`/${locale}/contact`} variant="secondary" size="md">
                    <Download className="h-4 w-4" />
                    <span>{t("downloadPage.requestCta")}</span>
                  </ButtonLink>
                )}

                {/* 3. Documentation button */}
                <ButtonLink href={`/${locale}/docs/${docSlug}`} variant="outline" size="md">
                  <BookOpen className="h-4 w-4" />
                  <span>{t("downloadPage.docsCta")}</span>
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Quick Step-by-Step Guide for Running Windows Downloads */}
      <section className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 md:p-8">
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          {locale === "hy"
            ? "🚀 Ինչպե՞ս գործարկել ներբեռնված ծրագրերը Windows-ում"
            : locale === "ru"
            ? "🚀 Как запустить скачанные программы на Windows"
            : "🚀 How to run downloaded tools on Windows"}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-[var(--button-text)] text-sm font-bold">1</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "Ներբեռնել" : locale === "ru" ? "Скачать" : "Download"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Սեղմեք «Ներբեռնել (.ZIP)» կոճակը ցանկալի ծրագրի քարտի վրա:"
                : locale === "ru"
                ? "Нажмите «Скачать (.ZIP)» на карточке нужной программы."
                : "Click the 'Download (.ZIP)' button on any program card."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-[var(--button-text)] text-sm font-bold">2</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "Բացել արխիվը (Extract)" : locale === "ru" ? "Распаковать" : "Extract Archive"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Աջ քլիք արեք ZIP ֆայլի վրա և ընտրեք «Extract All» (Распаковать всё):"
                : locale === "ru"
                ? "Кликните правой кнопкой на ZIP и выберите «Извлечь все»:"
                : "Right click the ZIP file and select 'Extract All'."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--brand)]/10 border-[var(--brand)]/30 p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-[var(--button-text)] text-sm font-bold">3</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "2x Click .BAT ֆայլին" : locale === "ru" ? "2x Клик по .BAT" : "Double-click .BAT"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Գործարկեք DitakNet-*.bat ֆայլը։ Ոչ մի հավելյալ ծրագիր տեղադրել պետք չէ։"
                : locale === "ru"
                ? "Запустите DitakNet-*.bat. Дополнительное ПО устанавливать не требуется."
                : "Run DitakNet-*.bat. No extra runtimes or installations required."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-[var(--button-text)] text-sm font-bold">4</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "Արդյունքներ և Export" : locale === "ru" ? "Результаты и Export" : "Results & Export"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Ծրագիրը կկատարի սքանավորումը և արդյունքները կպահպանի JSON կամ CSV ֆայլում:"
                : locale === "ru"
                ? "Программа выполнит сканирование и сохранит результат в JSON или CSV."
                : "The tool scans your network and saves results to clean JSON or CSV."}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)] p-6 md:p-8">
        <h2 className="text-xl font-bold">{t("downloadPage.helpTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t("downloadPage.helpBody")}</p>
        <div className="mt-4">
          <ButtonLink href={`/${locale}/contact`} variant="secondary" size="md">
            {t("downloadPage.helpCta")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

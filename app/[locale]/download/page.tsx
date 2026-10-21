import type { Metadata } from "next";
import {
  Activity,
  BookOpen,
  Calculator,
  Camera,
  CheckCircle2,
  Cloud,
  Cpu,
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
  ShieldAlert,
  Zap
} from "lucide-react";

import { PwaInstallButton } from "@/components/pwa/pwa-install-banner";
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

      {/* Unified Flagship Tool: DitakNet Fast LAN & Multi-Mask Scanner v2.0 */}
      <section className="mb-10 overflow-hidden rounded-3xl border border-[var(--brand)]/40 bg-gradient-to-br from-[var(--panel)] via-[var(--panel-soft)] to-[var(--brand)]/10 p-6 shadow-xl md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {locale === "hy" ? "Մեկ Միասնական Գործիք" : locale === "ru" ? "Один Универсальный Инструмент" : "One Unified Tool"}
              </span>
              <span className="rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 px-3 py-1 text-xs font-bold text-[var(--brand)]">
                v2.0 Standalone Engine
              </span>
              <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
                {locale === "hy" ? "Առանց ZIP Արխիվի" : locale === "ru" ? "Прямой запуск без ZIP" : "Direct Run - No ZIP"}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--foreground)]">
              {locale === "hy"
                ? "⚡ DitakNet Fast LAN & Multi-Mask Scanner"
                : locale === "ru"
                ? "⚡ DitakNet Fast LAN & Multi-Mask Scanner"
                : "⚡ DitakNet Fast LAN & Multi-Mask Scanner"}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
              {locale === "hy"
                ? "Լրիվ ավտոմատ ցանցային զննիչ Windows-ի համար՝ 0 հարց, 0 սպասում։ Ավտոմատ որոշում է համակարգչի բոլոր ցանցային քարտերը (Wi-Fi, Ethernet, Hyper-V, VLAN) և բոլոր մասկերը (/24, /20, /16): Զուգահեռ բազմահոսքային (multi-threaded) ARP + ICMP ստուգում, ZTE, Xiaomi, Apple, Samsung, MikroTik, Cisco, Dahua, Hikvision սարքերի ճանաչում և ավտոմատ HTML/CSV հաշվետվություն:"
                : locale === "ru"
                ? "Полностью автоматический сканер сети для Windows: 0 вопросов, 0 задержек. Автоматически определяет все сетевые адаптеры (Wi-Fi, Ethernet, Hyper-V, VLAN) и любые маски подсетей (/24, /20, /16). Многопоточный ARP + ICMP опрос, распознавание брендов ZTE, Xiaomi, Apple, Samsung, MikroTik, Cisco и авто-генерация HTML/CSV отчетов:"
                : "Fully automated Windows network scanner: zero prompts, zero waiting. Automatically discovers all network adapters (Wi-Fi, Ethernet, Hyper-V, VLAN) and all subnet masks (/24, /20, /16). Parallel multi-threaded ARP + ICMP sweep, vendor detection (ZTE, Xiaomi, Apple, Samsung, MikroTik, Cisco), and instant HTML/CSV reporting."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              <span className="rounded-lg bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1">✓ /24, /20, /16 Auto Masks</span>
              <span className="rounded-lg bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1">✓ Win32 SendARP &lt;1ms</span>
              <span className="rounded-lg bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1">✓ 80, 443, 22, 554, 8291, 3389</span>
              <span className="rounded-lg bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1">✓ No Admin / No Installation</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            {/* Direct .EXE Download */}
            <a
              href="/downloads/DitakNet-Scanner.exe"
              download="DitakNet-Scanner.exe"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>{locale === "hy" ? "Ներբեռնել .EXE (Windows Executable)" : locale === "ru" ? "Скачать .EXE (Windows)" : "Download .EXE (Windows)"}</span>
            </a>

            {/* Direct .PS1 Download */}
            <a
              href="/downloads/DitakNet-Scanner.ps1"
              download="DitakNet-Scanner.ps1"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-5 py-3 text-sm font-bold text-[var(--foreground)] hover:border-[var(--brand)] hover:text-[var(--brand)] active:scale-95 transition-all shadow-sm"
            >
              <Cpu className="h-4 w-4 text-[var(--brand)]" />
              <span>{locale === "hy" ? "Ներբեռնել .PS1 (PowerShell Script)" : locale === "ru" ? "Скачать .PS1 (PowerShell)" : "Download .PS1 (PowerShell)"}</span>
            </a>

            {/* PWA Windows App Install */}
            <PwaInstallButton locale={locale} />
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

                {/* 2. Download buttons (EXE/PS1 direct for Windows tools, or ZIP for others) */}
                {item.id === "lan-scan" || item.id === "network-explorer" ? (
                  <>
                    <ButtonLink
                      href="/downloads/DitakNet-Scanner.exe"
                      download="DitakNet-Scanner.exe"
                      variant="primary"
                      size="md"
                    >
                      <Download className="h-4 w-4" />
                      <span>.EXE (Windows)</span>
                    </ButtonLink>
                    <ButtonLink
                      href="/downloads/DitakNet-Scanner.ps1"
                      download="DitakNet-Scanner.ps1"
                      variant="secondary"
                      size="md"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>.PS1</span>
                    </ButtonLink>
                  </>
                ) : item.available ? (
                  <ButtonLink
                    href={downloadUrl}
                    download={`ditaknet-${item.id}.zip`}
                    variant={appUrl ? "secondary" : "primary"}
                    size="md"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t("downloadPage.downloadCta")}</span>
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
            ? "🚀 Ինչպե՞ս գործարկել DitakNet-ը Windows-ում (Առանց ZIP / PWA)"
            : locale === "ru"
            ? "🚀 Как запустить DitakNet на Windows (Без ZIP / PWA)"
            : "🚀 How to run DitakNet on Windows (Direct / PWA)"}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-sm font-bold">1</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "Ընտրեք Տարբերակը" : locale === "ru" ? "Выберите Формат" : "Choose Format"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Ներբեռնեք .EXE (միանգամից աշխատող), .PS1 (PowerShell) կամ տեղադրեք PWA Desktop ծրագիրը:"
                : locale === "ru"
                ? "Скачайте .EXE (готов к запуску), .PS1 (PowerShell) или установите PWA Desktop:"
                : "Download .EXE (direct runner), .PS1 (PowerShell) or install PWA Desktop app."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-sm font-bold">2</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "Անմիջական Գործարկում" : locale === "ru" ? "Прямой Запуск" : "Instant Launch"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Ոչ մի ZIP արխիվ բացել պետք չէ։ 2x Click արեք .exe ֆայլի վրա և այն անմիջապես կաշխատի:"
                : locale === "ru"
                ? "Никаких ZIP архивов распаковывать не нужно. 2x Клик по .exe и сканер сразу работает:"
                : "No ZIP unzipping needed. Double-click the .exe file to run immediately."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-sm font-bold">3</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "0 Հարց — Ավտոմատ Զննում" : locale === "ru" ? "0 Вопросов — Автоскан" : "0 Prompts Auto-Scan"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Սքաները ինքնուրույն գտնում է բոլոր ցանցային քարտերը և բոլոր մասկերը (/24, /20, /16):"
                : locale === "ru"
                ? "Сканер сам определяет все сетевые карты и любые маски подсетей (/24, /20, /16):"
                : "Scanner automatically inspects all network cards and masks (/24, /20, /16)."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-sm font-bold">4</span>
            <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">
              {locale === "hy" ? "HTML & CSV Հաշվետվություն" : locale === "ru" ? "Отчеты HTML и CSV" : "HTML & CSV Reports"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {locale === "hy"
                ? "Ավտոմատ բացում է ժամանակակից Dark-mode HTML Dashboard և ստեղծում CSV ֆայլ:"
                : locale === "ru"
                ? "Автоматически открывает современный Dark-mode HTML Dashboard и сохраняет CSV:"
                : "Automatically generates interactive Dark-mode HTML Dashboard and CSV export."}
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

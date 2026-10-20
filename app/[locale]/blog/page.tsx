import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Layers,
  Newspaper,
  Radar,
  Server,
  Sparkles,
  Tag
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const blogPosts = [
  {
    id: "ditaknet-v1-release",
    date: "2026-10-18",
    category: "Release Notes",
    title: {
      hy: "DitakNet 1.0 Թողարկում. Տեղային Մոնիթորինգ Սերվեր 5833 Պորտով",
      en: "DitakNet 1.0 Released: Self-Hosted Local Network Monitoring on Port 5833",
      ru: "Релиз DitakNet 1.0: Локальный Сервер Мониторинга на Порту 5833"
    },
    excerpt: {
      hy: "DitakNet-ը պաշտոնապես թողարկվել է. տեղային ցանցի սարքերի ավտոմատ հայտնաբերում, Docker/TrueNAS ինտեգրացիա, Telegram ծանուցումներ և տվյալների լիակատար գաղտնիություն։",
      en: "DitakNet 1.0 is officially released: automated local subnet discovery, Docker & TrueNAS deployment, instant Telegram alerts, and zero cloud dependency.",
      ru: "Официальный релиз DitakNet 1.0: автоматическое обнаружение подсетей, поддержка Docker и TrueNAS, Telegram оповещения и нулевая зависимость от облака."
    },
    icon: Server
  },
  {
    id: "patch-panel-studio-launch",
    date: "2026-10-19",
    category: "IT Tools",
    title: {
      hy: "Ինտերակտիվ Պաչ Պանել. Հեղինակային Ծրագիր ՏՏ Մասնագետների Համար",
      en: "Interactive Patch Panel Studio: Author Tool for Network & Rack Engineers",
      ru: "Интерактивная Патч-Панель: Авторский Инструмент для Сетевых Инженеров"
    },
    excerpt: {
      hy: "Ռեկերի, 24/48 պորտ պաչ պանելների վիզուալ կառավարում, switch-to-panel պորտերի մապինգ և կաբելների գունային մակնշում՝ հասանելի Windows-ի և PWA-ի համար։",
      en: "Visual rack elevations, 24/48 port patch panel mapping, switch-to-panel associations, and color-coded cabling for Windows standalone and Web PWA.",
      ru: "Визуализация серверных стоек, маппинг портов 24/48, коммутация со свитчами и цветовая маркировка кабелей для Windows и PWA."
    },
    icon: Layers
  },
  {
    id: "hotel-ditaknet-com-integration",
    date: "2026-10-20",
    category: "Hospitality PMS",
    title: {
      hy: "Քո Բիզնեսը Մեկ Տեղում. hotel.ditaknet.com Հյուրանոցային Համակարգ",
      en: "Your Business in One Place: hotel.ditaknet.com Hotel Management Platform",
      ru: "Твой Бизнес в Одном Месте: hotel.ditaknet.com Отельная Платформа"
    },
    excerpt: {
      hy: "Ամբողջական հյուրանոցային PMS համակարգ՝ ամրագրումներ, check-in/out, POS վճարումներ և DitakNet սերվերի հետ միասնական Wi-Fi ու CCTV տեսահսկման ինտեգրացիա։",
      en: "Complete hotel PMS: room bookings, express check-in/out, POS billing, housekeeping, and unified Wi-Fi/CCTV monitoring via DitakNet server.",
      ru: "Комплексная отельная PMS система: бронирование, заезд/выезд, счета и единый мониторинг Wi-Fi и видеонаблюдения через DitakNet."
    },
    icon: Sparkles
  },
  {
    id: "windows-standalone-tools-suite",
    date: "2026-10-20",
    category: "Windows Suite",
    title: {
      hy: "Windows Standalone Ծրագրերի Հավաքածու. LAN Scan, CCTV Probe և Jitter Test",
      en: "Native Windows Standalone Toolkit: LAN Scan, CCTV Probe & Jitter Benchmark",
      ru: "Автономные Утилиты для Windows: LAN Scan, CCTV Probe и Тест Сети"
    },
    excerpt: {
      hy: "Անցանց աշխատող ծրագրեր Windows 10/11-ի համար՝ առանց բարդ ինստալացիայի, 1-քլիքով .bat մեկնարկիչներով և JSON/CSV արտահանմամբ։",
      en: "Self-contained offline tools for Windows 10/11/Server: one-click batch runners, automated PowerShell sweeps, and instant CSV/JSON reports.",
      ru: "Автономные утилиты для Windows 10/11/Server: запуск в 1 клик через .BAT, быстрое сканирование PowerShell и отчеты в CSV и JSON."
    },
    icon: Radar
  }
];

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/blog",
    titleKey: "blog.title",
    descriptionKey: "blog.description",
    fallbackTitle: "DitakNet news & updates",
    fallbackDescription: "Product updates, release notes, and implementation articles."
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-10 md:py-14">
      <div className="max-w-3xl">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand)]">
          <Newspaper className="h-3.5 w-3.5" />
          <span>News & Releases</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
          {t("blog.title")}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--muted)] md:text-lg">
          {t("blog.description")}
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => {
          const Icon = post.icon;
          const postTitle = post.title[locale] || post.title.en;
          const postExcerpt = post.excerpt[locale] || post.excerpt.en;

          return (
            <Card
              key={post.id}
              className="flex flex-col justify-between p-6 border-[var(--line)] bg-[var(--panel)] shadow-sm hover:border-[var(--brand)] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--brand)]">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                      {postTitle}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                      {postExcerpt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <Link
                  href={`/${locale}/docs`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline"
                >
                  <span>
                    {locale === "hy" ? "Իմանալ ավելին" : locale === "ru" ? "Подробнее" : "Read More"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/${locale}/download`}
                  className="rounded bg-[var(--panel-soft)] px-2 py-1 text-[11px] font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {t("nav.download")}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

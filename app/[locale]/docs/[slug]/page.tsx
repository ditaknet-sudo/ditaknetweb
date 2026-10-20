import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code,
  Download,
  Info,
  Lightbulb,
  Terminal
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { docSlugs } from "@/lib/docs";
import { docsContent } from "@/lib/docs-content";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { buildLocalizedMetadata, messageText } from "@/lib/seo";

export function generateStaticParams() {
  return docSlugs.flatMap((slug) => [
    { locale: "hy", slug },
    { locale: "en", slug },
    { locale: "ru", slug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const doc = docsContent[slug]?.[locale];

  const title = doc?.title || messageText(messages, `docs.items.${slug}`, "DitakNet documentation");
  const description = doc?.description || messageText(messages, "docs.description", "Guides for installing, activating, and operating DitakNet.");

  return buildLocalizedMetadata({
    locale,
    path: `/docs/${slug}`,
    title,
    description
  });
}

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!docSlugs.includes(slug as (typeof docSlugs)[number])) {
    notFound();
  }

  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  const docData = docsContent[slug]?.[locale] || docsContent[slug]?.en;

  const currentIndex = docSlugs.indexOf(slug as (typeof docSlugs)[number]);
  const prevSlug = currentIndex > 0 ? docSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < docSlugs.length - 1 ? docSlugs[currentIndex + 1] : null;

  return (
    <main className="container-page py-10 md:py-14">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/${locale}/docs`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.back")} — {t("docs.title")}</span>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Document Content */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="border-[var(--line)] bg-[var(--panel)] p-6 md:p-8 shadow-sm">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand)]">
              <BookOpen className="h-3.5 w-3.5" />
              <span>DitakNet Knowledge Base</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)] md:text-4xl">
              {docData?.title || t(`docs.items.${slug}`)}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              {docData?.description || t("docs.description")}
            </p>

            <hr className="my-6 border-[var(--line)]" />

            {/* Sections */}
            {docData?.sections && docData.sections.length > 0 ? (
              <div className="space-y-8">
                {docData.sections.map((section, idx) => (
                  <section key={idx} className="space-y-3">
                    <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                      {section.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--muted)] whitespace-pre-line">
                      {section.content}
                    </p>

                    {/* Callout box */}
                    {section.callout && (
                      <div
                        className={`flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed ${
                          section.callout.type === "tip"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : section.callout.type === "warning"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {section.callout.type === "tip" && <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />}
                        {section.callout.type === "warning" && <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                        {section.callout.type === "note" && <Info className="h-4 w-4 shrink-0 mt-0.5" />}
                        <div>{section.callout.text}</div>
                      </div>
                    )}

                    {/* Code block */}
                    {section.code && (
                      <div className="relative mt-2 overflow-hidden rounded-xl border border-[var(--invert-line)] bg-slate-950 p-4 text-xs text-slate-100 shadow-inner">
                        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5 text-[var(--accent)]" />
                            {section.codeLang || "bash"}
                          </span>
                        </div>
                        <pre className="overflow-x-auto font-mono text-xs leading-relaxed">
                          <code>{section.code}</code>
                        </pre>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-sm text-[var(--muted)]">
                <p>{t("docs.body")}</p>
                <div className="rounded-md bg-[#edf7f4] p-4 text-sm leading-6 text-[#145c45]">
                  {t("license.description")}
                </div>
              </div>
            )}
          </Card>

          {/* Prev / Next Pagination */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            {prevSlug ? (
              <Link
                href={`/${locale}/docs/${prevSlug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--brand)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t(`docs.items.${prevSlug}`)}</span>
              </Link>
            ) : <div />}

            {nextSlug ? (
              <Link
                href={`/${locale}/docs/${nextSlug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--brand)] transition-colors"
              >
                <span>{t(`docs.items.${nextSlug}`)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className="space-y-6">
          <Card className="border-[var(--line)] bg-[var(--panel)] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
              {t("docs.title")}
            </h3>
            <ul className="space-y-1 text-xs">
              {docSlugs.map((s) => {
                const isActive = s === slug;
                return (
                  <li key={s}>
                    <Link
                      href={`/${locale}/docs/${s}`}
                      className={`block rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-[var(--brand)] text-white font-bold"
                          : "text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {t(`docs.items.${s}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Quick Download / Tools link */}
          <Card className="border-[var(--brand)]/30 bg-[var(--brand)]/5 p-5">
            <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">
              {t("nav.download")}
            </h4>
            <p className="text-xs text-[var(--muted)] mb-3">
              Download native Windows standalone tools or launch interactive PWA scanners.
            </p>
            <Link
              href={`/${locale}/download`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand)]/90"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t("downloadPage.eyebrow")}</span>
            </Link>
          </Card>
        </aside>
      </div>
    </main>
  );
}

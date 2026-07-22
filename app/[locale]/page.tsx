import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Container,
  Database,
  Home,
  Lock,
  Network,
  Radar,
  Server,
  Shield,
  Users,
  Wrench
} from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { HeroShowcase } from "@/components/marketing/hero-showcase";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingTable } from "@/components/pricing/pricing-table";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const capabilityIcons = [Radar, Server, Network, Bell, Container, Database] as const;
const productIcons = [Radar, Server, Network, Shield, Bell, Database, Lock, Wrench, Container, Server] as const;
const audienceIcons = [Home, Users, Wrench] as const;

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/",
    titleKey: "home.metaTitle",
    descriptionKey: "home.metaDescription",
    fallbackTitle: "DitakNet | Self-hosted monitoring for homes and small networks",
    fallbackDescription:
      "Self-hosted monitoring for home labs, small offices, CCTV, routers, and local devices. Runs on Docker or Linux."
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main>
      <section className="hero-surface border-b border-[var(--line)] py-14 md:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-in-up">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t("home.hero.eyebrow")}</p>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-[var(--foreground)] md:text-7xl">
              {t("common.brandName")}
            </h1>
            <p className="mt-4 text-2xl font-bold leading-9 text-[var(--brand-dark)] md:text-3xl">{t("home.hero.title")}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("home.hero.subtitle")}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{t("home.hero.supporting")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/deployment`} variant="secondary" size="lg">
                {t("home.hero.primaryCta")}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={`/${locale}/contact`} variant="primary" size="lg">
                {t("home.hero.secondaryCta")}
              </ButtonLink>
            </div>
          </div>
          <div className="dashboard-preview-animate">
            <div className="hero-3d-shell">
              <HeroShowcase title={t("home.dashboard.title")} subtitle={t("home.hero.imageAlt")} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--panel)] py-10">
        <div className="container-page">
          <DashboardPreview
            brandName={t("common.brandName")}
            labels={{
              title: t("home.dashboard.title"),
              healthy: t("home.dashboard.healthy"),
              warnings: t("home.dashboard.warnings"),
              offline: t("home.dashboard.offline"),
              discovery: t("home.dashboard.discovery"),
              topology: t("home.dashboard.topology"),
              alerts: t("home.dashboard.alerts")
            }}
          />
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("home.audience.eyebrow")}
            title={t("home.audience.title")}
            description={t("home.audience.description")}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((index) => {
              const Icon = audienceIcons[index];
              return (
                <Card key={index} className="p-5">
                  <Icon className="mb-4 h-6 w-6 text-[var(--accent)]" />
                  <h3 className="text-lg font-bold">{t(`home.audience.items.${index}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t(`home.audience.items.${index}.description`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--panel)] py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("home.problem.eyebrow")}
            title={t("home.problem.title")}
            description={t("home.problem.description")}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Card key={index} className="p-5">
                <AlertTriangle className="mb-4 h-6 w-6 text-[var(--accent)]" />
                <p className="text-sm leading-6 text-[var(--muted)]">{t(`home.problem.items.${index}`)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--panel-soft)] py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("home.product.eyebrow")}
            title={t("home.product.title")}
            description={t("home.product.description")}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
              const Icon = productIcons[index] ?? Server;
              return (
                <Card key={index} className="p-5">
                  <Icon className="mb-3 h-6 w-6 text-[var(--brand)]" />
                  <h3 className="text-lg font-bold">{t(`home.product.items.${index}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t(`home.product.items.${index}.description`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("home.deployment.eyebrow")}
            title={t("home.deployment.title")}
            description={t("home.deployment.description")}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Card key={index} className="p-5">
                <Container className="mb-3 h-6 w-6 text-[var(--accent)]" />
                <p className="text-sm font-semibold">{t(`home.deployment.items.${index}`)}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-[var(--muted)]">{t("home.deployment.note")}</p>
        </div>
      </section>

      <section className="bg-[var(--panel)] py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("home.features.eyebrow")}
            title={t("home.features.title")}
            description={t("home.features.description")}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const Icon = capabilityIcons[index];
              return (
                <Card key={index} className="p-5">
                  <Icon className="mb-4 h-7 w-7 text-[var(--brand)]" />
                  <h3 className="text-lg font-bold">{t(`home.features.${index}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t(`home.features.${index}.description`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={t("home.securitySection.eyebrow")}
              title={t("home.securitySection.title")}
              description={t("home.securitySection.description")}
            />
            <ul className="space-y-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <li key={index} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span>{t(`home.securitySection.items.${index}`)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{t("home.securitySection.caution")}</p>
          </div>
          <div>
            <SectionHeading
              eyebrow={t("home.backupSection.eyebrow")}
              title={t("home.backupSection.title")}
              description={t("home.backupSection.description")}
            />
            <ul className="space-y-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <li key={index} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                  <Database className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span>{t(`home.backupSection.items.${index}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[var(--invert-bg)] py-14 text-[var(--invert-text)]">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("home.implementation.eyebrow")}
            title={t("home.implementation.title")}
            description={t("home.implementation.description")}
          />
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <li
                key={index}
                className="rounded-md border border-[var(--invert-line)] bg-[var(--invert-panel)] p-4 text-sm leading-6 text-[var(--invert-text)]"
              >
                {t(`home.implementation.items.${index}`)}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-[var(--invert-muted)]">{t("home.implementation.note")}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <SectionHeading title={t("pricing.title")} description={t("pricing.description")} />
          <p className="mb-6 max-w-3xl text-sm leading-6 text-[var(--muted)]">{t("pricing.licenseEnforcement")}</p>
          <PricingTable locale={locale} messages={messages} compact planSet="commercial" />
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--panel)] py-12">
        <div className="container-page flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">{t("home.contactCta.title")}</h2>
            <p className="mt-2 max-w-2xl text-[var(--muted)]">{t("home.contactCta.description")}</p>
          </div>
          <ButtonLink href={`/${locale}/contact`} variant="secondary" size="lg">
            {t("home.contactCta.button")}
          </ButtonLink>
        </div>
      </section>

      <section className="bg-[var(--panel-soft)] py-12">
        <div className="container-page flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">{t("home.faqPreview.title")}</h2>
            <p className="mt-2 max-w-2xl text-[var(--muted)]">{t("home.faqPreview.description")}</p>
          </div>
          <ButtonLink href={`/${locale}/faq`} variant="outline">
            {t("nav.faq")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

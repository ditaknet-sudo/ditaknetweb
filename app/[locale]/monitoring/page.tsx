import type { Metadata } from "next";
import {
  Activity,
  ArrowRight,
  BellRing,
  Container,
  DatabaseBackup,
  Download,
  Eye,
  Gauge,
  LockKeyhole,
  Network,
  Radar,
  Server,
  ShieldCheck,
  Waypoints
} from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const moduleIcons = [Radar, Waypoints, Activity, BellRing, DatabaseBackup, LockKeyhole] as const;
const reasonIcons = [ShieldCheck, Eye, Gauge, Container, Server, Network] as const;

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/monitoring",
    titleKey: "monitoring.metaTitle",
    descriptionKey: "monitoring.metaDescription",
    fallbackTitle: "DitakNet Monitoring Server | Local infrastructure visibility",
    fallbackDescription:
      "Discover devices, monitor services, receive alerts, and keep operational data on infrastructure you control."
  });
}

export default async function MonitoringPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="monitoring-page">
      <section className="monitoring-hero">
        <div className="monitoring-hero__glow" aria-hidden="true" />
        <div className="container-page monitoring-hero__grid">
          <div className="monitoring-hero__copy">
            <div className="monitoring-kicker">
              <span />
              {t("monitoring.hero.eyebrow")}
            </div>
            <h1>{t("monitoring.hero.title")}</h1>
            <p>{t("monitoring.hero.description")}</p>
            <div className="monitoring-hero__actions">
              <ButtonLink href={`/${locale}/download`} variant="secondary" size="lg">
                <Download className="h-4 w-4" />
                {t("monitoring.hero.primaryCta")}
              </ButtonLink>
              <ButtonLink href={`/${locale}/contact`} variant="outline" size="lg">
                {t("monitoring.hero.secondaryCta")}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="monitoring-hero__proof">
              {[0, 1, 2].map((index) => (
                <span key={index}>
                  <ShieldCheck className="h-4 w-4" />
                  {t(`monitoring.hero.proof.${index}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="monitoring-orbit" aria-hidden="true">
            <div className="monitoring-orbit__ring monitoring-orbit__ring--outer" />
            <div className="monitoring-orbit__ring monitoring-orbit__ring--inner" />
            <div className="monitoring-orbit__sweep" />
            <div className="monitoring-orbit__core">
              <Server />
              <strong>DitakNet</strong>
              <small>MONITORING</small>
            </div>
            {[Radar, Network, BellRing, DatabaseBackup].map((Icon, index) => (
              <div key={index} className={`monitoring-orbit__node monitoring-orbit__node--${index + 1}`}>
                <Icon />
              </div>
            ))}
            <div className="monitoring-orbit__status">
              <span />
              128 {t("home.dashboard.healthy")}
            </div>
          </div>
        </div>
      </section>

      <section className="monitoring-metrics">
        <div className="container-page monitoring-metrics__grid">
          {[0, 1, 2, 3].map((index) => (
            <div key={index}>
              <strong>{t(`monitoring.metrics.${index}.value`)}</strong>
              <span>{t(`monitoring.metrics.${index}.label`)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="monitoring-section">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("monitoring.modules.eyebrow")}
            title={t("monitoring.modules.title")}
            description={t("monitoring.modules.description")}
          />
          <div className="monitoring-card-grid">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const Icon = moduleIcons[index];
              return (
                <article key={index} className="monitoring-card">
                  <div className="monitoring-card__icon">
                    <Icon />
                  </div>
                  <span className="monitoring-card__number">0{index + 1}</span>
                  <h2>{t(`monitoring.modules.items.${index}.title`)}</h2>
                  <p>{t(`monitoring.modules.items.${index}.description`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="monitoring-section monitoring-section--panel">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("monitoring.workflow.eyebrow")}
            title={t("monitoring.workflow.title")}
            description={t("monitoring.workflow.description")}
          />
          <div className="monitoring-flow">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="monitoring-flow__step">
                <span>{index + 1}</span>
                <div>
                  <h2>{t(`monitoring.workflow.items.${index}.title`)}</h2>
                  <p>{t(`monitoring.workflow.items.${index}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="monitoring-section">
        <div className="container-page monitoring-dashboard">
          <div>
            <SectionHeading
              eyebrow={t("monitoring.dashboard.eyebrow")}
              title={t("monitoring.dashboard.title")}
              description={t("monitoring.dashboard.description")}
            />
            <ul>
              {[0, 1, 2].map((index) => (
                <li key={index}>
                  <ShieldCheck />
                  {t(`monitoring.dashboard.points.${index}`)}
                </li>
              ))}
            </ul>
          </div>
          <DashboardPreview
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

      <section className="monitoring-section monitoring-section--dark">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("monitoring.why.eyebrow")}
            title={t("monitoring.why.title")}
            description={t("monitoring.why.description")}
          />
          <div className="monitoring-reasons">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const Icon = reasonIcons[index];
              return (
                <article key={index}>
                  <Icon />
                  <div>
                    <h2>{t(`monitoring.why.items.${index}.title`)}</h2>
                    <p>{t(`monitoring.why.items.${index}.description`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="monitoring-section">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("monitoring.deploy.eyebrow")}
            title={t("monitoring.deploy.title")}
            description={t("monitoring.deploy.description")}
          />
          <div className="monitoring-deploy">
            {["Docker", "Linux", "TrueNAS SCALE"].map((name, index) => (
              <article key={name}>
                <Container />
                <strong>{name}</strong>
                <p>{t(`monitoring.deploy.items.${index}`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="monitoring-cta">
        <div className="container-page monitoring-cta__inner">
          <div>
            <span>{t("monitoring.cta.eyebrow")}</span>
            <h2>{t("monitoring.cta.title")}</h2>
            <p>{t("monitoring.cta.description")}</p>
          </div>
          <ButtonLink href={`/${locale}/download`} variant="secondary" size="lg">
            {t("monitoring.cta.button")}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { getSiteConfig } from "@/lib/site";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";

const footerLinks = [
  { key: "product", href: "product" },
  { key: "tools", href: "tools" },
  { key: "features", href: "features" },
  { key: "deployment", href: "deployment" },
  { key: "pricing", href: "pricing" },
  { key: "security", href: "security" },
  { key: "contact", href: "contact" }
] as const;

const legalLinks = [
  { key: "legal.index.title", href: "legal" },
  { key: "legal.privacy.title", href: "legal/privacy-policy" },
  { key: "legal.eula.title", href: "legal/eula" },
  { key: "legal.terms.title", href: "legal/terms-of-sale" }
] as const;

function isPlaceholderEmail(email: string) {
  return !email || /example\.com$/i.test(email);
}

export function SiteFooter({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);
  const site = getSiteConfig();
  const year = new Date().getFullYear();
  const showEmail = !isPlaceholderEmail(site.supportEmail);

  return (
    <footer className="relative z-[1] border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_82%,transparent)] backdrop-blur-md">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo brandName={t("common.brandName")} href={`/${locale}`} size="sm" />
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">{t("footer.description")}</p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{t("footer.links")}</p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}/${link.href}`}
                    className="text-sm font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand)]"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{t("footer.legal")}</p>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}/${link.href}`}
                    className="text-sm font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand)]"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{t("footer.contact")}</p>
            <div className="space-y-3 text-sm text-[var(--muted)]">
              {showEmail ? (
                <a
                  href={`mailto:${site.supportEmail}`}
                  className="flex items-center gap-2 font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand)]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span className="break-all">{site.supportEmail}</span>
                </a>
              ) : (
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center gap-2 font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand)]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {t("nav.contact")}
                </Link>
              )}
              {site.supportPhone ? (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {site.supportPhone}
                </p>
              ) : null}
              {site.supportTelegram ? (
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {site.supportTelegram}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t("common.brandName")}. {t("footer.rights")}
          </p>
          <p className="text-xs sm:text-sm">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

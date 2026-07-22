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
    <footer className="site-footer">
      <div className="container-page site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <BrandLogo brandName={t("common.brandName")} href={`/${locale}`} size="sm" />
            <p className="site-footer__tagline">{t("footer.tagline")}</p>
          </div>

          <div className="site-footer__contact">
            {showEmail ? (
              <a href={`mailto:${site.supportEmail}`} className="site-footer__contact-link">
                <Mail className="h-3.5 w-3.5" />
                {site.supportEmail}
              </a>
            ) : (
              <Link href={`/${locale}/contact`} className="site-footer__contact-link">
                <Mail className="h-3.5 w-3.5" />
                {t("nav.contact")}
              </Link>
            )}
            {site.supportPhone ? (
              <span className="site-footer__contact-link">
                <Phone className="h-3.5 w-3.5" />
                {site.supportPhone}
              </span>
            ) : null}
            {site.supportTelegram ? (
              <span className="site-footer__contact-link">
                <MessageCircle className="h-3.5 w-3.5" />
                {site.supportTelegram}
              </span>
            ) : null}
          </div>
        </div>

        <nav className="site-footer__nav" aria-label={t("footer.links")}>
          {footerLinks.map((link) => (
            <Link key={link.key} href={`/${locale}/${link.href}`} className="site-footer__link">
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            © {year} {t("common.brandName")}
          </p>
          <nav className="site-footer__legal" aria-label={t("footer.legal")}>
            {legalLinks.map((link) => (
              <Link key={link.href} href={`/${locale}/${link.href}`} className="site-footer__legal-link">
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

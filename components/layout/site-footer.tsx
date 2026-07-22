import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

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

export function SiteFooter({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);
  const site = getSiteConfig();

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--panel)]">
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold">{t("common.brandName")}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("footer.description")}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{t("footer.links")}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {footerLinks.map((link) => (
              <Link key={link.key} href={`/${locale}/${link.href}`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand)]">
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{t("footer.legal")}</p>
          <div className="grid gap-2 text-sm">
            <Link href={`/${locale}/legal`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand)]">
              {t("legal.index.title")}
            </Link>
            <Link href={`/${locale}/legal/privacy-policy`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand)]">
              {t("legal.privacy.title")}
            </Link>
            <Link href={`/${locale}/legal/eula`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand)]">
              {t("legal.eula.title")}
            </Link>
            <Link href={`/${locale}/legal/terms-of-sale`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand)]">
              {t("legal.terms.title")}
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{t("footer.contact")}</p>
          <div className="space-y-2 text-sm text-[var(--muted)]">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {site.supportEmail}
            </p>
            {site.supportPhone ? (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {site.supportPhone}
              </p>
            ) : null}
            {site.supportTelegram ? (
              <p className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {site.supportTelegram}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

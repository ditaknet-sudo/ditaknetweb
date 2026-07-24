import Link from "next/link";
import { Download } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { moreNav, primaryNav } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";

export async function SiteHeader({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_82%,transparent)] backdrop-blur-xl">
      <div className="container-page site-header__bar">
        <div className="site-header__left">
          <MobileNav locale={locale} messages={messages} />
          <BrandLogo brandName="DitakNet" href={`/${locale}`} size="sm" className="site-header__brand" showName />
        </div>

        <nav className="site-header__nav" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link key={item.key} href={`/${locale}/${item.href}`} className="site-header__link">
              {t(`nav.${item.key}`)}
            </Link>
          ))}

          <details className="site-header__more">
            <summary className="site-header__link site-header__more-summary">{t("nav.more")}</summary>
            <div className="site-header__more-panel">
              {moreNav.map((item) => (
                <Link key={item.key} href={`/${locale}/${item.href}`} className="site-header__more-link">
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        <div className="site-header__right">
          <Link href={`/${locale}/download`} className="site-header__download">
            <Download className="h-3.5 w-3.5" />
            <span>{t("nav.download")}</span>
          </Link>
          <ThemeToggle label={t("common.themeToggle")} />
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}

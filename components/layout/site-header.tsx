import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";

const publicNav = [
  { key: "product", href: "product" },
  { key: "tools", href: "tools" },
  { key: "features", href: "features" },
  { key: "deployment", href: "deployment" },
  { key: "pricing", href: "pricing" },
  { key: "security", href: "security" },
  { key: "contact", href: "contact" }
] as const;

export async function SiteHeader({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_78%,transparent)] backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <BrandLogo brandName="DitakNet" href={`/${locale}`} size="sm" />

        <nav className="hidden items-center gap-1 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}/${item.href}`}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--foreground)]"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle label={t("common.themeToggle")} />
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}

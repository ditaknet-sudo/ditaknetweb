"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Locale, locales } from "@/lib/i18n-core";
import { cn } from "@/lib/utils";

const localeFullNames: Record<Locale, string> = {
  en: "English",
  hy: "Հայերեն",
  ru: "Русский"
};

function FlagEn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="4.5" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}

function FlagHy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="13.33" y="0" fill="#D90012" />
      <rect width="60" height="13.33" y="13.33" fill="#0033A0" />
      <rect width="60" height="13.34" y="26.66" fill="#F2A800" />
    </svg>
  );
}

function FlagRu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="13.33" y="0" fill="#fff" />
      <rect width="60" height="13.33" y="13.33" fill="#0039A6" />
      <rect width="60" height="13.34" y="26.66" fill="#D52B1E" />
    </svg>
  );
}

const flags = {
  en: FlagEn,
  hy: FlagHy,
  ru: FlagRu
} as const;

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <div
      role="navigation"
      aria-label="Language"
      className="lang-switcher inline-flex h-9 items-center gap-0.5 rounded-lg border border-[var(--lang-border)] bg-[var(--lang-bg)] p-0.5"
    >
      {locales.map((locale) => {
        const segments = pathname.split("/");
        if (segments[1]) {
          segments[1] = locale;
        }
        const href = segments.join("/") || `/${locale}`;
        const active = currentLocale === locale;
        const Flag = flags[locale];

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            lang={locale}
            title={localeFullNames[locale]}
            aria-label={localeFullNames[locale]}
            aria-current={active ? "page" : undefined}
            className={cn(
              "lang-switcher__item inline-flex h-8 w-9 items-center justify-center rounded-md transition-all duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              active
                ? "bg-[var(--lang-active-bg)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--lang-active-bg)_35%,transparent)]"
                : "opacity-70 hover:bg-[var(--lang-hover-bg)] hover:opacity-100"
            )}
          >
            <Flag className="h-[14px] w-[21px] overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Locale, localeNames, locales } from "@/lib/i18n-core";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center rounded-md border border-[var(--lang-border)] bg-[var(--lang-bg)] p-1 shadow-sm">
      {locales.map((locale) => {
        const segments = pathname.split("/");
        if (segments[1]) {
          segments[1] = locale;
        }
        const href = segments.join("/") || `/${locale}`;

        return (
          <Link
            key={locale}
            href={href}
            className={cn(
              "rounded px-2 py-1 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              currentLocale === locale
                ? "bg-[var(--lang-active-bg)] text-[var(--lang-active-text)]"
                : "text-[var(--lang-muted)] hover:bg-[var(--lang-hover-bg)] hover:text-[var(--lang-text)]"
            )}
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}

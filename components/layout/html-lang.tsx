"use client";

import { useEffect } from "react";

import { Locale } from "@/lib/i18n-core";

/** Keep <html lang> in sync with the active locale route. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

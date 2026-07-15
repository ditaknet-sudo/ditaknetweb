import type { ReactNode } from "react";

import "@/app/globals.css";

import { ThemeBootstrapScript } from "@/components/theme/theme-bootstrap-script";
import { normalizeLocale } from "@/lib/i18n-core";

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  const lang = normalizeLocale(resolvedParams?.locale);

  return (
    <html lang={lang} data-theme="light" data-scroll-behavior="smooth">
      <head>
        <ThemeBootstrapScript />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";

import { PortAuditClient } from "@/components/tools/port-audit-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet Port Audit | Պորտերի Աուդիտ և Firewall NAT Ստուգում (Windows & PWA)",
    description: "Կրիտիկական պորտերի (Web, SSH, RDP, RTSP, SMB, SQL, VPN) հասանելիության և firewall-ի անվտանգության աուդիտ Windows-ի և Web PWA-ի համար։"
  },
  en: {
    title: "DitakNet Port Audit | Port Reachability & Firewall NAT Security Audit (Windows & PWA)",
    description: "Audit open network service ports, test reachability, detect exposed admin services, and verify firewall NAT rules on Windows and Web PWA."
  },
  ru: {
    title: "DitakNet Port Audit | Аудит Портов и Проверка Firewall / NAT (Windows & PWA)",
    description: "Аудит доступности критических портов, проверка открытых служб и оценка безопасности Firewall / NAT для Windows и Web PWA."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/port-audit",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function PortAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <PortAuditClient locale={locale} />
    </main>
  );
}

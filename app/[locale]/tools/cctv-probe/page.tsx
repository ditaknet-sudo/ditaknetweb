import type { Metadata } from "next";

import { CctvProbeClient } from "@/components/tools/cctv-probe-client";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const titles = {
  hy: {
    title: "DitakNet CCTV Probe | IP Տեսախցիկների, NVR և RTSP Սթրիմերի Սքաներ (Windows & PWA)",
    description: "IP տեսախցիկների, Dahua, Hikvision, Uniview և Axis սարքերի ավտոմատ որոնում, RTSP 554 ստուգում և հղումների գեներացիա Windows-ի և Web PWA-ի համար։"
  },
  en: {
    title: "DitakNet CCTV Probe | IP Camera Discovery, ONVIF & RTSP Stream Scanner (Windows & PWA)",
    description: "Discover IP security cameras, NVRs, and video encoders on Windows and Web PWA. Scan RTSP streams (554), inspect ONVIF profiles, and test live feed URLs."
  },
  ru: {
    title: "DitakNet CCTV Probe | Поиск IP-камер, ONVIF и RTSP видеопотоков (Windows & PWA)",
    description: "Сканер IP-камер видеонаблюдения, NVR и видеосерверов (Dahua, Hikvision, Uniview, Axis). Проверка RTSP 554, ONVIF и генерация ссылок."
  }
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return localizedPageMetadata(Promise.resolve({ locale }), {
    path: "/tools/cctv-probe",
    titleKey: "",
    descriptionKey: "",
    fallbackTitle: titles[locale].title,
    fallbackDescription: titles[locale].description
  });
}

export default async function CctvProbePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <main className="container-page py-10 md:py-14">
      <CctvProbeClient locale={locale} />
    </main>
  );
}

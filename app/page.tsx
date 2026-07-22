import { permanentRedirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n-core";

/** Apex `/` must permanently resolve to the default locale for crawlers. */
export default function RootPage() {
  permanentRedirect(`/${defaultLocale}`);
}

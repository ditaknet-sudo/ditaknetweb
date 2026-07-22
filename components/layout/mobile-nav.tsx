"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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

export function MobileNav({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="mobile-nav lg:hidden">
      <button
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : t("nav.menu")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="mobile-nav__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      ) : null}

      <nav
        id="mobile-nav-panel"
        className={`mobile-nav__panel ${open ? "mobile-nav__panel--open" : ""}`}
        aria-hidden={!open}
      >
        <p className="mobile-nav__title">{t("nav.menu")}</p>
        <ul className="mobile-nav__list">
          {publicNav.map((item) => (
            <li key={item.key}>
              <Link
                href={`/${locale}/${item.href}`}
                className="mobile-nav__link"
                onClick={() => setOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

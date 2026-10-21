"use client";

import { useEffect, useState } from "react";
import { Laptop, Download, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallButton({
  locale,
  label,
  installedLabel
}: {
  locale: string;
  label?: string;
  installedLabel?: string;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      const msg =
        locale === "hy"
          ? "Տեղադրելու համար սեղմեք դիտարկիչի (Edge / Chrome) հասցեագոտու աջ մասի 📥 (Install DitakNet) կոճակը:"
          : locale === "ru"
          ? "Для установки нажмите иконку 📥 (Установить приложение) в правой части адресной строки браузера (Edge / Chrome):"
          : "To install, click the 📥 Install icon in your browser address bar (Edge / Chrome):";
      alert(msg);
    }
  };

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>{installedLabel || (locale === "hy" ? "Տեղադրված է Windows-ում" : "Installed on Windows")}</span>
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand)]/40 bg-[var(--brand)]/15 px-4 py-2.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--brand)] hover:text-white transition-all shadow-sm active:scale-95"
    >
      <Laptop className="h-4 w-4 text-[var(--brand)] group-hover:text-white" />
      <span>{label || (locale === "hy" ? "Տեղադրել Windows App (PWA)" : "Install Windows App (PWA)")}</span>
    </button>
  );
}

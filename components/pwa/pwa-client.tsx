"use client";

import { useEffect, useState } from "react";
import { Laptop, Download, CheckCircle2, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaClient({ locale }: { locale: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[DitakNet PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[DitakNet PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Check if already running in standalone mode (installed app on Windows)
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
      }
    }

    // 3. Listen for native browser PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user on how to install via browser address bar if prompt not fired yet
      const msg =
        locale === "hy"
          ? "Տեղադրելու համար սեղմեք դիտարկիչի (Edge / Chrome) հասցեագոտու աջ մասի 📥 (Տեղադրել Ծրագիրը / Install App) պատկերակը:"
          : locale === "ru"
          ? "Для установки нажмите иконку 📥 (Установить приложение) в правой части адресной строки браузера (Edge / Chrome):"
          : "To install, click the 📥 Install App icon on the right side of your browser address bar (Edge / Chrome):";
      alert(msg);
    }
  };

  if (isInstalled) {
    return null;
  }

  // Floating banner on bottom right
  if (!showBanner && !deferredPrompt) {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-[var(--brand)]/40 bg-[var(--panel)]/95 p-3.5 shadow-2xl backdrop-blur-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
        <Laptop className="h-5 w-5" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-bold text-[var(--foreground)]">
          {locale === "hy"
            ? "Տեղադրել DitakNet Windows-ում"
            : locale === "ru"
            ? "Установить DitakNet на Windows"
            : "Install DitakNet on Windows"}
        </p>
        <p className="mt-0.5 text-[var(--muted)]">
          {locale === "hy"
            ? "Աշխատեք որպես առանձին Windows PWA ծրագիր:"
            : locale === "ru"
            ? "Используйте как автономное приложение Windows:"
            : "Run as a standalone desktop app:"}
        </p>
      </div>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-110 active:scale-95 transition-all"
      >
        <Download className="h-3.5 w-3.5" />
        <span>{locale === "hy" ? "Տեղադրել" : locale === "ru" ? "Установить" : "Install"}</span>
      </button>
      <button
        onClick={() => setIsDismissed(true)}
        className="text-[var(--muted)] hover:text-[var(--foreground)] p-1 rounded-md"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "ditaknet.theme.v1";

function loadMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "light";
    const parsed = JSON.parse(raw) as { mode?: string };
    const mode = String(parsed.mode || "light").toLowerCase();
    if (mode === "dark") return "dark";
    if (mode === "light") return "light";
    // Legacy system/auto prefs collapse to a simple light/dark choice.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  } catch {
    return "light";
  }
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.setAttribute("data-bs-theme", mode);
  root.style.colorScheme = mode;
}

export function ThemeToggle({ label }: { label: string }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const next = loadMode();
    applyTheme(next);
    const sync = window.setTimeout(() => setMode(next), 0);
    return () => window.clearTimeout(sync);
  }, []);

  function toggle() {
    const next: ThemeMode = mode === "light" ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: next }));
    } catch {
      // Theme still applies for this page even if persistence is unavailable.
    }
    applyTheme(next);
    setMode(next);
  }

  const Icon = mode === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--foreground)] shadow-sm hover:bg-[var(--panel-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

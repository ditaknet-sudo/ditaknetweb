"use client";

import { Clock, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system" | "auto";

type ThemePrefs = {
  mode: ThemeMode;
  dayStarts: string;
  nightStarts: string;
};

const STORAGE_KEY = "ditaknet.theme.v1";
const DEFAULTS: ThemePrefs = {
  mode: "system",
  dayStarts: "07:00",
  nightStarts: "19:00"
};

function parseHHMM(value: string, fallback: string) {
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(String(value || "").trim());
  if (!match) return fallback;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return fallback;
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}

function resolveAuto(dayStarts: string, nightStarts: string) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const day = parseHHMM(dayStarts, DEFAULTS.dayStarts).split(":").map(Number);
  const night = parseHHMM(nightStarts, DEFAULTS.nightStarts).split(":").map(Number);
  const dayMin = day[0] * 60 + day[1];
  const nightMin = night[0] * 60 + night[1];
  if (dayMin === nightMin) return "light";
  if (dayMin < nightMin) return mins >= dayMin && mins < nightMin ? "light" : "dark";
  return mins >= dayMin || mins < nightMin ? "light" : "dark";
}

function loadPrefs(): ThemePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<ThemePrefs>;
    const mode = String(parsed.mode || "system").toLowerCase() as ThemeMode;
    return {
      mode: ["light", "dark", "system", "auto"].includes(mode) ? mode : "system",
      dayStarts: parseHHMM(String(parsed.dayStarts || ""), DEFAULTS.dayStarts),
      nightStarts: parseHHMM(String(parsed.nightStarts || ""), DEFAULTS.nightStarts)
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function resolveActive(prefs: ThemePrefs): "light" | "dark" {
  if (prefs.mode === "light" || prefs.mode === "dark") return prefs.mode;
  if (prefs.mode === "auto") return resolveAuto(prefs.dayStarts, prefs.nightStarts);
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(active: "light" | "dark") {
  const root = document.documentElement;
  root.setAttribute("data-theme", active);
  root.setAttribute("data-bs-theme", active);
  root.style.colorScheme = active;
}

export function ThemeToggle({ label }: { label: string }) {
  const [active, setActive] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const prefs = loadPrefs();
    const next = resolveActive(prefs);
    applyTheme(next);
    // Defer so we do not sync-set state in the effect body (lint / cascading render).
    const syncIcon = window.setTimeout(() => {
      setMode(prefs.mode);
      setActive(next);
    }, 0);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => {
      const current = loadPrefs();
      if (current.mode === "system") {
        const resolved = resolveActive(current);
        applyTheme(resolved);
        setActive(resolved);
      }
    };
    media.addEventListener("change", onMedia);

    const interval = window.setInterval(() => {
      const current = loadPrefs();
      if (current.mode === "auto") {
        const resolved = resolveActive(current);
        applyTheme(resolved);
        setActive(resolved);
      }
    }, 60000);

    return () => {
      window.clearTimeout(syncIcon);
      media.removeEventListener("change", onMedia);
      window.clearInterval(interval);
    };
  }, []);

  function setThemeMode(nextMode: ThemeMode) {
    const prefs: ThemePrefs = {
      ...loadPrefs(),
      mode: nextMode
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Theme still applies for this page even if persistence is unavailable.
    }
    const nextActive = resolveActive(prefs);
    applyTheme(nextActive);
    setMode(nextMode);
    setActive(nextActive);
  }

  const Icon = mode === "system" ? Monitor : mode === "auto" ? Clock : active === "dark" ? Sun : Moon;

  return (
    <label
      className="inline-flex h-9 items-center gap-1 rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--panel-2)]"
      title={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <select
        value={mode}
        onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
        className="h-7 cursor-pointer rounded border-0 bg-transparent text-xs font-bold uppercase text-[var(--foreground)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        aria-label={label}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
        <option value="auto">Auto</option>
      </select>
    </label>
  );
}

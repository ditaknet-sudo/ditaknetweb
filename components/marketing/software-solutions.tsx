"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Cpu,
  ExternalLink,
  Hotel,
  Layers,
  Network,
  Radar,
  Sparkles
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";

type SoftwareSolutionsProps = {
  locale: Locale;
  messages: Messages;
};

// Interactive sample ports for the Patch Panel visualization
const patchPanelPorts = [
  { id: 1, label: "Core Switch Trunk", status: "uplink", color: "#3b82f6" },
  { id: 2, label: "Firewall Gateway", status: "uplink", color: "#3b82f6" },
  { id: 3, label: "Server 01 (DitakNet Host)", status: "active", color: "#10b981" },
  { id: 4, label: "Server 02 (Backup NAS)", status: "active", color: "#10b981" },
  { id: 5, label: "CCTV NVR 16ch", status: "poe", color: "#f59e0b" },
  { id: 6, label: "Camera Front Gate", status: "poe", color: "#f59e0b" },
  { id: 7, label: "Camera Lobby Main", status: "poe", color: "#f59e0b" },
  { id: 8, label: "Camera Parking Area", status: "poe", color: "#f59e0b" },
  { id: 9, label: "Wi-Fi AP Floor 1", status: "poe", color: "#f59e0b" },
  { id: 10, label: "Wi-Fi AP Floor 2", status: "poe", color: "#f59e0b" },
  { id: 11, label: "Admin Workstation", status: "active", color: "#10b981" },
  { id: 12, label: "IT Tech Bench", status: "active", color: "#10b981" },
  { id: 13, label: "Reception Desk POS", status: "active", color: "#10b981" },
  { id: 14, label: "VoIP PBX Station", status: "active", color: "#10b981" },
  { id: 15, label: "Smart Barrier Gate", status: "active", color: "#10b981" },
  { id: 16, label: "Access Control Intercom", status: "poe", color: "#f59e0b" },
  { id: 17, label: "Office VLAN Switch", status: "active", color: "#10b981" },
  { id: 18, label: "Guest Lounge AP", status: "poe", color: "#f59e0b" },
  { id: 19, label: "Spare Port A", status: "idle", color: "#6b7280" },
  { id: 20, label: "Spare Port B", status: "idle", color: "#6b7280" },
  { id: 21, label: "Reserved Fiber Optic", status: "idle", color: "#6b7280" },
  { id: 22, label: "Reserved CCTV Exp", status: "idle", color: "#6b7280" },
  { id: 23, label: "Maintenance Jack", status: "idle", color: "#6b7280" },
  { id: 24, label: "Emergency Uplink", status: "uplink", color: "#3b82f6" }
];

export function SoftwareSolutionsSection({ locale, messages }: SoftwareSolutionsProps) {
  const t = createTranslator(messages);
  const [selectedPort, setSelectedPort] = useState<number>(3);

  const activePort = patchPanelPorts.find((p) => p.id === selectedPort) || patchPanelPorts[0];

  return (
    <section id="software" className="relative border-t border-[var(--line)] py-16 md:py-24">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-full -translate-x-1/2 max-w-7xl bg-gradient-to-b from-[color-mix(in_srgb,var(--brand)_8%,transparent)] via-[color-mix(in_srgb,var(--accent)_6%,transparent)] to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page">
        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("home.software.eyebrow")}</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
            {t("home.software.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)] md:text-lg">
            {t("home.software.description")}
          </p>
        </div>

        {/* 2x2 Grid for Software Programs */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card 1: Patch Panel (Created by DitakNet) */}
          <Card className="group relative flex flex-col overflow-hidden border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_95%,var(--brand))] p-6 shadow-md transition-all hover:border-[var(--brand)] hover:shadow-xl md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--brand)_15%,transparent)] px-3 py-1 text-xs font-bold text-[var(--brand)]">
                <Layers className="h-3.5 w-3.5" />
                {t("home.software.patchPanel.badge")}
              </span>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {t("home.software.patchPanel.subtitle")}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-[var(--foreground)]">
              {t("home.software.patchPanel.title")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {t("home.software.patchPanel.description")}
            </p>

            {/* Interactive Patch Panel Visualizer */}
            <div className="my-6 rounded-xl border border-[var(--line)] bg-[var(--invert-bg)] p-4 text-[var(--invert-text)] shadow-inner">
              <div className="mb-3 flex items-center justify-between text-xs text-[var(--invert-muted)]">
                <span className="flex items-center gap-1.5 font-mono font-bold tracking-wider text-[var(--accent)]">
                  <Cpu className="h-3.5 w-3.5" /> 1U 24-Port Cat6A Rack Unit
                </span>
                <span className="font-mono">Ports 1-24 Active</span>
              </div>

              {/* 24-Port Grid (Two rows of 12) */}
              <div className="grid grid-cols-12 gap-1.5 rounded-lg border border-[var(--invert-line)] bg-[var(--invert-panel)] p-2.5">
                {patchPanelPorts.map((port) => {
                  const isSelected = selectedPort === port.id;
                  return (
                    <button
                      key={port.id}
                      type="button"
                      onClick={() => setSelectedPort(port.id)}
                      className={`group/port relative flex h-9 flex-col items-center justify-between rounded border transition ${
                        isSelected
                          ? "border-[var(--brand)] bg-[color-mix(in_srgb,var(--brand)_30%,transparent)] shadow-sm scale-105"
                          : "border-[var(--invert-line)] bg-black/40 hover:border-[var(--invert-text)]"
                      }`}
                      title={`Port ${port.id}: ${port.label}`}
                    >
                      <span className="text-[9px] font-mono leading-none text-[var(--invert-muted)] pt-0.5">
                        {port.id}
                      </span>
                      {/* Port LED indicator */}
                      <span
                        className="h-2 w-2 rounded-full mb-1 transition-all"
                        style={{
                          backgroundColor: port.color,
                          boxShadow: `0 0 6px ${port.color}`
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Active Port Inspector Details */}
              <div className="mt-3 flex items-center justify-between rounded-md border border-[var(--invert-line)] bg-black/30 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: activePort.color }}
                  />
                  <span className="font-mono font-bold">Port {activePort.id}:</span>
                  <span className="text-[var(--invert-text)]">{activePort.label}</span>
                </div>
                <span className="font-mono uppercase text-[10px] tracking-wider text-[var(--accent)]">
                  {activePort.status}
                </span>
              </div>
            </div>

            {/* Feature bullets */}
            <ul className="mb-6 space-y-2 text-sm text-[var(--foreground)]">
              {(t("home.software.patchPanel.features") as unknown as string[]).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <ButtonLink href={`/${locale}/tools/patch-panel`} variant="outline" size="md" className="w-full justify-between">
                <span>{t("home.software.patchPanel.cta")}</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Card>

          {/* Card 2: Network Exploration & IT Toolkit */}
          <Card className="group relative flex flex-col overflow-hidden border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_95%,var(--accent))] p-6 shadow-md transition-all hover:border-[var(--accent)] hover:shadow-xl md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
                <Radar className="h-3.5 w-3.5" />
                {t("home.software.networkExplorer.badge")}
              </span>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {t("home.software.networkExplorer.subtitle")}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-[var(--foreground)]">
              {t("home.software.networkExplorer.title")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {t("home.software.networkExplorer.description")}
            </p>

            {/* Network Explorer Mock Preview */}
            <div className="my-6 rounded-xl border border-[var(--line)] bg-[var(--invert-bg)] p-4 text-[var(--invert-text)] shadow-inner">
              <div className="flex items-center justify-between border-b border-[var(--invert-line)] pb-2.5 text-xs">
                <div className="flex items-center gap-2 font-mono text-[var(--accent)]">
                  <Network className="h-4 w-4" />
                  <span>Subnet: 192.168.1.0/24</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--invert-muted)]">
                  <Activity className="h-3 w-3 text-[var(--accent)]" />
                  <span>Ping: 1.1ms</span>
                </div>
              </div>

              <div className="mt-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between rounded bg-[var(--invert-panel)] px-2.5 py-1.5">
                  <span className="text-[var(--brand)] font-bold">192.168.1.1</span>
                  <span className="text-[var(--invert-muted)]">MikroTik RouterOS</span>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] text-emerald-400">ONLINE</span>
                </div>
                <div className="flex items-center justify-between rounded bg-[var(--invert-panel)] px-2.5 py-1.5">
                  <span className="text-[var(--brand)] font-bold">192.168.1.50</span>
                  <span className="text-[var(--invert-muted)]">DitakNet Server :5833</span>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] text-emerald-400">HEALTHY</span>
                </div>
                <div className="flex items-center justify-between rounded bg-[var(--invert-panel)] px-2.5 py-1.5">
                  <span className="text-[var(--brand)] font-bold">192.168.1.120</span>
                  <span className="text-[var(--invert-muted)]">CCTV NVR (Port 554 RTSP)</span>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] text-emerald-400">STREAMING</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--invert-muted)] pt-1">
                <span>Active Hosts: 48</span>
                <span>VLANs: 4 Segments</span>
                <span>Zero Cloud Dependency</span>
              </div>
            </div>

            {/* Feature bullets */}
            <ul className="mb-6 space-y-2 text-sm text-[var(--foreground)]">
              {(t("home.software.networkExplorer.features") as unknown as string[]).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <ButtonLink href={`/${locale}/tools/network-explorer`} variant="outline" size="md" className="w-full justify-between">
                <span>{t("home.software.networkExplorer.cta")}</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Card>

          {/* Card 3: Hotel Management System (hotel.ditaknet.com) */}
          <Card className="group relative flex flex-col overflow-hidden border-2 border-[color-mix(in_srgb,var(--brand)_60%,transparent)] bg-[color-mix(in_srgb,var(--panel)_92%,var(--brand))] p-6 shadow-lg transition-all hover:border-[var(--brand)] hover:shadow-2xl md:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(23,105,170,0.18)_0%,transparent_70%)] blur-2xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Hotel className="h-3.5 w-3.5" />
                  {t("home.software.hotel.highlightBadge")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t("home.software.hotel.badge")}
                </span>
              </div>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {t("home.software.hotel.subtitle")}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-[var(--foreground)] md:text-3xl">
              {t("home.software.hotel.title")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {t("home.software.hotel.description")}
            </p>

            {/* Mini Hotel Dashboard Preview */}
            <div className="my-6 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
                  <Hotel className="h-4 w-4 text-[var(--brand)]" />
                  <span>hotel.ditaknet.com Live PMS</span>
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  Occupancy: 87% (42/48 Rooms)
                </span>
              </div>

              {/* Sample Room Status Tiles */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2">
                  <div className="font-bold text-[var(--foreground)]">Room 101</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">VIP Occupied</div>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2">
                  <div className="font-bold text-[var(--foreground)]">Room 102</div>
                  <div className="text-[10px] text-[var(--brand)] font-semibold">Ready / Free</div>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2">
                  <div className="font-bold text-[var(--foreground)]">Room 201</div>
                  <div className="text-[10px] text-amber-600 font-semibold">Housekeeping</div>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2">
                  <div className="font-bold text-[var(--foreground)]">Room 204</div>
                  <div className="text-[10px] text-blue-600 font-semibold">Check-in Today</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-2 text-[11px] text-[var(--muted)]">
                <span>Integrated Wi-Fi & CCTV</span>
                <span>Automated Billing & POS</span>
                <span className="font-semibold text-[var(--brand)]">hotel.ditaknet.com</span>
              </div>
            </div>

            {/* Feature bullets */}
            <ul className="mb-6 space-y-2 text-sm text-[var(--foreground)]">
              {(t("home.software.hotel.features") as unknown as string[]).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <a
                href="https://hotel.ditaknet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-11 w-full items-center justify-between rounded-md bg-[var(--brand)] px-5 text-sm font-bold text-white shadow transition hover:bg-[var(--brand-dark)]"
              >
                <span className="flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  {t("home.software.hotel.cta")}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Card>

          {/* Card 4: Residential Complex & Property Management */}
          <Card className="group relative flex flex-col overflow-hidden border-2 border-[color-mix(in_srgb,var(--accent)_60%,transparent)] bg-[color-mix(in_srgb,var(--panel)_92%,var(--accent))] p-6 shadow-lg transition-all hover:border-[var(--accent)] hover:shadow-2xl md:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(23,166,115,0.18)_0%,transparent_70%)] blur-2xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {t("home.software.residential.badge")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
                  <Building2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {t("home.software.residential.highlightBadge")}
                </span>
              </div>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {t("home.software.residential.subtitle")}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-[var(--foreground)] md:text-3xl">
              {t("home.software.residential.title")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {t("home.software.residential.description")}
            </p>

            {/* Mini Residential Complex Portal Preview */}
            <div className="my-6 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
                  <Building2 className="h-4 w-4 text-[var(--accent)]" />
                  <span>Smart Living & Property PMS</span>
                </div>
                <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent)]">
                  Delivery: 2-3 Months
                </span>
              </div>

              {/* Sample Residential Status Blocks */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2">
                  <div className="text-[10px] text-[var(--muted)]">Access Control</div>
                  <div className="font-bold text-[var(--foreground)]">Gate Barrier: Auto Open</div>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2">
                  <div className="text-[10px] text-[var(--muted)]">Resident Utility</div>
                  <div className="font-bold text-emerald-600">Apt #142: Paid</div>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-2 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-[var(--muted)]">Intercom / CCTV</div>
                  <div className="font-bold text-[var(--brand)]">Video Doorphone Active</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-2 text-[11px] text-[var(--muted)]">
                <span>Custom Built for Your Gated Community / Building</span>
                <span className="font-bold text-[var(--accent)]">2-3 Months Turnkey</span>
              </div>
            </div>

            {/* Feature bullets */}
            <ul className="mb-6 space-y-2 text-sm text-[var(--foreground)]">
              {(t("home.software.residential.features") as unknown as string[]).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <ButtonLink
                href={`/${locale}/contact?service=residential`}
                variant="secondary"
                size="md"
                className="w-full justify-between font-bold"
              >
                <span>{t("home.software.residential.cta")}</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

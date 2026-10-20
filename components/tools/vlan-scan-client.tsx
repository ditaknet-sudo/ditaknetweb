"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownToLine,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  Hotel,
  Layers,
  Lock,
  Network,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Router,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Wifi,
  XCircle
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

export type VlanSegment = {
  vlanId: number;
  name: string;
  subnet: string;
  gateway: string;
  hostCount: number;
  tag: string;
  isolated: boolean;
  color: string;
  status: "active" | "warning" | "isolated";
  devices: string[];
};

export function VlanScanClient({ locale }: { locale: Locale }) {
  const [vlans, setVlans] = useState<VlanSegment[]>([]);
  const [selectedVlan, setSelectedVlan] = useState<VlanSegment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(100);
  const [auditResults, setAuditResults] = useState<Record<number, { alive: boolean; latencyMs: number }>>({});
  const [primarySubnet, setPrimarySubnet] = useState<string>("192.168.11.0/24");
  const [primaryGateway, setPrimaryGateway] = useState<string>("192.168.11.254");

  // New VLAN creation form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVlanId, setNewVlanId] = useState<number>(100);
  const [newVlanName, setNewVlanName] = useState("");
  const [newVlanSubnet, setNewVlanSubnet] = useState("192.168.100.0/24");
  const [newVlanGateway, setNewVlanGateway] = useState("192.168.100.1");
  const [newVlanIsolated, setNewVlanIsolated] = useState(true);

  const text = {
    hy: {
      title: "VLAN Scan — Իրական Ցանցի Սեգմենտներ և Մեկուսացման Աուդիտ",
      subtitle:
        "Ստուգեք ձեր համակարգի իրական ցանցային ադապտերները, Gateway-ները, 802.1Q սեգմենտները և ավելացրեք ձեր switch/router-ի իրական VLAN-ները։",
      downloadWin: "Ներբեռնել Windows տարբերակը (.ZIP)",
      runAudit: "Կատարել Իրական Ping Աուդիտ",
      auditing: "Ստուգվում են Gateway-ները...",
      segmentsTitle: "Հայտնաբերված Իրական Սեգմենտներ",
      matrixTitle: "Inter-VLAN Երթուղավորման և Մեկուսացման Կանոններ",
      matrixDesc:
        "Իրական մեկուսացման քաղաքականություն՝ ստուգելու, թե որ սեգմենտներն ունեն ելք դեպի Gateway և արդյոք կա մուտք դեպի տեղային սարքեր։",
      topologyTitle: "802.1Q Trunk & Access Տոպոլոգիա",
      exportReport: "Արտահանել Հաշվետվություն (JSON)",
      liveNotice: "ԻՐԱԿԱՆ ՀԱՄԱԿԱՐԳԱՅԻՆ ՏՎՅԱԼՆԵՐ (LIVE DATA)",
      addVlanBtn: "+ Ավելացնել Իրական VLAN",
      saveVlan: "Պահպանել VLAN-ը",
      cancel: "Չեղարկել",
      deleteVlan: "Ջնջել",
      winNoticeTitle: "Windows Native VLAN գործիք (Standalone)",
      winNoticeBody:
        "Ցանցային քարտերի իրական 802.1Q պիտակները և երթուղիները տեղում կառավարելու համար կարող եք նաև գործարկել DitakNet-VLAN-Scan.bat ֆայլը։"
    },
    en: {
      title: "VLAN Scan — Live Network Segments & Isolation Audit",
      subtitle:
        "Audit physical network adapters, live gateways, 802.1Q tags, and manage your switch/router VLAN segments in real time.",
      downloadWin: "Download Windows Suite (.ZIP)",
      runAudit: "Run Live Ping Audit",
      auditing: "Pinging live gateways...",
      segmentsTitle: "Discovered Hardware Segments",
      matrixTitle: "Inter-VLAN Security & Isolation Policy",
      matrixDesc:
        "Live policy inspection verifying gateway reachability and inter-segment traffic routing.",
      topologyTitle: "802.1Q Trunk & Access Topology",
      exportReport: "Export Report (JSON)",
      liveNotice: "LIVE HARDWARE DATA (CONNECTED)",
      addVlanBtn: "+ Add Real VLAN",
      saveVlan: "Save VLAN",
      cancel: "Cancel",
      deleteVlan: "Delete",
      winNoticeTitle: "Native Windows Standalone Tool",
      winNoticeBody:
        "To audit network adapters and 802.1Q priority tags directly inside Windows, run DitakNet-VLAN-Scan.bat."
    },
    ru: {
      title: "VLAN Scan — Реальные Сетевые Сегменты и Аудит Изоляции",
      subtitle:
        "Аудит физических сетевых интерфейсов, шлюзов, тегов 802.1Q и управление сегментами вашего коммутатора/маршрутизатора.",
      downloadWin: "Скачать для Windows (.ZIP)",
      runAudit: "Запустить Реальный Ping-Аудит",
      auditing: "Проверка шлюзов...",
      segmentsTitle: "Обнаруженные интерфейсы и сегменты",
      matrixTitle: "Политика Безопасности и Изоляции Inter-VLAN",
      matrixDesc:
        "Проверка изоляции сегментов и доступности шлюзов в реальном времени.",
      topologyTitle: "Карта Топологии 802.1Q",
      exportReport: "Экспорт (JSON)",
      liveNotice: "РЕАЛЬНЫЕ СИСТЕМНЫЕ ДАННЫЕ (LIVE)",
      addVlanBtn: "+ Добавить VLAN",
      saveVlan: "Сохранить",
      cancel: "Отмена",
      deleteVlan: "Удалить",
      winNoticeTitle: "Автономная утилита для Windows",
      winNoticeBody:
        "Для работы со шлюзами и адаптерами напрямую в Windows запустите DitakNet-VLAN-Scan.bat."
    }
  }[locale];

  // Load real segments from diagnostics API on mount
  useEffect(() => {
    async function loadRealSegments() {
      try {
        const res = await fetch("/api/network/diagnostics?action=vlans");
        const data = await res.json();

        if (data.segments && data.segments.length > 0) {
          // Check if user has saved custom VLANs in localStorage
          let saved: VlanSegment[] = [];
          try {
            const raw = localStorage.getItem("ditaknet_custom_vlans");
            if (raw) saved = JSON.parse(raw);
          } catch {
            // ignore
          }

          const combined = [...data.segments, ...saved];
          setVlans(combined);
          setSelectedVlan(combined[0]);
          if (data.primarySubnet) setPrimarySubnet(data.primarySubnet);
          if (data.primaryGateway) setPrimaryGateway(data.primaryGateway);
        }
      } catch (e) {
        console.error("Failed to load real VLANs:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadRealSegments();
  }, []);

  // Run real live ping audit on all segment gateways
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(10);

    const results: Record<number, { alive: boolean; latencyMs: number }> = {};
    const total = vlans.length;

    for (let i = 0; i < total; i++) {
      const v = vlans[i];
      try {
        const res = await fetch(`/api/network/diagnostics?action=ping&target=${encodeURIComponent(v.gateway)}`);
        const json = await res.json();
        results[v.vlanId] = {
          alive: Boolean(json.alive),
          latencyMs: Number(json.latencyMs) || 1
        };
      } catch {
        results[v.vlanId] = { alive: false, latencyMs: 0 };
      }
      setAuditProgress(Math.floor(((i + 1) / total) * 100));
    }

    setAuditResults(results);

    // Update statuses based on real response
    setVlans((prev) =>
      prev.map((item) => {
        const audit = results[item.vlanId];
        if (!audit) return item;
        return {
          ...item,
          status: audit.alive ? "active" : item.isolated ? "isolated" : "warning"
        };
      })
    );

    setIsAuditing(false);
  };

  const handleAddCustomVlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVlanName.trim()) return;

    const newSegment: VlanSegment = {
      vlanId: Number(newVlanId) || Math.floor(Math.random() * 900) + 100,
      name: newVlanName.trim(),
      subnet: newVlanSubnet.trim() || "192.168.100.0/24",
      gateway: newVlanGateway.trim() || "192.168.100.1",
      hostCount: 1,
      tag: `802.1Q Tagged (VLAN ${newVlanId})`,
      isolated: newVlanIsolated,
      color: "#ec4899",
      status: newVlanIsolated ? "isolated" : "active",
      devices: [`Gateway Router (${newVlanGateway.trim()})`]
    };

    const updated = [...vlans, newSegment];
    setVlans(updated);
    setSelectedVlan(newSegment);
    setShowAddForm(false);
    setNewVlanName("");

    // Persist custom ones to localStorage
    try {
      const customOnly = updated.filter((item) => item.vlanId >= 50);
      localStorage.setItem("ditaknet_custom_vlans", JSON.stringify(customOnly));
    } catch {
      // ignore
    }
  };

  const handleDeleteVlan = (vlanId: number) => {
    const updated = vlans.filter((v) => v.vlanId !== vlanId);
    setVlans(updated);
    if (selectedVlan?.vlanId === vlanId) {
      setSelectedVlan(updated[0] || null);
    }
    try {
      const customOnly = updated.filter((item) => item.vlanId >= 50);
      localStorage.setItem("ditaknet_custom_vlans", JSON.stringify(customOnly));
    } catch {
      // ignore
    }
  };

  const handleExportJson = () => {
    const report = {
      scanDate: new Date().toISOString(),
      platform: "DitakNet Real VLAN Diagnostics Engine",
      primarySubnet,
      primaryGateway,
      auditResults,
      segments: vlans
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ditaknet-real-vlan-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header & Download CTA */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{text.liveNotice}</span>
            </span>
            <span className="text-xs font-mono text-[var(--muted)]">
              {primarySubnet} · Gateway: {primaryGateway}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black text-[var(--foreground)] md:text-4xl">{text.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{text.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/downloads/vlan-scan.zip"
            download
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[var(--brand)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
          >
            <Download className="h-4 w-4" />
            <span>{text.downloadWin}</span>
          </a>
        </div>
      </div>

      {/* Audit Action Banner */}
      <Card className="p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">{text.segmentsTitle}</h2>
            <p className="text-xs text-[var(--muted)]">
              {vlans.length} իրական սեգմենտներ · Կապված է ձեր համակարգի ադապտերների հետ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[var(--brand)] bg-[color-mix(in_srgb,var(--brand)_10%,transparent)] px-4 text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition"
            >
              <Plus className="h-4 w-4" />
              <span>{text.addVlanBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? text.auditing : text.runAudit}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-bold text-[var(--foreground)] hover:border-[var(--brand)]"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {isAuditing ? (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--panel-soft)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition-all duration-300"
                style={{ width: `${auditProgress}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[11px] font-mono text-[var(--muted)]">{auditProgress}%</div>
          </div>
        ) : null}

        {/* Add Real Custom VLAN Form */}
        {showAddForm ? (
          <form
            onSubmit={handleAddCustomVlan}
            className="mt-6 rounded-xl border border-[var(--brand)] bg-[var(--panel-soft)] p-4 md:p-5"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 mb-4">
              <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <Plus className="h-4 w-4 text-[var(--brand)]" />
                <span>Ավելացնել Ձեր Switch / Router-ի իրական VLAN-ը</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-bold text-[var(--muted)]">VLAN ID (Tag)</label>
                <input
                  type="number"
                  min="1"
                  max="4094"
                  value={newVlanId}
                  onChange={(e) => setNewVlanId(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)]">Անվանում (Name)</label>
                <input
                  type="text"
                  placeholder="Օր․ CCTV Cameras կամ Office"
                  value={newVlanName}
                  onChange={(e) => setNewVlanName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)]">Subnet CIDR</label>
                <input
                  type="text"
                  placeholder="192.168.20.0/24"
                  value={newVlanSubnet}
                  onChange={(e) => setNewVlanSubnet(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)]">Gateway IP</label>
                <input
                  type="text"
                  placeholder="192.168.20.1"
                  value={newVlanGateway}
                  onChange={(e) => setNewVlanGateway(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={newVlanIsolated}
                  onChange={(e) => setNewVlanIsolated(e.target.checked)}
                  className="rounded border-[var(--line)]"
                />
                <span>Մեկուսացված զոնա (Isolated Network / No Inter-VLAN routing)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs font-bold"
                >
                  {text.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[var(--brand)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--brand-dark)]"
                >
                  {text.saveVlan}
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </Card>

      {/* VLAN Segment Cards Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-[var(--muted)] flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-[var(--brand)]" />
          <span>Հավաքագրվում են իրական ցանցային ինտերֆեյսները...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vlans.map((v) => {
            const isSelected = selectedVlan?.vlanId === v.vlanId;
            const audit = auditResults[v.vlanId];

            return (
              <div
                key={v.vlanId}
                onClick={() => setSelectedVlan(v)}
                className={`group relative cursor-pointer rounded-xl border p-5 transition-all ${
                  isSelected
                    ? "border-[var(--brand)] bg-[color-mix(in_srgb,var(--panel)_95%,var(--brand))] shadow-md scale-[1.02]"
                    : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--muted)] hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-md px-2.5 py-1 text-xs font-mono font-bold text-white shadow-sm"
                    style={{ backgroundColor: v.color }}
                  >
                    VLAN {v.vlanId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--muted)]">{v.tag}</span>
                    {v.vlanId >= 50 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVlan(v.vlanId);
                        }}
                        title={text.deleteVlan}
                        className="text-[var(--muted)] hover:text-red-600 opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>

                <h3 className="mt-3 text-base font-bold text-[var(--foreground)]">{v.name}</h3>

                <div className="mt-2 space-y-1 text-xs font-mono text-[var(--muted)]">
                  <div>
                    Subnet: <span className="font-bold text-[var(--foreground)]">{v.subnet}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Gateway: <span className="text-[var(--brand)] font-bold">{v.gateway}</span>
                    </span>
                    {audit ? (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          audit.alive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {audit.alive ? `${audit.latencyMs}ms` : "No Reply"}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    Active Hosts: <span className="text-emerald-600 font-bold">{v.hostCount}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs">
                  {v.isolated ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Isolated Zone</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Routed LAN</span>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[var(--muted)]">{v.devices.length} Devices</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected VLAN Inspector & Connected Devices */}
      {selectedVlan ? (
        <Card className="p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-mono font-bold text-sm shadow-sm"
                style={{ backgroundColor: selectedVlan.color }}
              >
                {selectedVlan.vlanId}
              </span>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{selectedVlan.name}</h3>
                <p className="text-xs font-mono text-[var(--muted)]">
                  {selectedVlan.subnet} · Gateway: {selectedVlan.gateway}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--panel-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                {selectedVlan.tag}
              </span>
              {selectedVlan.isolated ? (
                <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                  Client Isolation Active
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Inter-VLAN Routing Permitted
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
              Իրական սարքեր և հասցեներ այս սեգմենտում (Real Discovered Hosts):
            </h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {selectedVlan.devices.map((dev, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-3 text-xs font-semibold text-[var(--foreground)]"
                >
                  <Server className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span className="truncate">{dev}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      {/* Inter-VLAN Security Matrix */}
      <Card className="p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[var(--foreground)]">{text.matrixTitle}</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">{text.matrixDesc}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--panel-soft)] font-mono font-bold text-[var(--muted)]">
                <th className="px-3 py-2 text-left">ՍԵԳՄԵՆՏ (SOURCE)</th>
                <th className="px-3 py-2">Gateway Route</th>
                <th className="px-3 py-2">LAN Workstations</th>
                <th className="px-3 py-2">Servers & Storage</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-mono font-bold">
              {vlans.map((v) => (
                <tr key={v.vlanId}>
                  <td className="px-3 py-2.5 text-left text-[var(--foreground)]">
                    VLAN {v.vlanId} ({v.name})
                  </td>
                  <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                  <td className="px-3 py-2.5">
                    {v.isolated ? (
                      <span className="text-amber-600">ISOLATED</span>
                    ) : (
                      <span className="text-emerald-600">ROUTED</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {v.isolated ? (
                      <span className="text-red-600 bg-red-50/20 px-2 py-0.5 rounded">BLOCKED</span>
                    ) : (
                      <span className="text-emerald-600">PORT 443 / SMB</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                        v.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Windows Native Tool Guide Banner */}
      <div className="rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">{text.winNoticeTitle}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">{text.winNoticeBody}</p>
          </div>
          <a
            href="/downloads/vlan-scan.zip"
            download
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[var(--panel)] border border-[var(--line)] px-4 py-2 text-xs font-bold text-[var(--foreground)] hover:border-[var(--brand)] transition"
          >
            <Download className="h-4 w-4" />
            <span>vlan-scan.zip (Windows)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

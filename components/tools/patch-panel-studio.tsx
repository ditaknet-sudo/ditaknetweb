"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  CheckCircle2,
  Cpu,
  Download,
  Layers,
  Network,
  RotateCcw,
  Save,
  Server,
  Sparkles,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type PortMode = "uplink" | "active" | "poe" | "idle";

type PatchPort = {
  id: number;
  label: string;
  mode: PortMode;
  vlan: number;
  cableColor: string;
  switchPort: string;
};

const initialPorts: PatchPort[] = [
  { id: 1, label: "Core Switch Trunk A", mode: "uplink", vlan: 1, cableColor: "#3b82f6", switchPort: "SW01:Gi1/0/1" },
  { id: 2, label: "Firewall Gateway", mode: "uplink", vlan: 1, cableColor: "#3b82f6", switchPort: "SW01:Gi1/0/2" },
  { id: 3, label: "DitakNet Server Node 01", mode: "active", vlan: 10, cableColor: "#10b981", switchPort: "SW01:Gi1/0/3" },
  { id: 4, label: "Backup NAS (Synology)", mode: "active", vlan: 10, cableColor: "#10b981", switchPort: "SW01:Gi1/0/4" },
  { id: 5, label: "CCTV NVR 32-Channel", mode: "poe", vlan: 20, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/5" },
  { id: 6, label: "Camera 01: Front Gate", mode: "poe", vlan: 20, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/6" },
  { id: 7, label: "Camera 02: Lobby Main", mode: "poe", vlan: 20, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/7" },
  { id: 8, label: "Camera 03: Parking Zone", mode: "poe", vlan: 20, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/8" },
  { id: 9, label: "Wi-Fi AP Floor 1", mode: "poe", vlan: 30, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/9" },
  { id: 10, label: "Wi-Fi AP Floor 2", mode: "poe", vlan: 30, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/10" },
  { id: 11, label: "IT Workstation Bench", mode: "active", vlan: 40, cableColor: "#10b981", switchPort: "SW01:Gi1/0/11" },
  { id: 12, label: "Network Admin PC", mode: "active", vlan: 1, cableColor: "#10b981", switchPort: "SW01:Gi1/0/12" },
  { id: 13, label: "Hotel POS Terminal", mode: "active", vlan: 40, cableColor: "#8b5cf6", switchPort: "SW01:Gi1/0/13" },
  { id: 14, label: "VoIP PBX Grandstream", mode: "active", vlan: 50, cableColor: "#06b6d4", switchPort: "SW01:Gi1/0/14" },
  { id: 15, label: "Residential Gate Barrier", mode: "active", vlan: 40, cableColor: "#8b5cf6", switchPort: "SW01:Gi1/0/15" },
  { id: 16, label: "Smart Intercom Video", mode: "poe", vlan: 20, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/16" },
  { id: 17, label: "Staff Office Switch", mode: "active", vlan: 40, cableColor: "#10b981", switchPort: "SW01:Gi1/0/17" },
  { id: 18, label: "Guest Lounge AP", mode: "poe", vlan: 30, cableColor: "#f59e0b", switchPort: "SW01:Gi1/0/18" },
  { id: 19, label: "Spare Port A", mode: "idle", vlan: 1, cableColor: "#6b7280", switchPort: "Unconnected" },
  { id: 20, label: "Spare Port B", mode: "idle", vlan: 1, cableColor: "#6b7280", switchPort: "Unconnected" },
  { id: 21, label: "Reserved Fiber Optic", mode: "idle", vlan: 1, cableColor: "#6b7280", switchPort: "Reserved" },
  { id: 22, label: "Reserved CCTV Exp", mode: "idle", vlan: 20, cableColor: "#6b7280", switchPort: "Reserved" },
  { id: 23, label: "Maintenance Jack", mode: "idle", vlan: 1, cableColor: "#6b7280", switchPort: "Unconnected" },
  { id: 24, label: "Emergency Uplink", mode: "uplink", vlan: 1, cableColor: "#3b82f6", switchPort: "SW01:Gi1/0/24" }
];

export function PatchPanelStudio({ locale }: { locale: Locale }) {
  const [ports, setPorts] = useState<PatchPort[]>(initialPorts);
  const [selectedId, setSelectedId] = useState<number>(3);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedPort = ports.find((p) => p.id === selectedId) || ports[0];

  const text = {
    hy: {
      title: "Ինտերակտիվ Պաչ Պանել (Patch Panel Studio)",
      subtitle:
        "Հեղինակային ինտերակտիվ գործիք ՏՏ մասնագետների համար՝ սերվերային ռեկերի վիզուալ կառավարում, switch-to-panel պորտերի քարտեզագրում, PoE կարգավորում և մալուխների գունային հետագծում։",
      downloadWin: "Ներբեռնել Windows տարբերակը (.ZIP)",
      rackTitle: "1U 24-Port Cat6A Patch Panel Elevation",
      activeCount: "Ակտիվ պորտեր",
      poeCount: "PoE պորտեր",
      uplinkCount: "Uplink կապեր",
      idleCount: "Ազատ պորտեր",
      editorTitle: "Պորտի Խմբագրիչ (Port Inspector)",
      portName: "Սարքի / Կապուղու Անուն:",
      portMode: "Ռեժիմ / Կարգավիճակ:",
      vlanId: "VLAN ID:",
      cableColor: "Մալուխի Գույն:",
      switchPort: "Կապված Switch Պորտ:",
      saveButton: "Պահպանել Փոփոխությունը",
      exportJson: "Արտահանել JSON",
      exportCsv: "Արտահանել Պիտակներ (CSV)"
    },
    en: {
      title: "Interactive Patch Panel Studio & Rack Visualizer",
      subtitle:
        "Author-designed tool created by DitakNet for IT technicians: visual rack elevation, switch-to-panel mapping, PoE tracking, and color-coded cable run documentation.",
      downloadWin: "Download Windows Suite (.ZIP)",
      rackTitle: "1U 24-Port Cat6A Patch Panel Elevation",
      activeCount: "Active Ports",
      poeCount: "PoE Powered",
      uplinkCount: "Uplink Trunks",
      idleCount: "Spare / Idle",
      editorTitle: "Port Inspector & Mapping",
      portName: "Device / Destination Name:",
      portMode: "Port Mode / Status:",
      vlanId: "Assigned VLAN ID:",
      cableColor: "Cable Run Color:",
      switchPort: "Mapped Switch Port:",
      saveButton: "Save Port Settings",
      exportJson: "Export JSON",
      exportCsv: "Export Labels (CSV)"
    },
    ru: {
      title: "Интерактивная Патч-Панель (Patch Panel Studio)",
      subtitle:
        "Авторский инструмент для IT-специалистов: визуализация серверных стоек, маппинг switch-to-panel, контроль PoE и цветовая маркировка кабелей.",
      downloadWin: "Скачать версию для Windows (.ZIP)",
      rackTitle: "Визуализация 1U 24-портовой патч-панели Cat6A",
      activeCount: "Активных портов",
      poeCount: "PoE портов",
      uplinkCount: "Uplink каналов",
      idleCount: "Свободных портов",
      editorTitle: "Редактор и Инспектор Порта",
      portName: "Назначение / Имя устройства:",
      portMode: "Режим порта:",
      vlanId: "VLAN ID:",
      cableColor: "Цвет кабеля:",
      switchPort: "Порт коммутатора:",
      saveButton: "Сохранить изменения",
      exportJson: "Экспорт в JSON",
      exportCsv: "Экспорт маркировки (CSV)"
    }
  }[locale];

  const updateSelectedPort = (updates: Partial<PatchPort>) => {
    setPorts((prev) => prev.map((p) => (p.id === selectedId ? { ...p, ...updates } : p)));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(ports, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patch-panel-24p-mapping.json";
    link.click();
  };

  const handleExportCsv = () => {
    const csvHeader = "Port_ID,Device_Label,Mode,VLAN,Cable_Color,Switch_Port\n";
    const csvRows = ports
      .map((p) => `"${p.id}","${p.label}","${p.mode}","${p.vlan}","${p.cableColor}","${p.switchPort}"`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patch-panel-port-labels.csv";
    link.click();
  };

  const activeCount = ports.filter((p) => p.mode === "active").length;
  const poeCount = ports.filter((p) => p.mode === "poe").length;
  const uplinkCount = ports.filter((p) => p.mode === "uplink").length;
  const idleCount = ports.filter((p) => p.mode === "idle").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            <Layers className="h-4 w-4" />
            <span>DitakNet Rack Management</span>
          </div>
          <h1 className="mt-2 text-3xl font-black text-[var(--foreground)] md:text-4xl">{text.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{text.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/downloads/patch-panel.zip"
            download
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[var(--brand)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
          >
            <Download className="h-4 w-4" />
            <span>{text.downloadWin}</span>
          </a>
        </div>
      </div>

      {/* Rack Elevation Visualizer Card */}
      <Card className="overflow-hidden p-6 shadow-sm border-[var(--line)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[var(--brand)]" />
            <h2 className="text-base font-bold text-[var(--foreground)]">{text.rackTitle}</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active: {activeCount}
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> PoE: {poeCount}
            </span>
            <span className="flex items-center gap-1 text-blue-500">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Uplink: {uplinkCount}
            </span>
          </div>
        </div>

        {/* 24-Port Industrial Rack Unit Representation */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--invert-bg)] p-4 shadow-inner text-[var(--invert-text)]">
          <div className="grid grid-cols-12 gap-2 rounded-lg border border-[var(--invert-line)] bg-[var(--invert-panel)] p-3">
            {ports.map((port) => {
              const isSelected = selectedId === port.id;
              return (
                <button
                  key={port.id}
                  type="button"
                  onClick={() => setSelectedId(port.id)}
                  className={`group relative flex h-14 flex-col items-center justify-between rounded border transition ${
                    isSelected
                      ? "border-[var(--brand)] bg-[color-mix(in_srgb,var(--brand)_35%,transparent)] shadow-md scale-105"
                      : "border-[var(--invert-line)] bg-black/40 hover:border-white/50"
                  }`}
                >
                  <span className="text-[10px] font-mono leading-none text-[var(--invert-muted)] pt-1">
                    {port.id}
                  </span>

                  {/* RJ45 Port Socket Graphic */}
                  <div className="relative flex h-5 w-5 items-center justify-center rounded border border-[var(--invert-line)] bg-black/60">
                    <span
                      className="h-2 w-2 rounded-full transition-all"
                      style={{
                        backgroundColor: port.cableColor,
                        boxShadow: `0 0 6px ${port.cableColor}`
                      }}
                    />
                  </div>

                  <span className="text-[9px] font-mono leading-none text-[var(--invert-muted)] pb-1">
                    V{port.vlan}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--foreground)]">Selected:</span>
            <span className="font-mono text-[var(--brand)] font-bold">Port {selectedPort.id}</span>
            <span className="text-[var(--muted)]">— {selectedPort.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-bold hover:border-[var(--brand)]"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>{text.exportCsv}</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-bold hover:border-[var(--brand)]"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>{text.exportJson}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Port Inspector & Editor Form */}
      <Card className="p-6 shadow-sm border-[var(--line)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <h3 className="text-base font-bold text-[var(--foreground)]">{text.editorTitle}</h3>
          <span className="font-mono text-xs font-bold text-[var(--brand)]">PORT #{selectedPort.id}</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Label */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.portName}
            </label>
            <input
              type="text"
              value={selectedPort.label}
              onChange={(e) => updateSelectedPort({ label: e.target.value })}
              className="mt-1.5 h-10 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-semibold text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.portMode}
            </label>
            <select
              value={selectedPort.mode}
              onChange={(e) => {
                const mode = e.target.value as PortMode;
                const color =
                  mode === "poe"
                    ? "#f59e0b"
                    : mode === "uplink"
                    ? "#3b82f6"
                    : mode === "active"
                    ? "#10b981"
                    : "#6b7280";
                updateSelectedPort({ mode, cableColor: color });
              }}
              className="mt-1.5 h-10 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-semibold text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
            >
              <option value="active">Active (Data / Workstation / Server)</option>
              <option value="poe">PoE (CCTV Camera / Wi-Fi AP)</option>
              <option value="uplink">Uplink (Switch / Router Trunk)</option>
              <option value="idle">Idle / Reserved</option>
            </select>
          </div>

          {/* VLAN ID */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.vlanId}
            </label>
            <input
              type="number"
              value={selectedPort.vlan}
              onChange={(e) => updateSelectedPort({ vlan: parseInt(e.target.value) || 1 })}
              className="mt-1.5 h-10 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-mono font-semibold text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
            />
          </div>

          {/* Switch Port */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.switchPort}
            </label>
            <input
              type="text"
              value={selectedPort.switchPort}
              onChange={(e) => updateSelectedPort({ switchPort: e.target.value })}
              className="mt-1.5 h-10 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-mono font-semibold text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
            />
          </div>

          {/* Cable Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.cableColor}
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              {["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#6b7280"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateSelectedPort({ cableColor: c })}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    selectedPort.cableColor === c ? "border-white scale-110 shadow" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Success Indicator */}
          <div className="flex items-end">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Updated!</span>
              </span>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}

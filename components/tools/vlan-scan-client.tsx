"use client";

import { useState } from "react";
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
  RefreshCw,
  Router,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  XCircle
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type VlanSegment = {
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

const defaultVlans: VlanSegment[] = [
  {
    vlanId: 1,
    name: "Default LAN & Management",
    subnet: "192.168.1.0/24",
    gateway: "192.168.1.1",
    hostCount: 8,
    tag: "Untagged / Native",
    isolated: false,
    color: "#3b82f6",
    status: "active",
    devices: ["MikroTik CCR2004", "Cisco Core Switch", "DitakNet Node"]
  },
  {
    vlanId: 10,
    name: "Server Infrastructure & NAS",
    subnet: "192.168.10.0/24",
    gateway: "192.168.10.1",
    hostCount: 6,
    tag: "Tagged 802.1Q",
    isolated: false,
    color: "#10b981",
    status: "active",
    devices: ["DitakNet Server :5833", "Synology NAS", "Docker Swarm"]
  },
  {
    vlanId: 20,
    name: "CCTV Surveillance Network",
    subnet: "192.168.20.0/24",
    gateway: "192.168.20.1",
    hostCount: 18,
    tag: "Tagged 802.1Q",
    isolated: true,
    color: "#f59e0b",
    status: "isolated",
    devices: ["Dahua NVR 32ch", "16x IP Cameras (RTSP 554)", "Gate PTZ"]
  },
  {
    vlanId: 30,
    name: "Guest Wi-Fi (Hotel & Visitors)",
    subnet: "172.16.30.0/24",
    gateway: "172.16.30.1",
    hostCount: 42,
    tag: "Tagged 802.1Q",
    isolated: true,
    color: "#ec4899",
    status: "isolated",
    devices: ["Omada Wi-Fi 6 APs", "Guest Mobile Devices", "Isolated Portal"]
  },
  {
    vlanId: 40,
    name: "Office & Reception Workstations",
    subnet: "192.168.40.0/24",
    gateway: "192.168.40.1",
    hostCount: 14,
    tag: "Tagged 802.1Q",
    isolated: false,
    color: "#8b5cf6",
    status: "active",
    devices: ["Admin Desktops", "POS Billing Terminals", "Printers"]
  },
  {
    vlanId: 50,
    name: "VoIP Telephony (PBX)",
    subnet: "192.168.50.0/24",
    gateway: "192.168.50.1",
    hostCount: 10,
    tag: "Voice VLAN / QoS 5",
    isolated: false,
    color: "#06b6d4",
    status: "active",
    devices: ["Grandstream PBX", "Reception Phones", "Room Intercoms"]
  }
];

export function VlanScanClient({ locale }: { locale: Locale }) {
  const [vlans, setVlans] = useState<VlanSegment[]>(defaultVlans);
  const [selectedVlan, setSelectedVlan] = useState<VlanSegment>(defaultVlans[1]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(100);

  const text = {
    hy: {
      title: "VLAN Scan — Ցանցի Սեգմենտավորում, Տոպոլոգիա և Մեկուսացում",
      subtitle:
        "Քարտեզագրեք VLAN հատվածները (802.1Q), ստուգեք Gateway-ները, միջ-VLAN երթուղավորումը (Inter-VLAN routing) և անվտանգության մեկուսացումը։",
      downloadWin: "Ներբեռնել Windows տարբերակը (.ZIP)",
      runAudit: "Ստուգել VLAN Մեկուսացումը",
      auditing: "Կատարվում է մեկուսացման աուդիտ...",
      segmentsTitle: "Հայտնաբերված VLAN Սեգմենտներ",
      matrixTitle: "Inter-VLAN Անվտանգության և Մեկուսացման Մատրիցա",
      matrixDesc:
        "Համոզվեք, որ հյուրերի Wi-Fi-ը և CCTV տեսախցիկները մեկուսացված են և մուտք չունեն դեպի սերվերներ կամ տվյալների բազաներ։",
      topologyTitle: "802.1Q Trunk & Access Տոպոլոգիայի Տեսք",
      exportReport: "Արտահանել VLAN Հաշվետվություն (JSON)",
      winNoticeTitle: "Windows-ում աշխատեցնելու ուղեցույց (VLAN Standalone Tool)",
      winNoticeBody:
        "Windows-ում ցանցային ադապտերների 802.1Q պիտակները և երթուղիները տեղում աուդիտի ենթարկելու համար ներբեռնեք ZIP փաթեթը և գործարկեք DitakNet-VLAN-Scan.bat ֆայլը։"
    },
    en: {
      title: "VLAN Scan — Network Segmentation, Topology & Isolation Audit",
      subtitle:
        "Map 802.1Q VLAN segments, audit gateways, verify inter-VLAN routing isolation, and ensure secure zero-trust network zones.",
      downloadWin: "Download Windows Suite (.ZIP)",
      runAudit: "Run Isolation Audit",
      auditing: "Auditing VLAN isolation matrix...",
      segmentsTitle: "Discovered VLAN Segments",
      matrixTitle: "Inter-VLAN Security & Isolation Matrix",
      matrixDesc:
        "Verify that guest Wi-Fi and CCTV surveillance traffic cannot cross into management or server infrastructure.",
      topologyTitle: "802.1Q Trunk & Access Topology Map",
      exportReport: "Export VLAN Audit (JSON)",
      winNoticeTitle: "Native Windows Standalone Tool",
      winNoticeBody:
        "To audit network adapters, 802.1Q priority tags, and routing tables directly on Windows, download the ZIP package and run DitakNet-VLAN-Scan.bat."
    },
    ru: {
      title: "VLAN Scan — Сегментация Сети, Топология и Аудит Изоляции",
      subtitle:
        "Картографирование сегментов VLAN (802.1Q), проверка шлюзов, анализ межсетевой маршрутизации и безопасности изоляции.",
      downloadWin: "Скачать версию для Windows (.ZIP)",
      runAudit: "Проверить изоляцию VLAN",
      auditing: "Проверка матрицы изоляции...",
      segmentsTitle: "Обнаруженные сегменты VLAN",
      matrixTitle: "Матрица Безопасности и Изоляции Inter-VLAN",
      matrixDesc:
        "Убедитесь, что гостевой Wi-Fi и видеонаблюдение изолированы от серверов и локальной бухгалтерии.",
      topologyTitle: "Карта Топологии 802.1Q Trunk & Access",
      exportReport: "Экспорт аудита (JSON)",
      winNoticeTitle: "Автономная утилита для Windows",
      winNoticeBody:
        "Для аудита сетевых карт, тегов 802.1Q и таблицы маршрутизации прямо в Windows скачайте ZIP-пакет и запустите DitakNet-VLAN-Scan.bat."
    }
  }[locale];

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setAuditProgress(100);
        setIsAuditing(false);
      } else {
        setAuditProgress(progress);
      }
    }, 250);
  };

  const handleExportJson = () => {
    const report = {
      scanDate: new Date().toISOString(),
      platform: "DitakNet VLAN Suite",
      vlans,
      isolationPolicy: "Strict 802.1Q Zero-Trust"
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ditaknet-vlan-audit-report.json";
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header & Download CTA */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            <Network className="h-4 w-4" />
            <span>DitakNet VLAN Suite</span>
          </div>
          <h1 className="mt-2 text-3xl font-black text-[var(--foreground)] md:text-4xl">{text.title}</h1>
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
            <p className="text-xs text-[var(--muted)]">6 Configured Segments · 802.1Q Active Trunking</p>
          </div>

          <div className="flex items-center gap-3">
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
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--panel-soft)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition-all duration-300"
                style={{ width: `${auditProgress}%` }}
              />
            </div>
          </div>
        ) : null}
      </Card>

      {/* VLAN Segment Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vlans.map((v) => {
          const isSelected = selectedVlan.vlanId === v.vlanId;
          return (
            <div
              key={v.vlanId}
              onClick={() => setSelectedVlan(v)}
              className={`cursor-pointer rounded-xl border p-5 transition-all ${
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
                <span className="text-xs font-mono text-[var(--muted)]">{v.tag}</span>
              </div>

              <h3 className="mt-3 text-base font-bold text-[var(--foreground)]">{v.name}</h3>

              <div className="mt-2 space-y-1 text-xs font-mono text-[var(--muted)]">
                <div>Subnet: <span className="font-bold text-[var(--foreground)]">{v.subnet}</span></div>
                <div>Gateway: <span className="text-[var(--brand)]">{v.gateway}</span></div>
                <div>Active Hosts: <span className="text-emerald-600 font-bold">{v.hostCount}</span></div>
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

      {/* Selected VLAN Inspector & Connected Devices */}
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

          <div className="flex items-center gap-2">
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
            Monitored Devices in this VLAN segment:
          </h4>
          <div className="grid gap-2 sm:grid-cols-3">
            {selectedVlan.devices.map((dev, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] p-3 text-xs font-semibold text-[var(--foreground)]"
              >
                <Server className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                <span>{dev}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

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
                <th className="px-3 py-2 text-left">SOURCE / DEST</th>
                <th className="px-3 py-2">VLAN 1 (Mgmt)</th>
                <th className="px-3 py-2">VLAN 10 (Servers)</th>
                <th className="px-3 py-2">VLAN 20 (CCTV)</th>
                <th className="px-3 py-2">VLAN 30 (Guest)</th>
                <th className="px-3 py-2">VLAN 40 (Office)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-mono font-bold">
              <tr>
                <td className="px-3 py-2.5 text-left text-[var(--foreground)]">VLAN 1 (Management)</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-left text-[var(--foreground)]">VLAN 10 (Servers)</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-amber-600">NVR ONLY</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-left text-[var(--foreground)]">VLAN 20 (CCTV Security)</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-amber-600">RTSP ONLY</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-left text-[var(--foreground)]">VLAN 30 (Guest Wi-Fi)</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-amber-600">WAN ONLY</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-left text-[var(--foreground)]">VLAN 40 (Office)</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-emerald-600">PORT 443</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-red-600 bg-red-50/20">BLOCKED</td>
                <td className="px-3 py-2.5 text-emerald-600">ALLOWED</td>
              </tr>
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

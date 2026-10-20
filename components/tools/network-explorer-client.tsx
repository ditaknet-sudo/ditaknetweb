"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  Filter,
  Globe,
  HardDrive,
  Laptop,
  Layers,
  Network,
  Play,
  Radar,
  RefreshCw,
  Router,
  Search,
  Server,
  Shield,
  Square,
  Terminal,
  Wifi,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type DeviceCategory = "all" | "router" | "cctv" | "server" | "workstation" | "ap";

type DiscoveredHost = {
  ip: string;
  hostname: string;
  mac: string;
  vendor: string;
  latency: number;
  openPorts: number[];
  category: DeviceCategory;
  hops: number;
  osGuess: string;
};

const initialHosts: DiscoveredHost[] = [
  {
    ip: "192.168.1.1",
    hostname: "core-gw.lan (MikroTik CCR2004-16G-2S+)",
    mac: "D8:07:B6:22:A4:10",
    vendor: "MikroTik RouterOS 7.14",
    latency: 0.7,
    openPorts: [80, 443, 22, 8291],
    category: "router",
    hops: 1,
    osGuess: "RouterOS v7"
  },
  {
    ip: "192.168.1.2",
    hostname: "sw-dist-24g.lan (Cisco Catalyst 2960)",
    mac: "00:1A:2B:3C:4D:5E",
    vendor: "Cisco Systems",
    latency: 0.9,
    openPorts: [80, 443, 22],
    category: "router",
    hops: 1,
    osGuess: "Cisco IOS"
  },
  {
    ip: "192.168.1.10",
    hostname: "ditaknet-node01.lan (SmartTech Server)",
    mac: "80:86:F2:11:90:AB",
    vendor: "Intel / Supermicro",
    latency: 1.1,
    openPorts: [80, 443, 22, 5833, 8080],
    category: "server",
    hops: 1,
    osGuess: "Ubuntu Linux 24.04 LTS"
  },
  {
    ip: "192.168.1.15",
    hostname: "synology-nas.lan (Synology DS920+)",
    mac: "00:11:32:44:88:CC",
    vendor: "Synology Inc.",
    latency: 1.3,
    openPorts: [5000, 5001, 22, 445],
    category: "server",
    hops: 1,
    osGuess: "Synology DSM 7.2"
  },
  {
    ip: "192.168.1.50",
    hostname: "cctv-nvr-main.lan (Dahua 32-Channel NVR)",
    mac: "BC:5F:F4:77:12:34",
    vendor: "Dahua Technology",
    latency: 1.4,
    openPorts: [80, 554, 37777],
    category: "cctv",
    hops: 1,
    osGuess: "Embedded Linux"
  },
  {
    ip: "192.168.1.51",
    hostname: "cam-gate-4k.lan (IP Camera Dome)",
    mac: "BC:5F:F4:88:23:45",
    vendor: "Dahua Technology",
    latency: 1.7,
    openPorts: [80, 554],
    category: "cctv",
    hops: 1,
    osGuess: "IP Camera Firmware"
  },
  {
    ip: "192.168.1.70",
    hostname: "unifi-u6-pro-lobby.lan",
    mac: "74:83:C2:55:66:77",
    vendor: "Ubiquiti Networks",
    latency: 1.5,
    openPorts: [80, 443, 22],
    category: "ap",
    hops: 1,
    osGuess: "UniFi OS"
  },
  {
    ip: "192.168.1.100",
    hostname: "it-engineer-bench.lan",
    mac: "98:FA:9B:AA:BB:CC",
    vendor: "Dell Inc.",
    latency: 2.1,
    openPorts: [3389, 445],
    category: "workstation",
    hops: 1,
    osGuess: "Windows 11 Pro 64-bit"
  },
  {
    ip: "192.168.1.105",
    hostname: "hotel-pos-station01.lan",
    mac: "F4:8E:38:11:22:33",
    vendor: "HP Inc.",
    latency: 1.9,
    openPorts: [80, 443, 9100],
    category: "workstation",
    hops: 1,
    osGuess: "Windows 10 IoT"
  }
];

const copy = {
  en: {
    badge: "DitakNet IT Toolkit & Diagnostics",
    title: "Network Explorer — Deep Subnet & Diagnostics Suite",
    desc: "Comprehensive network exploration for IT professionals: active host discovery, port probing, latency spikes, vendor identification, and trace analysis.",
    targetSubnet: "Subnet Target",
    probeMode: "Diagnostic Mode",
    quickSweep: "Fast Ping Sweep",
    deepAudit: "Deep Audit (All Ports + OS)",
    startScan: "Start Network Discovery",
    scanning: "Exploring Subnet...",
    exportCsv: "Export CSV",
    exportJson: "Export JSON",
    downloadWin: "Download Windows ZIP",
    searchPlaceholder: "Search by IP, hostname, vendor, or port...",
    stats: {
      totalHosts: "Active Hosts",
      avgLatency: "Avg Latency",
      openPorts: "Open Services",
      cctvDevices: "CCTV & AP Nodes"
    },
    tabs: {
      all: "All Hosts",
      router: "Routers & Switches",
      cctv: "CCTV & Cameras",
      server: "Servers & Storage",
      ap: "Wi-Fi APs",
      workstation: "Workstations & POS"
    },
    cols: {
      host: "Host / IP",
      mac: "MAC / Vendor",
      latency: "Latency & Hops",
      ports: "Open Services",
      os: "System Guess"
    },
    winBadge: "Native Windows CLI & PowerShell script included. No installation required."
  },
  hy: {
    badge: "DitakNet ՏՏ Գործիքակազմ և Դիագնոստիկա",
    title: "Ցանցի Ուսումնասիրություն (Network Explorer)",
    desc: "Խորքային ցանցային հետազոտություն ՏՏ մասնագետների համար. ակտիվ սարքերի հայտնաբերում, բաց պորտերի ստուգում, latency-ի անալիզ, vendor-ների նույնականացում և hops հետագծում։",
    targetSubnet: "Հետազոտվող Ենթացանց",
    probeMode: "Ստուգման Ռեժիմ",
    quickSweep: "Արագ Ping Sweep",
    deepAudit: "Խորքային Ստուգում (Բոլոր Պորտերը + OS)",
    startScan: "Սկսել Ցանցի Ուսումնասիրությունը",
    scanning: "Ուսումնասիրվում է...",
    exportCsv: "Արտահանել CSV",
    exportJson: "Արտահանել JSON",
    downloadWin: "Ներբեռնել Windows ZIP",
    searchPlaceholder: "Փնտրել ըստ IP-ի, անվանման, vendor-ի կամ պորտի...",
    stats: {
      totalHosts: "Ակտիվ Սարքեր",
      avgLatency: "Միջին Լատենտություն",
      openPorts: "Բաց Ծառայություններ",
      cctvDevices: "CCTV և Wi-Fi Սարքեր"
    },
    tabs: {
      all: "Բոլոր Սարքերը",
      router: "Ռոուտերներ և Սվիչներ",
      cctv: "Տեսախցիկներ (CCTV)",
      server: "Սերվերներ և NAS",
      ap: "Wi-Fi Կետեր (AP)",
      workstation: "Աշխատակայաններ և POS"
    },
    cols: {
      host: "Հոսթ / IP",
      mac: "MAC / Արտադրող",
      latency: "Արագություն (Latency) & Hops",
      ports: "Բաց Պորտեր / Ծառայություններ",
      os: "ՕՀ Նույնականացում"
    },
    winBadge: "Ներառում է Windows CLI & PowerShell ավտոմատ սկրիպտ։ Ինստալացիա չի պահանջվում։"
  },
  ru: {
    badge: "DitakNet IT Набор и Диагностика",
    title: "Исследование Сети (Network Explorer)",
    desc: "Глубокое исследование сети для IT-специалистов: обнаружение активных хостов, проверка открытых портов, задержки, производители оборудования и анализ маршрута.",
    targetSubnet: "Целевая подсеть",
    probeMode: "Режим диагностики",
    quickSweep: "Быстрый Ping Sweep",
    deepAudit: "Глубокий аудит (Все порты + ОС)",
    startScan: "Начать исследование сети",
    scanning: "Сканирование подсети...",
    exportCsv: "Экспорт CSV",
    exportJson: "Экспорт JSON",
    downloadWin: "Скачать Windows ZIP",
    searchPlaceholder: "Поиск по IP, хосту, вендору или порту...",
    stats: {
      totalHosts: "Активных хостов",
      avgLatency: "Средняя задержка",
      openPorts: "Открытых служб",
      cctvDevices: "CCTV и Wi-Fi узлы"
    },
    tabs: {
      all: "Все узлы",
      router: "Маршрутизаторы / Свитчи",
      cctv: "Камеры и NVR",
      server: "Серверы и NAS",
      ap: "Wi-Fi Точки (AP)",
      workstation: "Рабочие места и POS"
    },
    cols: {
      host: "Хост / IP",
      mac: "MAC / Производитель",
      latency: "Задержка & Hops",
      ports: "Открытые порты / Сервисы",
      os: "Определение ОС"
    },
    winBadge: "Включает автономный скрипт для Windows (PowerShell & BAT). Установка не требуется."
  }
};

export function NetworkExplorerClient({ locale }: { locale: Locale }) {
  const t = copy[locale] || copy.en;

  const [subnet, setSubnet] = useState("192.168.1.0/24");
  const [probeMode, setProbeMode] = useState<"quick" | "deep">("quick");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [activeTab, setActiveTab] = useState<DeviceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hosts, setHosts] = useState<DiscoveredHost[]>(initialHosts);

  const runScan = () => {
    setIsScanning(true);
    setScanProgress(5);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanProgress(100);
            // Add or refresh hosts with jitter
            setHosts((curr) =>
              curr.map((h) => ({
                ...h,
                latency: Number((h.latency + (Math.random() * 0.4 - 0.2)).toFixed(1))
              }))
            );
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 180);
  };

  const filteredHosts = useMemo(() => {
    return hosts.filter((h) => {
      const matchTab = activeTab === "all" || h.category === activeTab;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchTab;

      const matchQuery =
        h.ip.includes(q) ||
        h.hostname.toLowerCase().includes(q) ||
        h.vendor.toLowerCase().includes(q) ||
        h.mac.toLowerCase().includes(q) ||
        h.osGuess.toLowerCase().includes(q) ||
        h.openPorts.some((p) => p.toString().includes(q));

      return matchTab && matchQuery;
    });
  }, [hosts, activeTab, searchQuery]);

  const avgLatency = useMemo(() => {
    if (!hosts.length) return 0;
    const sum = hosts.reduce((acc, h) => acc + h.latency, 0);
    return (sum / hosts.length).toFixed(1);
  }, [hosts]);

  const totalOpenPorts = useMemo(() => {
    return hosts.reduce((acc, h) => acc + h.openPorts.length, 0);
  }, [hosts]);

  const cctvCount = useMemo(() => {
    return hosts.filter((h) => h.category === "cctv" || h.category === "ap").length;
  }, [hosts]);

  const exportCsv = () => {
    const headers = ["IP", "Hostname", "MAC", "Vendor", "Latency_ms", "OpenPorts", "Category", "Hops", "OSGuess"];
    const rows = filteredHosts.map((h) => [
      h.ip,
      `"${h.hostname}"`,
      h.mac,
      `"${h.vendor}"`,
      h.latency,
      `"${h.openPorts.join(";")}"`,
      h.category,
      h.hops,
      `"${h.osGuess}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ditaknet-network-explorer-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredHosts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ditaknet-network-explorer-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Radar className="h-3.5 w-3.5 animate-spin-slow" />
                {t.badge}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                PWA / Windows Native
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t.title}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {t.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/downloads/network-explorer.zip"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              {t.downloadWin}
            </a>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {t.exportCsv}
            </button>
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {t.exportJson}
            </button>
          </div>
        </div>

        {/* Windows Notice Bar */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          <span>{t.winBadge}</span>
        </div>
      </Card>

      {/* Control Bar: Subnet selector, scan triggers */}
      <Card className="border-border/80 bg-card/60 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t.targetSubnet}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={subnet}
                  onChange={(e) => setSubnet(e.target.value)}
                  className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-44"
                />
                <button
                  type="button"
                  onClick={() => setSubnet("192.168.1.0/24")}
                  className="rounded bg-muted/60 px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  192.168.1.0
                </button>
                <button
                  type="button"
                  onClick={() => setSubnet("10.0.0.0/24")}
                  className="rounded bg-muted/60 px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  10.0.0.0
                </button>
                <button
                  type="button"
                  onClick={() => setSubnet("172.16.10.0/24")}
                  className="rounded bg-muted/60 px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  172.16.10.0
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t.probeMode}
              </label>
              <div className="inline-flex rounded-lg border border-border/80 bg-background p-0.5 text-xs">
                <button
                  onClick={() => setProbeMode("quick")}
                  className={`rounded-md px-3 py-1 transition-colors ${
                    probeMode === "quick"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.quickSweep}
                </button>
                <button
                  onClick={() => setProbeMode("deep")}
                  className={`rounded-md px-3 py-1 transition-colors ${
                    probeMode === "deep"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.deepAudit}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runScan}
              disabled={isScanning}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                isScanning
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.scanning} {scanProgress}%
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  {t.startScan}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan progress bar */}
        {isScanning && (
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.totalHosts}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{hosts.length}</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-primary">
              <Network className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.avgLatency}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{avgLatency} ms</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.openPorts}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{totalOpenPorts}</p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-blue-400">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.cctvDevices}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{cctvCount}</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/80 pb-2 sm:border-0 sm:pb-0">
          {(["all", "router", "cctv", "server", "ap", "workstation"] as DeviceCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-background/80 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Hosts Table Card */}
      <Card className="overflow-hidden border-border/80 bg-card/70 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t.cols.host}</th>
                <th className="px-4 py-3">{t.cols.mac}</th>
                <th className="px-4 py-3">{t.cols.latency}</th>
                <th className="px-4 py-3">{t.cols.ports}</th>
                <th className="px-4 py-3">{t.cols.os}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredHosts.map((host) => (
                <tr key={host.ip} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg border border-border/80 bg-muted/60 p-1.5 text-primary">
                        {host.category === "router" && <Router className="h-4 w-4" />}
                        {host.category === "server" && <Server className="h-4 w-4" />}
                        {host.category === "cctv" && <Shield className="h-4 w-4 text-amber-400" />}
                        {host.category === "ap" && <Wifi className="h-4 w-4 text-cyan-400" />}
                        {host.category === "workstation" && <Laptop className="h-4 w-4" />}
                      </div>
                      <div>
                        <span className="font-mono font-semibold text-foreground">{host.ip}</span>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {host.hostname}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-muted-foreground">{host.mac}</span>
                    <div className="text-[11px] font-medium text-foreground">{host.vendor}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          host.latency < 1.0
                            ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            : host.latency < 2.0
                            ? "bg-blue-400"
                            : "bg-amber-400"
                        }`}
                      />
                      <span className="font-mono font-semibold text-foreground">{host.latency} ms</span>
                      <span className="text-[11px] text-muted-foreground">({host.hops} hop)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {host.openPorts.map((p) => (
                        <span
                          key={p}
                          className="rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-primary"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="rounded bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground">
                      {host.osGuess}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

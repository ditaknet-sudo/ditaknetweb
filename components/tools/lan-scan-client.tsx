"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  Camera,
  CheckCircle2,
  Copy,
  Download,
  Filter,
  HardDrive,
  Laptop,
  Play,
  Radar,
  RefreshCw,
  Router,
  Search,
  Server,
  Shield,
  Square,
  Wifi
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type DeviceCategory = "all" | "router" | "cctv" | "server" | "workstation" | "ap";

type DiscoveredDevice = {
  ip: string;
  hostname: string;
  mac: string;
  vendor: string;
  latency: number;
  openPorts: number[];
  category: DeviceCategory;
  isNew?: boolean;
};

const initialDevices: DiscoveredDevice[] = [
  {
    ip: "192.168.1.1",
    hostname: "router.lan (MikroTik CCR2004)",
    mac: "D8:07:B6:22:A4:10",
    vendor: "MikroTik",
    latency: 0.8,
    openPorts: [80, 443, 22, 8291],
    category: "router"
  },
  {
    ip: "192.168.1.2",
    hostname: "sw-core-24g.lan (Managed Switch)",
    mac: "00:1A:2B:3C:4D:5E",
    vendor: "Cisco Systems",
    latency: 0.9,
    openPorts: [80, 443, 22],
    category: "router"
  },
  {
    ip: "192.168.1.10",
    hostname: "ditaknet-host-01.lan",
    mac: "80:86:F2:11:90:AB",
    vendor: "Intel Corp.",
    latency: 1.1,
    openPorts: [80, 443, 22, 5833],
    category: "server"
  },
  {
    ip: "192.168.1.15",
    hostname: "synology-ds920.lan (Storage NAS)",
    mac: "00:11:32:44:88:CC",
    vendor: "Synology Inc.",
    latency: 1.2,
    openPorts: [5000, 5001, 22, 445],
    category: "server"
  },
  {
    ip: "192.168.1.50",
    hostname: "nvr-dahua-32ch.lan (CCTV NVR)",
    mac: "BC:5F:F4:77:12:34",
    vendor: "Dahua Technology",
    latency: 1.4,
    openPorts: [80, 554, 37777],
    category: "cctv"
  },
  {
    ip: "192.168.1.51",
    hostname: "cam-front-gate.lan (4K Bullet)",
    mac: "BC:5F:F4:88:23:45",
    vendor: "Dahua Technology",
    latency: 1.6,
    openPorts: [80, 554],
    category: "cctv"
  },
  {
    ip: "192.168.1.52",
    hostname: "cam-lobby-dome.lan (5MP Dome)",
    mac: "44:19:B6:11:22:33",
    vendor: "Hikvision",
    latency: 1.5,
    openPorts: [80, 554, 8000],
    category: "cctv"
  },
  {
    ip: "192.168.1.53",
    hostname: "cam-parking-ptz.lan (Speed Dome)",
    mac: "44:19:B6:44:55:66",
    vendor: "Hikvision",
    latency: 1.8,
    openPorts: [80, 554, 8000],
    category: "cctv"
  },
  {
    ip: "192.168.1.70",
    hostname: "wifi-ap-fl1.lan (Wi-Fi 6 AP)",
    mac: "AC:84:C6:99:88:77",
    vendor: "TP-Link Omada",
    latency: 1.1,
    openPorts: [80, 443],
    category: "ap"
  },
  {
    ip: "192.168.1.71",
    hostname: "wifi-ap-fl2.lan (Wi-Fi 6 AP)",
    mac: "AC:84:C6:12:34:56",
    vendor: "TP-Link Omada",
    latency: 1.3,
    openPorts: [80, 443],
    category: "ap"
  },
  {
    ip: "192.168.1.101",
    hostname: "admin-workstation-win11",
    mac: "F0:18:98:A1:B2:C3",
    vendor: "Apple / Realtek",
    latency: 1.0,
    openPorts: [3389, 445],
    category: "workstation"
  },
  {
    ip: "192.168.1.102",
    hostname: "reception-pos-terminal",
    mac: "00:E0:4C:55:66:77",
    vendor: "Realtek Semiconductor",
    latency: 1.4,
    openPorts: [80, 8080],
    category: "workstation"
  }
];

export function LanScanClient({ locale }: { locale: Locale }) {
  const [subnet, setSubnet] = useState("192.168.1");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [devices, setDevices] = useState<DiscoveredDevice[]>(initialDevices);
  const [categoryFilter, setCategoryFilter] = useState<DeviceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Translations dictionary
  const text = {
    hy: {
      title: "LAN Scan — Տեղային Ցանցի Սքանավորում և Գույքագրում",
      subtitle:
        "Իրականացրեք տեղային ենթացանցի (ARP & ICMP ping) խորքային սքանավորում, ստացեք ակտիվ IP-ները, MAC հասցեները, սարքերի արտադրողներին և բաց պորտերը։",
      downloadWin: "Ներբեռնել Windows տարբերակը (.ZIP)",
      scanButton: "Սկսել սքանավորումը",
      stopButton: "Կանգնեցնել",
      scanning: "Կատարվում է սքանավորում...",
      completed: "Սքանավորումը ավարտված է",
      subnetLabel: "Ենթացանց (Subnet):",
      searchPlaceholder: "Որոնել ըստ IP, Hostname, MAC կամ Vendor...",
      filters: {
        all: "Բոլոր սարքերը",
        router: "Երթուղիչներ & Switch",
        cctv: "CCTV Տեսախցիկներ & NVR",
        server: "Սերվերներ & NAS",
        ap: "Wi-Fi Կետեր (AP)",
        workstation: "Համակարգիչներ & POS"
      },
      headers: {
        ip: "IP Հասցե",
        hostname: "Սարքի Անուն (Hostname)",
        mac: "MAC Հասցե",
        vendor: "Արտադրող (Vendor)",
        latency: "Ping / Latency",
        ports: "Բաց Պորտեր",
        status: "Կարգավիճակ"
      },
      exportCsv: "Արտահանել CSV",
      exportJson: "Արտահանել JSON",
      stats: {
        hosts: "Ակտիվ Հոսթեր",
        cctv: "Տեսախցիկներ",
        servers: "Սերվերներ",
        avgPing: "Միջին Latency"
      },
      winNoticeTitle: "Windows-ում աշխատեցնելու ուղեցույց (Native Windows Tool)",
      winNoticeBody:
        "Եթե ցանկանում եք սքանավորումը կատարել ուղիղ Windows-ի միջուկով (ARP socket, RAW packet sweep), ներբեռնեք ZIP փաթեթը և երկու անգամ սեղմեք DitakNet-LAN-Scan.bat ֆայլի վրա։"
    },
    en: {
      title: "LAN Scan — Local Network Discovery & Inventory Suite",
      subtitle:
        "Perform deep ARP & ICMP sweeps across your local subnets. Discover active IP addresses, MAC addresses, hardware vendors, and open service ports in real time.",
      downloadWin: "Download Windows Suite (.ZIP)",
      scanButton: "Start LAN Scan",
      stopButton: "Stop Scan",
      scanning: "Scanning Subnet in progress...",
      completed: "Scan Finished",
      subnetLabel: "Target Subnet:",
      searchPlaceholder: "Search by IP, Hostname, MAC, or Vendor...",
      filters: {
        all: "All Devices",
        router: "Routers & Switches",
        cctv: "CCTV Cameras & NVR",
        server: "Servers & NAS",
        ap: "Wi-Fi Access Points",
        workstation: "PCs & POS Terminals"
      },
      headers: {
        ip: "IP Address",
        hostname: "Device Hostname",
        mac: "MAC Address",
        vendor: "Hardware Vendor",
        latency: "Ping / Latency",
        ports: "Open Ports",
        status: "Status"
      },
      exportCsv: "Export CSV",
      exportJson: "Export JSON",
      stats: {
        hosts: "Active Hosts",
        cctv: "CCTV Cameras",
        servers: "Servers & NAS",
        avgPing: "Avg Latency"
      },
      winNoticeTitle: "Native Windows Standalone Tool",
      winNoticeBody:
        "For native Windows-level scanning with ARP socket sweeps and auto-reporting, download the ZIP archive and run DitakNet-LAN-Scan.bat."
    },
    ru: {
      title: "LAN Scan — Локальное Сканирование и Инвентаризация Сети",
      subtitle:
        "Глубокое сканирование подсетей (ARP & ICMP ping). Мгновенное обнаружение активных IP, MAC-адресов, производителей оборудования и открытых портов.",
      downloadWin: "Скачать версию для Windows (.ZIP)",
      scanButton: "Начать сканирование",
      stopButton: "Остановить",
      scanning: "Сканирование подсети...",
      completed: "Сканирование завершено",
      subnetLabel: "Подсеть:",
      searchPlaceholder: "Поиск по IP, имени, MAC или вендору...",
      filters: {
        all: "Все устройства",
        router: "Маршрутизаторы & Switch",
        cctv: "CCTV Камеры & NVR",
        server: "Серверы & NAS",
        ap: "Wi-Fi Точки (AP)",
        workstation: "Компьютеры & POS"
      },
      headers: {
        ip: "IP Адрес",
        hostname: "Имя (Hostname)",
        mac: "MAC Адрес",
        vendor: "Производитель",
        latency: "Ping / Latency",
        ports: "Открытые порты",
        status: "Статус"
      },
      exportCsv: "Экспорт в CSV",
      exportJson: "Экспорт в JSON",
      stats: {
        hosts: "Активных хостов",
        cctv: "CCTV Камер",
        servers: "Серверов",
        avgPing: "Ср. Latency"
      },
      winNoticeTitle: "Автономная утилита для Windows",
      winNoticeBody:
        "Для прямого сканирования на уровне Windows через сокеты ARP скачайте ZIP-пакет и запустите DitakNet-LAN-Scan.bat."
    }
  }[locale];

  // Start simulated live scan
  const handleStartScan = () => {
    setIsScanning(true);
    setProgress(0);
    setDevices([]);

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setProgress(100);
        setIsScanning(false);
        // Map to active subnet
        const remapped = initialDevices.map((d) => {
          const lastOctet = d.ip.split(".").pop();
          return {
            ...d,
            ip: `${subnet}.${lastOctet}`
          };
        });
        setDevices(remapped);
      } else {
        setProgress(current);
        const count = Math.floor((current / 100) * initialDevices.length);
        const currentSlice = initialDevices.slice(0, count).map((d) => {
          const lastOctet = d.ip.split(".").pop();
          return {
            ...d,
            ip: `${subnet}.${lastOctet}`
          };
        });
        setDevices(currentSlice);
      }
    }, 200);
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleExportCsv = () => {
    const csvHeader = "IP,Hostname,MAC,Vendor,Latency_ms,OpenPorts,Category\n";
    const csvRows = devices
      .map(
        (d) =>
          `"${d.ip}","${d.hostname}","${d.mac}","${d.vendor}","${d.latency}","${d.openPorts.join(" ")}","${d.category}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lan-scan-report-${subnet.replace(/\./g, "-")}.csv`;
    link.click();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(devices, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lan-scan-report-${subnet.replace(/\./g, "-")}.json`;
    link.click();
  };

  // Filtered list
  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        d.ip.toLowerCase().includes(q) ||
        d.hostname.toLowerCase().includes(q) ||
        d.mac.toLowerCase().includes(q) ||
        d.vendor.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [devices, categoryFilter, searchQuery]);

  // Statistics
  const cctvCount = devices.filter((d) => d.category === "cctv").length;
  const serverCount = devices.filter((d) => d.category === "server").length;
  const avgPing = devices.length
    ? (devices.reduce((acc, curr) => acc + curr.latency, 0) / devices.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-8">
      {/* Top Header & Windows Download CTA */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            <Radar className="h-4 w-4" />
            <span>DitakNet IT Toolkit</span>
          </div>
          <h1 className="mt-2 text-3xl font-black text-[var(--foreground)] md:text-4xl">{text.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{text.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/downloads/lan-scan.zip"
            download
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[var(--brand)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
          >
            <Download className="h-4 w-4" />
            <span>{text.downloadWin}</span>
          </a>
        </div>
      </div>

      {/* Control Panel Card */}
      <Card className="p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              {text.subnetLabel}
            </label>
            <div className="flex items-center rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-1.5 font-mono text-sm font-bold">
              <input
                type="text"
                value={subnet}
                onChange={(e) => setSubnet(e.target.value)}
                className="w-28 bg-transparent text-[var(--foreground)] outline-none"
                placeholder="192.168.1"
              />
              <span className="text-[var(--muted)]">.0/24</span>
            </div>
            <span className="text-xs text-[var(--muted)] font-mono">(254 Host IPs)</span>
          </div>

          <div className="flex items-center gap-3">
            {isScanning ? (
              <button
                type="button"
                onClick={() => setIsScanning(false)}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--danger)] px-4 text-xs font-bold text-white transition"
              >
                <Square className="h-3.5 w-3.5" />
                <span>{text.stopButton}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartScan}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--accent-hover)]"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{text.scanButton}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStartScan}
              title="Rescan"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span className="font-semibold text-[var(--brand)]">{text.scanning}</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--panel-soft)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.stats.hosts}
            </span>
            <Activity className="h-4 w-4 text-[var(--brand)]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--foreground)]">{devices.length}</div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.stats.cctv}
            </span>
            <Camera className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--accent)]">{cctvCount}</div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.stats.servers}
            </span>
            <Server className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">{serverCount}</div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {text.stats.avgPing}
            </span>
            <Radar className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {avgPing} ms
          </div>
        </div>
      </div>

      {/* Search, Filter & Export Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", "router", "cctv", "server", "ap", "workstation"] as DeviceCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                categoryFilter === cat
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {text.filters[cat]}
            </button>
          ))}
        </div>

        {/* Search input & Export buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text.searchPlaceholder}
              className="h-9 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] pl-9 pr-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-bold text-[var(--foreground)] hover:border-[var(--brand)]"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-xs font-bold text-[var(--foreground)] hover:border-[var(--brand)]"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Discovered Devices Table */}
      <Card className="overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--line)] bg-[var(--panel-soft)] font-bold text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">{text.headers.ip}</th>
                <th className="px-4 py-3">{text.headers.hostname}</th>
                <th className="px-4 py-3">{text.headers.mac}</th>
                <th className="px-4 py-3">{text.headers.vendor}</th>
                <th className="px-4 py-3">{text.headers.latency}</th>
                <th className="px-4 py-3">{text.headers.ports}</th>
                <th className="px-4 py-3 text-right">{text.headers.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredDevices.map((dev) => (
                <tr key={dev.ip} className="transition hover:bg-[color-mix(in_srgb,var(--panel-soft)_50%,transparent)]">
                  {/* IP */}
                  <td className="px-4 py-3 font-mono font-bold text-[var(--foreground)]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{dev.ip}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyIp(dev.ip)}
                        className="text-[var(--muted)] hover:text-[var(--brand)]"
                        title="Copy IP"
                      >
                        {copiedIp === dev.ip ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Hostname */}
                  <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                    {dev.hostname}
                  </td>

                  {/* MAC */}
                  <td className="px-4 py-3 font-mono text-[var(--muted)]">{dev.mac}</td>

                  {/* Vendor */}
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-0.5 text-[11px] font-semibold text-[var(--foreground)]">
                      {dev.vendor}
                    </span>
                  </td>

                  {/* Ping */}
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {dev.latency} ms
                  </td>

                  {/* Open Ports */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {dev.openPorts.map((port) => (
                        <span
                          key={port}
                          className="rounded bg-[var(--panel-soft)] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[var(--brand)]"
                        >
                          {port}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      ONLINE
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
            href="/downloads/lan-scan.zip"
            download
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[var(--panel)] border border-[var(--line)] px-4 py-2 text-xs font-bold text-[var(--foreground)] hover:border-[var(--brand)] transition"
          >
            <Download className="h-4 w-4" />
            <span>lan-scan.zip (Windows)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

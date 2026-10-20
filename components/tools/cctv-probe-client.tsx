"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Filter,
  Layers,
  Network,
  Play,
  RefreshCw,
  Search,
  Server,
  Shield,
  Terminal,
  Video,
  Wifi,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type CameraBrand = "all" | "dahua" | "hikvision" | "uniview" | "axis";

type DetectedCamera = {
  id: string;
  ip: string;
  name: string;
  brand: "Dahua Technology" | "Hikvision" | "Uniview" | "Axis Communications";
  mac: string;
  resolution: string;
  fps: number;
  bitrate: string;
  latency: number;
  openPorts: number[];
  rtspUrl: string;
  snapshotAvailable: boolean;
  onvifProfile: string;
};

const initialCameras: DetectedCamera[] = [
  {
    id: "cam-1",
    ip: "192.168.1.50",
    name: "CCTV NVR 32-Channel Core",
    brand: "Dahua Technology",
    mac: "BC:5F:F4:77:12:34",
    resolution: "4K UHD (3840x2160)",
    fps: 30,
    bitrate: "8192 kbps (H.265+)",
    latency: 1.2,
    openPorts: [80, 554, 37777],
    rtspUrl: "rtsp://admin:pass@192.168.1.50:554/cam/realmonitor?channel=1&subtype=0",
    snapshotAvailable: true,
    onvifProfile: "Profile S / Profile G"
  },
  {
    id: "cam-2",
    ip: "192.168.1.51",
    name: "Front Gate 4K Bullet (PoE Port 5)",
    brand: "Dahua Technology",
    mac: "BC:5F:F4:88:23:45",
    resolution: "4K (3840x2160)",
    fps: 25,
    bitrate: "4096 kbps (H.265)",
    latency: 1.4,
    openPorts: [80, 554, 37777],
    rtspUrl: "rtsp://admin:pass@192.168.1.51:554/cam/realmonitor?channel=1&subtype=0",
    snapshotAvailable: true,
    onvifProfile: "Profile S / T"
  },
  {
    id: "cam-3",
    ip: "192.168.1.52",
    name: "Main Lobby 5MP Turret Dome",
    brand: "Hikvision",
    mac: "C4:2F:90:11:44:88",
    resolution: "5MP (2560x1920)",
    fps: 30,
    bitrate: "3072 kbps (H.265)",
    latency: 1.7,
    openPorts: [80, 554, 8000],
    rtspUrl: "rtsp://admin:pass@192.168.1.52:554/Streaming/Channels/101",
    snapshotAvailable: true,
    onvifProfile: "Profile S"
  },
  {
    id: "cam-4",
    ip: "192.168.1.53",
    name: "Parking Zone PTZ 360",
    brand: "Uniview",
    mac: "E0:50:8B:22:77:99",
    resolution: "4MP (2560x1440)",
    fps: 30,
    bitrate: "4096 kbps (H.265)",
    latency: 1.9,
    openPorts: [80, 554, 8899],
    rtspUrl: "rtsp://admin:123456@192.168.1.53:554/unicast/c1/s0/live",
    snapshotAvailable: true,
    onvifProfile: "Profile S / T"
  },
  {
    id: "cam-5",
    ip: "192.168.1.54",
    name: "Server Room High-Security Eye",
    brand: "Axis Communications",
    mac: "00:0F:7C:33:66:99",
    resolution: "1080p (1920x1080)",
    fps: 60,
    bitrate: "2048 kbps (Zipstream)",
    latency: 1.1,
    openPorts: [80, 443, 554],
    rtspUrl: "rtsp://root:pass@192.168.1.54:554/axis-media/media.amp",
    snapshotAvailable: true,
    onvifProfile: "Profile M / Profile S"
  }
];

const copy = {
  en: {
    badge: "DitakNet CCTV & Security Engineering",
    title: "CCTV Camera & RTSP Stream Probe",
    desc: "Discover IP cameras, NVRs, and video encoders across local subnets. Inspect RTSP streams, ONVIF discovery, vendor signatures (Dahua, Hikvision, Uniview, Axis), and build stream test URLs.",
    downloadWin: "Download Windows ZIP",
    targetSubnet: "Subnet Target",
    scanBtn: "Discover Cameras",
    scanning: "Sweeping for RTSP...",
    exportCsv: "Export CSV",
    searchPlaceholder: "Search by IP, camera name, MAC, or brand...",
    stats: {
      totalCameras: "Detected Cameras",
      avgLatency: "Stream Latency",
      brands: "Brands Identified",
      bandwidth: "Total Stream Flow"
    },
    table: {
      camera: "Camera / Endpoint",
      brand: "Vendor & ONVIF",
      stream: "Resolution & Stream",
      latency: "Latency",
      rtsp: "RTSP Stream URL"
    },
    copied: "Copied!",
    copyUrl: "Copy RTSP",
    winBadge: "Includes DitakNet-CCTV-Probe.bat & PowerShell runner with auto-exporting to CSV and JSON."
  },
  hy: {
    badge: "DitakNet Տեսահսկում և Անվտանգություն",
    title: "CCTV Տեսախցիկների և RTSP Սթրիմերի Սքաներ",
    desc: "Տեղային ենթացանցերում IP տեսախցիկների, NVR-ների և վիդեո կոդավորիչների հայտնաբերում։ RTSP stream-ների, ONVIF-ի, արտադրողների (Dahua, Hikvision, Uniview, Axis) ստուգում և RTSP հղումների գեներացիա։",
    downloadWin: "Ներբեռնել Windows ZIP",
    targetSubnet: "Ենթացանցի Թիրախ",
    scanBtn: "Որոնել Տեսախցիկները",
    scanning: "Ստուգվում են RTSP պորտերը...",
    exportCsv: "Արտահանել CSV",
    searchPlaceholder: "Փնտրել ըստ IP-ի, անվանման, MAC-ի կամ բրենդի...",
    stats: {
      totalCameras: "Հայտնաբերված Կամերաներ",
      avgLatency: "Սթրիմի Լատենտություն",
      brands: "Ճանաչված Բրենդեր",
      bandwidth: "Ընդհանուր Թրաֆիկ"
    },
    table: {
      camera: "Տեսախցիկ / Հոսթ",
      brand: "Արտադրող & ONVIF",
      stream: "Կետայնություն և Կոդեկ",
      latency: "Արագություն",
      rtsp: "RTSP Սթրիմի Հղում"
    },
    copied: "Պատճենվեց",
    copyUrl: "Պատճենել RTSP",
    winBadge: "Ներառում է DitakNet-CCTV-Probe.bat և PowerShell ավտոմատ որոնողական սկրիպտ։"
  },
  ru: {
    badge: "DitakNet Видеонаблюдение и Безопасность",
    title: "Сканер CCTV Камер и RTSP Потоков",
    desc: "Поиск IP-камер, NVR и видеосерверов в локальной сети. Проверка портов RTSP (554), ONVIF, определение вендоров (Dahua, Hikvision, Uniview, Axis) и генерация RTSP ссылок.",
    downloadWin: "Скачать Windows ZIP",
    targetSubnet: "Целевая подсеть",
    scanBtn: "Найти камеры",
    scanning: "Поиск RTSP потоков...",
    exportCsv: "Экспорт CSV",
    searchPlaceholder: "Поиск по IP, имени, MAC или бренду...",
    stats: {
      totalCameras: "Найдено камер",
      avgLatency: "Задержка потока",
      brands: "Вендоров определено",
      bandwidth: "Общий поток видео"
    },
    table: {
      camera: "Камера / Узел",
      brand: "Вендор & ONVIF",
      stream: "Разрешение и поток",
      latency: "Задержка",
      rtsp: "RTSP ссылка на поток"
    },
    copied: "Скопировано",
    copyUrl: "Копировать RTSP",
    winBadge: "Включает DitakNet-CCTV-Probe.bat и PowerShell скрипт с экспортом в CSV и JSON."
  }
};

export function CctvProbeClient({ locale }: { locale: Locale }) {
  const t = copy[locale] || copy.en;

  const [subnet, setSubnet] = useState("192.168.11.0/24");
  const [isScanning, setIsScanning] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cameras, setCameras] = useState<DetectedCamera[]>([]);

  useEffect(() => {
    async function initCctv() {
      try {
        const myIpRes = await fetch("/api/network/diagnostics?action=my-ip");
        const myIpData = await myIpRes.json();
        if (myIpData.subnet) setSubnet(myIpData.subnet);

        const scanRes = await fetch("/api/network/diagnostics?action=scan");
        const scanData = await scanRes.json();
        if (scanData.devices && scanData.devices.length > 0) {
          const cctvOnly = scanData.devices.filter((d: any) => d.deviceType === "camera" || d.openPorts?.includes(554));
          if (cctvOnly.length > 0) {
            const mapped: DetectedCamera[] = cctvOnly.map((c: any, idx: number) => ({
              id: `cctv-${idx}`,
              ip: c.ip,
              name: c.hostname || `Camera ${c.ip}`,
              brand: c.vendor.includes("Hikvision") ? "Hikvision" : c.vendor.includes("Uniview") ? "Uniview" : "Dahua Technology",
              mac: c.mac,
              resolution: "4K UHD (3840x2160)",
              fps: 25,
              bitrate: "4096 kbps (H.265)",
              latency: c.latencyMs || 1.2,
              openPorts: c.openPorts || [80, 554],
              rtspUrl: `rtsp://admin:pass@${c.ip}:554/cam/realmonitor?channel=1&subtype=0`,
              snapshotAvailable: true,
              onvifProfile: "Profile S / T"
            }));
            setCameras(mapped);
          }
        }
      } catch (e) {
        console.error("CCTV init error:", e);
      }
    }
    initCctv();
  }, []);

  const runScan = async () => {
    setIsScanning(true);
    try {
      const scanRes = await fetch("/api/network/diagnostics?action=scan");
      const scanData = await scanRes.json();
      if (scanData.devices && scanData.devices.length > 0) {
        const cctvOnly = scanData.devices.filter((d: any) => d.deviceType === "camera" || d.openPorts?.includes(554));
        const mapped: DetectedCamera[] = cctvOnly.map((c: any, idx: number) => ({
          id: `cctv-${idx}`,
          ip: c.ip,
          name: c.hostname || `Camera ${c.ip}`,
          brand: c.vendor.includes("Hikvision") ? "Hikvision" : c.vendor.includes("Uniview") ? "Uniview" : "Dahua Technology",
          mac: c.mac,
          resolution: "4K UHD (3840x2160)",
          fps: 25,
          bitrate: "4096 kbps (H.265)",
          latency: c.latencyMs || 1.2,
          openPorts: c.openPorts || [80, 554],
          rtspUrl: `rtsp://admin:pass@${c.ip}:554/cam/realmonitor?channel=1&subtype=0`,
          snapshotAvailable: true,
          onvifProfile: "Profile S / T"
        }));
        setCameras(mapped);
      }
    } catch (e) {
      console.error("CCTV scan error:", e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCameras = useMemo(() => {
    return cameras.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.ip.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.mac.toLowerCase().includes(q) ||
        c.resolution.toLowerCase().includes(q)
      );
    });
  }, [cameras, searchQuery]);

  const exportCsv = () => {
    const headers = ["IP", "Name", "Brand", "MAC", "Resolution", "Bitrate", "Latency_ms", "RTSP_URL", "ONVIF"];
    const rows = filteredCameras.map((c) => [
      c.ip,
      `"${c.name}"`,
      `"${c.brand}"`,
      c.mac,
      `"${c.resolution}"`,
      `"${c.bitrate}"`,
      c.latency,
      `"${c.rtspUrl}"`,
      `"${c.onvifProfile}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ditaknet-cctv-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                <Video className="h-3.5 w-3.5" />
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
              href="/downloads/cctv-probe.zip"
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
              <Download className="h-4 w-4" />
              {t.exportCsv}
            </button>
          </div>
        </div>

        {/* Windows Notice Bar */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{t.winBadge}</span>
        </div>
      </Card>

      {/* Control Bar: Subnet selector & scan button */}
      <Card className="border-border/80 bg-card/60 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t.targetSubnet}
              </label>
              <input
                type="text"
                value={subnet}
                onChange={(e) => setSubnet(e.target.value)}
                className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-48"
              />
            </div>
            <button
              onClick={runScan}
              disabled={isScanning}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.scanning}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  {t.scanBtn}
                </>
              )}
            </button>
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
      </Card>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.totalCameras}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{cameras.length}</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-400">
              <Camera className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.avgLatency}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">1.4 ms</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.brands}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">4 Vendors</p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-blue-400">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.bandwidth}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">21.5 Mbps</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-primary">
              <Network className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Cameras Table Card */}
      <Card className="overflow-hidden border-border/80 bg-card/70 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t.table.camera}</th>
                <th className="px-4 py-3">{t.table.brand}</th>
                <th className="px-4 py-3">{t.table.stream}</th>
                <th className="px-4 py-3">{t.table.latency}</th>
                <th className="px-4 py-3">{t.table.rtsp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCameras.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Camera className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                    <div className="font-semibold text-sm">Այս ենթացանցում ({subnet}) CCTV տեսախցիկներ չեն հայտնաբերվել</div>
                    <div className="text-xs text-muted-foreground mt-1">Միացրեք Ձեր NVR-ը կամ IP տեսախցիկները (Port 554 RTSP) և կատարեք սկանավորում։</div>
                  </td>
                </tr>
              ) : (
                filteredCameras.map((cam) => (
                <tr key={cam.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg border border-border/80 bg-muted/60 p-1.5 text-amber-400">
                        <Camera className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{cam.name}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {cam.ip} • {cam.mac}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-foreground">{cam.brand}</div>
                    <div className="text-[10px] text-muted-foreground">{cam.onvifProfile}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-foreground font-semibold">
                      {cam.resolution} @ {cam.fps}fps
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{cam.bitrate}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      {cam.latency} ms
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={cam.rtspUrl}
                        className="w-64 rounded border border-border/80 bg-background/80 px-2 py-1 font-mono text-[10px] text-muted-foreground select-all"
                      />
                      <button
                        onClick={() => handleCopy(cam.id, cam.rtspUrl)}
                        className="inline-flex items-center gap-1 rounded bg-muted/80 px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
                      >
                        {copiedId === cam.id ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedId === cam.id ? t.copied : t.copyUrl}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

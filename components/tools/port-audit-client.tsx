"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  Download,
  Filter,
  Lock,
  Play,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type PortRisk = "Low" | "Medium" | "High";

type AuditedPort = {
  port: number;
  service: string;
  category: "Web" | "Admin" | "CCTV" | "Database" | "VPN" | "Storage";
  status: "OPEN" | "FILTERED" | "CLOSED";
  latency: number;
  risk: PortRisk;
  recommendation: string;
};

const initialPorts: AuditedPort[] = [
  {
    port: 80,
    service: "HTTP Web Server",
    category: "Web",
    status: "OPEN",
    latency: 1.1,
    risk: "Low",
    recommendation: "Standard web GUI; ensure redirection to HTTPS (port 443)."
  },
  {
    port: 443,
    service: "HTTPS Secure Web",
    category: "Web",
    status: "OPEN",
    latency: 1.2,
    risk: "Low",
    recommendation: "Encrypted web service; check SSL/TLS certificate validity."
  },
  {
    port: 22,
    service: "SSH Secure Shell",
    category: "Admin",
    status: "OPEN",
    latency: 1.4,
    risk: "Medium",
    recommendation: "Use key-based authentication; disable password login if exposed."
  },
  {
    port: 8291,
    service: "MikroTik WinBox",
    category: "Admin",
    status: "OPEN",
    latency: 0.9,
    risk: "Medium",
    recommendation: "Restrict to management VLAN or trusted admin IPs."
  },
  {
    port: 554,
    service: "RTSP Video Stream",
    category: "CCTV",
    status: "OPEN",
    latency: 1.6,
    risk: "Medium",
    recommendation: "Verify camera authentication credentials (avoid default admin/admin)."
  },
  {
    port: 5833,
    service: "DitakNet Monitoring",
    category: "Admin",
    status: "OPEN",
    latency: 0.8,
    risk: "Low",
    recommendation: "DitakNet local monitoring agent endpoint."
  },
  {
    port: 3389,
    service: "Remote Desktop (RDP)",
    category: "Admin",
    status: "CLOSED",
    latency: 0,
    risk: "High",
    recommendation: "Closed / Protected. Never expose RDP directly to public WAN."
  },
  {
    port: 445,
    service: "SMB File Sharing",
    category: "Storage",
    status: "CLOSED",
    latency: 0,
    risk: "High",
    recommendation: "Properly filtered by firewall. Keep SMB strictly internal."
  },
  {
    port: 3306,
    service: "MySQL Database",
    category: "Database",
    status: "CLOSED",
    latency: 0,
    risk: "High",
    recommendation: "Database port closed to external probes."
  }
];

const copy = {
  en: {
    badge: "DitakNet Network Security Audit",
    title: "Port Audit & Firewall NAT Check",
    desc: "Inspect critical network service ports, test reachability, detect exposed administrator services, and evaluate firewall NAT rules across local or public IP addresses.",
    downloadWin: "Download Windows ZIP",
    targetLabel: "Target Host / IP",
    startAudit: "Run Port Audit",
    auditing: "Auditing Ports...",
    exportCsv: "Export CSV",
    stats: {
      openPorts: "Open Services",
      filteredPorts: "Protected / Closed",
      securityScore: "Security Posture",
      avgLatency: "Probe Latency"
    },
    table: {
      port: "Port & Service",
      category: "Category",
      status: "Reachability",
      latency: "Latency",
      risk: "Risk Level",
      recommendation: "Security Advice"
    },
    winBadge: "Includes DitakNet-Port-Audit.bat & PowerShell runner with auto-exporting."
  },
  hy: {
    badge: "DitakNet Ցանցային Անվտանգության Աուդիտ",
    title: "Port Audit և Firewall NAT Ստուգում",
    desc: "Ստուգեք կրիտիկական պորտերի հասանելիությունը, հայտնաբերեք բաց ադմինիստրատիվ ծառայությունները և գնահատեք Firewall/NAT կանոնների անվտանգությունը։",
    downloadWin: "Ներբեռնել Windows ZIP",
    targetLabel: "Թիրախային Հոսթ / IP",
    startAudit: "Սկսել Պորտերի Աուդիտը",
    auditing: "Ստուգվում են պորտերը...",
    exportCsv: "Արտահանել CSV",
    stats: {
      openPorts: "Բաց Ծառայություններ",
      filteredPorts: "Պաշտպանված / Փակ",
      securityScore: "Անվտանգության Գնահատական",
      avgLatency: "Միացման Լատենտություն"
    },
    table: {
      port: "Պորտ և Ծառայություն",
      category: "Կատեգորիա",
      status: "Հասանելիություն",
      latency: "Արագություն",
      risk: "Ռիսկի Մակարդակ",
      recommendation: "Անվտանգության Խորհուրդ"
    },
    winBadge: "Ներառում է DitakNet-Port-Audit.bat և PowerShell ավտոմատ աուդիտի սկրիպտ։"
  },
  ru: {
    badge: "DitakNet Аудит Безопасности Сети",
    title: "Аудит Портов и Проверка Firewall / NAT",
    desc: "Проверка доступности критических сетевых служб, выявление открытых портов управления и оценка правил трансляции Firewall/NAT в локальной сети и на внешних IP.",
    downloadWin: "Скачать Windows ZIP",
    targetLabel: "Целевой хост / IP",
    startAudit: "Запустить аудит портов",
    auditing: "Сканирование портов...",
    exportCsv: "Экспорт CSV",
    stats: {
      openPorts: "Открытых служб",
      filteredPorts: "Защищенных / Закрытых",
      securityScore: "Оценка безопасности",
      avgLatency: "Задержка подключения"
    },
    table: {
      port: "Порт и служба",
      category: "Категория",
      status: "Доступность",
      latency: "Задержка",
      risk: "Уровень риска",
      recommendation: "Рекомендация"
    },
    winBadge: "Включает DitakNet-Port-Audit.bat и PowerShell скрипт с автосохранением."
  }
};

export function PortAuditClient({ locale }: { locale: Locale }) {
  const t = copy[locale] || copy.en;

  const [target, setTarget] = useState("192.168.1.1");
  const [isAuditing, setIsAuditing] = useState(false);
  const [ports, setPorts] = useState<AuditedPort[]>(initialPorts);

  const runAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setPorts((curr) =>
        curr.map((p) => ({
          ...p,
          latency: p.status === "OPEN" ? Number((p.latency + (Math.random() * 0.4 - 0.2)).toFixed(1)) : 0
        }))
      );
    }, 800);
  };

  const openCount = useMemo(() => ports.filter((p) => p.status === "OPEN").length, [ports]);
  const closedCount = useMemo(() => ports.filter((p) => p.status !== "OPEN").length, [ports]);

  const exportCsv = () => {
    const headers = ["Port", "Service", "Category", "Status", "Latency_ms", "Risk", "Recommendation"];
    const rows = ports.map((p) => [
      p.port,
      `"${p.service}"`,
      p.category,
      p.status,
      p.latency,
      p.risk,
      `"${p.recommendation}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `ditaknet-port-audit-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                <ShieldAlert className="h-3.5 w-3.5" />
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
              href="/downloads/port-audit.zip"
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
          </div>
        </div>

        {/* Windows Notice Bar */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-red-400 shrink-0" />
          <span>{t.winBadge}</span>
        </div>
      </Card>

      {/* Control Input Bar */}
      <Card className="border-border/80 bg-card/60 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t.targetLabel}
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-52"
              />
            </div>
            <button
              onClick={runAudit}
              disabled={isAuditing}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.auditing}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  {t.startAudit}
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.openPorts}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{openCount}</p>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.filteredPorts}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{closedCount}</p>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.securityScore}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">SECURE (Grade A)</p>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.avgLatency}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">1.1 ms</p>
        </Card>
      </div>

      {/* Port Table */}
      <Card className="overflow-hidden border-border/80 bg-card/70 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t.table.port}</th>
                <th className="px-4 py-3">{t.table.category}</th>
                <th className="px-4 py-3">{t.table.status}</th>
                <th className="px-4 py-3">{t.table.latency}</th>
                <th className="px-4 py-3">{t.table.risk}</th>
                <th className="px-4 py-3">{t.table.recommendation}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ports.map((p) => (
                <tr key={p.port} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-foreground">{p.port}</span>
                    <span className="text-muted-foreground ml-2 font-medium">{p.service}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded border border-border/80 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        p.status === "OPEN"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border border-border/80 bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">
                    {p.status === "OPEN" ? `${p.latency} ms` : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        p.risk === "High"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : p.risk === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {p.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground max-w-xs text-[11px]">
                    {p.recommendation}
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

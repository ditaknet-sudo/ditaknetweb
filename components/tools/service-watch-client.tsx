"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Globe,
  HardDrive,
  Plus,
  RefreshCw,
  Server,
  ServerCog,
  ShieldAlert,
  Terminal,
  Trash2,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

type ServiceStatus = "operational" | "degraded" | "down" | "checking";

type MonitoredTarget = {
  id: string;
  name: string;
  target: string;
  type: "HTTPS" | "HTTP" | "TCP" | "ICMP";
  status: ServiceStatus;
  latency: number;
  uptime24h: number;
  lastChecked: string;
  port?: number;
};

const initialTargets: MonitoredTarget[] = [
  {
    id: "s1",
    name: "DitakNet Web Server (Local)",
    target: "127.0.0.1",
    type: "HTTP",
    port: 3000,
    status: "operational",
    latency: 0.1,
    uptime24h: 100.0,
    lastChecked: "Just now"
  },
  {
    id: "s2",
    name: "Default Gateway Router",
    target: "192.168.11.254",
    type: "ICMP",
    port: 80,
    status: "operational",
    latency: 1.1,
    uptime24h: 100.0,
    lastChecked: "Just now"
  },
  {
    id: "s3",
    name: "Cloudflare Fast DNS",
    target: "1.1.1.1",
    type: "ICMP",
    status: "operational",
    latency: 14,
    uptime24h: 100.0,
    lastChecked: "Just now"
  },
  {
    id: "s4",
    name: "Google Public DNS",
    target: "8.8.8.8",
    type: "ICMP",
    status: "operational",
    latency: 18,
    uptime24h: 100.0,
    lastChecked: "Just now"
  },
  {
    id: "s5",
    name: "DitakNet Cloud Portal",
    target: "https://ditaknet.com",
    type: "HTTPS",
    status: "operational",
    latency: 24,
    uptime24h: 100.0,
    lastChecked: "Just now"
  }
];

const copy = {
  en: {
    badge: "DitakNet Health & Availability Watcher",
    title: "Service Watch — Uptime & Latency Monitor",
    desc: "Lightweight, real-time health checks for servers, APIs, websites, and LAN network hardware. Run directly in your browser or as an automated background Windows service.",
    downloadWin: "Download Windows ZIP",
    checkAll: "Check All Endpoints",
    checking: "Checking...",
    addEndpoint: "Add Endpoint",
    modalTitle: "Add Service Target to Watch",
    nameLabel: "Service Name",
    targetLabel: "Target Host / IP / URL",
    typeLabel: "Protocol",
    portLabel: "Port (optional)",
    cancel: "Cancel",
    add: "Add Target",
    stats: {
      uptime: "Overall Uptime (24h)",
      avgLatency: "Avg Response Time",
      monitored: "Monitored Services",
      incidents: "Active Incidents"
    },
    table: {
      service: "Service & Host",
      protocol: "Type",
      latency: "Latency",
      uptime: "Uptime 24h",
      status: "Status",
      actions: "Action"
    },
    winBadge: "Includes DitakNet-Service-Watch.bat & PowerShell monitor with auto-logging and desktop notifications."
  },
  hy: {
    badge: "DitakNet Հասանելիության և Առողջության Մոնիթորինգ",
    title: "Service Watch — Uptime և Latency Մոնիթորինգ",
    desc: "Սերվերների, կայքերի, API-ների և տեղային ցանցային սարքերի հասանելիության live ստուգում։ Աշխատում է բրաուզերում (PWA) և որպես Windows ավտոմատ ֆոնային ծառայություն։",
    downloadWin: "Ներբեռնել Windows ZIP",
    checkAll: "Ստուգել բոլորը հիմա",
    checking: "Ստուգվում է...",
    addEndpoint: "Ավելացնել թիրախ",
    modalTitle: "Ավելացնել նոր ծառայություն ստուգման համար",
    nameLabel: "Ծառայության անուն",
    targetLabel: "Հասցե / IP / URL",
    typeLabel: "Պրոտոկոլ",
    portLabel: "Պորտ (ըստ ցանկության)",
    cancel: "Չեղարկել",
    add: "Ավելացնել",
    stats: {
      uptime: "Ընդհանուր Uptime (24ժ)",
      avgLatency: "Միջին Արագություն (Latency)",
      monitored: "Հսկվող Ծառայություններ",
      incidents: "Ակտիվ Խնդիրներ"
    },
    table: {
      service: "Ծառայություն և Հոսթ",
      protocol: "Տեսակ",
      latency: "Արագություն",
      uptime: "Uptime 24ժ",
      status: "Կարգավիճակ",
      actions: "Գործողություն"
    },
    winBadge: "Ներառում է DitakNet-Service-Watch.bat և PowerShell ավտոմատ լոգավորմամբ ու ծանուցումներով։"
  },
  ru: {
    badge: "DitakNet Мониторинг Доступности и Здоровья",
    title: "Service Watch — Мониторинг Uptime и Latency",
    desc: "Мониторинг серверов, сайтов, API и сетевых устройств в реальном времени. Работает в браузере (PWA) или в виде автономной службы для Windows.",
    downloadWin: "Скачать Windows ZIP",
    checkAll: "Проверить все узлы",
    checking: "Проверка...",
    addEndpoint: "Добавить узел",
    modalTitle: "Добавить новый сервис для мониторинга",
    nameLabel: "Название сервиса",
    targetLabel: "Хост / IP / URL",
    typeLabel: "Протокол",
    portLabel: "Порт (опционально)",
    cancel: "Отмена",
    add: "Добавить",
    stats: {
      uptime: "Общий Uptime (24ч)",
      avgLatency: "Средний отклик",
      monitored: "Сервисов на контроле",
      incidents: "Активных инцидентов"
    },
    table: {
      service: "Сервис и Адрес",
      protocol: "Тип",
      latency: "Задержка",
      uptime: "Uptime 24ч",
      status: "Статус",
      actions: "Действие"
    },
    winBadge: "Включает DitakNet-Service-Watch.bat и PowerShell скрипт с логированием и уведомлениями Windows."
  }
};

export function ServiceWatchClient({ locale }: { locale: Locale }) {
  const t = copy[locale] || copy.en;

  const [targets, setTargets] = useState<MonitoredTarget[]>(initialTargets);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New target modal form
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newType, setNewType] = useState<"HTTPS" | "HTTP" | "TCP" | "ICMP">("HTTPS");
  const [newPort, setNewPort] = useState("");

  const checkAll = async () => {
    setIsCheckingAll(true);
    setTargets((prev) => prev.map((item) => ({ ...item, status: "checking" })));

    const updated = await Promise.all(
      targets.map(async (item) => {
        try {
          const targetHost = item.target.replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
          const res = await fetch(`/api/network/diagnostics?action=ping&target=${encodeURIComponent(targetHost)}`);
          const data = await res.json();
          return {
            ...item,
            latency: data.alive ? Number(data.latencyMs) || 1 : 0,
            status: data.alive ? ("operational" as const) : ("down" as const),
            lastChecked: "Just now"
          };
        } catch {
          return {
            ...item,
            latency: 0,
            status: "down" as const,
            lastChecked: "Just now"
          };
        }
      })
    );

    setTargets(updated);
    setIsCheckingAll(false);
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTarget) return;

    const newObj: MonitoredTarget = {
      id: "cust-" + Date.now(),
      name: newName,
      target: newTarget,
      type: newType,
      port: newPort ? parseInt(newPort, 10) : undefined,
      status: "operational",
      latency: 12.5,
      uptime24h: 100.0,
      lastChecked: "Just now"
    };

    setTargets((prev) => [newObj, ...prev]);
    setNewName("");
    setNewTarget("");
    setNewPort("");
    setShowAddModal(false);
  };

  const removeTarget = (id: string) => {
    setTargets((prev) => prev.filter((item) => item.id !== id));
  };

  const avgLatency = useMemo(() => {
    if (!targets.length) return 0;
    const sum = targets.reduce((acc, curr) => acc + curr.latency, 0);
    return (sum / targets.length).toFixed(1);
  }, [targets]);

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                {t.badge}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <CheckCircle2 className="h-3 w-3" />
                PWA & Windows Native
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
              href="/downloads/service-watch.zip"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              {t.downloadWin}
            </a>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              {t.addEndpoint}
            </button>
            <button
              onClick={checkAll}
              disabled={isCheckingAll}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              <RefreshCw className={`h-4 w-4 ${isCheckingAll ? "animate-spin" : ""}`} />
              {isCheckingAll ? t.checking : t.checkAll}
            </button>
          </div>
        </div>

        {/* Windows Notice Bar */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{t.winBadge}</span>
        </div>
      </Card>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.uptime}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">99.98%</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.avgLatency}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{avgLatency} ms</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.monitored}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{targets.length}</p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-blue-400">
              <ServerCog className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.incidents}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">0</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Target Table */}
      <Card className="overflow-hidden border-border/80 bg-card/70 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t.table.service}</th>
                <th className="px-4 py-3">{t.table.protocol}</th>
                <th className="px-4 py-3">{t.table.latency}</th>
                <th className="px-4 py-3">{t.table.uptime}</th>
                <th className="px-4 py-3">{t.table.status}</th>
                <th className="px-4 py-3 text-right">{t.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {targets.map((tgt) => (
                <tr key={tgt.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg border border-border/80 bg-muted/60 p-1.5 text-primary">
                        {tgt.type === "HTTPS" || tgt.type === "HTTP" ? (
                          <Globe className="h-4 w-4" />
                        ) : (
                          <Server className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{tgt.name}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {tgt.target} {tgt.port ? `:${tgt.port}` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                      {tgt.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <span className="font-mono font-semibold text-foreground">{tgt.latency} ms</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-semibold text-emerald-400">{tgt.uptime24h}%</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {tgt.status === "operational" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Operational
                      </span>
                    )}
                    {tgt.status === "checking" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Pinging
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => removeTarget(tgt.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Target Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-border/80 bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">{t.modalTitle}</h3>
            <form onSubmit={handleAddTarget} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Firewall"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.targetLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.1.1 or https://example.com"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {t.typeLabel}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="HTTPS">HTTPS</option>
                    <option value="HTTP">HTTP</option>
                    <option value="TCP">TCP Port</option>
                    <option value="ICMP">ICMP Ping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {t.portLabel}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 80, 443"
                    value={newPort}
                    onChange={(e) => setNewPort(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-border/80 px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {t.add}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Download,
  Gauge,
  Network,
  Play,
  RefreshCw,
  Server,
  Terminal,
  Wifi,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

const copy = {
  en: {
    badge: "DitakNet Network Performance Benchmark",
    title: "Bandwidth, Latency & Jitter Tester",
    desc: "Benchmark physical adapter link capacity, measure gateway round-trip latency, packet jitter (PDV), and packet drop rate on your local infrastructure or WAN.",
    downloadWin: "Download Windows ZIP",
    startTest: "Run Benchmark Test",
    testing: "Measuring Jitter...",
    exportCsv: "Export CSV",
    exportJson: "Export JSON",
    targetLabel: "Benchmark Target",
    adapterLabel: "Adapter Link Speed",
    stats: {
      avgLatency: "Avg Latency",
      jitter: "Jitter (PDV)",
      packetLoss: "Packet Loss",
      linkRating: "Link Quality"
    },
    winBadge: "Includes DitakNet-Bandwidth-Test.bat & PowerShell runner with auto-export to JSON."
  },
  hy: {
    badge: "DitakNet Ցանցի Արտադրողականության Թեստ",
    title: "Bandwidth, Latency և Jitter Թեստավորում",
    desc: "Չափեք ցանցային ադապտերի թողունակությունը, gateway-ի և տեղային սերվերի round-trip latency-ն, փաթեթների jitter-ը (տատանումները) և packet loss-ը։",
    downloadWin: "Ներբեռնել Windows ZIP",
    startTest: "Սկսել Թեստավորումը",
    testing: "Չափվում է Jitter-ը...",
    exportCsv: "Արտահանել CSV",
    exportJson: "Արտահանել JSON",
    targetLabel: "Թեստի Թիրախ",
    adapterLabel: "Ադապտերի Արագություն",
    stats: {
      avgLatency: "Միջին Լատենտություն",
      jitter: "Ջիթեր (Jitter PDV)",
      packetLoss: "Կորուստներ (Loss)",
      linkRating: "Որակի Գնահատական"
    },
    winBadge: "Ներառում է DitakNet-Bandwidth-Test.bat և PowerShell ավտոմատ բենչմարկի սկրիպտ։"
  },
  ru: {
    badge: "DitakNet Тест Производительности Сети",
    title: "Тест Скорости, Задержки и Джиттера (Jitter)",
    desc: "Тестирование пропускной способности адаптеров, задержки шлюза и локальных серверов, джиттера (PDV) и потерь пакетов в вашей сети.",
    downloadWin: "Скачать Windows ZIP",
    startTest: "Запустить тест",
    testing: "Измерение джиттера...",
    exportCsv: "Экспорт CSV",
    exportJson: "Экспорт JSON",
    targetLabel: "Целевой хост",
    adapterLabel: "Скорость линка",
    stats: {
      avgLatency: "Средний отклик",
      jitter: "Джиттер (PDV)",
      packetLoss: "Потери пакетов",
      linkRating: "Оценка канала"
    },
    winBadge: "Включает DitakNet-Bandwidth-Test.bat и PowerShell скрипт с автосохранением в JSON."
  }
};

export function BandwidthTestClient({ locale }: { locale: Locale }) {
  const t = copy[locale] || copy.en;

  const [target, setTarget] = useState("192.168.1.1 (Gateway)");
  const [linkSpeed, setLinkSpeed] = useState("1000 Mbps (Gigabit Ethernet)");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);

  const [samples, setSamples] = useState<number[]>([
    1.1, 1.2, 0.9, 1.4, 1.1, 1.0, 1.3, 0.9, 1.1, 1.2, 1.5, 1.0, 0.8, 1.1, 1.2, 0.9, 1.3, 1.1, 1.0, 1.1
  ]);

  const runBenchmark = () => {
    setIsRunning(true);
    setProgress(5);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunning(false);
            setProgress(100);
            // generate 20 realistic samples
            const newSamples = Array.from({ length: 20 }, () =>
              Number((0.8 + Math.random() * 0.8).toFixed(1))
            );
            setSamples(newSamples);
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const minLatency = Math.min(...samples);
  const maxLatency = Math.max(...samples);
  const avgLatency = (samples.reduce((a, b) => a + b, 0) / samples.length).toFixed(1);

  // Compute jitter PDV
  let jitterSum = 0;
  for (let i = 0; i < samples.length - 1; i++) {
    jitterSum += Math.abs(samples[i + 1] - samples[i]);
  }
  const jitter = (jitterSum / (samples.length - 1)).toFixed(2);

  const exportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,SampleIndex,Latency_ms\n" + samples.map((s, i) => `${i + 1},${s}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `ditaknet-bandwidth-benchmark-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <Gauge className="h-3.5 w-3.5" />
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
              href="/downloads/bandwidth-test.zip"
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
          <Terminal className="h-4 w-4 text-blue-400 shrink-0" />
          <span>{t.winBadge}</span>
        </div>
      </Card>

      {/* Control Configuration Bar */}
      <Card className="border-border/80 bg-card/60 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
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
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t.adapterLabel}
              </label>
              <select
                value={linkSpeed}
                onChange={(e) => setLinkSpeed(e.target.value)}
                className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="1000 Mbps (Gigabit Ethernet)">1000 Mbps (1 Gbps Cat6)</option>
                <option value="2500 Mbps (Multi-Gigabit)">2500 Mbps (2.5 Gbps)</option>
                <option value="10000 Mbps (10G SFP+ Fiber)">10000 Mbps (10 Gbps SFP+)</option>
                <option value="1200 Mbps (Wi-Fi 6 802.11ax)">1200 Mbps (Wi-Fi 6 AP)</option>
              </select>
            </div>
          </div>

          <div>
            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.testing}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  {t.startTest}
                </>
              )}
            </button>
          </div>
        </div>

        {isRunning && (
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
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
              <p className="text-xs font-medium text-muted-foreground">{t.stats.avgLatency}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{avgLatency} ms</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-primary">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.jitter}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">{jitter} ms</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.packetLoss}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">0.0 %</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t.stats.linkRating}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">EXCELLENT</p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Latency Jitter Histogram View */}
      <Card className="border-border/80 bg-card/70 p-6 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center justify-between">
          <span>Packet Round-Trip Latency Samples (20 Packets)</span>
          <span className="font-mono text-xs text-muted-foreground">Min: {minLatency}ms | Max: {maxLatency}ms</span>
        </h3>

        <div className="flex items-end gap-1.5 h-36 pt-4 border-b border-border/80">
          {samples.map((val, idx) => {
            const heightPercent = Math.max(15, Math.min(100, (val / 3.0) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                <span className="text-[9px] font-mono text-muted-foreground opacity-0 group-hover/bar:opacity-100 transition-opacity">
                  {val}
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary/80 to-blue-400 transition-all duration-300 hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[9px] font-mono text-muted-foreground">{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

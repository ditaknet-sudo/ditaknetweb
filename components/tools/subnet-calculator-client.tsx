"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Binary,
  Calculator,
  CheckCircle2,
  Copy,
  Download,
  Layers,
  Network,
  Share2,
  Terminal,
  Zap
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

const copy = {
  en: {
    badge: "DitakNet IPAM & Network Design",
    title: "IPv4 Subnet Calculator & CIDR Planner",
    desc: "Calculate network addresses, subnet masks, wildcard masks, usable host boundaries, and split subnets into segmented 802.1Q VLANs.",
    downloadWin: "Download Windows ZIP",
    ipLabel: "IP Address",
    prefixLabel: "Subnet Mask / CIDR",
    stats: {
      network: "Network ID",
      broadcast: "Broadcast IP",
      usableRange: "Usable Host Range",
      usableHosts: "Usable Hosts"
    },
    table: {
      vlan: "VLAN Name",
      cidr: "Subnet CIDR",
      range: "Usable IP Range",
      hosts: "Hosts Available"
    },
    vlanTitle: "VLAN Subnet Segmentation Preview",
    winBadge: "Includes DitakNet-Subnet-Calculator.bat & PowerShell runner with auto-exporting."
  },
  hy: {
    badge: "DitakNet IPAM և Ցանցային Պլանավորում",
    title: "IPv4 Ենթացանցերի Հաշվիչ և CIDR Պլանավորող",
    desc: "Հաշվարկեք ցանցի հասցեն (Network ID), ենթացանցի դիմակը (Mask), wildcard mask-ը, հասանելի հոսթերի միջակայքը և բաժանեք ցանցը 802.1Q VLAN սեգմենտների։",
    downloadWin: "Ներբեռնել Windows ZIP",
    ipLabel: "IP Հասցե",
    prefixLabel: "Ենթացանցի Դիմակ / CIDR",
    stats: {
      network: "Ցանցի ID (Network)",
      broadcast: "Broadcast Հասցե",
      usableRange: "Օգտագործելի Հոսթեր",
      usableHosts: "Հոսթերի Քանակ"
    },
    table: {
      vlan: "VLAN Անվանում",
      cidr: "Ենթացանցի CIDR",
      range: "Հոսթերի Միջակայք",
      hosts: "Հասանելի Հոսթեր"
    },
    vlanTitle: "VLAN Սեգմենտավորման Պլանավորում",
    winBadge: "Ներառում է DitakNet-Subnet-Calculator.bat և PowerShell ավտոմատ հաշվարկի սկրիպտ։"
  },
  ru: {
    badge: "DitakNet IPAM и Проектирование Сетей",
    title: "IPv4 Калькулятор Подсетей и CIDR Планировщик",
    desc: "Расчет сетевых адресов, масок подсетей, wildcard масок, диапазонов рабочих хостов и деление подсетей на 802.1Q VLAN сегменты.",
    downloadWin: "Скачать Windows ZIP",
    ipLabel: "IP Адрес",
    prefixLabel: "Маска подсети / CIDR",
    stats: {
      network: "ID Сети (Network)",
      broadcast: "Broadcast IP",
      usableRange: "Диапазон хостов",
      usableHosts: "Рабочих хостов"
    },
    table: {
      vlan: "Имя VLAN",
      cidr: "CIDR Подсети",
      range: "Рабочий диапазон",
      hosts: "Доступно узлов"
    },
    vlanTitle: "Сегментация на VLAN подсети",
    winBadge: "Включает DitakNet-Subnet-Calculator.bat и PowerShell скрипт с автосохранением."
  }
};

function ipToUint(ip: string): number {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) return 0;
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function uintToIp(uint: number): string {
  return [(uint >>> 24) & 255, (uint >>> 16) & 255, (uint >>> 8) & 255, uint & 255].join(".");
}

export function SubnetCalculatorClient({ locale }: { locale: Locale }) {
  const t = copy[locale] || copy.en;

  const [ip, setIp] = useState("192.168.1.0");
  const [prefix, setPrefix] = useState(24);

  const calc = useMemo(() => {
    const ipUint = ipToUint(ip);
    const maskUint = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcardUint = (~maskUint) >>> 0;

    const netUint = (ipUint & maskUint) >>> 0;
    const broadUint = (netUint | wildcardUint) >>> 0;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    const firstHost = prefix >= 31 ? uintToIp(netUint) : uintToIp(netUint + 1);
    const lastHost = prefix >= 31 ? uintToIp(broadUint) : uintToIp(broadUint - 1);

    // Split preview into 4 subnets if prefix <= 28
    const subnets = [];
    if (prefix <= 28) {
      const newPrefix = prefix + 2;
      const chunkSize = Math.floor(totalHosts / 4);
      for (let i = 0; i < 4; i++) {
        const sNet = netUint + i * chunkSize;
        const sBroad = sNet + chunkSize - 1;
        subnets.push({
          vlan: `VLAN ${10 * (i + 1)} (${["Management", "CCTV", "Wi-Fi", "Office"][i]})`,
          cidr: `${uintToIp(sNet)}/${newPrefix}`,
          range: `${uintToIp(sNet + 1)} - ${uintToIp(sBroad - 1)}`,
          hosts: chunkSize - 2
        });
      }
    }

    return {
      network: uintToIp(netUint),
      mask: uintToIp(maskUint),
      wildcard: uintToIp(wildcardUint),
      broadcast: uintToIp(broadUint),
      firstHost,
      lastHost,
      totalHosts,
      usableHosts,
      subnets
    };
  }, [ip, prefix]);

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                <Calculator className="h-3.5 w-3.5" />
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
              href="/downloads/subnet-calculator.zip"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              {t.downloadWin}
            </a>
          </div>
        </div>

        {/* Windows Notice Bar */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{t.winBadge}</span>
        </div>
      </Card>

      {/* Inputs Configuration */}
      <Card className="border-border/80 bg-card/60 p-5 backdrop-blur-md">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {t.ipLabel}
            </label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                {t.prefixLabel}
              </label>
              <span className="font-mono text-xs font-bold text-primary">
                /{prefix} ({calc.mask})
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={prefix}
              onChange={(e) => setPrefix(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
              <span>/8 (Class A)</span>
              <span>/16 (Class B)</span>
              <span>/24 (Class C)</span>
              <span>/30 (P2P)</span>
              <span>/32 (Host)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Calculation KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.network}</p>
          <p className="mt-1 font-mono text-xl font-bold text-foreground">{calc.network}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Mask: {calc.mask}</p>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.broadcast}</p>
          <p className="mt-1 font-mono text-xl font-bold text-magenta-400">{calc.broadcast}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Wildcard: {calc.wildcard}</p>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.usableRange}</p>
          <p className="mt-1 font-mono text-xs font-bold text-emerald-400 truncate">
            {calc.firstHost} – {calc.lastHost}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">First - Last valid IP</p>
        </Card>

        <Card className="border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground">{t.stats.usableHosts}</p>
          <p className="mt-1 font-mono text-xl font-bold text-cyan-400">
            {calc.usableHosts.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Total: {calc.totalHosts.toLocaleString()}</p>
        </Card>
      </div>

      {/* VLAN Subdivision Planner */}
      {calc.subnets.length > 0 && (
        <Card className="overflow-hidden border-border/80 bg-card/70 backdrop-blur-md p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span>{t.vlanTitle}</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">{t.table.vlan}</th>
                  <th className="px-4 py-3">{t.table.cidr}</th>
                  <th className="px-4 py-3">{t.table.range}</th>
                  <th className="px-4 py-3">{t.table.hosts}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {calc.subnets.map((sub, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-foreground">{sub.vlan}</td>
                    <td className="px-4 py-3 font-mono text-primary font-medium">{sub.cidr}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{sub.range}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-bold">
                      {sub.hosts} hosts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

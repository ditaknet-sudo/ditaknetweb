import { Cloud, Network, Radar, ServerCog } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

const copy = {
  en: {
    eyebrow: "DitakNet IT Tools",
    title: "Practical tools for IT professionals",
    description:
      "A growing set of self-hosted tools for discovering networks, understanding VLANs, monitoring services, and keeping team information private.",
    privateLabel: "Self-hosted",
    modules: [
      {
        name: "LAN Scan",
        description:
          "Discover devices on the local network, identify IP and MAC addresses, vendors, open services, and changes between scans.",
        features: ["Fast subnet discovery", "Device inventory", "Change detection"],
        icon: Radar
      },
      {
        name: "VLAN Scan",
        description:
          "Map VLAN segments and monitored subnets so IT teams can understand isolation, gateways, and reachable infrastructure.",
        features: ["VLAN inventory", "Subnet visibility", "Gateway mapping"],
        icon: Network
      },
      {
        name: "DitakNet Cloud",
        description:
          "Private, self-hosted storage for people and team records, documents, files, notes, and backups on infrastructure you control.",
        features: ["People records", "Private files", "Role-based access"],
        icon: Cloud
      },
      {
        name: "Service Watch",
        description:
          "Monitor websites, APIs, ports, servers, and internal services with scheduled checks and clear incident history.",
        features: ["HTTP/TCP checks", "Uptime history", "Alert-ready"],
        icon: ServerCog
      }
    ]
  },
  hy: {
    eyebrow: "DitakNet IT Tools",
    title: "Գործնական գործիքներ ՏՏ մասնագետների համար",
    description:
      "Self-hosted գործիքների աճող հավաքածու՝ ցանցերի հայտնաբերման, VLAN-ների տեսանելիության, service monitoring-ի և թիմային տվյալների մասնավոր պահպանման համար։",
    privateLabel: "Self-hosted",
    modules: [
      {
        name: "LAN Scan",
        description:
          "Հայտնաբերում է տեղային ցանցի սարքերը, IP/MAC հասցեները, vendor-ները, բաց service-ները և scan-ների միջև փոփոխությունները։",
        features: ["Արագ subnet discovery", "Սարքերի inventory", "Փոփոխությունների հայտնաբերում"],
        icon: Radar
      },
      {
        name: "VLAN Scan",
        description:
          "Քարտեզագրում է VLAN segment-ներն ու subnet-ները՝ isolation-ը, gateway-ները և հասանելի ենթակառուցվածքը հասկանալու համար։",
        features: ["VLAN inventory", "Subnet visibility", "Gateway mapping"],
        icon: Network
      },
      {
        name: "DitakNet Cloud",
        description:
          "Մարդկանց և թիմի տվյալների, փաստաթղթերի, ֆայլերի, նշումների ու backup-ների մասնավոր self-hosted պահոց՝ ձեր սեփական սերվերում։",
        features: ["Մարդկանց տվյալներ", "Մասնավոր ֆայլեր", "Դերերով հասանելիություն"],
        icon: Cloud
      },
      {
        name: "Service Watch",
        description:
          "Հետևում է կայքերին, API-ներին, port-երին, server-ներին և ներքին service-ներին՝ պարբերական check-երով։",
        features: ["HTTP/TCP checks", "Uptime history", "Alerts"],
        icon: ServerCog
      }
    ]
  },
  ru: {
    eyebrow: "DitakNet IT Tools",
    title: "Практичные инструменты для IT-специалистов",
    description:
      "Набор self-hosted инструментов для поиска устройств, анализа VLAN, мониторинга сервисов и приватного хранения данных команды.",
    privateLabel: "Self-hosted",
    modules: [
      {
        name: "LAN Scan",
        description:
          "Находит устройства локальной сети, IP/MAC-адреса, производителей, открытые сервисы и изменения между сканированиями.",
        features: ["Быстрый поиск подсетей", "Инвентаризация", "Поиск изменений"],
        icon: Radar
      },
      {
        name: "VLAN Scan",
        description:
          "Картографирует VLAN-сегменты и подсети, помогая понять изоляцию, шлюзы и доступную инфраструктуру.",
        features: ["Инвентаризация VLAN", "Обзор подсетей", "Карта шлюзов"],
        icon: Network
      },
      {
        name: "DitakNet Cloud",
        description:
          "Приватное self-hosted хранилище данных людей и команды, документов, файлов, заметок и резервных копий на вашем сервере.",
        features: ["Карточки людей", "Приватные файлы", "Ролевой доступ"],
        icon: Cloud
      },
      {
        name: "Service Watch",
        description:
          "Контролирует сайты, API, порты, серверы и внутренние сервисы по расписанию с понятной историей сбоев.",
        features: ["HTTP/TCP проверки", "История uptime", "Оповещения"],
        icon: ServerCog
      }
    ]
  }
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    privateLabel: string;
    modules: Array<{
      name: string;
      description: string;
      features: string[];
      icon: typeof Radar;
    }>;
  }
>;

export function ItToolsSuite({ locale, headingLevel = "h2" }: { locale: Locale; headingLevel?: "h1" | "h2" }) {
  const content = copy[locale];
  const Heading = headingLevel;

  return (
    <section aria-labelledby="it-tools-title">
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{content.eyebrow}</p>
      <Heading id="it-tools-title" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        {content.title}
      </Heading>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{content.description}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {content.modules.map((module) => (
          <Card key={module.name} className="group relative overflow-hidden p-6 transition hover:border-[var(--accent)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-2xl" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--panel-soft)] text-[var(--brand)]">
                <module.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold">{module.name}</h3>
                <span className="rounded-full bg-[var(--panel-soft)] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-[var(--accent)]">
                  {content.privateLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{module.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {module.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

import {
  Activity,
  ArrowRight,
  Building2,
  Calculator,
  Camera,
  Cloud,
  Download,
  ExternalLink,
  Gauge,
  Hotel,
  Laptop,
  Layers,
  MessageSquare,
  Network,
  Play,
  Radar,
  ServerCog,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n-core";

const copy = {
  en: {
    eyebrow: "DitakNet IT Tools & Software Suite",
    title: "Practical tools for IT professionals",
    description:
      "A growing set of specialized tools available as native Windows standalone packages and modern installable PWAs (Progressive Web Apps).",
    privateLabel: "Self-hosted",
    authorLabel: "Created by DitakNet",
    openToolText: "Open PWA App",
    downloadWinText: "Windows ZIP",
    modules: [
      {
        name: "Local IP Messenger",
        tag: "Zero-Cloud & PWA",
        description:
          "Private peer-to-peer local IP messenger for workgroups. Communicate directly by device IP without internet, with all history stored strictly on local device storage.",
        features: ["Direct chat by local IP", "PWA & Windows Daemon", "100% Local memory (Zero-Cloud)"],
        icon: MessageSquare,
        href: "/tools/ip-messenger",
        downloadUrl: "/downloads/ip-messenger.zip"
      },
      {
        name: "LAN Scan",
        tag: "Windows & PWA",
        description:
          "Discover devices on the local network, identify IP and MAC addresses, vendors, open services, and changes between scans.",
        features: ["Fast subnet discovery", "Device inventory", "Change detection"],
        icon: Radar,
        href: "/tools/lan-scan",
        downloadUrl: "/downloads/lan-scan.zip"
      },
      {
        name: "VLAN Scan",
        tag: "Windows & PWA",
        description:
          "Map VLAN segments and monitored subnets so IT teams can understand isolation, gateways, and reachable infrastructure.",
        features: ["VLAN inventory", "Subnet visibility", "Gateway mapping"],
        icon: Network,
        href: "/tools/vlan-scan",
        downloadUrl: "/downloads/vlan-scan.zip"
      },
      {
        name: "Interactive Patch Panel",
        tag: "Author Tool",
        description:
          "Visual patch panel and rack mapping tool created to simplify cable tracing, port assignments, and network documentation for IT technicians.",
        features: ["Visual 24/48-port mapping", "Switch-to-panel sync", "Color-coded cables"],
        icon: Layers,
        href: "/tools/patch-panel",
        downloadUrl: "/downloads/patch-panel.zip"
      },
      {
        name: "Network Explorer",
        tag: "Diagnostics",
        description:
          "In-depth network exploration tool to discover active subnets, open ports, device vendors, latency spikes, and routing hops in real time.",
        features: ["Deep subnet sweep", "Port & latency analyzer", "Device classification"],
        icon: Activity,
        href: "/tools/network-explorer",
        downloadUrl: "/downloads/network-explorer.zip"
      },
      {
        name: "CCTV Camera Probe",
        tag: "Security & RTSP",
        description:
          "Scan subnets for IP cameras (Dahua, Hikvision, Uniview, Axis), check RTSP port 554, ONVIF discovery, and stream testing.",
        features: ["Auto-discover IP cameras", "RTSP stream URLs", "Vendor identification"],
        icon: Camera,
        href: "/tools/cctv-probe",
        downloadUrl: "/downloads/cctv-probe.zip"
      },
      {
        name: "Bandwidth & Jitter Test",
        tag: "Benchmark",
        description:
          "Benchmark physical adapter link speed, packet jitter (PDV), gateway latency, and packet loss rate.",
        features: ["Link speed check", "Jitter (PDV) metrics", "Packet loss testing"],
        icon: Gauge,
        href: "/tools/bandwidth-test",
        downloadUrl: "/downloads/bandwidth-test.zip"
      },
      {
        name: "IPv4 Subnet Calculator",
        tag: "IPAM & Design",
        description:
          "Compute network addresses, subnet masks, wildcard masks, usable host boundaries, and plan 802.1Q VLAN segments.",
        features: ["CIDR /8 to /32 math", "VLAN subnetting", "Usable IP ranges"],
        icon: Calculator,
        href: "/tools/subnet-calculator",
        downloadUrl: "/downloads/subnet-calculator.zip"
      },
      {
        name: "Port Audit & NAT Check",
        tag: "Firewall & Security",
        description:
          "Fast reachability and security exposure audit for critical service ports (Web, SSH, RDP, RTSP, SMB, SQL, VPN).",
        features: ["Critical service checks", "Firewall NAT audit", "Security posture score"],
        icon: ShieldAlert,
        href: "/tools/port-audit",
        downloadUrl: "/downloads/port-audit.zip"
      },
      {
        name: "DitakNet Cloud",
        tag: "Data",
        description:
          "Private, self-hosted storage for people and team records, documents, files, notes, and backups on infrastructure you control.",
        features: ["People records", "Private files", "Role-based access"],
        icon: Cloud,
        href: "/contact",
        downloadUrl: "/downloads/cloud.zip"
      },
      {
        name: "Service Watch",
        tag: "Monitoring",
        description:
          "Monitor websites, APIs, ports, servers, and internal services with scheduled checks and clear incident history.",
        features: ["HTTP/TCP checks", "Uptime history", "Alert-ready"],
        icon: ServerCog,
        href: "/tools/service-watch",
        downloadUrl: "/downloads/service-watch.zip"
      }
    ],
    businessBanner: {
      eyebrow: "Business Platforms",
      hotelTitle: "Your Business in One Place — Hotel PMS",
      hotelDesc: "Complete hotel management on hotel.ditaknet.com: bookings, check-in, POS, housekeeping, Wi-Fi and CCTV integration.",
      hotelCta: "Connect to hotel.ditaknet.com",
      residentialTitle: "Residential & Complex Management",
      residentialDesc: "Turnkey platforms for apartment complexes, condominiums, and gated communities. Custom built or upgraded to your preferences in 2-3 months.",
      residentialCta: "Request Custom Software (2-3 Months)"
    }
  },
  hy: {
    eyebrow: "DitakNet ՏՏ Գործիքներ և Ծրագրեր",
    title: "Գործնական ծրագրեր ՏՏ մասնագետների համար",
    description:
      "Մասնագիտական ծրագրերի հավաքածու՝ պատրաստված Windows-ի համար և որպես ժամանակակից PWA (Progressive Web App) հավելվածներ։",
    privateLabel: "Self-hosted",
    authorLabel: "Հեղինակային լուծում",
    openToolText: "Բացել PWA Ծրագիրը",
    downloadWinText: "Windows ZIP",
    modules: [
      {
        name: "Local IP Messenger (Ներցանցային Չատ)",
        tag: "Zero-Cloud & PWA",
        description:
          "Նմանը չունեցող տեղային IP Messenger ՏՏ մասնագետների և գրասենյակների համար։ Աշխատում է առանց ինտերնետի ըստ սարքի IP-ի, հիշողությունը բացառապես տեղային սարքի վրա։",
        features: ["Ուղիղ չատ ըստ Local IP-ի", "PWA և Windows Daemon", "100% Տեղային Հիշողություն (Zero-Cloud)"],
        icon: MessageSquare,
        href: "/tools/ip-messenger",
        downloadUrl: "/downloads/ip-messenger.zip"
      },
      {
        name: "LAN Scan",
        tag: "Windows & PWA",
        description:
          "Հայտնաբերում է տեղային ցանցի սարքերը, IP/MAC հասցեները, vendor-ները, բաց service-ները և scan-ների միջև փոփոխությունները։",
        features: ["Արագ subnet discovery", "Սարքերի inventory", "Փոփոխությունների հայտնաբերում"],
        icon: Radar,
        href: "/tools/lan-scan",
        downloadUrl: "/downloads/lan-scan.zip"
      },
      {
        name: "VLAN Scan",
        tag: "Windows & PWA",
        description:
          "Քարտեզագրում է VLAN segment-ներն ու subnet-ները՝ isolation-ը, gateway-ները և հասանելի ենթակառուցվածքը հասկանալու համար։",
        features: ["VLAN inventory", "Subnet visibility", "Gateway mapping"],
        icon: Network,
        href: "/tools/vlan-scan",
        downloadUrl: "/downloads/vlan-scan.zip"
      },
      {
        name: "Ինտերակտիվ Պաչ Պանել",
        tag: "Հեղինակային",
        description:
          "Իմ կողմից ստեղծված հեղինակային ծրագիր ՏՏ մասնագետների համար՝ ռեկերի և պաչ պանելների վիզուալ կառավարում, պորտերի քարտեզագրում և մալուխների արագ հետագծում։",
        features: ["24/48 պորտ վիզուալացում", "Switch-to-panel կապեր", "Գունային մակնշում"],
        icon: Layers,
        href: "/tools/patch-panel",
        downloadUrl: "/downloads/patch-panel.zip"
      },
      {
        name: "Ցանցի Ուսումնասիրություն (Network Explorer)",
        tag: "Դիագնոստիկա",
        description:
          "ՏՏ մասնագետների աշխատանքը հեշտացնող գործիք՝ տեղային ենթացանցերի խորքային ուսումնասիրություն, ակտիվ սարքերի, բաց պորտերի և latency-ի live ստուգում։",
        features: ["Խորքային ենթացանցերի sweep", "Պորտերի և latency անալիզ", "Սարքերի նույնականացում"],
        icon: Activity,
        href: "/tools/network-explorer",
        downloadUrl: "/downloads/network-explorer.zip"
      },
      {
        name: "CCTV Camera Probe (Տեսահսկման Սքաներ)",
        tag: "Անվտանգություն",
        description:
          "IP տեսախցիկների (Dahua, Hikvision, Uniview, Axis) ավտոմատ որոնում ենթացանցում, RTSP պորտ 554-ի, ONVIF-ի և սթրիմերի ստուգում։",
        features: ["IP տեսախցիկների հայտնաբերում", "RTSP հղումների գեներացիա", "ONVIF և արտադրողի նույնականացում"],
        icon: Camera,
        href: "/tools/cctv-probe",
        downloadUrl: "/downloads/cctv-probe.zip"
      },
      {
        name: "Bandwidth & Jitter Test (Ցանցի Որակի Թեստ)",
        tag: "Բենչմարկ",
        description:
          "Ցանցային ադապտերների արագության, gateway latency-ի, jitter-ի (PDV) և packet loss-ի իրական թեստավորում։",
        features: ["Ադապտերի արագություն", "Jitter (PDV) չափում", "Packet loss ստուգում"],
        icon: Gauge,
        href: "/tools/bandwidth-test",
        downloadUrl: "/downloads/bandwidth-test.zip"
      },
      {
        name: "Subnet Calculator (Ենթացանցերի Հաշվիչ)",
        tag: "IPAM & Պլանավորում",
        description:
          "IPv4/CIDR հաշվիչ, հասցեների դիապազոններ, broadcast, wildcard mask և VLAN-ների ավտոմատ բաժանման պլանավորում։",
        features: ["CIDR /8-ից /32 հաշվարկ", "VLAN-ների բաժանում", "Օգտագործելի IP միջակայքեր"],
        icon: Calculator,
        href: "/tools/subnet-calculator",
        downloadUrl: "/downloads/subnet-calculator.zip"
      },
      {
        name: "Port Audit & NAT Check (Պորտերի Աուդիտ)",
        tag: "Firewall & Անվտանգություն",
        description:
          "Կրիտիկական պորտերի (Web, SSH, RDP, RTSP, SMB, SQL, VPN) հասանելիության և firewall-ի անվտանգության արագ աուդիտ։",
        features: ["Կրիտիկական պորտերի ստուգում", "Firewall NAT աուդիտ", "Անվտանգության գնահատական"],
        icon: ShieldAlert,
        href: "/tools/port-audit",
        downloadUrl: "/downloads/port-audit.zip"
      },
      {
        name: "DitakNet Cloud",
        tag: "Տվյալներ",
        description:
          "Մարդկանց և թիմի տվյալների, փաստաթղթերի, ֆայլերի, նշումների ու backup-ների մասնավոր self-hosted պահոց՝ ձեր սեփական սերվերում։",
        features: ["Մարդկանց տվյալներ", "Մասնավոր ֆայլեր", "Դերերով հասանելիություն"],
        icon: Cloud,
        href: "/contact",
        downloadUrl: "/downloads/cloud.zip"
      },
      {
        name: "Service Watch",
        tag: "Մոնիթորինգ",
        description:
          "Հետևում է կայքերին, API-ներին, port-երին, server-ներին և ներքին service-ներին՝ պարբերական check-երով։",
        features: ["HTTP/TCP checks", "Uptime history", "Alerts"],
        icon: ServerCog,
        href: "/tools/service-watch",
        downloadUrl: "/downloads/service-watch.zip"
      }
    ],
    businessBanner: {
      eyebrow: "Բիզնես լուծումներ",
      hotelTitle: "Քո բիզնեսը մեկ տեղում — Հյուրանոցային ծրագիր",
      hotelDesc: "Միացեք hotel.ditaknet.com հարթակին. սենյակների ամրագրում, check-in/out, վճարումներ, մաքրության հսկողություն և DitakNet սերվերի հետ միասնական Wi-Fi ու CCTV տեսահսկում։",
      hotelCta: "Միանալ hotel.ditaknet.com-ին",
      residentialTitle: "Բնակելի հատվածների և համալիրների կառավարում",
      residentialDesc: "Ծրագրեր բնակելի շենքերի, համալիրների և թաղամասերի համար, որոնք պատրաստվում կամ թարմացվում են ձեր իսկ նախընտրանքով 2-3 ամսվա ընթացքում։",
      residentialCta: "Պատվիրել անհատական ծրագիր (2-3 ամիս)"
    }
  },
  ru: {
    eyebrow: "DitakNet IT Инструменты и Программы",
    title: "Практичные программы для IT-специалистов",
    description:
      "Набор специализированных инструментов для Windows и в виде современных PWA (Progressive Web Apps) приложений.",
    privateLabel: "Self-hosted",
    authorLabel: "Авторское решение",
    openToolText: "Открыть PWA приложение",
    downloadWinText: "Windows ZIP",
    modules: [
      {
        name: "Local IP Messenger (Локальный Чат)",
        tag: "Zero-Cloud & PWA",
        description:
          "Уникальный локальный IP мессенджер для локальной сети. Прямой чат по IP устройства без интернета, история и логи сохраняются исключительно на вашем компьютере.",
        features: ["Прямой чат по IP адресу", "PWA и Windows сервис", "100% Локальная память (Zero-Cloud)"],
        icon: MessageSquare,
        href: "/tools/ip-messenger",
        downloadUrl: "/downloads/ip-messenger.zip"
      },
      {
        name: "LAN Scan",
        tag: "Windows & PWA",
        description:
          "Находит устройства локальной сети, IP/MAC-адреса, производителей, открытые сервисы и изменения между сканированиями.",
        features: ["Быстрый поиск подсетей", "Инвентаризация", "Поиск изменений"],
        icon: Radar,
        href: "/tools/lan-scan",
        downloadUrl: "/downloads/lan-scan.zip"
      },
      {
        name: "VLAN Scan",
        tag: "Windows & PWA",
        description:
          "Картографирует VLAN-сегменты и подсети, помогая понять изоляцию, шлюзы и доступную инфраструктуру.",
        features: ["Инвентаризация VLAN", "Обзор подсетей", "Карта шлюзов"],
        icon: Network,
        href: "/tools/vlan-scan",
        downloadUrl: "/downloads/vlan-scan.zip"
      },
      {
        name: "Интерактивная Патч-Панель",
        tag: "Авторское",
        description:
          "Авторская программа для IT-специалистов: визуальное управление серверными стойками и патч-панелями, маппинг портов и быстрая маркировка кабелей.",
        features: ["Визуализация 24/48 портов", "Связи switch-to-panel", "Цветовая маркировка"],
        icon: Layers,
        href: "/tools/patch-panel",
        downloadUrl: "/downloads/patch-panel.zip"
      },
      {
        name: "Исследование Сети (Network Explorer)",
        tag: "Диагностика",
        description:
          "Инструмент для сетевых инженеров: глубокое исследование подсетей, проверка активных хостов, открытых портов и задержек в реальном времени.",
        features: ["Глубокое сканирование подсетей", "Анализ портов и latency", "Идентификация хостов"],
        icon: Activity,
        href: "/tools/network-explorer",
        downloadUrl: "/downloads/network-explorer.zip"
      },
      {
        name: "CCTV Camera Probe (Сканер Камер)",
        tag: "Безопасность",
        description:
          "Автопоиск IP-камер (Dahua, Hikvision, Uniview, Axis) в подсетях, проверка RTSP порта 554, ONVIF и тестирование потоков.",
        features: ["Поиск IP-камер", "Генерация RTSP ссылок", "Определение вендоров"],
        icon: Camera,
        href: "/tools/cctv-probe",
        downloadUrl: "/downloads/cctv-probe.zip"
      },
      {
        name: "Bandwidth & Jitter Test (Тест Качества Сети)",
        tag: "Бенчмарк",
        description:
          "Тест физической скорости адаптеров, задержки шлюза, джиттера (PDV) и потерь пакетов.",
        features: ["Скорость линка", "Метрики джиттера (PDV)", "Тест потерь пакетов"],
        icon: Gauge,
        href: "/tools/bandwidth-test",
        downloadUrl: "/downloads/bandwidth-test.zip"
      },
      {
        name: "Subnet Calculator (Калькулятор Подсетей)",
        tag: "IPAM & Дизайн",
        description:
          "IPv4/CIDR калькулятор, диапазоны хостов, широковещательные адреса, маски и планирование VLAN.",
        features: ["CIDR расчет /8 - /32", "Разделение на VLAN", "Диапазоны рабочих IP"],
        icon: Calculator,
        href: "/tools/subnet-calculator",
        downloadUrl: "/downloads/subnet-calculator.zip"
      },
      {
        name: "Port Audit & NAT Check (Аудит Портов)",
        tag: "Firewall & Безопасность",
        description:
          "Быстрый аудит доступности критических портов (Web, SSH, RDP, RTSP, SMB, SQL, VPN) и безопасности firewall.",
        features: ["Проверка критических служб", "Аудит Firewall NAT", "Оценка защищенности"],
        icon: ShieldAlert,
        href: "/tools/port-audit",
        downloadUrl: "/downloads/port-audit.zip"
      },
      {
        name: "DitakNet Cloud",
        tag: "Данные",
        description:
          "Приватное self-hosted хранилище данных людей и команды, документов, файлов, заметок и резервных копий на вашем сервере.",
        features: ["Карточки людей", "Приватные файлы", "Ролевой доступ"],
        icon: Cloud,
        href: "/contact",
        downloadUrl: "/downloads/cloud.zip"
      },
      {
        name: "Service Watch",
        tag: "Мониторинг",
        description:
          "Контролирует сайты, API, порты, серверы и внутренние сервисы по расписанию с понятной историей сбоев.",
        features: ["HTTP/TCP проверки", "История uptime", "Оповещения"],
        icon: ServerCog,
        href: "/tools/service-watch",
        downloadUrl: "/downloads/service-watch.zip"
      }
    ],
    businessBanner: {
      eyebrow: "Бизнес-платформы",
      hotelTitle: "Твой бизнес в одном месте — Отельная система",
      hotelDesc: "Подключайтесь к hotel.ditaknet.com: бронирование, заезд/выезд, счета, контроль уборки и интеграция с видеонаблюдением и сетью DitakNet.",
      hotelCta: "Подключиться к hotel.ditaknet.com",
      residentialTitle: "Управление жилыми комплексами и зданиями",
      residentialDesc: "Системы для ЖК, поселков и управляющих компаний, создаваемые или обновляемые под ваши требования всего за 2-3 месяца.",
      residentialCta: "Заказать разработку (2-3 месяца)"
    }
  }
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    privateLabel: string;
    authorLabel: string;
    openToolText: string;
    downloadWinText: string;
    modules: Array<{
      name: string;
      tag: string;
      description: string;
      features: string[];
      icon: typeof Radar;
      href: string;
      downloadUrl: string;
    }>;
    businessBanner: {
      eyebrow: string;
      hotelTitle: string;
      hotelDesc: string;
      hotelCta: string;
      residentialTitle: string;
      residentialDesc: string;
      residentialCta: string;
    };
  }
>;

export function ItToolsSuite({ locale, headingLevel = "h2" }: { locale: Locale; headingLevel?: "h1" | "h2" }) {
  const content = copy[locale];
  const Heading = headingLevel;

  return (
    <section aria-labelledby="it-tools-title" className="space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{content.eyebrow}</span>
        </div>
        <Heading id="it-tools-title" className="mt-3 text-3xl font-black tracking-tight text-[var(--foreground)] md:text-4xl">
          {content.title}
        </Heading>
        <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{content.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.modules.map((module) => (
          <Card key={module.name} className="group relative flex flex-col overflow-hidden p-6 transition-all hover:border-[var(--accent)] hover:shadow-lg">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-2xl" />
            <div className="relative flex flex-1 flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--panel-soft)] text-[var(--brand)] shadow-sm group-hover:scale-105 transition-transform">
                  <module.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="rounded-full bg-[var(--panel-soft)] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-[var(--accent)]">
                  {module.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">{module.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)] flex-1">{module.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {module.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Buttons: Live PWA and Windows Download */}
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-4">
                <Link
                  href={`/${locale}${module.href}`}
                  className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--brand)] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
                >
                  <Play className="h-3 w-3" />
                  <span>{content.openToolText}</span>
                </Link>

                <a
                  href={module.downloadUrl}
                  download
                  title="Download Windows Executable / Scripts"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:border-[var(--brand)] transition"
                >
                  <Download className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>{content.downloadWinText}</span>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Business Solutions Section */}
      <div className="rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)] p-6 md:p-10 shadow-sm">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            {content.businessBanner.eyebrow}
          </span>
          <h3 className="mt-1 text-2xl font-black text-[var(--foreground)] md:text-3xl">
            DitakNet Business Platforms
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hotel PMS */}
          <div className="flex flex-col justify-between rounded-xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-2.5 py-1 text-xs font-bold text-white">
                  <Hotel className="h-3.5 w-3.5" /> hotel.ditaknet.com
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live PMS</span>
              </div>
              <h4 className="text-lg font-bold text-[var(--foreground)]">{content.businessBanner.hotelTitle}</h4>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{content.businessBanner.hotelDesc}</p>
            </div>
            <div className="mt-6">
              <a
                href="https://hotel.ditaknet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-10 w-full items-center justify-between rounded-md bg-[var(--brand)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
              >
                <span>{content.businessBanner.hotelCta}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Residential Complex PMS */}
          <div className="flex flex-col justify-between rounded-xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-white">
                  <Building2 className="h-3.5 w-3.5" /> 2-3 Months Turnkey
                </span>
                <span className="text-xs font-semibold text-[var(--accent)]">Custom Tailored</span>
              </div>
              <h4 className="text-lg font-bold text-[var(--foreground)]">{content.businessBanner.residentialTitle}</h4>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{content.businessBanner.residentialDesc}</p>
            </div>
            <div className="mt-6">
              <ButtonLink
                href={`/${locale}/contact?service=residential`}
                variant="secondary"
                size="md"
                className="w-full justify-between font-bold"
              >
                <span>{content.businessBanner.residentialCta}</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

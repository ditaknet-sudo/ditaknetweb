import { CheckCircle2, Code2, Container } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Locale, Messages } from "@/lib/i18n-core";
import { cn } from "@/lib/utils";

const copy: Record<
  Locale,
  {
    free: { label: string; title: string; price: string; description: string; features: string[]; cta: string };
    service: { label: string; title: string; price: string; description: string; features: string[]; cta: string };
  }
> = {
  hy: {
    free: {
      label: "Անվճար",
      title: "Ինքնուրույն տեղադրում",
      price: "0 դրամ",
      description: "Տեղադրեք DitakNet-ը ձեր Docker, Linux կամ TrueNAS SCALE համակարգում և օգտագործեք անվճար։",
      features: [
        "Անվճար ինքնուրույն օգտագործում",
        "Docker տեղադրում",
        "Տեղային ցանցի մոնիթորինգ",
        "Տվյալները մնում են ձեր սերվերում",
        "Առանց պարտադիր բաժանորդագրության",
        "Հարմար home lab-ի և փոքր ցանցերի համար"
      ],
      cta: "Դիտել տեղադրման ուղեցույցը"
    },
    service: {
      label: "Մասնագիտական ծառայություն",
      title: "Տեղադրում և ծրագրավորում",
      price: "Գինը՝ ըստ աշխատանքի",
      description: "Վճարում եք միայն այն դեպքում, երբ ցանկանում եք, որ մենք տեղադրենք, կարգավորենք կամ ծրագրավորենք համակարգը ձեր պահանջներով։",
      features: [
        "Մասնագիտական Docker/Linux տեղադրում",
        "Ցանցի և սարքերի կարգավորում",
        "Անհատական ինտեգրացիաներ",
        "Ծրագրավորում ըստ պահանջի",
        "Տվյալների տեղափոխում և backup",
        "Տեխնիկական աջակցություն"
      ],
      cta: "Պատվիրել մասնագիտական աշխատանք"
    }
  },
  en: {
    free: {
      label: "Free",
      title: "Self-installation",
      price: "$0",
      description: "Install DitakNet on your own Docker, Linux, or TrueNAS SCALE system and use it free of charge.",
      features: [
        "Free self-hosted use",
        "Docker deployment",
        "Local network monitoring",
        "Data stays on your server",
        "No mandatory subscription",
        "Ideal for home labs and small networks"
      ],
      cta: "Read the installation guide"
    },
    service: {
      label: "Professional service",
      title: "Installation and development",
      price: "Quoted per project",
      description: "You pay only when you want us to install, configure, integrate, or customize DitakNet for your requirements.",
      features: [
        "Professional Docker/Linux installation",
        "Network and device configuration",
        "Custom integrations",
        "Development for your requirements",
        "Migration and backup setup",
        "Technical support"
      ],
      cta: "Request professional service"
    }
  },
  ru: {
    free: {
      label: "Бесплатно",
      title: "Самостоятельная установка",
      price: "0 ₽",
      description: "Установите DitakNet на собственный Docker, Linux или TrueNAS SCALE и используйте бесплатно.",
      features: [
        "Бесплатное self-hosted использование",
        "Установка через Docker",
        "Мониторинг локальной сети",
        "Данные остаются на вашем сервере",
        "Без обязательной подписки",
        "Для home lab и небольших сетей"
      ],
      cta: "Открыть руководство"
    },
    service: {
      label: "Профессиональная услуга",
      title: "Установка и разработка",
      price: "Цена по проекту",
      description: "Вы платите только если хотите, чтобы мы установили, настроили, интегрировали или доработали DitakNet под ваши задачи.",
      features: [
        "Профессиональная установка Docker/Linux",
        "Настройка сети и устройств",
        "Индивидуальные интеграции",
        "Разработка под ваши требования",
        "Миграция и настройка backup",
        "Техническая поддержка"
      ],
      cta: "Заказать профессиональную услугу"
    }
  }
};

export function PricingTable({
  locale,
  compact = false
}: {
  locale: string;
  messages?: Messages;
  compact?: boolean;
  planSet?: "all" | "commercial";
}) {
  const language = (locale in copy ? locale : "en") as Locale;
  const options = copy[language];
  const cards = [
    { ...options.free, icon: Container, href: `/${language}/deployment`, featured: false },
    { ...options.service, icon: Code2, href: `/${language}/contact`, featured: true }
  ];

  return (
    <div className={cn("grid gap-5 md:grid-cols-2", compact ? "mx-auto max-w-5xl" : "mx-auto max-w-6xl")}>
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn("flex flex-col p-6", card.featured && "border-[var(--accent)] shadow-[var(--shadow)]")}
        >
          <div className="mb-4">
            <card.icon className="mb-4 h-8 w-8 text-[var(--accent)]" aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{card.label}</p>
            <h3 className="mt-1 text-2xl font-bold">{card.title}</h3>
            <p className="mt-2 text-lg font-semibold">{card.price}</p>
            <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
          </div>
          <ul className="flex-1 space-y-3">
            {card.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm leading-6">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={card.href}
            variant={card.featured ? "secondary" : "outline"}
            className="mt-5 w-full"
          >
            {card.cta}
          </ButtonLink>
        </Card>
      ))}
    </div>
  );
}

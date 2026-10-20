import { Locale } from "@/lib/i18n-core";

export type DocSection = {
  title: string;
  content: string;
  code?: string;
  codeLang?: string;
  callout?: {
    type: "note" | "tip" | "warning";
    text: string;
  };
};

export type DocContent = {
  title: string;
  description: string;
  sections: DocSection[];
};

export const docsContent: Record<string, Record<Locale, DocContent>> = {
  "getting-started": {
    en: {
      title: "Getting Started with DitakNet",
      description: "Quick introduction to DitakNet local network monitoring, system requirements, and core concepts.",
      sections: [
        {
          title: "1. Overview & Architecture",
          content:
            "DitakNet is a local-first, self-hosted network monitoring server and IT toolkit designed for home labs, office networks, and CCTV infrastructure. Unlike cloud SaaS monitors, all device metrics, logs, and topology maps remain entirely on your own hardware.",
          callout: {
            type: "note",
            text: "DitakNet runs locally on port 5833 and does not require an active external internet connection to monitor your local subnet."
          }
        },
        {
          title: "2. System Requirements",
          content:
            "DitakNet is lightweight and optimized for standard x86_64 and ARM64 servers, mini PCs, or NAS appliances.",
          code: "- CPU: 2 Cores minimum (4 Cores recommended for 500+ nodes)\n- RAM: 2 GB minimum (4 GB recommended)\n- Storage: 10 GB SSD/HDD for long-term telemetry\n- Supported OS: Ubuntu 22.04/24.04, Debian 12, TrueNAS SCALE, Windows 10/11/Server (via Standalone CLI / PWA)\n- Docker: Engine 24.0+ and Docker Compose v2+",
          codeLang: "yaml"
        },
        {
          title: "3. Quick Start Workflow",
          content:
            "Deploy the Docker container or run the standalone Windows tools to start discovering IP devices, verifying RTSP CCTV camera feeds, and checking service availability.",
          code: "# Clone or download DitakNet configuration\nmkdir -p ~/ditaknet && cd ~/ditaknet\ncurl -O https://ditaknet.com/downloads/docker-compose.yml\ndocker compose up -d\n\n# Access Web Dashboard\n# http://localhost:5833 or http://<your-server-ip>:5833",
          codeLang: "bash"
        }
      ]
    },
    hy: {
      title: "Սկսել աշխատանքը DitakNet-ի հետ",
      description: "DitakNet տեղային ցանցային մոնիթորինգի հիմնական հասկացությունները, պահանջները և մեկնարկը։",
      sections: [
        {
          title: "1. Ընդհանուր նկարագրություն և ճարտարապետություն",
          content:
            "DitakNet-ը տեղային (self-hosted) մոնիթորինգի սերվեր և ՏՏ գործիքակազմ է՝ նախատեսված գրասենյակային ցանցերի, CCTV տեսահսկման և սերվերային ենթակառուցվածքների համար։ Ի տարբերություն ամպային (Cloud SaaS) համակարգերի, բոլոր տվյալները, լոգերը և սարքերի ցանկը մնում են բացառապես ձեր սեփական սերվերում։",
          callout: {
            type: "note",
            text: "DitakNet-ն աշխատում է լոկալ 5833 պորտի վրա և տեղային ցանցը հսկելու համար ինտերնետ կապի պարտադիր կարիք չունի։"
          }
        },
        {
          title: "2. Համակարգային պահանջներ",
          content:
            "Ծրագիրը օպտիմիզացված է և կարող է աշխատել ինչպես հզոր սերվերների, այնպես էլ սովորական մինի-ՀԿ-ների (Mini PC) կամ NAS սարքերի վրա։",
          code: "- Պրոցեսոր (CPU)՝ 2 Միջուկ (4 միջուկ 500+ սարքերի դեպքում)\n- Օպերատիվ հիշողություն (RAM)՝ 2 ԳԲ (առաջարկվում է 4 ԳԲ)\n- Սկավառակ՝ 10 ԳԲ SSD/HDD տվյալների և լոգերի համար\n- ՕՀ՝ Ubuntu 22.04/24.04, Debian 12, TrueNAS SCALE, Windows 10/11/Server\n- Docker՝ Engine 24.0+ և Docker Compose v2+",
          codeLang: "yaml"
        },
        {
          title: "3. Արագ մեկնարկ",
          content:
            "Տեղադրեք Docker կոնտեյները կամ գործարկեք Windows standalone ծրագրերը՝ սարքերը հայտնաբերելու և մոնիթորինգը սկսելու համար։",
          code: "# Ստեղծել թղթապանակ և ներբեռնել կոնֆիգուրացիան\nmkdir -p ~/ditaknet && cd ~/ditaknet\ncurl -O https://ditaknet.com/downloads/docker-compose.yml\ndocker compose up -d\n\n# Բացել վեբ վահանակը բրաուզերում\n# http://localhost:5833 կամ http://<ձեր-սերվերի-IP>:5833",
          codeLang: "bash"
        }
      ]
    },
    ru: {
      title: "Начало работы с DitakNet",
      description: "Обзор локального сервера мониторинга DitakNet, системные требования и быстрый запуск.",
      sections: [
        {
          title: "1. Архитектура и особенности",
          content:
            "DitakNet — это полностью автономный локальный сервер мониторинга и набор утилит для IT-специалистов, офисных сетей и систем видеонаблюдения. Все данные, телеметрия и топология хранятся исключительно на вашем оборудовании.",
          callout: {
            type: "note",
            text: "DitakNet работает локально на порту 5833 и не требует обязательного подключения к интернету для мониторинга локальной сети."
          }
        },
        {
          title: "2. Системные требования",
          content:
            "Сервер оптимизирован для работы на оборудовании x86_64 и ARM64, мини-ПК и хранилищах NAS.",
          code: "- CPU: 2 ядра минимум (4 ядра для 500+ узлов)\n- RAM: 2 ГБ минимум (рекомендуется 4 ГБ)\n- Диск: 10 ГБ SSD/HDD для истории и метрик\n- ОС: Ubuntu 22.04/24.04, Debian 12, TrueNAS SCALE, Windows 10/11/Server\n- Docker: Engine 24.0+ и Docker Compose v2+",
          codeLang: "yaml"
        },
        {
          title: "3. Быстрый запуск",
          content:
            "Запустите сервер через Docker Compose или используйте автономные утилиты для Windows.",
          code: "# Создайте директорию и запустите контейнер\nmkdir -p ~/ditaknet && cd ~/ditaknet\ncurl -O https://ditaknet.com/downloads/docker-compose.yml\ndocker compose up -d\n\n# Откройте панель управления\n# http://localhost:5833 или http://<IP-сервера>:5833",
          codeLang: "bash"
        }
      ]
    }
  },

  "docker-installation": {
    en: {
      title: "Docker Installation Guide",
      description: "How to deploy DitakNet Monitoring Server using Docker and Docker Compose.",
      sections: [
        {
          title: "1. Docker Compose Configuration",
          content:
            "Create a `docker-compose.yml` file in your preferred deployment directory. Host network mode is recommended so DitakNet can send raw ARP/ICMP packets for subnet discovery.",
          code: "version: '3.8'\nservices:\n  ditaknet-server:\n    image: ditaknet/monitoring-server:latest\n    container_name: ditaknet-server\n    restart: unless-stopped\n    network_mode: host\n    environment:\n      - PORT=5833\n      - NODE_ENV=production\n      - DATA_PATH=/data\n    volumes:\n      - ./ditaknet-data:/data\n      - /etc/localtime:/etc/localtime:ro",
          codeLang: "yaml"
        },
        {
          title: "2. Launching the Service",
          content: "Run the container in detached background mode:",
          code: "docker compose up -d\n\n# Check container status\ndocker compose ps\n\n# View live logs\ndocker compose logs -f",
          codeLang: "bash"
        },
        {
          title: "3. Firewall Configuration (UFW / iptables)",
          content: "Ensure port 5833 TCP is open in your local firewall to access the web console:",
          code: "sudo ufw allow 5833/tcp\nsudo ufw reload",
          codeLang: "bash"
        }
      ]
    },
    hy: {
      title: "Docker Տեղադրման Ուղեցույց",
      description: "Ինչպես տեղադրել DitakNet Monitoring Server-ը Docker-ի և Docker Compose-ի միջոցով։",
      sections: [
        {
          title: "1. Docker Compose Կոնֆիգուրացիա",
          content:
            "Ստեղծեք `docker-compose.yml` ֆայլը։ Խորհուրդ է տրվում օգտագործել `network_mode: host`, որպեսզի սերվերը կարողանա ուղիղ ARP և ICMP sweep կատարել ենթացանցում։",
          code: "version: '3.8'\nservices:\n  ditaknet-server:\n    image: ditaknet/monitoring-server:latest\n    container_name: ditaknet-server\n    restart: unless-stopped\n    network_mode: host\n    environment:\n      - PORT=5833\n      - NODE_ENV=production\n      - DATA_PATH=/data\n    volumes:\n      - ./ditaknet-data:/data\n      - /etc/localtime:/etc/localtime:ro",
          codeLang: "yaml"
        },
        {
          title: "2. Ծառայության Մեկնարկ",
          content: "Գործարկեք կոնտեյները ֆոնային ռեժիմով՝",
          code: "docker compose up -d\n\n# Ստուգել կոնտեյների կարգավիճակը\ndocker compose ps\n\n# Դիտել live լոգերը\ndocker compose logs -f",
          codeLang: "bash"
        },
        {
          title: "3. Firewall Կարգավորում (UFW)",
          content: "Բացեք 5833 TCP պորտը տեղային firewall-ում՝ վեբ վահանակին միանալու համար՝",
          code: "sudo ufw allow 5833/tcp\nsudo ufw reload",
          codeLang: "bash"
        }
      ]
    },
    ru: {
      title: "Установка через Docker",
      description: "Развертывание сервера мониторинга DitakNet с помощью Docker и Docker Compose.",
      sections: [
        {
          title: "1. Конфигурация Docker Compose",
          content:
            "Создайте файл `docker-compose.yml`. Режим `network_mode: host` рекомендуется для корректной работы ARP-сканирования в локальной сети.",
          code: "version: '3.8'\nservices:\n  ditaknet-server:\n    image: ditaknet/monitoring-server:latest\n    container_name: ditaknet-server\n    restart: unless-stopped\n    network_mode: host\n    environment:\n      - PORT=5833\n      - NODE_ENV=production\n      - DATA_PATH=/data\n    volumes:\n      - ./ditaknet-data:/data\n      - /etc/localtime:/etc/localtime:ro",
          codeLang: "yaml"
        },
        {
          title: "2. Запуск сервиса",
          content: "Запустите контейнер в фоновом режиме:",
          code: "docker compose up -d\n\n# Проверить статус\ndocker compose ps\n\n# Просмотр логов\ndocker compose logs -f",
          codeLang: "bash"
        },
        {
          title: "3. Настройка Firewall (UFW)",
          content: "Откройте порт 5833 TCP для доступа к веб-панели:",
          code: "sudo ufw allow 5833/tcp\nsudo ufw reload",
          codeLang: "bash"
        }
      ]
    }
  },

  "truenas-installation": {
    en: {
      title: "TrueNAS SCALE Installation",
      description: "Deploying DitakNet as a custom application on TrueNAS SCALE storage systems.",
      sections: [
        {
          title: "1. Custom App Setup in TrueNAS SCALE",
          content:
            "In your TrueNAS SCALE Web UI, navigate to `Apps` -> `Discover Apps` -> `Custom App`.",
          callout: {
            type: "tip",
            text: "Enable Host Network under Network Configuration to allow direct ARP detection of LAN devices."
          }
        },
        {
          title: "2. Container Settings",
          content:
            "Fill in the following container properties:\n- Application Name: `ditaknet`\n- Image repository: `ditaknet/monitoring-server`\n- Image Tag: `latest`\n- Port forwarding: Web port 5833\n- Storage volume: Mount a host path dataset (e.g. `/mnt/tank/apps/ditaknet`) to container `/data`."
        },
        {
          title: "3. Validation",
          content:
            "Click Install. Once status turns Active, open `http://<truenas-ip>:5833` to complete setup."
        }
      ]
    },
    hy: {
      title: "TrueNAS SCALE Տեղադրում",
      description: "DitakNet-ի գործարկումը TrueNAS SCALE ստորեջ համակարգերում որպես Custom App։",
      sections: [
        {
          title: "1. Custom App Ստեղծում TrueNAS SCALE-ում",
          content:
            "TrueNAS SCALE վեբ ինտերֆեյսում բացեք `Apps` բաժինը -> սեղմեք `Discover Apps` -> `Custom App`։",
          callout: {
            type: "tip",
            text: "Network Configuration-ում ընտրեք «Host Network», որպեսզի սերվերը տեսնի ամբողջ տեղային ցանցը։"
          }
        },
        {
          title: "2. Կոնտեյների Պարամետրեր",
          content:
            "Լրացրեք հետևյալ դաշտերը՝\n- Անվանում (App Name)՝ `ditaknet`\n- Image repository՝ `ditaknet/monitoring-server`\n- Image Tag՝ `latest`\n- Port՝ 5833 TCP\n- Storage Volume՝ Միացրեք TrueNAS dataset-ը (օր. `/mnt/tank/apps/ditaknet`) կոնտեյների `/data` պանակին։"
        },
        {
          title: "3. Ստուգում և Գործարկում",
          content:
            "Սեղմեք Install։ Կարգավիճակը «Active» դառնալուն պես բացեք `http://<truenas-ip>:5833` հասցեն։"
        }
      ]
    },
    ru: {
      title: "Установка на TrueNAS SCALE",
      description: "Развертывание DitakNet в виде Custom App на хранилищах TrueNAS SCALE.",
      sections: [
        {
          title: "1. Создание Custom App",
          content:
            "В веб-интерфейсе TrueNAS SCALE перейдите в раздел `Apps` -> `Discover Apps` -> `Custom App`.",
          callout: {
            type: "tip",
            text: "Включите режим Host Network, чтобы сервер имел прямой доступ к широковещательному трафику локальной сети."
          }
        },
        {
          title: "2. Параметры контейнера",
          content:
            "Укажите параметры:\n- Имя: `ditaknet`\n- Образ: `ditaknet/monitoring-server:latest`\n- Порт: 5833\n- Хранилище: Примонтируйте датасет (например `/mnt/tank/apps/ditaknet`) к пути `/data`."
        },
        {
          title: "3. Проверка",
          content: "После перехода статуса в Active откройте `http://<truenas-ip>:5833`."
        }
      ]
    }
  },

  "first-run-setup": {
    en: {
      title: "First-Run Setup & Discovery",
      description: "Initial configuration wizard, setting up administrator access, and triggering initial subnet sweeps.",
      sections: [
        {
          title: "1. Administrator Account Creation",
          content:
            "When opening DitakNet for the first time at `http://<server-ip>:5833`, you will be prompted to create the primary administrator account (email and secure password).",
          callout: {
            type: "note",
            text: "Administrator credentials are stored locally with bcrypt hashing. They are never sent to external servers."
          }
        },
        {
          title: "2. Subnet Discovery Wizard",
          content:
            "DitakNet will automatically detect your host network interface and suggest subnets (e.g. `192.168.1.0/24`). Click 'Start Initial Discovery' to populate device inventory."
        },
        {
          title: "3. Labeling Core Assets",
          content:
            "Assign friendly names and categories (Router, CCTV, Server, Access Point) to identified hardware for clean topology visualization."
        }
      ]
    },
    hy: {
      title: "Առաջին գործարկման կարգավորում",
      description: "Սկզբնական կարգավորման հրահանգներ, ադմինիստրատորի ստեղծում և սարքերի առաջին հայտնաբերում։",
      sections: [
        {
          title: "1. Ադմինիստրատորի Հաշիվ",
          content:
            "Առաջին անգամ `http://<server-ip>:5833` բացելիս համակարգը կառաջարկի ստեղծել գլխավոր ադմինիստրատորի էլ. հասցեն և գաղտնաբառը։",
          callout: {
            type: "note",
            text: "Ադմինիստրատորի գաղտնաբառը պահվում է բացառապես տեղային բազայում՝ bcrypt հեշավորմամբ։"
          }
        },
        {
          title: "2. Ենթացանցի Հայտնաբերում",
          content:
            "Ծրագիրը ավտոմատ կճանաչի ձեր տեղային քարտի IP-ն և կառաջարկի սքանավորել ենթացանցը (օր. `192.168.1.0/24`)։ Սեղմեք «Սկսել հայտնաբերումը»։"
        },
        {
          title: "3. Սարքերի Խմբավորում",
          content:
            "Գույքագրման ցուցակում նշեք հիմնական սարքերի անվանումները (Core Router, CCTV NVR, Wi-Fi AP)՝ քարտեզում հստակ պատկեր ստանալու համար։"
        }
      ]
    },
    ru: {
      title: "Первоначальная настройка",
      description: "Мастер первого запуска, создание учетной записи администратора и сканирование сети.",
      sections: [
        {
          title: "1. Создание учетной записи администратора",
          content:
            "При первом открытии `http://<server-ip>:5833` создайте логин и надежный пароль администратора.",
          callout: {
            type: "note",
            text: "Данные учетной записи хранятся локально в зашифрованном виде (bcrypt) и не передаются в интернет."
          }
        },
        {
          title: "2. Мастер поиска устройств",
          content:
            "DitakNet автоматически определит вашу подсеть (например, `192.168.1.0/24`). Запустите первое сканирование для заполнения инвентаря."
        },
        {
          title: "3. Классификация оборудования",
          content:
            "Задайте понятные имена и категории обнаруженным устройствам (маршрутизаторы, камеры, серверы)."
        }
      ]
    }
  },

  "network-discovery": {
    en: {
      title: "Network Discovery & Asset Inventory",
      description: "How DitakNet discovers IP and MAC addresses, vendors, and services across local subnets.",
      sections: [
        {
          title: "1. Dual-Engine Sweep (ARP & ICMP)",
          content:
            "DitakNet uses high-performance asynchronous ping and ARP table resolution to identify active hosts in less than 3 seconds per `/24` subnet."
        },
        {
          title: "2. Vendor OUI Identification",
          content:
            "MAC addresses are cross-referenced with the IEEE OUI database to automatically identify device manufacturers (MikroTik, Cisco, Dahua, Hikvision, Dell, HP, Ubiquiti, etc.)."
        },
        {
          title: "3. Service Port Probing",
          content:
            "The system checks critical service ports: HTTP (80), HTTPS (443), SSH (22), RTSP (554), WinBox (8291), RDP (3389), and DitakNet Agent (5833)."
        }
      ]
    },
    hy: {
      title: "Ցանցի Հայտնաբերում և Գույքագրում",
      description: "Ինչպես է DitakNet-ը հայտնաբերում սարքերի IP, MAC հասցեները, արտադրողներին և բաց ծառայությունները։",
      sections: [
        {
          title: "1. Երկմակարդակ Սքանավորում (ARP և ICMP)",
          content:
            "Համակարգն օգտագործում է բարձր արագության ասինխրոն ping և ARP աղյուսակի անալիզ, ինչը թույլ է տալիս /24 ենթացանցը ստուգել 3 վայրկյանից էլ արագ։"
        },
        {
          title: "2. Արտադրողի (Vendor) Նույնականացում",
          content:
            "Սարքի MAC հասցեի միջոցով IEEE բազայից ավտոմատ ճանաչվում է արտադրողը (MikroTik, Cisco, Dahua, Hikvision, Dell, Ubiquiti և այլն)։"
        },
        {
          title: "3. Ծառայությունների Պորտերի Ստուգում",
          content:
            "Ստուգվում են կրիտիկական պորտերը՝ HTTP (80), HTTPS (443), SSH (22), RTSP (554), WinBox (8291), RDP (3389) և DitakNet (5833)։"
        }
      ]
    },
    ru: {
      title: "Обнаружение устройств и инвентаризация",
      description: "Принцип обнаружения IP/MAC-адресов, вендоров и открытых служб в подсетях.",
      sections: [
        {
          title: "1. Двухуровневое сканирование (ARP и ICMP)",
          content:
            "Использование быстрого асинхронного пинга и таблицы ARP позволяет просканировать подсеть /24 менее чем за 3 секунды."
        },
        {
          title: "2. Определение производителей по MAC (OUI)",
          content:
            "По первым октетам MAC-адреса DitakNet определяет производителя (MikroTik, Cisco, Dahua, Hikvision, Ubiquiti и др.)."
        },
        {
          title: "3. Проверка сервисных портов",
          content:
            "Проверяются порты HTTP (80), HTTPS (443), SSH (22), RTSP (554), WinBox (8291), RDP (3389) и DitakNet (5833)."
        }
      ]
    }
  },

  "telegram-alerts": {
    en: {
      title: "Telegram Notifications & Alerting",
      description: "Configure instant Telegram notifications when servers, cameras, or switches go offline.",
      sections: [
        {
          title: "1. Creating your Telegram Bot",
          content:
            "1. Open Telegram and search for `@BotFather`.\n2. Send `/newbot` and follow instructions to choose a name and username.\n3. Copy the HTTP API Bot Token (e.g. `7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)."
        },
        {
          title: "2. Finding your Chat ID",
          content:
            "Start a chat with `@userinfobot` or add your bot to your IT operations group, then find the Chat ID (e.g. `123456789` or `-100123456789`)."
        },
        {
          title: "3. Connecting to DitakNet",
          content:
            "In DitakNet Settings -> Notifications -> Telegram:\n- Enter your **Bot Token**\n- Enter your **Chat ID**\n- Click 'Send Test Alert'. You will receive a verification ping within 2 seconds."
        }
      ]
    },
    hy: {
      title: "Telegram Ծանուցումների Կարգավորում",
      description: "Ինչպես կարգավորել ակնթարթային Telegram ծանուցումներ, երբ սերվերը կամ տեսախցիկը անհասանելի է դառնում։",
      sections: [
        {
          title: "1. Telegram Բոտի Ստեղծում",
          content:
            "1. Բացեք Telegram-ը և որոնեք `@BotFather` օգտատիրոջը։\n2. Ուղարկեք `/newbot` հրամանը և ընտրեք անվանում։\n3. Պատճենեք տրամադրված HTTP API Bot Token-ը (օր. `7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)։"
        },
        {
          title: "2. Chat ID-ի Ստացում",
          content:
            "Գրեք `@userinfobot`-ին կամ ավելացրեք ձեր բոտին ձեր ՏՏ աշխատանքային խմբում, որպեսզի ստանաք Chat ID-ն (օր. `123456789` կամ խմբերի համար `-100123456789`)։"
        },
        {
          title: "3. Միացում DitakNet-ին",
          content:
            "DitakNet-ի Settings -> Notifications -> Telegram բաժնում՝\n- Լրացրեք **Bot Token**-ը\n- Լրացրեք **Chat ID**-ն\n- Սեղմեք «Ուղարկել թեստային ազդանշան»։ 2 վայրկյանում կստանաք ծանուցումը։"
        }
      ]
    },
    ru: {
      title: "Оповещения в Telegram",
      description: "Настройка мгновенных уведомлений в Telegram при сбое серверов, камер или коммутаторов.",
      sections: [
        {
          title: "1. Создание Telegram бота",
          content:
            "1. Найдите бота `@BotFather` в Telegram.\n2. Отправьте команду `/newbot` и задайте имя бота.\n3. Скопируйте полученный API токен (например `7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)."
        },
        {
          title: "2. Получение Chat ID",
          content:
            "Напишите боту `@userinfobot` или добавьте своего бота в группу и узнайте Chat ID (например `123456789` или `-100123456789`)."
        },
        {
          title: "3. Интеграция с DitakNet",
          content:
            "В DitakNet перейдите в Настройки -> Уведомления -> Telegram:\n- Укажите **Bot Token**\n- Укажите **Chat ID**\n- Нажмите «Отправить тест». Уведомление придет в течение 2 секунд."
        }
      ]
    }
  },

  "licensing": {
    en: {
      title: "Licensing & Air-Gapped Activation",
      description: "Understanding Community Free Edition, Professional licenses, and offline air-gapped activation.",
      sections: [
        {
          title: "1. Community Edition (Free Forever)",
          content:
            "DitakNet Community Edition is completely free for home labs, personal setups, and small networks with self-installation. No credit card or expiration date."
        },
        {
          title: "2. Commercial License Features",
          content:
            "Commercial licenses unlock enterprise multi-site monitoring, automated offsite encrypted backups, priority phone & on-site IT support, and customized reporting."
        },
        {
          title: "3. Offline & Air-Gapped Activation",
          content:
            "For isolated high-security networks with zero internet access, DitakNet generates an offline hardware fingerprint which can be signed and activated via license key file without connecting outside."
        }
      ]
    },
    hy: {
      title: "Լիցենզավորում և Ակտիվացում",
      description: "Անվճար Community Edition, Կոմերցիոն տարբերակներ և ավտոնոմ ակտիվացում փակ ցանցերում։",
      sections: [
        {
          title: "1. Community Edition (Անվճար միշտ)",
          content:
            "DitakNet Community տարբերակը լիովին անվճար է տնային լաբորատորիաների և փոքր ցանցերի ինքնուրույն տեղադրման համար։ Չկան ժամկետային սահմանափակումներ։"
        },
        {
          title: "2. Կոմերցիոն Լիցենզիայի Առավելությունները",
          content:
            "Կոմերցիոն լիցենզիան ներառում է բազմաթիվ օբյեկտների միասնական կառավարում, կոդավորված ավտոմատ backup-ներ, առաջնահերթ տեխնիկական սպասարկում և անհատականացված հաշվետվություններ։"
        },
        {
          title: "3. Ավտոնոմ (Air-Gapped) Ակտիվացում",
          content:
            "Բարձր անվտանգության մեկուսացված ցանցերի համար, որոնք ընդհանրապես ինտերնետ չունեն, DitakNet-ն ունի սարքային fingerprint-ով անցանց ակտիվացման հնարավորություն։"
        }
      ]
    },
    ru: {
      title: "Лицензирование и Активация",
      description: "Бесплатная редакция Community, коммерческие лицензии и офлайн-активация в изолированных сетях.",
      sections: [
        {
          title: "1. Редакция Community (Бесплатно)",
          content:
            "Редакция DitakNet Community полностью бесплатна для домашних лабораторий и небольших сетей при самостоятельной установке."
        },
        {
          title: "2. Возможности коммерческой лицензии",
          content:
            "Коммерческая лицензия включает мониторинг распределенных объектов, резервное копирование, приоритетную техподдержку и брендированные отчеты."
        },
        {
          title: "3. Активация в изолированных сетях (Air-Gap)",
          content:
            "Для закрытых сетей без доступа к интернету поддерживается офлайн-активация с помощью ключевого файла на основе аппаратного отпечатка сервера."
        }
      ]
    }
  },

  "configuration": {
    en: {
      title: "Configuration & System Parameters",
      description: "Fine-tuning ping intervals, alert thresholds, retention periods, and backup storage.",
      sections: [
        {
          title: "1. Monitoring Frequency",
          content:
            "Adjust ping sweep intervals between 15 seconds (critical servers) and 5 minutes (standard workstations) to optimize CPU usage."
        },
        {
          title: "2. Retention & Pruning",
          content:
            "Telemetry data is retained for 90 days by default with automatic round-robin aggregation into hourly and daily summaries."
        },
        {
          title: "3. Configuration File (`ditaknet.conf`)",
          content:
            "Advanced settings can be configured via environment variables or the configuration file located at `/data/ditaknet.conf`."
        }
      ]
    },
    hy: {
      title: "Համակարգի Կոնֆիգուրացիա",
      description: "Ստուգումների պարբերականության, ծանուցումների շեմերի և backup-ների կարգավորում։",
      sections: [
        {
          title: "1. Ստուգումների Հաճախականություն",
          content:
            "Ping ստուգումների միջակայքը կարող է սահմանվել 15 վայրկյանից (կրիտիկական սերվերներ) մինչև 5 րոպե (սովորական աշխատակայաններ)։"
        },
        {
          title: "2. Տվյալների Պահպանում և Մաքրում",
          content:
            "Մետրիկաները լռելյայն պահպանվում են 90 օր, ապա ավտոմատ ագրեգացվում ժամային և օրական ամփոփագրերի մեջ։"
        },
        {
          title: "3. Կոնֆիգուրացիայի Ֆայլ (`ditaknet.conf`)",
          content:
            "Խորացված կարգավորումները պահվում են `/data/ditaknet.conf` ֆայլում կամ սահմանվում Docker environment փոփոխականներով։"
        }
      ]
    },
    ru: {
      title: "Конфигурация и параметры",
      description: "Настройка интервалов опроса, порогов тревог и параметров хранения данных.",
      sections: [
        {
          title: "1. Частота мониторинга",
          content:
            "Интервалы опроса настраиваются от 15 секунд (критические серверы) до 5 минут для экономии ресурсов."
        },
        {
          title: "2. Сроки хранения метрик",
          content:
            "История хранится 90 дней по умолчанию с автоматической агрегацией в часовые и суточные графики."
        },
        {
          title: "3. Конфигурационный файл (`ditaknet.conf`)",
          content:
            "Дополнительные параметры настраиваются в файле `/data/ditaknet.conf` или через переменные окружения."
        }
      ]
    }
  },

  "faq": {
    en: {
      title: "Frequently Asked Questions (FAQ)",
      description: "Clear answers to common questions about DitakNet installation, tools, licensing, and security.",
      sections: [
        {
          title: "Q: Is DitakNet dependent on any external cloud service?",
          content:
            "No. DitakNet is 100% self-hosted. All network discovery, health checking, database storage, and alerting run directly on your own local server hardware without transmitting telemetry to third parties."
        },
        {
          title: "Q: Can I run DitakNet standalone tools on Windows without Docker?",
          content:
            "Yes! We provide native Windows Standalone packages (.ZIP) with batch launchers and PowerShell scripts for LAN Scan, VLAN Scan, CCTV Probe, Bandwidth Test, Patch Panel Manager, Subnet Calculator, Port Audit, and Service Watch. No Docker or administrative installation required."
        },
        {
          title: "Q: How does hotel.ditaknet.com connect with DitakNet Monitoring?",
          content:
            "hotel.ditaknet.com provides guest PMS, room booking, and billing. It seamlessly links with local DitakNet servers to monitor Wi-Fi AP availability, guest bandwidth consumption, and CCTV security feeds across the hotel property."
        },
        {
          title: "Q: Can DitakNet develop custom software for our residential complex or business?",
          content:
            "Yes. We build and upgrade turnkey platforms for condominiums, residential quarters, and enterprises based on your exact specifications within 2-3 months."
        }
      ]
    },
    hy: {
      title: "Հաճախ Տրվող Հարցեր (ՀՏՀ)",
      description: "Պատասխաններ DitakNet-ի տեղադրման, գործիքների, լիցենզավորման և անվտանգության վերաբերյալ։",
      sections: [
        {
          title: "Հարց՝ DitakNet-ը կախվա՞ծ է արտաքին ամպային (Cloud) ծառայություններից։",
          content:
            "Ոչ։ DitakNet-ը 100% self-hosted է։ Սարքերի հայտնաբերումը, ստուգումները, տվյալների բազան և ծանուցումները աշխատում են բացառապես ձեր տեղային սերվերում՝ առանց տվյալները երրորդ կողմերին փոխանցելու։"
        },
        {
          title: "Հարց՝ Կարո՞ղ եմ գործիքներն աշխատեցնել Windows-ում առանց Docker-ի։",
          content:
            "Այո՛։ Մենք տրամադրում ենք Windows Standalone փաթեթներ (.ZIP) LAN Scan, VLAN Scan, CCTV Probe, Bandwidth Test, Պաչ Պանել, Subnet Calculator, Port Audit և Service Watch ծրագրերի համար։ Դրանք գործարկվում են 1-քլիքով՝ .bat ֆայլի միջոցով։"
        },
        {
          title: "Հարց՝ Ինչպե՞ս է hotel.ditaknet.com-ը կապվում DitakNet մոնիթորինգի հետ։",
          content:
            "hotel.ditaknet.com-ը հյուրանոցի կառավարման հարթակն է (ամրագրումներ, check-in, POS), որը միավորվում է տեղային DitakNet սերվերի հետ՝ հսկելու համար հյուրանոցի Wi-Fi կետերի հասանելիությունը և CCTV տեսահսկման սարքերը։"
        },
        {
          title: "Հարց՝ DitakNet-ը պատրաստո՞ւմ է անհատական ծրագրեր բնակելի համալիրների համար։",
          content:
            "Այո՛։ Մենք պատրաստում կամ թարմացնում ենք բնակելի շենքերի, համալիրների և թաղամասերի կառավարման համակարգեր՝ ձեր նախընտրանքով 2-3 ամսվա ընթացքում։"
        }
      ]
    },
    ru: {
      title: "Часто задаваемые вопросы (FAQ)",
      description: "Ответы на вопросы по установке DitakNet, утилитам, лицензированию и безопасности.",
      sections: [
        {
          title: "Вопрос: Зависит ли DitakNet от внешних облачных сервисов?",
          content:
            "Нет. DitakNet на 100% локальное (self-hosted) решение. Все сканирования, база данных и алерты работают на вашем оборудовании без отправки данных наружу."
        },
        {
          title: "Вопрос: Можно ли запускать утилиты на Windows без Docker?",
          content:
            "Да! Для Windows созданы автономные ZIP-пакеты (LAN Scan, VLAN Scan, CCTV Probe, Bandwidth Test, Патч-Панель, Subnet Calculator, Port Audit, Service Watch) с пакетными файлами .BAT. Установка не требуется."
        },
        {
          title: "Вопрос: Как hotel.ditaknet.com связан с сервером мониторинга?",
          content:
            "hotel.ditaknet.com управляет отельным бизнесом (брони, заезд, счета) и интегрируется с локальным сервером DitakNet для контроля Wi-Fi и видеокамер отеля."
        },
        {
          title: "Вопрос: Разрабатывает ли DitakNet ПО для жилых комплексов на заказ?",
          content:
            "Да. Мы разрабатываем и обновляем системы для ЖК и поселков под ваши требования за 2-3 месяца."
        }
      ]
    }
  }
};

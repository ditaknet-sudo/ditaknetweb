import { Activity, Camera, HardDrive, Router, Server, Wifi } from "lucide-react";

type HeroShowcaseProps = {
  title: string;
  subtitle: string;
};

const orbitNodes = [
  { icon: Router, label: "Router", tone: "ok", delay: "0s" },
  { icon: Camera, label: "NVR", tone: "warn", delay: "0.4s" },
  { icon: Server, label: "Host", tone: "ok", delay: "0.8s" },
  { icon: Wifi, label: "Wi‑Fi", tone: "ok", delay: "1.2s" },
  { icon: HardDrive, label: "NAS", tone: "ok", delay: "1.6s" }
] as const;

export function HeroShowcase({ title, subtitle }: HeroShowcaseProps) {
  return (
    <div className="hero-3d" aria-label={`${title}. ${subtitle}`}>
      <div className="hero-3d-atmosphere" aria-hidden="true">
        <span className="hero-3d-orb hero-3d-orb--a" />
        <span className="hero-3d-orb hero-3d-orb--b" />
        <span className="hero-3d-orb hero-3d-orb--c" />
        <span className="hero-3d-grid" />
      </div>

      <div className="hero-3d-stage">
        <div className="hero-3d-scene">
          <div className="hero-3d-floor" aria-hidden="true" />
          <div className="hero-3d-ring hero-3d-ring--outer" aria-hidden="true" />
          <div className="hero-3d-ring hero-3d-ring--inner" aria-hidden="true" />
          <div className="hero-3d-scan" aria-hidden="true" />

          <div className="hero-3d-server" aria-hidden="true">
            <div className="hero-3d-server-face hero-3d-server-face--front">
              <div className="hero-3d-server-badge">
                <Activity className="h-4 w-4" />
                <span>DitakNet</span>
              </div>
              <div className="hero-3d-racks">
                {[0, 1, 2, 3, 4, 5].map((slot) => (
                  <span key={slot} className={`hero-3d-rack hero-3d-rack--${slot % 3}`} />
                ))}
              </div>
              <div className="hero-3d-ports">
                {[0, 1, 2, 3].map((port) => (
                  <span key={port} className="hero-3d-port" />
                ))}
              </div>
            </div>
            <div className="hero-3d-server-face hero-3d-server-face--side" />
            <div className="hero-3d-server-face hero-3d-server-face--top" />
          </div>

          <ul className="hero-3d-nodes">
            {orbitNodes.map((node, index) => (
              <li
                key={node.label}
                className={`hero-3d-node hero-3d-node--${index + 1} hero-3d-node--${node.tone}`}
                style={{ animationDelay: node.delay }}
              >
                <node.icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{node.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hero-3d-copy">
        <p className="hero-3d-eyebrow">{title}</p>
        <p className="hero-3d-subtitle">{subtitle}</p>
        <div className="hero-3d-metrics" aria-hidden="true">
          <div>
            <strong>128</strong>
            <span>Online</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Warnings</span>
          </div>
          <div>
            <strong>1</strong>
            <span>Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Activity, Camera, HardDrive, Router, Server, Wifi } from "lucide-react";

type HeroShowcaseProps = {
  title: string;
  onlineLabel: string;
  warningLabel: string;
  offlineLabel: string;
};

const devices = [
  { icon: Router, label: "Router" },
  { icon: Camera, label: "NVR" },
  { icon: Server, label: "Host" },
  { icon: Wifi, label: "Wi‑Fi" },
  { icon: HardDrive, label: "NAS" }
] as const;

export function HeroShowcase({ title, onlineLabel, warningLabel, offlineLabel }: HeroShowcaseProps) {
  return (
    <div className="hero-stage" aria-hidden="true">
      <div className="hero-stage__aura" />
      <div className="hero-stage__radar">
        <span />
        <span />
        <span />
        <i />
      </div>

      <div className="hero-stage__frame">
        <div className="hero-stage__chrome">
          <div className="hero-stage__live">
            <Activity className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <span className="hero-stage__dot" />
        </div>

        <div className="hero-stage__body">
          <div className="hero-stage__server">
            {[0, 1, 2, 3, 4, 5].map((slot) => (
              <span key={slot} className={`hero-stage__rack hero-stage__rack--${slot % 3}`} />
            ))}
          </div>

          <div className="hero-stage__devices">
            {devices.map((device, index) => (
              <div key={device.label} className="hero-stage__device" style={{ animationDelay: `${index * 0.12}s` }}>
                <device.icon className="h-4 w-4" />
                <span>{device.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-stage__stats">
          <div>
            <strong>128</strong>
            <span>{onlineLabel}</span>
          </div>
          <div>
            <strong>7</strong>
            <span>{warningLabel}</span>
          </div>
          <div>
            <strong>1</strong>
            <span>{offlineLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

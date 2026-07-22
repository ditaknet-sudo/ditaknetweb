import { Activity } from "lucide-react";

type HeroShowcaseProps = {
  title: string;
  subtitle: string;
};

/** Pure visual plane for the hero — no floating labels or metric chips. */
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
        </div>
      </div>
    </div>
  );
}

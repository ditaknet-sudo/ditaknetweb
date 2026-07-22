import Link from "next/link";

const SIZES = {
  sm: 36,
  md: 52,
  lg: 72,
  hero: 128
} as const;

type BrandLogoProps = {
  brandName: string;
  href?: string;
  size?: keyof typeof SIZES;
  showName?: boolean;
  animated?: boolean;
  className?: string;
};

function LogoMark({ size, animated }: { size: number; animated: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-logo-mark ${animated ? "brand-logo-mark--animated" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dnGrad" x1="20" y1="8" x2="108" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B9BFF" />
          <stop offset="0.55" stopColor="#1A8FCE" />
          <stop offset="1" stopColor="#17A673" />
        </linearGradient>
        <linearGradient id="dnPulse" x1="44" y1="64" x2="84" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7ED0FF" />
          <stop offset="1" stopColor="#3DD68C" />
        </linearGradient>
      </defs>

      <path
        className="brand-logo-hex"
        d="M64 10 L104 33 V79 L64 102 L24 79 V33 Z"
        stroke="url(#dnGrad)"
        strokeWidth="7"
        strokeLinejoin="round"
        fill="none"
      />

      <g className="brand-logo-net" stroke="url(#dnGrad)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M64 28 L48 38 L40 52" fill="none" opacity="0.9" />
        <path d="M64 28 L80 38 L88 52" fill="none" opacity="0.9" />
        <path d="M64 100 L48 90 L40 76" fill="none" opacity="0.9" />
        <path d="M64 100 L80 90 L88 76" fill="none" opacity="0.9" />
        <circle cx="48" cy="38" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="40" cy="52" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="80" cy="38" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="88" cy="52" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="48" cy="90" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="40" cy="76" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="80" cy="90" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="88" cy="76" r="3.2" fill="url(#dnGrad)" stroke="none" />
        <circle cx="64" cy="28" r="3.4" fill="url(#dnGrad)" stroke="none" />
        <circle cx="64" cy="100" r="3.4" fill="url(#dnGrad)" stroke="none" />
      </g>

      <ellipse className="brand-logo-eye" cx="64" cy="64" rx="28" ry="16" stroke="url(#dnGrad)" strokeWidth="3.5" fill="none" />
      <circle cx="64" cy="64" r="11" stroke="url(#dnGrad)" strokeWidth="3" fill="rgba(15,32,45,0.35)" />
      <path
        className="brand-logo-pulse"
        d="M50 64 H56 L59 56 L64 74 L69 60 L72 64 H78"
        stroke="url(#dnPulse)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function BrandLogo({
  brandName,
  href,
  size = "sm",
  showName = true,
  animated = false,
  className = ""
}: BrandLogoProps) {
  const px = SIZES[size];
  const inner = (
    <>
      <LogoMark size={px} animated={animated} />
      {showName ? <span className="brand-logo-text truncate text-lg font-bold">{brandName}</span> : null}
    </>
  );

  const wrapClass = `brand-logo ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={`${wrapClass} brand-logo-link`} aria-label={brandName}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={wrapClass} aria-label={brandName}>
      {inner}
    </div>
  );
}

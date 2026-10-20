import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-[var(--button-text)] shadow-sm hover:bg-[var(--brand-dark)]",
  secondary: "bg-[var(--accent)] text-[var(--accent-text)] shadow-sm hover:bg-[var(--accent-hover)]",
  outline: "border border-[var(--line)] bg-[var(--panel)] text-[var(--foreground)] hover:border-[var(--brand)] hover:text-[var(--brand)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--foreground)]",
  danger: "bg-[var(--danger)] text-[var(--button-text)] hover:brightness-95"
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={buttonClassName({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  download,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  download?: boolean | string;
}) {
  const isDownload =
    Boolean(download) ||
    href.startsWith("/downloads/") ||
    href.startsWith("/api/downloads/") ||
    href.endsWith(".zip");
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isDownload || isExternal) {
    return (
      <a
        href={href}
        download={download === true ? "" : download || undefined}
        className={buttonClassName({ variant, size, className })}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClassName({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}

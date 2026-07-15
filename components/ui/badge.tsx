import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "amber" | "gray" | "red";

const toneClasses: Record<Tone, string> = {
  blue: "bg-[var(--panel-soft)] text-[var(--brand)]",
  green: "bg-[var(--panel-soft)] text-[var(--success)]",
  amber: "bg-[var(--panel-soft)] text-[var(--warning)]",
  gray: "bg-[var(--panel-soft)] text-[var(--muted)]",
  red: "bg-[var(--panel-soft)] text-[var(--danger)]"
};

export function Badge({
  tone = "gray",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
}) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", toneClasses[tone], className)}
      {...props}
    />
  );
}

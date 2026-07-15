import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputClassName =
  "focus-ring w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--foreground)] shadow-sm transition placeholder:text-[var(--muted)] focus:border-[var(--brand)]";

export function Field({
  label,
  error,
  hint,
  children,
  className
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-2 text-sm font-medium text-[var(--foreground)]", className)}>
      <span>{label}</span>
      {children}
      {hint ? <span className="block text-xs font-normal text-[var(--muted)]">{hint}</span> : null}
      {error ? <span className="block text-xs font-semibold text-[var(--danger)]">{error}</span> : null}
    </label>
  );
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <div className="rounded-md border border-[var(--danger)] bg-[var(--panel-soft)] px-4 py-3 text-sm font-medium text-[var(--danger)]">
      {children}
    </div>
  );
}

export function FormSuccess({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <div className="rounded-md border border-[var(--success)] bg-[var(--panel-soft)] px-4 py-3 text-sm font-medium text-[var(--success)]">
      {children}
    </div>
  );
}

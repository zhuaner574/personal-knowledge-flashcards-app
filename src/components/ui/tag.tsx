import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Pill({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[#fafafa] px-2 py-0.5 text-xs text-[var(--text-secondary)]",
        className
      )}
    >
      {children}
    </span>
  );
}

export const Tag = Pill;


import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  id,
  className,
  children
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]",
        className
      )}
    >
      {children}
    </section>
  );
}


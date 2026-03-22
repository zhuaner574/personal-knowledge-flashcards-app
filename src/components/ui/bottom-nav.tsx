"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/home", label: "Home" },
  { href: "/transactions/new", label: "Add" },
  { href: "/stats", label: "Stats" },
  { href: "/subscriptions", label: "Subs" },
  { href: "/item-plans", label: "Plans" },
  { href: "/settings", label: "Settings" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sb-border-subtle)] bg-[var(--sb-bg-surface)]/95 backdrop-blur md:hidden">
      <div
        className="mx-auto flex max-w-[920px] items-center justify-between px-3 py-2 text-[11px]"
        style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/home" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 px-1 py-1 text-[11px] font-medium",
                active
                  ? "text-[var(--sb-accent)]"
                  : "text-[var(--sb-text-muted)] hover:text-[var(--sb-text-secondary)]"
              )}
              style={{ minWidth: 0, margin: "0 2px" }}
            >
              <span
                className={cn(
                  "h-[3px] w-6 rounded-full",
                  active ? "bg-[var(--sb-accent)]" : "bg-transparent"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


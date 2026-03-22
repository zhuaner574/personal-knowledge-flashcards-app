"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Today" },
  { href: "/notes", label: "Notes" },
  { href: "/review", label: "Review" }
];

export function TopNav() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="border-b border-[var(--border-subtle)]">
      <div className="mx-auto flex w-full max-w-[920px] items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-sm font-semibold">
          Personal Knowledge Flashcards
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm",
                  active
                    ? "bg-[#f7f7f7] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[#fafafa]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

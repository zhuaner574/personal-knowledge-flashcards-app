import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function PageLayout({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="flex justify-center px-4 py-8 md:px-6 md:py-10">
      <div
        className={cn(
          "w-full max-w-[920px]",
          "space-y-6",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}


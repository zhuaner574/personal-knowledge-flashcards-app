import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", fullWidth, asChild, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const base =
      "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6d6d6]";

    const styles: Record<Variant, string> = {
      primary:
        "border-[#111111] bg-[#111111] text-white hover:bg-[#2a2a2a]",
      secondary:
        "border-[var(--border-subtle)] bg-white text-[var(--text-primary)] hover:bg-[#fafafa]",
      ghost:
        "border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[#fafafa]",
      danger:
        "border-[#d33] bg-white text-[#c02020] hover:bg-[#fff7f7]"
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          base,
          styles[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";


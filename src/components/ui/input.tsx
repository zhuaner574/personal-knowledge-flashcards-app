import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none",
        "focus:border-[#cfcfcf]",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none",
        "focus:border-[#cfcfcf]",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none",
        "focus:border-[#cfcfcf]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";


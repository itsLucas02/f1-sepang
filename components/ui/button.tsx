import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small" | "large";
};

const VARIANTS = {
  primary:
    "border-race-red bg-race-red text-white shadow-[0_8px_22px_-10px_rgba(225,6,0,0.75)] hover:bg-race-red-bright hover:shadow-[0_12px_28px_-10px_rgba(225,6,0,0.8)] active:bg-race-red-deep",
  secondary:
    "border-white/25 bg-[#0d0d0f] text-white hover:border-white/55 hover:bg-[#18181b] hover:text-white active:bg-[#111113]",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-white/[0.06] hover:text-white",
} as const;

export function Button({
  asChild = false,
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "sheen relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm border font-display text-sm font-bold uppercase tracking-[0.08em] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-px active:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        "disabled:pointer-events-none disabled:translate-y-0 disabled:border-transparent disabled:bg-disabled disabled:text-white/60 disabled:shadow-none",
        size === "large"
          ? "min-h-13 px-8 py-3.5 text-base"
          : size === "small"
            ? "min-h-11 px-4 py-2"
            : "min-h-11 px-6 py-3",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}

import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small" | "large";
};

/**
 * Every variant hard-codes BOTH background and text colour so a button can
 * never inherit a dark foreground onto a dark surface (the old "blackout
 * button" bug). Contrast is >= 4.5:1 in all states, including disabled.
 */
const VARIANTS = {
  primary:
    "border-transparent bg-[linear-gradient(100deg,var(--sepang-race-red)_0%,var(--sepang-race-red-bright)_52%,var(--sepang-sunset)_140%)] text-white shadow-[0_6px_20px_-6px_rgba(232,17,45,0.7)] hover:shadow-[0_10px_28px_-6px_rgba(232,17,45,0.85)] hover:brightness-110 active:brightness-95",
  secondary:
    "border-border-strong bg-surface-02 text-white hover:border-teal/60 hover:bg-surface-03 hover:text-white active:bg-surface-02",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-white/8 hover:text-white",
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
        "sheen relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-md border font-display text-sm font-bold uppercase tracking-[0.08em] transition-[background,border-color,box-shadow,filter,transform] duration-200 hover:-translate-y-px active:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
        "disabled:pointer-events-none disabled:translate-y-0 disabled:border-transparent disabled:bg-none disabled:bg-disabled disabled:text-white/65 disabled:shadow-none",
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

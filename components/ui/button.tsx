import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "primary" | "secondary";
  size?: "default" | "small";
};

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
        "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-bold uppercase tracking-[0.02em] transition-opacity duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-white/70",
        size === "default" ? "min-h-11 px-6 py-3" : "min-h-11 px-4 py-2",
        variant === "primary"
          ? "border-race-red bg-race-red text-white hover:opacity-90"
          : "border-border bg-surface-01 text-white hover:bg-surface-02",
        className,
      )}
      {...props}
    />
  );
}

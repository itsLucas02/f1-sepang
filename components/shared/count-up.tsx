"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  /** Decimal places to render. */
  decimals?: number;
  duration?: number;
  className?: string;
  suffix?: string;
};

/**
 * Counts a number up the first time it scrolls into view.
 * Writes straight to the DOM so a 60fps animation costs zero React renders.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1400,
  className,
  suffix,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const render = (current: number) => {
      node.textContent = `${current.toFixed(decimals)}${suffix ?? ""}`;
    };

    if (reduced) {
      render(value);
      return;
    }

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        const start = performance.now();

        const tick = (now: number) => {
          const raw = Math.min((now - start) / duration, 1);
          render(value * (1 - Math.pow(1 - raw, 3)));

          if (raw < 1) {
            frame = requestAnimationFrame(tick);
          }
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [decimals, duration, reduced, suffix, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {`${(0).toFixed(decimals)}${suffix ?? ""}`}
    </span>
  );
}

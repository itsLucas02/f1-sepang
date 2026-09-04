"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "@/components/shared/motorsport-motion.module.css";
import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "slide-left" | "slide-right" | "photo-wipe";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  rise: styles.rise,
  "slide-left": styles.slideLeft,
  "slide-right": styles.slideRight,
  "photo-wipe": styles.photoWipe,
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn(
        styles.reveal,
        VARIANT_CLASS[variant],
        visible && styles.visible,
        className,
      )}
      style={{ "--motion-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

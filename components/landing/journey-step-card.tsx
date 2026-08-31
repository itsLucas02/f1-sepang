import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type JourneyStepCardProps = {
  number: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
};

export function JourneyStepCard({
  number,
  title,
  description,
  href,
  icon: Icon,
  className,
}: JourneyStepCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative min-h-44 overflow-hidden rounded-md border border-border bg-surface-01 p-6 transition-colors duration-200 hover:border-race-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className,
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs font-medium tracking-[0.12em] text-text-muted">
            {number}
          </span>
          <Icon aria-hidden="true" className="size-5 text-text-secondary" />
        </div>

        <div className="mt-auto pt-10">
          <h2 className="font-display text-2xl font-bold uppercase leading-none text-white">
            {title}
          </h2>
          <p className="mt-3 max-w-64 text-base leading-6 text-text-secondary">
            {description}
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 right-3 font-display text-8xl font-extrabold leading-none text-white/[0.035]"
      >
        {number}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-race-red transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}

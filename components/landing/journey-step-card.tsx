import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

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
        "group relative isolate flex min-h-64 flex-col overflow-hidden rounded-lg border border-white/10 bg-surface-02 p-6 transition-[transform,border-color,background-color,box-shadow] duration-300",
        "hover:-translate-y-1.5 hover:border-race-red/50 hover:bg-surface-03 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal",
        className,
      )}
    >
      {/* oversized ghost numeral */}
      <span
        aria-hidden="true"
        className="absolute -bottom-8 -right-3 font-display text-[9rem] font-extrabold leading-none tracking-[-0.07em] text-white/[0.04] transition-colors duration-300 group-hover:text-race-red/15"
      >
        {number}
      </span>

      {/* corner heat wash */}
      <span
        aria-hidden="true"
        className="absolute -right-16 -top-16 size-40 rounded-full bg-race-red/0 blur-2xl transition-colors duration-500 group-hover:bg-race-red/25"
      />

      <div className="relative z-10 flex items-start justify-between gap-5">
        <span className="font-mono text-xs font-medium tracking-[0.16em] text-race-red">
          {number}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      </div>

      <Icon
        aria-hidden="true"
        className="relative z-10 mt-8 size-7 text-text-secondary transition-colors duration-300 group-hover:text-sunset"
      />

      <h3 className="relative z-10 mt-auto pt-8 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-white sm:text-4xl">
        {title}
      </h3>
      <p className="relative z-10 mt-3 text-sm leading-6 text-text-secondary">
        {description}
      </p>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}

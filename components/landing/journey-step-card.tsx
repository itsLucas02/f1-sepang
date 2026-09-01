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
        "group relative border-t-2 border-[#141419] py-6 text-[#141419] transition-colors duration-200 hover:border-race-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141419] sm:py-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <span className="font-mono text-xs font-medium tracking-[0.12em] text-[#5e5e67]">
          {number}
        </span>
        <div className="flex items-center gap-3">
          <Icon aria-hidden="true" className="size-5 text-[#4e4e57] transition-colors group-hover:text-race-red" />
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <h2 className="mt-12 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-64 text-base leading-6 text-[#55555e]">
        {description}
      </p>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-0 bg-race-red transition-[width] duration-300 group-hover:w-12 group-focus-visible:w-12"
      />
    </Link>
  );
}

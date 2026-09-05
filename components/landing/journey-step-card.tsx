import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { publicAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";

type JourneyStepCardProps = {
  number: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  imageSrc: string;
  imagePosition?: string;
  className?: string;
};

export function JourneyStepCard({
  number,
  title,
  description,
  href,
  icon: Icon,
  imageSrc,
  imagePosition = "50% 50%",
  className,
}: JourneyStepCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden border border-white/10 bg-[#0b0d11] transition-[transform,border-color,box-shadow] duration-500",
        "hover:-translate-y-1.5 hover:border-race-red/45 hover:shadow-[0_36px_70px_-30px_rgba(0,0,0,0.95)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "edge-accent",
        className,
      )}
    >
      <Image
        src={publicAsset(imageSrc)}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 25vw"
        className="-z-10 object-cover opacity-45 grayscale-[0.35] transition duration-700 group-hover:scale-[1.06] group-hover:opacity-70 group-hover:grayscale-0"
        style={{ objectPosition: imagePosition }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,12,0.55)_0%,rgba(8,9,12,0.78)_42%,rgba(8,9,12,0.97)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-white/20"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-3 font-display text-[7rem] font-extrabold italic leading-none tracking-[-0.07em] text-white/[0.07] transition-colors duration-500 group-hover:text-white/[0.12]"
      >
        {number}
      </span>

      <div className="relative flex flex-col p-6 sm:p-7">
        <span className="inline-flex size-10 items-center justify-center border border-white/15 bg-white/[0.05] text-white/80 transition-colors duration-300 group-hover:border-race-red/60 group-hover:bg-race-red/15 group-hover:text-white">
          <Icon aria-hidden="true" className="size-4.5 stroke-[1.7]" />
        </span>

        <h3 className="mt-5 font-display text-3xl font-extrabold uppercase italic leading-none tracking-[-0.03em] text-white">
          {title}
        </h3>

        <p className="mt-3 max-w-[30ch] text-sm leading-6 text-white/60">
          {description}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 transition-colors duration-300 group-hover:text-white">
          Enter
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </span>
      </div>
    </Link>
  );
}

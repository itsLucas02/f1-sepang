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
        "group relative isolate flex min-h-[390px] flex-col overflow-hidden border border-black/10 bg-[#faf9f6] text-[#111113] shadow-[0_18px_42px_rgba(0,0,0,0.08)] transition-[transform,border-color,box-shadow] duration-300",
        "hover:-translate-y-1.5 hover:border-race-red/50 hover:shadow-[0_28px_54px_rgba(0,0,0,0.13)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
        className,
      )}
    >
      <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold italic leading-none tracking-[-0.05em] text-race-red">
              {number}
            </span>
            <h3 className="pb-1 font-display text-2xl font-extrabold uppercase italic leading-none tracking-[-0.02em] sm:text-3xl">
              {title}
            </h3>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="mt-2 size-5 text-race-red transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>

        <div className="mt-4 h-px w-12 bg-race-red" aria-hidden="true" />

        <Icon aria-hidden="true" className="mt-6 size-7 stroke-[1.6] text-[#242426]" />
        <p className="mt-4 max-w-[28ch] text-sm leading-6 text-[#55555a]">
          {description}
        </p>
      </div>

      <div className="relative h-36 overflow-hidden border-t border-black/8 sm:h-40">
        <Image
          src={publicAsset(imageSrc)}
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover grayscale-[0.15] transition duration-500 group-hover:scale-[1.035] group-hover:grayscale-0"
          style={{ objectPosition: imagePosition }}
        />
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="kerb-stripe-thin absolute inset-x-0 bottom-0 h-1.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

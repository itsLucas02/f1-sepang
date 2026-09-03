import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { SiteContainer } from "@/components/shared/site-container";
import textures from "@/components/shared/motorsport-textures.module.css";
import { publicAsset } from "@/lib/assets";

const TIMELINE = [
  ["1995", "PETRONAS enters Formula 1 sponsorship with Sauber."],
  ["1999", "PETRONAS becomes title partner of the Malaysian Grand Prix."],
  ["2010", "Mercedes-AMG and PETRONAS begin their title and technical partnership."],
  ["2026", "The partnership continues into Formula 1's new sustainable-fuel era."],
] as const;

export function MalaysiaF1Heritage() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#070708]">
      <div className={`${textures.carbonFade} pointer-events-none absolute inset-y-0 left-0 w-[62%] opacity-75`} aria-hidden="true" />
      <div className="race-noise pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      <SiteContainer className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className={textures.stripeFlag} aria-hidden="true" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                Malaysia in Formula 1
              </p>
            </div>

            <h2 className="mt-6 max-w-2xl font-display text-5xl font-extrabold uppercase italic leading-[0.82] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Malaysia has
              <span className="block text-race-red">skin in the game.</span>
            </h2>

            <div className={`mt-8 border border-white/12 bg-[#0a0a0c]/92 p-6 ${textures.carbonPanel} ${textures.petronasEdge}`}>
              <div className="flex items-center justify-between gap-4">
                <p className={`font-display text-2xl font-extrabold uppercase italic ${textures.petronasAccent}`}>
                  PETRONAS × F1
                </p>
                <span className={textures.stripeFlagSmall} aria-hidden="true" />
              </div>
              <p className="mt-4 text-base leading-7 text-white/68">
                PETRONAS is one of Malaysia&apos;s most visible links to Formula 1: from its first F1 sponsorship in 1995 and the Malaysian Grand Prix in 1999 to its long-running technical partnership with Mercedes-AMG.
              </p>
              <div className="mt-6 grid gap-0 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {TIMELINE.map(([year, detail]) => (
                  <div key={year} className="border-b border-white/10 py-4 sm:px-4 sm:first:pl-0 lg:px-0 xl:px-4 xl:first:pl-0">
                    <p className={`font-display text-3xl font-extrabold italic leading-none ${textures.petronasAccent}`}>
                      {year}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/58">{detail}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://www.petronas.com/petronas-motorsports"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-white/25 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/64 transition-colors hover:border-white hover:text-white"
              >
                PETRONAS motorsport history
                <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
              <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.1em] text-white/28">
                Editorial feature. No sponsorship or affiliation with SEPANG 56 is implied.
              </p>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden border border-white/14 bg-[#0b0b0d] lg:col-span-7 lg:min-h-full">
            <Image
              src={publicAsset("/media/heritage/petronas-mercedes.webp")}
              alt="Mercedes-AMG Formula 1 car carrying PETRONAS branding on track"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-[58%_center] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/8 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className={textures.stripeFlag} aria-hidden="true" />
              <p className="mt-5 max-w-2xl font-display text-3xl font-extrabold uppercase italic leading-[0.92] text-white sm:text-4xl">
                Malaysian engineering on the world stage.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                PETRONAS remains Mercedes-AMG&apos;s Title and Technical Partner as Formula 1 enters its 2026 regulations era.
              </p>
              <a
                href="https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Mercedes_-_George_Russell_-_FP3.jpg"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block font-mono text-[7px] uppercase tracking-[0.08em] text-white/35 hover:text-white/60"
              >
                Photo: Liauzh / CC BY-SA 4.0
              </a>
            </div>
            <div className={`${textures.stripeBand} absolute inset-x-0 top-0 h-2`} aria-hidden="true" />
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

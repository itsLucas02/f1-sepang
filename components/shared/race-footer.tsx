import Link from "next/link";
import { ArrowUp, Flag } from "lucide-react";

import { SiteContainer } from "@/components/shared/site-container";
import textures from "@/components/shared/motorsport-textures.module.css";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function RaceFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/12 bg-[#08090c]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-[-3%] font-display text-[15rem] font-extrabold italic leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[23rem]"
      >
        56
      </div>
      <div aria-hidden="true" className={`${textures.stripeBand} pointer-events-none absolute right-0 top-0 h-3 w-40 opacity-70 sm:w-64`} />

      <SiteContainer className="relative py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-race-red">
              <Flag aria-hidden="true" className="size-3.5" />
              Chequered flag
            </p>
            <h2 className="mt-6 max-w-4xl font-display text-5xl font-extrabold uppercase italic leading-[0.82] tracking-[-0.05em] text-[#f3f1ec] sm:text-7xl lg:text-8xl">
              See you at the{" "}
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(243,241,236,0.42)]">hairpin</span>
              <span className="text-race-red">.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/58">
              Learn the sport, read Sepang&apos;s corners, then make your race calls with a point of view.
            </p>
            <Link
              href="/#main-content"
              className="group mt-9 inline-flex min-h-11 items-center gap-3 border border-white/20 px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/78 transition-colors hover:border-race-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowUp aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:-translate-y-1" />
              Back to the grid
            </Link>
          </div>

          <aside className="border-l-2 border-race-red pl-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/42">Sepang International Circuit</p>
            <dl className="mt-5 grid grid-cols-3 gap-4 border-y border-white/12 py-5">
              <div><dd className="font-display text-3xl font-extrabold italic leading-none text-[#f3f1ec]">5.543</dd><dt className="mt-1 font-mono text-[8px] uppercase tracking-[0.13em] text-white/42">KM</dt></div>
              <div><dd className="font-display text-3xl font-extrabold italic leading-none text-[#f3f1ec]">15</dd><dt className="mt-1 font-mono text-[8px] uppercase tracking-[0.13em] text-white/42">Turns</dt></div>
              <div><dd className="font-display text-3xl font-extrabold italic leading-none text-[#f3f1ec]">56</dd><dt className="mt-1 font-mono text-[8px] uppercase tracking-[0.13em] text-white/42">Laps</dt></div>
            </dl>
          </aside>
        </div>

        <div className="grid gap-8 py-9 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-3 font-display text-2xl font-extrabold uppercase italic leading-none text-[#f3f1ec]">
            <span>Sepang</span>
            <span className={textures.brandFlag} aria-hidden="true" />
            <span>56</span>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/52 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/38">
            Sepang / Malaysia · 5.543 km · 56 laps
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/38">
            {SITE_NAME} — independent fan project. Not affiliated with Formula 1.
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
}

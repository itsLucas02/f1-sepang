import Link from "next/link";

import { SiteContainer } from "@/components/shared/site-container";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function RaceFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/8 bg-header">
      <div className="chequer absolute inset-x-0 top-0 h-4 opacity-25" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-4%] font-display text-[14rem] font-extrabold leading-none tracking-[-0.06em] text-white/[0.025] sm:text-[20rem]"
      >
        56
      </div>

      <SiteContainer className="relative py-12 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-7 w-[3px] skew-x-[-16deg] bg-[linear-gradient(180deg,var(--sepang-race-red),var(--sepang-sunset))]"
              />
              <span className="flex items-baseline gap-1.5 font-display text-2xl font-extrabold uppercase leading-none text-white">
                SEPANG <span className="text-race-red">56</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-text-muted">
              A beginner-first guide to the Malaysian Grand Prix at Sepang
              International Circuit. Learn the sport, read the circuit, back
              your calls.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-10 gap-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-xs font-bold uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            Sepang / Malaysia · 5.543 km · 56 laps
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            {SITE_NAME} — independent fan project. Not affiliated with Formula 1.
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
}

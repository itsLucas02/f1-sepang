"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export function RaceFlowHeader({
  onBack,
  backLabel = "Go back",
  exitHref,
  exitLabel = "Exit flow",
  homeHref = "/",
}: {
  onBack: () => void;
  backLabel?: string;
  exitHref?: string;
  exitLabel?: string;
  homeHref?: string;
}) {
  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-race-red/70 bg-[#050506]/96 backdrop-blur-lg">
      <div className="grid min-h-14 grid-cols-[52px_1fr_52px] items-center px-4 sm:px-6 md:min-h-16 md:grid-cols-[180px_1fr_180px] md:px-8">
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="inline-flex size-11 items-center justify-center border border-white/12 text-white transition-colors hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:w-auto md:justify-start md:gap-2 md:border-0 md:px-0"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.13em] text-white/55 md:inline">
            {backLabel}
          </span>
        </button>

        <Link
          href={homeHref}
          aria-label="SEPANG 56 home"
          className="justify-self-center text-center font-display text-lg font-extrabold uppercase italic tracking-[-0.01em] text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-xl"
        >
          <span>SEPANG </span>
          <span className="text-race-red">56</span>
        </Link>

        {exitHref ? (
          <Link
            href={exitHref}
            aria-label={exitLabel}
            className="inline-flex size-11 items-center justify-center justify-self-end border border-white/12 text-white transition-colors hover:border-race-red/65 hover:bg-race-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:w-auto md:gap-2 md:border-0 md:px-0"
          >
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.13em] text-white/55 md:inline">
              {exitLabel}
            </span>
            <X aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <div className="hidden items-center justify-end gap-3 md:flex">
            <span className="motorsport-stripe block scale-[0.55] origin-right" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="motorsport-corner pointer-events-none absolute right-0 top-0 hidden h-2.5 w-24 md:block" aria-hidden="true" />
    </header>
  );
}

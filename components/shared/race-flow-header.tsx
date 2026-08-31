"use client";

import { ArrowLeft } from "lucide-react";

import { SITE_NAME } from "@/lib/constants";

export function RaceFlowHeader({
  onBack,
  backLabel = "Go back",
}: {
  onBack: () => void;
  backLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header">
      <div className="grid min-h-14 grid-cols-[44px_1fr_44px] items-center px-5 md:min-h-16 md:px-8">
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="inline-flex size-11 items-center justify-center rounded-md text-white transition-colors hover:bg-surface-02 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>

        <div className="text-center font-mono text-xs font-medium tracking-[0.14em] text-white">
          {SITE_NAME}
        </div>

        <span aria-hidden="true" />
      </div>
    </header>
  );
}

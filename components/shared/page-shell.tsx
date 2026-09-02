import type { ReactNode } from "react";

import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";
import type { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PageShellProps = {
  activeHref?: (typeof NAV_ITEMS)[number]["href"];
  children: ReactNode;
  className?: string;
  /** Renders the ambient sunset/teal wash behind the page content. */
  glow?: boolean;
};

/**
 * Standard dark page frame: header, ambient atmosphere, contained main, footer.
 * Every content page uses this so surfaces and contrast stay consistent.
 */
export function PageShell({
  activeHref,
  children,
  className,
  glow = true,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-foreground">
      <RaceHeader activeHref={activeHref} />

      <main className="relative flex-1 overflow-hidden">
        {glow ? (
          <>
            <div
              aria-hidden="true"
              className="sepang-glow pointer-events-none absolute inset-x-0 top-0 h-[720px]"
            />
            <div
              aria-hidden="true"
              className="race-grid pointer-events-none absolute inset-x-0 top-0 h-[720px] opacity-50"
            />
          </>
        ) : null}

        <SiteContainer
          className={cn("relative py-12 sm:py-16 lg:py-20", className)}
        >
          {children}
        </SiteContainer>
      </main>

      <RaceFooter />
    </div>
  );
}

/** Consistent eyebrow + headline block used across pages. */
export function PageHeading({
  eyebrow,
  title,
  accent,
  description,
  actions,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-race-red">
          <span aria-hidden="true" className="h-[2px] w-8 bg-race-red" />
          {eyebrow}
        </p>
        <h1
          id={id}
          className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl"
        >
          {title}
          {accent ? (
            <span className="block text-gradient-heat">{accent}</span>
          ) : null}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

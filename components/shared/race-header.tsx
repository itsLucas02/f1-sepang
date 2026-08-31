import Link from "next/link";

import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SiteContainer } from "@/components/shared/site-container";

type RaceHeaderProps = {
  activeHref?: (typeof NAV_ITEMS)[number]["href"];
};

export function RaceHeader({ activeHref }: RaceHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header">
      <div className="h-1 bg-stripe-dark" aria-hidden="true">
        <div className="h-full w-24 bg-stripe-light" />
      </div>

      <SiteContainer className="flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-[0.04em] text-white"
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-stretch md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-[72px] items-center px-4 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:text-white",
                  isActive && "text-white after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-race-red",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <details className="relative md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-md border border-border bg-surface-01 px-4 text-sm font-bold uppercase text-white marker:content-none">
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-[calc(100%+8px)] w-52 border border-border bg-header p-2"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.href === activeHref ? "page" : undefined}
                className={cn(
                  "block min-h-11 border-b border-border px-3 py-3 text-sm font-semibold text-text-secondary last:border-b-0",
                  item.href === activeHref && "text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </SiteContainer>
    </header>
  );
}

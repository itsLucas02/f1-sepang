import Link from "next/link";
import { Menu } from "lucide-react";

import { SiteContainer } from "@/components/shared/site-container";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type RaceHeaderProps = {
  activeHref?: (typeof NAV_ITEMS)[number]["href"];
};

export function RaceHeader({ activeHref }: RaceHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101016]/95 backdrop-blur-md">
      <div className="h-[3px] bg-[#1d1d25]" aria-hidden="true">
        <div className="h-full w-28 bg-race-red" />
      </div>

      <SiteContainer className="flex h-14 items-center justify-between gap-6 md:h-[72px]">
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="group flex items-baseline gap-1 font-display text-2xl font-extrabold uppercase tracking-[0.025em] text-white"
        >
          <span>SEPANG</span>
          <span className="text-race-red transition-colors group-hover:text-white">56</span>
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
                  "relative flex h-[72px] items-center px-5 text-xs font-bold uppercase tracking-[0.08em] text-text-secondary transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white",
                  isActive &&
                    "text-white after:absolute after:inset-x-5 after:bottom-0 after:h-[3px] after:bg-race-red",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="h-px w-7 bg-white/20" aria-hidden="true" />
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            Race ready
          </span>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[4px] border border-white/15 bg-[#15151c] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>{SITE_NAME}</SheetTitle>
              <SheetDescription className="sr-only">
                Primary navigation
              </SheetDescription>
              <nav aria-label="Mobile navigation" className="mt-10">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.href === activeHref ? "page" : undefined}
                      className={cn(
                        "block min-h-11 border-b border-border px-1 py-4 text-base font-bold uppercase tracking-[0.05em] text-text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white",
                        item.href === activeHref && "border-l-2 border-l-race-red pl-3 text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </SiteContainer>
    </header>
  );
}

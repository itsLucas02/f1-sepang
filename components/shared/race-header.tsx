import Link from "next/link";
import { Menu } from "lucide-react";

import { ScrollProgress } from "@/components/shared/scroll-progress";
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
    <header className="sticky top-0 z-50 overflow-hidden border-b border-race-red/70 bg-[#0a0c11]/92 backdrop-blur-xl">
      <SiteContainer className="flex h-16 items-center justify-between gap-5 md:h-[68px]">
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="group inline-flex items-baseline gap-2 font-display text-2xl font-extrabold uppercase italic leading-none tracking-[-0.02em] text-white sm:text-[1.7rem]"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            SEPANG
          </span>
          <span className="text-race-red">56</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden h-full items-stretch md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex h-full items-center px-5 font-display text-[12px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white",
                  isActive ? "text-white" : "text-text-secondary hover:text-white",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-4 bottom-0 h-[3px] origin-center bg-race-red transition-transform duration-300",
                    isActive
                      ? "nav-active-line scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="live-dot" aria-hidden="true" />
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
            Sepang / MY
          </span>
          <span className="motorsport-stripe block origin-right scale-75" aria-hidden="true" />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/15 bg-[#0d0d0f] text-white transition-colors hover:border-white/35 hover:bg-[#171719] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
                {NAV_ITEMS.map((item, index) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.href === activeHref ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center gap-4 border-b border-border px-1 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none",
                        item.href === activeHref
                          ? "border-l-2 border-l-race-red pl-3 text-white"
                          : "text-text-secondary",
                      )}
                    >
                      <span className="font-mono text-[10px] tracking-[0.14em] text-race-red">
                        0{index + 1}
                      </span>
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </SiteContainer>

      <div className="motorsport-corner pointer-events-none absolute right-0 top-0 hidden h-3 w-28 md:block" aria-hidden="true" />
      <ScrollProgress />
    </header>
  );
}

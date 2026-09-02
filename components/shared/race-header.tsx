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
    <header className="sticky top-0 z-50 border-b border-white/8 bg-header/85 backdrop-blur-xl">
      {/* kerb edge */}
      <div className="kerb-stripe-thin h-[3px] opacity-90" aria-hidden="true" />

      <SiteContainer className="flex h-16 items-center justify-between gap-6 md:h-[76px]">
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="group flex items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="h-7 w-[3px] skew-x-[-16deg] bg-[linear-gradient(180deg,var(--sepang-race-red),var(--sepang-sunset))] transition-all duration-300 group-hover:h-9"
          />
          <span className="flex items-baseline gap-1.5 font-display text-2xl font-extrabold uppercase leading-none tracking-[0.02em] text-white">
            <span>SEPANG</span>
            <span className="text-race-red transition-colors duration-200 group-hover:text-sunset">
              56
            </span>
          </span>
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
                  "group relative flex h-[76px] items-center px-5 font-display text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal",
                  isActive ? "text-white" : "text-text-secondary hover:text-white",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-4 bottom-0 h-[3px] origin-left bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))] transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-teal" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary">
            Race ready
          </span>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/15 bg-surface-02 text-white transition-colors hover:border-teal/60 hover:bg-surface-03 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
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
    </header>
  );
}

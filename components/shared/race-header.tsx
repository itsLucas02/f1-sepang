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
                  isActive &&
                    "text-white after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-race-red",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-surface-01 text-white"
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
                        "block min-h-11 border-b border-border px-1 py-4 text-base font-semibold text-text-secondary transition-colors hover:text-white",
                        item.href === activeHref && "text-white",
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

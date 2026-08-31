import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";
import { SiteContainer } from "@/components/shared/site-container";

const FOOTER_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export function RaceFooter() {
  return (
    <footer className="border-t border-border bg-header">
      <SiteContainer className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-display text-lg font-bold tracking-[0.04em] text-white">
          {SITE_NAME}
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-text-muted transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SiteContainer>
    </footer>
  );
}

import { SiteContainer } from "@/components/shared/site-container";
import { SITE_NAME } from "@/lib/constants";

export function RaceFooter() {
  return (
    <footer className="border-t border-border bg-header">
      <SiteContainer className="py-8 text-center sm:text-left">
        <div className="font-display text-lg font-bold tracking-[0.04em] text-white">
          {SITE_NAME}
        </div>
      </SiteContainer>
    </footer>
  );
}

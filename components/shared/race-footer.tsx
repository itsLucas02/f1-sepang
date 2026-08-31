import { SITE_NAME } from "@/lib/constants";
import { SiteContainer } from "@/components/shared/site-container";

export function RaceFooter() {
  return (
    <footer className="border-t border-border bg-header">
      <SiteContainer className="py-8">
        <div className="font-display text-lg font-bold tracking-[0.04em] text-white">
          {SITE_NAME}
        </div>
      </SiteContainer>
    </footer>
  );
}

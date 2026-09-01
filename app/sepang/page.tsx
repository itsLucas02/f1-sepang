import { SepangExplorer } from "@/components/circuit/sepang-explorer";
import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";

export default function SepangPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f3ef] text-[#111113]">
      <RaceHeader activeHref="/sepang" />
      <main className="flex-1">
        <SiteContainer className="py-12 sm:py-16 lg:py-20">
          <SepangExplorer />
        </SiteContainer>
      </main>
      <RaceFooter />
    </div>
  );
}

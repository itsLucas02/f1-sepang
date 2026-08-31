import { LearnExperience } from "@/components/learn/learn-experience";
import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader activeHref="/learn" />
      <main className="flex-1">
        <SiteContainer className="py-12 sm:py-16 lg:py-20">
          <LearnExperience />
        </SiteContainer>
      </main>
      <RaceFooter />
    </div>
  );
}

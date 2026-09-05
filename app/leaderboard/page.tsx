import { GlobalLeaderboard } from "@/components/competition/global-leaderboard";
import { PageHeading, PageShell } from "@/components/shared/page-shell";

export default function LeaderboardPage() {
  return (
    <PageShell activeHref="/leaderboard">
      <PageHeading
        eyebrow="Competition / Global grid"
        title="The community"
        accent="grid."
        description="Every saved prediction joins one global Sepang grid. Scores appear after the race result is entered."
      />
      <div className="mt-14">
        <GlobalLeaderboard />
      </div>
    </PageShell>
  );
}

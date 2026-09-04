import { LearnExperience } from "@/components/learn/learn-experience";
import { PageShell } from "@/components/shared/page-shell";

export default function LearnPage() {
  return (
    <PageShell activeHref="/learn">
      <LearnExperience />
    </PageShell>
  );
}

import { SepangExplorer } from "@/components/circuit/sepang-explorer";
import { PageShell } from "@/components/shared/page-shell";

export default function SepangPage() {
  return (
    <PageShell activeHref="/sepang">
      <SepangExplorer />
    </PageShell>
  );
}

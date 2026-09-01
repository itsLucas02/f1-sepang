import Link from "next/link";
import { ArrowLeft, Flag } from "lucide-react";

import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f3ef] text-[#111113]">
      <RaceHeader activeHref="/leaderboard" />

      <main className="flex flex-1 items-center">
        <SiteContainer className="w-full py-16 sm:py-24">
          <section className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-9 bg-race-red" />
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#6f6f75]">
                  Competition / Demo mode
                </p>
              </div>

              <h1 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
                The grid comes
                <span className="block text-race-red">next.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-7 text-[#55555b]">
                Friend leagues and the scored leaderboard belong to the server-backed competition phase. The current GitHub Pages build keeps that data offline rather than showing fake ranks.
              </p>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border-t-2 border-[#111113] pt-5">
                <Flag className="size-6 text-race-red" aria-hidden="true" />
                <p className="mt-5 font-display text-3xl font-extrabold uppercase leading-none">
                  Your demo picks still work.
                </p>
                <p className="mt-3 text-base leading-6 text-[#65656b]">
                  Complete all eight calls now. Your selections stay stored in this browser while the backend is offline.
                </p>

                <div className="mt-7 flex flex-col gap-3">
                  <Button asChild>
                    <Link href="/predict">Make Your Picks</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/">
                      <ArrowLeft aria-hidden="true" className="size-4" />
                      Back Home
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </SiteContainer>
      </main>

      <RaceFooter />
    </div>
  );
}

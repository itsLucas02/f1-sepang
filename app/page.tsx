import Link from "next/link";
import { ArrowRight, BookOpen, Flag, MapPinned, Trophy } from "lucide-react";

import { JourneyStepCard } from "@/components/landing/journey-step-card";
import { LandingScene } from "@/components/landing/landing-scene";
import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";
import { Button } from "@/components/ui/button";

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Learn",
    description: "Get the race-day F1 basics without the jargon overload.",
    href: "/learn",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Sepang",
    description: "Read the real circuit and know where the race can change.",
    href: "/sepang",
    icon: MapPinned,
  },
  {
    number: "03",
    title: "Predict",
    description: "Make eight clear calls before the race gets underway.",
    href: "/predict",
    icon: Flag,
  },
  {
    number: "04",
    title: "Compete",
    description: "Compare your calls with friends when competition goes live.",
    href: "/leaderboard",
    icon: Trophy,
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#0b0b10]">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-race-red via-race-red to-transparent"
          />

          <SiteContainer className="py-6 sm:py-8 lg:py-10">
            <div className="relative min-h-[700px] overflow-hidden rounded-[6px] border border-white/10 bg-[#0d0d13] lg:min-h-[720px]">
              <div className="absolute inset-0 lg:left-[39%]">
                <LandingScene />
              </div>

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,#0d0d13_0%,#0d0d13_36%,rgba(13,13,19,0.93)_48%,rgba(13,13,19,0.18)_77%,rgba(13,13,19,0.08)_100%)] max-lg:bg-[linear-gradient(180deg,#0d0d13_0%,#0d0d13_42%,rgba(13,13,19,0.82)_61%,rgba(13,13,19,0.15)_100%)]"
              />

              <div className="relative z-20 flex min-h-[700px] flex-col justify-between p-6 sm:p-8 lg:min-h-[720px] lg:w-[58%] lg:p-12 xl:p-16">
                <div className="flex items-center gap-3">
                  <span className="h-0.5 w-10 bg-race-red" aria-hidden="true" />
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/65 sm:text-xs">
                    Beginner-first race weekend guide
                  </p>
                </div>

                <div className="my-auto max-w-2xl py-16 lg:py-10">
                  <p className="font-display text-xl font-bold uppercase tracking-[0.03em] text-race-red sm:text-2xl">
                    Malaysia / Sepang
                  </p>
                  <h1 className="mt-4 font-display text-[4.2rem] font-extrabold uppercase leading-[0.82] tracking-[-0.045em] text-white sm:text-[6rem] lg:text-[7.2rem] xl:text-[8.4rem]">
                    F1 Returns
                    <span className="block text-white/92">to Sepang.</span>
                  </h1>

                  <p className="mt-7 max-w-xl text-lg leading-7 text-white/70 sm:text-xl sm:leading-8">
                    You do not need to know F1 to enjoy it. Learn the basics,
                    understand the circuit and make picks you can actually explain.
                  </p>

                  <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button asChild className="min-w-48">
                      <Link href="/learn">
                        Get Race Ready
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                    <Link
                      href="/sepang"
                      className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold uppercase tracking-[0.04em] text-white/75 transition-colors hover:text-white"
                    >
                      Explore the circuit
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5 border-t border-white/15 pt-5">
                  <div>
                    <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">56</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45 sm:text-[10px]">
                      race laps
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">15</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45 sm:text-[10px]">
                      corners
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">8</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45 sm:text-[10px]">
                      race picks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SiteContainer>
        </section>

        <section className="bg-[#f1f1f0] text-[#141419]">
          <SiteContainer className="py-16 sm:py-20 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-race-red">
                  Your race weekend
                </p>
                <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">
                  Go from zero to race ready.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-7 text-[#56565f] lg:col-span-5 lg:col-start-8">
                Four focused steps. No fantasy dashboard, no fake telemetry, no wall of jargon — just what helps you understand Sepang and enjoy the race.
              </p>
            </div>

            <div
              aria-label="Your SEPANG 56 journey"
              className="mt-12 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
            >
              {JOURNEY_STEPS.map((step) => (
                <JourneyStepCard key={step.number} {...step} />
              ))}
            </div>
          </SiteContainer>
        </section>

        <section className="relative overflow-hidden border-y border-border bg-[#15151c]">
          <div className="race-grid absolute inset-0 opacity-35" aria-hidden="true" />
          <SiteContainer className="relative py-14 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-race-red">
                  The point of SEPANG 56
                </p>
                <p className="mt-4 max-w-4xl font-display text-4xl font-bold uppercase leading-[0.95] text-white sm:text-5xl">
                  Watch the race knowing why a corner, tyre call or late-braking move matters.
                </p>
              </div>
              <div className="lg:col-span-3 lg:col-start-10">
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/learn">Start with the basics</Link>
                </Button>
              </div>
            </div>
          </SiteContainer>
        </section>
      </main>

      <RaceFooter />
    </div>
  );
}

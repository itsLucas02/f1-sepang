import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Flag, MapPinned, Trophy } from "lucide-react";

import { JourneyStepCard } from "@/components/landing/journey-step-card";
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

const HERO_STATS = [
  { value: "56", label: "race laps" },
  { value: "15", label: "corners" },
  { value: "5.543", label: "km lap" },
  { value: "8", label: "race picks" },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main className="flex-1">
        {/* ---------------- HERO ---------------- */}
        <section className="relative isolate overflow-hidden">
          {/* Photographic base */}
          <div className="absolute inset-0 -z-20">
            <Image
              src="/hero-sepang.jpg"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="hero-kenburns object-cover object-[60%_center]"
            />
          </div>

          {/* Legibility + mood grading */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#08090c_0%,rgba(8,9,12,0.96)_34%,rgba(8,9,12,0.72)_56%,rgba(8,9,12,0.35)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(8,9,12,0.72)_0%,rgba(8,9,12,0.9)_46%,#08090c_100%)]"
          />
          <div
            aria-hidden="true"
            className="sepang-glow absolute inset-0 -z-10 mix-blend-screen"
          />
          <div
            aria-hidden="true"
            className="race-grid absolute inset-0 -z-10 opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(180deg,transparent,#08090c)]"
          />

          <SiteContainer className="relative flex min-h-[calc(100vh-76px)] flex-col justify-between py-12 lg:py-16">
            <div className="rise-in flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[2px] w-10 bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))]"
              />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary sm:text-xs">
                Beginner-first race weekend guide
              </p>
            </div>

            <div className="my-16 max-w-3xl lg:my-14">
              <p className="rise-in rise-in-1 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-lg font-bold uppercase tracking-[0.16em] text-sunset sm:text-xl">
                Malaysia
                <span aria-hidden="true" className="text-white/25">
                  /
                </span>
                Sepang
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-white/20 sm:block"
                />
                <span className="rounded-sm border border-teal/35 bg-teal/10 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-teal">
                  2026 SEASON
                </span>
              </p>

              <h1 className="rise-in rise-in-2 mt-5 font-display text-[3.6rem] font-extrabold uppercase leading-[0.82] tracking-[-0.045em] text-white sm:text-[5.6rem] lg:text-[7rem] xl:text-[8.2rem]">
                <span className="block">F1 Returns</span>
                <span className="text-gradient-heat block">to Sepang.</span>
              </h1>

              <p className="rise-in rise-in-3 mt-7 max-w-xl text-lg leading-8 text-text-secondary sm:text-xl">
                You do not need to know F1 to enjoy it. Learn the basics,
                understand the circuit, and make picks you can actually explain.
              </p>

              <div className="rise-in rise-in-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="large" className="min-w-52">
                  <Link href="/learn">
                    Get Race Ready
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="large" variant="secondary">
                  <Link href="/sepang">
                    Explore the circuit
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative bg-[#0b0e13]/80 px-5 py-5 transition-colors duration-200 hover:bg-[#11151c]/90"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-race-red transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <dd className="font-display text-3xl font-extrabold leading-none text-white sm:text-4xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </SiteContainer>
        </section>

        {/* ---------------- JOURNEY ---------------- */}
        <section className="relative overflow-hidden bg-surface-01">
          <div className="speed-hatch absolute inset-0 opacity-40" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--sepang-race-red),transparent)]"
          />

          <SiteContainer className="relative py-20 sm:py-24 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-race-red">
                  <span aria-hidden="true" className="h-[2px] w-8 bg-race-red" />
                  Your race weekend
                </p>
                <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
                  Go from zero to
                  <span className="block text-gradient-heat">race ready.</span>
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-text-secondary lg:col-span-5 lg:col-start-8">
                Four focused steps. No fantasy dashboard, no fake telemetry, no
                wall of jargon — just what helps you understand Sepang and enjoy
                the race.
              </p>
            </div>

            <div
              aria-label="Your SEPANG 56 journey"
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
            >
              {JOURNEY_STEPS.map((step) => (
                <JourneyStepCard key={step.number} {...step} />
              ))}
            </div>
          </SiteContainer>
        </section>

        {/* ---------------- CLOSING ---------------- */}
        <section className="relative overflow-hidden border-y border-white/8 bg-canvas">
          <div className="sepang-glow absolute inset-0" aria-hidden="true" />
          <div className="carbon-weave absolute inset-0 opacity-60" aria-hidden="true" />

          <SiteContainer className="relative py-20 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
                  The point of SEPANG 56
                </p>
                <p className="mt-5 max-w-4xl font-display text-4xl font-bold uppercase leading-[0.98] text-white sm:text-5xl lg:text-[3.4rem]">
                  Watch the race knowing why a corner, tyre call or late-braking
                  move <span className="text-race-red">matters.</span>
                </p>
              </div>
              <div className="lg:col-span-3 lg:col-start-10">
                <Button asChild size="large" className="w-full">
                  <Link href="/learn">
                    Start with the basics
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </SiteContainer>

          <div className="kerb-stripe h-2 opacity-80" aria-hidden="true" />
        </section>
      </main>

      <RaceFooter />
    </div>
  );
}

import Link from "next/link";
import { BookOpen, Flag, MapPinned, Trophy } from "lucide-react";

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
    description: "Learn the F1 basics you need for race day.",
    href: "/learn",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Sepang",
    description: "Discover the circuit and what makes it special.",
    href: "/sepang",
    icon: MapPinned,
  },
  {
    number: "03",
    title: "Predict",
    description: "Make your race-weekend picks.",
    href: "/predict",
    icon: Flag,
  },
  {
    number: "04",
    title: "Compete",
    description: "See how your predictions compare with friends.",
    href: "/leaderboard",
    icon: Trophy,
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main className="flex-1">
        <SiteContainer className="py-14 sm:py-16 lg:py-24">
          <section className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
            <div className="lg:col-span-6 lg:pr-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-race-red" aria-hidden="true" />
                <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-text-secondary">
                  Sepang / Malaysia
                </p>
              </div>

              <h1 className="mt-6 max-w-xl font-display text-[42px] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
                F1 Returns to Sepang
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-7 text-text-secondary">
                You don&apos;t need to know F1 to enjoy F1. Learn the basics,
                understand Sepang, make your picks and compete with your friends.
              </p>

              <div className="mt-8">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/learn">Get Race Ready</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <LandingScene />
            </div>
          </section>

          <section
            aria-label="Your SEPANG 56 journey"
            className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6"
          >
            {JOURNEY_STEPS.map((step) => (
              <JourneyStepCard key={step.number} {...step} />
            ))}
          </section>
        </SiteContainer>
      </main>

      <RaceFooter />
    </div>
  );
}

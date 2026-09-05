import Link from "next/link";
import { ArrowLeft, ArrowRight, Flag, Lock, Trophy, Users } from "lucide-react";

import { PageHeading, PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

const PODIUM_PLACEHOLDER = [
  { pos: "P1", accent: "text-gold", border: "border-gold/30", h: "h-40" },
  { pos: "P2", accent: "text-silver", border: "border-silver/25", h: "h-32" },
  { pos: "P3", accent: "text-bronze", border: "border-bronze/25", h: "h-24" },
] as const;

const UPCOMING = [
  {
    icon: Users,
    title: "Friend leagues",
    body: "Create a league, share a code, and race your picks against your group.",
  },
  {
    icon: Trophy,
    title: "Scored leaderboard",
    body: "Points awarded per correct call once the chequered flag drops.",
  },
  {
    icon: Flag,
    title: "Race-by-race history",
    body: "Track your accuracy across the season, not just a single Sunday.",
  },
] as const;

export default function LeaderboardPage() {
  return (
    <PageShell activeHref="/leaderboard">
      <PageHeading
        eyebrow="Competition / Demo mode"
        title="The grid comes"
        accent="next."
        description="Friend leagues and the scored leaderboard belong to the server-backed competition phase. This build keeps that data offline rather than showing you fake ranks."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-12">
        {/* Locked podium visual */}
        <section
          aria-label="Leaderboard preview"
          className="surface-card relative overflow-hidden rounded-lg p-6 sm:p-8 lg:col-span-7"
        >
          <div className="chequer absolute inset-0 opacity-[0.06]" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-race-red/60"
          />

          <div className="relative flex items-center gap-2.5">
            <Lock aria-hidden="true" className="size-4 text-text-muted" />
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
              Locked until competition goes live
            </p>
          </div>

          <div className="relative mt-10 flex items-end justify-center gap-3 sm:gap-5">
            {PODIUM_PLACEHOLDER.map((step) => (
              <div key={step.pos} className="flex w-full max-w-36 flex-col items-center">
                <div className="mb-3 size-10 rounded-full border border-white/10 bg-surface-03" />
                <div className="mb-2 h-2.5 w-16 rounded-full bg-white/8" />
                <div
                  className={`flex ${step.h} w-full items-start justify-center rounded-t-md border border-b-0 ${step.border} bg-white/[0.04] pt-4`}
                >
                  <span
                    className={`font-display text-2xl font-extrabold uppercase ${step.accent}`}
                  >
                    {step.pos}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="kerb-stripe-thin relative h-1.5 opacity-70" aria-hidden="true" />
        </section>

        {/* Action card */}
        <section className="relative overflow-hidden rounded-lg border border-race-red/25 bg-surface-02 p-6 sm:p-8 lg:col-span-5">
          <span
            aria-hidden="true"
            className="absolute -right-20 -top-20 size-56 rounded-full bg-race-red/20 blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex size-11 items-center justify-center rounded-md border border-race-red/40 bg-race-red/10 text-race-red">
              <Flag aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold uppercase leading-none text-white sm:text-4xl">
              Your demo picks still work.
            </h2>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              Complete all eight calls now. Your selections stay stored in this
              browser while the backend is offline.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="large">
                <Link href="/predict">
                  Make Your Picks
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Back Home
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* What's coming */}
      <section aria-labelledby="upcoming-title" className="mt-16">
        <h2
          id="upcoming-title"
          className="font-display text-2xl font-bold uppercase tracking-[0.02em] text-white"
        >
          What lands with competition
        </h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
          {UPCOMING.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group bg-surface-01 p-6 transition-colors hover:bg-surface-02">
              <Icon aria-hidden="true" className="size-5 text-teal" />
              <h3 className="mt-5 font-display text-xl font-bold uppercase text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

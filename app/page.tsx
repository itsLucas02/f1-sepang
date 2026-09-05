import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Flag, MapPinned, Trophy } from "lucide-react";

import { HotLapPreview } from "@/components/landing/hot-lap-preview";
import { JourneyStepCard } from "@/components/landing/journey-step-card";
import { MalaysiaF1Heritage } from "@/components/landing/malaysia-f1-heritage";
import { StartLightIntro } from "@/components/landing/start-light-intro";
import { CountUp } from "@/components/shared/count-up";
import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SiteContainer } from "@/components/shared/site-container";
import textures from "@/components/shared/motorsport-textures.module.css";
import { Button } from "@/components/ui/button";
import { publicAsset } from "@/lib/assets";

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Learn",
    description: "Grasp the essentials of F1 in focused, beginner-friendly lessons.",
    href: "/learn",
    icon: BookOpen,
    imageSrc: "/media/journey/learn.webp",
    imagePosition: "55% 62%",
  },
  {
    number: "02",
    title: "Sepang",
    description: "Explore Sepang's real layout, braking zones and race-shaping corners.",
    href: "/sepang",
    icon: MapPinned,
    imageSrc: "/media/journey/sepang.webp",
    imagePosition: "68% 38%",
  },
  {
    number: "03",
    title: "Predict",
    description: "Make eight informed race calls and build your Sepang prediction card.",
    href: "/predict",
    icon: Flag,
    imageSrc: "/media/journey/predict.webp",
    imagePosition: "50% 30%",
  },
  {
    number: "04",
    title: "Compete",
    description: "Compare your calls with friends when competition goes live.",
    href: "/leaderboard",
    icon: Trophy,
    imageSrc: "/media/journey/compete.webp",
    imagePosition: "50% 30%",
  },
] as const;

const HERO_STATS = [
  { value: 56, decimals: 0, label: "Race laps" },
  { value: 15, decimals: 0, label: "Corners" },
  { value: 5.543, decimals: 3, label: "KM lap" },
  { value: 8, decimals: 0, label: "Race picks" },
] as const;

const TICKER_ITEMS = [
  "Sepang International Circuit",
  "5.543 km · 15 turns · 56 laps",
  "First Grand Prix 1999",
  "Race lap record 1:34.223",
  "Two DRS straights",
  "Tropical heat · 30°C+ track temps",
  "Turn 9 hairpin · slowest point of the lap",
  "Eight race picks · 25 points",
] as const;

const HERO_IMAGE = publicAsset("/media/hero/hero-sepang.webp");
const LECLERC_IMAGE = publicAsset("/media/drivers/leclerc.webp");
const NORRIS_IMAGE = publicAsset("/media/drivers/norris.webp");

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main className="flex-1">
        <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-white/10 bg-[#050506] md:min-h-[calc(100svh-4.25rem)]">
          <div className="absolute inset-0 -z-20">
            <Image
              src={HERO_IMAGE}
              alt="Sepang circuit race atmosphere"
              fill
              priority
              sizes="100vw"
              className="hero-kenburns object-cover object-center"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(5,5,6,0.86)_0%,rgba(5,5,6,0.74)_26%,rgba(5,5,6,0.42)_48%,rgba(5,5,6,0.12)_72%,rgba(5,5,6,0.02)_100%)] lg:block"
          />
          <div aria-hidden="true" className="photo-vignette-mobile absolute inset-0 -z-10 lg:hidden" />
          <div aria-hidden="true" className="race-noise absolute inset-0 -z-10 opacity-16" />
          <StartLightIntro />

          <SiteContainer className="relative flex min-h-[calc(100svh-4rem)] flex-col py-8 sm:py-10 md:min-h-[calc(100svh-4.25rem)] lg:py-12">
            <div className="grid min-h-[560px] flex-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="relative z-10 lg:col-span-6 xl:col-span-5">
                <div className="rise-in flex items-center gap-4">
                  <span className={textures.stripeFlag} aria-hidden="true" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 sm:text-[11px]">
                    Malaysia / Sepang / 2026
                  </p>
                </div>

                <h1 className="rise-in rise-in-1 mt-7 font-display text-[4.3rem] font-extrabold uppercase italic leading-[0.78] tracking-[-0.055em] sm:text-[6.6rem] lg:text-[6.9rem] xl:text-[7.8rem]">
                  <span className="block text-[#f3f1ec]">F1 Returns</span>
                  <span className="block text-race-red">to Sepang.</span>
                </h1>

                <div className="rise-in rise-in-2 mt-7">
                  <span className="motorsport-stripe block scale-75 origin-left" aria-hidden="true" />
                  <p className="mt-5 max-w-lg text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                    Learn the basics, understand the circuit, and make race-day picks you can actually explain.
                  </p>
                </div>

                <div className="rise-in rise-in-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="large" className="sheen min-w-52 rounded-none border border-race-red bg-race-red font-bold uppercase tracking-[0.06em] shadow-[0_14px_34px_rgba(225,6,0,0.18)]">
                    <Link href="/learn">
                      Get Race Ready
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="large" variant="secondary" className="min-w-52 rounded-none border-white/35 bg-black/55 uppercase tracking-[0.05em] hover:border-white/60 hover:bg-black/75">
                    <Link href="/sepang">
                      Explore the Circuit
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative hidden min-h-[560px] lg:col-span-6 lg:block xl:col-span-7">
                <div className="absolute bottom-5 right-0 top-5 w-[34%] min-w-[250px]">
                  <div className="hero-portrait-enter hero-portrait-enter-1 absolute inset-x-0 top-0 h-[57%] overflow-hidden border-l border-white/35 bg-[#121214] [clip-path:polygon(20%_0,100%_0,82%_100%,0_100%)]">
                    <Image
                      src={LECLERC_IMAGE}
                      alt="Charles Leclerc"
                      fill
                      sizes="360px"
                      className="object-cover object-[50%_18%] grayscale-[0.2] contrast-110"
                    />
                    <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" aria-hidden="true" />
                    <p className="absolute bottom-5 left-12 font-display text-xl font-extrabold uppercase italic text-white">Leclerc</p>
                  </div>

                  <div className="hero-portrait-enter hero-portrait-enter-2 absolute inset-x-0 bottom-0 h-[45%] overflow-hidden border-l border-race-red/70 bg-[#121214] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]">
                    <Image
                      src={NORRIS_IMAGE}
                      alt="Lando Norris"
                      fill
                      sizes="360px"
                      className="object-cover object-[52%_20%] grayscale-[0.2] contrast-110"
                    />
                    <div className="absolute inset-0 bg-black/14" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 to-transparent" aria-hidden="true" />
                    <p className="absolute bottom-5 left-10 font-display text-xl font-extrabold uppercase italic text-white">Norris</p>
                  </div>
                </div>

                <div className="motorsport-corner absolute right-0 top-0 h-3 w-36" aria-hidden="true" />
                <p className="absolute bottom-1 right-3 max-w-[280px] text-right font-mono text-[8px] uppercase tracking-[0.1em] text-white/35">
                  Portraits: Gilzetbase CC BY-SA 4.0 / David Merrett CC BY 2.0
                </p>
              </div>
            </div>

            <dl className="hero-stats-enter carbon-weave relative z-20 mt-4 grid grid-cols-2 border border-white/16 bg-[#09090b]/95 shadow-[0_22px_55px_rgba(0,0,0,0.45)] sm:grid-cols-4">
              {HERO_STATS.map((stat, index) => (
                <div key={stat.label} className="relative px-5 py-5 sm:px-6 lg:px-7 lg:py-6">
                  {index > 0 ? <span className="absolute inset-y-5 left-0 hidden w-px bg-white/16 sm:block" aria-hidden="true" /> : null}
                  <dd className="font-display text-4xl font-extrabold italic leading-none text-white lg:text-5xl">
                    <CountUp value={stat.value} decimals={stat.decimals} />
                  </dd>
                  <dt className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 sm:text-[10px]">{stat.label}</dt>
                </div>
              ))}
              <div className="motorsport-corner pointer-events-none absolute -right-px -top-px hidden h-3 w-24 sm:block" aria-hidden="true" />
            </dl>
          </SiteContainer>
          <div className={`${textures.stripeBand} absolute inset-x-0 bottom-0 h-1.5`} aria-hidden="true" />
        </section>

        {/* Ticker band */}
        <section
          aria-hidden="true"
          className="relative overflow-hidden border-y border-white/8 bg-[#0b0d11] py-3"
        >
          <div className="marquee marquee-slow">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {TICKER_ITEMS.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    {item}
                    <span className="mx-6 inline-block h-1 w-1 rotate-45 bg-race-red" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Hot lap */}
        <section className="relative overflow-hidden border-b border-white/8 bg-[#08090c]">
          <div className="ambient-wash pointer-events-none absolute inset-0" aria-hidden="true" />
          <SiteContainer className="relative py-16 sm:py-20 lg:py-24">
            <ScrollReveal variant="rise">
              <HotLapPreview />
            </ScrollReveal>
          </SiteContainer>
        </section>

        <section className="relative overflow-hidden border-b border-white/8 bg-canvas">
          <div className="ambient-wash pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="race-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <SiteContainer className="relative py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr]">
              <ScrollReveal variant="slide-left">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-race-red">Your race weekend</p>
                  <h2 className="mt-4 font-display text-5xl font-extrabold uppercase italic leading-[0.82] tracking-[-0.04em] text-white sm:text-6xl">
                    Four steps
                    <span className="block text-gradient-heat">to race day</span>
                  </h2>
                  <div className="mt-6 h-px w-16 bg-race-red" aria-hidden="true" />
                  <p className="mt-6 max-w-[25ch] text-base leading-7 text-white/55">
                    Everything you need to go from rookie to race-weekend ready.
                  </p>
                </div>
              </ScrollReveal>

              <div aria-label="Your SEPANG 56 journey" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {JOURNEY_STEPS.map((step, index) => (
                  <ScrollReveal key={step.number} delay={index * 70} variant="rise">
                    <JourneyStepCard {...step} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </SiteContainer>
        </section>

        <MalaysiaF1Heritage />

        <section className="relative overflow-hidden border-y border-white/8 bg-[#080809]">
          <div className="speed-hatch absolute inset-0 opacity-25" aria-hidden="true" />
          <SiteContainer className="relative py-16 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <ScrollReveal className="lg:col-span-8" variant="slide-left">
                <div>
                  <div className="flex items-center gap-4">
                    <span className={textures.stripeFlag} aria-hidden="true" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">Why SEPANG 56 exists</p>
                  </div>
                  <p className="mt-5 max-w-4xl font-display text-4xl font-extrabold uppercase italic leading-[0.94] text-white sm:text-5xl lg:text-6xl">
                    Watch the race knowing why a corner, tyre call or late-braking move <span className="text-race-red">matters.</span>
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal className="lg:col-span-3 lg:col-start-10" delay={120} variant="slide-right">
                <Button asChild size="large" className="sheen w-full rounded-none uppercase tracking-[0.05em]">
                  <Link href="/learn">
                    Start with the Basics
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>
          </SiteContainer>
          <div className="kerb-stripe h-2 opacity-90" aria-hidden="true" />
        </section>
      </main>

      <RaceFooter />
    </div>
  );
}

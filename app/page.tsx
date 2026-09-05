import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Flag, MapPinned, Trophy } from "lucide-react";

import { HotLapPreview } from "@/components/landing/hot-lap-preview";
import { EditorialSectionHeading } from "@/components/landing/editorial-section-heading";
import { JourneyStepCard } from "@/components/landing/journey-step-card";
import { MalaysiaF1Heritage } from "@/components/landing/malaysia-f1-heritage";
import { SepangHistory } from "@/components/landing/sepang-history";
import { StartLightIntro } from "@/components/landing/start-light-intro";
import { Trackside } from "@/components/landing/trackside";
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

const HERO_IMAGE = publicAsset("/media/hero/f1-cgpt-image.webp");

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main id="main-content" className="flex-1">
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
          <div aria-hidden="true" className="race-grain" />
          <StartLightIntro />

          <SiteContainer className="hero-release relative z-10 flex min-h-[calc(100svh-4rem)] flex-col py-8 sm:py-10 md:min-h-[calc(100svh-4.25rem)] lg:py-12">
            <div className="grid min-h-[560px] flex-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="relative z-10 lg:col-span-7 xl:col-span-6">
                <div className="hero-stage hero-stage-eyebrow flex items-center gap-4">
                  <span className={textures.stripeFlag} aria-hidden="true" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 sm:text-[11px]">
                    Malaysia / Sepang / 2026
                  </p>
                </div>

                <h1 className="mt-7 font-display font-extrabold uppercase italic leading-[0.8] tracking-[-0.055em]">
                  <span className="hero-stage hero-stage-title block text-[clamp(1.25rem,4.6vw,3.4rem)] text-transparent [-webkit-text-stroke:1px_rgba(243,241,236,0.42)]">Formula 1 returns to</span>
                  <span className="hero-stage hero-stage-sepang block text-[clamp(4.6rem,14vw,10rem)] text-[#f3f1ec]">Sepang<span className="text-race-red">.</span></span>
                </h1>

                <div className="hero-stage hero-stage-copy mt-7">
                  <span className="motorsport-stripe block scale-75 origin-left" aria-hidden="true" />
                  <p className="mt-5 max-w-lg text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                    Learn the basics, understand the circuit, and make race-day picks you can actually explain.
                  </p>
                </div>

                <div className="hero-stage hero-stage-actions mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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

            </div>

            <dl className="hero-stage hero-stage-stats carbon-weave relative z-20 mt-4 grid grid-cols-2 border border-white/16 bg-[#09090b]/95 shadow-[0_22px_55px_rgba(0,0,0,0.45)] sm:grid-cols-4">
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
        </section>

        {/* Slanted race ticker */}
        <section
          aria-hidden="true"
          className="relative z-10 -my-2 select-none"
        >
          <div className="-rotate-[1.2deg] scale-[1.02]">
            <div className="overflow-hidden bg-race-red py-2.5 text-[#08090c]">
              <div className="marquee marquee-slow">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {TICKER_ITEMS.map((item) => (
                      <span key={`${copy}-${item}`} className="flex items-center whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
                        {item}
                        <span className="mx-6 inline-block h-1 w-1 rotate-45 bg-[#08090c]" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden bg-[#f3f1ec] py-2 text-[#08090c]">
              <div className="marquee marquee-slow" style={{ animationDirection: "reverse" }}>
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {TICKER_ITEMS.map((item) => (
                      <span key={`${copy}-${item}`} className="flex items-center whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.2em]">
                        {item}
                        <span className="mx-6 inline-block h-1 w-1 rotate-45 bg-race-red" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-white/8 bg-canvas">
          <div className="ambient-wash pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="race-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <SiteContainer className="relative py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr]">
              <ScrollReveal variant="slide-left">
                <EditorialSectionHeading
                  number="01"
                  eyebrow="Your race weekend"
                  title={<>Four steps <span className="block text-gradient-heat">to race day</span></>}
                  description="Everything you need to go from rookie to race-weekend ready."
                />
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

        <section className="relative overflow-hidden border-b border-white/8 bg-[#08090c]">
          <SiteContainer className="relative z-10 py-16 sm:py-20 lg:py-24">
            <ScrollReveal variant="slide-left">
              <EditorialSectionHeading
                number="03"
                eyebrow="Interactive circuit guide"
                title={<>Know every metre of <span className="text-race-red">5.543 km.</span></>}
                description="Follow a derived lap, then explore the corners that make Sepang a race worth understanding."
              />
            </ScrollReveal>
            <ScrollReveal variant="rise">
              <div className="mt-12">
                <HotLapPreview />
              </div>
            </ScrollReveal>
          </SiteContainer>
        </section>

        <Trackside />

        <SepangHistory />

        <section className="relative isolate overflow-hidden border-y border-white/8 bg-[#080809]">
          <Image
            src={publicAsset("/media/sepang/main-straight.webp")}
            alt="Sepang International Circuit main straight under Malaysian skies"
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,8,9,0.94),rgba(8,8,9,0.76)_47%,rgba(8,8,9,0.34)),linear-gradient(0deg,rgba(8,8,9,0.82),transparent_60%)]" />
          <div aria-hidden="true" className="race-grid pointer-events-none absolute inset-0 -z-10 opacity-30" />
          <SiteContainer className="relative py-20 sm:py-24 lg:py-32">
            <div className="max-w-5xl">
              <ScrollReveal variant="slide-left">
                <EditorialSectionHeading
                  number="06"
                  eyebrow="Your way into race day"
                  title={<>Watch the race knowing why every corner, tyre call and late-braking move <span className="text-race-red">matters.</span></>}
                  description="Start with the basics. Then read Sepang. Make your eight picks with a point of view."
                />
              </ScrollReveal>
              <ScrollReveal delay={140} variant="rise">
                <Button asChild size="large" className="sheen mt-10 min-w-60 rounded-none uppercase tracking-[0.05em]">
                  <Link href="/learn">
                    Start your race weekend
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>
          </SiteContainer>
        </section>
      </main>

      <RaceFooter />
    </div>
  );
}

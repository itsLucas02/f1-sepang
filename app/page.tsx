import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Flag, MapPinned, Trophy } from "lucide-react";

import { JourneyStepCard } from "@/components/landing/journey-step-card";
import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";
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
  { value: "56", label: "Race laps" },
  { value: "15", label: "Corners" },
  { value: "5.543", label: "KM lap" },
  { value: "8", label: "Race picks" },
] as const;

const HERO_IMAGE = publicAsset("/media/hero/hero-sepang.webp");
const LECLERC_IMAGE = publicAsset("/media/drivers/leclerc.webp");
const NORRIS_IMAGE = publicAsset("/media/drivers/norris.webp");

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#050506]">
          <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[72%]">
            <Image
              src={HERO_IMAGE}
              alt="Sepang circuit race atmosphere"
              fill
              priority
              sizes="100vw"
              className="hero-kenburns object-cover object-[62%_center]"
            />
          </div>

          <div
            aria-hidden="true"
            className="photo-vignette absolute inset-0 -z-10 max-lg:hidden"
          />
          <div
            aria-hidden="true"
            className="photo-vignette-mobile absolute inset-0 -z-10 lg:hidden"
          />
          <div aria-hidden="true" className="race-noise absolute inset-0 -z-10 opacity-20" />

          <SiteContainer className="relative min-h-[720px] py-10 sm:min-h-[780px] sm:py-14 lg:min-h-[760px] lg:py-16 xl:min-h-[820px]">
            <div className="grid min-h-[610px] gap-10 lg:grid-cols-12 lg:items-center">
              <div className="relative z-10 lg:col-span-6 xl:col-span-5">
                <div className="rise-in flex items-center gap-4">
                  <span className="motorsport-stripe block" aria-hidden="true" />
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

              <div className="relative hidden min-h-[610px] lg:col-span-6 lg:block xl:col-span-7">
                <div className="absolute bottom-5 right-0 top-5 w-[34%] min-w-[250px]">
                  <div className="absolute inset-x-0 top-0 h-[57%] overflow-hidden border-l border-white/35 bg-[#121214] [clip-path:polygon(20%_0,100%_0,82%_100%,0_100%)]">
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

                  <div className="absolute inset-x-0 bottom-0 h-[45%] overflow-hidden border-l border-race-red/70 bg-[#121214] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]">
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

            <dl className="relative z-20 mt-3 grid grid-cols-2 border border-white/16 bg-[#09090b]/95 shadow-[0_22px_55px_rgba(0,0,0,0.45)] sm:grid-cols-4 lg:mt-0">
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative px-5 py-5 sm:px-6 lg:px-7 lg:py-6"
                >
                  {index > 0 ? (
                    <span className="absolute inset-y-5 left-0 hidden w-px bg-white/16 sm:block" aria-hidden="true" />
                  ) : null}
                  <dd className="font-display text-4xl font-extrabold italic leading-none text-white lg:text-5xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 sm:text-[10px]">
                    {stat.label}
                  </dt>
                </div>
              ))}
              <div className="motorsport-corner pointer-events-none absolute -right-px -top-px hidden h-3 w-24 sm:block" aria-hidden="true" />
            </dl>
          </SiteContainer>
        </section>

        <section className="bg-[#f2f0eb] text-[#111113]">
          <SiteContainer className="py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr]">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-race-red">
                  Your race weekend
                </p>
                <h2 className="mt-4 font-display text-5xl font-extrabold uppercase italic leading-[0.82] tracking-[-0.04em] sm:text-6xl">
                  Four steps
                  <span className="block">to race day</span>
                </h2>
                <div className="mt-6 h-px w-16 bg-race-red" aria-hidden="true" />
                <p className="mt-6 max-w-[25ch] text-base leading-7 text-[#5d5d62]">
                  Everything you need to go from rookie to race-weekend ready.
                </p>
              </div>

              <div aria-label="Your SEPANG 56 journey" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {JOURNEY_STEPS.map((step) => (
                  <JourneyStepCard key={step.number} {...step} />
                ))}
              </div>
            </div>
          </SiteContainer>
        </section>

        <section className="relative overflow-hidden border-y border-white/8 bg-[#080809]">
          <div className="speed-hatch absolute inset-0 opacity-25" aria-hidden="true" />
          <SiteContainer className="relative py-16 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-4">
                  <span className="motorsport-stripe block" aria-hidden="true" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">Why SEPANG 56 exists</p>
                </div>
                <p className="mt-5 max-w-4xl font-display text-4xl font-extrabold uppercase italic leading-[0.94] text-white sm:text-5xl lg:text-6xl">
                  Watch the race knowing why a corner, tyre call or late-braking move <span className="text-race-red">matters.</span>
                </p>
              </div>
              <div className="lg:col-span-3 lg:col-start-10">
                <Button asChild size="large" className="sheen w-full rounded-none uppercase tracking-[0.05em]">
                  <Link href="/learn">
                    Start with the Basics
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </SiteContainer>
          <div className="kerb-stripe h-2 opacity-90" aria-hidden="true" />
        </section>
      </main>

      <RaceFooter />
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Timer, Trophy } from "lucide-react";

import { CircuitHotspotTabs } from "@/components/circuit/circuit-hotspot-tabs";
import { LapTelemetryChart } from "@/components/circuit/lap-telemetry-chart";
import { CircuitInfoPanel } from "@/components/circuit/circuit-info-panel";
import { CircuitMobileSheet } from "@/components/circuit/circuit-mobile-sheet";
import { SepangCircuitStage } from "@/components/circuit/sepang-circuit-stage";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { HOTSPOT_ORDER, getHotspot, type HotspotId } from "@/content/sepang";
import { publicAsset } from "@/lib/assets";
import { SEPANG_LAP_STATS } from "@/lib/sepang-telemetry";
import { formatLapTime } from "@/lib/telemetry";
import {
  DEFAULT_SEPANG_STATE,
  SEPANG_STORAGE_KEY,
  addVisitedHotspot,
  getNextGuidedHotspot,
  isSepangReady,
  parsePersistedSepangState,
  type PersistedSepangState,
  type TourMode,
} from "@/lib/sepang";

export function SepangExplorer() {
  const [hydrated, setHydrated] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [state, setState] = useState<PersistedSepangState>(DEFAULT_SEPANG_STATE);

  useEffect(() => {
    const stored = parsePersistedSepangState(
      window.localStorage.getItem(SEPANG_STORAGE_KEY),
    );

    setState(
      stored.hasVisitedSepang ? { ...stored, tourMode: "free" } : stored,
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(SEPANG_STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const selected = getHotspot(state.selectedHotspot);
  const ready = isSepangReady(state.visitedHotspots);
  const nextGuidedHotspot = useMemo(
    () => getNextGuidedHotspot(state.selectedHotspot, state.visitedHotspots),
    [state.selectedHotspot, state.visitedHotspots],
  );

  function enterExplorer(tourMode: TourMode) {
    setState((current) => ({
      ...current,
      hasVisitedSepang: true,
      tourMode,
      selectedHotspot: "main-straight",
      visitedHotspots: addVisitedHotspot(
        current.visitedHotspots,
        "main-straight",
      ),
    }));
  }

  function selectHotspot(hotspot: HotspotId, openMobileDetail = true) {
    setState((current) => ({
      ...current,
      selectedHotspot: hotspot,
      visitedHotspots: addVisitedHotspot(current.visitedHotspots, hotspot),
    }));

    if (
      openMobileDetail &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      setMobileDetailOpen(true);
    }
  }

  function goToNextHotspot() {
    if (nextGuidedHotspot) {
      selectHotspot(nextGuidedHotspot, false);
    }
  }

  function toggleTourMode() {
    setState((current) => {
      if (current.tourMode === "guided") {
        return { ...current, tourMode: "free" };
      }

      const nextHotspot = getNextGuidedHotspot(
        current.selectedHotspot,
        current.visitedHotspots,
      );

      return {
        ...current,
        tourMode: "guided",
        selectedHotspot: nextHotspot ?? current.selectedHotspot,
        visitedHotspots: nextHotspot
          ? addVisitedHotspot(current.visitedHotspots, nextHotspot)
          : current.visitedHotspots,
      };
    });
  }

  if (!hydrated) {
    return (
      <section className="min-h-[460px] border border-white/14 bg-[#0d0d0f] p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
          Preparing the circuit…
        </p>
      </section>
    );
  }

  if (!state.hasVisitedSepang) {
    return (
      <div>
        <section className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <ScrollReveal className="lg:col-span-8" variant="slide-left">
            <div>
              <div className="flex items-center gap-4">
                <span className="motorsport-stripe block" aria-hidden="true" />
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  Interactive circuit explorer / Malaysia
                </p>
              </div>
              <h1 className="mt-5 max-w-5xl font-display text-6xl font-extrabold uppercase italic leading-[0.8] tracking-[-0.045em] text-white sm:text-7xl lg:text-[6.2rem]">
                Sepang International
                <span className="block text-race-red">Circuit.</span>
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-4" delay={100} variant="slide-right">
            <div>
              <p className="text-lg leading-8 text-white/62">
                5.543 km, 15 turns and two long straights. Start with five places that make the lap easy to read even if this is your first Formula 1 weekend.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button type="button" size="large" onClick={() => enterExplorer("guided")} className="sheen rounded-none uppercase tracking-[0.05em]">
                  Start Guided Tour
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
                <Button type="button" size="large" variant="secondary" onClick={() => enterExplorer("free")} className="rounded-none border-white/25 uppercase tracking-[0.05em]">
                  Explore Freely
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <div className="mt-10">
          <SepangCircuitStage selectedHotspot="main-straight" />
        </div>

        <div className="mt-4 grid border border-white/14 bg-[#09090b] sm:grid-cols-3">
          {[
            ["5.543 KM", "Circuit length"],
            ["15", "Turns"],
            ["56", "Historic F1 race laps"],
          ].map(([value, label], index) => (
            <ScrollReveal key={label} delay={index * 70} variant="rise">
              <div className="relative h-full px-5 py-5 sm:px-6">
                {index > 0 ? <span className="absolute inset-y-4 left-0 hidden w-px bg-white/12 sm:block" aria-hidden="true" /> : null}
                <p className="font-display text-3xl font-extrabold uppercase italic text-white sm:text-4xl">{value}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">{label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-9">
          <div className="flex items-center gap-4">
            <span className="motorsport-stripe block" aria-hidden="true" />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/42">
              Interactive circuit explorer / {state.tourMode === "guided" ? "Guided" : "Free explore"}
            </p>
          </div>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase italic leading-[0.82] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.6rem]">
            Sepang International Circuit
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/60">
            Select a section and follow the red trace to see where that moment sits on the real lap. On mobile, section details open without pushing the circuit around.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-4xl font-extrabold italic leading-none text-white">
                {state.visitedHotspots.length}<span className="text-white/28">/{HOTSPOT_ORDER.length}</span>
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">
                sections read
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={toggleTourMode} className="rounded-none border-white/20 text-[11px] uppercase tracking-[0.05em]">
              {state.tourMode === "guided" ? "Free Explore" : "Guided"}
            </Button>
          </div>
          <div className="mt-4 h-1 overflow-hidden bg-white/10">
            <div className="h-full bg-race-red transition-[width] duration-500" style={{ width: `${(state.visitedHotspots.length / HOTSPOT_ORDER.length) * 100}%` }} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 lg:col-span-8">
          <SepangCircuitStage
            selectedHotspot={state.selectedHotspot}
            onSelectHotspot={selectHotspot}
          />
          <div className="mt-4">
            <CircuitHotspotTabs
              selectedHotspot={state.selectedHotspot}
              visitedHotspots={state.visitedHotspots}
              onSelect={selectHotspot}
            />
          </div>
        </div>

        <div className="hidden min-w-0 lg:col-span-4 lg:block">
          <CircuitInfoPanel
            hotspot={selected}
            tourMode={state.tourMode}
            sepangReady={ready}
            hasNextHotspot={nextGuidedHotspot !== null}
            onNextHotspot={goToNextHotspot}
          />
        </div>
      </section>

      <CircuitMobileSheet
        open={mobileDetailOpen}
        onOpenChange={setMobileDetailOpen}
        hotspot={selected}
        tourMode={state.tourMode}
        sepangReady={ready}
        hasNextHotspot={nextGuidedHotspot !== null}
        onNextHotspot={goToNextHotspot}
      />

      <section
        aria-labelledby="lap-analysis-title"
        className="mt-8 overflow-hidden border border-white/12 bg-[#0b0d11]"
      >
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 p-5 sm:p-7">
          <div>
            <div className="flex items-center gap-3">
              <span className="live-dot" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                Lap analysis / simulated
              </p>
            </div>
            <h2
              id="lap-analysis-title"
              className="mt-3 font-display text-3xl font-extrabold uppercase italic leading-none text-white sm:text-4xl"
            >
              One lap, corner by corner
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">
              Where a car is flat out, where it has to stop, and how the three
              timing sectors split the lap. The trace is modelled from the real
              circuit geometry — hover it to read any point on the lap.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:gap-x-10">
            {[
              { label: "Sim lap", value: formatLapTime(SEPANG_LAP_STATS.lapTime), unit: "" },
              { label: "Top speed", value: String(SEPANG_LAP_STATS.topSpeed), unit: "km/h" },
              { label: "Slowest corner", value: String(SEPANG_LAP_STATS.slowestCorner), unit: "km/h" },
              {
                label: "Full throttle",
                value: String(Math.round(SEPANG_LAP_STATS.fullThrottleShare * 100)),
                unit: "%",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-2xl font-extrabold italic leading-none text-white tabular-nums sm:text-3xl">
                  {stat.value}
                  {stat.unit ? (
                    <span className="ml-1 font-mono text-[9px] not-italic text-white/40">
                      {stat.unit}
                    </span>
                  ) : null}
                </dd>
                <dt className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/38">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="p-4 sm:p-6">
          <LapTelemetryChart />
        </div>
      </section>

      <section className="mt-8 grid overflow-hidden border border-white/14 bg-[#09090b] lg:grid-cols-12">
        <ScrollReveal className="lg:col-span-8" variant="photo-wipe">
          <div className="relative min-h-[300px] lg:min-h-[360px]">
            <Image
              src={publicAsset("/media/sepang/overview.webp")}
              alt="Sepang International Circuit race atmosphere"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="hero-kenburns object-cover object-center grayscale-[0.1] contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-6 left-6">
              <span className="motorsport-stripe block scale-75 origin-left" aria-hidden="true" />
              <p className="mt-3 font-display text-3xl font-extrabold uppercase italic text-white sm:text-4xl">Built for battles.</p>
              <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.08em] text-white/48">Sepang photography: Morio / CC BY-SA 4.0</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-4" delay={110} variant="slide-right">
          <div className="p-6 sm:p-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-race-red">Circuit at a glance</p>
            <dl className="mt-5 divide-y divide-white/10">
              <Fact icon={<MapPin className="size-4" />} label="Location" value="Sepang, Malaysia" />
              <Fact icon={<ArrowRight className="size-4" />} label="Length" value="5.543 KM" />
              <Fact icon={<ArrowRight className="size-4" />} label="Turns" value="15" />
              <Fact icon={<Trophy className="size-4" />} label="First Grand Prix" value="1999" />
              <Fact icon={<Timer className="size-4" />} label="Lap record" value="1:34.223" />
            </dl>
            <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.1em] text-white/30">F1 race lap record: Juan Pablo Montoya, 2004.</p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[22px_1fr_auto] items-center gap-3 py-4">
      <span className="text-white/55" aria-hidden="true">{icon}</span>
      <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">{label}</dt>
      <dd className="font-display text-lg font-bold uppercase italic text-white">{value}</dd>
    </div>
  );
}

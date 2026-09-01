"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { CircuitHotspotTabs } from "@/components/circuit/circuit-hotspot-tabs";
import { CircuitInfoPanel } from "@/components/circuit/circuit-info-panel";
import { SepangCircuitStage } from "@/components/circuit/sepang-circuit-stage";
import { Button } from "@/components/ui/button";
import { HOTSPOT_ORDER, getHotspot, type HotspotId } from "@/content/sepang";
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
  const [state, setState] = useState<PersistedSepangState>(DEFAULT_SEPANG_STATE);

  useEffect(() => {
    const stored = parsePersistedSepangState(
      window.localStorage.getItem(SEPANG_STORAGE_KEY),
    );

    setState(
      stored.hasVisitedSepang
        ? { ...stored, tourMode: "free" }
        : stored,
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
    () =>
      getNextGuidedHotspot(state.selectedHotspot, state.visitedHotspots),
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

  function selectHotspot(hotspot: HotspotId) {
    setState((current) => ({
      ...current,
      selectedHotspot: hotspot,
      visitedHotspots: addVisitedHotspot(current.visitedHotspots, hotspot),
    }));
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
      <section className="min-h-[420px] border border-black/10 bg-white p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#77777d]">
          Preparing the circuit…
        </p>
      </section>
    );
  }

  if (!state.hasVisitedSepang) {
    return (
      <div>
        <section className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 bg-race-red" aria-hidden="true" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b6b70]">
                Circuit briefing / Malaysia
              </p>
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] text-[#111113] sm:text-7xl lg:text-8xl">
              Meet
              <span className="block text-race-red">Sepang.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-7 text-[#55555b]">
              A 5.543 km circuit with 15 turns, long straights and braking zones that make battles easy to follow — even if this is your first F1 race.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button type="button" onClick={() => enterExplorer("guided")}>
                Start Guided Tour
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => enterExplorer("free")}
              >
                Explore Freely
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <SepangCircuitStage selectedHotspot="main-straight" />
        </div>

        <div className="mt-6 grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-3">
          {[
            ["5.543 KM", "Circuit length"],
            ["15", "Turns"],
            ["56", "Historic F1 race laps"],
          ].map(([value, label]) => (
            <div key={label} className="bg-[#111113] px-5 py-5 sm:px-6">
              <p className="font-display text-3xl font-extrabold uppercase text-white">{value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="grid gap-6 border-b border-black/12 pb-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 bg-race-red" aria-hidden="true" />
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b6b70]">
              Circuit explorer / {state.tourMode === "guided" ? "Guided" : "Free explore"}
            </p>
          </div>
          <h1 className="mt-4 font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-[#111113] sm:text-7xl">
            Read Sepang.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-[#55555b]">
            Choose a hotspot. The camera moves to the real section of circuit and shows you what to watch when the race reaches it.
          </p>
        </div>

        <div className="lg:col-span-3 lg:col-start-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-4xl font-extrabold text-[#111113]">
                {state.visitedHotspots.length}<span className="text-[#8a8a90]">/{HOTSPOT_ORDER.length}</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#77777d]">
                hotspots read
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={toggleTourMode}>
              {state.tourMode === "guided" ? "Free Explore" : "Guided"}
            </Button>
          </div>
          <div className="mt-4 h-1 overflow-hidden bg-black/10">
            <div
              className="h-full bg-race-red transition-[width] duration-500"
              style={{ width: `${(state.visitedHotspots.length / HOTSPOT_ORDER.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="min-w-0 lg:col-span-8">
          <SepangCircuitStage selectedHotspot={state.selectedHotspot} />
          <div className="mt-4">
            <CircuitHotspotTabs
              selectedHotspot={state.selectedHotspot}
              visitedHotspots={state.visitedHotspots}
              onSelect={selectHotspot}
            />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-4">
          <CircuitInfoPanel
            key={selected.id}
            hotspot={selected}
            tourMode={state.tourMode}
            sepangReady={ready}
            hasNextHotspot={nextGuidedHotspot !== null}
            onNextHotspot={() => {
              if (nextGuidedHotspot) {
                selectHotspot(nextGuidedHotspot);
              }
            }}
          />
        </div>
      </section>
    </div>
  );
}

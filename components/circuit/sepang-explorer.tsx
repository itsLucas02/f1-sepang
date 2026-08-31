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
      <section className="border border-border bg-surface-01 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
          Preparing the circuit…
        </p>
      </section>
    );
  }

  if (!state.hasVisitedSepang) {
    return (
      <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
            Meet Sepang
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
            Sepang International Circuit
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-text-secondary">
            Sepang mixes long straights, heavy braking and fast direction changes. We&apos;ll show you five places that are easy to recognize and useful to watch during the race.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

        <div className="lg:col-span-7">
          <SepangCircuitStage selectedHotspot="main-straight" />
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-text-secondary">
            Sepang / Malaysia
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl">
            Sepang International Circuit
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
            {state.visitedHotspots.length} / {HOTSPOT_ORDER.length} visited
          </span>
          <Button type="button" variant="secondary" onClick={toggleTourMode}>
            {state.tourMode === "guided" ? "Explore Freely" : "Guided Tour"}
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-8">
          <SepangCircuitStage selectedHotspot={state.selectedHotspot} />
          <div className="mt-4">
            <CircuitHotspotTabs
              selectedHotspot={state.selectedHotspot}
              visitedHotspots={state.visitedHotspots}
              onSelect={selectHotspot}
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <CircuitInfoPanel
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

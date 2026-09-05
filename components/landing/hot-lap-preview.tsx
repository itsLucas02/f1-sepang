"use client";

import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SepangCircuitMap } from "@/components/circuit/sepang-circuit-fallback";
import { Button } from "@/components/ui/button";
import { SEPANG_HOT_LAP, SEPANG_LAP_STATS } from "@/lib/sepang-telemetry";
import { formatLapTime, sampleAtTime } from "@/lib/telemetry";
import { useHotLapController } from "@/lib/use-hot-lap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Landing-page teaser for the circuit explorer: the same derived hot lap,
 * running on the lightweight 2D map so the homepage never pays for WebGL.
 */
export function HotLapPreview() {
  const reduced = useReducedMotion();
  const previewRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const controller = useHotLapController(SEPANG_HOT_LAP, {
    autoPlay: false,
    reducedMotion: reduced,
  });
  const { pause, play } = controller;
  const speedRef = useRef<HTMLSpanElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);
  const sectorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { rootMargin: "180px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inViewport && autoplay && !reduced) {
      play();
      return;
    }

    pause();
  }, [autoplay, inViewport, pause, play, reduced]);

  useEffect(() => {
    const render = () => {
      const sample = sampleAtTime(SEPANG_HOT_LAP, controller.timeRef.current);

      if (speedRef.current) {
        speedRef.current.textContent = String(Math.round(sample.speed));
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = formatLapTime(controller.timeRef.current);
      }
      if (sectorRef.current) {
        const sector =
          sample.progress < SEPANG_HOT_LAP.sectorBounds[0]
            ? 1
            : sample.progress < SEPANG_HOT_LAP.sectorBounds[1]
              ? 2
              : 3;
        sectorRef.current.textContent = `S${sector}`;
      }
    };

    render();
    if (!inViewport || !controller.playing) {
      return;
    }

    let frame = 0;

    const tick = () => {
      render();
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controller.playing, controller.timeRef, inViewport]);

  return (
    <div ref={previewRef} className="grid gap-8 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-3">
          <span className="live-dot" aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            Simulated hot lap
          </p>
        </div>

        <h2 className="mt-5 font-display text-5xl font-extrabold uppercase italic leading-[0.84] tracking-[-0.04em] text-white sm:text-6xl">
          5.543 km,
          <span className="block text-gradient-heat">in 94 seconds.</span>
        </h2>

        <p className="mt-5 max-w-md text-base leading-7 text-white/62">
          A physics-lite lap modelled straight from Sepang&apos;s real geometry:
          braking zones, apex speeds and the three timing sectors that decide a
          Grand Prix. Watch it run, then explore the corners that matter.
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-white/12 bg-white/10">
          {[
            { label: "Sim lap", value: formatLapTime(SEPANG_LAP_STATS.lapTime) },
            { label: "Top speed", value: `${SEPANG_LAP_STATS.topSpeed} km/h` },
            {
              label: "Flat out",
              value: `${Math.round(SEPANG_LAP_STATS.fullThrottleShare * 100)}%`,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0b0d11] px-4 py-3.5">
              <dd className="font-display text-lg font-extrabold italic leading-none text-white tabular-nums">
                {stat.value}
              </dd>
              <dt className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/38">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button asChild size="large" className="rounded-none uppercase tracking-[0.05em]">
            <Link href="/sepang">
              Explore the Circuit
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setAutoplay((current) => !current)}
            className="inline-flex min-h-11 items-center gap-2 border border-white/18 bg-white/[0.03] px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            {controller.playing ? (
              <Pause aria-hidden="true" className="size-3.5" />
            ) : (
              <Play aria-hidden="true" className="size-3.5" />
            )}
            {controller.playing ? "Pause lap" : "Play lap"}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="relative aspect-[4/3] overflow-hidden border border-white/12 bg-[#07080a] shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:aspect-[16/10]">
          <SepangCircuitMap
            selectedHotspot="main-straight"
            timeRef={controller.timeRef}
            showCar
            animateCar={inViewport && controller.playing}
            compact
          />

          <div className="glass-panel pointer-events-none absolute left-4 top-4 flex items-center gap-4 px-3.5 py-2.5">
            <div>
              <span
                ref={speedRef}
                className="font-display text-2xl font-extrabold italic leading-none text-white tabular-nums"
              >
                0
              </span>
              <span className="ml-1 font-mono text-[9px] text-white/45">km/h</span>
            </div>
            <span className="h-6 w-px bg-white/15" aria-hidden="true" />
            <span
              ref={timeDisplayRef}
              className="font-mono text-sm text-white/80 tabular-nums"
            >
              0:00.000
            </span>
            <span className="rounded-[2px] bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
              <span ref={sectorRef}>S1</span>
            </span>
          </div>

          <div
            className="kerb-stripe-thin pointer-events-none absolute inset-x-0 bottom-0 h-[3px] opacity-80"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Gauge, Pause, Play, RotateCcw, Video } from "lucide-react";

import { SEPANG_HOT_LAP, SEPANG_SECTOR_COLORS } from "@/lib/sepang-telemetry";
import { formatLapTime, formatSectorTime, sampleAtTime } from "@/lib/telemetry";
import type { HotLapCamera, HotLapController } from "@/lib/use-hot-lap";
import { cn } from "@/lib/utils";

const CAMERA_MODES: { id: HotLapCamera; label: string; icon: typeof Camera }[] = [
  { id: "trackside", label: "Overview", icon: Camera },
  { id: "chase", label: "Onboard", icon: Video },
  { id: "corner", label: "Corner", icon: Gauge },
];

const RATES = [0.5, 1, 2] as const;

/** Big speed dial + gear + pedal traces. Updated imperatively at frame rate. */
export function HotLapGauge({ controller }: { controller: HotLapController }) {
  const speedRef = useRef<HTMLSpanElement>(null);
  const gearRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const throttleRef = useRef<HTMLSpanElement>(null);
  const brakeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const sample = sampleAtTime(SEPANG_HOT_LAP, controller.timeRef.current);
      const fraction = Math.min(1, sample.speed / SEPANG_HOT_LAP.topSpeed);

      if (speedRef.current) {
        speedRef.current.textContent = String(Math.round(sample.speed));
      }
      if (gearRef.current) {
        gearRef.current.textContent = String(sample.gear);
      }
      if (arcRef.current) {
        arcRef.current.style.strokeDashoffset = String(1 - fraction);
      }
      if (throttleRef.current) {
        throttleRef.current.style.transform = `scaleY(${sample.throttle.toFixed(3)})`;
      }
      if (brakeRef.current) {
        brakeRef.current.style.transform = `scaleY(${sample.brake.toFixed(3)})`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controller.timeRef]);

  return (
    <div className="glass-panel pointer-events-none flex items-center gap-4 p-3.5">
      <div className="relative size-[92px]">
        <svg viewBox="0 0 100 100" className="size-full -rotate-[0deg]">
          <path
            d="M 14 78 A 44 44 0 1 1 86 78"
            pathLength={1}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            ref={arcRef}
            d="M 14 78 A 44 44 0 1 1 86 78"
            pathLength={1}
            fill="none"
            stroke="url(#speed-gradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <defs>
            <linearGradient id="speed-gradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#E8112D" />
              <stop offset="72%" stopColor="#FF6C7C" />
              <stop offset="100%" stopColor="#F6F6F0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span
            ref={speedRef}
            className="font-display text-[28px] font-extrabold italic leading-none text-white tabular-nums"
          >
            0
          </span>
          <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45">
            km/h
          </span>
        </div>
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex flex-col items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">
            Gear
          </span>
          <span
            ref={gearRef}
            className="font-display text-4xl font-extrabold italic leading-none text-white tabular-nums"
          >
            1
          </span>
        </div>

        <div className="flex gap-1.5">
          {[
            { ref: throttleRef, tint: "bg-timing-green", label: "T" },
            { ref: brakeRef, tint: "bg-race-red", label: "B" },
          ].map((pedal) => (
            <div key={pedal.label} className="flex flex-col items-center gap-1">
              <div className="relative h-[62px] w-2.5 overflow-hidden rounded-[2px] bg-white/8">
                <span
                  ref={pedal.ref}
                  className={cn("absolute inset-x-0 bottom-0 h-full origin-bottom", pedal.tint)}
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <span className="font-mono text-[8px] uppercase text-white/40">{pedal.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Elapsed lap time, sector splits and the live sector highlight. */
export function HotLapTiming({ controller }: { controller: HotLapController }) {
  const timeRef = useRef<HTMLParagraphElement>(null);
  const sectorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const elapsed = controller.timeRef.current;

      if (timeRef.current) {
        timeRef.current.textContent = formatLapTime(elapsed);
      }

      const progress =
        sampleAtTime(SEPANG_HOT_LAP, elapsed).progress;
      const active =
        progress < SEPANG_HOT_LAP.sectorBounds[0]
          ? 0
          : progress < SEPANG_HOT_LAP.sectorBounds[1]
            ? 1
            : 2;

      sectorRefs.current.forEach((node, index) => {
        if (node) {
          node.dataset.active = String(index === active);
        }
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controller.timeRef]);

  const splits = SEPANG_HOT_LAP.sectorTimes.map((time, index) =>
    index === 0 ? time : time - SEPANG_HOT_LAP.sectorTimes[index - 1],
  );

  return (
    <div className="glass-panel pointer-events-none p-3.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        Simulated hot lap
      </p>
      <p
        ref={timeRef}
        className="mt-1 font-display text-[34px] font-extrabold italic leading-none text-white tabular-nums"
      >
        0:00.000
      </p>

      <div className="mt-3 flex gap-1.5">
        {splits.map((split, index) => (
          <div
            key={index}
            ref={(node) => {
              sectorRefs.current[index] = node;
            }}
            data-active="false"
            className="group/sector flex-1 border-t-2 pt-1.5 transition-colors data-[active=true]:bg-white/[0.06]"
            style={{ borderColor: SEPANG_SECTOR_COLORS[index] }}
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
              S{index + 1}
            </p>
            <p
              className="font-mono text-[11px] tabular-nums"
              style={{ color: SEPANG_SECTOR_COLORS[index] }}
            >
              {formatSectorTime(split)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Transport controls: play, restart, scrub, replay speed and camera. */
export function HotLapControls({
  controller,
  className,
}: {
  controller: HotLapController;
  className?: string;
}) {
  const sliderRef = useRef<HTMLInputElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const scrubbing = useRef(false);
  const resumeAfterScrub = useRef(false);
  const [rate, setRateState] = useState(controller.rate);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      if (!scrubbing.current) {
        const progress = sampleAtTime(SEPANG_HOT_LAP, controller.timeRef.current).progress;

        if (sliderRef.current) {
          sliderRef.current.value = String(Math.round(progress * 1000));
        }
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controller.timeRef]);

  return (
    <div className={cn("glass-panel flex flex-wrap items-center gap-3 p-2.5", className)}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={controller.toggle}
          aria-label={controller.playing ? "Pause hot lap" : "Play hot lap"}
          className="inline-flex size-10 items-center justify-center rounded-sm border border-race-red/60 bg-race-red text-white transition-colors hover:bg-race-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {controller.playing ? (
            <Pause aria-hidden="true" className="size-4" />
          ) : (
            <Play aria-hidden="true" className="size-4" />
          )}
        </button>
        <button
          type="button"
          onClick={controller.restart}
          aria-label="Restart hot lap"
          className="inline-flex size-10 items-center justify-center rounded-sm border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="relative min-w-40 flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/12">
          <span
            ref={fillRef}
            className="block h-full w-full origin-left bg-race-red"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={1000}
          defaultValue={0}
          aria-label="Scrub the hot lap"
          className="hot-lap-scrub relative w-full"
          onPointerDown={() => {
            scrubbing.current = true;
            resumeAfterScrub.current = controller.playing;
            controller.pause();
          }}
          onPointerUp={() => {
            scrubbing.current = false;
            if (resumeAfterScrub.current) {
              controller.play();
            }
          }}
          onChange={(event) => {
            const progress = Number(event.target.value) / 1000;
            controller.seekProgress(progress);
            if (fillRef.current) {
              fillRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
            }
          }}
        />
      </div>

      <div className="flex items-center gap-1 rounded-sm border border-white/12 bg-black/40 p-0.5">
        {RATES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              controller.setRate(option);
              setRateState(option);
            }}
            aria-pressed={rate === option}
            className={cn(
              "min-w-10 rounded-[2px] px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
              rate === option
                ? "bg-white/90 text-black"
                : "text-white/55 hover:text-white",
            )}
          >
            {option}x
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-sm border border-white/12 bg-black/40 p-0.5">
        {CAMERA_MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => controller.setCamera(id)}
            aria-pressed={controller.camera === id}
            title={label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
              controller.camera === id
                ? "bg-white/90 text-black"
                : "text-white/55 hover:text-white",
            )}
          >
            <Icon aria-hidden="true" className="size-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

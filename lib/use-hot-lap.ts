"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { HotLap } from "@/lib/telemetry";

export type HotLapCamera = "trackside" | "chase" | "corner";

export type HotLapController = {
  lap: HotLap;
  /** Mutable current lap time in seconds. Read it inside rAF / useFrame. */
  timeRef: React.RefObject<number>;
  /** Bumped whenever the lap is scrubbed, so consumers can resync. */
  seekVersion: number;
  playing: boolean;
  rate: number;
  camera: HotLapCamera;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  restart: () => void;
  seekProgress: (progress: number) => void;
  setRate: (rate: number) => void;
  setCamera: (camera: HotLapCamera) => void;
};

/**
 * Drives the shared hot-lap clock.
 *
 * The elapsed time lives in a ref rather than React state: the WebGL scene and
 * the telemetry HUD both read it every frame, so re-rendering React 60 times a
 * second would be pure waste.
 */
export function useHotLapController(
  lap: HotLap,
  { autoPlay = false, reducedMotion = false }: { autoPlay?: boolean; reducedMotion?: boolean } = {},
): HotLapController {
  const timeRef = useRef(0);
  const [playing, setPlaying] = useState(autoPlay && !reducedMotion);
  const [rate, setRate] = useState(1);
  const [camera, setCamera] = useState<HotLapCamera>("trackside");
  const [seekVersion, setSeekVersion] = useState(0);

  useEffect(() => {
    if (!playing) {
      return;
    }

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.12);
      last = now;
      timeRef.current = (timeRef.current + delta * rate) % lap.lapTime;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lap.lapTime, playing, rate]);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((current) => !current), []);

  const restart = useCallback(() => {
    timeRef.current = 0;
    setSeekVersion((version) => version + 1);
    setPlaying(true);
  }, []);

  const seekProgress = useCallback(
    (progress: number) => {
      const clamped = Math.min(0.9999, Math.max(0, progress));
      const index = Math.min(
        lap.samples.length - 1,
        Math.floor(clamped * lap.samples.length),
      );
      timeRef.current = lap.samples[index].time;
      setSeekVersion((version) => version + 1);
    },
    [lap],
  );

  return useMemo(
    () => ({
      lap,
      timeRef,
      seekVersion,
      playing,
      rate,
      camera,
      play,
      pause,
      toggle,
      restart,
      seekProgress,
      setRate,
      setCamera,
    }),
    [camera, lap, pause, play, playing, rate, restart, seekProgress, seekVersion, toggle],
  );
}

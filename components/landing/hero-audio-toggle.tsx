"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_AUDIO_PREFERENCE = "sepang-hero-audio-enabled";

export function HeroAudioToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(HERO_AUDIO_PREFERENCE);
    const nextEnabled = stored !== "false";
    setEnabled(nextEnabled);
    window.dispatchEvent(new CustomEvent("sepang-hero-audio-state", { detail: nextEnabled }));
  }, []);

  const toggle = () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    window.localStorage.setItem(HERO_AUDIO_PREFERENCE, String(nextEnabled));
    window.dispatchEvent(new CustomEvent("sepang-hero-audio-state", { detail: nextEnabled }));
  };

  return (
    <button
      type="button"
      aria-label={enabled ? "Disable lights-out audio" : "Enable lights-out audio"}
      aria-pressed={enabled}
      title={enabled ? "Lights-out audio on" : "Lights-out audio off"}
      onClick={toggle}
      className="inline-flex size-8 items-center justify-center rounded-full border border-race-red bg-[#0a0c11] text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {enabled ? <Volume2 aria-hidden="true" className="size-3.5" /> : <VolumeX aria-hidden="true" className="size-3.5 text-white/50" />}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import styles from "@/components/shared/motorsport-motion.module.css";
import { publicAsset } from "@/lib/assets";

const LIGHTS_OUT_MS = 3500;
const AUDIO_LEAD_MS = 180;

export function StartLightIntro() {
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioEnabledRef = useRef(true);

  useEffect(() => {
    const updateAudioPreference = (event: Event) => {
      const enabled = (event as CustomEvent<boolean>).detail;
      audioEnabledRef.current = enabled;

      if (!enabled && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    window.addEventListener("sepang-hero-audio-state", updateAudioPreference);
    const audioTimer = window.setTimeout(() => {
      if (audioEnabledRef.current && audioRef.current) {
        audioRef.current.currentTime = 0;
        void audioRef.current.play().catch(() => undefined);
      }
    }, LIGHTS_OUT_MS - AUDIO_LEAD_MS);
    const lightsOutTimer = window.setTimeout(() => {
      setDone(true);
    }, LIGHTS_OUT_MS);
    const removeTimer = window.setTimeout(() => setShow(false), 4070);

    return () => {
      window.removeEventListener("sepang-hero-audio-state", updateAudioPreference);
      window.clearTimeout(audioTimer);
      window.clearTimeout(lightsOutTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="auto" src={publicAsset("/media/audio/lights-out.mp3")} />
      {show ? (
        <div className={styles.startLights}>
          <div aria-hidden="true" className={`${styles.startLightsPanel} ${done ? styles.startLightsDone : ""}`}>
            <p className={styles.startLightsLabel}>Formation lap complete</p>
            <div className={styles.startLightsGantry}>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={styles.startLight} />
              ))}
            </div>
            <p className={styles.startLightsStatus}>{done ? "Lights out — Sepang awaits" : "Red lights on"}</p>
          </div>
          <span aria-hidden="true" className={`${styles.startLightsFlash} ${done ? styles.startLightsFlashActive : ""}`} />
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

import styles from "@/components/shared/motorsport-motion.module.css";

export function StartLightIntro() {
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const lightsOutTimer = window.setTimeout(() => {
      setDone(true);
    }, 3500);
    const removeTimer = window.setTimeout(() => setShow(false), 4070);

    return () => {
      window.clearTimeout(lightsOutTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div aria-hidden="true" className={styles.startLights}>
      <div className={`${styles.startLightsPanel} ${done ? styles.startLightsDone : ""}`}>
        <p className={styles.startLightsLabel}>Formation lap complete</p>
        <div className={styles.startLightsGantry}>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={styles.startLight} />
          ))}
        </div>
        <p className={styles.startLightsStatus}>{done ? "Lights out — Sepang awaits" : "Red lights on"}</p>
      </div>
      <span className={`${styles.startLightsFlash} ${done ? styles.startLightsFlashActive : ""}`} />
    </div>
  );
}

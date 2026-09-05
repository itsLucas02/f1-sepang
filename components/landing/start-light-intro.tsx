"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import styles from "@/components/shared/motorsport-motion.module.css";

const SESSION_KEY = "sepang56.hero-start-seen";

export function StartLightIntro() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      return;
    }

    window.sessionStorage.setItem(SESSION_KEY, "1");

    const showTimer = window.setTimeout(() => setShow(true), 0);
    const fadeTimer = window.setTimeout(() => setDone(true), 1420);
    const removeTimer = window.setTimeout(() => setShow(false), 1710);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`${styles.startLights} ${done ? styles.startLightsDone : ""}`}
    >
      <p className={styles.startLightsLabel}>Start sequence</p>
      <div className={styles.startLightsGantry}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={styles.startLight}
            style={{ "--light-index": index } as CSSProperties}
          />
        ))}
      </div>
      <p className={styles.startLightsStatus}>{done ? "Lights out" : "Formation complete"}</p>
    </div>
  );
}

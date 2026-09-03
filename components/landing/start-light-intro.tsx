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
    setShow(true);

    const fadeTimer = window.setTimeout(() => setDone(true), 1420);
    const removeTimer = window.setTimeout(() => setShow(false), 1710);

    return () => {
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
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={styles.startLight}
          style={{ "--light-index": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

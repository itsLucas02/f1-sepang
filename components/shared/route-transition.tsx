"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import styles from "@/components/shared/motorsport-motion.module.css";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const COVER_MS = 330;
const BRAND_HOLD_MS = 120;
const UNCOVER_MS = 440;

type Phase = "idle" | "exit" | "enter";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const firstPath = useRef(true);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }

    setPhase("enter");
    const timer = window.setTimeout(() => setPhase("idle"), UNCOVER_MS + 20);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.hasAttribute("data-no-route-transition")
      ) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search
      ) {
        return;
      }

      event.preventDefault();
      setPhase("exit");

      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }

      transitionTimer.current = window.setTimeout(() => {
        const pathnameWithoutBase =
          BASE_PATH && nextUrl.pathname.startsWith(BASE_PATH)
            ? nextUrl.pathname.slice(BASE_PATH.length) || "/"
            : nextUrl.pathname;

        router.push(`${pathnameWithoutBase}${nextUrl.search}${nextUrl.hash}`);
      }, COVER_MS + BRAND_HOLD_MS);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, [router]);

  return (
    <>
      {children}
      <div
        aria-hidden="true"
        className={`${styles.routeLayer} ${
          phase === "exit"
            ? styles.routeExit
            : phase === "enter"
              ? styles.routeEnter
              : ""
        }`}
      >
        <span className={styles.routeMark}>
          <span className={styles.routeWord}>SEPANG</span>
          <span className={styles.routeNumber}>56</span>
        </span>
      </div>
    </>
  );
}

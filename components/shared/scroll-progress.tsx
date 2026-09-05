"use client";

import { useEffect, useRef } from "react";

/** Thin reading-progress rail pinned to the bottom edge of the sticky header. */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const node = ref.current;

      if (!node) {
        return;
      }

      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      node.style.transform = `scaleX(${progress.toFixed(4)})`;
      node.style.opacity = progress > 0.004 ? "1" : "0";
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
    >
      <span
        ref={ref}
        className="scroll-rail block h-full w-full opacity-0 transition-opacity duration-300"
        style={{ transform: "scaleX(0)" }}
      />
    </span>
  );
}

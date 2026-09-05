"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { EditorialSectionHeading } from "@/components/landing/editorial-section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SiteContainer } from "@/components/shared/site-container";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const CLIPS = [
  {
    src: "https://videos.pexels.com/video-files/33789352/14342040_3840_2160_60fps.mp4",
    poster: "https://images.pexels.com/videos/33789352/red-bull-ring-33789352.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    label: "Flat out",
    detail: "Temporary motion study",
  },
  {
    src: "https://videos.pexels.com/video-files/16605636/16605636-uhd_3840_2160_60fps.mp4",
    poster: "https://images.pexels.com/videos/16605636/f1-formula-1-pit-stop-16605636.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    label: "Garage detail",
    detail: "Temporary motion study",
  },
] as const;

export function Trackside() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const playing = inViewport && !paused && (!reducedMotion || manualPlay);

  useEffect(() => {
    const node = sectionRef.current;
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
    videoRefs.current.forEach((video) => {
      if (!video) {
        return;
      }

      if (playing) {
        void video.play().catch(() => setPaused(true));
      } else {
        video.pause();
      }
    });
  }, [playing]);

  return (
    <section ref={sectionRef} aria-labelledby="trackside-title" className="relative overflow-hidden border-y border-white/8 bg-[#090a0d]">
      <div className="race-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <SiteContainer className="relative z-10 py-16 sm:py-20 lg:py-24">
        <ScrollReveal variant="slide-left">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div id="trackside-title">
              <EditorialSectionHeading
                number="04"
                eyebrow="Trackside / raw footage"
                title={<>The sport, <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.36)]">unfiltered.</span></>}
                description="A short motion study of the speed, precision and noise that make a race weekend feel physical."
              />
            </div>
            <button
              type="button"
              aria-pressed={playing}
              onClick={() => {
                if (playing) {
                  setPaused(true);
                  return;
                }

                setManualPlay(true);
                setPaused(false);
              }}
              className="inline-flex min-h-11 items-center gap-2 border border-white/18 bg-black/30 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/72 transition-colors hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              {playing ? <Pause aria-hidden="true" className="size-3.5" /> : <Play aria-hidden="true" className="size-3.5" />}
              {playing ? "Pause footage" : "Play footage"}
            </button>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-8" variant="rise">
            <figure className="relative overflow-hidden border border-white/14 bg-black">
              <video
                ref={(node) => { videoRefs.current[0] = node; }}
                className="aspect-video w-full object-cover"
                src={CLIPS[0].src}
                poster={CLIPS[0].poster}
                muted
                loop
                playsInline
                preload="none"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-16">
                <p className="font-display text-2xl font-extrabold uppercase italic text-white">{CLIPS[0].label}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/58">{CLIPS[0].detail} · replacement pending</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <ScrollReveal variant="rise" delay={80}>
              <figure className="relative overflow-hidden border border-white/14 bg-black">
                <video
                  ref={(node) => { videoRefs.current[1] = node; }}
                  className="aspect-[4/3] w-full object-cover lg:h-[248px]"
                  src={CLIPS[1].src}
                  poster={CLIPS[1].poster}
                  muted
                  loop
                  playsInline
                preload="none"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-14">
                  <p className="font-display text-xl font-extrabold uppercase italic text-white">{CLIPS[1].label}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/58">{CLIPS[1].detail}</p>
                </figcaption>
              </figure>
            </ScrollReveal>

            <ScrollReveal variant="rise" delay={150}>
              <div className="border border-white/12 bg-[#0d0f13] p-6">
                <p className="font-display text-2xl font-extrabold uppercase italic leading-[0.88] text-white">
                  The noise arrives before the car does.
                </p>
                <p className="mt-5 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/48">
                  Temporary visual references from the owner&apos;s alternative site.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

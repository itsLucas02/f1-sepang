"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { EditorialSectionHeading } from "@/components/landing/editorial-section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SiteContainer } from "@/components/shared/site-container";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const CLIPS = [
  {
    src: "/media/trackside/flat-out.mp4",
    poster: "/media/trackside/flat-out.webp",
    label: "Flat out",
    detail: "720p / 30fps motion study",
  },
  {
    src: "/media/trackside/garage-detail.mp4",
    poster: "/media/trackside/garage-detail.webp",
    label: "Garage detail",
    detail: "720p / 30fps motion study",
  },
] as const;

export function Trackside() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playOnReadyRef = useRef(false);
  const playing = inViewport && !paused && (!reducedMotion || manualPlay);
  const activeClip = CLIPS[activeClipIndex];

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
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      void video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  }, [activeClipIndex, playing]);

  const selectClip = (index: number) => {
    playOnReadyRef.current = true;
    setActiveClipIndex(index);
    setInViewport(true);
    setManualPlay(true);
    setPaused(false);
  };

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

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Trackside clips">
          {CLIPS.map((clip, index) => (
            <button
              key={clip.src}
              type="button"
              aria-pressed={activeClipIndex === index}
              onClick={() => selectClip(index)}
              className={`min-h-10 border px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                activeClipIndex === index
                  ? "border-red bg-red text-white"
                  : "border-white/18 bg-black/30 text-white/65 hover:border-white/45 hover:text-white"
              }`}
            >
              {`0${index + 1} · ${clip.label}`}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-8" variant="rise">
            <figure className="relative overflow-hidden border border-white/14 bg-black">
              <video
                key={activeClip.src}
                ref={videoRef}
                className="aspect-video w-full object-cover"
                src={activeClip.src}
                poster={activeClip.poster}
                muted
                loop
                playsInline
                preload="none"
                onCanPlay={(event) => {
                  if (playOnReadyRef.current) {
                    playOnReadyRef.current = false;
                    void event.currentTarget.play().then(
                      () => setPaused(false),
                      () => setPaused(true),
                    );
                  }
                }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-16">
                <p className="font-display text-2xl font-extrabold uppercase italic text-white">{activeClip.label}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/58">{activeClip.detail}</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <ScrollReveal variant="rise" delay={80}>
              <button
                type="button"
                aria-pressed={activeClipIndex === 1}
                aria-label="Play Garage detail footage"
                onClick={() => selectClip(1)}
                className="group relative aspect-video overflow-hidden border border-white/14 bg-black text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                <Image
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  src={CLIPS[1].poster}
                  alt="Garage detail from a race weekend"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-14">
                  <p className="font-display text-xl font-extrabold uppercase italic text-white">Garage detail</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/58">Select to play · one active source</p>
                </figcaption>
              </button>
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

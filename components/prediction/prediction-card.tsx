"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { getDriver, isDriverId, teamColor } from "@/content/drivers";
import { PREDICTION_QUESTIONS } from "@/content/predictions";
import { publicAsset } from "@/lib/assets";
import type { PredictionAnswers } from "@/lib/predictions";
import { cn } from "@/lib/utils";

const PODIUM = [
  { id: "winner", position: "P1", tint: "var(--sepang-gold)" },
  { id: "second", position: "P2", tint: "var(--sepang-silver)" },
  { id: "third", position: "P3", tint: "var(--sepang-bronze)" },
] as const;

function driverFor(answers: PredictionAnswers, id: string) {
  const answer = answers[id as keyof PredictionAnswers];
  return isDriverId(answer) ? getDriver(answer) : null;
}

function answerText(answers: PredictionAnswers, id: string) {
  const answer = answers[id as keyof PredictionAnswers];

  if (isDriverId(answer)) {
    const driver = getDriver(answer);
    return `${driver.firstName} ${driver.surname}`;
  }

  if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  }

  return "—";
}

/**
 * The visual prediction card: a shareable read of the eight calls, with team
 * identity colours on the podium. Copying produces plain text, so it works
 * anywhere without a backend.
 */
export function PredictionCard({ answers }: { answers: PredictionAnswers }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const lines = [
      "SEPANG 56 — my race calls",
      ...PREDICTION_QUESTIONS.map(
        (question) =>
          `${String(question.index).padStart(2, "0")} ${question.summaryLabel}: ${answerText(answers, question.id)}`,
      ),
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const secondaryCalls = PREDICTION_QUESTIONS.filter(
    (question) => !["winner", "second", "third"].includes(question.id),
  );

  return (
    <section
      aria-label="Your prediction card"
      className="relative overflow-hidden border border-white/12 bg-[#0b0d11]"
    >
      <div className="ambient-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="chequer pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="motorsport-stripe block origin-left scale-75" aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            Prediction card / Sepang
          </p>
        </div>

        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-10 items-center gap-2 border border-white/18 bg-white/[0.04] px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5 text-teal" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy picks"}
        </button>
      </div>

      <div className="relative grid gap-px bg-white/8 lg:grid-cols-[1.35fr_1fr]">
        {/* podium */}
        <div className="bg-[#0b0d11] p-5 sm:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
            Your podium
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {PODIUM.map((slot, index) => {
              const driver = driverFor(answers, slot.id);
              const accent = driver ? teamColor(driver.team) : "#38414f";
              const heights = ["h-44 sm:h-52", "h-36 sm:h-44", "h-32 sm:h-40"];

              return (
                <div key={slot.id} className="flex flex-col justify-end">
                  <div
                    className={cn(
                      "relative overflow-hidden border border-white/12 bg-[#12151a]",
                      heights[index],
                    )}
                  >
                    {driver ? (
                      <Image
                        src={publicAsset(`/media/drivers/${driver.id}.webp`)}
                        alt={`${driver.firstName} ${driver.surname}`}
                        fill
                        sizes="200px"
                        className="object-cover object-[50%_20%] grayscale-[0.25] contrast-110"
                      />
                    ) : (
                      <div className="race-grid absolute inset-0 opacity-40" aria-hidden="true" />
                    )}

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(11,13,17,0.92)_88%)]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1"
                      style={{ background: slot.tint }}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <p
                        className="font-display text-lg font-extrabold italic leading-none"
                        style={{ color: slot.tint }}
                      >
                        {slot.position}
                      </p>
                      <p className="mt-1.5 truncate font-display text-base font-extrabold uppercase italic leading-none text-white sm:text-lg">
                        {driver ? driver.surname : "—"}
                      </p>
                      {driver ? (
                        <p className="mt-1 flex items-center gap-1.5 truncate font-mono text-[8px] uppercase tracking-[0.1em] text-white/50">
                          <span
                            aria-hidden="true"
                            className="inline-block h-2.5 w-[3px] skew-x-[-14deg]"
                            style={{ background: accent }}
                          />
                          {driver.team}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* other calls */}
        <div className="bg-[#0b0d11] p-5 sm:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
            Race calls
          </p>

          <dl className="mt-5 divide-y divide-white/8">
            {secondaryCalls.map((question) => {
              const value = answers[question.id as keyof PredictionAnswers];
              const isBoolean = typeof value === "boolean";

              return (
                <div
                  key={question.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
                    {question.summaryLabel}
                  </dt>
                  <dd
                    className={cn(
                      "text-right font-display text-base font-bold uppercase italic leading-none",
                      isBoolean && value
                        ? "text-teal"
                        : isBoolean
                          ? "text-white/70"
                          : "text-white",
                    )}
                  >
                    {answerText(answers, question.id)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      <div className="kerb-stripe-thin h-1.5 opacity-80" aria-hidden="true" />
    </section>
  );
}

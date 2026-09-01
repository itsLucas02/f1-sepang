"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, LockKeyhole, Pencil } from "lucide-react";

import { RaceFlowHeader } from "@/components/shared/race-flow-header";
import { Button } from "@/components/ui/button";
import { getDriver, isDriverId } from "@/content/drivers";
import { PREDICTION_QUESTIONS } from "@/content/predictions";
import {
  DEFAULT_PREDICTION_DRAFT,
  PREDICTION_DEADLINE,
  PREDICTION_RETURN_TO_SUMMARY_KEY,
  PREDICTION_STORAGE_KEY,
  isPredictionComplete,
  isPredictionLocked,
  parsePersistedPredictionDraft,
  type PersistedPredictionDraft,
  type PredictionAnswer,
} from "@/lib/predictions";

function formatAnswer(answer: PredictionAnswer | undefined) {
  if (isDriverId(answer)) {
    const driver = getDriver(answer);
    return `${driver.firstName} ${driver.surname}`;
  }

  if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  }

  return "Not answered";
}

function formatDeadline(deadlineAt: string | null) {
  if (!deadlineAt) {
    return null;
  }

  const deadline = new Date(deadlineAt);
  if (Number.isNaN(deadline.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(deadline);
}

export function PredictionSummary() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<PersistedPredictionDraft>(
    DEFAULT_PREDICTION_DRAFT,
  );
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const stored = parsePersistedPredictionDraft(
      window.localStorage.getItem(PREDICTION_STORAGE_KEY),
    );

    setDraft(stored);
    setLocked(isPredictionLocked(PREDICTION_DEADLINE));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !PREDICTION_DEADLINE) {
      return;
    }

    const timer = window.setInterval(() => {
      setLocked(isPredictionLocked(PREDICTION_DEADLINE));
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [hydrated]);

  const complete = isPredictionComplete(draft.answers);
  const deadlineLabel = formatDeadline(PREDICTION_DEADLINE);

  function editQuestion(index: number) {
    if (locked) {
      return;
    }

    const nextDraft = { ...draft, currentQuestion: index, hasSeenIntro: true };
    window.localStorage.setItem(
      PREDICTION_STORAGE_KEY,
      JSON.stringify(nextDraft),
    );
    window.sessionStorage.setItem(PREDICTION_RETURN_TO_SUMMARY_KEY, "1");
    router.push("/predict");
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-canvas">
        <RaceFlowHeader onBack={() => router.push("/predict")} />
        <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="border border-border bg-surface-01 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              Loading your summary…
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <RaceFlowHeader
        onBack={() => router.push(locked ? "/" : "/predict")}
        backLabel={locked ? "Back home" : "Back to predictions"}
      />

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
              Prediction Summary
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl">
              Your Sepang Picks
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-text-secondary">
              {locked
                ? "The race deadline has passed. Your picks are now read-only."
                : "Review every answer. You can jump back to any pick and change it before the deadline."}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-text-muted">
            {locked ? (
              <>
                <LockKeyhole aria-hidden="true" className="size-4 text-race-red" />
                Locked
              </>
            ) : complete ? (
              <>
                <Check aria-hidden="true" className="size-4 text-race-red" />
                8 / 8 answered
              </>
            ) : (
              `${Object.keys(draft.answers).length} / 8 answered`
            )}
          </div>
        </div>

        <section aria-label="Your prediction answers" className="mt-8 border-y border-border">
          {PREDICTION_QUESTIONS.map((question, index) => {
            const answer = draft.answers[question.id];

            return (
              <div
                key={question.id}
                className="grid gap-4 border-b border-border py-5 last:border-b-0 sm:grid-cols-[56px_1fr_1fr_auto] sm:items-center sm:px-4"
              >
                <span className="font-mono text-xs text-race-red">
                  {String(question.index).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-bold uppercase leading-none text-white">
                  {question.summaryLabel}
                </span>
                <span className="text-base font-semibold text-text-secondary">
                  {formatAnswer(answer)}
                </span>
                {!locked ? (
                  <button
                    type="button"
                    onClick={() => editQuestion(index)}
                    aria-label={`Edit ${question.summaryLabel}`}
                    className="inline-flex min-h-11 items-center gap-2 justify-self-start text-sm font-bold uppercase text-white transition-colors hover:text-race-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:justify-self-end"
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                    Edit
                  </button>
                ) : null}
              </div>
            );
          })}
        </section>

        {deadlineLabel ? (
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.08em] text-text-muted">
            Prediction deadline: {deadlineLabel}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl border border-border bg-surface-01 p-4">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-race-red">
              GitHub Pages Demo
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Your picks are stored automatically in this browser for testing. Official submissions, Google sign-in and league persistence will be enabled when the VPS backend is brought online.
            </p>
          </div>

          {!complete && !locked ? (
            <Button asChild>
              <Link href="/predict">Continue Picks</Link>
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
}

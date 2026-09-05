"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, LockKeyhole, Pencil } from "lucide-react";

import { PredictionCard } from "@/components/prediction/prediction-card";
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

const FINISH_SWEEP_SESSION_KEY = "sepang56.prediction-finish-sweep";

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
  const [showFinishSweep, setShowFinishSweep] = useState(false);

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

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const finished = isPredictionComplete(draft.answers) || locked;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      !finished ||
      reducedMotion ||
      window.sessionStorage.getItem(FINISH_SWEEP_SESSION_KEY) === "1"
    ) {
      return;
    }

    window.sessionStorage.setItem(FINISH_SWEEP_SESSION_KEY, "1");
    setShowFinishSweep(true);
    const timer = window.setTimeout(() => setShowFinishSweep(false), 820);
    return () => window.clearTimeout(timer);
  }, [draft.answers, hydrated, locked]);

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
        <main className="mx-auto min-h-[calc(100vh-56px)] max-w-6xl px-5 py-12 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
            Loading your summary…
          </p>
        </main>
      </div>
    );
  }

  const summaryFinished = complete || locked;

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      {showFinishSweep ? <div className="finish-sweep" aria-hidden="true" /> : null}

      <RaceFlowHeader
        onBack={() => router.push(summaryFinished ? "/" : "/predict")}
        backLabel={summaryFinished ? "Back home" : "Back to predictions"}
      />

      <main className="relative min-h-[calc(100vh-56px)] overflow-hidden">
        <div aria-hidden="true" className="sepang-glow pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
        <div aria-hidden="true" className="race-grid pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-50" />
        <div className="summary-board-enter relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
          <div className="grid gap-7 border-b border-white/10 pb-9 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-0.5 w-9 bg-race-red" />
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
                  Prediction board
                </p>
              </div>
              <h1 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] text-white sm:text-7xl lg:text-8xl">
                Your Sepang
                <span className="text-gradient-heat block">calls.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                {locked
                  ? "The race deadline has passed. Your calls are now read-only."
                  : complete
                    ? "Your eight demo picks are complete and saved on this device. Edit any row, or finish the demo without changing your selections."
                    : "Review the grid. Every answered row can still be changed before you finish your picks."}
              </p>
            </div>

            <div className="lg:col-span-3 lg:col-start-10">
              <div className="rounded-lg border border-white/10 bg-surface-02 p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                  {locked ? (
                    <>
                      <LockKeyhole aria-hidden="true" className="size-4 text-race-red" />
                      Grid locked
                    </>
                  ) : complete ? (
                    <>
                      <Check aria-hidden="true" className="size-4 text-race-red" />
                      Grid complete
                    </>
                  ) : (
                    "Grid in progress"
                  )}
                </div>
                <p className="mt-3 font-display text-5xl font-extrabold leading-none text-white">
                  {Object.keys(draft.answers).length}<span className="text-text-muted">/8</span>
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">
                  calls answered
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PredictionCard answers={draft.answers} />
          </div>

          <section
            aria-label="Your prediction answers"
            className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-surface-01 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="grid grid-cols-[54px_1fr] border-b border-white/10 bg-surface-03 px-4 py-3 sm:grid-cols-[70px_1.2fr_1fr_80px] sm:px-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/45">No.</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/45">Race call</span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.13em] text-white/45 sm:block">Your pick</span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.13em] text-white/45 sm:block">Action</span>
            </div>

            {PREDICTION_QUESTIONS.map((question, index) => {
              const answer = draft.answers[question.id];

              return (
                <div
                  key={question.id}
                  className="group grid grid-cols-[54px_1fr] gap-y-2 border-b border-white/8 px-4 py-5 transition-colors last:border-b-0 hover:bg-white/[0.03] sm:grid-cols-[70px_1.2fr_1fr_80px] sm:items-center sm:px-6"
                >
                  <span className="font-display text-2xl font-extrabold text-race-red">
                    {String(question.index).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl font-bold uppercase leading-none text-white sm:text-2xl">
                    {question.summaryLabel}
                  </span>
                  <span className="col-start-2 text-base font-semibold text-text-secondary sm:col-start-auto">
                    {formatAnswer(answer)}
                  </span>
                  {!locked ? (
                    <button
                      type="button"
                      onClick={() => editQuestion(index)}
                      aria-label={`Edit ${question.summaryLabel}`}
                      className="col-start-2 inline-flex min-h-10 items-center gap-2 justify-self-start text-xs font-bold uppercase tracking-[0.06em] text-text-secondary transition-colors hover:text-race-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal sm:col-start-auto sm:justify-self-end"
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      Edit
                    </button>
                  ) : null}
                </div>
              );
            })}
          </section>

          <div className="mt-7 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                {deadlineLabel ? `Deadline: ${deadlineLabel}` : "Demo mode / saved on this device"}
              </p>
              {!deadlineLabel ? (
                <p className="mt-1 max-w-xl text-sm text-text-secondary">
                  Leaving this screen does not clear your picks. They remain in this browser until you change them.
                </p>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {!complete && !locked ? (
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/predict">Continue Picks</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="secondary" className="w-full sm:w-auto">
                    <Link href="/sepang">Explore Sepang</Link>
                  </Button>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/">Finish Demo</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

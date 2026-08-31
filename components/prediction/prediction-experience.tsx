"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { DriverCard } from "@/components/prediction/driver-card";
import { PredictionStep } from "@/components/prediction/prediction-step";
import { YesNoChoice } from "@/components/prediction/yes-no-choice";
import { RaceFlowHeader } from "@/components/shared/race-flow-header";
import { Button } from "@/components/ui/button";
import { DRIVERS, isDriverId } from "@/content/drivers";
import { PREDICTION_QUESTIONS } from "@/content/predictions";
import {
  DEFAULT_PREDICTION_DRAFT,
  PREDICTION_DEADLINE,
  PREDICTION_STORAGE_KEY,
  getUnavailablePodiumDriverIds,
  isPredictionLocked,
  isQuestionAnswered,
  parsePersistedPredictionDraft,
  setPredictionAnswer,
  type PersistedPredictionDraft,
  type PredictionAnswer,
} from "@/lib/predictions";

export const RETURN_TO_SUMMARY_KEY = "sepang56.predictions.returnToSummary";

export function PredictionExperience() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<PersistedPredictionDraft>(
    DEFAULT_PREDICTION_DRAFT,
  );
  const [showIntro, setShowIntro] = useState(false);
  const [returnToSummary, setReturnToSummary] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const stored = parsePersistedPredictionDraft(
      window.localStorage.getItem(PREDICTION_STORAGE_KEY),
    );
    const shouldReturnToSummary =
      window.sessionStorage.getItem(RETURN_TO_SUMMARY_KEY) === "1";

    setDraft(stored);
    setShowIntro(!stored.hasSeenIntro && !shouldReturnToSummary);
    setReturnToSummary(shouldReturnToSummary);
    setLocked(isPredictionLocked(PREDICTION_DEADLINE));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => {
    if (!hydrated || !PREDICTION_DEADLINE) {
      return;
    }

    const timer = window.setInterval(() => {
      setLocked(isPredictionLocked(PREDICTION_DEADLINE));
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [hydrated]);

  const question = PREDICTION_QUESTIONS[draft.currentQuestion];
  const unavailableDriverIds = useMemo(
    () => getUnavailablePodiumDriverIds(question.id, draft.answers),
    [draft.answers, question.id],
  );
  const answer = draft.answers[question.id];
  const canContinue = isQuestionAnswered(question.id, draft.answers);

  function updateAnswer(nextAnswer: PredictionAnswer) {
    if (locked) {
      return;
    }

    setDraft((current) => ({
      ...current,
      answers: setPredictionAnswer(current.answers, question.id, nextAnswer),
    }));
  }

  function goBack() {
    if (returnToSummary) {
      window.sessionStorage.removeItem(RETURN_TO_SUMMARY_KEY);
      router.push("/predict/summary");
      return;
    }

    if (showIntro) {
      router.push("/sepang");
      return;
    }

    if (draft.currentQuestion === 0) {
      setShowIntro(true);
      return;
    }

    setDraft((current) => ({
      ...current,
      currentQuestion: current.currentQuestion - 1,
    }));
  }

  function continueFromQuestion() {
    if (!canContinue || locked) {
      return;
    }

    if (returnToSummary) {
      window.sessionStorage.removeItem(RETURN_TO_SUMMARY_KEY);
      router.push("/predict/summary");
      return;
    }

    if (draft.currentQuestion === PREDICTION_QUESTIONS.length - 1) {
      router.push("/predict/summary");
      return;
    }

    setDraft((current) => ({
      ...current,
      currentQuestion: current.currentQuestion + 1,
    }));
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-canvas">
        <RaceFlowHeader onBack={() => router.push("/sepang")} />
        <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="border border-border bg-surface-01 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              Loading your picks…
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen bg-canvas">
        <RaceFlowHeader onBack={() => router.push("/")} />
        <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-3xl items-center px-5 py-12 sm:px-8">
          <section className="w-full border border-border bg-surface-01 p-6 sm:p-10">
            <LockKeyhole aria-hidden="true" className="size-7 text-race-red" />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-race-red">
              Predictions Locked
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.95] text-white sm:text-6xl">
              Picks are closed
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-text-secondary">
              The race deadline has passed, so prediction answers are now read-only.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/predict/summary">View Your Picks</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-canvas">
        <RaceFlowHeader onBack={goBack} backLabel="Back to Sepang" />
        <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
            Make Your Picks
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
            Eight picks. One race.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-text-secondary">
            Go one question at a time. You can change any answer before the race deadline, and you do not need an account just to start.
          </p>

          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2">
            {[
              ["01", "Race winner"],
              ["02", "Second place"],
              ["03", "Third place"],
              ["04", "P1 starter wins?"],
              ["05", "Fastest lap"],
              ["06", "Rain?"],
              ["07", "Safety Car?"],
              ["08", "First retirement"],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-4 bg-surface-01 p-4 sm:p-5">
                <span className="font-mono text-xs text-race-red">{number}</span>
                <span className="font-display text-xl font-bold uppercase text-white">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setDraft((current) => ({ ...current, hasSeenIntro: true }));
                setShowIntro(false);
              }}
            >
              Start Picking
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <RaceFlowHeader
        onBack={goBack}
        backLabel={returnToSummary ? "Back to prediction summary" : "Previous step"}
      />

      <PredictionStep
        progress={`${String(question.index).padStart(2, "0")} / 08`}
        heading={question.heading}
        helper={question.helper}
        canContinue={canContinue}
        onContinue={continueFromQuestion}
        continueLabel={returnToSummary ? "Save Edit" : "Next"}
      >
        {question.kind === "driver" ? (
          <fieldset>
            <legend className="sr-only">Choose one driver</legend>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {DRIVERS.map((driver) => {
                const selected = answer === driver.id;
                const unavailable = unavailableDriverIds.includes(driver.id);

                return (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    name={question.id}
                    selected={selected}
                    disabled={unavailable && !selected}
                    onSelect={() => updateAnswer(driver.id)}
                  />
                );
              })}
            </div>
          </fieldset>
        ) : (
          <fieldset>
            <legend className="sr-only">Choose yes or no</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <YesNoChoice
                value
                name={question.id}
                selected={answer === true}
                onSelect={() => updateAnswer(true)}
              />
              <YesNoChoice
                value={false}
                name={question.id}
                selected={answer === false}
                onSelect={() => updateAnswer(false)}
              />
            </div>
          </fieldset>
        )}

        {question.kind === "driver" && isDriverId(answer) ? (
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.08em] text-text-muted">
            Selected: {DRIVERS.find((driver) => driver.id === answer)?.firstName}{" "}
            {DRIVERS.find((driver) => driver.id === answer)?.surname}
          </p>
        ) : null}
      </PredictionStep>
    </div>
  );
}

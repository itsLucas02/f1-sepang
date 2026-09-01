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
import { DRIVERS, getDriver, isDriverId } from "@/content/drivers";
import { PREDICTION_QUESTIONS } from "@/content/predictions";
import {
  DEFAULT_PREDICTION_DRAFT,
  PREDICTION_DEADLINE,
  PREDICTION_RETURN_TO_SUMMARY_KEY,
  PREDICTION_STORAGE_KEY,
  getUnavailablePodiumDriverIds,
  isPredictionLocked,
  isQuestionAnswered,
  parsePersistedPredictionDraft,
  setPredictionAnswer,
  type PersistedPredictionDraft,
  type PredictionAnswer,
} from "@/lib/predictions";

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
      window.sessionStorage.getItem(PREDICTION_RETURN_TO_SUMMARY_KEY) === "1";

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
  const selectedDriver = isDriverId(answer) ? getDriver(answer) : null;
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
      window.sessionStorage.removeItem(PREDICTION_RETURN_TO_SUMMARY_KEY);
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
      window.sessionStorage.removeItem(PREDICTION_RETURN_TO_SUMMARY_KEY);
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
        <main className="race-grid mx-auto min-h-[calc(100vh-56px)] max-w-6xl px-5 py-12 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            Loading your picks…
          </p>
        </main>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen bg-canvas">
        <RaceFlowHeader onBack={() => router.push("/")} />
        <main className="race-grid mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl items-center px-5 py-12 sm:px-8">
          <section className="w-full overflow-hidden border border-border bg-[#121218] p-7 sm:p-12">
            <div className="flex items-center gap-3">
              <LockKeyhole aria-hidden="true" className="size-5 text-race-red" />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-race-red">
                Predictions locked
              </p>
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.84] text-white sm:text-7xl">
              The grid is closed.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-text-secondary">
              The race deadline has passed, so prediction answers are now read-only.
            </p>
            <div className="mt-9">
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
      <PredictionIntro
        onBack={goBack}
        onStart={() => {
          setDraft((current) => ({ ...current, hasSeenIntro: true }));
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <RaceFlowHeader
        onBack={goBack}
        backLabel={returnToSummary ? "Back to prediction summary" : "Previous step"}
      />

      <PredictionStep
        key={question.id}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
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

        {selectedDriver ? (
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
            <span className="size-2 bg-race-red" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
              Current call: <span className="text-white">{selectedDriver.firstName} {selectedDriver.surname}</span>
            </p>
          </div>
        ) : null}
      </PredictionStep>
    </div>
  );
}

function PredictionIntro({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <RaceFlowHeader onBack={onBack} backLabel="Back to Sepang" />
      <main className="race-grid relative min-h-[calc(100vh-56px)] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -right-10 top-10 font-display text-[18rem] font-extrabold leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[28rem] lg:text-[38rem]"
        >
          08
        </div>
        <div
          aria-hidden="true"
          className="absolute right-[8%] top-[18%] h-72 w-72 rounded-full bg-race-red/15 blur-[110px]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:items-end lg:py-20">
          <section className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 bg-race-red" aria-hidden="true" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
                Prediction grid
              </p>
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-7xl font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-white sm:text-8xl lg:text-[7.5rem]">
              Eight calls.
              <span className="block text-race-red">One race.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-7 text-text-secondary sm:text-xl sm:leading-8">
              Pick the podium and five race outcomes. Go one call at a time, change anything before the deadline, and review the whole grid before saving.
            </p>
            <Button type="button" onClick={onStart} className="mt-9 min-w-48">
              Start Picking
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </section>

          <section className="lg:col-span-4 lg:col-start-9" aria-label="Eight prediction calls">
            <div className="border-t-2 border-white/75">
              {PREDICTION_QUESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_1fr] items-center gap-4 border-b border-white/12 py-3.5"
                >
                  <span className="font-mono text-[10px] text-race-red">
                    {String(item.index).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg font-bold uppercase text-white/82">
                    {item.summaryLabel}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

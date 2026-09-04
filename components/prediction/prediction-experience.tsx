"use client";

import Image from "next/image";
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
import { publicAsset } from "@/lib/assets";
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

type TransitionDirection = "forward" | "back";

export function PredictionExperience() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<PersistedPredictionDraft>(
    DEFAULT_PREDICTION_DRAFT,
  );
  const [showIntro, setShowIntro] = useState(false);
  const [returnToSummary, setReturnToSummary] = useState(false);
  const [locked, setLocked] = useState(false);
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("forward");

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

    setTransitionDirection("back");
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

    setTransitionDirection("forward");
    setDraft((current) => ({
      ...current,
      currentQuestion: current.currentQuestion + 1,
    }));
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-canvas">
        <RaceFlowHeader
          onBack={() => router.push("/sepang")}
          backLabel="Back to Sepang"
          exitHref="/sepang"
          exitLabel="Exit predictions"
        />
        <main className="mx-auto min-h-[calc(100vh-56px)] max-w-6xl px-5 py-12 sm:px-8">
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
        <RaceFlowHeader
          onBack={() => router.push("/")}
          backLabel="Back home"
          exitHref="/sepang"
          exitLabel="Exit predictions"
        />
        <main className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-6xl items-center overflow-hidden px-5 py-12 sm:px-8">
          <div className="speed-hatch pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <section className="relative w-full border border-white/14 bg-[#0d0d0f] p-7 sm:p-12">
            <div className="flex items-center gap-3">
              <LockKeyhole aria-hidden="true" className="size-5 text-race-red" />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-race-red">
                Predictions locked
              </p>
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold uppercase italic leading-[0.84] text-white sm:text-6xl lg:text-7xl">
              The grid is closed.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
              The race deadline has passed, so prediction answers are now read-only.
            </p>
            <div className="mt-9">
              <Button asChild size="large" className="rounded-none">
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
          setTransitionDirection("forward");
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
        exitHref="/sepang"
        exitLabel="Exit predictions"
      />

      <PredictionStep
        key={question.id}
        direction={transitionDirection}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
              {DRIVERS.map((driver, index) => {
                const selected = answer === driver.id;
                const unavailable = unavailableDriverIds.includes(driver.id);

                return (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    index={index}
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
          <div className="circuit-detail-swap mt-6 flex items-center gap-3 border-l-2 border-race-red bg-[#0d0d0f] px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45 sm:text-[10px]">
              Current call: <span className="font-semibold text-white">{selectedDriver.firstName} {selectedDriver.surname}</span>
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
    <div className="min-h-screen bg-canvas">
      <RaceFlowHeader
        onBack={onBack}
        backLabel="Back to Sepang"
        exitHref="/sepang"
        exitLabel="Exit predictions"
      />
      <main className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-[#050506]">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[60%]">
          <Image
            src={publicAsset("/media/prediction/intro.webp")}
            alt="Formula-style cars racing at Sepang"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="hero-kenburns object-cover object-[64%_center] grayscale-[0.12] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050506] via-[#050506]/66 to-black/10" aria-hidden="true" />
        </div>
        <div className="race-noise pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:items-end lg:py-20">
          <section className="prediction-step-forward lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="motorsport-stripe block" aria-hidden="true" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                Prediction grid
              </p>
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-6xl font-extrabold uppercase italic leading-[0.8] tracking-[-0.045em] text-white sm:text-7xl lg:text-[7rem]">
              Eight calls.
              <span className="block text-race-red">One race.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">
              Pick the podium and five race outcomes. Go one call at a time, change anything before the deadline, and review the whole grid before saving. Your progress stays saved if you leave and come back.
            </p>
            <Button type="button" size="large" onClick={onStart} className="sheen mt-9 min-w-52 rounded-none uppercase tracking-[0.05em]">
              Start Picking
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </section>

          <section className="prediction-step-forward lg:col-span-4 lg:col-start-9" aria-label="Eight prediction calls">
            <div className="border border-white/14 bg-[#09090b]/92 p-2">
              {PREDICTION_QUESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_1fr] items-center gap-4 border-b border-white/8 px-3 py-3.5 last:border-b-0"
                >
                  <span className="font-mono text-[10px] text-race-red">
                    {String(item.index).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg font-bold uppercase italic text-white">
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

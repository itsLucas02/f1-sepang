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
  parsePredictionAnswers,
  type PersistedPredictionDraft,
  type PredictionAnswer,
  type PredictionAnswers,
} from "@/lib/predictions";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

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

async function persistPrediction(answers: PredictionAnswers) {
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const payload = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to save your picks.");
  }
}

type SaveState = "idle" | "saving" | "saved" | "error";

type PersistedSubmissionPayload = {
  submission?: {
    answers?: unknown;
  } | null;
};

export function PredictionSummary() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<PersistedPredictionDraft>(
    DEFAULT_PREDICTION_DRAFT,
  );
  const [locked, setLocked] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [hasSubmission, setHasSubmission] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const stored = parsePersistedPredictionDraft(
      window.localStorage.getItem(PREDICTION_STORAGE_KEY),
    );
    const isLocked = isPredictionLocked(PREDICTION_DEADLINE);

    setDraft(stored);
    setLocked(isLocked);
    setHydrated(true);

    const initializeAuth = async () => {
      const params = new URLSearchParams(window.location.search);

      if (params.get("auth") === "error") {
        setSaveState("error");
        setSaveError("Google sign-in did not complete. Your picks are still here.");
        setAuthReady(true);
        return;
      }

      if (!hasSupabasePublicEnv()) {
        setAuthReady(true);
        return;
      }

      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setSignedIn(Boolean(user));
      setAuthReady(true);

      if (!user) {
        return;
      }

      const existingResponse = await fetch("/api/predictions", {
        method: "GET",
        cache: "no-store",
      });

      if (existingResponse.ok) {
        const existingPayload =
          (await existingResponse.json()) as PersistedSubmissionPayload;
        const existingSubmission = existingPayload.submission ?? null;
        setHasSubmission(Boolean(existingSubmission));

        if (
          existingSubmission &&
          Object.keys(stored.answers).length === 0
        ) {
          const recoveredAnswers = parsePredictionAnswers(
            existingSubmission.answers,
          );

          if (isPredictionComplete(recoveredAnswers)) {
            const recoveredDraft: PersistedPredictionDraft = {
              ...stored,
              answers: recoveredAnswers,
              hasSeenIntro: true,
            };
            setDraft(recoveredDraft);
            window.localStorage.setItem(
              PREDICTION_STORAGE_KEY,
              JSON.stringify(recoveredDraft),
            );
          }
        }
      }

      if (
        params.get("save") === "1" &&
        isPredictionComplete(stored.answers) &&
        !isLocked
      ) {
        setSaveState("saving");
        setSaveError(null);
        try {
          await persistPrediction(stored.answers);
          setHasSubmission(true);
          setSaveState("saved");
          window.history.replaceState({}, "", "/predict/summary");
        } catch (error) {
          setSaveState("error");
          setSaveError(
            error instanceof Error ? error.message : "Unable to save your picks.",
          );
        }
      }
    };

    void initializeAuth();
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

  async function savePicks() {
    if (!complete || locked || saveState === "saving") {
      return;
    }

    setSaveError(null);

    if (!hasSupabasePublicEnv()) {
      setSaveState("error");
      setSaveError("Supabase is not configured for this deployment yet.");
      return;
    }

    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", "/predict/summary?save=1");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString() },
      });

      if (error) {
        setSaveState("error");
        setSaveError(error.message);
      }
      return;
    }

    setSignedIn(true);
    setSaveState("saving");
    try {
      await persistPrediction(draft.answers);
      setHasSubmission(true);
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      setSaveError(
        error instanceof Error ? error.message : "Unable to save your picks.",
      );
    }
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

        {saveState === "saved" ? (
          <div className="mt-6 border border-race-red bg-surface-01 p-4">
            <p className="font-display text-xl font-bold uppercase text-white">
              Picks submitted
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              They remain editable until the race deadline.
            </p>
          </div>
        ) : null}

        {saveError ? (
          <div role="alert" className="mt-6 bg-warning p-4 text-warning-foreground">
            <p className="font-semibold">{saveError}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
          {!complete && !locked ? (
            <Button asChild>
              <Link href="/predict">Continue Picks</Link>
            </Button>
          ) : null}

          {complete && !locked ? (
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <Button
                type="button"
                disabled={!authReady || saveState === "saving"}
                onClick={() => void savePicks()}
              >
                {saveState === "saving"
                  ? "Saving Picks…"
                  : hasSubmission
                    ? "Update Picks"
                    : "Save Picks"}
              </Button>
              <p className="max-w-xs text-sm leading-5 text-text-muted sm:text-right">
                {signedIn
                  ? "Your official submission stays editable until the deadline."
                  : "Saving will ask you to sign in with Google."}
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

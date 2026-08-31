import { isDriverId, type DriverId } from "@/content/drivers";
import {
  PREDICTION_QUESTIONS,
  PREDICTION_QUESTION_IDS,
  getPredictionQuestion,
  type PredictionQuestionId,
} from "@/content/predictions";

export const PREDICTION_STORAGE_KEY = "sepang56.predictions";
export const PREDICTION_RETURN_TO_SUMMARY_KEY =
  "sepang56.predictions.returnToSummary";
export const PREDICTION_DEADLINE =
  process.env.NEXT_PUBLIC_PREDICTION_DEADLINE ?? null;

export type PredictionAnswer = DriverId | boolean;
export type PredictionAnswers = Partial<
  Record<PredictionQuestionId, PredictionAnswer>
>;

export type PersistedPredictionDraft = {
  answers: PredictionAnswers;
  currentQuestion: number;
  hasSeenIntro: boolean;
};

export const DEFAULT_PREDICTION_DRAFT: PersistedPredictionDraft = {
  answers: {},
  currentQuestion: 0,
  hasSeenIntro: false,
};

export function isPredictionQuestionId(
  value: unknown,
): value is PredictionQuestionId {
  return (
    typeof value === "string" &&
    PREDICTION_QUESTION_IDS.includes(value as PredictionQuestionId)
  );
}

export function isValidAnswer(
  questionId: PredictionQuestionId,
  value: unknown,
): value is PredictionAnswer {
  const question = getPredictionQuestion(questionId);
  return question.kind === "driver"
    ? isDriverId(value)
    : typeof value === "boolean";
}

export function parsePersistedPredictionDraft(
  raw: string | null,
): PersistedPredictionDraft {
  if (!raw) {
    return DEFAULT_PREDICTION_DRAFT;
  }

  try {
    const parsed = JSON.parse(raw) as {
      answers?: unknown;
      currentQuestion?: unknown;
      hasSeenIntro?: unknown;
    };

    const answers: PredictionAnswers = {};

    if (
      parsed.answers &&
      typeof parsed.answers === "object" &&
      !Array.isArray(parsed.answers)
    ) {
      for (const [key, value] of Object.entries(parsed.answers)) {
        if (isPredictionQuestionId(key) && isValidAnswer(key, value)) {
          answers[key] = value;
        }
      }
    }

    const currentQuestion =
      typeof parsed.currentQuestion === "number" &&
      Number.isInteger(parsed.currentQuestion) &&
      parsed.currentQuestion >= 0 &&
      parsed.currentQuestion < PREDICTION_QUESTIONS.length
        ? parsed.currentQuestion
        : 0;

    return {
      answers,
      currentQuestion,
      hasSeenIntro: parsed.hasSeenIntro === true,
    };
  } catch {
    return DEFAULT_PREDICTION_DRAFT;
  }
}

export function getUnavailablePodiumDriverIds(
  questionId: PredictionQuestionId,
  answers: PredictionAnswers,
) {
  if (questionId === "second") {
    return isDriverId(answers.winner) ? [answers.winner] : [];
  }

  if (questionId === "third") {
    return [answers.winner, answers.second].filter(isDriverId);
  }

  return [];
}

export function setPredictionAnswer(
  answers: PredictionAnswers,
  questionId: PredictionQuestionId,
  answer: PredictionAnswer,
): PredictionAnswers {
  if (!isValidAnswer(questionId, answer)) {
    return answers;
  }

  if (
    isDriverId(answer) &&
    getUnavailablePodiumDriverIds(questionId, answers).includes(answer)
  ) {
    return answers;
  }

  const next = { ...answers, [questionId]: answer };

  if (questionId === "winner" && isDriverId(answer)) {
    if (next.second === answer) {
      delete next.second;
    }
    if (next.third === answer) {
      delete next.third;
    }
  }

  if (questionId === "second" && isDriverId(answer)) {
    if (next.third === answer) {
      delete next.third;
    }
  }

  return next;
}

export function isQuestionAnswered(
  questionId: PredictionQuestionId,
  answers: PredictionAnswers,
) {
  return isValidAnswer(questionId, answers[questionId]);
}

export function isPredictionComplete(answers: PredictionAnswers) {
  return PREDICTION_QUESTION_IDS.every((questionId) =>
    isQuestionAnswered(questionId, answers),
  );
}

export function isPredictionLocked(
  deadlineAt: string | null,
  now = new Date(),
) {
  if (!deadlineAt) {
    return false;
  }

  const deadline = new Date(deadlineAt);
  if (Number.isNaN(deadline.getTime())) {
    return false;
  }

  return now.getTime() >= deadline.getTime();
}

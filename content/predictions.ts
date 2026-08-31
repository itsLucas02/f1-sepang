export const PREDICTION_QUESTIONS = [
  {
    id: "winner",
    index: 1,
    kind: "driver",
    heading: "Who wins Sepang?",
    helper: "Choose the driver you think will finish P1 — first place.",
    summaryLabel: "Race Winner",
  },
  {
    id: "second",
    index: 2,
    kind: "driver",
    heading: "Who finishes second?",
    helper: "Choose the driver you think will finish P2. Your predicted winner cannot be picked again.",
    summaryLabel: "Second Place",
  },
  {
    id: "third",
    index: 3,
    kind: "driver",
    heading: "Who finishes third?",
    helper: "Choose the driver you think will finish P3. Each podium place must use a different driver.",
    summaryLabel: "Third Place",
  },
  {
    id: "p1StarterWins",
    index: 4,
    kind: "boolean",
    heading: "Will the P1 starter win?",
    helper: "P1 means the driver starting the race from first place on the grid.",
    summaryLabel: "P1 Starter Wins",
  },
  {
    id: "fastestLap",
    index: 5,
    kind: "driver",
    heading: "Who sets fastest lap?",
    helper: "Pick the driver you think will record the quickest single lap during the race.",
    summaryLabel: "Fastest Lap",
  },
  {
    id: "rain",
    index: 6,
    kind: "boolean",
    heading: "Rain during the race?",
    helper: "Predict whether rain will affect the race at any point.",
    summaryLabel: "Rain",
  },
  {
    id: "safetyCar",
    index: 7,
    kind: "boolean",
    heading: "Safety Car during the race?",
    helper: "Predict whether the Safety Car will be deployed during the race.",
    summaryLabel: "Safety Car",
  },
  {
    id: "firstRetirement",
    index: 8,
    kind: "driver",
    heading: "Who retires first?",
    helper: "A retirement is a driver who stops competing before finishing the race.",
    summaryLabel: "First Retirement",
  },
] as const;

export type PredictionQuestion = (typeof PREDICTION_QUESTIONS)[number];
export type PredictionQuestionId = PredictionQuestion["id"];

export const PREDICTION_QUESTION_IDS = PREDICTION_QUESTIONS.map(
  (question) => question.id,
) as PredictionQuestionId[];

export function getPredictionQuestion(questionId: PredictionQuestionId) {
  const question = PREDICTION_QUESTIONS.find((candidate) => candidate.id === questionId);

  if (!question) {
    throw new Error(`Unknown prediction question: ${questionId}`);
  }

  return question;
}

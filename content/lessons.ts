export const LESSON_IDS = ["01", "02", "03", "04", "05", "06"] as const;

export type LessonId = (typeof LESSON_IDS)[number];

export type LessonVisualKind =
  | "weekend"
  | "race"
  | "overtaking"
  | "tyres"
  | "flags"
  | "watch";

export type Lesson = {
  id: LessonId;
  title: string;
  shortTitle: string;
  intro: string;
  points: readonly string[];
  takeaway: string;
  visual: LessonVisualKind;
};

export const LESSONS: readonly Lesson[] = [
  {
    id: "01",
    title: "Race Weekend",
    shortTitle: "Race Weekend",
    intro:
      "An F1 weekend builds toward the race. Practice helps teams prepare, qualifying sets the starting order, and the race decides the finishing order.",
    points: [
      "Practice is where drivers and teams prepare for the circuit.",
      "Qualifying decides the starting grid for the race.",
      "The race is the main event and decides who finishes P1, P2, P3 and beyond.",
    ],
    takeaway: "Practice → Qualifying → Race is the basic weekend rhythm.",
    visual: "weekend",
  },
  {
    id: "02",
    title: "How the Race Works",
    shortTitle: "How the Race Works",
    intro:
      "Cars start from grid positions and race over a set distance. Positions change throughout the race, and the driver classified P1 is the winner.",
    points: [
      "The starting grid is the order the cars line up before the start.",
      "Drivers complete laps until the race distance is reached.",
      "P1 means first position. The finishing order determines the race result.",
    ],
    takeaway: "Follow the positions: the goal is simple — finish ahead of everyone else.",
    visual: "race",
  },
  {
    id: "03",
    title: "Overtaking",
    shortTitle: "Overtaking",
    intro:
      "Passing another F1 car is difficult, so drivers look for places where they can gain an advantage — especially long straights and heavy braking zones.",
    points: [
      "Braking zones create chances because drivers must slow dramatically for a corner.",
      "A slipstream can help a following car gain speed on a straight.",
      "DRS can help a chasing driver reduce drag on designated straights.",
    ],
    takeaway: "Watch the end of long straights: that is where many attacks begin.",
    visual: "overtaking",
  },
  {
    id: "04",
    title: "Tyres & Pit Stops",
    shortTitle: "Tyres & Pit Stops",
    intro:
      "Tyres affect how quickly a car can race and how long it can stay on track. Pit stops let teams change tyres during the race.",
    points: [
      "Soft tyres prioritize speed but generally do not last as long.",
      "Medium and Hard tyres trade some speed for longer running.",
      "A pit stop costs time now in exchange for fresh tyres afterward.",
    ],
    takeaway: "When a driver pits, ask what tyre they changed to and what that might enable next.",
    visual: "tyres",
  },
  {
    id: "05",
    title: "Flags & Safety Car",
    shortTitle: "Flags & Safety Car",
    intro:
      "Race control uses flags and the Safety Car to communicate what drivers must do when conditions on track change.",
    points: [
      "Yellow warns of danger; red stops the session or race.",
      "Blue tells a slower car that a faster car is approaching; the chequered flag marks the finish.",
      "A Safety Car slows the field and bunches the cars together while the track is made safe.",
    ],
    takeaway: "When a flag or Safety Car appears, the normal rhythm of the race can change immediately.",
    visual: "flags",
  },
  {
    id: "06",
    title: "How to Watch",
    shortTitle: "How to Watch",
    intro:
      "You do not need to track everything. A few simple cues are enough to understand where the race is heading.",
    points: [
      "Watch the start, then notice the gaps between the cars you care about.",
      "Keep an eye on tyre choices, pit stops and the main overtaking areas.",
      "Safety Car moments and the final laps can quickly reshape the result.",
    ],
    takeaway: "You now know enough to follow the action. Next, learn where to watch for it at Sepang.",
    visual: "watch",
  },
] as const;

export function getLesson(lessonId: LessonId) {
  return LESSONS.find((lesson) => lesson.id === lessonId) ?? LESSONS[0];
}

export const HOTSPOT_ORDER = [
  "main-straight",
  "t1",
  "t4",
  "t9",
  "t15",
] as const;

export type HotspotId = (typeof HOTSPOT_ORDER)[number];

export type SepangHotspot = {
  id: HotspotId;
  index: string;
  shortLabel: string;
  title: string;
  whatHappens: string;
  whyItMatters: string;
  watchFor: string;
  media: {
    alt: string;
    context: string;
    credit: string;
  };
};

// Beginner-first factual draft. Circuit-specific claims were checked against
// Formula1.com Sepang previews/onboards and Sepang International Circuit material.
// Keep this copy concise; do not expand it into engineering telemetry.
export const SEPANG_HOTSPOTS: readonly SepangHotspot[] = [
  {
    id: "main-straight",
    index: "01",
    shortLabel: "MAIN STRAIGHT",
    title: "Main Straight",
    whatHappens:
      "The long start-and-finish straight connects the final corner to Turn 1, with the field accelerating hard before the first braking zone.",
    whyItMatters:
      "Watch the race start, slipstreaming and drivers positioning themselves for a move into Turn 1.",
    watchFor: "Slipstream → positioning → heavy braking",
    media: {
      alt: "Formula One field racing at Sepang during the 2016 Malaysian Grand Prix",
      context: "Sepang race context / opening lap",
      credit: "Morio / CC BY-SA 4.0",
    },
  },
  {
    id: "t1",
    index: "02",
    shortLabel: "T1",
    title: "Turn 1",
    whatHappens:
      "Drivers arrive quickly from the main straight and brake hard for the tight opening corner before flowing immediately into Turn 2.",
    whyItMatters:
      "Cars bunch together here at the start, and the heavy braking zone creates one of Sepang's clearest chances to attack or defend.",
    watchFor: "Braking pressure → inside line → Turn 2 exit",
    media: {
      alt: "Formula One cars bunched together on the opening lap at Sepang",
      context: "Sepang race context / first-lap traffic",
      credit: "Morio / CC BY-SA 4.0",
    },
  },
  {
    id: "t4",
    index: "03",
    shortLabel: "T4",
    title: "Turn 4",
    whatHappens:
      "Turn 4 is another heavy-braking corner after the opening sequence, so drivers must slow the car and get back on power cleanly.",
    whyItMatters:
      "A driver close behind can use the braking zone to attempt a pass, so this is a useful place to watch battles develop.",
    watchFor: "Late braking → rotation → clean acceleration",
    media: {
      alt: "A Formula One car running at Sepang during 2016 practice",
      context: "Sepang race context / braking and rotation",
      credit: "Morio / CC BY-SA 4.0",
    },
  },
  {
    id: "t9",
    index: "04",
    shortLabel: "T9",
    title: "Turn 9",
    whatHappens:
      "Turn 9 is a slow hairpin area where drivers have to control the car under braking and then find traction on the exit.",
    whyItMatters:
      "The low speed and braking phase can open a passing opportunity when two cars arrive close together.",
    watchFor: "Slow apex → patience → traction on exit",
    media: {
      alt: "Formula One cars racing through Sepang during the 2016 Malaysian Grand Prix",
      context: "Sepang race context / low-speed battle",
      credit: "Morio / CC BY-SA 4.0",
    },
  },
  {
    id: "t15",
    index: "05",
    shortLabel: "T15",
    title: "Turn 15",
    whatHappens:
      "The final left-hand hairpin slows the cars sharply before they accelerate back onto the main straight.",
    whyItMatters:
      "Late braking can create a passing attempt here, while a strong exit matters for the run down the straight that follows.",
    watchFor: "Attack under braking → defend apex → launch onto straight",
    media: {
      alt: "Two Formula One cars fighting for position at Sepang in 2016",
      context: "Sepang race context / overtaking fight",
      credit: "Morio / CC BY-SA 4.0",
    },
  },
] as const;

export function getHotspot(id: HotspotId) {
  return SEPANG_HOTSPOTS.find((hotspot) => hotspot.id === id) ?? SEPANG_HOTSPOTS[0];
}

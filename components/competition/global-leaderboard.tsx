"use client";

import { useEffect, useState } from "react";
import { Flag, Trophy, Users } from "lucide-react";
import { rankParticipants, type LeaderboardParticipant } from "@/lib/leaderboard";

export function GlobalLeaderboard() {
  const [participants, setParticipants] = useState<LeaderboardParticipant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/leaderboard")
      .then(async (response) => {
        const payload = (await response.json()) as { error?: string; participants?: LeaderboardParticipant[] };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load participants.");
        setParticipants(payload.participants ?? []);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load participants."));
  }, []);

  const hasScores = participants.some((participant) => participant.score !== null);
  const ranked = rankParticipants(participants);

  return (
    <section className="surface-card relative overflow-hidden rounded-lg p-6 sm:p-8">
      <div className="chequer absolute inset-0 opacity-[0.06]" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-race-red">Global grid</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl">Who&apos;s racing?</h1>
          <p className="mt-3 text-text-secondary">{participants.length} {participants.length === 1 ? "racer has" : "racers have"} saved picks.</p>
        </div>
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-race-red/40 bg-race-red/10 text-race-red"><Users aria-hidden="true" className="size-5" /></span>
      </div>
      {error ? <p className="relative mt-8 text-race-red">{error}</p> : null}
      {!error && participants.length === 0 ? <div className="relative mt-10 border border-dashed border-white/15 p-6 text-text-secondary">Be the first racer to save a full grid.</div> : null}
      {!error && participants.length > 0 ? (
        <ol className="relative mt-8 divide-y divide-white/10 border-y border-white/10">
          {ranked.map((participant, index) => (
            <li key={`${participant.displayName}-${index}`} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4"><span className="font-display text-xl font-extrabold text-race-red">{String(participant.rank ?? index + 1).padStart(2, "0")}</span><span className="font-semibold text-white">{participant.displayName}</span></div>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">{participant.score === null ? "Picks in" : `${participant.score} pts`}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <p className="relative mt-6 flex items-center gap-2 text-sm text-text-secondary">{hasScores ? <Trophy aria-hidden="true" className="size-4 text-gold" /> : <Flag aria-hidden="true" className="size-4 text-teal" />}{hasScores ? "Scores are official after race results are entered." : "Scores arrive after the race result is entered."}</p>
    </section>
  );
}

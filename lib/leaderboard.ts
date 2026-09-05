export type LeaderboardParticipant = {
  displayName: string;
  score: number | null;
};

export function rankParticipants(participants: LeaderboardParticipant[]) {
  let previousScore: number | null = null;
  let rank = 0;

  return [...participants]
    .sort((left, right) => (right.score ?? -1) - (left.score ?? -1))
    .map((participant, index) => {
      if (participant.score !== null && participant.score !== previousScore) {
        rank = index + 1;
      }
      previousScore = participant.score;
      return { ...participant, rank: participant.score === null ? null : rank };
    });
}

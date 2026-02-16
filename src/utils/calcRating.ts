export function calcRating(ratingCurent: number, rank: number, totalParticipanti: number): number {
  const performanta = 1 - (rank - 1) / Math.max(totalParticipanti - 1, 1);
  const delta = Math.round((performanta - 0.5) * 80);
  return ratingCurent + delta;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';

  const totalSecunde = Math.floor(ms / 1000);
  const ore = Math.floor(totalSecunde / 3600);
  const minute = Math.floor((totalSecunde % 3600) / 60);
  const secunde = totalSecunde % 60;

  return [ore, minute, secunde]
    .map((valoare) => valoare.toString().padStart(2, '0'))
    .join(':');
}

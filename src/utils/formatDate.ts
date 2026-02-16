export function formatDate(dataISO: string, includeOra = true): string {
  const data = new Date(dataISO);

  if (Number.isNaN(data.getTime())) {
    return 'Dată invalidă';
  }

  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeOra
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
  }).format(data);
}

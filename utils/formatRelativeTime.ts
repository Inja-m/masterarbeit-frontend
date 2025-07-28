export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)

  const seconds = (now.getTime() - date.getTime()) / 1000
  const daysDiff = Math.floor(seconds / 86400)

  if (seconds < 60) return 'vor wenigen Sekunden'
  if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`
  if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std.`

  if (daysDiff < 7) {
    return `${daysDiff === 1 ? 'Gestern' : `vor ${daysDiff} Tagen`}`
  }

  const weeks = Math.floor(daysDiff / 7)
  if (daysDiff < 30) {
    return `${weeks === 1 ? 'letzte Woche' : `vor ${weeks} Wochen`}`
  }

  const months = Math.floor(daysDiff / 30)
  if (daysDiff < 365) {
    return `${months === 1 ? 'letzter Monat' : `vor ${months} Monaten`}`
  }

  const years = Math.floor(daysDiff / 365)
  return `${years === 1 ? 'letztes Jahr' : `vor ${years} Jahren`}`
}

export function getISOWeek(dateString: string): { week: number; year: number; month: string } {
  const date = new Date(dateString);
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);

  // Donnerstag der aktuellen Woche
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));

  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  const diff = tempDate.getTime() - week1.getTime();

  const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));

  // Deutsche Monatsnamen
  const monate = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  // Monat aus dem ursprünglichen Datum (0-basiert)
  const month = monate[date.getMonth()];

  return { week, year: tempDate.getFullYear(), month };
}
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
    return `${weeks === 1 ? 'letzte Woche' : 'vor ${weeks} Wochen'}`
  }

  const months = Math.floor(daysDiff / 30)
  if (daysDiff < 365) {
    return `${months === 1 ? 'letzter Monat' : 'vor ${months} Monaten'}`
  }

  const years = Math.floor(daysDiff / 365)
  return `${years === 1 ? 'letztes Jahr' : 'vor ${years} Jahren'}`
}
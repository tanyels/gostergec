/**
 * Returns today's date as YYYY-MM-DD in the local timezone.
 * Avoids the UTC midnight bug where toISOString() returns yesterday's
 * date between 00:00-03:00 in Turkey (UTC+3).
 */
export function getLocalDateString(date?: Date): string {
  const d = date ?? new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

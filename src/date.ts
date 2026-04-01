/** Time unit constants in seconds, used by {@link formatRelativeDate}. */
const timeUnitsInSeconds = Object.freeze({
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
  MONTH: 30 * 24 * 60 * 60,
  YEAR: 365 * 24 * 60 * 60,
});

/**
 * Formats a past date as a human-readable relative time string in Portuguese.
 *
 * Returns progressively coarser units (seconds → minutes → hours → days → weeks)
 * for dates within the last month. For dates older than one month, returns the
 * full date formatted in "pt-BR" locale (e.g. "1 de fevereiro de 2026").
 *
 * @param date - The past date to format
 * @param now - Optional reference date (defaults to `new Date()`). Useful for deterministic testing.
 * @returns The relative time string in Portuguese
 *
 * @example
 * // Assuming "now" is 2026-04-01T12:00:00Z
 * formatRelativeDate(new Date("2026-04-01T11:59:55Z"))  // "há 5 segundos"
 * formatRelativeDate(new Date("2026-04-01T11:00:00Z"))  // "há 1 hora"
 * formatRelativeDate(new Date("2026-02-01T12:00:00Z"))  // "1 de fevereiro de 2026"
 */
function formatRelativeDate(date: Date, now?: Date): string {
  const currentDate = now || new Date();
  const diffInSeconds = Math.floor(
    (currentDate.getTime() - date.getTime()) / 1000,
  );

  if (diffInSeconds < timeUnitsInSeconds.MINUTE) {
    return `há ${diffInSeconds} segundo${diffInSeconds === 1 ? "" : "s"}`;
  } else if (diffInSeconds < timeUnitsInSeconds.HOUR) {
    const minutes = Math.floor(diffInSeconds / timeUnitsInSeconds.MINUTE);
    return `há ${minutes} minuto${minutes === 1 ? "" : "s"}`;
  } else if (diffInSeconds < timeUnitsInSeconds.DAY) {
    const hours = Math.floor(diffInSeconds / timeUnitsInSeconds.HOUR);
    return `há ${hours} hora${hours === 1 ? "" : "s"}`;
  } else if (diffInSeconds < timeUnitsInSeconds.WEEK) {
    const days = Math.floor(diffInSeconds / timeUnitsInSeconds.DAY);
    return `há ${days} dia${days === 1 ? "" : "s"}`;
  } else if (diffInSeconds < timeUnitsInSeconds.MONTH) {
    const weeks = Math.floor(diffInSeconds / timeUnitsInSeconds.WEEK);
    return `há ${weeks} semana${weeks === 1 ? "" : "s"}`;
  } else {
    return Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }
}

/**
 * Checks whether a given date falls on a business day (Monday–Friday).
 *
 * **Note:** This only checks for weekends. Brazilian national holidays are
 * not considered — see future additions below.
 *
 * @param date - The date to check
 * @returns `true` if the date is Monday through Friday, `false` for Saturday/Sunday
 *
 * @example
 * isBusinessDay(new Date("2026-03-30"))  // true  (Monday)
 * isBusinessDay(new Date("2026-04-04"))  // false (Saturday)
 */
function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export { timeUnitsInSeconds, formatRelativeDate, isBusinessDay };

// Future additions:
// - isBrazilianHoliday(date: Date): boolean — check against fixed + movable national holidays (Carnaval, Páscoa, etc.)
// - isBusinessDayBR(date: Date): boolean — combines weekend + holiday check
// - addBusinessDays(date: Date, days: number): Date — advance N business days, skipping weekends (and holidays)
// - formatRelativeDateEN(date: Date, now?: Date): string — English version of formatRelativeDate

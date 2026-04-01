const timeUnitsInSeconds = Object.freeze({
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
  MONTH: 30 * 24 * 60 * 60,
  YEAR: 365 * 24 * 60 * 60,
});

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

function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export { timeUnitsInSeconds, formatRelativeDate, isBusinessDay };

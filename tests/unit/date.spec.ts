import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  formatRelativeDate,
  isBusinessDay,
  timeUnitsInSeconds,
} from "../../src/date";

describe("Format Relative Date", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    const fixedDate = new Date("2026-04-01T12:00:00Z");
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return 'há 5 segundos' for a date 5 seconds ago", () => {
    const date = new Date(Date.now() - 5 * 1000);
    expect(formatRelativeDate(date)).toBe("há 5 segundos");
  });

  it("should return 'há 30 segundos' for a date 30 seconds ago", () => {
    const date = new Date(Date.now() - 30 * 1000);
    expect(formatRelativeDate(date)).toBe("há 30 segundos");
  });

  it("should return 'há 1 minuto' for a date 1 minute ago", () => {
    const date = new Date(Date.now() - 1 * timeUnitsInSeconds.MINUTE * 1000);
    expect(formatRelativeDate(date)).toBe("há 1 minuto");
  });

  it("should return 'há 1 hora' for a date 1 hour ago", () => {
    const date = new Date(Date.now() - 1 * timeUnitsInSeconds.HOUR * 1000);
    expect(formatRelativeDate(date)).toBe("há 1 hora");
  });

  it("should return hours if the date is less than 1 day ago", () => {
    const date = new Date(Date.now() - 3 * timeUnitsInSeconds.HOUR * 1000);
    expect(formatRelativeDate(date)).toBe("há 3 horas");
  });

  it("should return 'há 6 dias' for a date 6 days ago", () => {
    const date = new Date(Date.now() - 6 * timeUnitsInSeconds.DAY * 1000);
    expect(formatRelativeDate(date)).toBe("há 6 dias");
  });

  it("should return days if the date is less than 1 week ago", () => {
    const date = new Date(Date.now() - 3 * timeUnitsInSeconds.DAY * 1000);
    expect(formatRelativeDate(date)).toBe("há 3 dias");
  });

  it("should return 'há 2 semanas' for a date 2 weeks ago", () => {
    const date = new Date(Date.now() - 2 * timeUnitsInSeconds.WEEK * 1000);
    expect(formatRelativeDate(date)).toBe("há 2 semanas");
  });

  it("should return weeks if the date is less than 1 month ago", () => {
    const date = new Date(Date.now() - 3 * timeUnitsInSeconds.WEEK * 1000);
    expect(formatRelativeDate(date)).toBe("há 3 semanas");
  });

  it("should return formatted date for a date more than 1 month ago", () => {
    const date = new Date("2026-02-01T12:00:00Z");
    expect(formatRelativeDate(date)).toBe("1 de fevereiro de 2026");
  });
});

describe("Is Business Day", () => {
  it("should return true for a Monday", () => {
    const monday = new Date("2026-03-30T12:00:00Z");
    expect(isBusinessDay(monday)).toBe(true);
  });

  it("should return false for a Sunday", () => {
    const sunday = new Date("2026-03-29");
    expect(isBusinessDay(sunday)).toBe(false);
  });

  it("should return false for a Saturday", () => {
    const saturday = new Date("2026-04-04T12:00:00Z");
    expect(isBusinessDay(saturday)).toBe(false);
  });
});

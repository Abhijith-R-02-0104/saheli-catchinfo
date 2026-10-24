import test from "node:test";
import assert from "node:assert/strict";

import {
  parseLocalDate,
  isValidDateOnly,
  formatLocalDate,
  getTodayLocalDate,
  addDays,
  daysBetween,
  compareDateOnly,
} from "./dates.js";

test("accepts valid dates and rejects invalid dates", () => {
  assert.equal(isValidDateOnly("2026-10-24"), true);
  assert.equal(isValidDateOnly("2024-02-29"), true);

  assert.equal(isValidDateOnly("2025-02-29"), false);
  assert.equal(isValidDateOnly("2026-02-30"), false);
  assert.equal(isValidDateOnly("24-10-2026"), false);
  assert.equal(isValidDateOnly("not-a-date"), false);
});

test("parses a date using local calendar components", () => {
  const date = parseLocalDate("2026-10-24");

  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 9);
  assert.equal(date.getDate(), 24);
});

test("formats a local date without shifting the day", () => {
  const localDate = new Date(2026, 9, 24, 23, 59);

  assert.equal(formatLocalDate(localDate), "2026-10-24");
});

test("gets today's date from the local calendar", () => {
  const localDate = new Date(2026, 9, 24, 23, 59);

  assert.equal(getTodayLocalDate(localDate), "2026-10-24");
});

test("adds days across month, year and leap-year boundaries", () => {
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2024-03-01", -1), "2024-02-29");
});

test("calculates calendar-day differences in both directions", () => {
  assert.equal(daysBetween("2026-10-23", "2026-10-24"), 1);
  assert.equal(daysBetween("2026-10-24", "2026-10-23"), -1);
  assert.equal(daysBetween("2026-10-24", "2026-10-24"), 0);
});

test("compares date-only strings correctly", () => {
  assert.equal(compareDateOnly("2026-10-23", "2026-10-24"), -1);
  assert.equal(compareDateOnly("2026-10-24", "2026-10-24"), 0);
  assert.equal(compareDateOnly("2026-10-25", "2026-10-24"), 1);
});

test("rejects invalid inputs to date arithmetic", () => {
  assert.throws(() => addDays("2026-02-30", 1));
  assert.throws(() => addDays("2026-10-24", 1.5));
  assert.throws(() => daysBetween("invalid", "2026-10-24"));
});

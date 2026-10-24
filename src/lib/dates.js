const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parse a YYYY-MM-DD date into a local Date object.
 * Noon is used to reduce problems around daylight-saving transitions.
 * The returned Date is temporary; saved dates remain plain strings.
 */
export function parseLocalDate(dateString) {
  if (typeof dateString !== "string") {
    throw new Error("Date must be a string in YYYY-MM-DD format.");
  }

  const match = DATE_PATTERN.exec(dateString);

  if (!match) {
    throw new Error("Date must use YYYY-MM-DD format.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error("Invalid calendar date.");
  }

  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  // JavaScript normalises invalid dates, so verify the components.
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    throw new Error("Invalid calendar date.");
  }

  return date;
}

/**
 * Check whether a string represents a valid YYYY-MM-DD calendar date.
 */
export function isValidDateOnly(dateString) {
  try {
    parseLocalDate(dateString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format a Date object using local calendar components.
 * Never uses toISOString(), which can shift the calendar date.
 */
export function formatLocalDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("A valid Date object is required.");
  }

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in the device's local calendar.
 */
export function getTodayLocalDate(now = new Date()) {
  return formatLocalDate(now);
}

/**
 * Add a whole number of calendar days to a YYYY-MM-DD date.
 * Negative numbers move backwards.
 */
export function addDays(dateString, numberOfDays) {
  if (!Number.isInteger(numberOfDays)) {
    throw new Error("The number of days must be an integer.");
  }

  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + numberOfDays);

  return formatLocalDate(date);
}

/**
 * Return the number of calendar days from startDate to endDate.
 * For example, daysBetween("2026-10-23", "2026-10-24") returns 1.
 */
export function daysBetween(startDate, endDate) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

/**
 * Compare two YYYY-MM-DD strings.
 * Returns -1 if a is earlier, 0 if equal, and 1 if a is later.
 */
export function compareDateOnly(a, b) {
  return Math.sign(daysBetween(b, a));
}

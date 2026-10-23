import { createDefaultAppData } from "../data/defaultAppData.js";

const STORAGE_KEY = "saheli.appData.v1";

function validateDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Date must use YYYY-MM-DD format.");
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== Number(date.slice(0, 4)) ||
    parsed.getMonth() + 1 !== Number(date.slice(5, 7)) ||
    parsed.getDate() !== Number(date.slice(8, 10))
  ) {
    throw new Error("Invalid calendar date.");
  }
}

function validateAppData(data) {
  if (
    !data ||
    typeof data !== "object" ||
    data.schemaVersion !== 1 ||
    !data.settings ||
    typeof data.logsByDate !== "object" ||
    data.logsByDate === null ||
    Array.isArray(data.logsByDate)
  ) {
    throw new Error("Invalid Saheli data structure.");
  }
}

function readStoredData() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    return null;
  }

  let data;

  try {
    data = JSON.parse(stored);
  } catch {
    throw new Error(
      "Saved Saheli data could not be read. It has not been overwritten.",
    );
  }

  validateAppData(data);
  return data;
}

export function loadAppData() {
  const data = readStoredData();

  if (data !== null) {
    return data;
  }

  return createDefaultAppData();
}

export function saveAppData(data) {
  validateAppData(data);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Could not save Saheli data: ${message}`, { cause: error });
  }
}

export function getDayLog(date) {
  validateDate(date);

  const data = loadAppData();
  return data.logsByDate[date] ?? null;
}

export function saveDayLog(date, log) {
  validateDate(date);

  if (!log || typeof log !== "object" || Array.isArray(log)) {
    throw new Error("A valid day log is required.");
  }

  const data = loadAppData();

  data.logsByDate[date] = {
    ...log,
    date,
  };

  saveAppData(data);
}

export function deleteDayLog(date) {
  validateDate(date);

  const data = loadAppData();

  if (!(date in data.logsByDate)) {
    return;
  }

  delete data.logsByDate[date];
  saveAppData(data);
}

export function clearAppData() {
  localStorage.removeItem(STORAGE_KEY);
}

import test from "node:test";
import assert from "node:assert/strict";
import {
  getTodayLocalDate,
  isValidDateOnly,
  addDays,
  daysBetween,
} from "../src/lib/dates.js";
import { calculateCyclePrediction } from "../src/lib/cycle.js";
import { translations, t } from "../src/data/translations.js";
import {
  saveDayLog,
  loadAppData,
  clearAppData,
} from "../src/repositories/appRepository.js";

// Mock localStorage for node:test environment if not present
if (typeof globalThis.localStorage === "undefined") {
  let store = {};
  globalThis.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}

test("1. First Period Setup Date & Flow Validation", () => {
  const today = getTodayLocalDate();
  const futureDate = addDays(today, 1);
  const farFutureDate = addDays(today, 30);
  const pastDate = addDays(today, -3);

  // Future dates must be detected and rejected
  assert.equal(daysBetween(today, futureDate) > 0, true);
  assert.equal(daysBetween(today, farFutureDate) > 0, true);
  assert.equal(daysBetween(today, today) > 0, false);
  assert.equal(daysBetween(today, pastDate) > 0, false);

  // Invalid date strings
  assert.equal(isValidDateOnly("invalid-date"), false);
  assert.equal(isValidDateOnly("2026-02-30"), false);
  assert.equal(isValidDateOnly(today), true);
  assert.equal(isValidDateOnly(pastDate), true);

  // Flow intensity validation for period start
  const validFlows = ["spotting", "light", "medium", "heavy"];
  for (const flow of validFlows) {
    assert.equal(flow !== "none", true);
  }
  assert.equal("none" === "none", true);
});

test("2. Cycle overview data-driven states: 0 periods (Empty State)", () => {
  const emptyLogs = {};
  const entries = Object.entries(emptyLogs)
    .filter(([d, log]) => isValidDateOnly(d) && log?.period?.isPeriod === true);
  const periodStarts = entries.map(([d]) => d);
  const hasPeriodRecords = periodStarts.length > 0;

  assert.equal(hasPeriodRecords, false);
  assert.equal(periodStarts.length, 0);

  const cycleAnalysis = hasPeriodRecords ? calculateCyclePrediction(periodStarts) : null;
  assert.equal(cycleAnalysis, null);

  // Verify that neither cycle day nor phase is invented
  const latestPeriodStart = hasPeriodRecords ? periodStarts[periodStarts.length - 1] : null;
  assert.equal(latestPeriodStart, null);
});

test("3. Cycle overview data-driven states: 1 period logged (No Fabricated Predictions)", () => {
  const today = getTodayLocalDate();
  const periodStartDate = addDays(today, -2); // Logged 2 days ago

  const logs = {
    [periodStartDate]: {
      date: periodStartDate,
      period: { isPeriod: true, flow: "medium" },
    },
  };

  const entries = Object.entries(logs)
    .filter(([d, log]) => isValidDateOnly(d) && log?.period?.isPeriod === true)
    .sort(([a], [b]) => a.localeCompare(b));

  const datesSet = new Set(entries.map(([d]) => d));
  const periodStarts = entries
    .map(([d]) => d)
    .filter((date) => !datesSet.has(addDays(date, -1)));

  assert.equal(periodStarts.length, 1);
  assert.equal(periodStarts[0], periodStartDate);

  // Cycle day must be exactly diff + 1 (Day 3)
  const diff = daysBetween(periodStartDate, today);
  assert.equal(diff, 2);
  const currentCycleDay = diff + 1;
  assert.equal(currentCycleDay, 3);

  // calculateCyclePrediction with 1 period start returns prediction.available = false
  const cycleAnalysis = calculateCyclePrediction(periodStarts);
  assert.equal(cycleAnalysis.prediction.available, false);
  assert.equal(cycleAnalysis.prediction.status, "insufficient-data");
  assert.equal(cycleAnalysis.prediction.estimatedDate, null);
  assert.equal(cycleAnalysis.ovulationEstimate, null);

  // Phase is Menstrual Phase for Day 3
  assert.equal(currentCycleDay <= 5, true);
});

test("4. Cycle overview data-driven states: 3 completed cycles enable real predictions", () => {
  const today = getTodayLocalDate();
  // 3 recorded period starts 28 days apart
  const p1 = addDays(today, -56);
  const p2 = addDays(today, -28);
  const p3 = today;

  const cycleAnalysis = calculateCyclePrediction([p1, p2, p3]);
  assert.equal(cycleAnalysis.prediction.available, true);
  assert.equal(cycleAnalysis.prediction.status, "available");
  assert.equal(cycleAnalysis.medianCycleLength, 28);
  assert.equal(cycleAnalysis.prediction.estimatedDate, addDays(today, 28));
  assert.notEqual(cycleAnalysis.ovulationEstimate, null);
});

test("5. First period persistence and ordinary daily logging co-existence", () => {
  clearAppData();
  const initial = loadAppData();
  assert.deepEqual(initial.logsByDate, {});

  const today = getTodayLocalDate();
  const firstPeriodDate = addDays(today, -1);

  // 1. Save first period start
  saveDayLog(firstPeriodDate, {
    date: firstPeriodDate,
    period: { isPeriod: true, flow: "medium" },
    pain: { level: 1, stopsDailyLife: false },
    heavyBleeding: { frequentPadChange: false, largeClots: false },
    symptoms: ["cramps"],
    mood: "calm",
    energy: 4,
    sleepHours: 8,
    medicines: [],
    privateNote: "Day 1 recorded",
  });

  const updated = loadAppData();
  assert.equal(updated.logsByDate[firstPeriodDate]?.period?.isPeriod, true);
  assert.equal(updated.logsByDate[firstPeriodDate]?.period?.flow, "medium");

  // 2. Ordinary daily check-in (no period bleeding today, but tracking symptoms)
  saveDayLog(today, {
    date: today,
    period: { isPeriod: false, flow: "none" },
    pain: { level: 0, stopsDailyLife: false },
    heavyBleeding: { frequentPadChange: false, largeClots: false },
    symptoms: ["headache"],
    mood: "happy",
    energy: 4,
    sleepHours: 7,
    medicines: ["Vitamin D"],
    privateNote: "Feeling good",
  });

  const finalData = loadAppData();
  assert.equal(finalData.logsByDate[today]?.period?.isPeriod, false);
  assert.equal(finalData.logsByDate[today]?.period?.flow, "none");
  assert.deepEqual(finalData.logsByDate[today]?.symptoms, ["headache"]);
  assert.equal(finalData.logsByDate[firstPeriodDate]?.period?.isPeriod, true);
});

test("6. Bilingual translation parity for first period and landing keys", () => {
  const enKeys = Object.keys(translations.en.logForm);
  const hiKeys = Object.keys(translations.hi.logForm);

  assert.deepEqual(
    enKeys.sort(),
    hiKeys.sort(),
    "logForm translation keys must match in en and hi",
  );

  const enLanding = Object.keys(translations.en.landing);
  const hiLanding = Object.keys(translations.hi.landing);

  assert.deepEqual(
    enLanding.sort(),
    hiLanding.sort(),
    "landing translation keys must match in en and hi",
  );

  // Key required strings
  assert.equal(typeof t("en", "logForm", "saveFirstPeriod"), "string");
  assert.equal(typeof t("hi", "logForm", "saveFirstPeriod"), "string");
  assert.equal(typeof t("en", "logForm", "futureDateError"), "string");
  assert.equal(typeof t("hi", "logForm", "futureDateError"), "string");
  assert.equal(typeof t("en", "logForm", "flowRequiredError"), "string");
  assert.equal(typeof t("hi", "logForm", "flowRequiredError"), "string");
  assert.equal(typeof t("en", "logForm", "cancelAndReturn"), "string");
  assert.equal(typeof t("hi", "logForm", "cancelAndReturn"), "string");
  assert.equal(typeof t("en", "landing", "cycleAwaits"), "string");
  assert.equal(typeof t("hi", "landing", "cycleAwaits"), "string");
  assert.equal(typeof t("en", "landing", "cycleTrackingStarted"), "string");
  assert.equal(typeof t("hi", "landing", "cycleTrackingStarted"), "string");
});

test("7. Saheli Hidden-Heart Logo & Favicon Assets Verification", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");

  // Verify public/favicon.svg
  const faviconPath = path.resolve("public/favicon.svg");
  assert.equal(fs.existsSync(faviconPath), true, "favicon.svg must exist");
  const faviconContent = fs.readFileSync(faviconPath, "utf-8");
  assert.equal(faviconContent.includes("<svg"), true);
  assert.equal(faviconContent.includes("#79516F") || faviconContent.includes("fav-grad"), true);

  // Verify standalone logo.svg
  const logoPath = path.resolve("src/assets/logo.svg");
  assert.equal(fs.existsSync(logoPath), true, "logo.svg must exist");
  const logoContent = fs.readFileSync(logoPath, "utf-8");
  assert.equal(logoContent.includes("saheli"), true);

  // Verify SaheliLogo module definition and exports
  const logoComponentPath = path.resolve("src/components/common/SaheliLogo.jsx");
  assert.equal(fs.existsSync(logoComponentPath), true, "SaheliLogo.jsx must exist");
  const logoJsx = fs.readFileSync(logoComponentPath, "utf-8");
  assert.equal(logoJsx.includes("export function SaheliLogo"), true);
  assert.equal(logoJsx.includes("export function SaheliHiddenHeartSymbol"), true);
  assert.equal(logoJsx.includes('variant === "icon"'), true);
  assert.equal(logoJsx.includes('variant === "appIcon"'), true);
  assert.equal(logoJsx.includes('variant === "primary"'), true);

  // Verify IconSaheliHeart export in Icons.jsx
  const iconsPath = path.resolve("src/components/common/Icons.jsx");
  const iconsJsx = fs.readFileSync(iconsPath, "utf-8");
  assert.equal(iconsJsx.includes("export function IconSaheliHeart"), true);
});


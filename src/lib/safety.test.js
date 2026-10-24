import test from "node:test";
import assert from "node:assert/strict";

import { addDays } from "./dates.js";
import { evaluateSafety } from "./safety.js";

function makeAppData({ ageGroup = "18plus", pregnancyEnabled = false } = {}) {
  return {
    schemaVersion: 1,
    settings: { ageGroup },
    pregnancy: { enabled: pregnancyEnabled },
    confirmedLongCycleEndDates: [],
    logsByDate: {},
  };
}

function setLog(data, date, overrides = {}) {
  const { period, pain, symptoms, mood, ...otherFields } = overrides;

  data.logsByDate[date] = {
    date,
    period: {
      isPeriod: false,
      flow: "light",
      changePadEvery1To2Hours: false,
      largeClots: false,
      ...period,
    },
    pain: {
      level: 0,
      stopsDailyLife: false,
      notHelpedByPainkillers: false,
      ...pain,
    },
    symptoms: symptoms ?? [],
    mood: mood ?? "okay",
    ...otherFields,
  };
}

function addPeriodDays(data, start, duration, overrides = {}) {
  for (let offset = 0; offset < duration; offset += 1) {
    setLog(data, addDays(start, offset), {
      period: {
        isPeriod: true,
        flow: "medium",
        ...overrides.period,
      },
      ...overrides,
    });
  }
}

function addPeriodStarts(data, start, intervals) {
  const starts = [start];

  for (const interval of intervals) {
    starts.push(addDays(starts.at(-1), interval));
  }

  for (const date of starts) {
    setLog(data, date, {
      period: {
        isPeriod: true,
        flow: "medium",
      },
    });
  }

  return starts;
}

function hasDoctorFinding(result, id) {
  return result.doctorFindings.some((finding) => finding.ruleId === id);
}

function hasUrgentFinding(result, id) {
  return result.urgentFindings.some((finding) => finding.ruleId === id);
}

test("period lasting eight logged days triggers guidance with exact dates", () => {
  const data = makeAppData();

  addPeriodDays(data, "2026-01-01", 8);

  const result = evaluateSafety(data, {
    today: "2026-01-10",
  });

  const finding = result.doctorFindings.find(
    (item) => item.ruleId === "prolonged-period",
  );

  assert.ok(finding);
  assert.equal(finding.observedDays, 8);
  assert.equal(finding.dates.length, 8);
  assert.equal(finding.dates[0], "2026-01-01");
  assert.equal(finding.dates.at(-1), "2026-01-08");
});

test("pad-change and large-clot reports trigger heavy-bleeding guidance", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    period: {
      isPeriod: true,
      changePadEvery1To2Hours: true,
    },
  });

  setLog(data, "2026-01-02", {
    period: {
      isPeriod: true,
      largeClots: true,
    },
  });

  const result = evaluateSafety(data, {
    today: "2026-01-03",
  });

  assert.ok(hasDoctorFinding(result, "heavy-bleeding-indicators"));
});

test("three consecutive adult cycles longer than 35 days trigger guidance", () => {
  const data = makeAppData({ ageGroup: "18plus" });
  const starts = addPeriodStarts(data, "2026-01-01", [36, 36, 36]);

  const result = evaluateSafety(data, {
    today: addDays(starts.at(-1), 1),
  });

  assert.ok(hasDoctorFinding(result, "repeated-out-of-range-cycles"));
});

test("three consecutive under-18 cycles longer than 45 days trigger guidance", () => {
  const data = makeAppData({ ageGroup: "under18" });
  const starts = addPeriodStarts(data, "2026-01-01", [46, 46, 46]);

  const result = evaluateSafety(data, {
    today: addDays(starts.at(-1), 1),
  });

  assert.ok(hasDoctorFinding(result, "repeated-out-of-range-cycles"));
});

test("short cycles are checked against the correct age-group threshold", () => {
  const data = makeAppData({ ageGroup: "18plus" });
  const starts = addPeriodStarts(data, "2026-01-01", [20, 20, 20]);

  const result = evaluateSafety(data, {
    today: addDays(starts.at(-1), 1),
  });

  assert.ok(hasDoctorFinding(result, "repeated-out-of-range-cycles"));
});

test("90 days without a period triggers guidance when not pregnant", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    period: { isPeriod: true },
  });

  const result = evaluateSafety(data, {
    today: addDays("2026-01-01", 90),
  });

  assert.ok(hasDoctorFinding(result, "no-period-90-days"));
});

test("90-day absence rule is paused in pregnancy mode", () => {
  const data = makeAppData({ pregnancyEnabled: true });

  setLog(data, "2026-01-01", {
    period: { isPeriod: true },
  });

  const result = evaluateSafety(data, {
    today: addDays("2026-01-01", 90),
  });

  assert.equal(hasDoctorFinding(result, "no-period-90-days"), false);
});

test("bleeding between periods and after sex are separately reported", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    bleedingBetweenPeriods: true,
  });

  setLog(data, "2026-01-03", {
    bleedingAfterSex: true,
  });

  const result = evaluateSafety(data, {
    today: "2026-01-04",
  });

  assert.ok(hasDoctorFinding(result, "bleeding-between-periods"));

  assert.ok(hasDoctorFinding(result, "bleeding-after-sex"));
});

test("pain affecting daily life or not relieved by painkillers triggers guidance", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    pain: { stopsDailyLife: true },
  });

  setLog(data, "2026-01-02", {
    pain: { notHelpedByPainkillers: true },
  });

  const result = evaluateSafety(data, {
    today: "2026-01-03",
  });

  assert.ok(hasDoctorFinding(result, "pain-affecting-daily-life"));
});

test("heavy bleeding with fatigue triggers additional guidance", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    period: { isPeriod: true, flow: "heavy" },
    symptoms: ["fatigue"],
  });

  const result = evaluateSafety(data, {
    today: "2026-01-02",
  });

  assert.ok(hasDoctorFinding(result, "heavy-bleeding-with-systemic-symptoms"));
});

test("an explicitly reported sudden severe pain is urgent", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    urgentSignals: {
      suddenSevereLowerBellyPain: true,
    },
  });

  const result = evaluateSafety(data, {
    today: "2026-01-01",
  });

  assert.ok(hasUrgentFinding(result, "sudden-severe-lower-belly-pain"));

  assert.deepEqual(result.urgentFindings[0].emergencyNumbers, ["112", "108"]);
});

test("heavy bleeding with dizziness triggers urgent guidance", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    period: { isPeriod: true, flow: "heavy" },
    symptoms: ["dizziness"],
  });

  const result = evaluateSafety(data, {
    today: "2026-01-01",
  });

  assert.ok(hasUrgentFinding(result, "heavy-bleeding-with-fainting"));
});

test("very low mood on three consecutive days shows Tele-MANAS", () => {
  const data = makeAppData();

  for (let day = 1; day <= 3; day += 1) {
    setLog(data, `2026-01-0${day}`, {
      mood: "veryLow",
    });
  }

  const result = evaluateSafety(data, {
    today: "2026-01-03",
  });

  const support = result.mentalHealthSupport.find(
    (item) => item.id === "very-low-mood-streak",
  );

  assert.ok(support);
  assert.equal(support.helplineNumber, "14416");
});

test("self-harm concern shows Tele-MANAS even without period logs", () => {
  const data = makeAppData();

  const result = evaluateSafety(data, {
    today: "2026-01-01",
    selfHarmConcern: true,
  });

  const support = result.mentalHealthSupport.find(
    (item) => item.id === "self-harm-concern",
  );

  assert.ok(support);
  assert.equal(support.helplineNumber, "14416");
});

test("self-reported warning signs can be surfaced separately", () => {
  const data = makeAppData();

  const result = evaluateSafety(data, {
    today: "2026-01-01",
    selfReportedFlags: {
      "no-first-period-by-15": true,
    },
  });

  assert.equal(result.selfReportedGuidance.length, 3);

  assert.ok(
    result.doctorFindings.some(
      (finding) => finding.ruleId === "no-first-period-by-15",
    ),
  );
});

test("urgent findings are returned ahead of ordinary findings", () => {
  const data = makeAppData();

  setLog(data, "2026-01-01", {
    urgentSignals: {
      suddenSevereLowerBellyPain: true,
    },
    pain: { stopsDailyLife: true },
  });

  const result = evaluateSafety(data, {
    today: "2026-01-01",
  });

  assert.equal(result.findings[0].severity, "urgent");
});

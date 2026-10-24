import { APP_CONFIG } from "../config.js";

import {
  RED_FLAG_RULES,
  SELF_REPORTED_RED_FLAGS,
  URGENT_RED_FLAGS,
} from "../data/redflags.js";

import {
  addDays,
  daysBetween,
  getTodayLocalDate,
  isValidDateOnly,
} from "./dates.js";

import { calculateCyclePrediction } from "./cycle.js";

const RULES_BY_ID = new Map(
  [...RED_FLAG_RULES, ...SELF_REPORTED_RED_FLAGS, ...URGENT_RED_FLAGS].map(
    (rule) => [rule.id, rule],
  ),
);

const TELE_MANAS_SOURCE = {
  name: "Ministry of Health and Family Welfare — National Mental Health Programme",
  url: "https://dghs.mohfw.gov.in/national-mental-health-programme.php",
};

function getEntries(appData) {
  const logs = appData?.logsByDate ?? {};

  return Object.entries(logs)
    .filter(
      ([date, log]) =>
        isValidDateOnly(date) &&
        log !== null &&
        typeof log === "object" &&
        !Array.isArray(log),
    )
    .map(([date, log]) => ({ date, log }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function makeFinding(rule, dates = [], details = {}) {
  return {
    id: rule.id,
    ruleId: rule.id,
    severity: rule.severity ?? "doctor",
    dates: [...new Set(dates)].sort(),
    titleKey: rule.titleKey,
    noticedKey: rule.noticedKey,
    whyKey: rule.whyKey,
    nextStepKey: rule.nextStepKey,
    sources: rule.sources ?? [],
    ...details,
  };
}

function consecutiveDateRuns(dates) {
  const sortedDates = [...new Set(dates)].sort();
  const runs = [];
  let currentRun = [];

  for (const date of sortedDates) {
    const previousDate = currentRun.at(-1);

    if (previousDate !== undefined && daysBetween(previousDate, date) === 1) {
      currentRun.push(date);
    } else {
      if (currentRun.length > 0) {
        runs.push(currentRun);
      }

      currentRun = [date];
    }
  }

  if (currentRun.length > 0) {
    runs.push(currentRun);
  }

  return runs;
}

function getPeriodDates(entries) {
  return entries
    .filter(({ log }) => log.period?.isPeriod === true)
    .map(({ date }) => date);
}

function getPeriodStarts(periodDates) {
  const activeDates = new Set(periodDates);

  return periodDates.filter((date) => !activeDates.has(addDays(date, -1)));
}

function normalizeToken(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getSymptoms(log) {
  return new Set(
    (Array.isArray(log.symptoms) ? log.symptoms : []).map(normalizeToken),
  );
}

function hasAnySymptom(log, acceptedSymptoms) {
  const symptoms = getSymptoms(log);

  return acceptedSymptoms.some((symptom) =>
    symptoms.has(normalizeToken(symptom)),
  );
}

function hasHeavyBleedingIndicators(log) {
  return (
    log.period?.changePadEvery1To2Hours === true ||
    log.period?.largeClots === true ||
    log.changePadEvery1To2Hours === true ||
    log.largeClots === true
  );
}

function isHeavyBleeding(log) {
  return log.period?.flow === "heavy" || hasHeavyBleedingIndicators(log);
}

function getCycleThresholds(ageGroup) {
  if (ageGroup === "under18") {
    return {
      minimum: APP_CONFIG.health.under18CycleLengthMinDays,
      maximum: APP_CONFIG.health.under18CycleLengthMaxDays,
    };
  }

  if (
    ["18plus", "adult", "18-and-over", "18 and over", "18+"].includes(ageGroup)
  ) {
    return {
      minimum: APP_CONFIG.health.adultCycleLengthMinDays,
      maximum: APP_CONFIG.health.adultCycleLengthMaxDays,
    };
  }

  return null;
}

/**
 * Evaluate health-related warning conditions from saved logs.
 *
 * This function does not diagnose medical conditions.
 * It returns findings for the UI to explain in plain language.
 *
 * Log fields understood by this evaluator include:
 * - period.isPeriod
 * - period.flow
 * - period.changePadEvery1To2Hours
 * - period.largeClots
 * - pain.stopsDailyLife
 * - pain.notHelpedByPainkillers
 * - symptoms: array of symptom IDs
 * - mood: "veryLow" for the repeated low-mood rule
 * - bleedingBetweenPeriods
 * - bleedingAfterSex
 * - urgentSignals: object with the signal IDs in redflags.js
 */
export function evaluateSafety(
  appData,
  {
    today = getTodayLocalDate(),
    selfHarmConcern = false,
    selfReportedFlags = {},
  } = {},
) {
  if (!isValidDateOnly(today)) {
    throw new Error("today must be a valid YYYY-MM-DD date.");
  }

  const entries = getEntries(appData);
  const periodDates = getPeriodDates(entries);
  const periodRuns = consecutiveDateRuns(periodDates);
  const periodStartDates = getPeriodStarts(periodDates);

  const urgentFindings = [];
  const doctorFindings = [];
  const mentalHealthSupport = [];

  function addDoctorFinding(ruleId, dates, details = {}) {
    const rule = RULES_BY_ID.get(ruleId);

    if (rule) {
      doctorFindings.push(makeFinding(rule, dates, details));
    }
  }

  // 1. Periods lasting longer than the configured threshold.
  for (const run of periodRuns) {
    if (run.length > APP_CONFIG.health.prolongedPeriodDays) {
      addDoctorFinding("prolonged-period", run, {
        observedDays: run.length,
        periodStart: run[0],
        periodEnd: run.at(-1),
      });
    }
  }

  // 2. User-reported heavy-bleeding indicators.
  const heavyIndicatorDates = entries
    .filter(({ log }) => hasHeavyBleedingIndicators(log))
    .map(({ date }) => date);

  if (heavyIndicatorDates.length > 0) {
    addDoctorFinding("heavy-bleeding-indicators", heavyIndicatorDates, {
      padChangeIntervalHours: APP_CONFIG.health.padChangeIntervalHours,
    });
  }

  // 3. Repeated out-of-range cycles.
  // Unconfirmed suspicious gaps break the consecutive-cycle run.
  const thresholds = getCycleThresholds(appData?.settings?.ageGroup);

  const cycleAnalysis = calculateCyclePrediction(periodStartDates, {
    confirmedLongCycleEndDates: appData?.confirmedLongCycleEndDates ?? [],
  });

  if (thresholds) {
    const qualifyingRuns = [];
    let currentRun = [];

    function finishCycleRun() {
      if (
        currentRun.length >=
        APP_CONFIG.health.consecutiveIrregularCyclesForGuidance
      ) {
        qualifyingRuns.push(currentRun);
      }

      currentRun = [];
    }

    for (const interval of cycleAnalysis.cycleIntervals) {
      if (interval.suspectedMissedLog || !interval.countedForPrediction) {
        finishCycleRun();
        continue;
      }

      const isOutOfRange =
        interval.lengthDays < thresholds.minimum ||
        interval.lengthDays > thresholds.maximum;

      if (isOutOfRange) {
        currentRun.push(interval);
      } else {
        finishCycleRun();
      }
    }

    finishCycleRun();

    for (const run of qualifyingRuns) {
      const dates = run.flatMap((interval) => [
        interval.startDate,
        interval.endDate,
      ]);

      addDoctorFinding("repeated-out-of-range-cycles", dates, {
        cycleRanges: run.map((interval) => ({
          startDate: interval.startDate,
          endDate: interval.endDate,
          lengthDays: interval.lengthDays,
        })),
        minimumDays: thresholds.minimum,
        maximumDays: thresholds.maximum,
      });
    }
  }

  // 4. No period for 90 days when pregnancy mode is not enabled.
  const lastPeriodStart = periodStartDates.at(-1);

  if (lastPeriodStart && appData?.pregnancy?.enabled !== true) {
    const daysSinceLastPeriod = daysBetween(lastPeriodStart, today);

    if (daysSinceLastPeriod >= APP_CONFIG.health.noPeriodDays) {
      addDoctorFinding("no-period-90-days", [lastPeriodStart, today], {
        daysSinceLastPeriod,
      });
    }
  }

  // 5. Bleeding between periods or after sex.
  const bleedingBetweenDates = entries
    .filter(
      ({ log }) =>
        log.bleedingBetweenPeriods === true ||
        getSymptoms(log).has("bleedingbetweenperiods"),
    )
    .map(({ date }) => date);

  if (bleedingBetweenDates.length > 0) {
    addDoctorFinding("bleeding-between-periods", bleedingBetweenDates);
  }

  const bleedingAfterSexDates = entries
    .filter(
      ({ log }) =>
        log.bleedingAfterSex === true ||
        getSymptoms(log).has("bleedingaftersex"),
    )
    .map(({ date }) => date);

  if (bleedingAfterSexDates.length > 0) {
    addDoctorFinding("bleeding-after-sex", bleedingAfterSexDates);
  }

  // 6. Pain that interferes with daily life or is not relieved.
  const disablingPainDates = entries
    .filter(
      ({ log }) =>
        log.pain?.stopsDailyLife === true ||
        log.pain?.notHelpedByPainkillers === true,
    )
    .map(({ date }) => date);

  if (disablingPainDates.length > 0) {
    addDoctorFinding("pain-affecting-daily-life", disablingPainDates);
  }

  // 7. Heavy bleeding with fatigue, breathlessness or dizziness.
  const heavyEntries = entries.filter(({ log }) => isHeavyBleeding(log));

  const systemicSymptomEntries = entries.filter(({ log }) =>
    hasAnySymptom(log, [
      "fatigue",
      "tiredness",
      "breathlessness",
      "shortnessOfBreath",
      "dizziness",
    ]),
  );

  const heavyWithSystemicDates = new Set();

  for (const heavy of heavyEntries) {
    for (const symptomatic of systemicSymptomEntries) {
      if (Math.abs(daysBetween(heavy.date, symptomatic.date)) <= 2) {
        heavyWithSystemicDates.add(heavy.date);
        heavyWithSystemicDates.add(symptomatic.date);
      }
    }
  }

  if (heavyWithSystemicDates.size > 0) {
    addDoctorFinding(
      "heavy-bleeding-with-systemic-symptoms",
      [...heavyWithSystemicDates].sort(),
    );
  }

  // 8. Urgent signs. These findings must be displayed before
  // ordinary doctor-guidance cards.
  const urgentDatesByRule = new Map(
    URGENT_RED_FLAGS.map((rule) => [rule.id, new Set()]),
  );

  for (const { date, log } of entries) {
    const signals = log.urgentSignals ?? {};

    for (const rule of URGENT_RED_FLAGS) {
      if (
        signals[rule.signal] === true ||
        log[rule.signal] === true ||
        (rule.signal === "suddenSevereLowerBellyPain" &&
          log.pain?.suddenSevereLowerBellyPain === true)
      ) {
        urgentDatesByRule.get(rule.id).add(date);
      }
    }
  }

  // Heavy bleeding with dizziness/fainting is urgent even when
  // the logger did not explicitly set the urgent signal.
  const dizzyEntries = entries.filter(({ log }) =>
    hasAnySymptom(log, ["dizziness", "dizzy", "fainting", "faint"]),
  );

  for (const heavy of heavyEntries) {
    for (const dizzy of dizzyEntries) {
      if (Math.abs(daysBetween(heavy.date, dizzy.date)) <= 1) {
        const dates = urgentDatesByRule.get("heavy-bleeding-with-fainting");

        dates.add(heavy.date);
        dates.add(dizzy.date);
      }
    }
  }

  for (const rule of URGENT_RED_FLAGS) {
    const dates = [...urgentDatesByRule.get(rule.id)].sort();

    if (dates.length > 0) {
      urgentFindings.push(
        makeFinding(rule, dates, {
          emergencyNumbers: rule.emergencyNumbers ?? [],
        }),
      );
    }
  }

  // 9. Very low mood on consecutive days.
  const veryLowMoodDates = entries
    .filter(({ log }) =>
      ["verylow", "verylowmood"].includes(normalizeToken(log.mood)),
    )
    .map(({ date }) => date);

  const veryLowMoodRuns = consecutiveDateRuns(veryLowMoodDates).filter(
    (run) => run.length >= APP_CONFIG.health.veryLowMoodConsecutiveDays,
  );

  if (veryLowMoodRuns.length > 0) {
    mentalHealthSupport.push({
      id: "very-low-mood-streak",
      severity: "support",
      dates: veryLowMoodRuns.at(-1),
      titleKey: "mentalHealth.veryLowMood.title",
      noticedKey: "mentalHealth.veryLowMood.noticed",
      whyKey: "mentalHealth.veryLowMood.why",
      nextStepKey: "mentalHealth.teleManas.nextStep",
      helplineName: "Tele-MANAS",
      helplineNumber: "14416",
      sources: [TELE_MANAS_SOURCE],
    });
  }

  // 10. If the Ask screen identifies self-harm concerns, show
  // mental-health support without relying on the period logs.
  if (selfHarmConcern === true) {
    mentalHealthSupport.push({
      id: "self-harm-concern",
      severity: "support",
      dates: [today],
      titleKey: "mentalHealth.selfHarm.title",
      noticedKey: "mentalHealth.selfHarm.noticed",
      whyKey: "mentalHealth.selfHarm.why",
      nextStepKey: "mentalHealth.teleManas.nextStep",
      helplineName: "Tele-MANAS",
      helplineNumber: "14416",
      sources: [TELE_MANAS_SOURCE],
    });
  }

  // 11. Signs that cannot be inferred reliably from daily logs.
  const selfReportedFindings = SELF_REPORTED_RED_FLAGS.filter(
    (rule) => selfReportedFlags[rule.id] === true,
  ).map((rule) =>
    makeFinding(rule, [today], {
      reportedByUser: true,
    }),
  );

  doctorFindings.push(...selfReportedFindings);

  return {
    urgentFindings,
    doctorFindings,
    mentalHealthSupport,
    selfReportedGuidance: SELF_REPORTED_RED_FLAGS,
    findings: [...urgentFindings, ...doctorFindings, ...mentalHealthSupport],
    needsAgeGroupSelection: thresholds === null,
  };
}
export { evaluateSafety as evaluateHealthSafety };

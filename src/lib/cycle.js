import { APP_CONFIG } from "../config.js";

import { addDays, daysBetween, isValidDateOnly } from "./dates.js";

const PREGNANCY_WARNING =
  "This is an estimate. It can't be used to prevent pregnancy.";

function median(values) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }

  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function normalizePeriodStarts(periodStartDates) {
  if (!Array.isArray(periodStartDates)) {
    throw new Error("Period start dates must be an array.");
  }

  for (const date of periodStartDates) {
    if (!isValidDateOnly(date)) {
      throw new Error(`Invalid period start date: ${date}`);
    }
  }

  // ISO date strings sort chronologically.
  return [...new Set(periodStartDates)].sort();
}

/**
 * Calculate cycle information from recorded period start dates.
 *
 * Each cycle length is the number of calendar days between
 * consecutive period starts. The unfinished current cycle is
 * not calculated because its next period start is not yet known.
 *
 * confirmedLongCycleEndDates contains the end date of any
 * unusually long interval the user has explicitly confirmed
 * was a genuine long cycle, rather than a forgotten period log.
 */
export function calculateCyclePrediction(
  periodStartDates,
  { confirmedLongCycleEndDates = [] } = {},
) {
  const config = APP_CONFIG.cycle;
  const starts = normalizePeriodStarts(periodStartDates);

  if (!Array.isArray(confirmedLongCycleEndDates)) {
    throw new Error("Confirmed long-cycle dates must be an array.");
  }

  for (const date of confirmedLongCycleEndDates) {
    if (!isValidDateOnly(date)) {
      throw new Error(`Invalid confirmed cycle date: ${date}`);
    }
  }

  const confirmedDates = new Set(confirmedLongCycleEndDates);
  const acceptedLengths = [];
  const cycleIntervals = [];
  const suspectedGaps = [];

  // Compare each new interval with earlier accepted cycles.
  for (let i = 1; i < starts.length; i += 1) {
    const startDate = starts[i - 1];
    const endDate = starts[i];
    const lengthDays = daysBetween(startDate, endDate);

    const previousLengths = acceptedLengths.slice(
      -config.maxCompleteCyclesToUse,
    );

    const usualLength = median(previousLengths);
    const confirmedLongCycle = confirmedDates.has(endDate);

    const isSuspicious =
      usualLength !== null &&
      lengthDays > usualLength * config.missedLogGapMultiplier &&
      !confirmedLongCycle;

    const interval = {
      startDate,
      endDate,
      lengthDays,
      countedForPrediction: !isSuspicious,
      suspectedMissedLog: isSuspicious,
    };

    cycleIntervals.push(interval);

    if (isSuspicious) {
      suspectedGaps.push({
        startDate,
        endDate,
        lengthDays,
        usualLength,
      });

      // Do not let an unconfirmed long gap distort predictions.
      continue;
    }

    acceptedLengths.push(lengthDays);
  }

  const recentCycleLengths = acceptedLengths.slice(
    -config.maxCompleteCyclesToUse,
  );

  const medianCycleLength = median(recentCycleLengths);

  const cycleVariabilityDays =
    recentCycleLengths.length >= 2
      ? Math.max(...recentCycleLengths) - Math.min(...recentCycleLengths)
      : null;

  const isIrregular =
    cycleVariabilityDays !== null &&
    cycleVariabilityDays > config.irregularVariationThresholdDays;

  const regularityStatus =
    cycleVariabilityDays === null
      ? "insufficient-data"
      : isIrregular
        ? "irregular"
        : "regular";

  const latestInterval = cycleIntervals.at(-1);

  const latestGapNeedsConfirmation =
    latestInterval?.suspectedMissedLog === true;

  // Three recorded period starts provide two completed intervals.
  const minimumRequiredIntervals = config.minimumPeriodStartsForPrediction - 1;

  const enoughHistory =
    starts.length >= config.minimumPeriodStartsForPrediction &&
    recentCycleLengths.length >= minimumRequiredIntervals;

  let status = "insufficient-data";

  if (latestGapNeedsConfirmation) {
    status = "needs-missed-log-confirmation";
  } else if (enoughHistory) {
    status = "available";
  }

  const prediction = {
    available: false,
    status,
    estimatedDate: null,
    rangeStart: null,
    rangeEnd: null,
    spreadDays: null,
  };

  let ovulationEstimate = null;

  if (status === "available" && medianCycleLength !== null) {
    // Calendar dates must be whole days. The median itself may
    // be fractional, so round it for the central date estimate.
    const roundedMedian = Math.round(medianCycleLength);

    const estimatedDate = addDays(starts[starts.length - 1], roundedMedian);

    const largestDeviation = Math.max(
      ...recentCycleLengths.map((length) =>
        Math.abs(length - medianCycleLength),
      ),
    );

    let spreadDays = Math.max(
      config.minimumPredictionSpreadDays,
      Math.ceil(largestDeviation),
    );

    // Give irregular cycles additional uncertainty.
    if (isIrregular) {
      spreadDays += 2;
    }

    prediction.available = true;
    prediction.status = "available";
    prediction.estimatedDate = estimatedDate;
    prediction.rangeStart = addDays(estimatedDate, -spreadDays);
    prediction.rangeEnd = addDays(estimatedDate, spreadDays);
    prediction.spreadDays = spreadDays;

    // Fertility estimates are hidden for irregular cycles.
    if (!isIrregular) {
      const estimatedOvulationDate = addDays(
        estimatedDate,
        -config.ovulationDaysBeforeExpectedPeriod,
      );

      ovulationEstimate = {
        estimatedDate: estimatedOvulationDate,
        fertileWindowStart: addDays(
          estimatedOvulationDate,
          -config.fertileWindowDaysBeforeOvulation,
        ),
        fertileWindowEnd: estimatedOvulationDate,
        disclaimer: PREGNANCY_WARNING,
      };
    }
  }

  return {
    periodStarts: starts,
    cycleIntervals,
    recentCycleLengths,
    medianCycleLength,
    cycleVariabilityDays,
    regularityStatus,
    isIrregular,
    suspectedGaps,
    needsMissedLogConfirmation: suspectedGaps.length > 0,
    prediction,
    ovulationEstimate,
  };
}

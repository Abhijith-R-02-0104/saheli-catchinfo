import test from "node:test";
import assert from "node:assert/strict";

import { addDays } from "./dates.js";
import { calculateCyclePrediction } from "./cycle.js";

function makePeriodStarts(cycleLengths) {
  const starts = ["2026-01-01"];

  for (const length of cycleLengths) {
    starts.push(addDays(starts.at(-1), length));
  }

  return starts;
}

test("regular 28-day cycles produce a range estimate", () => {
  const starts = makePeriodStarts([28, 28, 28]);

  const result = calculateCyclePrediction(starts);

  assert.equal(result.prediction.available, true);
  assert.equal(result.medianCycleLength, 28);
  assert.equal(result.isIrregular, false);

  const expectedDate = addDays(starts.at(-1), 28);

  assert.equal(result.prediction.estimatedDate, expectedDate);
  assert.equal(result.prediction.rangeStart, addDays(expectedDate, -2));
  assert.equal(result.prediction.rangeEnd, addDays(expectedDate, 2));

  assert.notEqual(result.ovulationEstimate, null);

  assert.equal(
    result.ovulationEstimate.disclaimer,
    "This is an estimate. It can't be used to prevent pregnancy.",
  );
});

test("two period starts are not enough for a prediction", () => {
  const starts = makePeriodStarts([28]);

  const result = calculateCyclePrediction(starts);

  assert.equal(result.prediction.available, false);
  assert.equal(result.prediction.status, "insufficient-data");
});

test("three period starts provide two completed cycles", () => {
  const starts = makePeriodStarts([28, 29]);

  const result = calculateCyclePrediction(starts);

  assert.equal(result.prediction.available, true);
  assert.equal(result.recentCycleLengths.length, 2);
});

test("variable cycles are labelled irregular and have a wider range", () => {
  const starts = makePeriodStarts([26, 31, 29, 35, 27, 30]);

  const result = calculateCyclePrediction(starts);

  assert.equal(result.medianCycleLength, 29.5);
  assert.equal(result.cycleVariabilityDays, 9);
  assert.equal(result.isIrregular, true);
  assert.equal(result.regularityStatus, "irregular");
  assert.equal(result.prediction.available, true);
  assert.equal(result.prediction.spreadDays, 8);
  assert.equal(result.ovulationEstimate, null);
});

test("only the last six usable complete cycles are used", () => {
  const starts = makePeriodStarts([25, 26, 27, 28, 29, 30, 31]);

  const result = calculateCyclePrediction(starts);

  assert.deepEqual(result.recentCycleLengths, [26, 27, 28, 29, 30, 31]);
});

test("a suspicious 58-day gap requires confirmation", () => {
  const starts = makePeriodStarts([28, 28, 58]);

  const result = calculateCyclePrediction(starts);

  assert.equal(result.needsMissedLogConfirmation, true);
  assert.equal(result.suspectedGaps.length, 1);
  assert.equal(result.suspectedGaps[0].lengthDays, 58);
  assert.equal(result.prediction.status, "needs-missed-log-confirmation");
  assert.equal(result.prediction.available, false);

  // The suspicious 58-day interval must not be included
  // in the ordinary cycle-length statistics.
  assert.deepEqual(result.recentCycleLengths, [28, 28]);
});

test("a confirmed long cycle can be counted", () => {
  const starts = makePeriodStarts([28, 28, 58]);

  const result = calculateCyclePrediction(starts, {
    confirmedLongCycleEndDates: [starts.at(-1)],
  });

  assert.equal(result.needsMissedLogConfirmation, false);
  assert.deepEqual(result.recentCycleLengths, [28, 28, 58]);
  assert.equal(result.prediction.available, true);
  assert.equal(result.isIrregular, true);
  assert.equal(result.ovulationEstimate, null);
});

test("invalid period start dates are rejected", () => {
  assert.throws(() => calculateCyclePrediction(["2026-01-01", "2026-02-30"]));
});

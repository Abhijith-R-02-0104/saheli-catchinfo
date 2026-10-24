export const APP_CONFIG = {
  cycle: {
    // Use no more than the latest six complete cycle intervals.
    maxCompleteCyclesToUse: 6,

    // Three distinct period start dates allow an initial estimate.
    // Require three completed intervals between period start dates.
    minimumPeriodStartsForPrediction: 3,

    // A variation greater than seven days marks the cycle as irregular.
    irregularVariationThresholdDays: 7,

    // Predictions must extend at least this far on either side.
    minimumPredictionSpreadDays: 2,

    // Ovulation is estimated relative to the next expected period.
    ovulationDaysBeforeExpectedPeriod: 14,

    // Fertile window: five days before estimated ovulation plus that day.
    fertileWindowDaysBeforeOvulation: 5,

    // Configurable engineering heuristic, not a medical threshold.
    // Ask whether a period was missed when a gap exceeds the usual
    // cycle length by this multiplier.
    missedLogGapMultiplier: 1.5,
    
        
    padChangeIntervalHours: 2,
  },

  health: {
    // A period lasting more than seven days warrants guidance.
    prolongedPeriodDays: 7,

    // Adult cycle-length guidance thresholds.
    adultCycleLengthMinDays: 21,
    adultCycleLengthMaxDays: 35,

    // Under-18 cycle-length guidance thresholds.
    under18CycleLengthMinDays: 21,
    under18CycleLengthMaxDays: 45,

    // Repeated short or long cycles required for the specified rule.
    consecutiveIrregularCyclesForGuidance: 3,

    // No period for this many days when not pregnant.
    noPeriodDays: 90,

    // Very low mood logged on consecutive days triggers support.
    veryLowMoodConsecutiveDays: 3,

    // Recurring insight patterns need evidence across this many cycles.
    minimumCyclesForPattern: 3,

    // Estimated pregnancy due date relative to last period start.
    estimatedPregnancyDays: 280,
  },
};

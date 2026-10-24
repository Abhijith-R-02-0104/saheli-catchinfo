/**
 * Red-flag rules inferred from daily log data.
 * Each rule references translation keys for its displayed text.
 */
export const RED_FLAG_RULES = [
  {
    id: "prolonged-period",
    trigger: "period-duration",
    thresholdConfigKey: "health.prolongedPeriodDays",
    comparison: "greater-than",
    severity: "doctor",
    titleKey: "redflags.prolongedPeriod.title",
    noticedKey: "redflags.prolongedPeriod.noticed",
    whyKey: "redflags.prolongedPeriod.why",
    nextStepKey: "redflags.prolongedPeriod.nextStep",
    sources: [
      {
        name: "ACOG — Heavy and Abnormal Periods",
        url: "https://www.acog.org/womens-health/faqs/heavy-and-abnormal-periods",
      },
    ],
  },

  {
    id: "heavy-bleeding-indicators",
    trigger: "heavy-flow-indicators",
    thresholdConfigKeys: ["health.padChangeIntervalHours"],
    severity: "doctor",
    titleKey: "redflags.heavyBleeding.title",
    noticedKey: "redflags.heavyBleeding.noticed",
    whyKey: "redflags.heavyBleeding.why",
    nextStepKey: "redflags.heavyBleeding.nextStep",
    sources: [
      {
        name: "ACOG — Heavy and Abnormal Periods",
        url: "https://www.acog.org/womens-health/faqs/heavy-and-abnormal-periods",
      },
      {
        name: "NHS — Heavy Periods",
        url: "https://www.nhs.uk/conditions/heavy-periods/",
      },
    ],
  },

  {
    id: "repeated-out-of-range-cycles",
    trigger: "consecutive-out-of-range-cycles",
    thresholdConfigKeys: [
      "health.adultCycleLengthMinDays",
      "health.adultCycleLengthMaxDays",
      "health.under18CycleLengthMinDays",
      "health.under18CycleLengthMaxDays",
      "health.consecutiveIrregularCyclesForGuidance",
    ],
    severity: "doctor",
    titleKey: "redflags.outOfRangeCycles.title",
    noticedKey: "redflags.outOfRangeCycles.noticed",
    whyKey: "redflags.outOfRangeCycles.why",
    nextStepKey: "redflags.outOfRangeCycles.nextStep",
    sources: [
      {
        name: "ACOG — Heavy and Abnormal Periods",
        url: "https://www.acog.org/womens-health/faqs/heavy-and-abnormal-periods",
      },
      {
        name: "ACOG — Menstruation in Girls and Adolescents",
        url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign",
      },
    ],
  },

  {
    id: "no-period-90-days",
    trigger: "no-period-duration",
    thresholdConfigKey: "health.noPeriodDays",
    appliesWhen: "not-pregnant",
    severity: "doctor",
    titleKey: "redflags.noPeriod.title",
    noticedKey: "redflags.noPeriod.noticed",
    whyKey: "redflags.noPeriod.why",
    nextStepKey: "redflags.noPeriod.nextStep",
    sources: [
      {
        name: "ACOG — Amenorrhea: Absence of Periods",
        url: "https://www.acog.org/womens-health/faqs/amenorrhea-absence-of-periods",
      },
    ],
  },

  {
    id: "bleeding-between-periods",
    trigger: "bleeding-between-periods",
    severity: "doctor",
    titleKey: "redflags.bleedingBetweenPeriods.title",
    noticedKey: "redflags.bleedingBetweenPeriods.noticed",
    whyKey: "redflags.bleedingBetweenPeriods.why",
    nextStepKey: "redflags.bleedingBetweenPeriods.nextStep",
    sources: [
      {
        name: "NHS — Vaginal Bleeding Between Periods or After Sex",
        url: "https://www.nhs.uk/symptoms/vaginal-bleeding-between-periods-or-after-sex/",
      },
    ],
  },

  {
    id: "bleeding-after-sex",
    trigger: "bleeding-after-sex",
    severity: "doctor",
    titleKey: "redflags.bleedingAfterSex.title",
    noticedKey: "redflags.bleedingAfterSex.noticed",
    whyKey: "redflags.bleedingAfterSex.why",
    nextStepKey: "redflags.bleedingAfterSex.nextStep",
    sources: [
      {
        name: "NHS — Vaginal Bleeding Between Periods or After Sex",
        url: "https://www.nhs.uk/symptoms/vaginal-bleeding-between-periods-or-after-sex/",
      },
    ],
  },

  {
    id: "pain-affecting-daily-life",
    trigger: "disabling-or-unrelieved-pain",
    severity: "doctor",
    titleKey: "redflags.disablingPain.title",
    noticedKey: "redflags.disablingPain.noticed",
    whyKey: "redflags.disablingPain.why",
    nextStepKey: "redflags.disablingPain.nextStep",
    sources: [
      {
        name: "NHS — Period Pain",
        url: "https://www.nhs.uk/symptoms/period-pain/",
      },
    ],
  },

  {
    id: "heavy-bleeding-with-systemic-symptoms",
    trigger: "heavy-flow-with-fatigue-breathlessness-or-dizziness",
    severity: "doctor",
    titleKey: "redflags.heavyBleedingWithSymptoms.title",
    noticedKey: "redflags.heavyBleedingWithSymptoms.noticed",
    whyKey: "redflags.heavyBleedingWithSymptoms.why",
    nextStepKey: "redflags.heavyBleedingWithSymptoms.nextStep",
    sources: [
      {
        name: "NHS — Heavy Periods",
        url: "https://www.nhs.uk/conditions/heavy-periods/",
      },
    ],
  },
];

/**
 * Warning signs that cannot reliably be inferred from daily logs.
 * These need to be presented as questions or educational guidance.
 */
export const SELF_REPORTED_RED_FLAGS = [
  {
    id: "no-first-period-by-15",
    trigger: "self-reported",
    titleKey: "redflags.noFirstPeriod.title",
    noticedKey: "redflags.noFirstPeriod.noticed",
    whyKey: "redflags.noFirstPeriod.why",
    nextStepKey: "redflags.noFirstPeriod.nextStep",
    sources: [
      {
        name: "ACOG — Your First Period",
        url: "https://www.acog.org/womens-health/faqs/your-first-period",
      },
    ],
  },

  {
    id: "sudden-cycle-change",
    trigger: "self-reported",
    titleKey: "redflags.suddenCycleChange.title",
    noticedKey: "redflags.suddenCycleChange.noticed",
    whyKey: "redflags.suddenCycleChange.why",
    nextStepKey: "redflags.suddenCycleChange.nextStep",
    sources: [
      {
        name: "NHS — Irregular Periods",
        url: "https://www.nhs.uk/symptoms/irregular-periods/",
      },
    ],
  },

  {
    id: "bleeding-after-menopause",
    trigger: "self-reported",
    titleKey: "redflags.postMenopauseBleeding.title",
    noticedKey: "redflags.postMenopauseBleeding.noticed",
    whyKey: "redflags.postMenopauseBleeding.why",
    nextStepKey: "redflags.postMenopauseBleeding.nextStep",
    sources: [
      {
        name: "ACOG — Abnormal Uterine Bleeding",
        url: "https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding",
      },
    ],
  },
];

/**
 * Urgent signs take priority over ordinary doctor-guidance cards.
 * The evaluator must return "urgent" findings before normal findings.
 */
export const URGENT_RED_FLAGS = [
  {
    id: "sudden-severe-lower-belly-pain",
    trigger: "urgent-symptom",
    signal: "suddenSevereLowerBellyPain",
    severity: "urgent",
    titleKey: "redflags.urgentSeverePain.title",
    noticedKey: "redflags.urgentSeverePain.noticed",
    whyKey: "redflags.urgentSeverePain.why",
    nextStepKey: "redflags.urgent.nextStep",
    emergencyNumbers: ["112", "108"],
    sources: [
      {
        name: "NHS — Period Pain",
        url: "https://www.nhs.uk/symptoms/period-pain/",
      },
    ],
  },

  {
    id: "heavy-bleeding-with-fainting",
    trigger: "urgent-symptom",
    signal: "heavyBleedingWithDizzinessOrFainting",
    severity: "urgent",
    titleKey: "redflags.urgentHeavyBleeding.title",
    noticedKey: "redflags.urgentHeavyBleeding.noticed",
    whyKey: "redflags.urgentHeavyBleeding.why",
    nextStepKey: "redflags.urgent.nextStep",
    emergencyNumbers: ["112", "108"],
    sources: [
      {
        name: "ACOG — Heavy and Abnormal Periods",
        url: "https://www.acog.org/womens-health/faqs/heavy-and-abnormal-periods",
      },
    ],
  },

  {
    id: "possible-pregnancy-with-bleeding-or-severe-pain",
    trigger: "urgent-symptom",
    signal: "possiblePregnancyWithBleedingOrSeverePain",
    severity: "urgent",
    titleKey: "redflags.urgentPossiblePregnancy.title",
    noticedKey: "redflags.urgentPossiblePregnancy.noticed",
    whyKey: "redflags.urgentPossiblePregnancy.why",
    nextStepKey: "redflags.urgent.nextStep",
    emergencyNumbers: ["112", "108"],
    sources: [
      {
        name: "NHS — Vaginal Bleeding Between Periods or After Sex",
        url: "https://www.nhs.uk/symptoms/vaginal-bleeding-between-periods-or-after-sex/",
      },
    ],
  },
];

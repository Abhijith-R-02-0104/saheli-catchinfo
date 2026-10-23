export function createDefaultAppData() {
  return {
    schemaVersion: 1,

    settings: {
      language: "en",
      ageGroup: null,
      textSize: "normal",
      highContrast: false,
      readAloud: true,
      discreetMode: false,

      trackedSymptoms: [
        "cramps",
        "headache",
        "acne",
        "bloating",
        "fatigue",
        "moodChanges",
        "sleepProblems",
      ],
    },

    logsByDate: {},

    reminders: {
      periodEstimate: false,
      dailyCheckIn: false,
      medicines: false,
      custom: false,
    },

    pregnancy: {
      enabled: false,
      lastPeriodStart: null,
      confirmationRecorded: false,
    },

    dismissedFindings: [],
  };
}

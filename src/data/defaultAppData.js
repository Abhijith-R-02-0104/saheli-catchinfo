export function createDefaultAppData() {
  return {
    schemaVersion: 1,

    settings: {
      language: "en",
      theme: "light",
      ageGroup: null,
      textSize: "normal",
      highContrast: false,
      readAloud: true,
      discreetMode: false,
      petEnabled: false,

      trackedSymptoms: [
        "cramps",
        "headache",
        "acne",
        "bloating",
        "fatigue",
        "moodChanges",
        "sleepProblems",
        "backache",
        "nausea",
        "breastTenderness",
      ],
    },

    logsByDate: {},

    personalNotes: [],
    futureLetters: [],
    petState: {
      petType: "bunny",
      name: "Chotu",
      hearts: 5,
      growthStage: "baby",
      snacks: 4,
      isSleeping: false,
      lastAction: "idle",
      lastInteractionDate: null,
    },

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

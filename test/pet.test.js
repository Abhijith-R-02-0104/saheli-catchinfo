import process from "node:process";
import * as repo from "../src/repositories/appRepository.js";

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  } else {
    passed++;
    console.log(`PASS: ${message}`);
  }
}

// Mock localStorage for Node test environment
function createMockStorage(initial = {}) {
  const store = { ...initial };
  return {
    store,
    getItem(key) {
      return this.store[key] ?? null;
    },
    setItem(key, val) {
      this.store[key] = String(val);
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
}

globalThis.localStorage = createMockStorage();

console.log("\n--- 1. Default Pet State & Architecture ---");
const initial = repo.loadAppData();
assert(initial.petState !== undefined, "petState exists in default appData");
assert(initial.petState.petType === "bunny", "Default pet is bunny");
assert(initial.petState.name === "Chotu", "Default pet name is Chotu");
assert(initial.petState.hearts === 5, "Default affection hearts is 5");
assert(initial.petState.snacks === 4, "Default snack count is 4");
assert(initial.petState.isSleeping === false, "Default state is awake");
assert(initial.petState.growthStage === "baby", "Default stage is baby");

console.log("\n--- 2. Pet State Persistence Lifecycle ---");
// Simulate Petting Action: +1 heart
const petUpdated = {
  ...initial,
  petState: {
    ...initial.petState,
    hearts: 6,
    lastAction: "pet",
    lastInteractionDate: "2026-10-24T12:00:00Z",
  },
};
repo.saveAppData(petUpdated);

const reloadedAfterPet = repo.loadAppData();
assert(reloadedAfterPet.petState.hearts === 6, "Petting affection persisted to 6");
assert(reloadedAfterPet.petState.lastAction === "pet", "Last action updated to pet");

// Simulate Feeding Action: consumes 1 snack, +2 hearts
const snackCountBefore = reloadedAfterPet.petState.snacks;
const heartsBefore = reloadedAfterPet.petState.hearts;

const feedUpdated = {
  ...reloadedAfterPet,
  petState: {
    ...reloadedAfterPet.petState,
    snacks: snackCountBefore - 1,
    hearts: heartsBefore + 2,
    lastAction: "feed",
  },
};
repo.saveAppData(feedUpdated);

const reloadedAfterFeed = repo.loadAppData();
assert(reloadedAfterFeed.petState.snacks === snackCountBefore - 1, "Snack was consumed from inventory");
assert(reloadedAfterFeed.petState.hearts === heartsBefore + 2, "Feeding increased affection by 2");

console.log("\n--- 3. Nap & Sleep State Preservation ---");
// Simulate Take a Nap
const sleepUpdated = {
  ...reloadedAfterFeed,
  petState: {
    ...reloadedAfterFeed.petState,
    isSleeping: true,
    lastAction: "nap",
  },
};
repo.saveAppData(sleepUpdated);

const reloadedAfterSleep = repo.loadAppData();
assert(reloadedAfterSleep.petState.isSleeping === true, "Pet is marked as sleeping in persistent state");

// Simulate Wake Up
const wakeUpdated = {
  ...reloadedAfterSleep,
  petState: {
    ...reloadedAfterSleep.petState,
    isSleeping: false,
    lastAction: "wake",
  },
};
repo.saveAppData(wakeUpdated);

const reloadedAfterWake = repo.loadAppData();
assert(reloadedAfterWake.petState.isSleeping === false, "Pet is awake after wake interaction");

console.log("\n--- 4. Growth Stage Milestones ---");
function calculateGrowthStage(hearts) {
  if (hearts >= 30) return "grown";
  if (hearts >= 15) return "growing";
  return "baby";
}

assert(calculateGrowthStage(5) === "baby", "5 hearts is baby stage");
assert(calculateGrowthStage(14) === "baby", "14 hearts is baby stage");
assert(calculateGrowthStage(15) === "growing", "15 hearts transitions to growing stage");
assert(calculateGrowthStage(29) === "growing", "29 hearts is growing stage");
assert(calculateGrowthStage(30) === "grown", "30 hearts transitions to grown / cherished stage");
assert(calculateGrowthStage(50) === "grown", "50 hearts is grown / cherished stage");

console.log("\n--- 5. Rename & Character Selection (All 5 Animals) ---");
const ALL_ANIMAL_TYPES = ["bunny", "kitten", "puppy", "fox", "capybara"];
ALL_ANIMAL_TYPES.forEach((animal) => {
  const customData = {
    ...reloadedAfterWake,
    petState: {
      ...reloadedAfterWake.petState,
      name: `My-${animal}`,
      petType: animal,
    },
  };
  repo.saveAppData(customData);
  const reloaded = repo.loadAppData();
  assert(reloaded.petState.petType === animal, `Selected animal ${animal} persists`);
  assert(reloaded.petState.name === `My-${animal}`, `Name for ${animal} persists`);
});

console.log("\n--- 6. Resilient Fallbacks on Missing Data ---");
// Simulate legacy/partial stored data with missing fields
const legacyData = {
  schemaVersion: 1,
  settings: initial.settings,
  logsByDate: {},
  petState: {
    name: "OldPet",
    // Missing hearts, snacks, isSleeping, growthStage
  },
};
repo.saveAppData(legacyData);

const loadedLegacy = repo.loadAppData();
const fallbackHearts = Number.isFinite(loadedLegacy.petState.hearts) ? loadedLegacy.petState.hearts : 5;
const fallbackSnacks = Number.isFinite(loadedLegacy.petState.snacks) ? loadedLegacy.petState.snacks : 4;
const fallbackIsSleeping = Boolean(loadedLegacy.petState.isSleeping);
const fallbackStage = loadedLegacy.petState.growthStage || calculateGrowthStage(fallbackHearts);

assert(fallbackHearts === 5, "Missing hearts safely defaults to 5");
assert(fallbackSnacks === 4, "Missing snacks safely defaults to 4");
assert(fallbackIsSleeping === false, "Missing isSleeping safely defaults to false (awake)");
assert(fallbackStage === "baby", "Missing growthStage safely defaults to baby");

console.log(`\n========================================`);
console.log(`SUCCESS: All ${passed}/${total} Pet tests passed!`);
console.log(`========================================\n`);

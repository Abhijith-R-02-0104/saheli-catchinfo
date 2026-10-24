import process from 'node:process';
import { createDefaultAppData } from '../src/data/defaultAppData.js';
import * as repo from '../src/repositories/appRepository.js';

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

// Mock localStorage for headless Node test environment
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

// -------------------------------------------------------------
// Test Suite 1: Clean Startup and Schema
// -------------------------------------------------------------
console.log('\n--- 1. Clean Startup & Schema ---');
globalThis.localStorage = createMockStorage();

const initial = repo.loadAppData();
assert(initial.schemaVersion === 1, 'Default schemaVersion is 1');
assert(initial.settings.language === 'en', 'Default language is English');
assert(initial.settings.textSize === 'normal', 'Default textSize is normal');
assert(typeof initial.logsByDate === 'object' && !Array.isArray(initial.logsByDate), 'logsByDate is a clean dictionary');
assert(Object.keys(initial.logsByDate).length === 0, 'Initial logsByDate is empty');

// -------------------------------------------------------------
// Test Suite 2: Day Log Persistence Lifecycle
// -------------------------------------------------------------
console.log('\n--- 2. Day Log Lifecycle ---');
const testDate = '2026-10-24';
const testLog = {
  period: { isPeriod: true, flow: 'medium' },
  pain: { level: 2, stopsDailyLife: false },
  symptoms: ['cramps', 'headache'],
  mood: 'calm',
  energy: 4,
  sleepHours: 8,
  medicines: [],
  privateNote: 'Test note',
};

repo.saveDayLog(testDate, testLog);
const saved = repo.getDayLog(testDate);
assert(saved !== null, 'Day log saved and retrieved');
assert(saved.date === testDate, 'Day log has validated date attached');
assert(saved.period.flow === 'medium', 'Period flow preserved');
assert(saved.symptoms.length === 2, 'Symptoms array preserved');

// Verify direct localStorage string
const rawStored = JSON.parse(globalThis.localStorage.getItem('saheli.appData.v1'));
assert(rawStored.logsByDate[testDate] !== undefined, 'Raw storage contains persisted log');

// Update log
repo.saveDayLog(testDate, { ...testLog, mood: 'happy' });
const updated = repo.getDayLog(testDate);
assert(updated.mood === 'happy', 'Day log updated in place');

// Delete log
repo.deleteDayLog(testDate);
assert(repo.getDayLog(testDate) === null, 'Day log deleted from repository');
const rawAfterDelete = JSON.parse(globalThis.localStorage.getItem('saheli.appData.v1'));
assert(rawAfterDelete.logsByDate[testDate] === undefined, 'Raw storage has log removed');

// Deleting non-existent date should not throw
repo.deleteDayLog('2026-10-25');
assert(true, 'Deleting nonexistent date completed safely as no-op');

// -------------------------------------------------------------
// Test Suite 3: Date Validation
// -------------------------------------------------------------
console.log('\n--- 3. Date Validation ---');
const dateTests = [
  ['2024-02-29', true, 'Valid leap year (2024-02-29)'],
  ['2026-02-29', false, 'Non-leap year (2026-02-29)'],
  ['2026-04-31', false, 'Invalid 31st day for 30-day month (2026-04-31)'],
  ['2026-12-31', true, 'Valid end of year (2026-12-31)'],
  ['2026-01-01', true, 'Valid start of year (2026-01-01)'],
  ['24-10-2026', false, 'Invalid format DD-MM-YYYY'],
  ['2026/10/24', false, 'Invalid slash format'],
  ['invalid-date', false, 'Arbitrary invalid string'],
];

for (const [dateStr, shouldBeValid, label] of dateTests) {
  let ok = true;
  try {
    repo.getDayLog(dateStr);
  } catch {
    ok = false;
  }
  assert(ok === shouldBeValid, `Date check: ${label}`);
}

// -------------------------------------------------------------
// Test Suite 4: Corrupted Storage & Non-Overwriting Protection
// -------------------------------------------------------------
console.log('\n--- 4. Corrupted Storage & Protection ---');
const corruptedString = '{"schemaVersion": 1, corrupted_json_data...';
globalThis.localStorage.setItem('saheli.appData.v1', corruptedString);

let corruptErrorCaught = false;
try {
  repo.loadAppData();
} catch (e) {
  corruptErrorCaught = true;
  assert(e.message.includes('not been overwritten'), 'Error explicitly confirms data was not overwritten');
}
assert(corruptErrorCaught, 'Corrupted JSON correctly throws error on load');

// Verify data was NOT wiped or overwritten
assert(
  globalThis.localStorage.getItem('saheli.appData.v1') === corruptedString,
  'Corrupted data in localStorage is preserved untouched'
);
assert(
  repo.getRawStoredData() === corruptedString,
  'getRawStoredData() safely returns the raw corrupted string'
);

// -------------------------------------------------------------
// Test Suite 5: Schema Validation Rejection
// -------------------------------------------------------------
console.log('\n--- 5. Schema Validation ---');
const invalidSchemas = [
  [{ schemaVersion: 2 }, 'Unsupported schemaVersion: 2'],
  [{ schemaVersion: 1, settings: [], logsByDate: {} }, 'Array settings reject'],
  [{ schemaVersion: 1, settings: null, logsByDate: {} }, 'Null settings reject'],
  [{ schemaVersion: 1, settings: {}, logsByDate: [] }, 'Array logsByDate reject'],
  [{ schemaVersion: 1, settings: {}, logsByDate: null }, 'Null logsByDate reject'],
  ['not an object', 'Primitive string reject'],
];

for (const [badData, label] of invalidSchemas) {
  globalThis.localStorage.setItem('saheli.appData.v1', JSON.stringify(badData));
  let rejected = false;
  try {
    repo.loadAppData();
  } catch {
    rejected = true;
  }
  assert(rejected, `Schema validation rejected: ${label}`);
}

// -------------------------------------------------------------
// Test Suite 6: Write Failures (QuotaExceededError Simulation)
// -------------------------------------------------------------
console.log('\n--- 6. Write Failure & In-Memory State Retention ---');
// Mock storage that throws QuotaExceededError on setItem
const quotaErrorStorage = {
  store: {
    'saheli.appData.v1': JSON.stringify(createDefaultAppData()),
  },
  getItem(key) {
    return this.store[key] ?? null;
  },
  setItem() {
    const quotaError = new Error('QuotaExceededError: storage limit reached');
    quotaError.name = 'QuotaExceededError';
    throw quotaError;
  },
  removeItem(key) {
    delete this.store[key];
  },
};

globalThis.localStorage = quotaErrorStorage;

let writeErrorCaught = false;
try {
  repo.saveDayLog('2026-10-24', testLog);
} catch (e) {
  writeErrorCaught = true;
  assert(e.message.includes('Could not save Saheli data'), 'saveDayLog threw structured save error');
  assert(e.cause !== undefined, 'Underlying error cause preserved');
}
assert(writeErrorCaught, 'Write failure throws rather than silently pretending to save');

// -------------------------------------------------------------
// Test Suite 7: Explicit Recovery Reset
// -------------------------------------------------------------
console.log('\n--- 7. Reset Behavior ---');
// Re-enable functioning storage with corrupted data
globalThis.localStorage = createMockStorage({
  'saheli.appData.v1': '{corrupted_user_data',
});

// Explicit user-confirmed reset
repo.clearAppData();
assert(globalThis.localStorage.getItem('saheli.appData.v1') === null, 'clearAppData cleared storage');
const resetAppData = repo.loadAppData();
assert(resetAppData.schemaVersion === 1, 'Clean default appData loaded after reset');

// -------------------------------------------------------------
// Test Suite 8: Clipboard Error Handling Simulation
// -------------------------------------------------------------
console.log('\n--- 8. Clipboard Error Handling Simulation ---');

let copyFailed = false;
let copiedRaw = false;

function simulateCopy(mockNavigator, raw) {
  if (mockNavigator?.clipboard?.writeText) {
    return mockNavigator.clipboard
      .writeText(raw)
      .then(() => {
        copiedRaw = true;
        copyFailed = false;
      })
      .catch(() => {
        copyFailed = true;
        copiedRaw = false;
      });
  } else {
    copyFailed = true;
    copiedRaw = false;
    return Promise.resolve();
  }
}

await simulateCopy({}, 'sample raw data');
assert(copyFailed === true && copiedRaw === false, 'Missing clipboard API triggers copyFailed fallback');

const rejectingNavigator = {
  clipboard: {
    writeText: () => Promise.reject(new Error('NotAllowedError: Permission denied')),
  },
};
await simulateCopy(rejectingNavigator, 'sample raw data');
assert(copyFailed === true && copiedRaw === false, 'Permission denial triggers copyFailed fallback gracefully');

const resolvingNavigator = {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
};
await simulateCopy(resolvingNavigator, 'sample raw data');
assert(copyFailed === false && copiedRaw === true, 'Successful clipboard write sets copiedRaw true');

console.log(`\n========================================`);
console.log(`SUCCESS: All ${passed}/${total} assertions passed!`);
console.log(`========================================\n`);

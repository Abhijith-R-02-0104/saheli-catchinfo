import { useState } from "react";

import { useAppData } from "./context/useAppData.js";
import FaqAssistant from "./components/FaqAssistant.jsx";

function getLocalDateString() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function App() {
  const { appData, updateDayLog, deleteDayLog, storageError } = useAppData();

  const [showLogTest, setShowLogTest] = useState(false);

  const today = getLocalDateString();
  const todayLog = appData.logsByDate[today] ?? null;

  function handleSave() {
    updateDayLog(today, {
      period: {
        isPeriod: true,
        flow: "medium",
      },
      pain: {
        level: 2,
        stopsDailyLife: false,
      },
      symptoms: ["cramps"],
      mood: "okay",
      energy: 3,
      sleepHours: 7,
      medicines: [],
      privateNote: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#F6F8F7] px-4 py-8 text-slate-900 sm:py-12">
      {/* Abin's FAQ assistant */}
      <FaqAssistant />

      {/* Development-only storage test */}
      <section className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setShowLogTest((value) => !value)}
          className="min-h-12 font-semibold text-slate-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {showLogTest
            ? "Hide period-log development test"
            : "Show period-log development test"}
        </button>

        {showLogTest && (
          <div className="mt-4">
            <p className="text-sm text-slate-600">
              Development-only check for React Context and localStorage. Do not
              enter real health information here.
            </p>

            <p className="mt-3 text-sm text-slate-500">Today's local date</p>
            <p className="font-semibold">{today}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="min-h-12 rounded-xl bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Save sample period log
              </button>

              {todayLog && (
                <button
                  type="button"
                  onClick={() => deleteDayLog(today)}
                  className="min-h-12 rounded-xl border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Delete today's test log
                </button>
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold">
                  {storageError
                    ? "Log in memory only (Storage write failed)"
                    : todayLog
                      ? "Saved log found"
                      : "No log saved for today"}
                </h2>

                {storageError && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Not saved to storage
                  </span>
                )}
              </div>

              <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-green-200">
                {todayLog ? JSON.stringify(todayLog, null, 2) : "No saved log"}
              </pre>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

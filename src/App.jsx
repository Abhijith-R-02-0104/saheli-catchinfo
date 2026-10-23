import { useAppData } from "./context/useAppData.js";

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function App() {
  const { appData, updateDayLog, deleteDayLog } = useAppData();

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
    <main className="min-h-screen bg-[#F6F8F7] px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
          Saheli · Development Test
        </p>

        <h1 className="mt-3 text-3xl font-bold">Repository integration</h1>

        <p className="mt-3 text-slate-600">
          Test saving a period log through React Context and localStorage.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Today's local date</p>
          <p className="mt-1 font-semibold">{today}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            className="min-h-12 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            Save sample period log
          </button>

          {todayLog && (
            <button
              type="button"
              onClick={() => deleteDayLog(today)}
              className="min-h-12 rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Delete today's test log
            </button>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold">
            {todayLog ? "Saved log found" : "No log saved for today"}
          </h2>

          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-green-200">
            {JSON.stringify(todayLog, null, 2) ?? "No saved log"}
          </pre>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Development test only. Do not enter real health information here.
        </p>
      </section>
    </main>
  );
}

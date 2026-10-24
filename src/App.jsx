import { useState, lazy, Suspense } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useAppData } from "./context/useAppData.js";
import FaqAssistant from "./components/FaqAssistant.jsx";
import { Layout } from "./components/layout/Layout.jsx";
import { TodayView } from "./components/views/TodayView.jsx";
import { LogView } from "./components/views/LogView.jsx";
import { CalendarView } from "./components/views/CalendarView.jsx";
import { InsightsView } from "./components/views/InsightsView.jsx";
import { DoctorView } from "./components/views/DoctorView.jsx";
import { LearnView } from "./components/views/LearnView.jsx";
import { AskView } from "./components/views/AskView.jsx";
import { SettingsView } from "./components/views/SettingsView.jsx";
import { CalculatorsView } from "./components/views/CalculatorsView.jsx";
import { MySpaceView } from "./components/views/MySpaceView.jsx";

const PetView = lazy(() =>
  import("./components/views/PetView.jsx").then((m) => ({ default: m.PetView })),
);

function getLocalDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function App() {
  const { appData, updateDayLog, deleteDayLog, storageError } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDateForLog, setSelectedDateForLog] = useState(null);
  const [showLogTest, setShowLogTest] = useState(false);

  const today = getLocalDateString();
  const todayLog = appData?.logsByDate?.[today] ?? null;

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

  // Derive active tab from current pathname
  const currentPath = location.pathname.replace(/^\//, "") || "today";
  const validTabs = [
    "today",
    "log",
    "calendar",
    "insights",
    "calculators",
    "myspace",
    "doctor",
    "learn",
    "ask",
    "pet",
    "settings",
  ];
  const activeTab = validTabs.includes(currentPath) ? currentPath : "today";

  function handleSelectTab(tabId) {
    const targetPath = tabId === "today" ? "/" : `/${tabId}`;
    navigate(targetPath);
  }

  function handleCalendarSelectDate(date) {
    setSelectedDateForLog(date);
    navigate("/log");
  }

  return (
    <Layout activeTab={activeTab} onSelectTab={handleSelectTab}>
      <Routes>
        <Route
          path="/"
          element={
            <TodayView
              onNavigateToLog={() => handleSelectTab("log")}
              onNavigateToTab={handleSelectTab}
            />
          }
        />
        <Route path="/today" element={<Navigate to="/" replace />} />
        <Route
          path="/log"
          element={<LogView initialDate={selectedDateForLog} />}
        />
        <Route
          path="/calendar"
          element={
            <CalendarView onSelectDateForLog={handleCalendarSelectDate} />
          }
        />
        <Route path="/insights" element={<InsightsView />} />
        <Route path="/calculators" element={<CalculatorsView />} />
        <Route path="/myspace" element={<MySpaceView />} />
        <Route path="/doctor" element={<DoctorView />} />
        <Route path="/learn" element={<LearnView />} />
        <Route
          path="/ask"
          element={
            <div className="space-y-8">
              <FaqAssistant />
              <div className="pt-4 border-t border-[var(--line)]">
                <AskView />
              </div>
            </div>
          }
        />
        <Route
          path="/pet"
          element={
            <Suspense
              fallback={
                <div className="py-20 text-center text-[#79516F] font-serif animate-pulse">
                  Loading your companion sanctuary...
                </div>
              }
            >
              <PetView />
            </Suspense>
          }
        />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Developer Storage Check (Preserved from origin/main) */}
      <aside className="mx-auto mt-12 max-w-xl px-4 pb-6 text-center">
        <button
          type="button"
          onClick={() => setShowLogTest((value) => !value)}
          className="text-xs text-[var(--muted)] underline hover:text-[var(--ink)]"
        >
          {showLogTest ? "Hide period-log development test" : "Show period-log development test"}
        </button>

        {showLogTest && (
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-left text-xs shadow-sm">
            <p className="text-[var(--muted)]">
              Development-only check for React Context and localStorage. Do not enter real health information here.
            </p>
            <p className="mt-2 font-semibold text-[var(--ink)]">Today's local date: {today}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-green-700 px-3 py-1.5 font-semibold text-white hover:bg-green-800"
              >
                Save sample period log
              </button>
              {todayLog && (
                <button
                  type="button"
                  onClick={() => deleteDayLog(today)}
                  className="rounded-lg border border-[var(--line)] px-3 py-1.5 font-semibold hover:bg-[var(--card-subtle)]"
                >
                  Delete today's test log
                </button>
              )}
            </div>
            <div className="mt-4">
              <h4 className="font-bold">
                {storageError
                  ? "Log in memory only (Storage write failed)"
                  : todayLog
                    ? "Saved log found"
                    : "No log saved for today"}
              </h4>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-green-200">
                {todayLog ? JSON.stringify(todayLog, null, 2) : "No saved log"}
              </pre>
            </div>
          </div>
        )}
      </aside>
    </Layout>
  );
}

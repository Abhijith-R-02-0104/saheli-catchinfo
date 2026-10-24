import { useState, lazy, Suspense } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDateForLog, setSelectedDateForLog] = useState(null);

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
        <Route path="/ask" element={<AskView />} />
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
        {/* Fallback to Today */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

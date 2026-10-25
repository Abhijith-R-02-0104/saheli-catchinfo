import { useState, lazy, Suspense } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import FaqAssistant from "./components/FaqAssistant.jsx";
import { LandingPage } from "./components/landing/LandingPage.jsx";
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
import { SparkleCursor } from "./components/common/SparkleCursor.jsx";

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
    if (tabId === "overview") {
      navigate("/");
      return;
    }
    const targetPath = tabId === "today" ? "/today" : `/${tabId}`;
    navigate(targetPath);
  }

  function handleCalendarSelectDate(date) {
    setSelectedDateForLog(date);
    navigate("/log");
  }

  // Public Landing Page view at "/"
  if (location.pathname === "/") {
    return (
      <>
        <SparkleCursor />
        <LandingPage
          onOpenApp={(targetTab = "today", options = {}) => {
            if (targetTab === "log" && options?.isFirstPeriod) {
              navigate("/log?mode=first-period", {
                state: { isFirstPeriod: true, returnTo: "/" },
              });
              return;
            }
            const targetPath = targetTab === "today" ? "/today" : `/${targetTab}`;
            navigate(targetPath, { state: options });
          }}
        />
      </>
    );
  }

  return (
    <>
      <SparkleCursor />
      <Layout
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onNavigateToLanding={() => navigate("/")}
      >
      <Routes>
        <Route path="/app" element={<Navigate to="/today" replace />} />
        <Route path="/app/today" element={<Navigate to="/today" replace />} />
        <Route path="/overview" element={<Navigate to="/" replace />} />
        <Route
          path="/today"
          element={
            <TodayView
              onNavigateToLog={() => handleSelectTab("log")}
              onNavigateToTab={handleSelectTab}
            />
          }
        />
        <Route
          path="/log"
          element={
            <LogView
              initialDate={selectedDateForLog}
              onNavigateBack={() => {
                if (location.state?.returnTo) {
                  navigate(location.state.returnTo);
                } else if (location.search?.includes("mode=first-period")) {
                  navigate("/");
                } else {
                  navigate("/today");
                }
              }}
              onSavedFirstPeriod={() => navigate("/")}
            />
          }
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
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>
    </Layout>
    </>
  );
}

import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import {
  IconToday,
  IconLog,
  IconCalendar,
  IconInsights,
  IconCalculators,
  IconMySpace,
  IconDoctor,
  IconLearn,
  IconAsk,
  IconPet,
  IconSettings,
} from "../common/Icons.jsx";

function NavMoreIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function NavIcon({ name, className = "h-4 w-4" }) {
  switch (name) {
    case "today":
      return <IconToday className={className} />;
    case "log":
      return <IconLog className={className} />;
    case "calendar":
      return <IconCalendar className={className} />;
    case "insights":
      return <IconInsights className={className} />;
    case "doctor":
      return <IconDoctor className={className} />;
    case "learn":
      return <IconLearn className={className} />;
    case "ask":
      return <IconAsk className={className} />;
    case "calculators":
      return <IconCalculators className={className} />;
    case "myspace":
      return <IconMySpace className={className} />;
    case "pet":
      return <IconPet className={className} />;
    case "settings":
      return <IconSettings className={className} />;
    case "more":
      return <NavMoreIcon className={className} />;
    default:
      return null;
  }
}

export function Navigation({ activeTab, onSelectTab }) {
  const { appData } = useAppData();
  const { lang, t } = useTranslation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isDiscreet = Boolean(appData.settings.discreetMode);
  const isPetEnabled = Boolean(appData.settings.petEnabled);

  function getNavLabel(id) {
    return isDiscreet ? t("discreetNav", id) : t("nav", id);
  }

  // Clustered deliberate navigation groups
  // 1. Core Routine & Cycle Tracking
  const cycleGroup = [
    { id: "today", icon: "today" },
    { id: "log", icon: "log" },
    { id: "calendar", icon: "calendar" },
    { id: "insights", icon: "insights" },
  ];

  // 2. Health Knowledge & Doctor Guidance
  const guidanceGroup = [
    { id: "doctor", icon: "doctor" },
    { id: "learn", icon: "learn" },
    { id: "ask", icon: "ask" },
  ];

  // 3. Sanctuary & Personal Tools
  const toolsGroup = [
    { id: "calculators", icon: "calculators" },
    { id: "myspace", icon: "myspace" },
    ...(isPetEnabled ? [{ id: "pet", icon: "pet" }] : []),
    { id: "settings", icon: "settings" },
  ];

  const secondaryTabs = [...guidanceGroup, ...toolsGroup];
  const isSecondaryActive = secondaryTabs.some((tab) => tab.id === activeTab);

  function renderDesktopTab(item) {
    const isActive = activeTab === item.id;
    const label = getNavLabel(item.id);
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectTab(item.id)}
        aria-current={isActive ? "page" : undefined}
        className={`group relative inline-flex items-center gap-2 px-3 py-2 text-xs lg:text-[13px] font-medium transition-all rounded-md select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#79516F] ${
          isActive
            ? "text-[#79516F] font-semibold dark:text-[#E9B7C8] bg-[#79516F]/8 dark:bg-[#E9B7C8]/10"
            : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--plum-light)]/40"
        }`}
      >
        <NavIcon
          name={item.icon}
          className={`h-4 w-4 shrink-0 transition-colors ${
            isActive
              ? "text-[#79516F] dark:text-[#E9B7C8]"
              : "text-[var(--muted)] group-hover:text-[var(--ink)]"
          }`}
        />
        <span>{label}</span>

        {/* Sophisticated Plum Bottom Indicator Line */}
        {isActive && (
          <span
            className="absolute bottom-0 inset-x-2.5 h-[2px] bg-[#79516F] dark:bg-[#E9B7C8] rounded-full"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <>
      {/* 1. Distinct Desktop & Tablet Navigation Area */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:block border-b border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-xs transition-colors"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2 py-1.5">
            {/* Cluster 1: Daily Routine & Cycle */}
            <div className="flex items-center gap-0.5">
              {cycleGroup.map(renderDesktopTab)}
            </div>

            {/* Hairline Divider */}
            <div
              className="hidden lg:block h-4 w-px bg-[var(--line-strong)]/40 shrink-0"
              aria-hidden="true"
            />

            {/* Cluster 2: Health Knowledge & Care */}
            <div className="flex items-center gap-0.5">
              {guidanceGroup.map(renderDesktopTab)}
            </div>

            {/* Hairline Divider */}
            <div
              className="hidden lg:block h-4 w-px bg-[var(--line-strong)]/40 shrink-0"
              aria-hidden="true"
            />

            {/* Cluster 3: Sanctuary & Tools */}
            <div className="flex items-center gap-0.5">
              {toolsGroup.map(renderDesktopTab)}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 inset-x-0 z-40 block md:hidden border-t border-[var(--line)] bg-[var(--card)]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-lg"
      >
        <div className="flex items-center justify-around px-2 py-1">
          {cycleGroup.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onSelectTab(item.id);
                }}
                aria-current={isActive ? "page" : undefined}
                className={`touch-target flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors ${
                  isActive
                    ? "text-[#79516F] dark:text-[#E9B7C8] font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? "bg-[#79516F]/10 text-[#79516F] dark:bg-[#E9B7C8]/15 dark:text-[#E9B7C8] scale-105"
                      : ""
                  }`}
                >
                  <NavIcon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="mt-0.5 text-[11px] leading-tight tracking-tight">
                  {getNavLabel(item.id)}
                </span>
                {isActive && (
                  <span
                    className="mt-0.5 h-1 w-1 rounded-full bg-[#79516F] dark:bg-[#E9B7C8]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          {/* More Menu Trigger */}
          <button
            type="button"
            onClick={() => setShowMoreMenu((prev) => !prev)}
            aria-expanded={showMoreMenu}
            aria-label="More views"
            className={`touch-target flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors ${
              isSecondaryActive || showMoreMenu
                ? "text-[#79516F] dark:text-[#E9B7C8] font-bold"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                isSecondaryActive || showMoreMenu
                  ? "bg-[#79516F]/10 text-[#79516F] dark:bg-[#E9B7C8]/15 dark:text-[#E9B7C8] scale-105"
                  : ""
              }`}
            >
              <NavIcon name="more" className="h-5 w-5" />
            </span>
            <span className="mt-0.5 text-[11px] leading-tight tracking-tight">
              {isSecondaryActive
                ? getNavLabel(activeTab)
                : lang === "hi"
                  ? "अधिक"
                  : "More"}
            </span>
            {(isSecondaryActive || showMoreMenu) && (
              <span
                className="mt-0.5 h-1 w-1 rounded-full bg-[#79516F] dark:bg-[#E9B7C8]"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* Mobile Categorized "More" Drawer Popover */}
        {showMoreMenu && (
          <div
            role="dialog"
            aria-label="Additional views"
            className="border-t border-[var(--line)] bg-[var(--card)] p-4 shadow-xl max-h-80 overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "अतिरिक्त मेनू" : "Explore More"}
              </span>
              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="text-xs text-[var(--muted)] hover:text-[var(--ink)] px-2 py-0.5 rounded-md"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Section 1: Health Knowledge & Care */}
            <div className="mb-3">
              <h4 className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 px-1">
                {lang === "hi" ? "मार्गदर्शन और ज्ञान" : "Guidance & Knowledge"}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {guidanceGroup.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onSelectTab(item.id);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                        isActive
                          ? "border-[#79516F] bg-[#79516F]/10 text-[#79516F] dark:border-[#E9B7C8] dark:bg-[#E9B7C8]/15 dark:text-[#E9B7C8] font-semibold"
                          : "border-[var(--line)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]/40"
                      } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
                    >
                      <NavIcon
                        name={item.icon}
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? "text-[#79516F] dark:text-[#E9B7C8]"
                            : "text-[var(--muted)]"
                        }`}
                      />
                      <span className="truncate">{getNavLabel(item.id)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Sanctuary & Personal Tools */}
            <div>
              <h4 className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 px-1">
                {lang === "hi" ? "व्यक्तिगत स्पेस और टूल्स" : "Sanctuary & Tools"}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {toolsGroup.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onSelectTab(item.id);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                        isActive
                          ? "border-[#79516F] bg-[#79516F]/10 text-[#79516F] dark:border-[#E9B7C8] dark:bg-[#E9B7C8]/15 dark:text-[#E9B7C8] font-semibold"
                          : "border-[var(--line)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]/40"
                      } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
                    >
                      <NavIcon
                        name={item.icon}
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? "text-[#79516F] dark:text-[#E9B7C8]"
                            : "text-[var(--muted)]"
                        }`}
                      />
                      <span className="truncate">{getNavLabel(item.id)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

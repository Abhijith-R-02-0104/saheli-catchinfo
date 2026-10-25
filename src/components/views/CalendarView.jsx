import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { calculateCyclePrediction } from "../../lib/cycle.js";
import {
  getTodayLocalDate,
  addDays,
  daysBetween,
  isValidDateOnly,
} from "../../lib/dates.js";
import { CYCLE_PHASES } from "../../data/cyclePhases.js";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlus,
  IconCross,
  IconDroplet,
  IconLock,
  IconLog,
  IconAlertTriangle,
} from "../common/Icons.jsx";


const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];

function formatFriendlyDate(dateStr, lang) {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function CalendarView({ onSelectDateForLog }) {
  const { appData, deleteDayLog } = useAppData();
  const { lang, t } = useTranslation();

  const todayStr = getTodayLocalDate();
  const todayParts = todayStr.split("-").map(Number);

  // Calendar view year and month (1-indexed month)
  const [viewYear, setViewYear] = useState(todayParts[0]);
  const [viewMonth, setViewMonth] = useState(todayParts[1]);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Collect period start dates for prediction
  const entries = Object.entries(appData.logsByDate || {})
    .filter(([d, log]) => isValidDateOnly(d) && log?.period?.isPeriod === true)
    .sort(([a], [b]) => a.localeCompare(b));

  const periodDatesSet = new Set(entries.map(([d]) => d));
  const periodStarts = entries
    .map(([d]) => d)
    .filter((date) => !periodDatesSet.has(addDays(date, -1)));

  const predictionData = (() => {
    try {
      return calculateCyclePrediction(periodStarts);
    } catch {
      return null;
    }
  })();

  // Predicted period dates set
  const predictedDatesSet = new Set();
  if (
    predictionData?.prediction?.available &&
    predictionData.prediction.rangeStart &&
    predictionData.prediction.rangeEnd
  ) {
    let curr = predictionData.prediction.rangeStart;
    const end = predictionData.prediction.rangeEnd;
    while (curr <= end) {
      predictedDatesSet.add(curr);
      curr = addDays(curr, 1);
    }
  }

  // Fertile window dates set
  const fertileDatesSet = new Set();
  if (
    predictionData?.ovulationEstimate?.fertileWindowStart &&
    predictionData.ovulationEstimate.fertileWindowEnd
  ) {
    let curr = predictionData.ovulationEstimate.fertileWindowStart;
    const end = predictionData.ovulationEstimate.fertileWindowEnd;
    while (curr <= end) {
      fertileDatesSet.add(curr);
      curr = addDays(curr, 1);
    }
  }

  // Clinical cycle phase estimation per calendar date
  function getPhaseForDate(dateStr) {
    if (!periodStarts || periodStarts.length === 0) return null;
    const pastStarts = periodStarts.filter((ps) => ps <= dateStr);
    if (pastStarts.length === 0) return null;
    const latestStart = pastStarts[pastStarts.length - 1];
    const diff = daysBetween(latestStart, dateStr);
    if (diff < 0) return null;
    const cycleDay = diff + 1;
    const totalCycle = predictionData?.medianCycleLength || 28;
    if (cycleDay > totalCycle + 10) return null;
    if (cycleDay <= 5) return { key: "menstrual", cycleDay, ...CYCLE_PHASES.menstrual };
    if (cycleDay <= 13) return { key: "follicular", cycleDay, ...CYCLE_PHASES.follicular };
    if (cycleDay <= 17) return { key: "ovulation", cycleDay, ...CYCLE_PHASES.ovulation };
    if (cycleDay <= totalCycle) return { key: "luteal", cycleDay, ...CYCLE_PHASES.luteal };
    return null;
  }

  // Previous and Next month navigation
  function handlePrevMonth() {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleGoToToday() {
    setViewYear(todayParts[0]);
    setViewMonth(todayParts[1]);
    setSelectedDate(todayStr);
  }

  // Days in month calculation (local date math)
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayWeekday = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0 is Sunday

  // Build grid cells
  const gridCells = [];
  // Empty padding cells before first day
  for (let i = 0; i < firstDayWeekday; i++) {
    gridCells.push({ isPadding: true, key: `pad-pre-${i}` });
  }

  // Actual calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(viewMonth).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${viewYear}-${mm}-${dd}`;
    gridCells.push({
      isPadding: false,
      dayNumber: day,
      dateStr,
      key: dateStr,
    });
  }

  // Selected day log details
  const selectedLog = selectedDate ? appData.logsByDate[selectedDate] : null;

  function handleDeleteSelectedLog() {
    if (!selectedDate) return;
    deleteDayLog(selectedDate);
    setDeleteConfirm(false);
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
            {t("nav", "calendar")}
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
            {lang === "hi"
              ? `${MONTH_NAMES_HI[viewMonth - 1]} ${viewYear}`
              : `${MONTH_NAMES_EN[viewMonth - 1]} ${viewYear}`}
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("calendar", "selectDate")}
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGoToToday}
            className="touch-target rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--card-subtle)] transition-colors shadow-xs"
          >
            {t("common", "today")}
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="touch-target inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] p-2.5 text-sm font-bold text-[var(--ink)] hover:bg-[var(--card-subtle)] transition-colors shadow-xs"
          >
            <IconArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="touch-target inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] p-2.5 text-sm font-bold text-[var(--ink)] hover:bg-[var(--card-subtle)] transition-colors shadow-xs"
          >
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>


      {/* Main Calendar Layout: Grid (7 cols) + Selected Day Panel (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Monthly Grid (7 cols) - Compact, balanced height */}
        <div className="lg:col-span-7 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6 shadow-xs space-y-4">
          {/* Cycle Phase Ribbon / Guide (When period records exist) */}
          {periodStarts.length > 0 && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-serif font-bold text-[var(--plum)] flex items-center gap-1.5">
                <IconDroplet className="h-3.5 w-3.5 text-[var(--plum)]" filled />
                <span>{lang === "hi" ? "चक्र चरण गाइड:" : "Cycle Phase Guide:"}</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {Object.values(CYCLE_PHASES).map((ph) => (
                  <span
                    key={ph.id}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold border bg-[var(--card)] text-[var(--ink)] border-[var(--line)]"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ph.color }} />
                    <span>{lang === "hi" ? ph.nameHi : ph.nameEn}</span>
                    <span className="opacity-75 text-[10px]">({lang === "hi" ? ph.rangeHi : ph.rangeEn})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-[var(--muted)] border-b border-[var(--line)] pb-2">
            {(lang === "hi" ? WEEKDAYS_HI : WEEKDAYS_EN).map((wd, i) => (
              <span key={wd} className={i === 0 ? "text-[var(--plum)]" : ""}>
                {wd}
              </span>
            ))}
          </div>

          {/* Compact Calendar Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {gridCells.map((cell) => {
              if (cell.isPadding) {
                return (
                  <div
                    key={cell.key}
                    className="h-10 sm:h-12 w-full rounded-xl bg-transparent"
                    aria-hidden="true"
                  />
                );
              }

              const { dateStr, dayNumber } = cell;
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === todayStr;
              const dayLog = appData.logsByDate[dateStr];
              const isLoggedPeriod = Boolean(dayLog?.period?.isPeriod);
              const isPredicted = predictedDatesSet.has(dateStr);
              const isFertile = fertileDatesSet.has(dateStr);
              const hasSymptoms = (dayLog?.symptoms?.length ?? 0) > 0;
              const cellPhase = getPhaseForDate(dateStr);

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setDeleteConfirm(false);
                  }}
                  className={`relative flex h-10 sm:h-12 w-full flex-col items-center justify-center rounded-xl p-0.5 text-xs transition-all border ${
                    isSelected
                      ? "ring-2 ring-[var(--plum)] border-[var(--plum)] z-10 shadow-xs scale-102"
                      : "border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
                  } ${
                    isLoggedPeriod
                      ? "bg-[#79516F] text-white font-bold"
                      : isPredicted
                      ? "bg-[var(--card-subtle)] border-dashed border-[var(--plum)] text-[var(--plum)] font-semibold"
                      : isToday
                      ? "bg-[var(--card-subtle)] text-[var(--plum)] font-bold ring-1 ring-[var(--plum)]"
                      : "bg-[var(--card)] text-[var(--ink)]"
                  }`}
                  aria-label={`${dateStr}${isLoggedPeriod ? " - Logged period" : ""}${isToday ? " - Today" : ""}`}
                >
                  {/* Day Number */}
                  <span
                    className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-xs leading-none ${
                      isToday && !isLoggedPeriod
                        ? "bg-[#E9B7C8] text-[#79516F] font-bold dark:bg-[#3D2636] dark:text-[#E8A8BF]"
                        : isToday && isLoggedPeriod
                        ? "ring-2 ring-white font-bold"
                        : ""
                    }`}
                  >
                    {dayNumber}
                  </span>

                  {/* Indicator Dots directly beneath */}
                  <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                    {isFertile && !isLoggedPeriod && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-[#3F6344] dark:bg-[#88C690]"
                        title={t("calendar", "legendFertile")}
                      />
                    )}
                    {hasSymptoms && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isLoggedPeriod ? "bg-[#DCEBDD]" : "bg-[#3F6344] dark:bg-[#88C690]"
                        }`}
                        title={t("calendar", "legendSymptoms")}
                      />
                    )}
                    {isLoggedPeriod && dayLog?.period?.flow && (
                      <span className="text-[8px] uppercase tracking-tighter opacity-80">
                        {dayLog.period.flow.slice(0, 1)}
                      </span>
                    )}
                  </div>

                  {/* Subtle Phase Indicator Line */}
                  {cellPhase && !isLoggedPeriod && (
                    <span
                      className="absolute bottom-1 h-0.5 w-3/5 rounded-full"
                      style={{ backgroundColor: cellPhase.color }}
                      title={`${lang === "hi" ? cellPhase.nameHi : cellPhase.nameEn} (Day ${cellPhase.cycleDay})`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Compact Single-Row Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3 border-t border-[var(--line)] text-[11px] text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#79516F]" />
              {t("calendar", "legendLogged")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#79516F] bg-[var(--card-subtle)]" />
              {t("calendar", "legendPredicted")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3F6344] dark:bg-[#88C690]" />
              {t("calendar", "legendFertile")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#DCEBDD] dark:bg-[#1E3722] border border-[#3F6344] dark:border-[#88C690]" />
              {t("calendar", "legendSymptoms")}
            </span>
          </div>
        </div>

        {/* Selected-Day Detail Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--plum)]">
                {t("calendar", "viewLog")}
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)]">
                {formatFriendlyDate(selectedDate, lang)}
              </h2>
            </div>
            {selectedDate === todayStr && (
              <span className="rounded-full bg-[#E9B7C8]/40 dark:bg-[#3D2636] px-2.5 py-0.5 text-xs font-bold text-[var(--plum)]">
                {t("common", "today")}
              </span>
            )}
          </div>

          {/* Clinical Cycle Phase Card for Selected Day */}
          {(() => {
            const phase = getPhaseForDate(selectedDate);
            if (!phase) return null;
            return (
              <div
                className="rounded-2xl p-3.5 border space-y-1.5 transition-colors bg-[var(--card-subtle)] border-[var(--line)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs font-bold flex items-center gap-1.5 text-[var(--plum)]">
                    <IconDroplet className="h-3.5 w-3.5 text-[var(--plum)]" filled />
                    <span>{lang === "hi" ? phase.nameHi : phase.nameEn}</span>
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--card)] text-[var(--ink)] border border-[var(--line)]"
                  >
                    {lang === "hi" ? `दिन ${phase.cycleDay}` : `Day ${phase.cycleDay}`}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--ink)] opacity-90">
                  {lang === "hi" ? phase.careTipHi : phase.careTipEn}
                </p>
              </div>
            );
          })()}

          {selectedLog ? (
            <div className="space-y-4 text-xs">
              {/* Period Flow Row */}
              <div className="flex items-center justify-between rounded-xl bg-[var(--card-subtle)] p-3 border border-[var(--line)]">
                <span className="font-semibold text-[var(--muted)]">
                  {t("logForm", "flow")}:
                </span>
                <span className="font-bold text-[var(--plum)] capitalize">
                  {selectedLog.period?.isPeriod
                    ? t(
                        "logForm",
                        `flow${selectedLog.period.flow.charAt(0).toUpperCase() + selectedLog.period.flow.slice(1)}`,
                      )
                    : t("logForm", "flowNone")}
                </span>
              </div>

              {/* Pain Level Row */}
              {selectedLog.pain && (
                <div className="flex items-center justify-between rounded-xl bg-[var(--card-subtle)] p-3 border border-[var(--line)]">
                  <span className="font-semibold text-[var(--muted)]">
                    {t("logForm", "painLevel")}:
                  </span>
                  <span className="font-bold text-[var(--ink)]">
                    {selectedLog.pain.level} / 4
                    {selectedLog.pain.stopsDailyLife && (
                      <span className="ml-1 text-[#8F1D1D] dark:text-[#FFB3B8] font-bold inline-flex items-center gap-1">
                        <IconAlertTriangle className="h-3.5 w-3.5 inline text-[#8F1D1D] dark:text-[#FFB3B8]" />
                        <span>({t("logForm", "stopsDailyLife")})</span>
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Symptoms Chips */}
              {selectedLog.symptoms?.length > 0 && (
                <div>
                  <span className="font-semibold text-[var(--muted)] block mb-1.5">
                    {t("logForm", "symptoms")}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLog.symptoms.map((sym) => (
                      <span
                        key={sym}
                        className="rounded-lg bg-[#DCEBDD] dark:bg-[#1E3722] px-2.5 py-1 text-xs font-semibold text-[#3F6344] dark:text-[#88C690]"
                      >
                        {t(
                          "logForm",
                          `symptom${sym.charAt(0).toUpperCase() + sym.slice(1)}`,
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mood & Wellness Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-2.5">
                  <span className="text-[10px] text-[var(--muted)] block">
                    {t("logForm", "mood")}
                  </span>
                  <span className="font-bold text-xs capitalize text-[var(--ink)]">
                    {selectedLog.mood || "--"}
                  </span>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-2.5">
                  <span className="text-[10px] text-[var(--muted)] block">
                    {t("logForm", "energy")}
                  </span>
                  <span className="font-bold text-xs text-[var(--ink)]">
                    {selectedLog.energy ? `${selectedLog.energy}/5` : "--"}
                  </span>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-2.5">
                  <span className="text-[10px] text-[var(--muted)] block">
                    {t("logForm", "sleepHours")}
                  </span>
                  <span className="font-bold text-xs text-[var(--ink)]">
                    {selectedLog.sleepHours ? `${selectedLog.sleepHours}h` : "--"}
                  </span>
                </div>
              </div>

              {/* Private Note (if any) */}
              {selectedLog.privateNote && (
                <div className="rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 text-xs">
                  <span className="font-semibold text-[var(--plum)] flex items-center gap-1.5 mb-1">
                    <IconLock className="h-3.5 w-3.5 text-[var(--plum)]" />
                    <span>{t("logForm", "privateNote")}:</span>
                  </span>
                  <p className="text-[var(--ink)] italic leading-relaxed">
                    {selectedLog.privateNote}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDateForLog?.(selectedDate)}
                  className="touch-target flex-1 rounded-xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] px-4 py-2.5 text-xs font-semibold text-white shadow-xs text-center transition-all"
                >
                  {t("calendar", "editLog")}
                </button>

                {!deleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3 py-2.5 text-xs font-semibold text-[#8F1D1D] dark:text-[#FFB3B8] hover:bg-[var(--card-subtle)] transition-colors"
                  >
                    {t("buttons", "delete")}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDeleteSelectedLog}
                      className="touch-target rounded-xl bg-[#8F1D1D] px-3 py-2.5 text-xs font-bold text-white hover:bg-red-800"
                    >
                      {t("buttons", "confirm")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="touch-target inline-flex items-center justify-center rounded-xl border border-[var(--line)] p-2.5 text-xs text-[var(--ink)] bg-[var(--card)]"
                    >
                      <IconCross className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[var(--card-subtle)] border border-[var(--line)] flex items-center justify-center text-[var(--plum)]">
                <IconLog className="h-6 w-6 text-[var(--plum)]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-[var(--ink)]">
                  {lang === "hi" ? "इस दिन कोई प्रविष्टि नहीं" : "No Log for this Day"}
                </h3>
                <p className="text-xs text-[var(--muted)] max-w-xs mx-auto">
                  {lang === "hi"
                    ? "माहवारी प्रवाह, लक्षण, मनोदशा या निजी नोट्स दर्ज करें।"
                    : "Track flow, symptoms, mood, or private reflections for this date."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectDateForLog?.(selectedDate)}
                className="touch-target inline-flex items-center gap-1.5 rounded-xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-xs"
              >
                <IconPlus className="h-3.5 w-3.5" />
                <span>{t("calendar", "logThisDay")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

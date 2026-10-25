import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { calculateCyclePrediction } from "../../lib/cycle.js";
import { getTodayLocalDate, daysBetween, addDays, isValidDateOnly } from "../../lib/dates.js";
import { evaluateHealthSafety } from "../../lib/safety.js";
import { CycleWheel } from "../cycle/CycleWheel.jsx";
import { EditorialBanner } from "../common/EditorialBanner.jsx";
import {
  IconLotus,
  IconCalendar,
  IconArrowRight,
  IconSparkles,
  IconMinus,
  IconDroplet,
  IconDroplets,
  IconSmile,
  IconSmilePlus,
  IconHeart,
  IconFrown,
  IconCloud,
  IconCheck,
  IconAlertOctagon,
  IconAlertTriangle,
  IconCramp,
  IconHeadache,
  IconBloating,
  IconFatigue,
  IconAcne,
  IconInsights,
  IconMySpace,
  IconPet,
  IconLog,
} from "../common/Icons.jsx";

function stripEmoji(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replaceAll("\uFE0F", "")
    .replaceAll("\u200D", "")
    .replace(/[\u2600-\u27BF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

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

export function TodayView({ onNavigateToLog, onNavigateToTab }) {
  const { appData, updateDayLog } = useAppData();
  const { lang, t } = useTranslation();

  const today = getTodayLocalDate();
  const todayLog = appData.logsByDate[today] ?? null;
  const isDiscreet = Boolean(appData.settings.discreetMode);

  // Quick check-in state synchronized with today's saved record
  const [quickFlow, setQuickFlow] = useState(() => todayLog?.period?.flow || "none");
  const [quickMood, setQuickMood] = useState(() => todayLog?.mood || "calm");
  const [quickSymptoms, setQuickSymptoms] = useState(() => todayLog?.symptoms || []);
  const [quickEnergy, setQuickEnergy] = useState(() => todayLog?.energy ?? 3);
  const [quickSleep, setQuickSleep] = useState(() => todayLog?.sleepHours ?? 7);
  const [quickSavedToast, setQuickSavedToast] = useState(false);

  // Extract all logged period start dates safely
  const entries = Object.entries(appData.logsByDate || {})
    .filter(([d, log]) => isValidDateOnly(d) && log?.period?.isPeriod === true)
    .sort(([a], [b]) => a.localeCompare(b));

  const periodDatesSet = new Set(entries.map(([d]) => d));
  const periodStarts = entries
    .map(([d]) => d)
    .filter((date) => !periodDatesSet.has(addDays(date, -1)));

  const hasPeriodRecords = periodStarts.length > 0;
  const totalDaysLogged = Object.keys(appData.logsByDate || {}).length;

  // Calculate prediction using the lib engine
  const predictionData = (() => {
    try {
      return calculateCyclePrediction(periodStarts);
    } catch {
      return null;
    }
  })();

  // Calculate real cycle day based on latest period start
  const latestPeriodStart = hasPeriodRecords
    ? periodStarts[periodStarts.length - 1]
    : null;

  let currentCycleDay = null;
  if (latestPeriodStart) {
    const diff = daysBetween(latestPeriodStart, today);
    if (diff >= 0) {
      currentCycleDay = diff + 1;
    }
  }

  // Health safety evaluation
  const safetyEvaluation = (() => {
    try {
      return evaluateHealthSafety(appData);
    } catch {
      return null;
    }
  })();
  const hasUrgent = safetyEvaluation?.urgentFindings?.length > 0;
  const hasDoctor = safetyEvaluation?.doctorFindings?.length > 0;

  // Dynamic greeting based on current local hour (never hardcoded)
  const currentHour = new Date().getHours();
  let greetingKey = "greetingMorning";
  if (currentHour >= 12 && currentHour < 17) {
    greetingKey = "greetingAfternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    greetingKey = "greetingEvening";
  } else if (currentHour >= 22 || currentHour < 5) {
    greetingKey = "greetingNight";
  }
  const greetingTimeText = t("today", greetingKey);

  function toggleSymptom(sym) {
    setQuickSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
  }

  function handleQuickSave() {
    const isPeriod = quickFlow !== "none";
    updateDayLog(today, {
      ...(todayLog || {}),
      period: {
        isPeriod,
        flow: isPeriod ? quickFlow : "none",
      },
      mood: quickMood,
      symptoms: quickSymptoms,
      energy: quickEnergy,
      sleepHours: quickSleep,
      pain: todayLog?.pain ?? {
        level: isPeriod ? 1 : 0,
        stopsDailyLife: false,
      },
    });
    setQuickSavedToast(true);
    setTimeout(() => setQuickSavedToast(false), 3000);
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* 1. Calm, Personal Welcome Editorial Banner with Local Date */}
      <EditorialBanner
        variant="wellness"
        tag={
          <span className="flex items-center gap-1.5">
            <IconLotus className="h-3.5 w-3.5 text-[#79516F] dark:text-[#E8A8BF]" />
            <span>{isDiscreet ? t("discreetNav", "today") : t("today", "cycleDay")}</span>
          </span>
        }
        title={`${greetingTimeText}, Saheli`}
        description={isDiscreet ? t("common", "discreetTagline") : t("today", "subtitle")}
        badge={
          <span className="flex items-center gap-1.5">
            <IconCalendar className="h-3.5 w-3.5 text-[#79516F] dark:text-[#E8A8BF]" />
            <span>{formatFriendlyDate(today, lang)}</span>
          </span>
        }
        primaryAction={{
          label: isDiscreet ? t("discreetNav", "log") : t("today", "quickLogAction"),
          onClick: onNavigateToLog,
          icon: <IconArrowRight className="h-4 w-4" />,
        }}
      />


      {/* 2. Medical Urgent Alert Banner (if safety rules detect an acute concern) */}
      {(hasUrgent || hasDoctor) && (
        <aside
          role="alert"
          className={`rounded-2xl border p-4 shadow-xs transition-all ${
            hasUrgent
              ? "border-[#F4B8B0] bg-[#FDF2F0] text-[#8F1D1D] dark:bg-[#341619] dark:border-[#5C2329] dark:text-[#FFB3B8]"
              : "border-amber-200 bg-amber-50 text-amber-900 dark:bg-[#332211] dark:border-[#5E3F1F] dark:text-[#FFE0B2]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5" aria-hidden="true">
                {hasUrgent ? (
                  <IconAlertOctagon className="h-5 w-5 text-[#8F1D1D] dark:text-[#FFB3B8]" />
                ) : (
                  <IconAlertTriangle className="h-5 w-5 text-amber-800 dark:text-[#FFE0B2]" />
                )}
              </span>
              <div>
                <h2 className="font-serif font-bold text-sm">
                  {hasUrgent ? t("doctor", "urgentBanner") : t("doctor", "safetyNotice")}
                </h2>
                <p className="mt-1 text-xs leading-relaxed">
                  {hasUrgent
                    ? t("doctor", "urgentNotice")
                    : "Some recorded symptoms or cycle patterns suggest consulting a healthcare provider for personalized advice."}
                </p>
              </div>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("doctor")}
                className="touch-target shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#281F30] px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-[#34263E] text-[#292536] dark:text-[#F7EDF5] border border-[#DECED9] dark:border-[#42324C]"
              >
                <span>{t("nav", "doctor")}</span>
                <IconArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </aside>
      )}

      {/* 3. Main Composition: Cycle Overview (7 cols) & Daily Check-in (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Real Cycle Clock & Insights */}
        <section className="lg:col-span-7 space-y-6">
          {/* Cycle Clock Card */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
                  {isDiscreet ? "Wellness Cycle Clock" : t("today", "cycleDay")}
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {hasPeriodRecords && latestPeriodStart
                    ? `${lang === "hi" ? "अंतिम शुरुआत:" : "Last period start:"} ${latestPeriodStart}`
                    : lang === "hi"
                    ? "कोई रिकॉर्ड नहीं — अपनी पहली माहवारी दर्ज करें"
                    : "No period logged yet — track your first cycle"}
                </p>
              </div>

              {predictionData?.prediction?.available && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DCEBDD] dark:bg-[#203624] px-3 py-1 text-xs font-semibold text-[#3F6344] dark:text-[#88C690] border border-[#A2C8A5]/40">
                  <IconSparkles className="h-3 w-3" />
                  <span>{lang === "hi" ? "पूर्वानुमान सक्रिय" : "Forecast Active"}</span>
                </span>
              )}
            </div>

            {/* If user has not logged any period: show clean, honest empty state */}
            {!hasPeriodRecords ? (
              <div className="py-8 px-4 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--card-subtle)] border border-[var(--line)] flex items-center justify-center text-[var(--plum)]">
                  <IconLotus className="h-8 w-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                    {lang === "hi" ? "अपना पहला चक्र शुरू करें" : "Begin Tracking Your Cycle"}
                  </h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {lang === "hi"
                      ? "अपनी पहली माहवारी की शुरुआत दर्ज करें। इसके बाद आपकी व्यक्तिगत चक्र घड़ी, चरण गाइड और पूर्वानुमान सक्रिय हो जाएंगे।"
                      : "Log your first period start date to activate your personalized cycle clock, phase forecast, and wellness windows. Estimates are never invented without real records."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToLog}
                  className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#633E5A] dark:hover:bg-[#A06B95] transition-all shadow-xs"
                >
                  <IconLog className="h-3.5 w-3.5" />
                  <span>{t("today", "quickLogAction")}</span>
                  <IconArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* Real Interactive Cycle Wheel */
              <CycleWheel
                currentCycleDay={currentCycleDay}
                cycleLength={predictionData?.medianCycleLength || 28}
                prediction={predictionData?.prediction}
                onNavigateToLog={onNavigateToLog}
              />
            )}

            {/* Upcoming Cycle Metrics */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4">
                <div className="flex items-center gap-1.5">
                  <IconDroplet className="h-3.5 w-3.5 text-[var(--plum)]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--plum)]">
                    {t("today", "nextPeriod")}
                  </span>
                </div>
                <p className="mt-1 font-serif text-lg font-bold text-[var(--ink)]">
                  {predictionData?.prediction?.available && predictionData.prediction.estimatedDate
                    ? `${predictionData.prediction.estimatedDate}`
                    : "--"}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {predictionData?.prediction?.available
                    ? `±${predictionData.prediction.spreadDays} ${t("common", "days")}`
                    : hasPeriodRecords
                    ? lang === "hi"
                      ? "अधिक चक्र पूर्ण होने पर अनुमान उपलब्ध होगा"
                      : "Log 2+ cycles for automatic predictions"
                    : t("emptyStates", "noInsights")}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4">
                <div className="flex items-center gap-1.5">
                  <IconLotus className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F6344] dark:text-[#88C690]">
                    {isDiscreet ? "Wellness Window" : t("calculators", "fertileWindow")}
                  </span>
                </div>
                <p className="mt-1 font-serif text-lg font-bold text-[var(--ink)]">
                  {predictionData?.ovulationEstimate?.estimatedDate
                    ? `${predictionData.ovulationEstimate.estimatedDate}`
                    : "--"}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                  {predictionData?.ovulationEstimate
                    ? t("today", "cycleWheelDisclaimer")
                    : t("emptyStates", "noInsights")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Real Data Insights Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-center shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "दर्ज दिवस" : "Days Logged"}
              </span>
              <p className="mt-1 font-serif text-xl font-bold text-[var(--plum)]">
                {totalDaysLogged}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-center shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "औसत चक्र" : "Avg Cycle"}
              </span>
              <p className="mt-1 font-serif text-xl font-bold text-[var(--ink)]">
                {predictionData?.medianCycleLength
                  ? `${predictionData.medianCycleLength}d`
                  : "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-center shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "नियमितता" : "Regularity"}
              </span>
              <p className="mt-1 font-serif text-sm font-bold text-[#3F6344] dark:text-[#88C690]">
                {predictionData?.prediction?.available
                  ? predictionData.prediction.isRegular
                    ? t("insights", "regular")
                    : t("insights", "irregular")
                  : t("insights", "insufficientData")}
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Daily Wellness Check-in & Navigation Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Daily Check-in Card */}
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
                  {t("today", "quickCheckIn")}
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {todayLog ? t("today", "completedToday") : t("common", "today")}
                </p>
              </div>
              <IconSparkles className="h-5 w-5 text-[var(--plum)]" />
            </div>

            {/* 1. Period Flow Quick Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-2">
                {t("logForm", "flow")}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  {
                    id: "none",
                    label: t("logForm", "flowNone"),
                    icon: (active) => (
                      <IconMinus
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "spotting",
                    label: t("logForm", "flowSpotting"),
                    icon: (active) => (
                      <IconDroplet
                        strokeWidth="1.2"
                        className={`h-4 w-4 shrink-0 transition-colors opacity-80 ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "light",
                    label: t("logForm", "flowLight"),
                    icon: (active) => (
                      <IconDroplet
                        strokeWidth="1.8"
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "heavy",
                    label: t("logForm", "flowHeavy"),
                    icon: (active) => (
                      <IconDroplets
                        strokeWidth="1.8"
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                ].map((item) => {
                  const isSelected = quickFlow === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuickFlow(item.id)}
                      aria-pressed={isSelected}
                      className={`touch-target rounded-xl py-2 px-1 text-xs font-semibold text-center transition-all border inline-flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] focus-visible:ring-offset-1 ${
                        isSelected
                          ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                          : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--plum-light)]"
                      }`}
                    >
                      {item.icon(isSelected)}
                      <span className="truncate">{stripEmoji(item.label)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Quick Mood Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-2">
                {t("logForm", "mood")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    id: "calm",
                    label: t("logForm", "moodCalm"),
                    icon: (active) => (
                      <IconSmile
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "happy",
                    label: t("logForm", "moodHappy"),
                    icon: (active) => (
                      <IconSmilePlus
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "sensitive",
                    label: t("logForm", "moodSensitive"),
                    icon: (active) => (
                      <IconHeart
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "low",
                    label: t("logForm", "moodLow"),
                    icon: (active) => (
                      <IconFrown
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                  {
                    id: "anxious",
                    label: t("logForm", "moodAnxious"),
                    icon: (active) => (
                      <IconCloud
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-white" : "text-[var(--plum)]"
                        }`}
                        aria-hidden="true"
                      />
                    ),
                  },
                ].map((item) => {
                  const isSelected = quickMood === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuickMood(item.id)}
                      aria-pressed={isSelected}
                      className={`touch-target rounded-xl px-3 py-1.5 text-xs font-medium transition-all border inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] focus-visible:ring-offset-1 ${
                        isSelected
                          ? "bg-[#79516F] text-white border-[#79516F] shadow-xs font-bold dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                          : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--plum-light)]"
                      }`}
                    >
                      {item.icon(isSelected)}
                      <span>{stripEmoji(item.label)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Energy & Sleep Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[var(--muted)]">{t("logForm", "energy")}</span>
                  <span className="font-bold text-[var(--plum)]">{quickEnergy}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={quickEnergy}
                  onChange={(e) => setQuickEnergy(Number(e.target.value))}
                  className="w-full accent-[#79516F] dark:accent-[#8D5C82]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[var(--muted)]">{t("logForm", "sleepHours")}</span>
                  <span className="font-bold text-[var(--plum)]">{quickSleep}h</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={quickSleep}
                  onChange={(e) => setQuickSleep(Number(e.target.value))}
                  className="w-full accent-[#79516F] dark:accent-[#8D5C82]"
                />
              </div>
            </div>

            {/* 4. Quick Symptoms Chips */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-2">
                {t("logForm", "symptoms")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "cramps", label: t("logForm", "symptomCramps"), icon: <IconCramp className="h-3.5 w-3.5" /> },
                  { id: "headache", label: t("logForm", "symptomHeadache"), icon: <IconHeadache className="h-3.5 w-3.5" /> },
                  { id: "bloating", label: t("logForm", "symptomBloating"), icon: <IconBloating className="h-3.5 w-3.5" /> },
                  { id: "fatigue", label: t("logForm", "symptomFatigue"), icon: <IconFatigue className="h-3.5 w-3.5" /> },
                  { id: "acne", label: t("logForm", "symptomAcne"), icon: <IconAcne className="h-3.5 w-3.5" /> },
                ].map((item) => {
                  const isChecked = quickSymptoms.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSymptom(item.id)}
                      className={`touch-target rounded-xl px-3 py-1.5 text-xs font-medium transition-all border inline-flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-[#DCEBDD] text-[#3F6344] border-[#3F6344] font-semibold dark:bg-[#1E3722] dark:text-[#88C690] dark:border-[#88C690]"
                          : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {isChecked ? <IconCheck className="h-3 w-3 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickSave}
                className="touch-target w-full rounded-2xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] py-3 text-sm font-semibold text-white shadow-xs transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#79516F]"
              >
                {quickSavedToast ? (
                  <>
                    <IconCheck className="h-4 w-4" />
                    <span>{t("today", "completedToday")}</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="h-4 w-4" />
                    <span>{t("buttons", "save")}</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Quick Hub Navigation Shortcuts */}
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[var(--ink)]">
              {lang === "hi" ? "उपयोगी शॉर्टकट" : "Quick Shortcuts"}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigateToTab?.("calendar")}
                className="touch-target flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 font-semibold text-[var(--ink)] hover:bg-[var(--plum-light)] text-left transition-colors"
              >
                <IconCalendar className="h-4 w-4 text-[var(--plum)] shrink-0" />
                <span>{t("nav", "calendar")}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab?.("insights")}
                className="touch-target flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 font-semibold text-[var(--ink)] hover:bg-[var(--plum-light)] text-left transition-colors"
              >
                <IconInsights className="h-4 w-4 text-[var(--plum)] shrink-0" />
                <span>{t("nav", "insights")}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab?.("myspace")}
                className="touch-target flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 font-semibold text-[var(--ink)] hover:bg-[var(--plum-light)] text-left transition-colors"
              >
                <IconMySpace className="h-4 w-4 text-[var(--plum)] shrink-0" />
                <span>{t("nav", "myspace")}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab?.("pet")}
                className="touch-target flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 font-semibold text-[var(--ink)] hover:bg-[var(--plum-light)] text-left transition-colors"
              >
                <IconPet className="h-4 w-4 text-[var(--plum)] shrink-0" />
                <span>{t("nav", "pet")}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


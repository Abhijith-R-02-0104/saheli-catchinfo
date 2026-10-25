import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { calculateCyclePrediction } from "../../lib/cycle.js";
import { getTodayLocalDate, daysBetween, addDays, isValidDateOnly } from "../../lib/dates.js";
import { evaluateHealthSafety } from "../../lib/safety.js";
import { CycleWheel } from "../cycle/CycleWheel.jsx";
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
  IconLog,
  IconAsk,
  IconPlus,
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
  const todayLog = appData.logsByDate?.[today] ?? null;
  const isDiscreet = Boolean(appData.settings?.discreetMode);

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

  const energyLabels = [
    lang === "hi" ? "कम" : "Low",
    lang === "hi" ? "धीमी" : "Gentle",
    lang === "hi" ? "संतुलित" : "Balanced",
    lang === "hi" ? "सक्रिय" : "Active",
    lang === "hi" ? "उच्च" : "Peak",
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* 1. Calm, Personal Welcome Editorial Hero Area */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-subtle)] p-6 sm:p-8 shadow-xs">
        {/* Subtle decorative background watermarks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#E9B7C8]/15 dark:bg-[#3D2636]/20 blur-2xl"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card-subtle)] px-3 py-1 text-xs">
              <IconLotus className="h-3.5 w-3.5 text-[var(--plum)] dark:text-[#E8A8BF]" aria-hidden="true" />
              <span className="font-semibold text-[var(--plum)] dark:text-[#E8A8BF]">
                {isDiscreet ? t("discreetNav", "today") : t("common", "appName")}
              </span>
              <span className="text-[var(--line-strong)]" aria-hidden="true">·</span>
              <span className="text-[var(--muted)]">
                {formatFriendlyDate(today, lang)}
              </span>
            </div>

            {/* Time-sensitive Personalized Greeting */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--ink)] tracking-tight">
              {greetingTimeText}, Saheli
            </h1>

            {/* Supportive Context Note */}
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {isDiscreet
                ? t("common", "discreetTagline")
                : currentCycleDay
                ? `${lang === "hi" ? "आज आपके चक्र का" : "Today is"} ${lang === "hi" ? `दिन ${currentCycleDay}` : `Cycle Day ${currentCycleDay}`}. ${t("today", "subtitle")}`
                : t("today", "subtitle")}
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateToLog}
              className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#633E5A] dark:hover:bg-[#A06B95] transition-all hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[var(--plum)]"
            >
              <IconLog className="h-4 w-4" aria-hidden="true" />
              <span>{isDiscreet ? t("discreetNav", "log") : t("today", "quickLogAction")}</span>
              <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Medical Urgent Alert Banner (if safety evaluator detects a red flag) */}
      {(hasUrgent || hasDoctor) && (
        <aside
          role="alert"
          aria-live="polite"
          className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition-all ${
            hasUrgent
              ? "border-[#F4B8B0] bg-[#FDF2F0] text-[#8F1D1D] dark:bg-[#341619] dark:border-[#5C2329] dark:text-[#FFB3B8]"
              : "border-amber-200 bg-amber-50 text-amber-900 dark:bg-[#332211] dark:border-[#5E3F1F] dark:text-[#FFE0B2]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                <p className="mt-1 text-xs leading-relaxed max-w-2xl">
                  {hasUrgent
                    ? t("doctor", "urgentNotice")
                    : "Some recorded symptoms or cycle patterns suggest consulting a healthcare provider for personalized guidance."}
                </p>
              </div>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("doctor")}
                className="touch-target shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#281F30] px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-[#34263E] text-[#292536] dark:text-[#F7EDF5] border border-[#DECED9] dark:border-[#42324C]"
              >
                <span>{t("nav", "doctor")}</span>
                <IconArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </aside>
      )}

      {/* 3. Main Dashboard Layout (Asymmetric 12-col grid) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (7 cols): Cycle Overview & Metrics */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          {/* Cycle Clock & Visualization Card */}
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
                  {isDiscreet ? "Wellness Cycle Clock" : t("today", "cycleDay")}
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {hasPeriodRecords && latestPeriodStart
                    ? `${lang === "hi" ? "अंतिम माहवारी शुरुआत:" : "Latest period start:"} ${latestPeriodStart}`
                    : lang === "hi"
                    ? "कोई रिकॉर्ड नहीं — अपना पहला चक्र शुरू करें"
                    : "No period logged yet — track your first cycle"}
                </p>
              </div>

              {predictionData?.prediction?.available && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DCEBDD] dark:bg-[#1E3322] px-3 py-1 text-xs font-semibold text-[#3F6344] dark:text-[#88C690] border border-[#A2C8A5]/40">
                  <IconSparkles className="h-3 w-3" />
                  <span>{lang === "hi" ? "पूर्वानुमान सक्रिय" : "Forecast Active"}</span>
                </span>
              )}
            </div>

            {/* Empty State vs Real Interactive Cycle Clock */}
            {!hasPeriodRecords ? (
              <div className="py-10 px-4 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--card-subtle)] border border-[var(--line)] flex items-center justify-center text-[var(--plum)]">
                  <IconLotus className="h-8 w-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                    {lang === "hi" ? "अपना पहला चक्र शुरू करें" : "Begin Tracking Your Cycle"}
                  </h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {lang === "hi"
                      ? "अपनी पहली माहवारी की शुरुआत दर्ज करें। इसके बाद आपकी व्यक्तिगत चक्र घड़ी, चरण गाइड और पूर्वानुमान सक्रिय हो जाएंगे। बिना वास्तविक डेटा के कभी भी अनुमान नहीं लगाए जाते।"
                      : "Log your first period start date to activate your personalized cycle clock, phase forecast, and wellness windows. Estimates are never fabricated without real records."}
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
              <CycleWheel
                currentCycleDay={currentCycleDay}
                cycleLength={predictionData?.medianCycleLength || 28}
                prediction={predictionData?.prediction}
                onNavigateToLog={onNavigateToLog}
              />
            )}

            {/* Upcoming Cycle Metrics Cards */}
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
                      ? "2 चक्र पूर्ण होने पर अनुमान उपलब्ध होगा"
                      : "Log 2+ cycles for predictions"
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
          </section>

          {/* Real Logged Statistics Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-center shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "दर्ज दिवस" : "Days Logged"}
              </span>
              <p className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[var(--plum)]">
                {totalDaysLogged}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-center shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "औसत चक्र" : "Avg Cycle"}
              </span>
              <p className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                {predictionData?.medianCycleLength
                  ? `${predictionData.medianCycleLength}d`
                  : "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-center shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "नियमितता" : "Regularity"}
              </span>
              <p className="mt-1 font-serif text-xs sm:text-sm font-bold text-[#3F6344] dark:text-[#88C690] truncate">
                {predictionData?.prediction?.available
                  ? predictionData.prediction.isRegular
                    ? t("insights", "regular")
                    : t("insights", "irregular")
                  : t("insights", "insufficientData")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Daily Check-in Panel & Quick Shortcuts */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          {/* Quick Check-in Card */}
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
              <div className="h-8 w-8 rounded-full bg-[var(--card-subtle)] border border-[var(--line)] flex items-center justify-center text-[var(--plum)]">
                <IconSparkles className="h-4 w-4" />
              </div>
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
                      className={`touch-target rounded-xl py-2 px-1 text-xs font-semibold text-center transition-all border inline-flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] ${
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

            {/* 2. Mood Selector */}
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
                      className={`touch-target rounded-xl px-3 py-1.5 text-xs font-medium transition-all border inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] ${
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

            {/* 3. Energy Rating (Accessible 1 to 5 buttons) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-[var(--muted)]">
                  {t("logForm", "energy")}
                </span>
                <span className="font-semibold text-[var(--plum)]">
                  {energyLabels[quickEnergy - 1]} ({quickEnergy}/5)
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const isSelected = quickEnergy === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuickEnergy(lvl)}
                      aria-pressed={isSelected}
                      className={`touch-target rounded-xl py-2 text-xs font-bold transition-all border text-center ${
                        isSelected
                          ? "bg-[#79516F] text-white border-[#79516F] shadow-2xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                          : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--plum-light)]"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Sleep Hours Stepper */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-[var(--muted)]">
                  {t("logForm", "sleepHours")}
                </span>
                <span className="font-semibold text-[var(--plum)]">
                  {quickSleep} {t("common", "hours") || "hours"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-2">
                <button
                  type="button"
                  onClick={() => setQuickSleep((s) => Math.max(4, s - 0.5))}
                  className="touch-target inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
                  aria-label="Decrease sleep hours"
                >
                  <IconMinus className="h-4 w-4" />
                </button>
                <div className="text-center font-serif text-base font-bold text-[var(--ink)]">
                  {quickSleep} hrs
                </div>
                <button
                  type="button"
                  onClick={() => setQuickSleep((s) => Math.min(14, s + 0.5))}
                  className="touch-target inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
                  aria-label="Increase sleep hours"
                >
                  <IconPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 5. Quick Symptoms Chips */}
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
                      aria-pressed={isChecked}
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

            {/* Save Button with Toast State */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickSave}
                className="touch-target w-full rounded-2xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] py-3 text-sm font-bold text-white shadow-xs transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#79516F] cursor-pointer"
              >
                <IconCheck className="h-4 w-4" />
                <span>{quickSavedToast ? t("today", "completedToday") : t("buttons", "save")}</span>
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
                onClick={() => onNavigateToTab?.("ask")}
                className="touch-target flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 font-semibold text-[var(--ink)] hover:bg-[var(--plum-light)] text-left transition-colors"
              >
                <IconAsk className="h-4 w-4 text-[var(--plum)] shrink-0" />
                <span>{t("nav", "ask")}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

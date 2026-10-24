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
import {
  IconCalendar,
  IconCalculators,
  IconMoon,
  IconLotus,
  IconInsights,
} from "../common/Icons.jsx";


export function CalculatorsView() {
  const { appData } = useAppData();
  const { lang, t } = useTranslation();

  const today = getTodayLocalDate();

  // Extract logged period starts to provide autofill
  const entries = Object.entries(appData.logsByDate || {})
    .filter(([d, log]) => isValidDateOnly(d) && log?.period?.isPeriod === true)
    .sort(([a], [b]) => a.localeCompare(b));

  const periodDatesSet = new Set(entries.map(([d]) => d));
  const periodStarts = entries
    .map(([d]) => d)
    .filter((date) => !periodDatesSet.has(addDays(date, -1)));

  let cycleData = null;
  try {
    cycleData = calculateCyclePrediction(periodStarts);
  } catch {
    cycleData = null;
  }

  const defaultLastPeriod = periodStarts.length > 0 ? periodStarts[periodStarts.length - 1] : today;
  const defaultCycleLength = cycleData?.medianCycleLength ? Math.round(cycleData.medianCycleLength) : 28;

  // Active calculator tab
  const [activeCalc, setActiveCalc] = useState("period");

  // Calculator 1 & 4 & 3 shared inputs
  const [inputLastDate, setInputLastDate] = useState(defaultLastPeriod);
  const [inputCycleLength, setInputCycleLength] = useState(defaultCycleLength);

  // Calculator 2 (Manual cycle lengths)
  const [manualDate1, setManualDate1] = useState(periodStarts[periodStarts.length - 2] || addDays(today, -28));
  const [manualDate2, setManualDate2] = useState(periodStarts[periodStarts.length - 1] || today);

  // Autofill action
  function handleAutofill() {
    if (periodStarts.length > 0) {
      setInputLastDate(periodStarts[periodStarts.length - 1]);
    }
    if (cycleData?.medianCycleLength) {
      setInputCycleLength(Math.round(cycleData.medianCycleLength));
    }
  }

  // 1. Period Estimator Results
  const validLength = Math.max(15, Math.min(60, Number(inputCycleLength) || 28));
  const nextPeriodEstimate = isValidDateOnly(inputLastDate)
    ? addDays(inputLastDate, validLength)
    : null;
  const daysUntilNextPeriod = nextPeriodEstimate
    ? daysBetween(today, nextPeriodEstimate)
    : null;

  // 4. Ovulation Estimator Results
  const ovulationDay = nextPeriodEstimate ? addDays(nextPeriodEstimate, -14) : null;
  const fertileStart = ovulationDay ? addDays(ovulationDay, -5) : null;
  const fertileEnd = ovulationDay ? ovulationDay : null;

  // 3. Phase Estimator Results
  const daysSinceLast = isValidDateOnly(inputLastDate) ? daysBetween(inputLastDate, today) + 1 : 1;
  let currentPhaseNameEn;
  let currentPhaseNameHi;
  if (daysSinceLast <= 5) {
    currentPhaseNameEn = "Menstrual Phase";
    currentPhaseNameHi = "माहवारी चरण";
  } else if (daysSinceLast <= validLength - 15) {
    currentPhaseNameEn = "Follicular Phase";
    currentPhaseNameHi = "फॉलिक्युलर चरण";
  } else if (daysSinceLast <= validLength - 11) {
    currentPhaseNameEn = "Ovulation Window";
    currentPhaseNameHi = "ओव्यूलेशन खिड़की";
  } else {
    currentPhaseNameEn = "Luteal Phase";
    currentPhaseNameHi = "ल्यूटियल चरण";
  }

  // 2. Cycle Length Calculator Results
  const manualDiffDays =
    isValidDateOnly(manualDate1) && isValidDateOnly(manualDate2)
      ? Math.abs(daysBetween(manualDate1, manualDate2))
      : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hub Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
          {t("nav", "calculators")}
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          {t("calculators", "title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("calculators", "subtitle")}
        </p>
      </div>

      {/* Navigation Tabs for Calculators */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-3">
        {[
          { id: "period", label: t("calculators", "periodEstimator"), icon: <IconCalendar className="h-3.5 w-3.5" /> },
          { id: "cycleLength", label: t("calculators", "cycleLengthCalc"), icon: <IconCalculators className="h-3.5 w-3.5" /> },
          { id: "phase", label: t("calculators", "phaseEstimator"), icon: <IconMoon className="h-3.5 w-3.5" /> },
          { id: "ovulation", label: t("calculators", "ovulationCalc"), icon: <IconLotus className="h-3.5 w-3.5" /> },
          { id: "variability", label: t("calculators", "variabilityCalc"), icon: <IconInsights className="h-3.5 w-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCalc(tab.id)}
            className={`touch-target flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all border ${
              activeCalc === tab.id
                ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Calculator Body */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Autofill from existing logs button */}
        {periodStarts.length > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-[var(--card-subtle)] p-4 border border-[var(--line)]">
            <div className="text-xs">
              <strong className="text-[var(--plum)]">
                {lang === "hi" ? "लॉग किया गया डेटा उपलब्ध है" : "Logged records found:"}
              </strong>{" "}
              {periodStarts.length} {lang === "hi" ? "माहवारी शुरुआत दर्ज हैं" : "period starts recorded"}.
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="touch-target rounded-xl bg-[#79516F] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
            >
              {t("calculators", "useMyData")}
            </button>
          </div>
        )}

        {/* 1. Period Date Estimator */}
        {activeCalc === "period" && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
              {t("calculators", "periodEstimator")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {t("calculators", "lastPeriodDate")}
                </label>
                <input
                  type="date"
                  value={inputLastDate}
                  onChange={(e) => setInputLastDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {t("calculators", "typicalCycleLength")}
                </label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  value={inputCycleLength}
                  onChange={(e) => setInputCycleLength(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>
            </div>

            {/* Result Display */}
            {nextPeriodEstimate && (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-6 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
                  {t("calculators", "resultEstimate")}
                </span>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[var(--plum)]">
                  {nextPeriodEstimate}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {daysUntilNextPeriod !== null
                    ? daysUntilNextPeriod > 0
                      ? lang === "hi"
                        ? `लगभग ${daysUntilNextPeriod} दिन में अपेक्षित (±2-3 दिन)`
                        : `Expected in about ${daysUntilNextPeriod} days (±2-3 days)`
                      : daysUntilNextPeriod === 0
                        ? lang === "hi"
                          ? "आज अपेक्षित है"
                          : "Expected today"
                        : lang === "hi"
                          ? `${Math.abs(daysUntilNextPeriod)} दिन पहले अपेक्षित थी`
                          : `Was expected ${Math.abs(daysUntilNextPeriod)} days ago`
                    : ""}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. Cycle Length Calculator */}
        {activeCalc === "cycleLength" && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
              {t("calculators", "cycleLengthCalc")}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {lang === "hi"
                ? "दो लगातार माहवारी शुरू होने की तारीखों के बीच के दिनों की गणना करें।"
                : "Calculate the exact number of calendar days between two consecutive period starts."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {lang === "hi" ? "पहली माहवारी की शुरुआत" : "First period start date"}
                </label>
                <input
                  type="date"
                  value={manualDate1}
                  onChange={(e) => setManualDate1(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {lang === "hi" ? "अगली माहवारी की शुरुआत" : "Next period start date"}
                </label>
                <input
                  type="date"
                  value={manualDate2}
                  onChange={(e) => setManualDate2(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>
            </div>

            {manualDiffDays !== null && (
              <div className="rounded-2xl border border-[#DCEBDD] dark:border-[#2F5A35] bg-[#F4FAF5] dark:bg-[#1E3722] p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F6344] dark:text-[#88C690]">
                  {t("insights", "averageCycle")}
                </span>
                <p className="font-serif text-3xl font-bold text-[#3F6344] dark:text-[#88C690]">
                  {manualDiffDays} {t("common", "days")}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {manualDiffDays >= 21 && manualDiffDays <= 35
                    ? lang === "hi"
                      ? "यह सामान्य वयस्क सीमा (21-35 दिन) के भीतर है।"
                      : "This is within the typical adult range (21–35 days)."
                    : lang === "hi"
                      ? "यह सामान्य वयस्क सीमा (21-35 दिन) से भिन्न है।"
                      : "This falls outside the typical adult range (21–35 days)."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. Menstrual Phase Estimator */}
        {activeCalc === "phase" && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
              {t("calculators", "phaseEstimator")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {t("calculators", "lastPeriodDate")}
                </label>
                <input
                  type="date"
                  value={inputLastDate}
                  onChange={(e) => setInputLastDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {t("calculators", "typicalCycleLength")}
                </label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  value={inputCycleLength}
                  onChange={(e) => setInputCycleLength(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)]"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
                    {lang === "hi" ? "अनुमानित साइकिल दिवस" : "Estimated Cycle Day"}
                  </span>
                  <p className="font-serif text-2xl font-bold text-[var(--ink)]">
                    {lang === "hi" ? `दिन ${daysSinceLast}` : `Day ${daysSinceLast}`}
                  </p>
                </div>
                <span className="rounded-xl bg-[#79516F] text-white px-3.5 py-1.5 text-xs font-bold dark:bg-[#8D5C82]">
                  {lang === "hi" ? currentPhaseNameHi : currentPhaseNameEn}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {lang === "hi"
                  ? "साइकिल के विभिन्न चरणों में हार्मोनल बदलाव स्वाभाविक रूप से ऊर्जा, मनोदशा और भूख को प्रभावित करते हैं।"
                  : "During different menstrual phases, hormonal fluctuations naturally influence energy, mood, and nutrient requirements."}
              </p>
            </div>
          </div>
        )}

        {/* 4. Ovulation & Fertile Window Estimator */}
        {activeCalc === "ovulation" && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
              {t("calculators", "ovulationCalc")}
            </h2>

            {/* Medical Warning Callout */}
            <div className="rounded-2xl border border-amber-300 dark:border-[#5E3F1F] bg-amber-50 dark:bg-[#332211] p-4 text-xs text-amber-900 dark:text-[#FFE0B2] flex items-start gap-3">
              <span className="text-base" aria-hidden="true">⚠️</span>
              <div>
                <strong className="font-bold">
                  {lang === "hi" ? "महत्वपूर्ण चिकित्सीय सूचना:" : "Critical Medical Notice:"}
                </strong>{" "}
                {t("calculators", "disclaimer")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {t("calculators", "lastPeriodDate")}
                </label>
                <input
                  type="date"
                  value={inputLastDate}
                  onChange={(e) => setInputLastDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {t("calculators", "typicalCycleLength")}
                </label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  value={inputCycleLength}
                  onChange={(e) => setInputCycleLength(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm font-semibold text-[var(--ink)]"
                />
              </div>
            </div>

            {ovulationDay && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#DCEBDD] dark:border-[#2F5A35] bg-[#F4FAF5] dark:bg-[#1E3722] p-5 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3F6344] dark:text-[#88C690]">
                    {t("calculators", "ovulationDay")}
                  </span>
                  <p className="mt-1 font-serif text-xl font-bold text-[#3F6344] dark:text-[#88C690]">
                    {ovulationDay}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">
                    {lang === "hi" ? "माहवारी से लगभग 14 दिन पहले" : "~14 days before next period"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E9B7C8] dark:border-[#5C2E4A] bg-[#FCF4F7] dark:bg-[#341F2E] p-5 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
                    {t("calculators", "fertileWindow")}
                  </span>
                  <p className="mt-1 font-serif text-xl font-bold text-[var(--plum)]">
                    {fertileStart} – {fertileEnd}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">
                    {lang === "hi" ? "6 दिन की जैविक खिड़की" : "6-day biological window"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Cycle Regularity & Variability */}
        {activeCalc === "variability" && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
              {t("calculators", "variabilityCalc")}
            </h2>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-5 space-y-4 text-xs leading-relaxed text-[var(--ink)]">
              <h3 className="font-serif text-base font-bold text-[var(--plum)]">
                {lang === "hi" ? "चिकित्सीय नियमितता मानक (ACOG व FOGSI)" : "Clinical Standards for Regularity (ACOG & FOGSI)"}
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>{lang === "hi" ? "वयस्क सामान्य सीमा:" : "Adult Normal Range:"}</strong>{" "}
                  {lang === "hi"
                    ? "21 से 35 दिन। एक चक्र से दूसरे चक्र में 7 से 9 दिनों तक का अंतर सामान्य माना जाता है।"
                    : "21 to 35 days. Cycle-to-cycle variation of up to 7–9 days is considered normal."}
                </li>
                <li>
                  <strong>{lang === "hi" ? "किशोरी सामान्य सीमा:" : "Adolescent Range:"}</strong>{" "}
                  {lang === "hi"
                    ? "माहवारी शुरू होने के शुरुआती 2-3 वर्षों में 21 से 45 दिनों का चक्र सामान्य है।"
                    : "During the first 2–3 years after menarche, cycles of 21 to 45 days are normal."}
                </li>
                <li>
                  <strong>{lang === "hi" ? "डॉक्टर से कब परामर्श लें:" : "When to Consult:"}</strong>{" "}
                  {lang === "hi"
                    ? "यदि चक्र लगातार 35 दिनों से अधिक लंबे हों, 21 दिनों से कम हों, या 90 दिनों से माहवारी न आई हो।"
                    : "If cycles are consecutively longer than 35 days, shorter than 21 days, or absent for 90 days."}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

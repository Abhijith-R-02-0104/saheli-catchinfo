import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { getTodayLocalDate, isValidDateOnly, addDays, daysBetween } from "../../lib/dates.js";

import {
  IconMinus,
  IconDroplet,
  IconDroplets,
  IconSmile,
  IconSmilePlus,
  IconHeart,
  IconFrown,
  IconCloud,
  IconZap,
  IconAlertTriangle,
  IconLock,
  IconLotus,
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
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

const DEFAULT_SYMPTOMS = [
  "cramps",
  "headache",
  "bloating",
  "fatigue",
  "acne",
  "backache",
  "nausea",
  "moodChanges",
  "sleepProblems",
  "breastTenderness",
];

const MOOD_OPTIONS = [
  { id: "calm", labelKey: "moodCalm", icon: IconSmile },
  { id: "happy", labelKey: "moodHappy", icon: IconSmilePlus },
  { id: "sensitive", labelKey: "moodSensitive", icon: IconHeart },
  { id: "low", labelKey: "moodLow", icon: IconFrown },
  { id: "anxious", labelKey: "moodAnxious", icon: IconCloud },
  { id: "irritable", labelKey: "moodIrritable", icon: IconZap },
  { id: "verylow", labelKey: "moodVeryLow", icon: IconFrown },
];

/**
 * Dedicated first-period setup flow:
 * Focuses directly on period start date, flow intensity, and clear Save/Cancel actions.
 * Optional daily wellness details (cramps, symptoms, mood, sleep, medicines, notes)
 * are cleanly accessible in an expandable section so setup is fast, clear, and unburdened.
 */
function FirstPeriodSetupForm({
  todayStr,
  initialDate,
  existingLog,
  onSave,
  onCancel,
  onSavedSuccess,
}) {
  const { lang, t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(
    initialDate && isValidDateOnly(initialDate) ? initialDate : todayStr,
  );
  const [flow, setFlow] = useState(
    existingLog?.period?.isPeriod ? existingLog.period.flow || "medium" : "medium",
  );
  const [frequentPadChange, setFrequentPadChange] = useState(
    Boolean(existingLog?.heavyBleeding?.frequentPadChange),
  );
  const [largeClots, setLargeClots] = useState(
    Boolean(existingLog?.heavyBleeding?.largeClots),
  );
  const [painLevel, setPainLevel] = useState(existingLog?.pain?.level ?? 0);
  const [stopsDailyLife, setStopsDailyLife] = useState(
    Boolean(existingLog?.pain?.stopsDailyLife),
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    existingLog?.symptoms || [],
  );
  const [mood, setMood] = useState(existingLog?.mood || "calm");
  const [energy, setEnergy] = useState(existingLog?.energy ?? 3);
  const [sleepHours, setSleepHours] = useState(existingLog?.sleepHours ?? 7);
  const [medicines, setMedicines] = useState(
    Array.isArray(existingLog?.medicines)
      ? existingLog.medicines.join(", ")
      : existingLog?.medicines || "",
  );
  const [privateNote, setPrivateNote] = useState(existingLog?.privateNote || "");
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleToggleSymptom(sym) {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    if (!selectedDate || !isValidDateOnly(selectedDate)) {
      setValidationError(t("errors", "invalidDate"));
      return;
    }

    // Validation: prevent future dates from being recorded as past period starts
    if (daysBetween(todayStr, selectedDate) > 0) {
      setValidationError(t("logForm", "futureDateError"));
      return;
    }

    // Validation: require an active flow selection
    if (!flow || flow === "none") {
      setValidationError(t("logForm", "flowRequiredError"));
      return;
    }

    const logPayload = {
      date: selectedDate,
      period: {
        isPeriod: true,
        flow,
      },
      pain: {
        level: Number(painLevel),
        stopsDailyLife: Boolean(stopsDailyLife),
      },
      heavyBleeding: {
        frequentPadChange: Boolean(frequentPadChange),
        largeClots: Boolean(largeClots),
      },
      symptoms: selectedSymptoms,
      mood,
      energy: Number(energy),
      sleepHours: Number(sleepHours),
      medicines: medicines
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      privateNote: privateNote.trim(),
    };

    onSave(selectedDate, logPayload);
    setSavedSuccess(true);
    if (onSavedSuccess) {
      setTimeout(() => {
        onSavedSuccess();
      }, 700);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <div className="rounded-2xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 p-3.5 text-xs text-red-800 dark:text-red-200 font-semibold flex items-center gap-2.5 shadow-2xs">
          <IconAlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step 1: Period Start Date Selection */}
      <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <label htmlFor="first-period-date" className="block font-serif text-base font-bold text-[var(--ink)]">
              {t("logForm", "periodStartDateLabel")}
            </label>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {t("logForm", "periodStartDateHelp")}
            </p>
          </div>

          <input
            id="first-period-date"
            type="date"
            max={todayStr}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setValidationError("");
            }}
            className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3.5 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F] shadow-2xs"
          />
        </div>

        {/* Quick Date Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--line)]/60">
          <span className="text-[11px] font-semibold text-[var(--muted)] select-none">
            {lang === "hi" ? "त्वरित चयन:" : "Quick pick:"}
          </span>
          {[
            { label: t("logForm", "quickDateToday"), date: todayStr },
            { label: t("logForm", "quickDateYesterday"), date: addDays(todayStr, -1) },
            { label: t("logForm", "quickDate2DaysAgo"), date: addDays(todayStr, -2) },
            { label: t("logForm", "quickDate3DaysAgo"), date: addDays(todayStr, -3) },
          ].map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => {
                setSelectedDate(item.date);
                setValidationError("");
              }}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedDate === item.date
                  ? "bg-[#79516F] text-white border-[#79516F] dark:bg-[#8D5C82] dark:border-[#8D5C82] shadow-xs"
                  : "border-[var(--line-strong)] bg-[var(--card)] text-[var(--ink)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Flow Intensity Selection */}
      <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 sm:p-5">
        <div>
          <label className="block font-serif text-base font-bold text-[var(--ink)]">
            {t("logForm", "flow")}
          </label>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {lang === "hi"
              ? "अपनी माहवारी के पहले दिन के अनुसार प्रवाह चुनें (जैसे मध्यम या हल्का)।"
              : "Select bleeding flow intensity for your period start day (typically medium or light)."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              id: "spotting",
              label: t("logForm", "flowSpotting"),
              icon: (active) => (
                <IconDroplet
                  strokeWidth="1.2"
                  className={`h-4 w-4 shrink-0 opacity-80 ${active ? "text-white" : "text-[var(--plum)] dark:text-[#E8A8BF]"}`}
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
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)] dark:text-[#E8A8BF]"}`}
                  aria-hidden="true"
                />
              ),
            },
            {
              id: "medium",
              label: t("logForm", "flowMedium"),
              icon: (active) => (
                <IconDroplet
                  filled
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)] dark:text-[#E8A8BF]"}`}
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
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)] dark:text-[#E8A8BF]"}`}
                  aria-hidden="true"
                />
              ),
            },
          ].map((item) => {
            const isSelected = flow === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFlow(item.id);
                  setValidationError("");
                }}
                aria-pressed={isSelected}
                className={`touch-target rounded-2xl p-3 text-xs font-semibold text-center transition-all border inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] focus-visible:ring-offset-1 cursor-pointer ${
                  isSelected
                    ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                    : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                }`}
              >
                {item.icon(isSelected)}
                <span className="truncate">{stripEmoji(item.label)}</span>
              </button>
            );
          })}
        </div>

        {/* Heavy Bleeding Indicators */}
        {["heavy", "medium"].includes(flow) && (
          <div className="mt-2 rounded-xl border border-[#E9B7C8] dark:border-[#5C2E4A] bg-[var(--card)] p-3.5 space-y-2">
            <span className="text-xs font-bold text-[var(--plum)] dark:text-[#E8A8BF] block">
              {t("logForm", "heavyBleedingDetails")}
            </span>
            <label className="flex items-center gap-2.5 text-xs text-[var(--ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={frequentPadChange}
                onChange={(e) => setFrequentPadChange(e.target.checked)}
                className="h-4 w-4 rounded accent-[#79516F]"
              />
              <span>{t("logForm", "frequentPadChange")}</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-[var(--ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={largeClots}
                onChange={(e) => setLargeClots(e.target.checked)}
                className="h-4 w-4 rounded accent-[#79516F]"
              />
              <span>{t("logForm", "largeClots")}</span>
            </label>
          </div>
        )}
      </div>

      {/* Step 3: Optional First-Day Wellness Details (Expandable) */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 sm:p-5 space-y-3">
        <button
          type="button"
          onClick={() => setShowOptionalDetails((prev) => !prev)}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-xl py-1"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[var(--ink)] group-hover:text-[var(--plum)] transition-colors">
                {t("logForm", "addOptionalDetails")}
              </span>
              <span className="text-[10px] text-[var(--muted)] font-medium">({lang === "hi" ? "वैकल्पिक" : "Optional"})</span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {t("logForm", "optionalWellnessDesc")}
            </p>
          </div>
          <IconChevronDown
            className={`h-4 w-4 text-[var(--muted)] shrink-0 transition-transform duration-300 ${
              showOptionalDetails ? "rotate-180 text-[var(--plum)]" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {showOptionalDetails && (
          <div className="pt-4 border-t border-[var(--line)] space-y-5 animate-in fade-in duration-200">
            {/* Cramps / Pain Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                  {t("logForm", "painLevel")} ({painLevel}/4)
                </label>
                <span className="text-xs font-semibold text-[var(--plum)] dark:text-[#E8A8BF]">
                  {painLevel === 0 && t("logForm", "painNone")}
                  {painLevel === 1 && t("logForm", "painMild")}
                  {painLevel === 2 && t("logForm", "painModerate")}
                  {painLevel === 3 && t("logForm", "painSevere")}
                  {painLevel === 4 && t("logForm", "painVerySevere")}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPainLevel(level)}
                    className={`touch-target rounded-xl py-2 text-xs font-bold transition-all border cursor-pointer ${
                      painLevel === level
                        ? "bg-[#79516F] text-white border-[#79516F] dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                        : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2.5 text-xs text-[var(--ink)] pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stopsDailyLife}
                  onChange={(e) => setStopsDailyLife(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#79516F]"
                />
                <span className="font-medium text-[#8F1D1D] dark:text-[#FFB3B8] inline-flex items-center gap-1.5">
                  <IconAlertTriangle className="h-4 w-4 shrink-0 text-[#8F1D1D] dark:text-[#FFB3B8]" aria-hidden="true" />
                  {t("logForm", "stopsDailyLife")}
                </span>
              </label>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                {t("logForm", "symptoms")}
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_SYMPTOMS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`touch-target rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border cursor-pointer ${
                        isChecked
                          ? "bg-[#DCEBDD] text-[#3F6344] border-[#3F6344] dark:bg-[#1E3722] dark:text-[#88C690] dark:border-[#2F5A35]"
                          : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {t("logForm", `symptom${sym.charAt(0).toUpperCase() + sym.slice(1)}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                {t("logForm", "mood")}
              </label>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((item) => {
                  const isSelected = mood === item.id;
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMood(item.id)}
                      className={`touch-target rounded-xl px-3 py-1.5 text-xs font-medium transition-all border inline-flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#79516F] text-white border-[#79516F] font-bold shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                          : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                      }`}
                    >
                      <IconComp
                        className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-[var(--plum)] dark:text-[#E8A8BF]"}`}
                        aria-hidden="true"
                      />
                      <span>{stripEmoji(t("logForm", item.labelKey))}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy & Sleep */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  {t("logForm", "energy")} ({energy}/5)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergy(lvl)}
                      className={`touch-target rounded-xl py-1.5 text-xs font-bold border cursor-pointer ${
                        energy === lvl
                          ? "bg-[#79516F] text-white border-[#79516F] dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                          : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)]"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="first-period-sleep" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  {t("logForm", "sleepHours")}
                </label>
                <input
                  id="first-period-sleep"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>
            </div>

            {/* Medicines & Private Note */}
            <div className="space-y-3">
              <div>
                <label htmlFor="first-period-medicines" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  {t("logForm", "medicines")}
                </label>
                <input
                  id="first-period-medicines"
                  type="text"
                  value={medicines}
                  onChange={(e) => setMedicines(e.target.value)}
                  placeholder={t("logForm", "medicinesPlaceholder")}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3.5 py-2 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>

              <div>
                <label htmlFor="first-period-note" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1 inline-flex items-center gap-1.5">
                  <IconLock className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
                  <span>{t("logForm", "privateNote")}</span>
                </label>
                <textarea
                  id="first-period-note"
                  rows="2"
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder={t("logForm", "privateNotePlaceholder")}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-3 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)]">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] focus-visible:outline-2 focus-visible:outline-[#79516F] cursor-pointer hover:scale-[1.02]"
          >
            <span>{t("logForm", "saveFirstPeriod")}</span>
            <IconCheck className="h-4 w-4" aria-hidden="true" />
          </button>

          {savedSuccess && (
            <span className="text-xs font-semibold text-[#3F6344] dark:text-[#88C690] bg-[#DCEBDD] dark:bg-[#1E3722] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
              <IconCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("logForm", "firstPeriodSavedSuccess")}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card-subtle)] cursor-pointer transition-colors"
        >
          {t("buttons", "cancel")}
        </button>
      </div>
    </form>
  );
}

/**
 * Standard Daily Wellness Logging Form:
 * Used for ongoing daily tracking, with full symptoms, moods, energy, pain, and sleep controls.
 */
function DailyLogFormContent({
  selectedDate,
  existingLog,
  onSave,
  onDelete,
}) {
  const { t } = useTranslation();
  const [validationError, setValidationError] = useState("");

  const [flow, setFlow] = useState(
    existingLog?.period?.isPeriod ? existingLog.period.flow || "medium" : "none",
  );
  const [painLevel, setPainLevel] = useState(existingLog?.pain?.level ?? 0);
  const [stopsDailyLife, setStopsDailyLife] = useState(
    Boolean(existingLog?.pain?.stopsDailyLife),
  );
  const [frequentPadChange, setFrequentPadChange] = useState(
    Boolean(existingLog?.heavyBleeding?.frequentPadChange),
  );
  const [largeClots, setLargeClots] = useState(
    Boolean(existingLog?.heavyBleeding?.largeClots),
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    existingLog?.symptoms || [],
  );
  const [mood, setMood] = useState(existingLog?.mood || "calm");
  const [energy, setEnergy] = useState(existingLog?.energy ?? 3);
  const [sleepHours, setSleepHours] = useState(existingLog?.sleepHours ?? 7);
  const [medicines, setMedicines] = useState(
    Array.isArray(existingLog?.medicines)
      ? existingLog.medicines.join(", ")
      : existingLog?.medicines || "",
  );
  const [privateNote, setPrivateNote] = useState(existingLog?.privateNote || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleToggleSymptom(sym) {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    const isPeriod = flow !== "none";

    const logPayload = {
      date: selectedDate,
      period: {
        isPeriod,
        flow: isPeriod ? flow : "none",
      },
      pain: {
        level: Number(painLevel),
        stopsDailyLife: Boolean(stopsDailyLife),
      },
      heavyBleeding: {
        frequentPadChange: Boolean(frequentPadChange),
        largeClots: Boolean(largeClots),
      },
      symptoms: selectedSymptoms,
      mood,
      energy: Number(energy),
      sleepHours: Number(sleepHours),
      medicines: medicines
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      privateNote: privateNote.trim(),
    };

    onSave(selectedDate, logPayload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <div className="rounded-2xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 p-3.5 text-xs text-red-800 dark:text-red-200 font-semibold flex items-center gap-2.5 shadow-2xs">
          <IconAlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. Period Flow Intensity */}
      <div className="space-y-3">
        <label className="block font-serif text-base font-bold text-[var(--ink)]">
          {t("logForm", "periodQuestion")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            {
              id: "none",
              label: t("logForm", "flowNone"),
              icon: (active) => (
                <IconMinus
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)]"}`}
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
                  className={`h-4 w-4 shrink-0 opacity-80 ${active ? "text-white" : "text-[var(--plum)]"}`}
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
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)]"}`}
                  aria-hidden="true"
                />
              ),
            },
            {
              id: "medium",
              label: t("logForm", "flowMedium"),
              icon: (active) => (
                <IconDroplet
                  filled
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)]"}`}
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
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--plum)]"}`}
                  aria-hidden="true"
                />
              ),
            },
          ].map((item) => {
            const isSelected = flow === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFlow(item.id)}
                aria-pressed={isSelected}
                className={`touch-target rounded-2xl p-2.5 text-xs font-semibold text-center transition-all border inline-flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] focus-visible:ring-offset-1 ${
                  isSelected
                    ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                    : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                }`}
              >
                {item.icon(isSelected)}
                <span className="truncate">{stripEmoji(item.label)}</span>
              </button>
            );
          })}
        </div>

        {/* Heavy Bleeding Detail Options */}
        {["heavy", "medium"].includes(flow) && (
          <div className="mt-3 rounded-2xl border border-[#E9B7C8] dark:border-[#5C2E4A] bg-[var(--card-subtle)] p-4 space-y-2.5">
            <span className="text-xs font-bold text-[var(--plum)] block">
              {t("logForm", "heavyBleedingDetails")}
            </span>
            <label className="flex items-center gap-2.5 text-xs text-[var(--ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={frequentPadChange}
                onChange={(e) => setFrequentPadChange(e.target.checked)}
                className="h-4 w-4 rounded accent-[#79516F]"
              />
              <span>{t("logForm", "frequentPadChange")}</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-[var(--ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={largeClots}
                onChange={(e) => setLargeClots(e.target.checked)}
                className="h-4 w-4 rounded accent-[#79516F]"
              />
              <span>{t("logForm", "largeClots")}</span>
            </label>
          </div>
        )}
      </div>

      {/* 2. Pain Level & Daily Activities */}
      <div className="space-y-3 pt-2 border-t border-[var(--line)]">
        <div className="flex items-center justify-between">
          <label className="font-serif text-base font-bold text-[var(--ink)]">
            {t("logForm", "painLevel")} ({painLevel}/4)
          </label>
          <span className="text-xs font-semibold text-[var(--plum)]">
            {painLevel === 0 && t("logForm", "painNone")}
            {painLevel === 1 && t("logForm", "painMild")}
            {painLevel === 2 && t("logForm", "painModerate")}
            {painLevel === 3 && t("logForm", "painSevere")}
            {painLevel === 4 && t("logForm", "painVerySevere")}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setPainLevel(level)}
              className={`touch-target rounded-xl py-2.5 text-xs font-bold transition-all border ${
                painLevel === level
                  ? "bg-[#79516F] text-white border-[#79516F] dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                  : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2.5 text-xs text-[var(--ink)] pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={stopsDailyLife}
            onChange={(e) => setStopsDailyLife(e.target.checked)}
            className="h-4 w-4 rounded accent-[#79516F]"
          />
          <span className="font-medium text-[#8F1D1D] dark:text-[#FFB3B8] inline-flex items-center gap-1.5">
            <IconAlertTriangle className="h-4 w-4 shrink-0 text-[#8F1D1D] dark:text-[#FFB3B8]" aria-hidden="true" />
            {t("logForm", "stopsDailyLife")}
          </span>
        </label>
      </div>

      {/* 3. Symptoms Multi-Select */}
      <div className="space-y-3 pt-2 border-t border-[var(--line)]">
        <label className="block font-serif text-base font-bold text-[var(--ink)]">
          {t("logForm", "symptoms")}
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SYMPTOMS.map((sym) => {
            const isChecked = selectedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                type="button"
                onClick={() => handleToggleSymptom(sym)}
                className={`touch-target rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                  isChecked
                    ? "bg-[#DCEBDD] text-[#3F6344] border-[#3F6344] shadow-xs dark:bg-[#1E3722] dark:text-[#88C690] dark:border-[#2F5A35]"
                    : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                }`}
              >
                {isChecked ? "✓ " : "+ "}
                {t("logForm", `symptom${sym.charAt(0).toUpperCase() + sym.slice(1)}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Mood, Energy & Sleep */}
      <div className="space-y-4 pt-2 border-t border-[var(--line)]">
        <div>
          <label className="block font-serif text-base font-bold text-[var(--ink)] mb-2">
            {t("logForm", "mood")}
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((item) => {
              const isSelected = mood === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMood(item.id)}
                  aria-pressed={isSelected}
                  className={`touch-target rounded-xl px-3.5 py-2 text-xs font-medium transition-all border inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] focus-visible:ring-offset-1 ${
                    isSelected
                      ? "bg-[#79516F] text-white border-[#79516F] font-bold shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                      : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
                  }`}
                >
                  <IconComp
                    className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-[var(--plum)]"}`}
                    aria-hidden="true"
                  />
                  <span>{stripEmoji(t("logForm", item.labelKey))}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              {t("logForm", "energy")} ({energy}/5)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergy(lvl)}
                  className={`touch-target rounded-xl py-2 text-xs font-bold border ${
                    energy === lvl
                      ? "bg-[#79516F] text-white border-[#79516F] dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                      : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="daily-log-sleep" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              {t("logForm", "sleepHours")}
            </label>
            <input
              id="daily-log-sleep"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3.5 py-2 text-sm text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
            />
          </div>
        </div>
      </div>

      {/* 5. Medicines & Private Notes */}
      <div className="space-y-4 pt-2 border-t border-[var(--line)]">
        <div>
          <label htmlFor="daily-log-medicines" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
            {t("logForm", "medicines")}
          </label>
          <input
            id="daily-log-medicines"
            type="text"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder={t("logForm", "medicinesPlaceholder")}
            className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3.5 py-2 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
          />
        </div>

        <div>
          <label htmlFor="daily-log-note" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 inline-flex items-center gap-1.5">
            <IconLock className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
            <span>{t("logForm", "privateNote")}</span>
          </label>
          <textarea
            id="daily-log-note"
            rows="3"
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            placeholder={t("logForm", "privateNotePlaceholder")}
            className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-3 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
          />
        </div>
      </div>

      {/* Action Buttons & Feedback */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)]">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] focus-visible:outline-2 focus-visible:outline-[#79516F] cursor-pointer hover:scale-[1.02]"
          >
            <span>{t("buttons", "save")}</span>
            <IconCheck className="h-4 w-4" aria-hidden="true" />
          </button>

          {savedSuccess && (
            <span className="text-xs font-semibold text-[#3F6344] dark:text-[#88C690] bg-[#DCEBDD] dark:bg-[#1E3722] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
              <IconCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("today", "completedToday")}</span>
            </span>
          )}
        </div>

        {existingLog && (
          <div>
            {!deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="touch-target rounded-xl border border-[#F4B8B0] dark:border-[#5C2329] bg-[var(--card)] px-4 py-2 text-xs font-bold text-[#8F1D1D] dark:text-[#FFB3B8] hover:bg-[#FDF2F0] dark:hover:bg-[#341619] cursor-pointer"
              >
                {t("buttons", "delete")}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(selectedDate)}
                  className="touch-target rounded-xl bg-[#8F1D1D] px-4 py-2 text-xs font-bold text-white hover:bg-red-800 cursor-pointer"
                >
                  {t("buttons", "confirm")}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="touch-target rounded-xl border border-[var(--line-strong)] px-3 py-2 text-xs text-[var(--ink)] cursor-pointer"
                >
                  {t("buttons", "cancel")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

export function LogView({ initialDate, onNavigateBack, onSavedFirstPeriod }) {
  const { appData, updateDayLog, deleteDayLog, storageError } = useAppData();
  const { lang, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isFirstPeriodParam = searchParams.get("mode") === "first-period";
  const isFirstPeriodState = Boolean(location.state?.isFirstPeriod);

  // Dedicated first-period mode is active when explicitly requested via route param or state
  const [isFirstPeriodMode, setIsFirstPeriodMode] = useState(
    isFirstPeriodParam || isFirstPeriodState,
  );

  const todayStr = getTodayLocalDate();
  const [selectedDate, setSelectedDate] = useState(
    initialDate && isValidDateOnly(initialDate) ? initialDate : todayStr,
  );

  const existingLog = appData.logsByDate[selectedDate] ?? null;

  function handleCancel() {
    if (location.state?.returnTo === "/" || isFirstPeriodParam || isFirstPeriodState) {
      if (onNavigateBack) {
        onNavigateBack();
      } else {
        navigate("/");
      }
    } else if (onNavigateBack) {
      onNavigateBack();
    } else {
      navigate(-1);
    }
  }

  function handleSavedFirstPeriodSuccess() {
    if (onSavedFirstPeriod) {
      onSavedFirstPeriod();
    } else {
      navigate("/");
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* First Period Welcome Banner OR Standard View Title */}
      {isFirstPeriodMode ? (
        <div className="rounded-3xl border border-[#DECED9] dark:border-[#543F61] bg-[#FAF5F0] dark:bg-[#251A2C] p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8] dark:border-[#543048] px-2.5 py-0.5 text-[10px] font-bold text-[var(--plum)] dark:text-[#E8A8BF]">
                <IconLotus className="h-3 w-3" aria-hidden="true" />
                <span>{t("logForm", "firstPeriodBadge")}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                {t("logForm", "firstPeriodTitle")}
              </h1>
              <p className="text-xs text-[var(--muted)] max-w-xl leading-relaxed">
                {t("logForm", "firstPeriodBannerDesc")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="touch-target inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] px-3.5 py-2 rounded-xl border border-[var(--line-strong)] bg-[var(--card)] hover:bg-[var(--card-subtle)] transition-colors cursor-pointer"
            >
              <IconArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("logForm", "cancelAndReturn")}</span>
            </button>
          </div>

          {/* Mode Switcher Pill */}
          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between flex-wrap gap-2">
            <div
              role="tablist"
              aria-label="Logging Mode"
              className="inline-flex items-center rounded-2xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-1 text-xs shadow-2xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isFirstPeriodMode}
                onClick={() => setIsFirstPeriodMode(true)}
                className={`touch-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFirstPeriodMode
                    ? "bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t("logForm", "switchToFirstPeriod")}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isFirstPeriodMode}
                onClick={() => setIsFirstPeriodMode(false)}
                className={`touch-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isFirstPeriodMode
                    ? "bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t("logForm", "switchToCheckin")}
              </button>
            </div>

            <span className="text-[11px] text-[var(--muted)] italic">
              {lang === "hi"
                ? "यह तारीख आपके चक्र का पहला दिन तय करेगी।"
                : "This date establishes Day 1 of your cycle."}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)] dark:text-[#E8A8BF]">
                {t("nav", "log")}
              </span>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                {t("logForm", "title")}
              </h1>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {t("common", "privacyNotice")}
              </p>
            </div>

            {/* Mode Switcher Pill in Daily Mode */}
            <div
              role="tablist"
              aria-label="Logging Mode"
              className="inline-flex items-center rounded-2xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-1 text-xs shadow-2xs self-start sm:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isFirstPeriodMode}
                onClick={() => setIsFirstPeriodMode(true)}
                className={`touch-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFirstPeriodMode
                    ? "bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t("logForm", "switchToFirstPeriod")}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isFirstPeriodMode}
                onClick={() => setIsFirstPeriodMode(false)}
                className={`touch-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isFirstPeriodMode
                    ? "bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t("logForm", "switchToCheckin")}
              </button>
            </div>
          </div>
        </div>
      )}

      {storageError && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          {storageError}
        </div>
      )}

      {/* Main Logging Form Card */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs">
        {isFirstPeriodMode ? (
          <FirstPeriodSetupForm
            key={`first-period-${selectedDate}`}
            todayStr={todayStr}
            initialDate={selectedDate}
            existingLog={existingLog}
            onSave={updateDayLog}
            onCancel={handleCancel}
            onSavedSuccess={handleSavedFirstPeriodSuccess}
          />
        ) : (
          <div className="space-y-6">
            {/* Daily Date Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line)] pb-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="log-date" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  {t("logForm", "dateLabel")}
                </label>
                <input
                  id="log-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 w-full sm:w-auto rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3.5 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                />
              </div>

              <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                  className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E] text-center"
                >
                  ← {lang === "hi" ? "पिछला दिन" : "Previous"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--plum)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E] text-center"
                >
                  {t("common", "today")}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E] text-center"
                >
                  {lang === "hi" ? "अगला दिन" : "Next"} →
                </button>
              </div>
            </div>

            {/* Daily Form Content */}
            <DailyLogFormContent
              key={`daily-${selectedDate}`}
              selectedDate={selectedDate}
              existingLog={existingLog}
              onSave={updateDayLog}
              onDelete={deleteDayLog}
            />
          </div>
        )}
      </div>
    </div>
  );
}

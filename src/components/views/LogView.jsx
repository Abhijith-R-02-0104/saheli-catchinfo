import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { getTodayLocalDate, isValidDateOnly, addDays } from "../../lib/dates.js";

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

function LogFormContent({
  selectedDate,
  existingLog,
  onSave,
  onDelete,
}) {
  const { t } = useTranslation();

  // Form state initialized directly from existingLog
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
            <label htmlFor="log-sleep" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              {t("logForm", "sleepHours")}
            </label>
            <input
              id="log-sleep"
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
          <label htmlFor="log-medicines" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
            {t("logForm", "medicines")}
          </label>
          <input
            id="log-medicines"
            type="text"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder={t("logForm", "medicinesPlaceholder")}
            className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3.5 py-2 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
          />
        </div>

        <div>
          <label htmlFor="log-note" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 inline-flex items-center gap-1.5">
            <IconLock className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
            <span>{t("logForm", "privateNote")}</span>
          </label>
          <textarea
            id="log-note"
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
            className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] focus-visible:outline-2 focus-visible:outline-[#79516F]"
          >
            <span>{t("buttons", "save")}</span>
            <span aria-hidden="true">✓</span>
          </button>

          {savedSuccess && (
            <span className="text-xs font-semibold text-[#3F6344] dark:text-[#88C690] bg-[#DCEBDD] dark:bg-[#1E3722] px-3 py-1 rounded-full">
              {t("today", "completedToday")}
            </span>
          )}
        </div>

        {existingLog && (
          <div>
            {!deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="touch-target rounded-xl border border-[#F4B8B0] dark:border-[#5C2329] bg-[var(--card)] px-4 py-2 text-xs font-bold text-[#8F1D1D] dark:text-[#FFB3B8] hover:bg-[#FDF2F0] dark:hover:bg-[#341619]"
              >
                {t("buttons", "delete")}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(selectedDate)}
                  className="touch-target rounded-xl bg-[#8F1D1D] px-4 py-2 text-xs font-bold text-white hover:bg-red-800"
                >
                  {t("buttons", "confirm")}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="touch-target rounded-xl border border-[var(--line-strong)] px-3 py-2 text-xs text-[var(--ink)]"
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

export function LogView({ initialDate }) {
  const { appData, updateDayLog, deleteDayLog, storageError } = useAppData();
  const { lang, t } = useTranslation();

  const todayStr = getTodayLocalDate();
  const [selectedDate, setSelectedDate] = useState(
    initialDate && isValidDateOnly(initialDate) ? initialDate : todayStr,
  );

  const existingLog = appData.logsByDate[selectedDate] ?? null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* View Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
          {t("nav", "log")}
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          {t("logForm", "title")}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("common", "privacyNotice")}
        </p>
      </div>

      {storageError && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          {storageError}
        </div>
      )}

      {/* Main Logging Form Card */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Date Selection Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <label htmlFor="log-date" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {t("logForm", "dateLabel")}
            </label>
            <input
              id="log-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3.5 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
            >
              ← {lang === "hi" ? "पिछला दिन" : "Previous"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--plum)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
            >
              {t("common", "today")}
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[#F2E8F0] dark:hover:bg-[#34263E]"
            >
              {lang === "hi" ? "अगला दिन" : "Next"} →
            </button>
          </div>
        </div>

        {/* Content keyed by selectedDate so state resets cleanly without cascading effect renders */}
        <LogFormContent
          key={selectedDate}
          selectedDate={selectedDate}
          existingLog={existingLog}
          onSave={updateDayLog}
          onDelete={deleteDayLog}
        />
      </div>
    </div>
  );
}

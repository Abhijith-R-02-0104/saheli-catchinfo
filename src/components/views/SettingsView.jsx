import { useState, useRef } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { getTodayLocalDate } from "../../lib/dates.js";
import {
  IconSun,
  IconMoon,
  IconMonitor,
  IconDownload,
  IconCheck,
} from "../common/Icons.jsx";

const ALL_SYMPTOMS = [
  "cramps",
  "headache",
  "acne",
  "bloating",
  "fatigue",
  "moodChanges",
  "sleepProblems",
  "backache",
  "nausea",
  "breastTenderness",
];

export function SettingsView() {
  const { appData, updateSettings, resetData, importAppData } = useAppData();
  const { lang, t } = useTranslation();
  const fileInputRef = useRef(null);

  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const isHighContrast = Boolean(appData.settings.highContrast);
  const isDiscreet = Boolean(appData.settings.discreetMode);
  const isPetEnabled = Boolean(appData.settings.petEnabled);
  const textSize = appData.settings.textSize || "normal";
  const theme = appData.settings.theme || "light";
  const trackedSymptoms = appData.settings.trackedSymptoms || ALL_SYMPTOMS;

  function handleLanguageChange(nextLang) {
    updateSettings({ language: nextLang });
  }

  function handleThemeChange(nextTheme) {
    updateSettings({ theme: nextTheme });
  }

  function handleTextSizeChange(size) {
    updateSettings({ textSize: size });
  }

  function handleToggleHighContrast() {
    updateSettings({ highContrast: !isHighContrast });
  }

  function handleToggleDiscreetMode() {
    updateSettings({ discreetMode: !isDiscreet });
  }

  function handleTogglePet() {
    updateSettings({ petEnabled: !isPetEnabled });
  }

  function handleToggleTrackedSymptom(sym) {
    const nextList = trackedSymptoms.includes(sym)
      ? trackedSymptoms.filter((s) => s !== sym)
      : [...trackedSymptoms, sym];
    updateSettings({ trackedSymptoms: nextList });
  }

  function handleExportData() {
    const today = getTodayLocalDate();
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `saheli-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (
          !parsed ||
          typeof parsed !== "object" ||
          parsed.schemaVersion !== 1 ||
          !parsed.settings ||
          !parsed.logsByDate
        ) {
          throw new Error("Invalid Saheli backup format.");
        }
        const res = importAppData(parsed);
        if (res.success) {
          setImportStatus({ success: true, message: "Backup successfully restored!" });
        } else {
          setImportStatus({ success: false, message: "Import failed to persist." });
        }
      } catch (err) {
        setImportStatus({
          success: false,
          message: err instanceof Error ? err.message : "Failed to parse file.",
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleReset() {
    resetData();
    setConfirmReset(false);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
          {t("nav", "settings")}
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          {t("settings", "title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("settings", "preferences")}
        </p>
      </div>

      {/* 1. Language Preference */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs">
        <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
          {t("accessibility", "language")}
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Select the interface language for navigation, buttons, and prompts.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            aria-pressed={lang === "en"}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
              lang === "en"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            <span>{t("accessibility", "english")}</span>
            {lang === "en" && <span aria-hidden="true">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange("hi")}
            aria-pressed={lang === "hi"}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
              lang === "hi"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            <span>{t("accessibility", "hindi")}</span>
            {lang === "hi" && <span aria-hidden="true">✓</span>}
          </button>
        </div>
      </section>

      {/* 2. Appearance (Theme) Preference */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs">
        <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
          {t("accessibility", "appearance")}
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("accessibility", "themeDesc")}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleThemeChange("light")}
            aria-pressed={theme === "light"}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
              theme === "light"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            <IconSun className="h-4 w-4" />
            <span>{t("accessibility", "themeLight")}</span>
            {theme === "light" && <IconCheck className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange("dark")}
            aria-pressed={theme === "dark"}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
              theme === "dark"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            <IconMoon className="h-4 w-4" />
            <span>{t("accessibility", "themeDark")}</span>
            {theme === "dark" && <IconCheck className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange("system")}
            aria-pressed={theme === "system"}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
              theme === "system"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            <IconMonitor className="h-4 w-4" />
            <span>{t("accessibility", "themeSystem")}</span>
            {theme === "system" && <IconCheck className="h-4 w-4" />}
          </button>
        </div>
      </section>

      {/* 3. Accessibility & Display Preferences */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-6">
        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
            {t("accessibility", "textSize")}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Adjust font scale for readable and comfortable reading.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleTextSizeChange("normal")}
              aria-pressed={textSize === "normal"}
              className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                textSize === "normal"
                  ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                  : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
              } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
            >
              <span>{t("accessibility", "textSizeNormal")} (16px)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTextSizeChange("large")}
              aria-pressed={textSize === "large"}
              className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                textSize === "large"
                  ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                  : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
              } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
            >
              <span>{t("accessibility", "textSizeLarge")} (18px)</span>
            </button>
          </div>
        </div>

        <hr className="border-[var(--line)]" />

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-[var(--ink)]">
              {t("accessibility", "highContrast")}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Enforces maximum contrast borders, bold text, and clear outlines.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleHighContrast}
            aria-pressed={isHighContrast}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${
              isHighContrast
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            {isHighContrast
              ? t("accessibility", "highContrastOn")
              : t("accessibility", "highContrastOff")}
          </button>
        </div>

        <hr className="border-[var(--line)]" />

        {/* Discreet Mode Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-[var(--ink)]">
              {t("accessibility", "discreetMode")}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {t("accessibility", "discreetModeDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleDiscreetMode}
            aria-pressed={isDiscreet}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${
              isDiscreet
                ? "border-[#79516F] bg-[#79516F] text-white dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            {isDiscreet ? "On ✓" : "Off"}
          </button>
        </div>

        <hr className="border-[var(--line)]" />

        {/* Optional Pet Companion Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-[var(--ink)]">
              {t("accessibility", "petCompanion")}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {t("accessibility", "petCompanionDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleTogglePet}
            aria-pressed={isPetEnabled}
            className={`touch-target inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${
              isPetEnabled
                ? "border-[#79516F] bg-[#79516F] text-white dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] hover:bg-[var(--plum-light)]"
            } focus-visible:outline-2 focus-visible:outline-[#79516F]`}
          >
            {isPetEnabled ? "Enabled ✓" : "Disabled"}
          </button>
        </div>
      </section>

      {/* 4. Tracked Symptoms Customization */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
            {t("settings", "trackedSymptoms")}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Select which symptoms appear in your daily check-in and log options.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_SYMPTOMS.map((sym) => {
            const isTracked = trackedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                type="button"
                onClick={() => handleToggleTrackedSymptom(sym)}
                className={`touch-target rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                  isTracked
                    ? "bg-[#DCEBDD] text-[#3F6344] border-[#3F6344] dark:bg-[#1E3722] dark:text-[#88C690] dark:border-[#88C690]"
                    : "bg-[var(--card-subtle)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--plum-light)]"
                }`}
              >
                {isTracked ? "✓ " : "+ "}
                {t("logForm", `symptom${sym.charAt(0).toUpperCase() + sym.slice(1)}`)}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Data Backup, Export & Import */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
            {t("settings", "dataManagement")}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("settings", "privacyPromise")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 space-y-3">
            <h3 className="font-serif font-bold text-sm text-[var(--ink)]">
              {t("buttons", "export")}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {t("settings", "exportDescription")}
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="touch-target inline-flex items-center gap-2 rounded-xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] text-white px-4 py-2 text-xs font-semibold shadow-xs"
            >
              <IconDownload className="h-4 w-4" />
              <span>{t("settings", "exportBtn")}</span>
            </button>
          </div>

          {/* Import */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 space-y-3">
            <h3 className="font-serif font-bold text-sm text-[var(--ink)]">
              {t("buttons", "import")}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {t("settings", "importDescription")}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-[#79516F] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#633E5A]"
            />

            {importStatus && (
              <p
                className={`text-xs font-semibold ${
                  importStatus.success ? "text-[#3F6344] dark:text-[#88C690]" : "text-[#8F1D1D] dark:text-[#FFB3B8]"
                }`}
              >
                {importStatus.message}
              </p>
            )}
          </div>
        </div>

        {/* Reset Danger Zone */}
        <div className="rounded-2xl border border-[#F4B8B0] dark:border-[#5C2329] bg-[#FDF2F0] dark:bg-[#341619] p-4 text-[#8F1D1D] dark:text-[#FFB3B8] mt-4">
          <h3 className="font-semibold">{t("settings", "resetTitle")}</h3>
          <p className="mt-1 text-xs">{t("settings", "resetWarning")}</p>

          <div className="mt-3">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="touch-target inline-flex items-center rounded-xl border border-[#F4B8B0] dark:border-[#5C2329] bg-white dark:bg-[#281F30] px-4 py-2 text-xs font-bold text-[#8F1D1D] dark:text-[#FFB3B8] hover:bg-[#FFF0F0] dark:hover:bg-[#401C20] focus-visible:outline-2 focus-visible:outline-[#8F1D1D]"
              >
                {t("buttons", "reset")}
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="touch-target inline-flex items-center rounded-xl bg-[#8F1D1D] px-4 py-2 text-xs font-bold text-white hover:bg-[#701515] focus-visible:outline-2 focus-visible:outline-[#8F1D1D]"
                >
                  {t("buttons", "confirm")} ({t("buttons", "reset")})
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="touch-target inline-flex items-center rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--card-subtle)]"
                >
                  {t("buttons", "cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

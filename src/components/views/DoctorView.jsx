import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { evaluateHealthSafety } from "../../lib/safety.js";
import { calculateCyclePrediction } from "../../lib/cycle.js";
import { getTodayLocalDate, addDays, isValidDateOnly } from "../../lib/dates.js";
import { EditorialBanner } from "../common/EditorialBanner.jsx";
import {
  IconDoctor,
  IconCheck,
  IconAlertOctagon,
  IconAlertTriangle,
  IconHeart,
  IconLog,
  IconPlus,
  IconDownload,
  IconArrowRight,
} from "../common/Icons.jsx";

export function DoctorView() {
  const { appData, updateSettings } = useAppData();
  const { lang, t, getTranslation } = useTranslation();

  const todayStr = getTodayLocalDate();

  // Run the safety evaluator
  const safety = evaluateHealthSafety(appData);
  const urgentFindings = safety.urgentFindings || [];
  const doctorFindings = safety.doctorFindings || [];
  const selfReportedRules = safety.selfReportedGuidance || [];

  // Cycle statistics for appointment summary
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

  // Doctor visit prep selections
  const [includeCycles, setIncludeCycles] = useState(true);
  const [includeSymptoms, setIncludeSymptoms] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [customQuestion, setCustomQuestion] = useState("");
  const [extraQuestions, setExtraQuestions] = useState([]);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("guidance"); // 'guidance' | 'prep'

  // User notes tagged with doctor
  const doctorNotes = (appData.personalNotes || []).filter((n) => n.tag === "doctor");

  function handleAddQuestion() {
    if (!customQuestion.trim()) return;
    setExtraQuestions((prev) => [...prev, customQuestion.trim()]);
    setCustomQuestion("");
  }

  // Generate printable text summary
  function generateSummaryText() {
    const lines = [];
    lines.push(`SAHELI — HEALTH APPOINTMENT PREPARATION SUMMARY`);
    lines.push(`Generated: ${todayStr}`);
    lines.push(`--------------------------------------------------`);

    if (includeCycles) {
      lines.push(`\n1. MENSTRUAL CYCLE OVERVIEW:`);
      lines.push(`- Recorded Period Starts: ${periodStarts.length}`);
      if (cycleData?.medianCycleLength) {
        lines.push(`- Median Cycle Length: ${Math.round(cycleData.medianCycleLength)} days`);
        lines.push(`- Cycle Regularity: ${cycleData.regularityStatus}`);
        lines.push(`- Variability: ±${cycleData.cycleVariabilityDays || 0} days`);
      } else {
        lines.push(`- Insufficient recorded history for full median calculation.`);
      }
    }

    if (includeSymptoms) {
      lines.push(`\n2. RECENT HEALTH & SYMPTOM OBSERVATIONS:`);
      const allFindings = [...urgentFindings, ...doctorFindings];
      if (allFindings.length > 0) {
        allFindings.forEach((f) => {
          lines.push(`- Concern: ${f.id} (Observed on: ${f.dates.join(", ")})`);
        });
      } else {
        lines.push(`- No automated red-flag rules triggered.`);
      }
    }

    if (includeNotes) {
      lines.push(`\n3. QUESTIONS & OBSERVATIONS FOR MY DOCTOR:`);
      doctorNotes.forEach((n) => {
        lines.push(`- ${n.title}: ${n.body}`);
      });
      extraQuestions.forEach((q) => {
        lines.push(`- ${q}`);
      });
      if (doctorNotes.length === 0 && extraQuestions.length === 0) {
        lines.push(`- (No questions listed)`);
      }
    }

    lines.push(`\n--------------------------------------------------`);
    lines.push(`Disclaimer: Saheli provides private self-logged data, not medical diagnosis.`);
    return lines.join("\n");
  }

  function handleCopySummary() {
    const text = generateSummaryText();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
      });
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Premium Editorial Banner */}
      <EditorialBanner
        variant="doctor"
        tag={
          <span className="flex items-center gap-1.5">
            <IconDoctor className="h-3.5 w-3.5 text-[#79516F] dark:text-[#E8A8BF]" />
            <span>{t("nav", "doctor")}</span>
          </span>
        }
        title={t("doctor", "title")}
        description={t("common", "medicalDisclaimer")}
        badge={
          <span className="flex items-center gap-1">
            <IconCheck className="h-3 w-3 text-[#79516F] dark:text-[#E8A8BF]" />
            <span>
              {lang === "hi" ? "गोपनीय परामर्श" : "Clinical Guidance"}
            </span>
          </span>
        }
        primaryAction={
          activeTab === "guidance"
            ? {
                label: t("doctor", "visitPrep"),
                onClick: () => setActiveTab("prep"),
                icon: <IconArrowRight className="h-4 w-4" />,
              }
            : null
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EFE6EC] dark:border-[#3D2E47] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("guidance")}
          className={`touch-target rounded-2xl px-4 py-2 text-xs font-semibold transition-all border ${
            activeTab === "guidance"
              ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
              : "bg-white text-[#292536] border-[#DECED9] hover:bg-[#FAF5F0] dark:bg-[#281F30] dark:text-[#F7EDF5] dark:border-[#42324C] dark:hover:bg-[#34263E]"
          }`}
        >
          {t("doctor", "safetyNotice")}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("prep")}
          className={`touch-target rounded-2xl px-4 py-2 text-xs font-semibold transition-all border inline-flex items-center gap-1.5 ${
            activeTab === "prep"
              ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
              : "bg-white text-[#292536] border-[#DECED9] hover:bg-[#FAF5F0] dark:bg-[#281F30] dark:text-[#F7EDF5] dark:border-[#42324C] dark:hover:bg-[#34263E]"
          }`}
        >
          <IconLog className="h-3.5 w-3.5" />
          <span>{t("doctor", "visitPrep")}</span>
        </button>
      </div>

      {activeTab === "guidance" && (
        <div className="space-y-6">
          {/* Age Group Config Prompt if not configured */}
          {safety.needsAgeGroupSelection && (
            <div className="rounded-3xl border border-[#DECED9] dark:border-[#42324C] bg-[#FAF5F0] dark:bg-[#281F30] p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#79516F] dark:text-[#E8A8BF]">
                {lang === "hi"
                  ? "सटीक मूल्यांकन हेतु आयु वर्ग"
                  : "Age group for accurate clinical thresholds"}
              </span>
              <p className="text-xs text-[#292536] dark:text-[#F7EDF5]">
                {lang === "hi"
                  ? "वयस्कों और किशोरियों के लिए सामान्य साइकिल अवधि अलग-अलग होती है। कृपया चुनें:"
                  : "Normal cycle length thresholds differ between adults and adolescents under 18. Please select:"}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => updateSettings({ ageGroup: "adult" })}
                  className="touch-target rounded-xl bg-[#79516F] text-white px-4 py-2 text-xs font-semibold hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
                >
                  {lang === "hi" ? "वयस्क (18+ वर्ष)" : "Adult (18+ years)"}
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ ageGroup: "under-18" })}
                  className="touch-target rounded-xl border border-[#79516F] bg-white text-[#79516F] px-4 py-2 text-xs font-semibold hover:bg-[#FAF5F0] dark:border-[#8D5C82] dark:bg-[#281F30] dark:text-[#E8A8BF]"
                >
                  {lang === "hi"
                    ? "किशोरी (18 वर्ष से कम)"
                    : "Adolescent (Under 18)"}
                </button>
              </div>
            </div>
          )}

          {/* 1. URGENT FINDINGS BANNER */}
          {urgentFindings.length > 0 && (
            <div className="rounded-3xl border-2 border-[#F4B8B0] dark:border-[#5C2329] bg-[#FDF2F0] dark:bg-[#341619] p-6 text-[#8F1D1D] dark:text-[#FFB3B8] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <IconAlertOctagon className="h-6 w-6 text-[#8F1D1D] dark:text-[#FFB3B8] shrink-0" />
                <div>
                  <h2 className="font-serif text-lg font-bold">
                    {t("doctor", "urgentBanner")}
                  </h2>
                  <p className="text-xs font-semibold">
                    {t("doctor", "urgentNotice")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {urgentFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className="rounded-2xl bg-[var(--card)] p-4 text-xs border border-[#F4B8B0] dark:border-[#5C2329] space-y-1"
                  >
                    <p className="font-bold text-sm text-[#8F1D1D] dark:text-[#FFB3B8]">
                      {getTranslation(
                        finding.titleKey,
                        "Urgent health concern",
                      )}
                    </p>
                    <p className="text-slate-800 dark:text-[#F7EDF5]">
                      <strong>Observed dates:</strong>{" "}
                      {finding.dates.join(", ")}
                    </p>
                    <p className="text-[#8F1D1D] dark:text-[#FFB3B8] font-medium">
                      Immediate action: Call 112 or visit nearest emergency
                      care.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. DOCTOR OBSERVATIONS (Non-urgent red flags) */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
              {t("doctor", "safetyNotice")}
            </h2>

            {doctorFindings.length > 0 ? (
              <div className="space-y-4">
                {doctorFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className="rounded-2xl border border-amber-200 dark:border-[#5E3F1F] bg-amber-50/60 dark:bg-[#332211] p-5 text-xs text-[var(--ink)] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-bold text-amber-900 dark:text-[#FFE0B2] inline-flex items-center gap-1.5">
                        <IconAlertTriangle className="h-4 w-4 shrink-0 text-amber-700 dark:text-[#FFE0B2]" />
                        <span>
                          {getTranslation(
                            finding.titleKey,
                            "Health observation",
                          )}
                        </span>
                      </span>
                      <span className="rounded-full bg-amber-200 dark:bg-[#5E3F1F] text-amber-900 dark:text-[#FFE0B2] px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Consult Gynecologist
                      </span>
                    </div>

                    <p className="text-slate-800 dark:text-[#EAE0E8]">
                      <strong>Logged on:</strong> {finding.dates.join(", ")}
                    </p>

                    {finding.sources?.length > 0 && (
                      <p className="text-[11px] text-[var(--muted)]">
                        <strong>Clinical reference:</strong>{" "}
                        {finding.sources.map((s) => s.name).join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#F4FAF5] dark:bg-[#1E3722] p-5 text-xs text-[#3F6344] dark:text-[#88C690] flex items-center gap-3 border border-[#DCEBDD] dark:border-[#2F5A35]">
                <IconCheck className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">{t("emptyStates", "noFindings")}</p>
                  <p className="text-[var(--muted)] mt-0.5">
                    No active threshold alerts triggered based on your current
                    logs. Always consult a physician if you experience any
                    concerning symptoms.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3. MENTAL HEALTH SUPPORT (TELE-MANAS) */}
          <div className="rounded-3xl border border-[#DCEBDD] dark:border-[#2F5A35] bg-[#F4FAF5] dark:bg-[#1E3722] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <IconHeart className="h-6 w-6 text-[#3F6344] dark:text-[#88C690] shrink-0" />
              <div>
                <h3 className="font-serif text-base font-bold text-[#3F6344] dark:text-[#88C690]">
                  {t("doctor", "teleManasTitle")}
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  {t("doctor", "teleManasDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="tel:14416"
                className="touch-target inline-flex items-center gap-2 rounded-xl bg-[#3F6344] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#324f36]"
              >
                <IconDoctor className="h-3.5 w-3.5" />
                <span>{t("doctor", "callTeleManas")}</span>
              </a>
              <span className="text-xs text-[var(--muted)]">
                Toll-free 24/7 National Helpline (Government of India)
              </span>
            </div>
          </div>

          {/* 4. SELF-REPORTED SYMPTOMS CHECKLIST */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[var(--ink)]">
              {t("doctor", "selfReportedTitle")}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {lang === "hi"
                ? "इन लक्षणों को डॉक्टर के साथ साझा करना महत्वपूर्ण है:"
                : "Symptoms that cannot always be determined by period dates alone but warrant medical attention:"}
            </p>

            <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--ink)]">
              {selfReportedRules.map((rule) => (
                <li key={rule.id}>
                  <strong>
                    {getTranslation(rule.titleKey, "Health concern")}:
                  </strong>{" "}
                  {getTranslation(
                    rule.whyKey,
                    "Please consult a healthcare professional for guidance.",
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Prepare for My Visit Tab */}
      {activeTab === "prep" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
              {t("doctor", "visitPrep")}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {t("doctor", "includeInSummary")}
            </p>

            {/* Inclusions Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 text-xs font-semibold text-[var(--ink)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCycles}
                  onChange={(e) => setIncludeCycles(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#79516F]"
                />
                <span>Cycle Lengths & Regularity</span>
              </label>

              <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 text-xs font-semibold text-[var(--ink)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymptoms}
                  onChange={(e) => setIncludeSymptoms(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#79516F]"
                />
                <span>Observations & Red Flags</span>
              </label>

              <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 text-xs font-semibold text-[var(--ink)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#79516F]"
                />
                <span>Doctor Questions</span>
              </label>
            </div>

            {/* Custom Question Input */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                {lang === "hi"
                  ? "अतिरिक्त प्रश्न जोड़ें"
                  : "Add an additional question for your doctor"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="e.g. Could my pelvic pain be related to endometriosis?"
                  className="flex-1 rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-4 py-2 text-xs text-[var(--ink)] placeholder-[var(--muted)]"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="touch-target inline-flex items-center gap-1.5 rounded-xl bg-[#79516F] text-white px-4 py-2 text-xs font-bold hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
                >
                  <IconPlus className="h-3.5 w-3.5" />
                  <span>{t("buttons", "addQuestion")}</span>
                </button>
              </div>
            </div>

            {/* Live Formatted Summary Preview */}
            <div className="pt-4 border-t border-[var(--line)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Preview Summary
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="touch-target inline-flex items-center gap-1.5 rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3.5 py-1.5 text-xs font-bold text-[var(--plum)] hover:bg-[var(--card-subtle)]"
                  >
                    <IconCheck className="h-3.5 w-3.5" />
                    <span>
                      {copiedSummary
                        ? t("buttons", "copied")
                        : t("buttons", "copy")}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="touch-target inline-flex items-center gap-1.5 rounded-xl bg-[#79516F] text-white px-3.5 py-1.5 text-xs font-bold hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
                  >
                    <IconDownload className="h-3.5 w-3.5" />
                    <span>{t("buttons", "print")}</span>
                  </button>
                </div>
              </div>

              <pre className="overflow-x-auto rounded-2xl bg-[var(--card-subtle)] p-5 font-mono text-xs text-[var(--ink)] border border-[var(--line)] leading-relaxed whitespace-pre-wrap">
                {generateSummaryText()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { calculateCyclePrediction } from "../../lib/cycle.js";
import {
  addDays,
  isValidDateOnly,
} from "../../lib/dates.js";

export function InsightsView() {
  const { appData } = useAppData();
  const { lang, t } = useTranslation();

  const [activeTab, setActiveTab] = useState("overview");

  // Collect and sort all logs by date
  const sortedEntries = Object.entries(appData.logsByDate || {})
    .filter(([d, log]) => isValidDateOnly(d) && log !== null && typeof log === "object")
    .sort(([a], [b]) => a.localeCompare(b));

  // Extract period start dates
  const periodDatesSet = new Set(
    sortedEntries.filter(([, log]) => log?.period?.isPeriod === true).map(([d]) => d),
  );
  const periodStarts = [...periodDatesSet].filter((date) => !periodDatesSet.has(addDays(date, -1)));

  // Calculate cycles using the tested cycle engine
  const predictionData = (() => {
    try {
      return calculateCyclePrediction(periodStarts);
    } catch {
      return null;
    }
  })();

  // Symptom counts
  const symptomCounts = {};
  let totalPeriodDays = 0;
  let totalSleep = 0;
  let sleepCount = 0;
  let totalEnergy = 0;
  let energyCount = 0;
  const moodCounts = {};

  sortedEntries.forEach(([, log]) => {
    if (log?.period?.isPeriod) {
      totalPeriodDays++;
    }
    if (Array.isArray(log?.symptoms)) {
      log.symptoms.forEach((sym) => {
        symptomCounts[sym] = (symptomCounts[sym] || 0) + 1;
      });
    }
    if (log?.mood) {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    }
    if (typeof log?.sleepHours === "number" && log.sleepHours > 0) {
      totalSleep += log.sleepHours;
      sleepCount++;
    }
    if (typeof log?.energy === "number" && log.energy > 0) {
      totalEnergy += log.energy;
      energyCount++;
    }
  });

  const avgSleep = sleepCount > 0 ? (totalSleep / sleepCount).toFixed(1) : null;
  const avgEnergy = energyCount > 0 ? (totalEnergy / energyCount).toFixed(1) : null;

  // Average period length (estimate from runs of period days)
  const completedCycles = predictionData?.cycleIntervals || [];
  const avgCycleLength = predictionData?.medianCycleLength
    ? Math.round(predictionData.medianCycleLength)
    : null;

  // Top symptoms sorted
  const sortedSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]);
  const maxSymptomCount = sortedSymptoms.length > 0 ? sortedSymptoms[0][1] : 1;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
          {t("nav", "insights")}
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          {t("insights", "title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("common", "privacyNotice")} · {t("insights", "cycleLengthNote")}
        </p>
      </div>

      {/* Tabs for Insights: Overview / Cycle Constellation */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`touch-target rounded-2xl px-4 py-2 text-xs font-semibold transition-all border ${
            activeTab === "overview"
              ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
              : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
          }`}
        >
          {lang === "hi" ? "सांख्यिकी व सारांश" : "Statistics & Trends"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("constellation")}
          className={`touch-target rounded-2xl px-4 py-2 text-xs font-semibold transition-all border ${
            activeTab === "constellation"
              ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
              : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
          }`}
        >
          ✨ {t("insights", "constellation")}
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* 1. Average Cycle Length */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {t("insights", "averageCycle")}
              </span>
              <p className="mt-2 font-serif text-3xl font-bold text-[var(--plum)]">
                {avgCycleLength ? `${avgCycleLength} ${t("common", "days")}` : "--"}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {predictionData?.regularityStatus === "regular"
                  ? `✓ ${t("insights", "regular")} (±${predictionData.cycleVariabilityDays || 0}d)`
                  : predictionData?.regularityStatus === "irregular"
                    ? `⚠️ ${t("insights", "irregular")}`
                    : t("emptyStates", "noInsights")}
              </p>
            </div>

            {/* 2. Total Period Days */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {t("insights", "averagePeriod")}
              </span>
              <p className="mt-2 font-serif text-3xl font-bold text-[var(--plum)]">
                {totalPeriodDays > 0 ? `${totalPeriodDays} ${t("calendar", "daysCount")}` : "--"}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {periodStarts.length > 0
                  ? `${periodStarts.length} ${lang === "hi" ? "माहवारी चक्र दर्ज हैं" : "cycles recorded"}`
                  : t("emptyStates", "noLogs")}
              </p>
            </div>

            {/* 3. Sleep & Energy */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {lang === "hi" ? "औसत नींद व ऊर्जा" : "Sleep & Energy"}
              </span>
              <p className="mt-2 font-serif text-3xl font-bold text-[#3F6344] dark:text-[#88C690]">
                {avgSleep ? `${avgSleep} hrs` : "--"}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {avgEnergy ? `${lang === "hi" ? "ऊर्जा स्तर" : "Energy"}: ${avgEnergy}/5` : t("emptyStates", "noLogs")}
              </p>
            </div>
          </div>

          {/* Cycle History Timeline List */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
              {t("insights", "cycleHistory")}
            </h2>

            {completedCycles.length > 0 ? (
              <div className="space-y-3">
                {completedCycles.map((cycle, idx) => (
                  <div
                    key={`${cycle.startDate}-${cycle.endDate}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-[var(--card-subtle)] p-4 border border-[var(--line)] gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--plum)]">
                        {lang === "hi" ? `साइकिल ${idx + 1}` : `Cycle ${idx + 1}`}
                      </span>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {cycle.startDate} → {cycle.endDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-xl bg-[var(--card)] px-3 py-1 font-serif text-sm font-bold text-[var(--plum)] border border-[var(--line-strong)]">
                        {cycle.lengthDays} {t("common", "days")}
                      </span>
                      {cycle.suspectedMissedLog && (
                        <span className="rounded-xl bg-amber-100 text-amber-900 px-2 py-1 text-[11px] font-semibold">
                          {lang === "hi" ? "संभावित छूटा लॉग" : "Suspected missed log"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted)] py-4">
                {t("emptyStates", "noInsights")}
              </p>
            )}
          </div>

          {/* Symptom & Mood Distribution Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Symptom Frequency */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                {t("insights", "recurringSymptoms")}
              </h3>

              {sortedSymptoms.length > 0 ? (
                <div className="space-y-2.5">
                  {sortedSymptoms.map(([sym, count]) => (
                    <div key={sym} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--ink)]">
                          {t("logForm", `symptom${sym.charAt(0).toUpperCase() + sym.slice(1)}`)}
                        </span>
                        <span className="text-[var(--plum)] font-bold">
                          {count} {lang === "hi" ? "बार" : "times"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[var(--card-subtle)] border border-[var(--line)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#79516F] dark:bg-[#8D5C82]"
                          style={{ width: `${(count / maxSymptomCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">{t("emptyStates", "noLogs")}</p>
              )}
            </div>

            {/* Mood Trends */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                {t("insights", "moodTrends")}
              </h3>

              {Object.keys(moodCounts).length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(moodCounts).map(([m, cnt]) => (
                    <div
                      key={m}
                      className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 text-center"
                    >
                      <span className="text-xs font-bold capitalize text-[var(--ink)] block">
                        {t("logForm", `mood${m.charAt(0).toUpperCase() + m.slice(1)}`)}
                      </span>
                      <span className="font-serif text-lg font-bold text-[var(--plum)] mt-1 block">
                        {cnt}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">{t("emptyStates", "noLogs")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cycle Constellation Visualizer */}
      {activeTab === "constellation" && (
        <div className="rounded-3xl border border-[#EFE6EC] bg-gradient-to-br from-[#292536] to-[#1C1A25] p-6 sm:p-8 text-white shadow-md space-y-6">
          <div className="text-center max-w-md mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E9B7C8]">
              {t("insights", "constellation")}
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-white">
              {lang === "hi" ? "आपकी जैविक लय का नक्षत्र" : "The Rhythm of Your Cycles"}
            </h2>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              {lang === "hi"
                ? "प्रत्येक तारा और रेखा आपके दर्ज किए गए चक्रों और स्वास्थ्य यात्रा का प्रतीक है।"
                : "Each luminous node represents a recorded cycle or phase milestone in your private wellness journey."}
            </p>
          </div>

          {/* Artistic SVG Constellation */}
          <div className="relative flex items-center justify-center py-8">
            <svg
              viewBox="0 0 400 240"
              className="w-full max-w-md overflow-visible select-none"
              role="img"
              aria-label="Cycle Constellation visual representation"
            >
              {/* Connecting Constellation Lines */}
              <path
                d="M 50 140 Q 120 60 200 120 T 350 90"
                fill="none"
                stroke="#E9B7C8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-60"
              />

              {/* Constellation Star Nodes */}
              {[
                { cx: 50, cy: 140, label: "Cycle 1", day: "28d", color: "#E9B7C8" },
                { cx: 130, cy: 80, label: "Follicular", day: "Day 8", color: "#DCEBDD" },
                { cx: 200, cy: 120, label: "Ovulation", day: "Day 14", color: "#E9B7C8" },
                { cx: 280, cy: 75, label: "Luteal", day: "Day 22", color: "#FAF5F0" },
                { cx: 350, cy: 90, label: "Current", day: "Now", color: "#E9B7C8" },
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.cx} cy={node.cy} r={12} fill={node.color} fillOpacity="0.15" />
                  <circle cx={node.cx} cy={node.cy} r={5} fill={node.color} />
                  <text
                    x={node.cx}
                    y={node.cy + 22}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.cx}
                    y={node.cy + 33}
                    textAnchor="middle"
                    fill="#E9B7C8"
                    fontSize="9"
                  >
                    {node.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

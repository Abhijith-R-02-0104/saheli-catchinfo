import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation.js";
import { CYCLE_PHASES } from "../../data/cyclePhases.js";
import { IconSaheliHeart, IconLog } from "../common/Icons.jsx";

export function CycleWheel({
  currentCycleDay,
  cycleLength = 28,
  prediction,
  onNavigateToLog,
}) {
  const { lang, t } = useTranslation();
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);

  // Compute active phase based on current cycle day
  let activePhaseKey = null;
  if (currentCycleDay !== null && currentCycleDay !== undefined) {
    if (currentCycleDay <= 5) {
      activePhaseKey = "menstrual";
    } else if (currentCycleDay <= 13) {
      activePhaseKey = "follicular";
    } else if (currentCycleDay <= 17) {
      activePhaseKey = "ovulation";
    } else {
      activePhaseKey = "luteal";
    }
  }

  const displayedPhaseId = selectedPhaseId || activePhaseKey || "menstrual";
  const phaseInfo = CYCLE_PHASES[displayedPhaseId] || CYCLE_PHASES.menstrual;

  // Geometry for SVG wheel - refined centerpiece proportions
  const size = 280;
  const center = size / 2;
  const radius = 112;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  // Compute angle for current day indicator (0 at top = day 1)
  const totalDays = Math.max(21, Math.min(45, cycleLength || 28));
  const safeCurrentDay = currentCycleDay ? Math.min(currentCycleDay, totalDays) : 0;
  const progressRatio = safeCurrentDay > 0 ? (safeCurrentDay - 1) / totalDays : 0;
  const pointerAngle = progressRatio * 360 - 90; // -90 deg puts day 1 at top
  const pointerRad = (pointerAngle * Math.PI) / 180;
  const pointerX = center + radius * Math.cos(pointerRad);
  const pointerY = center + radius * Math.sin(pointerRad);

  // Distinct phase arc lengths
  const menstrualArc = (5 / totalDays) * circumference;
  const follicularArc = (8 / totalDays) * circumference;
  const ovulationArc = (4 / totalDays) * circumference;
  const lutealArc = ((totalDays - 17) / totalDays) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* SVG Cycle Wheel */}
      <div className="relative flex items-center justify-center p-2">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible select-none transition-transform duration-500 ease-out"
          role="img"
          aria-label={
            currentCycleDay
              ? `${t("today", "cycleDay")} ${currentCycleDay}`
              : t("emptyStates", "noLogs")
          }
        >
          {/* Subtle Outer Botanical / Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius + 16}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="text-[#EFE6EC] dark:text-[#3D2E47] opacity-75"
          />

          {/* Inner Decorative Dial */}
          <circle
            cx={center}
            cy={center}
            r={radius - 18}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-[#F2E8F0] dark:text-[#2A1D31]"
          />

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[#F2E8F0] dark:text-[#281F30]"
          />

          {/* 4 Distinct Phase Arcs around the circumference */}
          {/* 1. Menstrual Phase: Days 1-5 (Deep Muted Plum) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#79516F"
            strokeWidth={displayedPhaseId === "menstrual" ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${menstrualArc - 2} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 hover:opacity-90"
            onClick={() => setSelectedPhaseId("menstrual")}
          />

          {/* 2. Follicular Phase: Days 6-13 (Sage Forest) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#4A7C59"
            strokeWidth={displayedPhaseId === "follicular" ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${follicularArc - 2} ${circumference}`}
            strokeDashoffset={`-${menstrualArc}`}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 hover:opacity-90"
            onClick={() => setSelectedPhaseId("follicular")}
          />

          {/* 3. Ovulation Window: Days 14-17 (Blush Rose) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E9B7C8"
            strokeWidth={displayedPhaseId === "ovulation" ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${ovulationArc - 2} ${circumference}`}
            strokeDashoffset={`-${menstrualArc + follicularArc}`}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 hover:opacity-90"
            onClick={() => setSelectedPhaseId("ovulation")}
          />

          {/* 4. Luteal Phase: Days 18-28 (Warm Mauve) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#B8860B"
            strokeWidth={displayedPhaseId === "luteal" ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${lutealArc - 2} ${circumference}`}
            strokeDashoffset={`-${menstrualArc + follicularArc + ovulationArc}`}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 hover:opacity-90"
            onClick={() => setSelectedPhaseId("luteal")}
          />

          {/* Current Day Pointer Bead */}
          {currentCycleDay && (
            <g className="transition-all duration-700 ease-out">
              <circle
                cx={pointerX}
                cy={pointerY}
                r={11}
                fill="#FFFFFF"
                stroke="#79516F"
                strokeWidth="3.5"
                className="shadow-md filter drop-shadow(0 2px 5px rgba(41,37,54,0.25))"
              />
              <circle cx={pointerX} cy={pointerY} r={4} fill="#79516F" />
            </g>
          )}
        </svg>

        {/* Center Content Inside Wheel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {currentCycleDay ? (
            <div className="pointer-events-none space-y-1">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-xs"
                style={{ backgroundColor: phaseInfo.color }}
              >
                {lang === "hi" ? phaseInfo.nameHi : phaseInfo.nameEn}
              </span>
              <p className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#292536] dark:text-[#F7EDF5]">
                {currentCycleDay}
              </p>
              <p className="text-xs font-semibold text-[#79516F] dark:text-[#E8A8BF]">
                {t("today", "cycleDay")}
              </p>
              <p className="text-[11px] text-[#6B6577] dark:text-[#BBA9BE]">
                {lang === "hi" ? `कुल ~${totalDays} दिन चक्र` : `of ~${totalDays} day cycle`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <IconSaheliHeart className="h-7 w-7 mx-auto text-[#79516F] dark:text-[#E8A8BF]" />
              <p className="font-serif text-sm font-bold text-[#292536] dark:text-[#F7EDF5]">
                {t("common", "appName")}
              </p>
              <p className="text-[11px] text-[#6B6577] dark:text-[#BBA9BE] max-w-[140px] leading-tight">
                {t("today", "logFirstPeriod")}
              </p>
              {onNavigateToLog && (
                <button
                  type="button"
                  onClick={onNavigateToLog}
                  className="touch-target inline-flex items-center gap-1 rounded-xl bg-[#79516F] dark:bg-[#8D5C82] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#633E5A] dark:hover:bg-[#A06B95] shadow-xs"
                >
                  <IconLog className="h-3 w-3" />
                  <span>{t("today", "quickLogAction")}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Phase Segment Selector Chips */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
        {Object.values(CYCLE_PHASES).map((phase) => {
          const isSelected = displayedPhaseId === phase.id;
          const isCurrent = activePhaseKey === phase.id;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`touch-target px-3 py-1.5 rounded-xl font-medium transition-all text-xs flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                  : "bg-white text-[#292536] border-[#EFE6EC] hover:bg-[#FAF5F0] dark:bg-[#281F30] dark:text-[#F7EDF5] dark:border-[#42324C] dark:hover:bg-[#34263E]"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: phase.color }}
              />
              <span>{lang === "hi" ? phase.nameHi : phase.nameEn}</span>
              {isCurrent && (
                <span className="text-[10px] bg-white/25 dark:bg-black/25 px-1.5 py-0.2 rounded font-bold">
                  {lang === "hi" ? "अब" : "Current"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Card */}
      <div
        className="mt-4 w-full rounded-2xl border p-4.5 text-left transition-all shadow-xs bg-[var(--card-subtle)] border-[var(--line)]"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4
              className="font-serif text-base font-bold text-[var(--plum)]"
            >
              {lang === "hi" ? phaseInfo.nameHi : phaseInfo.nameEn}
            </h4>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {lang === "hi" ? phaseInfo.rangeHi : phaseInfo.rangeEn}
            </span>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: phaseInfo.color }}
          >
            {displayedPhaseId === activePhaseKey
              ? lang === "hi"
                ? "वर्तमान चरण"
                : "Current"
              : lang === "hi"
                ? "चरण विवरण"
                : "Overview"}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[var(--ink)]">
          {lang === "hi" ? phaseInfo.descHi : phaseInfo.descEn}
        </p>

        <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[var(--card)] p-2.5 text-xs text-[var(--ink)] border border-[var(--line)]">
          <IconSaheliHeart className="h-4 w-4 shrink-0 text-[var(--plum)] mt-0.5" />
          <p>
            <strong className="font-semibold text-[var(--plum)]">
              {lang === "hi" ? "सुझाव:" : "Gentle care:"}
            </strong>{" "}
            <span className="text-[var(--ink)]">
              {lang === "hi" ? phaseInfo.careTipHi : phaseInfo.careTipEn}
            </span>
          </p>
        </div>

        {/* Prediction certainty note if applicable */}
        {prediction?.available && prediction?.spreadDays && (
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            {t("today", "cycleWheelDisclaimer")} (±{prediction.spreadDays}{" "}
            {t("common", "days")})
          </p>
        )}
      </div>
    </div>
  );
}


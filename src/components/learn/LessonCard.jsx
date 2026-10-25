import { useTranslation } from "../../hooks/useTranslation.js";
import { IconArrowRight, IconCheck } from "../common/Icons.jsx";

export function LessonCard({ lesson, onSelect, isCompleted = false }) {
  const { lang, t } = useTranslation();

  if (!lesson) return null;

  const title = lang === "hi" ? lesson.title?.hi : lesson.title?.en;
  const intro = lang === "hi" ? lesson.intro?.hi : lesson.intro?.en;

  return (
    <article
      className="group relative flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 shadow-xs hover:border-[#79516F]/40 dark:hover:border-[#E8A8BF]/40 hover:shadow-md transition-all duration-200"
      aria-labelledby={`lesson-title-${lesson.id}`}
    >
      <div className="space-y-3">
        {/* Card Header Badges */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-full bg-[#FAF5F0] dark:bg-[#34263E] px-2.5 py-0.5 text-[11px] font-bold text-[#79516F] dark:text-[#E8A8BF] border border-[#DECED9] dark:border-[#42324C]">
              {t("learn", lesson.category === "cycle-fundamentals" ? "categoryBasics" :
                lesson.category === "period-care" ? "categoryCare" :
                lesson.category === "symptoms" ? "categoryRelief" :
                lesson.category === "nutrition" ? "categoryNutrition" :
                lesson.category === "mental-health" ? "categoryMental" :
                lesson.category === "conditions" ? "categoryConditions" :
                lesson.category === "medicines" ? "categoryMedicines" :
                lesson.category === "doctor" ? "categoryMedical" :
                lesson.category === "myths-facts" ? "categoryMyths" : "categoryBasics")}
            </span>

            {lesson.startHere && (
              <span className="rounded-full bg-[#EBF4EC] dark:bg-[#1E3022] px-2 py-0.5 text-[10px] font-bold text-[#3F6344] dark:text-[#88C690] border border-[#CDE3CF] dark:border-[#2D4A32]">
                {t("learn", "startHere")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[var(--muted)] text-[11px] font-medium shrink-0">
            {isCompleted && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#EBF4EC] dark:bg-[#1E3022] px-2 py-0.5 text-[10px] font-bold text-[#3F6344] dark:text-[#88C690]"
                title={t("learn", "completed")}
              >
                <IconCheck className="h-3 w-3" />
                <span className="hidden xs:inline">{t("learn", "completed")}</span>
              </span>
            )}
            <span>{lesson.readTime}</span>
          </div>
        </div>

        {/* Lesson Title */}
        <h3
          id={`lesson-title-${lesson.id}`}
          className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)] leading-snug group-hover:text-[#79516F] dark:group-hover:text-[#E8A8BF] transition-colors"
        >
          {title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-3 leading-relaxed">
          {intro}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-2 border-t border-[var(--line)]/60 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onSelect(lesson)}
          className="touch-target inline-flex items-center gap-1.5 text-xs font-bold text-[#79516F] dark:text-[#E8A8BF] group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F]"
          aria-label={`${t("learn", "readLesson")}: ${title}`}
        >
          <span>{t("learn", "readLesson")}</span>
          <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {lesson.sources && lesson.sources.length > 0 && (
          <span className="text-[10px] text-[var(--muted)] truncate max-w-[140px]">
            {lesson.sources[0].name.split("—")[0].trim()}
          </span>
        )}
      </div>
    </article>
  );
}

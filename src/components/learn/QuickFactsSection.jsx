import { useTranslation } from "../../hooks/useTranslation.js";
import { QUICK_FACTS } from "../../data/lessons/index.js";

export function QuickFactsSection() {
  const { lang, t } = useTranslation();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
          {t("learn", "quickFactsTitle")}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)]">
          {t("learn", "quickFactsSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_FACTS.map((fact) => {
          const title = lang === "hi" ? fact.title?.hi : fact.title?.en;
          const desc = lang === "hi" ? fact.description?.hi : fact.description?.en;

          return (
            <div
              key={fact.id}
              className="flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-xs hover:border-[#3F6344]/40 dark:hover:border-[#88C690]/40 transition-colors"
            >
              <div className="space-y-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#3F6344] dark:text-[#88C690]">
                  {fact.stat}
                </span>
                <h3 className="font-serif text-sm font-bold text-[var(--ink)] leading-snug">
                  {title}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--line)]/50 text-[10px] text-[var(--muted)] font-medium">
                {fact.source}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

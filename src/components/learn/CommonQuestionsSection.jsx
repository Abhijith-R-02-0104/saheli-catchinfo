import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation.js";
import { COMMON_QUESTIONS, getLessonById } from "../../data/lessons/index.js";
import { IconArrowRight } from "../common/Icons.jsx";

export function CommonQuestionsSection({ onSelectLesson }) {
  const { lang, t } = useTranslation();
  const [openIds, setOpenIds] = useState([COMMON_QUESTIONS[0]?.id]);

  function toggleQuestion(id) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
          {t("learn", "faqTitle")}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)]">
          {t("learn", "faqSubtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {COMMON_QUESTIONS.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          const question = lang === "hi" ? faq.question?.hi : faq.question?.en;
          const answer = lang === "hi" ? faq.answer?.hi : faq.answer?.en;
          const relatedLesson = faq.relatedLessonId ? getLessonById(faq.relatedLessonId) : null;

          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleQuestion(faq.id)}
                className="w-full flex items-center justify-between gap-4 text-left font-serif text-sm sm:text-base font-bold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
                aria-expanded={isOpen}
              >
                <span>{question}</span>
                <span className="text-lg text-[#79516F] dark:text-[#E8A8BF] shrink-0 font-sans">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-[var(--line)] space-y-3 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  <p>{answer}</p>
                  {relatedLesson && onSelectLesson && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectLesson(relatedLesson)}
                        className="touch-target inline-flex items-center gap-1.5 font-bold text-xs text-[#79516F] dark:text-[#E8A8BF] hover:underline"
                      >
                        <span>
                          {lang === "hi" ? "पूरा पाठ पढ़ें" : "Read related lesson"}: {lang === "hi" ? relatedLesson.title?.hi : relatedLesson.title?.en}
                        </span>
                        <IconArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "../../hooks/useTranslation.js";
import { getRelatedLessons } from "../../data/lessons/index.js";
import {
  IconArrowLeft,
  IconCheck,
  IconShield,
  IconBookOpen,
} from "../common/Icons.jsx";

const COMPLETED_STORAGE_KEY = "saheli.completed_lessons.v1";

function checkLessonCompleted(lessonId) {
  try {
    const stored = localStorage.getItem(COMPLETED_STORAGE_KEY);
    if (stored) {
      const completedIds = JSON.parse(stored);
      return Array.isArray(completedIds) && completedIds.includes(lessonId);
    }
  } catch {
    // Ignore localStorage errors
  }
  return false;
}

export function LessonReader({ lesson, onBack, onSelectRelated }) {
  const { lang, t } = useTranslation();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [storageVersion, setStorageVersion] = useState(0);
  const articleRef = useRef(null);

  const isCompleted = useMemo(() => {
    void storageVersion;
    return checkLessonCompleted(lesson.id);
  }, [lesson.id, storageVersion]);

  // Toggle completion status in localStorage
  function handleToggleCompleted() {
    try {
      const stored = localStorage.getItem(COMPLETED_STORAGE_KEY);
      let completedIds = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(completedIds)) completedIds = [];

      let updated;
      if (completedIds.includes(lesson.id)) {
        updated = completedIds.filter((id) => id !== lesson.id);
      } else {
        updated = [...completedIds, lesson.id];
      }
      localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(updated));
      setStorageVersion((v) => v + 1);
    } catch {
      // Ignore localStorage errors
    }
  }

  // Scroll reading progress indicator
  useEffect(() => {
    function handleScroll() {
      if (!articleRef.current) return;
      const element = articleRef.current;
      const totalHeight = element.clientHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setReadingProgress(100);
        return;
      }
      const elementTop = element.getBoundingClientRect().top;
      const scrolled = Math.max(0, -elementTop);
      const progress = Math.min(100, Math.round((scrolled / totalHeight) * 100));
      setReadingProgress(progress);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lesson.id]);

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lesson.id]);

  // Web Speech API text-to-speech
  function compileTextToSpeak() {
    const title = lang === "hi" ? lesson.title?.hi : lesson.title?.en;
    const intro = lang === "hi" ? lesson.intro?.hi : lesson.intro?.en;
    const sectionTexts = (lesson.sections || [])
      .map((s) => `${lang === "hi" ? s.heading?.hi : s.heading?.en}. ${lang === "hi" ? s.body?.hi : s.body?.en}`)
      .join(". ");
    return `${title}. ${intro}. ${sectionTexts}`;
  }

  function handleToggleReadAloud() {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = compileTextToSpeak();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  // Stop audio on unmount or lesson change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lesson.id]);

  const relatedLessons = getRelatedLessons(lesson.id);

  const title = lang === "hi" ? lesson.title?.hi : lesson.title?.en;
  const intro = lang === "hi" ? lesson.intro?.hi : lesson.intro?.en;
  const whatYouWillLearn = lang === "hi" ? lesson.whatYouWillLearn?.hi : lesson.whatYouWillLearn?.en;
  const practicalGuidance = lang === "hi" ? lesson.practicalGuidance?.hi : lesson.practicalGuidance?.en;
  const whenToSeekDoctor = lang === "hi" ? lesson.whenToSeekDoctor?.hi : lesson.whenToSeekDoctor?.en;
  const keyTakeaways = lang === "hi" ? lesson.keyTakeaways?.hi : lesson.keyTakeaways?.en;

  const categoryName = t("learn",
    lesson.category === "cycle-fundamentals" ? "categoryBasics" :
    lesson.category === "period-care" ? "categoryCare" :
    lesson.category === "symptoms" ? "categoryRelief" :
    lesson.category === "nutrition" ? "categoryNutrition" :
    lesson.category === "mental-health" ? "categoryMental" :
    lesson.category === "conditions" ? "categoryConditions" :
    lesson.category === "medicines" ? "categoryMedicines" :
    lesson.category === "doctor" ? "categoryMedical" :
    lesson.category === "myths-facts" ? "categoryMyths" : "categoryBasics"
  );

  return (
    <div ref={articleRef} className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-16">
      {/* Sticky Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#EFE6EC] dark:bg-[#3D2E47] z-50"
        role="progressbar"
        aria-valuenow={readingProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={t("learn", "readingProgress")}
      >
        <div
          className="h-full bg-gradient-to-r from-[#E9B7C8] via-[#79516F] to-[#3F6344] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Reader Navigation & Controls Bar */}
      <div className="sticky top-2 z-40 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line-strong)] bg-[var(--card)]/95 backdrop-blur-md px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="touch-target inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--card-subtle)] transition-colors focus-visible:outline-2 focus-visible:outline-[#79516F]"
        >
          <IconArrowLeft className="h-4 w-4" />
          <span>{t("learn", "backToLearn")}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleToggleReadAloud}
            className={`touch-target inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition-all ${
              isPlayingAudio
                ? "bg-[#8F1D1D] text-white"
                : "bg-[#79516F] text-white hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
            }`}
            aria-label={isPlayingAudio ? t("learn", "stopAudio") : t("learn", "readAloud")}
          >
            <span>{isPlayingAudio ? "⏹" : "🔊"}</span>
            <span className="hidden sm:inline">
              {isPlayingAudio ? t("learn", "stopAudio") : t("learn", "readAloud")}
            </span>
          </button>

          {/* Mark as Completed Button */}
          <button
            type="button"
            onClick={handleToggleCompleted}
            className={`touch-target inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              isCompleted
                ? "border-[#3F6344] bg-[#EBF4EC] text-[#3F6344] dark:bg-[#1E3022] dark:text-[#88C690] dark:border-[#2D4A32]"
                : "border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--card-subtle)]"
            }`}
          >
            <IconCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isCompleted ? t("learn", "completed") : t("learn", "markCompleted")}
            </span>
          </button>
        </div>
      </div>

      {/* Main Lesson Article */}
      <article className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-10 shadow-xs space-y-8">
        {/* Article Header */}
        <header className="space-y-4 border-b border-[var(--line)] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[#FCF4F7] dark:bg-[#341F2E] px-3 py-1 text-xs font-bold text-[#79516F] dark:text-[#E8A8BF] border border-[#E9B7C8] dark:border-[#5C2E4A]">
              {categoryName}
            </span>
            <span className="text-[var(--muted)]">•</span>
            <span className="text-[var(--muted)] font-medium">
              {lesson.readTime} {t("learn", "estimatedRead")}
            </span>
            {isCompleted && (
              <>
                <span className="text-[var(--muted)]">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#3F6344] dark:text-[#88C690]">
                  <IconCheck className="h-3 w-3" />
                  <span>{t("learn", "completed")}</span>
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--ink)] leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {intro}
          </p>

          {/* Educational Safety Disclaimer Banner */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#FAF5F0] dark:bg-[#281F30] p-3.5 border border-[#DECED9] dark:border-[#42324C] text-xs text-[var(--muted)] leading-relaxed">
            <IconShield className="h-4 w-4 text-[#79516F] dark:text-[#E8A8BF] shrink-0 mt-0.5" />
            <span>{t("learn", "disclaimerText")}</span>
          </div>
        </header>

        {/* What You Will Learn Box */}
        {whatYouWillLearn && whatYouWillLearn.length > 0 && (
          <section className="rounded-2xl bg-[#FCF4F7] dark:bg-[#341F2E]/60 p-5 sm:p-6 border border-[#E9B7C8] dark:border-[#5C2E4A] space-y-3">
            <h2 className="flex items-center gap-2 font-serif text-base sm:text-lg font-bold text-[#79516F] dark:text-[#E8A8BF]">
              <IconBookOpen className="h-4 w-4" />
              <span>{t("learn", "whatYouWillLearn")}</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[var(--ink)]">
              {whatYouWillLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#79516F] dark:bg-[#E8A8BF] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Table of Contents */}
        {lesson.sections && lesson.sections.length > 1 && (
          <nav aria-label={t("learn", "tableOfContents")} className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-4 sm:p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {t("learn", "tableOfContents")}
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {lesson.sections.map((sec, idx) => {
                const headingText = lang === "hi" ? sec.heading?.hi : sec.heading?.en;
                return (
                  <li key={idx}>
                    <a
                      href={`#section-${idx}`}
                      className="text-[#79516F] dark:text-[#E8A8BF] hover:underline flex items-center gap-1.5"
                    >
                      <span>→</span>
                      <span>{headingText}</span>
                    </a>
                  </li>
                );
              })}
              {lesson.biologicalMechanism && (
                <li>
                  <a href="#biological-mechanism" className="text-[#79516F] dark:text-[#E8A8BF] hover:underline flex items-center gap-1.5">
                    <span>→</span>
                    <span>{t("learn", "biologicalMechanism")}</span>
                  </a>
                </li>
              )}
              {lesson.practicalGuidance && (
                <li>
                  <a href="#practical-guidance" className="text-[#79516F] dark:text-[#E8A8BF] hover:underline flex items-center gap-1.5">
                    <span>→</span>
                    <span>{t("learn", "practicalGuidance")}</span>
                  </a>
                </li>
              )}
              {lesson.whenToSeekDoctor && (
                <li>
                  <a href="#when-to-seek-help" className="text-[#79516F] dark:text-[#E8A8BF] hover:underline flex items-center gap-1.5">
                    <span>→</span>
                    <span>{t("learn", "whenToSeekHelp")}</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Main Sections */}
        <div className="space-y-8">
          {lesson.sections?.map((sec, idx) => {
            const heading = lang === "hi" ? sec.heading?.hi : sec.heading?.en;
            const body = lang === "hi" ? sec.body?.hi : sec.body?.en;
            const callout = lang === "hi" ? sec.keyCallout?.hi : sec.keyCallout?.en;

            return (
              <section key={idx} id={`section-${idx}`} className="space-y-3 scroll-mt-20">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                  {heading}
                </h2>
                <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed whitespace-pre-line">
                  {body}
                </p>

                {callout && (
                  <div className="rounded-2xl border-l-4 border-[#79516F] bg-[#FAF5F0] dark:bg-[#281F30] p-4 text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                    <strong>{lang === "hi" ? "महत्वपूर्ण बिंदु: " : "Clinical Insight: "}</strong>
                    {callout}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Biological Mechanism Box */}
        {lesson.biologicalMechanism && (
          <section
            id="biological-mechanism"
            className="rounded-3xl border border-[#3F6344]/30 bg-[#EBF4EC]/50 dark:bg-[#1E3022]/40 p-6 space-y-3 scroll-mt-20"
          >
            <div className="flex items-center gap-2 text-[#3F6344] dark:text-[#88C690]">
              <span className="text-base">🧬</span>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                {t("learn", "biologicalMechanism")}: {lang === "hi" ? lesson.biologicalMechanism.title?.hi : lesson.biologicalMechanism.title?.en}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
              {lang === "hi" ? lesson.biologicalMechanism.text?.hi : lesson.biologicalMechanism.text?.en}
            </p>
          </section>
        )}

        {/* Practical Guidance Checklist */}
        {practicalGuidance && practicalGuidance.length > 0 && (
          <section id="practical-guidance" className="space-y-4 scroll-mt-20">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
              {t("learn", "practicalGuidance")}
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {practicalGuidance.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-3.5 sm:p-4 text-xs sm:text-sm text-[var(--ink)] leading-relaxed"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#79516F] text-white text-[11px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Misconceptions (Myths vs Facts) */}
        {lesson.commonMisconceptions && lesson.commonMisconceptions.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
              {t("learn", "commonMisconceptions")}
            </h2>
            <div className="space-y-3">
              {lesson.commonMisconceptions.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-[#A82A2A] dark:text-[#E57373]">
                    <span className="font-bold shrink-0 uppercase tracking-wide">
                      {t("learn", "myth")}:
                    </span>
                    <span className="italic">
                      "{lang === "hi" ? item.myth?.hi : item.myth?.en}"
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-[#2D6638] dark:text-[#81C784] border-t border-[var(--line)] pt-2.5">
                    <span className="font-bold shrink-0 uppercase tracking-wide">
                      {t("learn", "fact")}:
                    </span>
                    <span>
                      {lang === "hi" ? item.fact?.hi : item.fact?.en}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* When to Seek Doctor Red Flags */}
        {whenToSeekDoctor && whenToSeekDoctor.length > 0 && (
          <section
            id="when-to-seek-help"
            className="rounded-3xl border border-[#A82A2A]/40 bg-[#FDF2F2] dark:bg-[#381B1B]/40 p-6 space-y-3 scroll-mt-20"
          >
            <h2 className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold text-[#A82A2A] dark:text-[#E57373]">
              <span>⚠️</span>
              <span>{t("learn", "whenToSeekHelp")}</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
              {whenToSeekDoctor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#A82A2A] dark:text-[#E57373] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Key Takeaways */}
        {keyTakeaways && keyTakeaways.length > 0 && (
          <section className="rounded-3xl border border-[#79516F]/30 bg-[#FAF5F0] dark:bg-[#281F30] p-6 space-y-3">
            <h2 className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold text-[#79516F] dark:text-[#E8A8BF]">
              <IconCheck className="h-4 w-4" />
              <span>{t("learn", "keyTakeaways")}</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#3F6344] dark:text-[#88C690] font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Verified References & External Sources */}
        {lesson.sources && lesson.sources.length > 0 && (
          <footer className="border-t border-[var(--line)] pt-6 space-y-2 text-xs text-[var(--muted)]">
            <strong className="block text-[var(--ink)] font-semibold text-sm">
              {t("learn", "sources")}:
            </strong>
            <ul className="list-disc pl-5 space-y-1">
              {lesson.sources.map((s, idx) => (
                <li key={idx}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[#79516F] dark:text-[#E8A8BF] hover:underline"
                  >
                    {s.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>

      {/* Related Lessons Section */}
      {relatedLessons.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
            {t("learn", "relatedLessons")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedLessons.map((rel) => {
              const relTitle = lang === "hi" ? rel.title?.hi : rel.title?.en;
              const relIntro = lang === "hi" ? rel.intro?.hi : rel.intro?.en;
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectRelated(rel)}
                  className="text-left rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 hover:border-[#79516F] dark:hover:border-[#E8A8BF] transition-all space-y-2 shadow-xs group"
                >
                  <span className="text-[10px] font-bold text-[#79516F] dark:text-[#E8A8BF] uppercase">
                    {rel.readTime}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-[var(--ink)] group-hover:text-[#79516F] dark:group-hover:text-[#E8A8BF] line-clamp-2">
                    {relTitle}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)] line-clamp-2">
                    {relIntro}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

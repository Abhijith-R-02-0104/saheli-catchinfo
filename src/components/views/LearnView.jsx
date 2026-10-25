import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation.js";
import { EditorialBanner } from "../common/EditorialBanner.jsx";
import { IconBookOpen, IconCheck, IconCross, IconArrowRight } from "../common/Icons.jsx";
import {
  CATEGORIES,
  getAllLessons,
  getLessonById,
  searchLessons,
  getStartHereLessons,
  getFeaturedLessons,
} from "../../data/lessons/index.js";
import { LessonCard } from "../learn/LessonCard.jsx";
import { LessonReader } from "../learn/LessonReader.jsx";
import { QuickFactsSection } from "../learn/QuickFactsSection.jsx";
import { CommonQuestionsSection } from "../learn/CommonQuestionsSection.jsx";

const COMPLETED_STORAGE_KEY = "saheli.completed_lessons.v1";

function getInitialCompletedLessons() {
  try {
    const stored = localStorage.getItem(COMPLETED_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore localStorage read errors
  }
  return [];
}

export function LearnView() {
  const { lang, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // URL-driven lesson selection
  const lessonIdFromUrl = searchParams.get("lesson");
  const selectedLesson = useMemo(() => {
    return lessonIdFromUrl ? getLessonById(lessonIdFromUrl) : null;
  }, [lessonIdFromUrl]);

  // Load completed lessons from localStorage
  const completedLessonIds = getInitialCompletedLessons();

  function handleSelectLesson(lesson) {
    if (!lesson) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("lesson");
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("lesson", lesson.id);
        return next;
      });
    }
  }

  function handleBackToLearn() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("lesson");
      return next;
    });
  }

  function handleClearSearch() {
    setSearchQuery("");
    setActiveCategory("all");
  }

  // Filter lessons by search query and category
  const filteredLessons = useMemo(() => {
    let lessons = getAllLessons();

    // Apply category filter
    if (activeCategory !== "all") {
      lessons = lessons.filter((l) => l.category === activeCategory);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const queryResults = searchLessons(searchQuery, lang);
      const queryIds = new Set(queryResults.map((l) => l.id));
      lessons = lessons.filter((l) => queryIds.has(l.id));
    }

    return lessons;
  }, [activeCategory, searchQuery, lang]);

  // Category counts for pill badges
  const categoryCounts = useMemo(() => {
    const all = getAllLessons();
    const counts = { all: all.length };
    for (const cat of CATEGORIES) {
      if (cat.id !== "all") {
        counts[cat.id] = all.filter((l) => l.category === cat.id).length;
      }
    }
    return counts;
  }, []);

  const startHereLessons = useMemo(() => getStartHereLessons(), []);
  const featuredLesson = useMemo(() => {
    const featured = getFeaturedLessons();
    return featured.length > 0 ? featured[0] : getAllLessons()[0];
  }, []);

  // If a lesson is selected, show the full dedicated reading experience
  if (selectedLesson) {
    return (
      <LessonReader
        lesson={selectedLesson}
        onBack={handleBackToLearn}
        onSelectRelated={(related) => handleSelectLesson(related)}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto pb-16">
      {/* Editorial Banner */}
      <EditorialBanner
        variant="learn"
        tag={
          <span className="flex items-center gap-1.5">
            <IconBookOpen className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" />
            <span>{t("nav", "learn")}</span>
          </span>
        }
        title={t("learn", "title")}
        description={
          lang === "hi"
            ? "प्रमाणित चिकित्सीय स्रोतों पर आधारित सुरक्षित और प्रामाणिक स्वास्थ्य शिक्षा (ACOG, NHS, WHO, FOGSI)।"
            : "Empowering, evidence-based menstrual and hormonal education grounded in global clinical guidelines (ACOG, NHS, WHO)."
        }
        badge={
          <span className="flex items-center gap-1">
            <IconCheck className="h-3 w-3 text-[#3F6344] dark:text-[#88C690]" />
            <span>{lang === "hi" ? "चिकित्सीय समीक्षा" : "Evidence-Based Guidance"}</span>
          </span>
        }
      />

      {/* Search Input Bar */}
      <div className="relative">
        <label htmlFor="lesson-search" className="sr-only">
          {t("learn", "searchPlaceholder")}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-[var(--muted)] pointer-events-none">
            🔍
          </span>
          <input
            id="lesson-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("learn", "searchPlaceholder")}
            className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] py-3.5 pl-11 pr-10 text-sm text-[var(--ink)] placeholder-[var(--muted)] shadow-xs transition-all focus:border-[#79516F] focus:outline-none focus:ring-2 focus:ring-[#79516F]/20 dark:focus:border-[#8D5C82]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-full"
              aria-label={t("learn", "clearSearch")}
            >
              <IconCross className="h-4 w-4" />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)] px-1">
            <span>
              {t("learn", "searchResults")}: <strong>{filteredLessons.length}</strong> {lang === "hi" ? "लेख मिले" : "lessons found"}
            </span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="font-semibold text-[#79516F] dark:text-[#E8A8BF] hover:underline"
            >
              {t("learn", "clearSearch")}
            </button>
          </div>
        )}
      </div>

      {/* Featured Lesson Hero Card (Shown when not searching and on 'all' category) */}
      {!searchQuery && activeCategory === "all" && featuredLesson && (
        <section aria-label={t("learn", "featuredLesson")} className="relative overflow-hidden rounded-3xl border border-[#DECED9] dark:border-[#42324C] bg-gradient-to-br from-[#FAF5F0] via-[var(--card)] to-[#FCF4F7] dark:from-[#281F30] dark:via-[var(--card)] dark:to-[#341F2E] p-6 sm:p-8 shadow-sm">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#79516F] text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                ★ {t("learn", "featuredLesson")}
              </span>
              <span className="rounded-full bg-white dark:bg-[#341F2E] px-2.5 py-0.5 text-[11px] font-bold text-[#79516F] dark:text-[#E8A8BF] border border-[#E9B7C8] dark:border-[#5C2E4A]">
                {featuredLesson.readTime}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)] leading-snug">
              {lang === "hi" ? featuredLesson.title?.hi : featuredLesson.title?.en}
            </h2>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              {lang === "hi" ? featuredLesson.intro?.hi : featuredLesson.intro?.en}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSelectLesson(featuredLesson)}
                className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F]"
              >
                <span>{t("learn", "readLesson")}</span>
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Start Here Beginner Collection (Shown when not searching and on 'all' category) */}
      {!searchQuery && activeCategory === "all" && startHereLessons.length > 0 && (
        <section aria-label={t("learn", "startHere")} className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3F6344] text-white text-xs">
                ✓
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                {t("learn", "startHere")}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              {t("learn", "startHereDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {startHereLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onSelect={handleSelectLesson}
                isCompleted={completedLessonIds.includes(lesson.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Category Filter Pills (Responsive wrapping) */}
      <section aria-label="Lesson Categories" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
            {activeCategory === "all" ? t("learn", "allLessons") : t("learn",
              CATEGORIES.find((c) => c.id === activeCategory)?.translationKey || "allLessons"
            )}
          </h2>
          <span className="text-xs font-semibold text-[var(--muted)]">
            {filteredLessons.length} {lang === "hi" ? "उपलब्ध" : "available"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-1" role="tablist" aria-label="Topic categories">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            const label = t("learn", cat.translationKey);

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`touch-target inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                  isActive
                    ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                    : "bg-white text-[#292536] border-[#DECED9] hover:bg-[#FAF5F0] dark:bg-[#281F30] dark:text-[#F7EDF5] dark:border-[#42324C] dark:hover:bg-[#34263E]"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#EFE6EC] text-[#79516F] dark:bg-[#3D2E47] dark:text-[#E8A8BF]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Lessons Grid or Empty State */}
      {filteredLessons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--line-strong)] bg-[var(--card)] p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF5F0] dark:bg-[#34263E] text-2xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
              {t("learn", "noLessonsFound")}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md mx-auto">
              {t("learn", "noLessonsFoundDesc")}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="touch-target inline-flex items-center gap-1.5 rounded-xl bg-[#79516F] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#633E5A] transition-colors"
            >
              <span>{t("learn", "clearSearch")}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onSelect={handleSelectLesson}
              isCompleted={completedLessonIds.includes(lesson.id)}
            />
          ))}
        </div>
      )}

      {/* Evidence-Based Quick Facts */}
      <div className="pt-6 border-t border-[var(--line)]">
        <QuickFactsSection />
      </div>

      {/* Common Questions (FAQ) */}
      <div className="pt-6 border-t border-[var(--line)]">
        <CommonQuestionsSection onSelectLesson={handleSelectLesson} />
      </div>
    </div>
  );
}

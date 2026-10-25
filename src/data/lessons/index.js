/**
 * Educational Lesson Library Aggregator
 * Gathers all 42 lessons across 9 categories with search, category filtering,
 * and quick-fact references.
 */
import { CYCLE_FUNDAMENTALS_LESSONS } from "./cycleFundamentals.js";
import { PERIOD_CARE_LESSONS } from "./periodCare.js";
import { SYMPTOM_LESSONS } from "./symptoms.js";
import { NUTRITION_LESSONS } from "./nutrition.js";
import { MENTAL_HEALTH_LESSONS } from "./mentalHealth.js";
import { CONDITIONS_LESSONS } from "./conditions.js";
import { MEDICAL_HELP_LESSONS } from "./medicalHelp.js";
import { MEDICINES_LESSONS } from "./medicines.js";
import { MYTHS_FACTS_LESSONS } from "./mythsFacts.js";
import { QUICK_FACTS } from "./quickFacts.js";
import { COMMON_QUESTIONS } from "./commonQuestions.js";

export { QUICK_FACTS, COMMON_QUESTIONS };

export const ALL_LESSONS = [
  ...CYCLE_FUNDAMENTALS_LESSONS,
  ...PERIOD_CARE_LESSONS,
  ...SYMPTOM_LESSONS,
  ...NUTRITION_LESSONS,
  ...MENTAL_HEALTH_LESSONS,
  ...CONDITIONS_LESSONS,
  ...MEDICAL_HELP_LESSONS,
  ...MEDICINES_LESSONS,
  ...MYTHS_FACTS_LESSONS,
];

export const CATEGORIES = [
  { id: "all", translationKey: "allLessons" },
  { id: "cycle-fundamentals", translationKey: "categoryBasics" },
  { id: "period-care", translationKey: "categoryCare" },
  { id: "symptoms", translationKey: "categoryRelief" },
  { id: "nutrition", translationKey: "categoryNutrition" },
  { id: "mental-health", translationKey: "categoryMental" },
  { id: "conditions", translationKey: "categoryConditions" },
  { id: "medicines", translationKey: "categoryMedicines" },
  { id: "doctor", translationKey: "categoryMedical" },
  { id: "myths-facts", translationKey: "categoryMyths" },
];

/**
 * Retrieve all lessons in the library
 */
export function getAllLessons() {
  return ALL_LESSONS;
}

/**
 * Retrieve a specific lesson by its unique string ID
 */
export function getLessonById(id) {
  if (!id) return null;
  return ALL_LESSONS.find((l) => l.id === id) || null;
}

/**
 * Filter lessons by category ID
 */
export function getLessonsByCategory(categoryId) {
  if (!categoryId || categoryId === "all") {
    return ALL_LESSONS;
  }
  return ALL_LESSONS.filter((l) => l.category === categoryId);
}

/**
 * Beginner-friendly 'Start Here' collection
 */
export function getStartHereLessons() {
  return ALL_LESSONS.filter((l) => l.startHere);
}

/**
 * Featured lessons for hero spotlight
 */
export function getFeaturedLessons() {
  return ALL_LESSONS.filter((l) => l.featured);
}

/**
 * Find related lessons by IDs or same category fallback
 */
export function getRelatedLessons(lessonId) {
  const current = getLessonById(lessonId);
  if (!current) return [];

  if (current.relatedLessonIds && current.relatedLessonIds.length > 0) {
    const directMatches = current.relatedLessonIds
      .map((id) => getLessonById(id))
      .filter(Boolean);
    if (directMatches.length > 0) return directMatches.slice(0, 3);
  }

  // Fallback to same category
  return ALL_LESSONS.filter(
    (l) => l.category === current.category && l.id !== current.id,
  ).slice(0, 3);
}

/**
 * Working search across titles, intros, categories, sections, and takeaways
 */
export function searchLessons(query, lang = "en") {
  if (!query || !query.trim()) {
    return ALL_LESSONS;
  }

  const cleanQuery = query.trim().toLowerCase();

  return ALL_LESSONS.filter((lesson) => {
    // Check titles
    const titleEn = lesson.title?.en?.toLowerCase() || "";
    const titleHi = lesson.title?.hi?.toLowerCase() || "";
    if (titleEn.includes(cleanQuery) || titleHi.includes(cleanQuery)) return true;

    // Check intros
    const introEn = lesson.intro?.en?.toLowerCase() || "";
    const introHi = lesson.intro?.hi?.toLowerCase() || "";
    if (introEn.includes(cleanQuery) || introHi.includes(cleanQuery)) return true;

    // Check category id
    if (lesson.category.toLowerCase().includes(cleanQuery)) return true;

    // Check section headings and bodies
    if (lesson.sections) {
      for (const sec of lesson.sections) {
        const hEn = sec.heading?.en?.toLowerCase() || "";
        const hHi = sec.heading?.hi?.toLowerCase() || "";
        const bEn = sec.body?.en?.toLowerCase() || "";
        const bHi = sec.body?.hi?.toLowerCase() || "";
        if (
          hEn.includes(cleanQuery) ||
          hHi.includes(cleanQuery) ||
          bEn.includes(cleanQuery) ||
          bHi.includes(cleanQuery)
        ) {
          return true;
        }
      }
    }

    // Check takeaways
    const takeaways = lesson.keyTakeaways?.[lang] || lesson.keyTakeaways?.en || [];
    for (const t of takeaways) {
      if (t.toLowerCase().includes(cleanQuery)) return true;
    }

    return false;
  });
}

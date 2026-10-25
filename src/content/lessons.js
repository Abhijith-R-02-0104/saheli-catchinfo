/**
 * Source-linked bilingual health education; general information, not diagnosis.
 * Re-exports the comprehensive educational library for backward compatibility.
 */
import { ALL_LESSONS, getLessonById as getLessonByIdFromLib } from "../data/lessons/index.js";

export const LESSONS = ALL_LESSONS.map((l) => ({
  ...l,
  summary: l.intro, // Backward-compatibility alias
  source: l.sources?.[0] || { name: "ACOG / NHS / WHO", url: "https://www.who.int" },
}));

export function getLessonById(id) {
  const lesson = getLessonByIdFromLib(id);
  if (!lesson) return null;
  return {
    ...lesson,
    summary: lesson.intro,
    source: lesson.sources?.[0] || { name: "ACOG / NHS / WHO", url: "https://www.who.int" },
  };
}

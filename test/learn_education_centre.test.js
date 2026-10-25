import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_LESSONS,
  CATEGORIES,
  getAllLessons,
  getLessonById,
  getLessonsByCategory,
  getStartHereLessons,
  getFeaturedLessons,
  getRelatedLessons,
  searchLessons,
  QUICK_FACTS,
  COMMON_QUESTIONS,
} from "../src/data/lessons/index.js";
import { translations } from "../src/data/translations.js";

test("Learn Education Centre: Library Completeness & Structural Quality", async (t) => {
  await t.test("1. Library size and comprehensive coverage", () => {
    const all = getAllLessons();
    assert.ok(all.length >= 40, `Expected at least 40 lessons, got ${all.length}`);

    // Verify all IDs are unique strings
    const idSet = new Set();
    for (const lesson of all) {
      assert.ok(lesson.id && typeof lesson.id === "string", `Lesson missing id`);
      assert.ok(!idSet.has(lesson.id), `Duplicate lesson id found: ${lesson.id}`);
      idSet.add(lesson.id);
    }
  });

  await t.test("2. Every lesson has substantive bilingual content and medical references", () => {
    const all = getAllLessons();
    for (const lesson of all) {
      // Titles in both languages
      assert.ok(lesson.title?.en?.trim(), `Lesson ${lesson.id} missing English title`);
      assert.ok(lesson.title?.hi?.trim(), `Lesson ${lesson.id} missing Hindi title`);

      // Intros in both languages
      assert.ok(lesson.intro?.en?.trim(), `Lesson ${lesson.id} missing English intro`);
      assert.ok(lesson.intro?.hi?.trim(), `Lesson ${lesson.id} missing Hindi intro`);

      // Reading time
      assert.ok(lesson.readTime?.includes("min"), `Lesson ${lesson.id} missing valid readTime`);

      // What you will learn
      assert.ok(
        Array.isArray(lesson.whatYouWillLearn?.en) && lesson.whatYouWillLearn.en.length >= 2,
        `Lesson ${lesson.id} missing English whatYouWillLearn list`,
      );
      assert.ok(
        Array.isArray(lesson.whatYouWillLearn?.hi) && lesson.whatYouWillLearn.hi.length >= 2,
        `Lesson ${lesson.id} missing Hindi whatYouWillLearn list`,
      );

      // Structured sections with headings and bodies
      assert.ok(
        Array.isArray(lesson.sections) && lesson.sections.length >= 1,
        `Lesson ${lesson.id} must have at least one structured section`,
      );
      for (const sec of lesson.sections) {
        assert.ok(sec.heading?.en?.trim(), `Lesson ${lesson.id} section missing English heading`);
        assert.ok(sec.heading?.hi?.trim(), `Lesson ${lesson.id} section missing Hindi heading`);
        assert.ok(sec.body?.en?.trim(), `Lesson ${lesson.id} section missing English body`);
        assert.ok(sec.body?.hi?.trim(), `Lesson ${lesson.id} section missing Hindi body`);
      }

      // Practical guidance
      assert.ok(
        Array.isArray(lesson.practicalGuidance?.en) && lesson.practicalGuidance.en.length >= 2,
        `Lesson ${lesson.id} missing English practical guidance`,
      );
      assert.ok(
        Array.isArray(lesson.practicalGuidance?.hi) && lesson.practicalGuidance.hi.length >= 2,
        `Lesson ${lesson.id} missing Hindi practical guidance`,
      );

      // Key takeaways
      assert.ok(
        Array.isArray(lesson.keyTakeaways?.en) && lesson.keyTakeaways.en.length >= 2,
        `Lesson ${lesson.id} missing English key takeaways`,
      );
      assert.ok(
        Array.isArray(lesson.keyTakeaways?.hi) && lesson.keyTakeaways.hi.length >= 2,
        `Lesson ${lesson.id} missing Hindi key takeaways`,
      );

      // Verified Medical Sources
      assert.ok(
        Array.isArray(lesson.sources) && lesson.sources.length >= 1,
        `Lesson ${lesson.id} must have at least one medical citation`,
      );
      for (const s of lesson.sources) {
        assert.ok(s.name?.trim(), `Lesson ${lesson.id} source missing name`);
        assert.ok(s.url?.startsWith("http"), `Lesson ${lesson.id} source missing valid URL`);
      }
    }
  });

  await t.test("3. All 9 prompt educational categories exist and contain lessons", () => {
    assert.equal(CATEGORIES.length, 10, "Expected 10 category definitions including 'all'");
    const requiredCategories = [
      "cycle-fundamentals",
      "period-care",
      "symptoms",
      "nutrition",
      "mental-health",
      "conditions",
      "medicines",
      "doctor",
      "myths-facts",
    ];

    for (const catId of requiredCategories) {
      const lessonsInCat = getLessonsByCategory(catId);
      assert.ok(
        lessonsInCat.length >= 1,
        `Category ${catId} must contain at least 1 lesson, found ${lessonsInCat.length}`,
      );
    }
  });

  await t.test("4. Working search across English and Hindi queries", () => {
    // English searches
    const crampResults = searchLessons("cramps", "en");
    assert.ok(crampResults.some((l) => l.id === "menstrual-cramps"), "Search for 'cramps' should find menstrual-cramps");

    const pcosResults = searchLessons("pcos", "en");
    assert.ok(pcosResults.some((l) => l.id === "understanding-pcos"), "Search for 'pcos' should find understanding-pcos");

    const ironResults = searchLessons("iron", "en");
    assert.ok(ironResults.some((l) => l.id === "iron-menstrual-health"), "Search for 'iron' should find iron lesson");

    // Hindi searches
    const hindiCrampResults = searchLessons("ऐंठन", "hi");
    assert.ok(hindiCrampResults.length >= 1, "Search for 'ऐंठन' should return results");

    const hindiThyroidResults = searchLessons("थायरॉयड", "hi");
    assert.ok(hindiThyroidResults.some((l) => l.id === "thyroid-menstrual-changes"), "Search for 'थायरॉयड' should find thyroid lesson");

    // Empty search returns all
    const emptyResults = searchLessons("", "en");
    assert.equal(emptyResults.length, ALL_LESSONS.length);
  });

  await t.test("5. Start Here collection and Featured lessons exist", () => {
    const startHere = getStartHereLessons();
    assert.ok(startHere.length >= 3, `Expected at least 3 Start Here lessons, got ${startHere.length}`);

    const featured = getFeaturedLessons();
    assert.ok(featured.length >= 1, `Expected at least 1 featured lesson, got ${featured.length}`);
  });

  await t.test("6. Related lessons resolver returns valid lessons", () => {
    const related = getRelatedLessons("four-phases");
    assert.ok(Array.isArray(related) && related.length > 0, "Related lessons must return an array");
    for (const r of related) {
      assert.ok(r.id && r.id !== "four-phases", "Related lesson must be a valid distinct lesson");
    }
  });

  await t.test("7. Evidence-based Quick Facts and Common Questions integrity", () => {
    assert.ok(QUICK_FACTS.length >= 6, "Expected at least 6 Quick Facts");
    for (const fact of QUICK_FACTS) {
      assert.ok(fact.stat?.trim(), "Fact missing stat");
      assert.ok(fact.title?.en?.trim() && fact.title?.hi?.trim(), "Fact missing title");
      assert.ok(fact.description?.en?.trim() && fact.description?.hi?.trim(), "Fact missing description");
      assert.ok(fact.source?.trim(), "Fact missing source");
    }

    assert.ok(COMMON_QUESTIONS.length >= 5, "Expected at least 5 Common Questions");
    for (const faq of COMMON_QUESTIONS) {
      assert.ok(faq.question?.en?.trim() && faq.question?.hi?.trim(), "FAQ missing question");
      assert.ok(faq.answer?.en?.trim() && faq.answer?.hi?.trim(), "FAQ missing answer");
      if (faq.relatedLessonId) {
        assert.ok(getLessonById(faq.relatedLessonId), `FAQ references nonexistent lesson: ${faq.relatedLessonId}`);
      }
    }
  });

  await t.test("8. Bilingual parity for all newly introduced Learn interface labels", () => {
    const enKeys = Object.keys(translations.en.learn);
    const hiKeys = Object.keys(translations.hi.learn);

    assert.equal(enKeys.length, hiKeys.length, "Translation key count mismatch in learn section");
    for (const key of enKeys) {
      assert.ok(translations.hi.learn[key], `Missing Hindi translation for key: ${key}`);
      assert.ok(translations.en.learn[key], `Missing English translation for key: ${key}`);
    }
  });
});

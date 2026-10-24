# Saheli — Workstream B patch (Abin)

This patch adds new content and matching modules only. It does not replace existing React pages, shared safety logic, translations, app context, or teammates' files.

## Files
- `src/content/faq.js` — 36 bilingual FAQ entries with stable IDs, question text, English/Hindi keywords, answers, source URLs, categories, lesson IDs and doctor-guidance flags.
- `src/content/lessons.js` — bilingual, source-linked core lessons for cycle basics, irregular cycles, PCOS, cramps, menstrual products, first period and PMS.
- `src/content/conditions.js` — bilingual general information about PCOS, endometriosis and heavy/abnormal bleeding.
- `src/content/firstPeriod.js` — bilingual first-period guide.
- `src/lib/faqMatcher.js` — local deterministic matcher, suggested questions, source metadata, fallback and support for a shared safety result.

## Integration
```js
import { FAQS } from "./content/faq.js";
import { LESSONS, getLessonById } from "./content/lessons.js";
import { CONDITIONS, getConditionById } from "./content/conditions.js";
import { FIRST_PERIOD_GUIDE } from "./content/firstPeriod.js";
import { matchFaq, getSuggestedQuestions } from "./lib/faqMatcher.js";

const result = matchFaq(question, language, { safetyResult });
// Render result.answer and link to result.source.url when source exists.
// If result.urgentReview or result.safetyPriority is true, defer to the shared safety UI.
```

## Safety and review
- The content is general education, not diagnosis or individual medical advice; it does not prescribe medicines or doses.
- Unknown questions return `I don't know that one. A doctor can help.` in English and an equivalent Hindi fallback.
- No AI or network call is made by the matcher.
- The project's shared safety module remains authoritative. Pass its result as `options.safetyResult`; urgent findings take precedence over ordinary matching. This matcher does not implement medical thresholds.
- Sources link to WHO, NHS, ACOG and Government of India. Recheck each page and confirm that each specific claim is supported during clinical/content review before public release. This patch is not a substitute for review by a qualified health professional.

## Verification
The repo currently has `npm run build` and `npm run lint`, but no configured unit-test script. After copying files into the repo, run both commands and manually check English/Hindi queries, empty input, unrelated questions and an urgent safety result passed into the matcher.

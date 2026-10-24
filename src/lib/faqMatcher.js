import { FAQS } from "../content/faq.js";

const FALLBACK = {
  en: "I don't know that one. A doctor can help.",
  hi: "मुझे इस प्रश्न का भरोसेमंद उत्तर नहीं पता। डॉक्टर मदद कर सकते हैं।",
};
const SUGGESTED = {
  en: ["Why is my period late?", "What are common signs of PCOS?", "When should I take a pregnancy test?", "How can I manage period cramps?", "When is bleeding considered heavy?"],
  hi: ["मेरी माहवारी देर से क्यों आ रही है?", "PCOS के सामान्य लक्षण क्या हैं?", "गर्भावस्था परीक्षण कब करना चाहिए?", "माहवारी की ऐंठन में क्या मदद कर सकता है?", "कब रक्तस्राव बहुत अधिक माना जाता है?"],
};
function normalize(value) {
  return String(value ?? "").toLocaleLowerCase().normalize("NFKC").replace(/[’‘`]/g, "'").replace(/[^\p{L}\p{N}\s'-]/gu, " ").replace(/\s+/g, " ").trim();
}
const STOP_WORDS = new Set(["what", "is", "the", "a", "an", "i", "am", "my", "me", "do", "does", "can", "are", "how", "when", "why", "should", "during", "to", "for", "of", "and", "in", "on", "it", "you", "मुझे", "मेरी", "मेरा", "क्या", "है", "हो", "कब", "क्यों", "कैसे", "के", "की", "का", "में", "से", "और", "को", "पर"]);
function tokens(value) { return new Set(normalize(value).split(/\s+/).filter((word) => word.length > 1 && !STOP_WORDS.has(word))); }
function scoreFaq(faq, question, language) {
  const q = normalize(question); const qTokens = tokens(q);
  const fields = [faq.question?.[language], ...(faq.keywords?.[language] ?? []), faq.question?.en, ...(faq.keywords?.en ?? []), faq.question?.hi, ...(faq.keywords?.hi ?? [])].filter(Boolean);
  let score = 0;
  for (const field of fields) {
    const f = normalize(field); if (!f) continue;
    if (q === f) score = Math.max(score, 12);
    else if (q.includes(f)) score = Math.max(score, f.includes(" ") ? 9 : 6);
    const ft = tokens(f); let overlap = 0;
    for (const word of ft) if (qTokens.has(word)) overlap++;
    if (ft.size) score = Math.max(score, overlap >= 2 ? 2 + (overlap / ft.size) * 4 : overlap ? 1 : 0);
  }
  return score;
}
function fallback(language) {
  return { matched: false, answer: FALLBACK[language], language, source: null, category: null, faqId: null, relatedLessonId: null, doctorGuidance: true, urgentReview: false, suggestedQuestions: getSuggestedQuestions(language), safetyPriority: false };
}
export function getSuggestedQuestions(language = "en") { return [...(SUGGESTED[language === "hi" ? "hi" : "en"])]; }

/**
 * Returns a structured answer and source. The app's shared safety module is authoritative:
 * pass its result as options.safetyResult so urgent guidance is never replaced by FAQ matching.
 * This matcher does not implement medical thresholds and makes no network/AI calls.
 */
export function matchFaq(question, language = "en", options = {}) {
  const lang = language === "hi" ? "hi" : "en";
  if (!normalize(question)) return fallback(lang);
  const safety = options?.safetyResult;
  if (safety?.urgent === true || safety?.priority === "urgent") {
    return { matched: false, answer: safety.message?.[lang] ?? safety.message ?? FALLBACK[lang], language: lang, source: safety.source ?? null, category: "warning-signs", faqId: null, relatedLessonId: null, doctorGuidance: true, urgentReview: true, suggestedQuestions: getSuggestedQuestions(lang), safetyPriority: true };
  }
  let best = null; let bestScore = 0;
  for (const faq of FAQS) { const score = scoreFaq(faq, question, lang); if (score > bestScore) { best = faq; bestScore = score; } }
  if (!best || bestScore < 4) return fallback(lang);
  return { matched: true, answer: best.answer[lang] ?? best.answer.en, language: lang, source: best.source, category: best.category, faqId: best.id, relatedLessonId: best.lessonId ?? null, doctorGuidance: Boolean(best.doctorGuidance), urgentReview: Boolean(best.urgentReview), suggestedQuestions: getSuggestedQuestions(lang), safetyPriority: false };
}
export const FAQ_FALLBACK = FALLBACK;

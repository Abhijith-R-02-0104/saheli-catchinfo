/** Lightweight script-based language detection for answer/UI selection, not medical intent detection. */
export function detectAnswerLanguage(value = '') {
  const text = String(value);
  const devanagari = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return devanagari > latin * 0.2 ? 'hi' : 'en';
}

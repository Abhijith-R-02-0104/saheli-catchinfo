import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("Ask Saheli Visual Fixes & Palette Verification", async (t) => {
  const faqFile = fs.readFileSync(
    path.join(__dirname, "../src/components/FaqAssistant.jsx"),
    "utf8"
  );
  const cssFile = fs.readFileSync(
    path.join(__dirname, "../src/index.css"),
    "utf8"
  );

  await t.test("1. Text contrast & theme variables for heading, description, labels", () => {
    // Heading should not use text-slate-900; must use var(--ink)
    assert.doesNotMatch(faqFile, /<h1[^>]*text-slate-900/);
    assert.match(faqFile, /<h1[^>]*text-\[var\(--ink\)\]/);

    // Description should not use text-slate-600; must use var(--muted)
    assert.doesNotMatch(faqFile, /<p[^>]*text-slate-600/);
    assert.match(faqFile, /text-\[var\(--muted\)\]/);

    // Label should not use text-slate-800; must use var(--ink)
    assert.doesNotMatch(faqFile, /<label[^>]*text-slate-800/);
    assert.match(faqFile, /<label[^>]*text-\[var\(--ink\)\]/);

    // Eyebrow should use Saheli plum/blush, not text-green-700
    assert.doesNotMatch(faqFile, /text-green-700[^>]*Saheli · FAQ assistant/);
    assert.match(faqFile, /text-\[#79516F\]/);
  });

  await t.test("2. Suggested Questions Card styling", () => {
    // Must NOT have clashing bg-slate-50
    assert.doesNotMatch(faqFile, /bg-slate-50/);

    // Must use Saheli plum surface and border
    assert.match(faqFile, /bg-\[var\(--plum-light\)\]/);
    assert.match(faqFile, /border-\[var\(--line\)\]/);

    // Suggested questions heading must use var(--ink)
    assert.doesNotMatch(faqFile, /<h2[^>]*text-slate-900[^>]*Suggested questions/);
    assert.match(faqFile, /text-\[var\(--ink\)\]/);

    // Suggested question buttons must not use text-slate-700 or green hover
    assert.doesNotMatch(faqFile, /text-slate-700/);
    assert.doesNotMatch(faqFile, /hover:border-green-700/);
    assert.doesNotMatch(faqFile, /hover:bg-green-50/);

    // Buttons must have readable text and cursor-pointer
    assert.match(faqFile, /cursor-pointer/);
  });

  await t.test("3. Button styling respects Saheli palette (Plum / Blush)", () => {
    // Primary "Ask question" button should NOT be green
    assert.doesNotMatch(faqFile, /bg-green-700[^>]*Ask question/);
    assert.doesNotMatch(faqFile, /hover:bg-green-800/);

    // Voice button should NOT have border-green-700
    assert.doesNotMatch(faqFile, /border-green-700/);
    assert.doesNotMatch(faqFile, /text-green-800/);

    // Primary button should use Saheli plum
    assert.match(faqFile, /bg-\[#79516F\]/);
    assert.match(faqFile, /hover:bg-\[#633E5A\]/);

    // Green is reserved for meaningful status indicators
    assert.match(faqFile, /text-\[#3F6344\]/); // Sage status indicator
    assert.match(faqFile, /bg-emerald-500 animate-pulse/); // Live listening microphone pulse
  });

  await t.test("4. Placeholder text accessibility in index.css", () => {
    assert.match(cssFile, /textarea::placeholder/);
    assert.match(cssFile, /input::placeholder/);
    assert.match(cssFile, /opacity:\s*0\.85/);
  });

  await t.test("5. Interactive cursor accessibility", () => {
    // Textarea has explicit text cursor
    assert.match(faqFile, /cursor-text/);

    // Buttons and links have pointer cursor
    assert.match(faqFile, /cursor-pointer/);
  });

  await t.test("6. Preserved FAQ & Voice logic", () => {
    assert.match(faqFile, /detectFaqLanguage/);
    assert.match(faqFile, /getQuestionSuggestions/);
    assert.match(faqFile, /getSuggestedQuestions/);
    assert.match(faqFile, /matchFaq/);
    assert.match(faqFile, /startListening/);
    assert.match(faqFile, /readAnswer/);
    assert.match(faqFile, /ENGLISH_UI\.note/);
  });
});

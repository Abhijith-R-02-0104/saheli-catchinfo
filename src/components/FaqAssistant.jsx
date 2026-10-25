
import { useEffect, useRef, useState } from "react";
import {
  detectFaqLanguage,
  getQuestionSuggestions,
  getSuggestedQuestions,
  matchFaq,
} from "../lib/faqMatcher.js";

// Only the input placeholder and answer panel adapt to the detected language.
const LANGUAGE_TEXT = {
  en: {
    inputPlaceholder: "Start typing your question, or use the microphone…",
    matched: "Matched Saheli FAQ",
    fallback: "No reliable FAQ match found",
    answer: "Answer",
    answerLanguage: "Answer: English",
    source: "Source",
    read: "Read answer aloud",
    stopRead: "Stop reading",
  },
  hi: {
    inputPlaceholder: "अपना प्रश्न लिखना शुरू करें या माइक्रोफ़ोन का उपयोग करें…",
    matched: "सहेली के FAQ से उत्तर",
    fallback: "भरोसेमंद FAQ मिलान नहीं मिला",
    answer: "उत्तर",
    answerLanguage: "उत्तर: हिंदी",
    source: "स्रोत",
    read: "उत्तर सुनें",
    stopRead: "पढ़ना बंद करें",
  },
};

const ENGLISH_UI = {
  unsupported:
    "Voice input is not supported in this browser. Try a current version of Chrome or Edge, or type your question.",
  micError:
    "Could not start voice input. Check browser microphone permission and try again.",
  note:
    "Educational information only—not a diagnosis or a substitute for professional medical advice. Seek urgent medical care for a possible emergency.",
};

export default function FaqAssistant() {
  const [language, setLanguage] = useState("en");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const attemptRef = useRef(0);

  const inputText = LANGUAGE_TEXT[language];
  const outputText = LANGUAGE_TEXT[result?.language ?? language];

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function ask(value = question) {
    const detected = detectFaqLanguage(value, "en");

    setLanguage(detected);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
    setResult(matchFaq(value, detected));
  }

  function startRecognitionAttempt(locale, attempt) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage(ENGLISH_UI.unsupported);
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = locale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    attemptRef.current = attempt;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) return;

      attemptRef.current = 2;
      setQuestion(transcript);
      ask(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      if (
        attempt === 0 &&
        ["no-speech", "language-not-supported", "network"].includes(
          event.error
        )
      ) {
        try {
          recognition.stop();
        } catch (error) {
          // The recognition session may already have stopped.
          console.debug("Recognition session already stopped.", error);
        }

        startRecognitionAttempt("hi-IN", 1);
      } else {
        setVoiceMessage(ENGLISH_UI.micError);
        setListening(false);
      }
    };

    recognition.onend = () => {
      if (attemptRef.current !== attempt) return;

      if (attempt === 0 && listening) {
        startRecognitionAttempt("hi-IN", 1);
      } else {
        setListening(false);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      if (attempt === 0) {
        startRecognitionAttempt("hi-IN", 1);
      } else {
        console.error("Could not start speech recognition:", error);
        setVoiceMessage(ENGLISH_UI.micError);
        setListening(false);
      }
    }
  }

  function startListening() {
    if (
      !(window.SpeechRecognition || window.webkitSpeechRecognition)
    ) {
      setVoiceMessage(ENGLISH_UI.unsupported);
      return;
    }

    setVoiceMessage("");

    // Try English first, then Hindi if the first attempt fails.
    startRecognitionAttempt("en-IN", 0);
  }

  function readAnswer() {
    if (!result?.answer || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(result.answer);
    utterance.lang = result.language === "hi" ? "hi-IN" : "en-IN";

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  const suggestions = question.trim()
    ? getQuestionSuggestions(question, language, 5)
    : getSuggestedQuestions(language);

  const source = result?.source;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-xs sm:p-8">
      <div>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#79516F] dark:text-[#E8A8BF]">
          Saheli · FAQ assistant
        </p>

        <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          Ask Saheli
        </h1>

        <p className="mt-2 text-sm sm:text-base text-[var(--muted)]">
          Menstrual-health information in English or Hindi.
        </p>
      </div>

      <form
        className="mt-7"
        onSubmit={(event) => {
          event.preventDefault();
          ask();
        }}
      >
        <label
          htmlFor="saheli-question"
          className="mb-2 block text-sm font-semibold text-[var(--ink)]"
        >
          Your question
        </label>

        <textarea
          id="saheli-question"
          value={question}
          onChange={(event) => {
            const value = event.target.value;
            setQuestion(value);
            setLanguage(detectFaqLanguage(value, "en"));
          }}
          placeholder={inputText.inputPlaceholder}
          rows={3}
          className="w-full resize-y rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-3 text-sm sm:text-base text-[var(--ink)] placeholder:text-[var(--muted)] placeholder:opacity-85 focus:border-[#79516F] dark:focus:border-[#E8A8BF] focus:ring-2 focus:ring-[#79516F]/20 dark:focus:ring-[#E8A8BF]/25 outline-none cursor-text transition-colors shadow-2xs"
          style={{
            fontFamily:
              'ui-sans-serif, system-ui, "Noto Sans Devanagari", sans-serif',
          }}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="touch-target inline-flex items-center justify-center min-h-12 rounded-xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] px-6 py-3 font-semibold text-white shadow-xs hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F] dark:focus-visible:outline-[#E8A8BF] active:scale-[0.98] cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask question
          </button>

          <button
            type="button"
            onClick={
              listening
                ? () => {
                    attemptRef.current = 2;
                    recognitionRef.current?.stop();
                    setListening(false);
                  }
                : startListening
            }
            aria-pressed={listening}
            className={`touch-target inline-flex items-center justify-center min-h-12 rounded-xl border px-6 py-3 font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F] dark:focus-visible:outline-[#E8A8BF] active:scale-[0.98] cursor-pointer ${
              listening
                ? "border-[#79516F] dark:border-[#E8A8BF] bg-[#F7E3EC] dark:bg-[#3D2636] text-[#79516F] dark:text-[#E8A8BF] shadow-xs"
                : "border-[#79516F] dark:border-[#D9A4C7] bg-[var(--card)] text-[#79516F] dark:text-[#F7EDF5] hover:bg-[var(--plum-light)] hover:text-[#633E5A] dark:hover:bg-[#38263E] dark:hover:border-[#E8A8BF] dark:hover:text-[#FFFFFF]"
            }`}
          >
            {listening && (
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"
                aria-hidden="true"
              />
            )}
            {listening ? "Stop listening" : "Ask by voice"}
          </button>
        </div>

        <div
          className="mt-4 flex flex-wrap items-center gap-2"
          aria-label="Available languages"
        >
          <span className="text-xs font-semibold text-[var(--muted)]">
            Languages / भाषाएँ:
          </span>

          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
            className={`touch-target inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F] dark:focus-visible:outline-[#E8A8BF] ${
              language === "en"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:border-[#8D5C82] dark:bg-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--plum-light)] hover:text-[#79516F] dark:hover:text-[#FFFFFF]"
            }`}
          >
            <span>English</span>
            {language === "en" && <span aria-hidden="true">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => setLanguage("hi")}
            aria-pressed={language === "hi"}
            className={`touch-target inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F] dark:focus-visible:outline-[#E8A8BF] ${
              language === "hi"
                ? "border-[#79516F] bg-[#79516F] text-white shadow-xs dark:border-[#8D5C82] dark:bg-[#8D5C82]"
                : "border-[var(--line-strong)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--plum-light)] hover:text-[#79516F] dark:hover:text-[#FFFFFF]"
            }`}
          >
            <span>हिंदी</span>
            {language === "hi" && <span aria-hidden="true">✓</span>}
          </button>

          <span className="text-xs text-[var(--muted)]">
            Auto-detected / अपने आप पहचान
          </span>
        </div>

        {listening && (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#3F6344] dark:text-[#C4E2C7]"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            Listening… speak now
          </p>
        )}

        {voiceMessage && (
          <p role="status" className="mt-3 text-sm text-[var(--muted)]">
            {voiceMessage}
          </p>
        )}
      </form>

      <div className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--plum-light)] p-4 sm:p-5 shadow-xs">
        <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)]">
          Suggested questions
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuestion(item);
                ask(item);
              }}
              className="touch-target inline-flex items-center rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-3.5 py-2 text-left text-xs sm:text-sm font-medium text-[var(--ink)] shadow-2xs transition-all hover:border-[#79516F] hover:bg-white hover:text-[#79516F] dark:hover:border-[#E8A8BF] dark:hover:bg-[#4A324A] dark:hover:text-[#FFFFFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F] dark:focus-visible:outline-[#E8A8BF] active:scale-[0.98] cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {question.trim() && suggestions.length === 0 && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            No matching suggestions yet. Finish typing your question and submit it.
          </p>
        )}
      </div>

      {result && (
        <section
          aria-live="polite"
          className="mt-6 rounded-2xl border border-[var(--line-strong)] bg-[var(--plum-light)] p-5 sm:p-6 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className={`text-sm font-bold flex items-center gap-1.5 ${
                result.matched
                  ? "text-[#3F6344] dark:text-[#C4E2C7]"
                  : "text-amber-800 dark:text-amber-300"
              }`}
            >
              <span aria-hidden="true">{result.matched ? "✓" : "ℹ"}</span>
              {result.matched ? outputText.matched : outputText.fallback}
            </p>

            <span className="rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
              {outputText.answerLanguage}
            </span>
          </div>

          <h2 className="mt-3 font-serif text-lg font-bold text-[var(--ink)]">
            {outputText.answer}
          </h2>

          <p
            className="mt-2 whitespace-pre-line leading-7 text-sm sm:text-base text-[var(--ink)]"
            style={{
              fontFamily:
                'ui-sans-serif, system-ui, "Noto Sans Devanagari", sans-serif',
            }}
          >
            {result.answer}
          </p>

          {source?.url && (
            <p className="mt-4 text-sm text-[var(--muted)]">
              <span className="font-semibold text-[var(--ink)]">{outputText.source}: </span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#79516F] dark:text-[#E8A8BF] underline decoration-1 underline-offset-2 hover:text-[#633E5A] dark:hover:text-[#FFFFFF] cursor-pointer transition-colors"
              >
                {source.name ?? source.url}
              </a>
            </p>
          )}

          <button
            type="button"
            onClick={
              speaking
                ? () => {
                    window.speechSynthesis.cancel();
                    setSpeaking(false);
                  }
                : readAnswer
            }
            disabled={
              !result.answer || !("speechSynthesis" in window)
            }
            className="touch-target mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-2xs hover:bg-[var(--plum-light)] hover:text-[#79516F] dark:hover:text-[#FFFFFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79516F] dark:focus-visible:outline-[#E8A8BF] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <span aria-hidden="true">{speaking ? "⏹" : "🔊"}</span>
            {speaking ? outputText.stopRead : outputText.read}
          </button>
        </section>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200/80 dark:border-[#5E3F1F] bg-amber-50/90 dark:bg-[#332211] p-4 text-xs sm:text-sm leading-relaxed text-amber-950 dark:text-[#FFE0B2]">
        <span className="text-base" aria-hidden="true">ℹ️</span>
        <p>{ENGLISH_UI.note}</p>
      </div>
    </section>
  );
}


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
    ? getQuestionSuggestions(question, "en", 5)
    : getSuggestedQuestions("en");

  const source = result?.source;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
          Saheli · FAQ assistant
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Ask Saheli
        </h1>

        <p className="mt-2 text-slate-600">
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
          className="mb-2 block text-sm font-semibold text-slate-800"
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
          className="w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
          style={{
            fontFamily:
              'ui-sans-serif, system-ui, "Noto Sans Devanagari", sans-serif',
          }}
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="min-h-12 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
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
            className="min-h-12 rounded-xl border border-green-700 px-5 py-3 font-semibold text-green-800 hover:bg-green-50"
          >
            {listening ? "Stop listening" : "Ask by voice"}
          </button>
        </div>

        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          aria-label="Available languages"
        >
          <span className="text-xs font-medium text-slate-500">
            Languages / भाषाएँ:
          </span>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            English
          </span>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            हिंदी
          </span>

          <span className="text-xs text-slate-500">
            Auto-detected / अपने आप पहचान
          </span>
        </div>

        {listening && (
          <p role="status" className="mt-3 text-sm font-medium text-green-800">
            Listening… speak now
          </p>
        )}

        {voiceMessage && (
          <p role="status" className="mt-3 text-sm text-slate-600">
            {voiceMessage}
          </p>
        )}
      </form>

      <div className="mt-7 rounded-2xl bg-slate-50 p-4 sm:p-5">
        <h2 className="font-semibold text-slate-900">
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
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-green-700 hover:bg-green-50"
            >
              {item}
            </button>
          ))}
        </div>

        {question.trim() && suggestions.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            No matching suggestions yet. Finish typing your question and submit it.
          </p>
        )}
      </div>

      {result && (
        <section
          aria-live="polite"
          className="mt-6 rounded-2xl border border-green-100 bg-green-50/70 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-green-800">
              {result.matched ? outputText.matched : outputText.fallback}
            </p>

            <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-800">
              {outputText.answerLanguage}
            </span>
          </div>

          <h2 className="mt-2 text-lg font-bold text-slate-900">
            {outputText.answer}
          </h2>

          <p
            className="mt-2 whitespace-pre-line leading-7 text-slate-800"
            style={{
              fontFamily:
                'ui-sans-serif, system-ui, "Noto Sans Devanagari", sans-serif',
            }}
          >
            {result.answer}
          </p>

          {source?.url && (
            <p className="mt-4 text-sm">
              <span className="font-semibold">{outputText.source}: </span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-green-800 underline"
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
            className="mt-4 rounded-xl border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-white"
          >
            {speaking ? outputText.stopRead : outputText.read}
          </button>
        </section>
      )}

      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        {ENGLISH_UI.note}
      </p>
    </section>
  );
}

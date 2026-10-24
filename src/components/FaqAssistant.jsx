import { useEffect, useRef, useState } from "react";
import { getSuggestedQuestions, matchFaq } from "../lib/faqMatcher.js";

const TEXT = {
  en: {
    title: "Ask Saheli", subtitle: "Menstrual-health information in English or Hindi.",
    language: "Answer language", type: "Type your question", placeholder: "Type a question, or use the microphone…",
    ask: "Ask question", voice: "Ask by voice", stop: "Stop listening", listening: "Listening… speak now",
    suggestions: "Suggested questions", answer: "Answer", matched: "From Saheli’s FAQ", fallback: "No reliable FAQ match found",
    read: "Read answer aloud", stopRead: "Stop reading", source: "Source",
    unsupported: "Voice input is not supported in this browser. Try a current version of Chrome or Edge, or type your question.",
    micError: "Could not start the microphone. Check browser permission and try again.",
    note: "Educational information only—not a diagnosis or a substitute for professional medical advice. Seek urgent medical care for a possible emergency."
  },
  hi: {
    title: "सहेली से पूछें", subtitle: "माहवारी और मासिक स्वास्थ्य की सामान्य जानकारी हिंदी या अंग्रेज़ी में पाएं।",
    language: "उत्तर की भाषा", type: "अपना प्रश्न लिखें", placeholder: "अपना प्रश्न लिखें या माइक्रोफ़ोन का उपयोग करें…",
    ask: "प्रश्न पूछें", voice: "बोलकर पूछें", stop: "सुनना बंद करें", listening: "सुन रहे हैं… अब बोलें",
    suggestions: "सुझाए गए प्रश्न", answer: "उत्तर", matched: "सहेली के FAQ से उत्तर", fallback: "भरोसेमंद FAQ मिलान नहीं मिला",
    read: "उत्तर सुनें", stopRead: "पढ़ना बंद करें", source: "स्रोत",
    unsupported: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। Chrome या Edge आज़माएँ, या प्रश्न लिखें।",
    micError: "माइक्रोफ़ोन शुरू नहीं हो सका। ब्राउज़र की अनुमति जाँचकर फिर प्रयास करें।",
    note: "यह केवल शैक्षिक जानकारी है, निदान या पेशेवर चिकित्सकीय सलाह का विकल्प नहीं। आपात स्थिति में तुरंत चिकित्सा सहायता लें।"
  }
};

export default function FaqAssistant() {
  const [language, setLanguage] = useState("en");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const copy = TEXT[language];

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function ask(value = question) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setResult(matchFaq(value.trim(), language));
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceMessage(copy.unsupported); return; }
    setVoiceMessage("");
    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? "";
      if (transcript) { setQuestion(transcript); ask(transcript); }
    };
    recognition.onerror = () => { setVoiceMessage(copy.micError); setListening(false); };
    recognition.onend = () => setListening(false);
    try { recognition.start(); } catch { setVoiceMessage(copy.micError); setListening(false); }
  }

  function readAnswer() {
    if (!result?.answer || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.answer);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function changeLanguage(next) {
    setLanguage(next); setResult(null); setVoiceMessage("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  const suggestions = result?.suggestedQuestions ?? getSuggestedQuestions(language);
  const source = result?.source;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">Saheli · FAQ assistant</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{copy.title}</h1>
          <p className="mt-2 text-slate-600">{copy.subtitle}</p>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">{copy.language}
          <select value={language} onChange={e => changeLanguage(e.target.value)} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2">
            <option value="en">English</option><option value="hi">हिंदी</option>
          </select>
        </label>
      </div>
      <form className="mt-7" onSubmit={e => { e.preventDefault(); ask(); }}>
        <label htmlFor="saheli-question" className="mb-2 block text-sm font-semibold text-slate-800">{copy.type}</label>
        <textarea id="saheli-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder={copy.placeholder} rows={3}
          className="w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100" />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-12 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">{copy.ask}</button>
          <button type="button" onClick={listening ? () => recognitionRef.current?.stop() : startListening} aria-pressed={listening}
            className="min-h-12 rounded-xl border border-green-700 px-5 py-3 font-semibold text-green-800 hover:bg-green-50">{listening ? copy.stop : copy.voice}</button>
        </div>
        {listening && <p role="status" className="mt-3 text-sm font-medium text-green-800">{copy.listening}</p>}
        {voiceMessage && <p role="status" className="mt-3 text-sm text-slate-600">{voiceMessage}</p>}
      </form>
      <div className="mt-7 rounded-2xl bg-slate-50 p-4 sm:p-5">
        <h2 className="font-semibold text-slate-900">{copy.suggestions}</h2>
        <div className="mt-3 flex flex-wrap gap-2">{suggestions.map(item => <button key={item} type="button" onClick={() => { setQuestion(item); ask(item); }}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-green-700 hover:bg-green-50">{item}</button>)}</div>
      </div>
      {result && <section aria-live="polite" className="mt-6 rounded-2xl border border-green-100 bg-green-50/70 p-5">
        <p className="text-sm font-semibold text-green-800">{result.matched ? copy.matched : copy.fallback}</p>
        <h2 className="mt-2 text-lg font-bold text-slate-900">{copy.answer}</h2>
        <p className="mt-2 whitespace-pre-line leading-7 text-slate-800">{result.answer}</p>
        {source?.url && <p className="mt-4 text-sm"><span className="font-semibold">{copy.source}: </span><a href={source.url} target="_blank" rel="noreferrer" className="text-green-800 underline">{source.name ?? source.url}</a></p>}
        <button type="button" onClick={speaking ? () => { window.speechSynthesis.cancel(); setSpeaking(false); } : readAnswer}
          disabled={!result.answer || !("speechSynthesis" in window)} className="mt-4 rounded-xl border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-white">{speaking ? copy.stopRead : copy.read}</button>
      </section>}
      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{copy.note}</p>
    </section>
  );
}

import { useState, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation.js";
import { EditorialBanner } from "../common/EditorialBanner.jsx";
import { IconBookOpen, IconCheck, IconCross, IconArrowRight } from "../common/Icons.jsx";

const LESSONS = [
  {
    id: "four-phases",
    category: "categoryBasics",
    titleEn: "The 4 Phases of the Menstrual Cycle",
    titleHi: "माहवारी चक्र के 4 मुख्य चरण",
    readTime: "4 min",
    sources: [
      { name: "ACOG — Your Menstrual Cycle", url: "https://www.acog.org/womens-health/faqs/your-menstrual-cycle" },
      { name: "NHS — Menstrual Cycle", url: "https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/" },
    ],
    contentEn: `The menstrual cycle is a rhythmic symphony orchestrated by hormones between the brain (hypothalamus and pituitary gland) and the ovaries. A typical cycle lasts 21 to 35 days and encompasses four distinct phases:

1. Menstrual Phase (Days 1–5):
Begins on the first day of bright red bleeding when the thickened uterine lining (endometrium) sheds because pregnancy did not occur. Estrogen and progesterone are at their lowest baseline. Rest, hydration, and warmth are especially soothing during these days.

2. Follicular Phase (Days 1–13):
Overlapping with menstruation, the pituitary gland releases Follicle-Stimulating Hormone (FSH). Ovaries nurture several small fluid-filled follicles, one of which becomes dominant. Estrogen levels climb steadily, stimulating the uterus to rebuild a nutrient-rich lining. Energy and focus typically rise.

3. Ovulation Window (Around Day 14):
A sharp surge in Luteinizing Hormone (LH) prompts the dominant follicle to rupture and release a mature egg into the fallopian tube. The egg survives 12 to 24 hours. Because sperm can survive in cervical fluid for up to 5 days, the fertile window spans roughly the 5 days before ovulation plus ovulation day itself.

4. Luteal Phase (Days 15–28):
The ruptured follicle transforms into the corpus luteum, secreting progesterone. Progesterone stabilizes the uterine lining. If the egg is not fertilized, the corpus luteum disintegrates, hormone levels plummet, and the cycle begins anew with menstruation.`,
    contentHi: `माहवारी चक्र मस्तिष्क (हाइपोथैलेमस और पिट्यूटरी ग्रंथि) और अंडाशय के बीच हार्मोनल तालमेल से चलने वाली एक प्राकृतिक प्रक्रिया है। एक सामान्य चक्र 21 से 35 दिनों का होता है और इसमें 4 चरण होते हैं:

1. माहवारी चरण (दिन 1–5):
यह रक्तस्राव के पहले दिन से शुरू होता है जब गर्भाशय की परत निकलती है क्योंकि गर्भधारण नहीं हुआ। एस्ट्रोजन और प्रोजेस्टेरोन अपने सबसे निचले स्तर पर होते हैं। आराम, पानी और गर्माहट इन दिनों में विशेष रूप से राहत देते हैं।

2. फॉलिक्युलर चरण (दिन 1–13):
पिट्यूटरी ग्रंथि FSH हार्मोन जारी करती है जो अंडाशय में फॉलिकल्स को परिपक्व करता है। एस्ट्रोजन का स्तर धीरे-धीरे बढ़ता है जिससे गर्भाशय की परत फिर से बनती है। ऊर्जा और एकाग्रता में वृद्धि होती है।

3. ओव्यूलेशन खिड़की (लगभग दिन 14):
LH हार्मोन में तेज वृद्धि के कारण परिपक्व अंडा अंडाशय से बाहर निकलता है। अंडा 12-24 घंटे जीवित रहता है। चूंकि शुक्राणु 5 दिनों तक जीवित रह सकते हैं, इसलिए यह समय सबसे अधिक उपजाऊ होता है।

4. ल्यूटियल चरण (दिन 15–28):
प्रोजेस्टेरोन हार्मोन गर्भाशय की परत को बनाए रखता है। यदि गर्भधारण नहीं होता है, तो हार्मोन गिरते हैं और अगला चक्र शुरू होता है।`,
  },
  {
    id: "normal-period",
    category: "categoryBasics",
    titleEn: "What is a Normal Period?",
    titleHi: "सामान्य माहवारी क्या है?",
    readTime: "3 min",
    sources: [
      { name: "ACOG — Abnormal Uterine Bleeding", url: "https://www.acog.org" },
      { name: "FOGSI Good Clinical Practice", url: "https://www.fogsi.org" },
    ],
    contentEn: `Every person's cycle has its own natural rhythm. Understanding what is healthy helps you notice when something changes:

- Cycle Length: Measured from Day 1 of one period to Day 1 of the next. For adults, 21 to 35 days is normal. For adolescents, up to 45 days is common.
- Bleeding Duration: Typically 3 to 7 days. Bleeding lasting 8 or more days should be reviewed by a doctor.
- Flow Volume: The average blood loss across an entire period is about 30 to 50 milliliters (about 2 to 3 tablespoons). Needing to change soaked pads or tampons every 1 to 2 hours indicates abnormally heavy flow (menorrhagia).
- Clots: Small occasional clots (smaller than a coin) are common. Large clots bigger than a 1-rupee coin (2.5 cm) warrant clinical evaluation.`,
    contentHi: `हर महिला का शरीर अलग होता है। स्वस्थ चक्र के मानक जानना आवश्यक है:

- साइकिल की अवधि: एक माहवारी के पहले दिन से अगली माहवारी के पहले दिन तक। वयस्कों के लिए 21 से 35 दिन और किशोरियों के लिए 45 दिन तक सामान्य है।
- रक्तस्राव के दिन: आमतौर पर 3 से 7 दिन। 8 या अधिक दिनों तक रक्तस्राव होने पर डॉक्टर से परामर्श लें।
- प्रवाह की मात्रा: पूरी माहवारी में लगभग 30 से 50 मिलीलीटर। यदि हर 1-2 घंटे में पैड बदलना पड़े तो यह भारी रक्तस्राव का संकेत है।
- रक्त के थक्के: छोटे थक्के सामान्य हैं। 1 रुपये के सिक्के से बड़े थक्के होने पर डॉक्टर को दिखाना चाहिए।`,
  },
  {
    id: "period-pain-relief",
    category: "categoryRelief",
    titleEn: "Soothing Period Pain and Cramps",
    titleHi: "पीरियड्स के दर्द और ऐंठन से राहत",
    readTime: "4 min",
    sources: [
      { name: "NHS — Period Pain", url: "https://www.nhs.uk/conditions/period-pain/" },
      { name: "Cochrane Reviews — Dysmenorrhea", url: "https://www.cochranelibrary.com" },
    ],
    contentEn: `Menstrual cramps (dysmenorrhea) are caused by prostaglandins—hormone-like compounds that cause the uterine muscles to contract:

1. Heat Therapy:
Applying a hot water bag, heating pad, or warm compress to the lower abdomen (around 40°C) is clinically proven to be as effective as standard over-the-counter painkillers by increasing pelvic blood flow and relaxing muscles.

2. Gentle Movement:
Gentle pelvic stretches, child's pose (Balasana), and cat-cow yoga encourage endorphin release, your body's natural pain reliever.

3. Hydration & Magnesium:
Warm water, herbal teas (ginger, chamomile, peppermint), and magnesium-rich foods (almonds, spinach, pumpkin seeds) help reduce muscle spasming and bloating.

4. Pain Medication:
If cramps interfere with daily school or work, non-steroidal anti-inflammatory drugs (NSAIDs like Ibuprofen or Mefenamic acid) taken with food at the earliest onset of bleeding are most effective because they inhibit prostaglandin production. Consult your doctor for appropriate dosing.`,
    contentHi: `माहवारी की ऐंठन (डिसमेनोरिया) प्रोस्टाग्लैंडिन्स के कारण होती है, जो गर्भाशय की मांसपेशियों में संकुचन पैदा करते हैं:

1. गर्म सिकाई:
पेट के निचले हिस्से पर गर्म पानी की थैली या हीटिंग पैड लगाना रक्त प्रवाह बढ़ाकर मांसपेशियों को आराम देता है।

2. हल्का योग व खिंचाव:
बालासन और कैट-काउ पोज़ एंडोर्फिन जारी करने में मदद करते हैं, जो प्राकृतिक दर्द निवारक हैं।

3. पर्याप्त पानी व मैग्नीशियम:
गर्म पानी, अदरक की चाय, और मैग्नीशियम युक्त आहार (बादाम, पालक) ऐंठन को कम करते हैं।

4. दवा का उपयोग:
यदि दर्द अत्यधिक हो, तो डॉक्टर की सलाह से उपयुक्त दवा लें।`,
  },
  {
    id: "when-to-see-doctor",
    category: "categoryMedical",
    titleEn: "When to Consult a Gynecologist",
    titleHi: "स्त्री रोग विशेषज्ञ (Gynecologist) से कब मिलें",
    readTime: "5 min",
    sources: [
      { name: "ACOG Guidelines", url: "https://www.acog.org" },
      { name: "FOGSI — Heavy Menstrual Bleeding", url: "https://www.fogsi.org" },
    ],
    contentEn: `While periods involve mild discomfort, severe pain or irregular patterns should never be ignored. Consult a healthcare provider if you experience:

- Period bleeding lasting 8 or more days consecutively.
- Heavy bleeding requiring pad or tampon changes every 1 to 2 hours for consecutive hours.
- Sudden, severe pelvic pain not relieved by standard medication or preventing school/work.
- Bleeding or spotting between periods or after sexual intercourse.
- Cycles consistently shorter than 21 days or longer than 35 days (in adults).
- More than 90 days without a period when not pregnant.
- Heavy bleeding accompanied by dizziness, faintness, or extreme pale skin (signs of anemia).`,
    contentHi: `यद्यपि माहवारी में थोड़ा दर्द सामान्य है, लेकिन अत्यधिक दर्द या अनियमितता को नज़रअंदाज़ न करें:

- 8 या अधिक दिनों तक लगातार रक्तस्राव होना।
- हर 1-2 घंटे में पैड या टैम्पोन बदलना पड़ना।
- अचानक अत्यधिक तेज़ पेल्विक दर्द होना जो दवा से भी ठीक न हो।
- दो माहवारी के बीच में या संबंध बनाने के बाद रक्तस्राव होना।
- 21 दिन से कम या 35 दिन से अधिक लंबे चक्र होना।
- 90 दिनों तक माहवारी न आना (यदि गर्भवती न हों)।
- चक्कर आना या अत्यधिक कमजोरी महसूस होना।`,
  },
];

export function LearnView() {
  const { lang, t } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Web Speech API text-to-speech
  function handleToggleReadAloud(textToSpeak) {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  // Stop audio on unmount or lesson change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLesson]);

  const filteredLessons = LESSONS.filter(
    (l) => activeCategory === "all" || l.category === activeCategory,
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Premium Editorial Banner */}
      <EditorialBanner
        variant="learn"
        tag={
          <span className="flex items-center gap-1.5">
            <IconBookOpen className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" />
            <span>{t("nav", "learn")}</span>
          </span>
        }
        title={t("learn", "title")}
        description={
          lang === "hi"
            ? "प्रमाणित चिकित्सीय स्रोतों पर आधारित सुरक्षित और प्रामाणिक स्वास्थ्य शिक्षा (ACOG, NHS, FOGSI)।"
            : "Empowering, verified menstrual health knowledge grounded in global clinical guidelines (ACOG, NHS, FOGSI)."
        }
        badge={
          <span className="flex items-center gap-1">
            <IconCheck className="h-3 w-3 text-[#3F6344] dark:text-[#88C690]" />
            <span>{lang === "hi" ? "चिकित्सीय समीक्षा" : "Clinically Reviewed"}</span>
          </span>
        }
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#EFE6EC] dark:border-[#3D2E47] pb-3">
        {[
          { id: "all", label: t("learn", "allLessons") },
          { id: "categoryBasics", label: t("learn", "categoryBasics") },
          { id: "categoryRelief", label: t("learn", "categoryRelief") },
          { id: "categoryMedical", label: t("learn", "categoryMedical") },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`touch-target rounded-2xl px-4 py-2 text-xs font-semibold transition-all border ${
              activeCategory === cat.id
                ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "bg-white text-[#292536] border-[#DECED9] hover:bg-[#FAF5F0] dark:bg-[#281F30] dark:text-[#F7EDF5] dark:border-[#42324C] dark:hover:bg-[#34263E]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lesson Reader Modal / Expanded View */}
      {selectedLesson && (
        <article className="rounded-3xl border-2 border-[#79516F] dark:border-[#8D5C82] bg-[var(--card)] p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <span className="rounded-full bg-[#FCF4F7] dark:bg-[#341F2E] px-2.5 py-0.5 text-[11px] font-bold text-[#79516F] dark:text-[#E8A8BF] border border-[#E9B7C8] dark:border-[#5C2E4A]">
                {selectedLesson.readTime} read
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                {lang === "hi" ? selectedLesson.titleHi : selectedLesson.titleEn}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedLesson(null);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsPlayingAudio(false);
              }}
              className="touch-target inline-flex items-center gap-1.5 rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[var(--card-subtle)]"
            >
              <IconCross className="h-3.5 w-3.5" />
              <span>{t("buttons", "close")}</span>
            </button>
          </div>

          {/* Audio Read-Aloud Button */}
          <div className="flex items-center gap-3 bg-[var(--card-subtle)] p-3 rounded-2xl border border-[var(--line)]">
            <button
              type="button"
              onClick={() =>
                handleToggleReadAloud(
                  lang === "hi" ? selectedLesson.contentHi : selectedLesson.contentEn,
                )
              }
              className={`touch-target inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all ${
                isPlayingAudio
                  ? "bg-[#8F1D1D] text-white"
                  : "bg-[#79516F] text-white hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
              }`}
            >
              <span>{isPlayingAudio ? "⏹" : "🔊"}</span>
              <span>
                {isPlayingAudio ? t("learn", "stopAudio") : t("learn", "readAloud")}
              </span>
            </button>
            <span className="text-xs text-[var(--muted)]">
              {isPlayingAudio
                ? lang === "hi"
                  ? "पाठ पढ़ा जा रहा है..."
                  : "Reading lesson aloud..."
                : lang === "hi"
                  ? "बोलकर सुनें (टेक्स्ट टू स्पीच)"
                  : "Listen to full lesson audio"}
            </span>
          </div>

          {/* Complete Lesson Text */}
          <div className="prose prose-sm max-w-none text-[var(--ink)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {lang === "hi" ? selectedLesson.contentHi : selectedLesson.contentEn}
          </div>

          {/* Verified Medical Sources */}
          <div className="pt-4 border-t border-[var(--line)] text-xs text-[var(--muted)] space-y-1">
            <strong className="text-[var(--ink)] block">
              {t("learn", "sources")}:
            </strong>
            <ul className="list-disc pl-5 space-y-1">
              {selectedLesson.sources.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[#79516F] dark:text-[#E8A8BF] hover:underline"
                  >
                    {s.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      )}

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs hover:border-[var(--line-strong)] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="rounded-full bg-[var(--card-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[#79516F] dark:text-[#E8A8BF] uppercase border border-[var(--line-strong)]">
                  {t("learn", lesson.category)}
                </span>
                <span>{lesson.readTime}</span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[var(--ink)]">
                {lang === "hi" ? lesson.titleHi : lesson.titleEn}
              </h3>

              <p className="text-xs text-[var(--muted)] line-clamp-3 leading-relaxed">
                {lang === "hi" ? lesson.contentHi : lesson.contentEn}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedLesson(lesson)}
                className="touch-target inline-flex items-center gap-1.5 text-xs font-bold text-[#79516F] dark:text-[#E8A8BF] hover:underline"
              >
                <span>{t("learn", "readLesson")}</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

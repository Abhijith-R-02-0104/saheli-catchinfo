import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation.js";

const FAQS = [
  {
    id: "q1",
    category: "basics",
    questionEn: "Why is my period late if I'm not pregnant?",
    questionHi: "यदि मैं गर्भवती नहीं हूँ, तो मेरी माहवारी देर से क्यों आ रही है?",
    answerEn:
      "Stress, significant weight changes, excessive high-intensity workouts, illness, travel across time zones, thyroid variations, and hormonal conditions like PCOS can delay ovulation, which directly delays your period. If your period is delayed by more than 90 days, schedule an evaluation with a gynecologist.",
    answerHi:
      "मानसिक तनाव, वजन में अचानक बदलाव, अत्यधिक व्यायाम, बीमारी, यात्रा, थायरॉयड और पीसीओएस (PCOS) जैसे हार्मोनल कारणों से ओव्यूलेशन में देरी हो सकती है, जिससे माहवारी टल जाती है। यदि 90 दिनों से अधिक समय तक माहवारी न आए, तो स्त्री रोग विशेषज्ञ से मिलें।",
    source: "ACOG FAQ: Abnormal Uterine Bleeding",
  },
  {
    id: "q2",
    category: "pain",
    questionEn: "How do I know if my period pain is normal or abnormal?",
    questionHi: "मुझे कैसे पता चलेगा कि मेरा माहवारी का दर्द सामान्य है या असामान्य?",
    answerEn:
      "Mild to moderate cramping that is manageable with gentle warmth, rest, or standard pain relief and does not prevent you from attending school or work is typical (primary dysmenorrhea). Severe pain that causes vomiting, fainting, radiates down the thighs, or renders you unable to carry out daily activities is not normal and may indicate conditions like endometriosis or adenomyosis.",
    answerHi:
      "हल्की से मध्यम ऐंठन जो गर्म सिकाई या सामान्य दर्द की दवा से शांत हो जाए और दैनिक कार्यों में बाधा न डाले, सामान्य है। अत्यधिक तेज़ दर्द जिससे उल्टी, चक्कर आना या दैनिक कार्य न कर पाना शामिल हो, सामान्य नहीं है और इसके लिए डॉक्टर की जांच जरूरी है।",
    source: "NHS Period Pain & Endometriosis Guidelines",
  },
  {
    id: "q3",
    category: "basics",
    questionEn: "What color should normal period blood be?",
    questionHi: "सामान्य माहवारी के रक्त का रंग कैसा होना चाहिए?",
    answerEn:
      "Period blood naturally changes color across your cycle: bright red signifies fresh, active flow; dark red or brownish indicates blood that has oxidized while leaving the uterus (often at the beginning or end of your period); and pinkish can indicate light spotting mixed with cervical fluid. Gray or foul-smelling discharge should be medically checked for possible infection.",
    answerHi:
      "माहवारी के दौरान रक्त का रंग बदल सकता है: चमकीला लाल सक्रिय प्रवाह दर्शाता है; गहरा लाल या भूरा पुराना ऑक्सीकृत रक्त होता है (शुरुआत या अंत में); और हल्का गुलाबी धब्बों को दर्शाता है। यदि बदबूदार या सलेटी स्राव हो, तो डॉक्टर से संपर्क करें।",
    source: "Mayo Clinic Women's Health",
  },
  {
    id: "q4",
    category: "fertility",
    questionEn: "Can I get pregnant during my period?",
    questionHi: "क्या माहवारी के दौरान गर्भधारण हो सकता है?",
    answerEn:
      "While the biological likelihood is low, it is possible. Sperm can live inside the female reproductive tract for up to 5 days. In individuals with shorter cycles (e.g. 21 to 24 days), ovulation can occur very shortly after bleeding ends, meaning unprotected intercourse during late period days could coincide with the fertile window.",
    answerHi:
      "यद्यपि संभावना कम है, फिर भी यह संभव है। शुक्राणु महिला के शरीर में 5 दिनों तक जीवित रह सकते हैं। छोटे चक्रों (21-24 दिन) में माहवारी खत्म होते ही ओव्यूलेशन हो सकता है, जिससे गर्भधारण की संभावना बन सकती है।",
    source: "ACOG Fertility & Contraception Guidelines",
  },
  {
    id: "q5",
    category: "hygiene",
    questionEn: "How often should I change my pad or menstrual cup?",
    questionHi: "मुझे कितनी बार पैड या मेंस्ट्रुअल कप बदलना या खाली करना चाहिए?",
    answerEn:
      "Sanitary pads should typically be changed every 4 to 6 hours (even on light days) to prevent bacterial overgrowth, odor, and skin irritation. Menstrual cups can safely be worn for up to 8 to 12 hours depending on flow intensity, then washed thoroughly with warm water and mild soap before reinsertion.",
    answerHi:
      "बैक्टीरिया और संक्रमण से बचने के लिए सैनिटरी पैड को हर 4 से 6 घंटे में बदलना चाहिए। मेंस्ट्रुअल कप को 8 से 12 घंटे तक इस्तेमाल किया जा सकता है, जिसे साफ पानी और हल्के साबुन से धोकर पुनः लगाना चाहिए।",
    source: "WHO Menstrual Hygiene Guidance",
  },
];

export function AskView() {
  const { lang, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs = FAQS.filter((faq) => {
    const qText = lang === "hi" ? faq.questionHi : faq.questionEn;
    const aText = lang === "hi" ? faq.answerHi : faq.answerEn;
    const matchesSearch =
      !searchQuery.trim() ||
      qText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
          {t("nav", "ask")}
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          {t("ask", "title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {lang === "hi"
            ? "स्त्री रोग विशेषज्ञों द्वारा सत्यापित उत्तर। यह पूर्व-निर्धारित शैक्षणिक सामग्री है, लाइव AI नहीं।"
            : "Trusted answers verified by certified clinical guidelines. Pre-verified educational knowledge, not a live AI or diagnosis."}
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="rounded-2xl border border-amber-200 dark:border-[#5E3F1F] bg-amber-50 dark:bg-[#332211] p-4 text-xs text-amber-900 dark:text-[#FFE0B2] flex items-start gap-3">
        <span className="text-base" aria-hidden="true">🚨</span>
        <div>
          <strong className="font-bold">
            {lang === "hi" ? "आपातकालीन स्थिति:" : "In case of emergency:"}
          </strong>{" "}
          {t("ask", "emergencyAlert")}{" "}
          <span className="font-bold text-[#8F1D1D] dark:text-[#FFB3B8]">
            Call 112 / 108 or Tele-MANAS (14416).
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("ask", "searchPlaceholder")}
          className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-3.5 text-sm text-[var(--ink)] placeholder-[var(--muted)] shadow-xs focus-visible:outline-2 focus-visible:outline-[#79516F]"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-3">
        {[
          { id: "all", label: t("ask", "allCategories") },
          { id: "basics", label: lang === "hi" ? "साइकिल मूल बातें" : "Cycle Basics" },
          { id: "pain", label: lang === "hi" ? "दर्द व ऐंठन" : "Pain & Relief" },
          { id: "fertility", label: lang === "hi" ? "प्रजनन व गर्भधारण" : "Fertility & Windows" },
          { id: "hygiene", label: lang === "hi" ? "स्वच्छता व देखभाल" : "Hygiene" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`touch-target rounded-2xl px-4 py-2 text-xs font-semibold transition-all border ${
              selectedCategory === cat.id
                ? "bg-[#79516F] text-white border-[#79516F] shadow-xs dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Conversational Questions List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const question = lang === "hi" ? faq.questionHi : faq.questionEn;
            const answer = lang === "hi" ? faq.answerHi : faq.answerEn;

            return (
              <div
                key={faq.id}
                className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 shadow-xs transition-all hover:border-[var(--line-strong)] space-y-3"
              >
                {/* User Question Row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full flex items-start justify-between gap-4 text-left font-serif text-base font-bold text-[var(--ink)]"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-[var(--plum)]" aria-hidden="true">
                      💬
                    </span>
                    <span>{question}</span>
                  </div>
                  <span className="text-[var(--plum)] text-sm font-bold">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </button>

                {/* Soft Saheli Response Bubble */}
                {isExpanded && (
                  <div className="mt-3 rounded-2xl bg-[var(--card-subtle)] p-4.5 border border-[var(--line)] space-y-3 text-xs leading-relaxed text-[var(--ink)]">
                    <div className="flex items-center gap-2 text-[var(--plum)] font-bold text-xs">
                      <span>🌸 Saheli Guidance:</span>
                    </div>

                    <p className="text-[var(--ink)] leading-relaxed text-sm">
                      {answer}
                    </p>

                    <div className="pt-2 border-t border-[var(--line)] text-[11px] text-[var(--muted)]">
                      <strong>Medical Reference:</strong> {faq.source}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-12 text-center space-y-2">
            <span className="text-3xl" aria-hidden="true">
              🔍
            </span>
            <p className="font-serif text-base font-bold text-[var(--ink)]">
              {t("ask", "fallbackTitle")}
            </p>
            <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
              {t("ask", "fallbackText")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

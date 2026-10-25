/**
 * Medicines and Treatment Educational Lessons
 * Grounded in NHS, WHO, and British National Formulary clinical guidance.
 */
export const MEDICINES_LESSONS = [
  {
    id: "period-medicines",
    category: "medicines",
    readTime: "5 min",
    featured: false,
    startHere: false,
    title: {
      en: "Understanding Period Pain Medicines and Treatments",
      hi: "माहवारी के दर्द की दवाएं और सुरक्षित उपचार",
    },
    intro: {
      en: "Over-the-counter pain relievers, antispasmodics, and prescription therapies work through distinct biological mechanisms to relieve menstrual cramps.",
      hi: "बिना पर्ची मिलने वाली दर्द निवारक दवाएं, ऐंठन रोधी गोलियां और चिकित्सकीय दवाएं माहवारी के दर्द को कम करने के लिए अलग-अलग जैविक तरीकों से काम करती हैं।",
    },
    whatYouWillLearn: {
      en: [
        "How NSAIDs (Ibuprofen, Mefenamic Acid) inhibit prostaglandin synthesis at the source.",
        "The difference between NSAIDs and Paracetamol (acetaminophen) for menstrual pain.",
        "Why NSAIDs must always be taken with or after food to protect the stomach lining.",
        "Prescription hormonal options and antifibrinolytic medicines for heavy bleeding.",
      ],
      hi: [
        "NSAID दवाएं (इबुप्रोफेन, मेफेनेमिक एसिड) गर्भाशय में दर्द पैदा करने वाले रसायनों को कैसे रोकती हैं।",
        "माहवारी के दर्द में NSAID और पैरासिटामोल के काम करने के तरीके में अंतर।",
        "पेट की सुरक्षा के लिए इन दवाओं को हमेशा खाना खाने के बाद लेना क्यों आवश्यक है।",
        "भारी रक्तस्राव और गंभीर दर्द के लिए डॉक्टर द्वारा दी जाने वाली अन्य दवाएं।",
      ],
    },
    sections: [
      {
        heading: {
          en: "NSAIDs: The First-Line Treatment for Cramps",
          hi: "NSAIDs: ऐंठन और दर्द की पहली पसंद",
        },
        body: {
          en: "Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) such as ibuprofen, naproxen, and mefenamic acid are clinically recognized as the most effective first-line medication for primary dysmenorrhea. Unlike simple analgesics, NSAIDs inhibit the cyclooxygenase (COX) enzymes responsible for synthesizing prostaglandins in the uterine lining. By decreasing prostaglandin levels, they reduce the strength and frequency of painful uterine contractions.",
          hi: "इबुप्रोफेन, नेप्रोक्सेन और मेफेनेमिक एसिड जैसी गैर-स्टेरॉयडल एंटी-इंफ्लेमेटरी दवाएं (NSAIDs) माहवारी के दर्द के लिए सबसे प्रभावी मानी जाती हैं। ये दवाएं गर्भाशय के अंदर प्रोस्टाग्लैंडिन्स बनने से रोक देती हैं। जब ये रसायन कम बनते हैं, तो गर्भाशय का अत्यधिक संकुचन शांत हो जाता है और दर्द में बहुत तेजी से आराम मिलता है।",
        },
        keyCallout: {
          en: "Critical Safety Rule: Always take NSAIDs with or immediately after a meal or glass of milk. Never take them on an empty stomach, as they can irritate the gastric mucosa.",
          hi: "अति महत्वपूर्ण सुरक्षा नियम: NSAID दवाओं को हमेशा भोजन करने के बाद या दूध के साथ लें। इन्हें कभी भी खाली पेट न लें, अन्यथा पेट में जलन या अल्सर का खतरा हो सकता है।",
        },
      },
      {
        heading: {
          en: "Paracetamol vs. NSAIDs",
          hi: "पैरासिटामोल बनाम NSAIDs",
        },
        body: {
          en: "Paracetamol (acetaminophen) works centrally in the brain to block pain perception and lower fever, but it has very weak anti-inflammatory activity and does not inhibit uterine prostaglandin synthesis. While it provides mild pain relief and is safer for individuals with asthma, active stomach ulcers, or aspirin allergies, clinical trials show it is generally less effective than NSAIDs for intense menstrual cramps.",
          hi: "पैरासिटामोल मस्तिष्क में दर्द के एहसास को कम करता है, लेकिन यह गर्भाशय की सूजन या संकुचन को नहीं रोकता। जिन लोगों को पेट में अल्सर, दमा (अस्थमा) या दर्द निवारक दवाओं से एलर्जी हो, उनके लिए पैरासिटामोल सुरक्षित विकल्प है, हालांकि गंभीर ऐंठन में यह NSAIDs जितनी असरदार नहीं होती।",
        },
      },
      {
        heading: {
          en: "Tranexamic Acid for Heavy Bleeding",
          hi: "भारी रक्तस्राव के लिए ट्रैनेक्सैमिक एसिड",
        },
        body: {
          en: "For individuals whose primary symptom is heavy menstrual bleeding rather than pain alone, tranexamic acid is an evidence-based, non-hormonal prescription tablet taken only during the days of heavy flow. It works as an antifibrinolytic, preventing enzymes from breaking down blood clots prematurely in the uterine lining, typically reducing blood loss by 40% to 50% without altering natural hormone levels.",
          hi: "जिन महिलाओं को अत्यधिक रक्तस्राव होता है, उनके लिए डॉक्टर ट्रैनेक्सैमिक एसिड की सलाह देते हैं। यह बिना किसी हार्मोन वाली दवा है जिसे केवल भारी बहाव के दिनों में लिया जाता है। यह गर्भाशय में खून के थक्कों को जल्दी घुलने से रोकती है, जिससे बहाव में 40 से 50% तक की कमी आ जाती है और शरीर में हार्मोनों पर कोई असर नहीं पड़ता।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Cyclooxygenase (COX-1 and COX-2) Enzyme Inhibition",
        hi: "COX एंजाइम का अवरोध और दर्द निवारण",
      },
      text: {
        en: "NSAIDs competitively bind to the catalytic active site of COX-1 and COX-2 enzymes, preventing the conversion of arachidonic acid into PGH2, the precursor to PGF2α and thromboxane A2. This directly reduces intrauterine resting and active pressures, restoring microvascular perfusion.",
        hi: "ये दवाएं उन रासायनिक एंजाइमों को निष्क्रिय कर देती हैं जो कोशिकाओं में दर्द और सूजन के रसायन बनाते हैं। इससे गर्भाशय की नसों में रक्त संचार सामान्य हो जाता है और ऐंठन तुरंत रुक जाती है।",
      },
    },
    practicalGuidance: {
      en: [
        "Take your first dose of an NSAID with food at the earliest onset of bleeding or cramping, rather than waiting for pain to become severe.",
        "Do not exceed the maximum daily dosage indicated on the package or prescribed by your physician.",
        "Avoid combining multiple different NSAIDs simultaneously (e.g., do not take ibuprofen and mefenamic acid together).",
        "If you have a history of stomach ulcers, kidney disease, severe asthma, or bleeding disorders, consult your doctor before taking NSAIDs.",
      ],
      hi: [
        "दर्द के गंभीर होने का इंतजार करने के बजाय, जैसे ही ऐंठन या ब्लीडिंग शुरू हो, भोजन के साथ दवा की पहली खुराक लें।",
        "दवा के पैकेट पर लिखी या डॉक्टर द्वारा बताई गई दैनिक सीमा से अधिक गोली कभी न लें।",
        "एक साथ दो अलग-अलग दर्द निवारक दवाएं (जैसे इबुप्रोफेन और मेफेनेमिक एसिड दोनों) कभी न मिलाएं।",
        "यदि पेट में अल्सर, किडनी की बीमारी, गंभीर अस्थमा या खून बहने की समस्या हो, तो बिना डॉक्टरी सलाह के दवा न लें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Taking pain relievers for period cramps will make you addicted to them or ruin your future fertility.",
          hi: "माहवारी में दर्द की दवा लेने से उसकी लत लग जाती है या भविष्य में बांझपन हो सकता है।",
        },
        fact: {
          en: "Over-the-counter NSAIDs like ibuprofen are non-addictive and have no negative impact on ovarian reserves, future fertility, or menstrual cycle regularity when taken as directed for a few days each month.",
          hi: "महीने में 2-3 दिन सही मात्रा में ली जाने वाली साधारण दर्द निवारक दवाओं की कोई लत नहीं लगती और न ही इनसे प्रजनन क्षमता या अंडाशय पर कोई बुरा असर पड़ता है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Cramps do not improve despite taking full recommended doses of over-the-counter pain relievers.",
        "You experience severe stomach pain, black tarry stools, or persistent nausea after taking painkillers.",
        "Pain worsens over months or occurs persistently between periods.",
      ],
      hi: [
        "पूरी सही खुराक लेने के बाद भी दर्द में कोई सुधार न होना।",
        "दवा लेने के बाद पेट में तेज जलन, काला मल आना या लगातार उल्टी होना।",
        "दर्द हर महीने बढ़ता जाए या माहवारी के बिना भी लगातार बना रहे।",
      ],
    },
    keyTakeaways: {
      en: [
        "NSAIDs target the biological root of cramps by directly stopping prostaglandin production.",
        "Always take NSAIDs with food to protect your stomach lining.",
        "Paracetamol is gentler on the stomach but less effective for prostaglandins; tranexamic acid treats heavy bleeding.",
      ],
      hi: [
        "NSAID दवाएं दर्द की जड़ यानी प्रोस्टाग्लैंडिन्स को सीधे रोककर राहत देती हैं।",
        "पेट की सुरक्षा के लिए इन दवाओं को हमेशा कुछ खाने के बाद ही लें।",
        "पैरासिटामोल पेट के लिए हल्की है लेकिन ऐंठन में कम असरदार; भारी बहाव के लिए ट्रैनेक्सैमिक एसिड कारगर है।",
      ],
    },
    sources: [
      { name: "NHS — Ibuprofen and Other NSAIDs", url: "https://www.nhs.uk/medicines/ibuprofen-for-adults/" },
      { name: "ACOG — Dysmenorrhea and Nonsteroidal Anti-Inflammatory Drugs", url: "https://www.acog.org" },
      { name: "British National Formulary (BNF) — Primary Dysmenorrhoea Management", url: "https://bnf.nice.org.uk" },
    ],
    relatedLessonIds: ["menstrual-cramps", "evidence-pain-relief", "heavy-menstrual-bleeding"],
  },
];

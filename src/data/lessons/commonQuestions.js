/**
 * Common Questions (FAQ) for Learn Landing Page
 * Grounded in ACOG, NHS, and FIGO clinical guidance.
 */
export const COMMON_QUESTIONS = [
  {
    id: "faq-cramps-intensity",
    category: "symptoms",
    question: {
      en: "How do I know if my menstrual cramps are 'too severe'?",
      hi: "मुझे कैसे पता चलेगा कि मेरी माहवारी की ऐंठन 'बहुत ज्यादा गंभीर' है?",
    },
    answer: {
      en: "Mild cramps that ease with a heating pad or over-the-counter ibuprofen are normal. Cramps are considered clinically severe if they prevent you from going to school or work, do not improve with medication, cause vomiting, or continue after bleeding stops. In such cases, consult a gynecologist to check for conditions like endometriosis or fibroids.",
      hi: "हल्की ऐंठन जो गर्म सिकाई या साधारण दवा से ठीक हो जाए सामान्य है। लेकिन यदि दर्द आपको स्कूल या काम पर जाने से रोके, दवाओं से ठीक न हो, उल्टी कराए या माहवारी खत्म होने के बाद भी रहे, तो यह गंभीर है और डॉक्टर से जांच करानी चाहिए।",
    },
    relatedLessonId: "when-pain-needs-doctor",
  },
  {
    id: "faq-heavy-bleeding",
    category: "doctor",
    question: {
      en: "How can I tell if my period bleeding is abnormally heavy?",
      hi: "मैं कैसे समझूँ कि मेरा रक्तस्राव असामान्य रूप से भारी है?",
    },
    answer: {
      en: "Heavy menstrual bleeding is defined as needing to change a soaked pad or tampon every 1 to 2 hours for consecutive hours, passing blood clots larger than a coin (2.5 cm), bleeding for more than 7 days, or needing double protection. If you experience this, check with a doctor to check for anemia and structural causes.",
      hi: "यदि आपको लगातार दो घंटे तक हर 1-2 घंटे में पैड बदलना पड़े, एक रुपये के सिक्के से बड़े खून के थक्के निकलें, 7 दिनों से अधिक खून बहे, या अत्यधिक कमजोरी महसूस हो, तो यह भारी रक्तस्राव का संकेत है जिसकी जांच आवश्यक है।",
    },
    relatedLessonId: "heavy-menstrual-bleeding",
  },
  {
    id: "faq-missed-period-causes",
    category: "conditions",
    question: {
      en: "My pregnancy test is negative, so why haven't I gotten my period?",
      hi: "मेरा प्रेग्नेंसी टेस्ट नेगेटिव है, फिर भी मुझे माहवारी क्यों नहीं आई?",
    },
    answer: {
      en: "Aside from pregnancy, periods can be paused by acute stress, significant weight loss or restrictive dieting, intense athletic training, thyroid imbalances, PCOS, or starting/stopping hormonal birth control. If your period is missing for more than 90 days, consult a physician.",
      hi: "गर्भावस्था के अलावा मानसिक तनाव, डाइटिंग या वजन कम होना, अत्यधिक कसरत, थायरॉयड में गड़बड़ी, PCOS या दवाओं के असर से भी माहवारी रुक सकती है। यदि 3 महीने तक माहवारी न आए तो डॉक्टर से मिलें।",
    },
    relatedLessonId: "missed-periods",
  },
  {
    id: "faq-exercise-safety",
    category: "nutrition",
    question: {
      en: "Is it really safe to work out while bleeding?",
      hi: "क्या माहवारी के दिनों में कसरत करना सचमुच सुरक्षित है?",
    },
    answer: {
      en: "Yes, absolutely. Light to moderate exercise—like walking, swimming, or yoga—boosts blood circulation and triggers the release of endorphins, which act as natural painkillers. Just listen to your body and rest if you feel exhausted.",
      hi: "हाँ, बिल्कुल। टहलना, योग या तैराकी करना पेल्विक रक्त संचार को बढ़ाता है और शरीर में प्राकृतिक दर्द निवारक एंडोर्फिन बनाता है। बस अपनी थकान का ध्यान रखें और जरूरत पड़ने पर आराम करें।",
    },
    relatedLessonId: "exercise-period",
  },
  {
    id: "faq-calendar-contraception",
    category: "myths-facts",
    question: {
      en: "Can I use period-tracking apps as natural birth control?",
      hi: "क्या मैं पीरियड ऐप को गर्भनिरोधक (बर्थ कंट्रोल) के रूप में इस्तेमाल कर सकती हूँ?",
    },
    answer: {
      en: "No. Calendar apps use mathematical averages, not real-time biological measurements. Because ovulation can shift unpredictably and sperm can live inside for up to 5 days, relying solely on an app's 'safe days' carries a high risk of unintended pregnancy.",
      hi: "नहीं। पीरियड ऐप्स केवल गणितीय अनुमान लगाते हैं, वे अंदरूनी ओव्यूलेशन को सीधे नहीं देख सकते। अंडा कभी भी आगे-पीछे निकल सकता है और शुक्राणु 5 दिन जीवित रहते हैं, इसलिए केवल ऐप के भरोसे रहने से गर्भ ठहर सकता है।",
    },
    relatedLessonId: "myth-exact-ovulation",
  },
  {
    id: "faq-painkillers-safety",
    category: "medicines",
    question: {
      en: "Will taking painkillers for period cramps ruin my future fertility?",
      hi: "क्या माहवारी में दर्द की दवा लेने से आगे चलकर बच्चा होने में समस्या हो सकती है?",
    },
    answer: {
      en: "No. Over-the-counter NSAIDs like ibuprofen taken for a few days each month have no negative impact on future fertility or ovarian reserves. Always take them with food to protect your stomach lining.",
      hi: "नहीं। महीने में 2-3 दिन सही तरीके से ली जाने वाली साधारण दर्द निवारक दवाओं से प्रजनन क्षमता या अंडाशय पर कोई बुरा असर नहीं पड़ता। पेट की सुरक्षा के लिए इन्हें हमेशा कुछ खाने के बाद ही लें।",
    },
    relatedLessonId: "period-medicines",
  },
];

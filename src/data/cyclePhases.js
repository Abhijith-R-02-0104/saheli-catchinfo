/**
 * 4 Menstrual Cycle Phases clinical information (verified against ACOG & NHS guidelines)
 */
export const CYCLE_PHASES = {
  menstrual: {
    id: "menstrual",
    days: [1, 5],
    color: "#79516F",
    bgColor: "#FCF4F7",
    borderColor: "#E9B7C8",
    nameEn: "Menstrual Phase",
    nameHi: "माहवारी चरण",
    rangeEn: "Days 1 – 5",
    rangeHi: "दिन 1 – 5",
    descEn:
      "The uterine lining sheds if pregnancy did not occur. Estrogen and progesterone are at their lowest baseline. Rest, hydration, and warmth help ease cramps.",
    descHi:
      "यदि गर्भधारण नहीं हुआ तो गर्भाशय की परत निकलती है। एस्ट्रोजन और प्रोजेस्टेरोन सबसे निचले स्तर पर होते हैं। आराम, पानी और गर्माहट ऐंठन कम करने में मदद करते हैं।",
    careTipEn: "Warm compress, chamomile/ginger tea, and light walking or rest.",
    careTipHi: "गर्म सिकाई, अदरक या कैमोमाइल चाय, और हल्का टहलना या आराम।",
  },
  follicular: {
    id: "follicular",
    days: [6, 13],
    color: "#3F6344",
    bgColor: "#F4FAF5",
    borderColor: "#DCEBDD",
    nameEn: "Follicular Phase",
    nameHi: "फॉलिक्युलर चरण",
    rangeEn: "Days 6 – 13",
    rangeHi: "दिन 6 – 13",
    descEn:
      "FSH stimulates ovarian follicles to mature. Estrogen rises steadily, rebuilding the uterine lining. Energy, mood, and mental clarity often increase.",
    descHi:
      "FSH हार्मोन अंडाशय में फॉलिकल्स को परिपक्व करता है। एस्ट्रोजन बढ़ता है और गर्भाशय की परत फिर से बनती है। ऊर्जा, मनोदशा और एकाग्रता बेहतर होती है।",
    careTipEn: "Nutritious protein, strength exercises, creative tasks, and outdoor walks.",
    careTipHi: "पौष्टिक प्रोटीन युक्त भोजन, रचनात्मक कार्य और सक्रिय व्यायाम।",
  },
  ovulation: {
    id: "ovulation",
    days: [14, 17],
    color: "#79516F",
    bgColor: "#FFF5F8",
    borderColor: "#E9B7C8",
    nameEn: "Ovulation Window",
    nameHi: "ओव्यूलेशन खिड़की",
    rangeEn: "Days 14 – 17",
    rangeHi: "दिन 14 – 17",
    descEn:
      "LH surge triggers the release of a mature egg from the ovary. Peak estrogen levels. Highest biological probability of conception.",
    descHi:
      "LH हार्मोन में तेजी अंडाशय से परिपक्व अंडे को मुक्त करती है। एस्ट्रोजन अपने उच्चतम स्तर पर होता है। गर्भधारण की सबसे अधिक संभावना।",
    careTipEn: "Notice natural body cues (subtle pelvic twinge, clear cervical fluid).",
    careTipHi: "शरीर के संकेतों पर ध्यान दें (हल्का खिंचाव, स्पष्ट सर्वाइकल फ्लूइड)।",
  },
  luteal: {
    id: "luteal",
    days: [18, 28],
    color: "#854D0E",
    bgColor: "#FFFDF5",
    borderColor: "#FBE6B8",
    nameEn: "Luteal Phase",
    nameHi: "ल्यूटियल चरण",
    rangeEn: "Days 18 – 28",
    rangeHi: "दिन 18 – 28",
    descEn:
      "Progesterone dominates to sustain the uterine lining. If fertilization did not happen, hormone levels drop, sometimes leading to PMS symptoms.",
    descHi:
      "प्रोजेस्टेरोन प्रमुख होता है। यदि निषेचन नहीं हुआ तो हार्मोन घटते हैं, जिससे कई बार पीएमएस (मूड में बदलाव, सूजन) के लक्षण हो सकते हैं।",
    careTipEn: "Magnesium-rich foods (nuts, dark greens), regular sleep, and gentle stretching.",
    careTipHi: "मैग्नीशियम युक्त आहार (मेवे, हरी सब्जियां), समय पर नींद और हल्का योग।",
  },
};

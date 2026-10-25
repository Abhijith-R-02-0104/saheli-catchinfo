/**
 * Symptom Relief Educational Lessons
 * Grounded in NHS, ACOG, and Cochrane clinical reviews.
 */
export const SYMPTOM_LESSONS = [
  {
    id: "menstrual-cramps",
    category: "symptoms",
    readTime: "4 min",
    featured: true,
    startHere: false,
    title: {
      en: "Understanding Menstrual Cramps (Dysmenorrhea)",
      hi: "माहवारी की ऐंठन और दर्द को समझें (डिसमेनोरिया)",
    },
    intro: {
      en: "Menstrual cramps are the most common cycle symptom, caused by uterine muscle contractions driven by naturally occurring prostaglandins.",
      hi: "माहवारी की ऐंठन सबसे आम लक्षण है, जो गर्भाशय की मांसपेशियों में प्रोस्टाग्लैंडिन्स हार्मोन के कारण होने वाले संकुचन से होती है।",
    },
    whatYouWillLearn: {
      en: [
        "The difference between primary and secondary dysmenorrhea.",
        "How prostaglandins trigger uterine muscle contractions.",
        "Normal cramping intensity versus signs needing medical review.",
        "Why pain typically peaks in the first 24 to 48 hours of bleeding.",
      ],
      hi: [
        "प्राथमिक और द्वितीयक डिसमेनोरिया के बीच का अंतर।",
        "प्रोस्टाग्लैंडिन्स गर्भाशय की मांसपेशियों में खिंचाव कैसे पैदा करते हैं।",
        "सामान्य दर्द और डॉक्टर को दिखाने योग्य गंभीर दर्द की पहचान।",
        "रक्तस्राव के पहले 24 से 48 घंटों में दर्द सबसे अधिक क्यों होता है।",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Causes Period Cramps?",
          hi: "माहवारी में ऐंठन का क्या कारण है?",
        },
        body: {
          en: "During menstruation, the endometrium produces hormone-like compounds called prostaglandins. Prostaglandins trigger the muscular uterine wall (myometrium) to contract rhythmically, shedding the lining. Higher levels of prostaglandins are directly associated with more intense contractions, temporarily reducing blood flow and oxygen to the uterine muscle, which registers as cramping pain in the lower pelvis, lower back, and upper thighs.",
          hi: "माहवारी के दौरान गर्भाशय की परत प्रोस्टाग्लैंडिन्स नामक रसायन बनाती है। ये रसायन गर्भाशय की मांसपेशियों को सिकोड़ते हैं ताकि परत बाहर निकल सके। प्रोस्टाग्लैंडिन्स की अधिक मात्रा से मांसपेशियों में रक्त और ऑक्सीजन का प्रवाह कुछ देर के लिए घट जाता है, जिससे पेट के निचले हिस्से, कमर और जांघों में ऐंठन और दर्द होता है।",
        },
        keyCallout: {
          en: "Peak Timing: Cramps usually begin a few hours before or at the onset of bleeding and subside as prostaglandin levels drop over 48 hours.",
          hi: "चरम समय: ऐंठन आमतौर पर रक्तस्राव शुरू होने से कुछ घंटे पहले या साथ में शुरू होती है और 48 घंटों में धीरे-धीरे कम हो जाती है।",
        },
      },
      {
        heading: {
          en: "Primary vs. Secondary Dysmenorrhea",
          hi: "प्राथमिक बनाम द्वितीयक डिसमेनोरिया",
        },
        body: {
          en: "Clinicians categorize menstrual pain into two types. Primary dysmenorrhea refers to recurrent menstrual cramps without an underlying pelvic disease, typically beginning during adolescence within 1 to 2 years of menarche. Secondary dysmenorrhea is menstrual pain caused by a diagnosed reproductive condition, such as endometriosis, adenomyosis, or uterine fibroids. Secondary pain often begins later in life, lasts throughout the period, and may worsen over time.",
          hi: "चिकित्सक माहवारी के दर्द को दो प्रकारों में बांटते हैं। प्राथमिक डिसमेनोरिया वह सामान्य दर्द है जिसका कोई अन्य बीमारी कारण नहीं होती, और यह किशोरावस्था से ही शुरू होता है। द्वितीयक डिसमेनोरिया किसी अंदरूनी स्थिति (जैसे एंडोमेट्रियोसिस या फाइब्रॉएड) के कारण होता है। यह दर्द अक्सर उम्र बढ़ने पर शुरू होता है और पूरे चक्र में बना रह सकता है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Prostaglandin F2-alpha and Uterine Ischemia",
        hi: "प्रोस्टाग्लैंडिन F2-अल्फा और गर्भाशय में संकुचन",
      },
      text: {
        en: "When progesterone levels drop at the end of the luteal phase, lysosomal enzymes in the uterine lining break down cell membranes, releasing arachidonic acid. This converts into Prostaglandin F2-alpha (PGF2α), which induces intense smooth muscle contractions and vasoconstriction. When uterine pressure exceeds arterial pressure, temporary localized ischemia (oxygen deprivation) stimulates sensory pain neurons.",
        hi: "ल्यूटियल चरण के अंत में प्रोजेस्टेरोन घटने पर गर्भाशय की परत प्रोस्टाग्लैंडिन F2-अल्फा का उत्पादन करती है। यह मांसपेशियों को तेजी से सिकोड़ता है। संकुचन के कारण मांसपेशियों तक ऑक्सीजन कम पहुंचती है, जिससे तंत्रिकाएं मस्तिष्क को दर्द का संदेश भेजती हैं।",
      },
    },
    practicalGuidance: {
      en: [
        "Apply continuous low-level heat (around 40°C) with a heating pad or hot water bottle to the lower abdomen.",
        "Take over-the-counter anti-inflammatory medicine (NSAIDs) with food at the earliest sign of cramping to block prostaglandin synthesis.",
        "Practice gentle pelvic opening stretches such as Reclined Bound Angle Pose (Supta Baddha Konasana) or Child's Pose.",
        "Stay hydrated with warm fluids and reduce salty foods that worsen pelvic congestion.",
      ],
      hi: [
        "पेट के निचले हिस्से पर हीटिंग पैड या गर्म पानी की थैली से हल्की सिकाई (लगभग 40°C) करें।",
        "दर्द के शुरुआती संकेत मिलते ही डॉक्टर की सलाह के अनुसार भोजन के साथ दर्द निवारक दवा (NSAIDs) लें।",
        "हल्के पेल्विक योग और खिंचाव जैसे बालासन करें जिससे मांसपेशियों को विश्राम मिले।",
        "गुनगुने पानी का सेवन बढ़ाएं और अधिक नमक वाली चीजों से बचें जो सूजन बढ़ाती हैं।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Debilitating menstrual pain is completely normal and something you just have to endure.",
          hi: "असहनीय दर्द माहवारी का सामान्य हिस्सा है और इसे बस सहना पड़ता है।",
        },
        fact: {
          en: "While mild to moderate cramps are common, pain that prevents you from attending school or work, or that does not respond to standard pain relievers, is not normal and should be clinically evaluated.",
          hi: "हल्की से मध्यम ऐंठन सामान्य है, लेकिन ऐसा दर्द जो स्कूल या काम पर जाने से रोके या साधारण दवाओं से ठीक न हो, वह सामान्य नहीं है और उसकी चिकित्सकीय जांच होनी चाहिए।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Severe pelvic pain that disrupts daily activities or keeps you bedridden.",
        "Cramps that progressively worsen month after month or begin years after your first period.",
        "Pain accompanied by fever, chills, vomiting, or foul-smelling vaginal discharge.",
        "Pain during sexual intercourse or bowel movements during menstruation.",
      ],
      hi: [
        "अत्यधिक दर्द जो रोज़मर्रा के कामों को रोक दे या बिस्तर से उठने न दे।",
        "दर्द जो हर महीने लगातार बढ़ता जा रहा हो या पहली माहवारी के कई साल बाद अचानक शुरू हुआ हो।",
        "दर्द के साथ तेज बुखार, उल्टी या दुर्गंधयुक्त स्राव होना।",
        "माहवारी के दौरान संबंध बनाने या शौच के समय तेज दर्द होना।",
      ],
    },
    keyTakeaways: {
      en: [
        "Menstrual cramps are triggered by uterine prostaglandins shedding the endometrial lining.",
        "Heat therapy and NSAIDs act directly on the biological mechanism of cramping.",
        "Primary cramps ease over 48 hours; severe unmanageable pain warrants clinical evaluation.",
      ],
      hi: [
        "माहवारी की ऐंठन प्रोस्टाग्लैंडिन्स के कारण गर्भाशय के संकुचन से होती है।",
        "गर्म सिकाई और सही दवाएं संकुचन को कम करने में वैज्ञानिक रूप से प्रभावी हैं।",
        "साधारण ऐंठन 48 घंटे में कम हो जाती है; असहनीय दर्द की डॉक्टरी जांच आवश्यक है।",
      ],
    },
    sources: [
      { name: "NHS — Period Pain (Dysmenorrhoea)", url: "https://www.nhs.uk/conditions/period-pain/" },
      { name: "ACOG — Dysmenorrhea: Painful Periods", url: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods" },
      { name: "Cochrane Systematic Review on Heat Therapy", url: "https://www.cochranelibrary.com" },
    ],
    relatedLessonIds: ["evidence-pain-relief", "period-medicines", "when-pain-needs-doctor"],
  },
  {
    id: "evidence-pain-relief",
    category: "symptoms",
    readTime: "5 min",
    featured: false,
    startHere: false,
    title: {
      en: "Evidence-Based Ways to Manage Period Pain",
      hi: "माहवारी के दर्द से राहत के वैज्ञानिक उपाय",
    },
    intro: {
      en: "Clinical trials have evaluated numerous non-pharmacological and lifestyle interventions for dysmenorrhea. Here is what the medical evidence supports.",
      hi: "चिकित्सीय परीक्षणों में बिना दवा और जीवनशैली के कई उपायों का अध्ययन किया गया है। जानिए कौन से उपाय वैज्ञानिक रूप से सिद्ध हैं।",
    },
    whatYouWillLearn: {
      en: [
        "Why continuous topical heat therapy is as effective as standard analgesics.",
        "How targeted aerobic exercise releases endogenous endorphins.",
        "The scientific evidence behind magnesium, ginger, and omega-3s.",
        "A step-by-step non-medical toolkit for period comfort.",
      ],
      hi: [
        "गर्म सिकाई साधारण दर्द निवारक दवाओं जितनी ही प्रभावी क्यों मानी जाती है।",
        "हल्का व्यायाम शरीर में प्राकृतिक एंडोर्फिन कैसे जारी करता है।",
        "मैग्नीशियम, अदरक और ओमेगा-3 के पीछे वैज्ञानिक प्रमाण।",
        "माहवारी में आराम के लिए घरेलू और सुरक्षित उपायों की सूची।",
      ],
    },
    sections: [
      {
        heading: {
          en: "1. Heat Therapy: Clinical Evidence",
          hi: "1. गर्म सिकाई: चिकित्सीय प्रमाण",
        },
        body: {
          en: "Multiple randomized controlled trials, cited by Cochrane reviews, confirm that applying continuous low-level topical heat (around 40°C) to the lower abdomen provides pain relief comparable to standard doses of ibuprofen. Heat induces local vasodilation, increasing microvascular blood flow to the oxygen-deprived myometrium and relaxing muscular spasm.",
          hi: "कोक्रेन समीक्षाओं सहित कई चिकित्सीय अध्ययनों से सिद्ध हुआ है कि पेट के निचले हिस्से पर 40°C की हल्की गर्म सिकाई इबुप्रोफेन जैसी दवाओं जितना ही दर्द कम करती है। गर्मी से रक्त वाहिकाएं खुलती हैं, जिससे गर्भाशय की मांसपेशियों में रक्त प्रवाह बढ़ता है और ऐंठन शांत होती है।",
        },
      },
      {
        heading: {
          en: "2. Gentle Movement and Endorphins",
          hi: "2. हल्का व्यायाम और एंडोर्फिन",
        },
        body: {
          en: "While vigorous high-impact workouts may feel unappealing during heavy bleeding, 20 to 30 minutes of low-impact walking, swimming, or restorative yoga stimulates the release of beta-endorphins. Endorphins bind to opioid receptors in the central nervous system, raising your pain threshold and uplifting mood.",
          hi: "भारी रक्तस्राव के दौरान कठिन व्यायाम कठिन हो सकता है, लेकिन 20 से 30 मिनट की हल्की सैर या योग शरीर में बीटा-एंडोर्फिन जारी करता है। एंडोर्फिन शरीर के प्राकृतिक दर्द निवारक हैं जो दर्द सहने की क्षमता बढ़ाते हैं और मन को शांत करते हैं।",
        },
      },
      {
        heading: {
          en: "3. Ginger and Anti-Inflammatory Nutrition",
          hi: "3. अदरक और सूजन-रोधी आहार",
        },
        body: {
          en: "Systematic reviews have found that standardized ginger powder (750 to 2000 mg daily in divided doses during the first 3 days of menses) acts as a natural cyclooxygenase (COX) inhibitor, reducing inflammatory prostaglandin formation with efficacy comparable to mild over-the-counter NSAIDs.",
          hi: "वैज्ञानिक अध्ययनों से पता चलता है कि माहवारी के शुरुआती 3 दिनों में अदरक का सेवन (चाय या काढ़े के रूप में) सूजन पैदा करने वाले एंजाइम को रोकता है, जिससे ऐंठन और मतली में उल्लेखनीय राहत मिलती है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Thermal Neuromodulation and Gate Control Theory",
        hi: "थर्मल प्रभाव और गेट कंट्रोल सिद्धांत",
      },
      text: {
        en: "Applying heat activates thermal receptors (TRPV1) in the skin. These fast-conducting sensory nerve fibers send signals to the spinal cord that effectively close the 'neural gate' to slower pain impulses coming from the pelvic viscera, diminishing the brain's perception of cramps.",
        hi: "त्वचा पर गर्माहट लगाने से तापमान संवेदी तंत्रिकाएं सक्रिय होती हैं। ये तंत्रिकाएं रीढ़ की हड्डी में दर्द के संकेतों को मस्तिष्क तक पहुंचने से रोकती हैं (गेट कंट्रोल थ्योरी), जिससे दर्द का एहसास तुरंत कम हो जाता है।",
      },
    },
    practicalGuidance: {
      en: [
        "Use an electric heating pad or warm water bag for 20- to 30-minute intervals on the lower abdomen or lower back.",
        "Sip warm ginger tea prepared from freshly grated ginger root.",
        "Incorporate magnesium-rich foods such as pumpkin seeds, spinach, and dark chocolate in the days leading up to your period.",
        "Try resting with your legs elevated or in the fetal position to relieve pressure on the abdominal wall.",
      ],
      hi: [
        "पेट के निचले हिस्से या कमर पर 20-30 मिनट के अंतराल पर गर्म पानी की थैली का उपयोग करें।",
        "ताजा अदरक कूटकर बनाई गई गुनगुनी चाय पिएं।",
        "माहवारी से कुछ दिन पहले कद्दू के बीज, पालक और बादाम जैसे मैग्नीशियम युक्त आहार लें।",
        "पेट की मांसपेशियों पर दबाव कम करने के लिए घुटने मोड़कर करवट लेकर लेटें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Drinking cold water directly causes period cramps to solidify or become worse.",
          hi: "ठंडा पानी पीने से माहवारी का खून जम जाता है या ऐंठन बढ़ जाती है।",
        },
        fact: {
          en: "Ingested fluids pass through the digestive tract and cannot physically solidify menstrual blood inside the uterus. However, warm fluids often feel more soothing to abdominal muscles.",
          hi: "पीने का पानी पाचन तंत्र में जाता है और गर्भाशय के रक्त को नहीं जमा सकता। हालांकि गुनगुना पानी पेट की मांसपेशियों को आराम देने में अधिक सुखद लगता है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Pain relief methods fail to reduce pain below a manageable level.",
        "Cramps are accompanied by heavy bleeding soaking through more than one pad an hour.",
        "Pain radiates down both legs or is accompanied by bowel or urinary distress.",
      ],
      hi: [
        "कोई भी घरेलू या साधारण उपाय दर्द में राहत न दे रहा हो।",
        "ऐंठन के साथ इतना भारी रक्तस्राव हो कि हर घंटे पैड बदलना पड़े।",
        "दर्द दोनों पैरों में नीचे तक जाए या पेशाब और शौच के समय कठिनाई हो।",
      ],
    },
    keyTakeaways: {
      en: [
        "Continuous heat therapy is clinically comparable to standard pain medications for mild-to-moderate cramps.",
        "Low-impact movement releases natural endorphins that elevate your pain threshold.",
        "Ginger and anti-inflammatory nutrition support prostaglandin reduction.",
      ],
      hi: [
        "हल्की गर्म सिकाई साधारण दर्द में दवाओं जितनी ही प्रभावी पाई गई है।",
        "हल्का चलना या योग शरीर में प्राकृतिक एंडोर्फिन जारी करता है।",
        "अदरक और संतुलित पोषण सूजन और ऐंठन को कम करने में सहायक हैं।",
      ],
    },
    sources: [
      { name: "Cochrane Database of Systematic Reviews — Heat Therapy for Dysmenorrhoea", url: "https://www.cochranelibrary.com" },
      { name: "NHS — Period Pain Management", url: "https://www.nhs.uk/conditions/period-pain/" },
      { name: "Journal of Alternative and Complementary Medicine — Ginger for Primary Dysmenorrhea", url: "https://pubmed.ncbi.nlm.nih.gov" },
    ],
    relatedLessonIds: ["menstrual-cramps", "period-medicines", "exercise-period"],
  },
  {
    id: "understanding-pms",
    category: "symptoms",
    readTime: "5 min",
    featured: false,
    startHere: false,
    title: {
      en: "Understanding Premenstrual Syndrome (PMS)",
      hi: "प्रीमेंस्ट्रुअल सिंड्रोम (PMS) को समझें",
    },
    intro: {
      en: "Premenstrual syndrome encompasses physical and emotional symptoms that occur in the luteal phase and resolve shortly after bleeding starts.",
      hi: "प्रीमेंस्ट्रुअल सिंड्रोम (PMS) शारीरिक और भावनात्मक लक्षणों का एक समूह है जो माहवारी शुरू होने से पहले होता है और रक्तस्राव शुरू होने पर ठीक हो जाता है।",
    },
    whatYouWillLearn: {
      en: [
        "The biological difference between normal premenstrual symptoms, PMS, and PMDD.",
        "How cyclical shifts in estrogen and progesterone interact with brain serotonin.",
        "Core physical symptoms: bloating, breast tenderness, and fatigue.",
        "Evidence-backed lifestyle adjustments to temper premenstrual symptoms.",
      ],
      hi: [
        "सामान्य लक्षणों, PMS और PMDD (गंभीर रूप) के बीच का अंतर।",
        "हार्मोनल बदलाव मस्तिष्क में सेरोटोनिन रसायन को कैसे प्रभावित करते हैं।",
        "मुख्य शारीरिक लक्षण: पेट फूलना, स्तनों में संवेदनशीलता और थकान।",
        "लक्षणों को नियंत्रित करने के लिए वैज्ञानिक जीवनशैली बदलाव।",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Is PMS?",
          hi: "PMS क्या है?",
        },
        body: {
          en: "Up to 75% of menstruating individuals experience at least one premenstrual symptom in the days preceding their period. Clinical PMS is diagnosed when recurring physical, emotional, and behavioral symptoms occur consistently during the luteal phase (the 7 to 10 days before bleeding), interfere with some aspect of daily living, and resolve within a few days of the period starting.",
          hi: "माहवारी वाले लगभग 75% लोगों को माहवारी से पहले कुछ लक्षण महसूस होते हैं। नैदानिक रूप से PMS तब माना जाता है जब ये लक्षण (शारीरिक या भावनात्मक) हर महीने माहवारी से 7-10 दिन पहले आएं, दैनिक जीवन पर असर डालें और रक्तस्राव शुरू होते ही 2-3 दिन में समाप्त हो जाएं।",
        },
      },
      {
        heading: {
          en: "Distinguishing PMS from PMDD",
          hi: "PMS और PMDD में अंतर",
        },
        body: {
          en: "Premenstrual Dysphoric Disorder (PMDD) is a severe, debilitating extension of PMS affecting about 3 to 8% of individuals. Characterized by profound mood swings, severe depressive symptoms, overwhelming anxiety, irritability, and feelings of hopelessness, PMDD requires dedicated psychiatric or gynecological medical management. It is not a character flaw or ordinary moodiness; it is an abnormal neurobiological sensitivity to normal hormonal shifts.",
          hi: "प्रीमेंस्ट्रुअल डिस्फोरिक डिसऑर्डर (PMDD) PMS का एक गंभीर रूप है जो 3 से 8% महिलाओं को प्रभावित करता है। इसमें अत्यधिक अवसाद, चिंता, तीव्र क्रोध और निराशा की भावनाएं होती हैं। PMDD कोई कमजोरी नहीं है बल्कि हार्मोनल बदलावों के प्रति मस्तिष्क की संवेदनशीलता है, जिसके लिए चिकित्सकीय उपचार की आवश्यकता होती है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Progesterone Metabolites and GABA/Serotonin Receptors",
        hi: "प्रोजेस्टेरोन और सेरोटोनिन का संबंध",
      },
      text: {
        en: "In the luteal phase, the corpus luteum produces progesterone, which metabolizes into allopregnanolone. In some individuals, fluctuations in allopregnanolone alter GABA-A receptor sensitivity in the brain, while concurrent declines in estrogen reduce brain serotonin availability, precipitating irritability, emotional vulnerability, and carbohydrate cravings.",
        hi: "ल्यूटियल चरण में प्रोजेस्टेरोन हार्मोन मस्तिष्क के न्यूरोट्रांसमीटर (GABA और सेरोटोनिन) को प्रभावित करता है। सेरोटोनिन घटने से मूड में बदलाव, चिड़चिड़ापन, उदासी और मीठा या कार्बोहाइड्रेट खाने की तीव्र इच्छा होती है।",
      },
    },
    practicalGuidance: {
      en: [
        "Maintain a daily symptom diary across 2 to 3 cycles to pinpoint cyclical patterns.",
        "Eat regular complex carbohydrate meals (oats, brown rice, whole grains) to stabilize serotonin and blood sugar.",
        "Limit excess caffeine and alcohol in the week before your period to decrease anxiety and breast tenderness.",
        "Incorporate 30 minutes of moderate aerobic activity to boost endorphins and reduce fluid retention.",
      ],
      hi: [
        "लक्षणों के चक्र को समझने के लिए 2-3 महीने तक दैनिक डायरी या ऐप में मूड और लक्षण दर्ज करें।",
        "रक्त शर्करा और सेरोटोनिन को स्थिर रखने के लिए साबुत अनाज, दलिया और फल खाएं।",
        "माहवारी से एक सप्ताह पहले कैफीन (कॉफी/चाय) और बहुत अधिक नमक का सेवन कम करें।",
        "शरीर में सूजन कम करने और मन प्रसन्न रखने के लिए प्रतिदिन 30 मिनट टहलें या व्यायाम करें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "PMS is purely psychological or an imaginary exaggeration of emotional reactions.",
          hi: "PMS केवल एक मानसिक वहम या नखरे हैं।",
        },
        fact: {
          en: "PMS is a medically verified neuroendocrine condition rooted in the interaction between fluctuating ovarian hormones and central neurotransmitters.",
          hi: "PMS एक प्रमाणित चिकित्सीय स्थिति है जो अंडाशय के हार्मोन और मस्तिष्क के रसायनों के बीच होने वाले बदलावों से उत्पन्न होती है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Premenstrual mood symptoms cause severe despair, suicidal thoughts, or interfere with personal relationships and employment.",
        "Symptoms do not resolve after menstrual bleeding starts, suggesting an underlying depressive or anxiety disorder.",
        "Severe physical symptoms that do not improve with basic lifestyle and dietary adjustments.",
      ],
      hi: [
        "मनोदशा में इतना गंभीर बदलाव हो कि खुद को नुकसान पहुंचाने के विचार आएं या रिश्ते प्रभावित हों।",
        "माहवारी शुरू होने के बाद भी लक्षण समाप्त न हों (यह डिप्रेशन का संकेत हो सकता है)।",
        "शारीरिक लक्षण इतने गंभीर हों कि सामान्य जीवन जीना मुश्किल हो जाए।",
      ],
    },
    keyTakeaways: {
      en: [
        "PMS is a genuine biological response to luteal-phase hormonal fluctuations impacting brain serotonin.",
        "PMDD is a severe clinical variant requiring medical support and compassionate care.",
        "Dietary stability, sleep hygiene, and symptom tracking form the foundation of management.",
      ],
      hi: [
        "PMS हार्मोनल बदलावों के कारण मस्तिष्क में सेरोटोनिन की कमी से होने वाली जैविक प्रतिक्रिया है।",
        "PMDD इसका गंभीर रूप है जिसमें विशेषज्ञ डॉक्टर की सहायता आवश्यक है।",
        "संतुलित आहार, पूरी नींद और ट्रैकिंग से लक्षणों को काफी हद तक नियंत्रित किया जा सकता है।",
      ],
    },
    sources: [
      { name: "ACOG — Premenstrual Syndrome (PMS)", url: "https://www.acog.org/womens-health/faqs/premenstrual-syndrome-pms" },
      { name: "NHS — Pre-menstrual Syndrome", url: "https://www.nhs.uk/conditions/pre-menstrual-syndrome/" },
      { name: "Royal College of Obstetricians and Gynaecologists (RCOG) — Management of PMDD", url: "https://www.rcog.org.uk" },
    ],
    relatedLessonIds: ["mood-changes-cycle", "emotional-wellbeing-pms", "headaches-bloating"],
  },
  {
    id: "headaches-bloating",
    category: "symptoms",
    readTime: "4 min",
    featured: false,
    startHere: false,
    title: {
      en: "Period-Related Headaches and Bloating",
      hi: "माहवारी में सिरदर्द और पेट फूलना (ब्लोटिंग)",
    },
    intro: {
      en: "Water retention and menstrual migraines stem from the sharp hormonal drops that herald the start of a period.",
      hi: "शरीर में पानी का जमाव और माहवारी का सिरदर्द उस समय होता है जब माहवारी से ठीक पहले हार्मोन तेजी से गिरते हैं।",
    },
    whatYouWillLearn: {
      en: [
        "Why estrogen withdrawal triggers menstrual migraines.",
        "How aldosterone and progesterone cause water retention and abdominal bloating.",
        "Evidence-based strategies to relieve bloating through hydration and electrolyte balance.",
        "When a menstrual headache requires clinical neurology or gynaecology evaluation.",
      ],
      hi: [
        "एस्ट्रोजन में अचानक गिरावट से सिरदर्द (माइग्रेन) क्यों होता है।",
        "प्रोजेस्टेरोन और एल्डोस्टेरोन शरीर में पानी कैसे रोकते हैं जिससे पेट फूलता है।",
        "हाइड्रेशन और इलेक्ट्रोलाइट्स के जरिए पेट फूलने से राहत के उपाय।",
        "सिरदर्द में डॉक्टर से कब परामर्श लेना आवश्यक है।",
      ],
    },
    sections: [
      {
        heading: {
          en: "Menstrual Migraines: Estrogen Withdrawal",
          hi: "माहवारी का माइग्रेन: एस्ट्रोजन में कमी",
        },
        body: {
          en: "Menstrual migraines typically occur in the two days leading up to bleeding and the first three days of the period. As the corpus luteum breaks down, circulating estrogen plummets. This sudden drop triggers neurochemical cascades in the brain, including changes in cranial blood vessel tone and reduced serotonin, leading to throbbing, one-sided headaches often accompanied by light sensitivity or nausea.",
          hi: "माहवारी का सिरदर्द आमतौर पर माहवारी से 2 दिन पहले या शुरुआत के 3 दिनों में होता है। इस समय एस्ट्रोजन हार्मोन अचानक नीचे गिरता है। इससे मस्तिष्क की रक्त वाहिकाओं में खिंचाव आता है और सेरोटोनिन कम होता है, जिससे सिर के एक हिस्से में तेज धड़कन जैसा दर्द, रोशनी से परेशानी या उल्टी जैसा महसूस हो सकता है।",
        },
      },
      {
        heading: {
          en: "Abdominal Bloating and Fluid Retention",
          hi: "पेट फूलना और पानी का जमाव",
        },
        body: {
          en: "Progesterone relaxes smooth muscle tissue throughout the body, including the gastrointestinal tract, slowing intestinal transit and allowing gas to accumulate. Additionally, hormonal shifts activate the renin-angiotensin-aldosterone system, prompting kidneys to temporarily retain sodium and water. This manifests as a sensation of fullness, tight waistbands, and mild puffiness in fingers and feet.",
          hi: "प्रोजेस्टेरोन आंतों की मांसपेशियों को शिथिल कर देता है, जिससे पाचन धीमा हो जाता है और गैस बनती है। साथ ही किडनी थोड़ा अधिक नमक और पानी रोक लेती है, जिससे पेट फूला हुआ और कपड़े तंग महसूस होते हैं। यह स्थिति माहवारी शुरू होने के बाद अपने आप ठीक हो जाती है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Aldosterone Modulation and Trigeminal Activation",
        hi: "एल्डोस्टेरोन और ट्राइजेमिनल तंत्रिका",
      },
      text: {
        en: "Falling estrogen levels trigger release of Calcitonin Gene-Related Peptide (CGRP) around the trigeminal neurovascular complex, dilating meningeal arteries. Concurrently, transient hyperaldosteronism increases extracellular fluid volume by approximately 1 to 2 liters before menses.",
        hi: "एस्ट्रोजन घटने से मस्तिष्क की नसों में CGRP रसायन निकलता है जो धमनियों को फैलाकर माइग्रेन पैदा करता है। साथ ही एल्डोस्टेरोन हार्मोन शरीर में 1-2 लीटर अतिरिक्त तरल जमा कर लेता है, जिससे सूजन आती है।",
      },
    },
    practicalGuidance: {
      en: [
        "Drink plenty of water; adequate hydration paradoxically signals the kidneys to release stored sodium and fluid.",
        "Reduce high-sodium processed foods and snacks during the late luteal phase.",
        "Eat potassium-rich foods (bananas, sweet potatoes, coconut water) to balance cellular sodium levels.",
        "For menstrual migraines, discuss preventative medication or early-onset triptans/NSAIDs with your physician.",
      ],
      hi: [
        "भरपूर पानी पिएं; पर्याप्त पानी पीने से किडनी जमा हुए अतिरिक्त नमक और तरल को बाहर निकालती है।",
        "माहवारी से पहले अधिक नमक वाले डिब्बाबंद और चिप्स जैसे खाद्य पदार्थों से बचें।",
        "पोटेशियम युक्त आहार (केले, शकरकंद, नारियल पानी) लें जो सोडियम को संतुलित करते हैं।",
        "तेज माइग्रेन के लिए डॉक्टर से परामर्श करके उपयुक्त दवा की व्यवस्था रखें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Drinking less water during periods will prevent premenstrual bloating.",
          hi: "माहवारी के समय कम पानी पीने से पेट नहीं फूलेगा।",
        },
        fact: {
          en: "Restricting fluid intake causes your body to conserve water, intensifying fluid retention. Proper hydration encourages natural kidney filtration.",
          hi: "कम पानी पीने से शरीर निर्जलीकरण के डर से पानी रोकने लगता है, जिससे सूजन बढ़ जाती है। भरपूर पानी पीना ही इसका सही उपाय है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Headache accompanied by vision loss, weakness, numbness, or difficulty speaking (requires emergency assessment).",
        "Migraine that resists treatment and severely interferes with work or basic functioning.",
        "Severe, painful abdominal swelling accompanied by vomiting or inability to keep food down.",
      ],
      hi: [
        "सिरदर्द के साथ आंखों के आगे अंधेरा छाना, हाथ-पैर में कमजोरी या बोलने में परेशानी (तुरंत आपातकालीन जांच आवश्यक)।",
        "सिरदर्द जो किसी दवा से ठीक न हो और रोज़मर्रा के काम ठप कर दे।",
        "पेट में अत्यधिक दर्दनाक सूजन जिसके साथ लगातार उल्टियां हो रही हों।",
      ],
    },
    keyTakeaways: {
      en: [
        "Menstrual headaches are primarily triggered by estrogen withdrawal affecting cranial blood vessels.",
        "Bloating results from temporary water retention and slower digestion under progesterone influence.",
        "Hydration, dietary potassium, and prompt early treatment provide the most reliable relief.",
      ],
      hi: [
        "माहवारी का सिरदर्द एस्ट्रोजन के अचानक घटने के कारण नसों में खिंचाव से होता है।",
        "पेट फूलना प्रोजेस्टेरोन के प्रभाव से पाचन धीमा होने और पानी रुकने से होता है।",
        "भरपूर पानी, पोटेशियम युक्त भोजन और समय पर आराम सबसे प्रभावी उपाय हैं।",
      ],
    },
    sources: [
      { name: "NHS — Menstrual Migraines", url: "https://www.nhs.uk/conditions/hormone-headaches/" },
      { name: "ACOG — Headaches and Women's Hormones", url: "https://www.acog.org" },
      { name: "The Migraine Trust — Hormones and Menstruation", url: "https://migrainetrust.org" },
    ],
    relatedLessonIds: ["understanding-pms", "hydration-wellbeing", "period-medicines"],
  },
  {
    id: "period-fatigue",
    category: "symptoms",
    readTime: "4 min",
    featured: false,
    startHere: false,
    title: {
      en: "Fatigue During Menstruation: Causes and Management",
      hi: "माहवारी के दौरान अत्यधिक थकान: कारण और समाधान",
    },
    intro: {
      en: "Feeling drained or physically exhausted before and during bleeding is common, stemming from metabolic shifts, blood loss, and hormonal dips.",
      hi: "माहवारी से पहले और उसके दौरान अत्यधिक सुस्ती या थकावट महसूस होना सामान्य है, जो हार्मोनल बदलाव और रक्तस्राव से जुड़ा है।",
    },
    whatYouWillLearn: {
      en: [
        "The metabolic cost of menstruation and basal temperature changes.",
        "How blood loss impacts iron stores and cellular energy production.",
        "The difference between normal period fatigue and iron-deficiency anemia.",
        "Practical ways to honor your body's energy cycle without feeling guilty.",
      ],
      hi: [
        "माहवारी के दौरान शरीर की ऊर्जा खपत और तापमान में बदलाव।",
        "खून की कमी से शरीर में आयरन और ऊर्जा का स्तर कैसे घटता है।",
        "सामान्य थकान और एनीमिया (खून की कमी) के लक्षणों में अंतर।",
        "माहवारी के दौरान ऊर्जा बनाए रखने और आराम करने के व्यावहारिक तरीके।",
      ],
    },
    sections: [
      {
        heading: {
          en: "Why Do You Feel So Tired?",
          hi: "माहवारी में इतनी थकान क्यों होती है?",
        },
        body: {
          en: "Fatigue during menstruation is driven by several converging biological factors. First, estrogen and progesterone plummet to their lowest levels, which can temporarily reduce alertness and dopamine availability. Second, your body expends metabolic energy generating prostaglandins, contracting the uterus, and shedding the endometrium. Third, blood loss directly reduces circulating red blood cells, which carry oxygen to muscles and brain tissue.",
          hi: "माहवारी में थकान के कई जैविक कारण हैं। पहला, एस्ट्रोजन और प्रोजेस्टेरोन दोनों सबसे निचले स्तर पर होते हैं जिससे ऊर्जा कम महसूस होती है। दूसरा, गर्भाशय की परत निकालने में शरीर अतिरिक्त ऊर्जा खर्च करता है। तीसरा, रक्तस्राव के साथ लाल रक्त कोशिकाएं निकलती हैं, जो पूरे शरीर और मस्तिष्क तक ऑक्सीजन पहुंचाती हैं।",
        },
      },
      {
        heading: {
          en: "Fatigue vs. Anemia",
          hi: "सामान्य थकान बनाम एनीमिया",
        },
        body: {
          en: "While mild fatigue that improves after a night of rest or after the heaviest days of bleeding is normal, persistent exhaustion may signal iron-deficiency anemia. Heavy bleeding (menorrhagia) depletes ferritin (the body's stored iron). Without adequate iron, hemoglobin levels drop, leading to shortness of breath with mild exertion, dizziness when standing, cold extremities, and pale inner eyelids.",
          hi: "हल्की थकान जो आराम करने से ठीक हो जाए सामान्य है। लेकिन यदि हर समय अत्यधिक कमजोरी बनी रहे, तो यह खून की कमी (एनीमिया) हो सकती है। भारी रक्तस्राव से शरीर में आयरन की कमी हो जाती है, जिससे थोड़ा चलने पर सांस फूलना, चक्कर आना, हाथ-पैर ठंडे रहना और आंखों के अंदर पीलापन दिखता है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Mitochondrial ATP Production and Hemoglobin Saturation",
        hi: "माइटोकॉन्ड्रियल ऊर्जा और हीमोग्लोबिन",
      },
      text: {
        en: "Iron is a critical cofactor in the electron transport chain inside mitochondria, where adenosine triphosphate (ATP)—cellular energy—is synthesized. When menstrual blood loss outpaces dietary iron absorption, cellular oxygenation and ATP synthesis decrease, creating a physiological sensation of systemic fatigue.",
        hi: "कोशिकाओं में ऊर्जा (ATP) बनाने के लिए आयरन अनिवार्य है। जब माहवारी में खून अधिक निकलता है और आहार से पर्याप्त आयरन नहीं मिलता, तो कोशिकाओं तक ऑक्सीजन कम पहुंचती है और शरीर पूरी तरह थक जाता है।",
      },
    },
    practicalGuidance: {
      en: [
        "Prioritize 8 hours of sleep and incorporate short 20-minute restorative rests during heavy flow days.",
        "Consume iron-rich foods (lentils, spinach, jaggery, eggs, lean meats) paired with vitamin C (citrus, tomatoes) for optimal absorption.",
        "Engage in gentle restorative movement rather than intense cardiovascular training.",
        "Avoid scheduling demanding physical tests or heavy manual projects on Day 1 and Day 2 if possible.",
      ],
      hi: [
        "रात में कम से कम 8 घंटे की नींद लें और भारी बहाव के दिनों में दिन में 20 मिनट का विश्राम करें।",
        "आयरन युक्त चीजें (दालें, पालक, गुड़, अनार, अंडे) खाएं और साथ में नींबू या संतरा लें ताकि आयरन ठीक से पच सके।",
        "कठिन कसरत के बजाय हल्की सैर या योग करें।",
        "यदि संभव हो तो माहवारी के पहले दो दिनों में बहुत भारी काम न रखें और शरीर को विश्राम दें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Feeling exhausted during periods is a sign of laziness or poor physical fitness.",
          hi: "माहवारी में थकान महसूस होना आलस्य या कमजोरी की निशानी है।",
        },
        fact: {
          en: "Period fatigue is a measurable biological response to rapid endocrine withdrawal, systemic prostaglandin activity, and acute blood volume loss.",
          hi: "माहवारी की थकान एक स्वाभाविक जैविक प्रतिक्रिया है जो हार्मोन में गिरावट और रक्तस्राव के कारण होती है, यह कोई आलस्य नहीं है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Fatigue is so severe that you cannot get out of bed or complete ordinary tasks.",
        "Exhaustion is accompanied by dizziness, heart palpitations, or shortness of breath.",
        "Periods are very heavy (soaking through a pad every hour or large clots larger than a coin).",
      ],
      hi: [
        "थकान इतनी अधिक हो कि बिस्तर से उठना या रोज के काम करना भी असंभव लगे।",
        "थकान के साथ चक्कर आएं, दिल की धड़कन तेज हो या सांस फूले।",
        "माहवारी में बहुत अधिक खून बहता हो (हर घंटे पैड बदलना पड़े या बड़े थक्के निकलें)।",
      ],
    },
    keyTakeaways: {
      en: [
        "Metabolic energy demands and hormonal baselines naturally decrease stamina during menstruation.",
        "Replenishing iron through nutrition is essential to sustain cellular energy.",
        "Severe, persistent exhaustion warrants a simple blood test (CBC and ferritin) to check for anemia.",
      ],
      hi: [
        "माहवारी के दिनों में हार्मोन घटने और रक्तस्राव से शरीर की ऊर्जा कम होना स्वाभाविक है।",
        "आयरन युक्त पौष्टिक भोजन शरीर की कोशिकाओं को दोबारा ऊर्जावान बनाता है।",
        "लगातार कमजोरी बनी रहे तो डॉक्टर से मिलकर हीमोग्लोबिन (CBC) की जांच कराएं।",
      ],
    },
    sources: [
      { name: "NHS — Tiredness and Fatigue Causes", url: "https://www.nhs.uk/conditions/tiredness-and-fatigue/" },
      { name: "WHO — Anaemia Fact Sheet", url: "https://www.who.int/news-room/fact-sheets/detail/anaemia" },
      { name: "ACOG — Heavy Menstrual Bleeding", url: "https://www.acog.org" },
    ],
    relatedLessonIds: ["iron-menstrual-health", "heavy-menstrual-bleeding", "sleep-energy-cycle"],
  },
  {
    id: "menstrual-acne",
    category: "symptoms",
    readTime: "4 min",
    featured: false,
    startHere: false,
    title: {
      en: "Menstrual Changes and Acne",
      hi: "माहवारी और मुंहासे (हार्मोनल एक्ने)",
    },
    intro: {
      en: "Breakouts that flare up around the chin and jawline in the week before your period are driven by changing ratios of progesterone and androgens.",
      hi: "माहवारी से एक सप्ताह पहले ठोड़ी और जबड़े के आसपास होने वाले मुंहासे हार्मोनल असंतुलन और सीबम के कारण होते हैं।",
    },
    whatYouWillLearn: {
      en: [
        "How hormonal shifts stimulate sebaceous glands to produce excess sebum.",
        "Why breakouts concentrate along the lower third of the face (jawline and chin).",
        "Gentle, evidence-based skincare routines that avoid barrier damage.",
        "When persistent adult acne requires evaluation for PCOS or endocrine disorders.",
      ],
      hi: [
        "हार्मोन में बदलाव से त्वचा की ग्रंथियां अधिक तेल (सीबम) क्यों बनाती हैं।",
        "मुंहासे मुख्य रूप से चेहरे के निचले हिस्से (ठोड़ी और जबड़े) पर ही क्यों होते हैं।",
        "त्वचा को नुकसान पहुंचाए बिना मुंहासों से निपटने के वैज्ञानिक तरीके।",
        "लगातार मुंहासे होने पर PCOS या अन्य हार्मोनल जांच कब करानी चाहिए।",
      ],
    },
    sections: [
      {
        heading: {
          en: "The Hormonal Root of Cyclical Breakouts",
          hi: "माहवारी में मुंहासों का हार्मोनल कारण",
        },
        body: {
          en: "Midway through the luteal phase, progesterone rises and peaks, then drops sharply alongside estrogen just before bleeding. During this window, relative androgen levels (like testosterone) are proportionally higher. Androgens bind to receptors in sebaceous (oil) glands, signaling them to produce more thick sebum. At the same time, progesterone causes slight skin swelling, constricting pore openings and trapping sebum and Cutibacterium acnes bacteria inside.",
          hi: "माहवारी से पहले जब एस्ट्रोजन कम होता है, तो शरीर में एंड्रोजन (पुरुष हार्मोन) का सापेक्ष अनुपात बढ़ जाता है। एंड्रोजन त्वचा की तैलीय ग्रंथियों को अधिक तेल बनाने का संकेत देते हैं। साथ ही रोमछिद्र संकुचित हो जाते हैं, जिससे तेल और बैक्टीरिया अंदर फंस जाते हैं और ठोड़ी व जबड़े पर लाल, दर्दनाक मुंहासे बन जाते हैं।",
        },
      },
      {
        heading: {
          en: "Evidence-Based Skincare for Menstrual Acne",
          hi: "हार्मोनल मुंहासों के लिए सही त्वचा देखभाल",
        },
        body: {
          en: "Harsh scrubbing and alcohol-based toners strip the natural lipid barrier, triggering rebound oil production and worse inflammation. Instead, dermatologists recommend gentle cleansers, salicylic acid (BHA) to exfoliate within pore linings, and non-comedogenic moisturizers. For persistent cyclical cystic acne, topical retinoids or medical hormonal therapies may be prescribed by a dermatologist.",
          hi: "चेहरे को जोर से रगड़ना या तेज साबुन लगाना त्वचा की सुरक्षात्मक परत को नष्ट कर देता है, जिससे तेल और अधिक बनता है। इसके बजाय हल्के क्लीन्ज़र, सैलिसिलिक एसिड युक्त फेसवॉश और नॉन-कॉमेडोजेनिक (हल्का) मॉइस्चराइज़र लगाएं। मुंहासों को कभी भी दबाएं या फोड़ें नहीं।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Sebocyte Androgen Receptors and Follicular Hyperkeratinization",
        hi: "एंड्रोजन रिसेप्टर्स और रोमछिद्रों का बंद होना",
      },
      text: {
        en: "5-alpha reductase enzyme in sebocytes converts testosterone into dihydrotestosterone (DHT), which has high affinity for androgen receptors. DHT stimulates sebocyte proliferation and lipid synthesis, while microcomedones form due to delayed desquamation of follicular epithelial cells.",
        hi: "त्वचा की ग्रंथियों में टेस्टोस्टेरोन DHT में बदलता है, जो तेल उत्पादन को कई गुना बढ़ा देता है। इसके साथ मृत त्वचा कोशिकाओं का जमाव रोमछिद्रों को बंद कर देता है, जिससे सूजन और दाने बनते हैं।",
      },
    },
    practicalGuidance: {
      en: [
        "Wash your face twice daily with a gentle, non-stripping pH-balanced cleanser.",
        "Introduce a 1–2% salicylic acid wash or serum 7 to 10 days before your period to keep pores clear.",
        "Avoid picking, squeezing, or popping lesions, which introduces bacteria and causes post-inflammatory hyperpigmentation.",
        "Change pillowcases regularly and clean your phone screen to minimize external bacterial contact.",
      ],
      hi: [
        "दिन में दो बार हल्के और सौम्य क्लीन्ज़र से चेहरा धोएं।",
        "माहवारी से 7-10 दिन पहले सैलिसिलिक एसिड युक्त उत्पाद का इस्तेमाल करें ताकि रोमछिद्र साफ रहें।",
        "मुंहासों को कभी भी फोड़ें या दबाएं नहीं, इससे दाग-धब्बे और संक्रमण बढ़ जाता है।",
        "तकिए के कवर साफ रखें और फोन की स्क्रीन को नियमित रूप से पोंछें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Acne is caused by poor hygiene and washing your face multiple times a day will cure it.",
          hi: "मुंहासे केवल गंदगी से होते हैं और दिन में बार-बार चेहरा धोने से ठीक हो जाते हैं।",
        },
        fact: {
          en: "Hormonal acne originates deep within the pore from androgen-stimulated sebaceous activity; excessive washing damages the skin barrier and worsens inflammation.",
          hi: "हार्मोनल मुंहासे अंदरूनी हार्मोनल बदलावों से होते हैं, अत्यधिक चेहरा धोने से त्वचा रूखी होकर और अधिक तेल बनाने लगती है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Severe, painful cystic acne that leaves permanent pitted scarring.",
        "Acne accompanied by irregular periods, excess facial or body hair (hirsutism), or scalp hair thinning (possible signs of PCOS).",
        "Over-the-counter skincare fails to improve breakouts after 8 to 12 weeks of consistent use.",
      ],
      hi: [
        "गंभीर और गहरे गांठदार मुंहासे जो चेहरे पर स्थायी गड्ढे या निशान छोड़ रहे हों।",
        "मुंहासों के साथ माहवारी की अनियमितता, चेहरे पर अनचाहे बाल या सिर के बालों का झड़ना (PCOS का संकेत हो सकता है)।",
        "साधारण उपायों से 2-3 महीने तक कोई सुधार न दिख रहा हो।",
      ],
    },
    keyTakeaways: {
      en: [
        "Pre-period acne is driven by androgen-to-estrogen balance and progesterone-induced pore constriction.",
        "Gentle pore-clearing ingredients like salicylic acid are far more effective than harsh scrubbing.",
        "Co-occurring irregular cycles and acne warrant a PCOS evaluation by a gynecologist or dermatologist.",
      ],
      hi: [
        "माहवारी से पहले के मुंहासे एंड्रोजन हार्मोन के प्रभाव और रोमछिद्रों के बंद होने से होते हैं।",
        "कठोर स्क्रब के बजाय सौम्य सैलिसिलिक एसिड और हल्की देखभाल अधिक असरदार है।",
        "अनियमित माहवारी के साथ मुंहासे हों तो डॉक्टर से PCOS की जांच कराएं।",
      ],
    },
    sources: [
      { name: "ACOG — Skin Conditions and Hormones", url: "https://www.acog.org" },
      { name: "NHS — Acne Overview and Treatments", url: "https://www.nhs.uk/conditions/acne/" },
      { name: "British Association of Dermatologists — Acne Guidelines", url: "https://www.bad.org.uk" },
    ],
    relatedLessonIds: ["understanding-pcos", "understanding-pms", "period-nutrition"],
  },
];

/**
 * Hormones and Menstrual Conditions Educational Lessons
 * Grounded in ACOG, NHS, and Rotterdam Diagnostic Consensus.
 */
export const CONDITIONS_LESSONS = [
  {
    id: "understanding-pcos",
    category: "conditions",
    readTime: "5 min",
    featured: true,
    startHere: false,
    title: {
      en: "Understanding Polycystic Ovary Syndrome (PCOS)",
      hi: "पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS) को समझें",
    },
    intro: {
      en: "PCOS is the most prevalent endocrine and metabolic condition affecting reproductive-aged women, characterized by hormonal imbalances, irregular cycles, and metabolic factors.",
      hi: "PCOS महिलाओं में सबसे आम हार्मोनल और मेटाबॉलिक स्थिति है, जिसमें हार्मोन का असंतुलन, अनियमित माहवारी और चयापचय संबंधी समस्याएं शामिल हैं।",
    },
    whatYouWillLearn: {
      en: [
        "The Rotterdam diagnostic criteria used by clinicians to diagnose PCOS.",
        "Why 'cysts' in PCOS are actually harmless, underdeveloped immature follicles.",
        "The interplay between insulin resistance and excess ovarian androgen production.",
        "Comprehensive lifestyle and medical strategies to restore ovulatory health.",
      ],
      hi: [
        "डॉक्टरों द्वारा PCOS की पहचान के लिए इस्तेमाल किए जाने वाले रॉटरडैम मानक (Rotterdam Criteria)।",
        "PCOS में दिखने वाली 'सिस्ट' वास्तव में हानिकारक गांठें नहीं बल्कि छोटे अपरिपक्व फॉलिकल्स हैं।",
        "इंसुलिन प्रतिरोध (इंसुलिन रेजिस्टेंस) और एंड्रोजन हार्मोन बढ़ने का संबंध।",
        "माहवारी को नियमित करने के लिए जीवनशैली, खान-पान और चिकित्सकीय उपाय।",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Is PCOS and How Is It Diagnosed?",
          hi: "PCOS क्या है और इसकी जांच कैसे होती है?",
        },
        body: {
          en: "Under the international Rotterdam Criteria, a diagnosis of PCOS requires meeting at least two of the following three features, after ruling out other causes: 1) Irregular, infrequent, or absent ovulation (manifesting as cycles longer than 35 days); 2) Clinical or biochemical signs of elevated androgens (such as persistent acne, excess facial/body hair, or elevated serum testosterone); and 3) Polycystic ovarian morphology on an ultrasound (showing 20 or more small follicles arranged around the periphery).",
          hi: "अंतरराष्ट्रीय मानकों के अनुसार, अन्य बीमारियों को खारिज करने के बाद निम्नलिखित 3 में से कम से कम 2 लक्षण होने पर PCOS का निदान किया जाता है: 1) अनियमित या देरी से माहवारी आना (35 दिन से लंबा चक्र); 2) एंड्रोजन हार्मोन बढ़ने के लक्षण (मुंहासे, चेहरे पर अनचाहे बाल, या टेस्ट में बढ़ा हुआ टेस्टोस्टेरोन); 3) अल्ट्रासाउंड में अंडाशय में कई छोटे-छोटे फॉलिकल्स दिखना।",
        },
      },
      {
        heading: {
          en: "The Role of Insulin Resistance",
          hi: "इंसुलिन प्रतिरोध (इंसुलिन रेजिस्टेंस) की भूमिका",
        },
        body: {
          en: "Approximately 70% of people with PCOS have underlying insulin resistance, irrespective of body mass index. When cells become less responsive to insulin, the pancreas produces compensatory high levels of circulating insulin (hyperinsulinemia). Excess insulin directly stimulates the ovarian theca cells to secrete surplus testosterone, while also suppressing liver production of Sex Hormone-Binding Globulin (SHBG), leaving more free testosterone in the bloodstream.",
          hi: "PCOS वाली लगभग 70% महिलाओं में इंसुलिन रेजिस्टेंस पाया जाता है। जब कोशिकाएं इंसुलिन का ठीक से उपयोग नहीं कर पातीं, तो शरीर अधिक इंसुलिन बनाता है। यह अतिरिक्त इंसुलिन अंडाशय को टेस्टोस्टेरोन (पुरुष हार्मोन) बनाने के लिए उत्तेजित करता है, जिससे ओव्यूलेशन रुक जाता है और माहवारी अनियमित हो जाती है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "LH/FSH Ratio Disruption and Theca Cell Hyperplasia",
        hi: "LH और FSH का असंतुलन",
      },
      text: {
        en: "Accelerated GnRH pulse frequency favors pituitary LH secretion over FSH. Elevated LH, combined with hyperinsulinemia, drives ovarian theca cells to overproduce androstenedione and testosterone. Relative FSH deficiency prevents aromatase activation in granulosa cells, arresting follicle maturation before ovulation.",
        hi: "मस्तिष्क से निकलने वाले सिग्नलों में गड़बड़ी के कारण LH हार्मोन FSH की तुलना में बहुत बढ़ जाता है। इससे अंडाशय में अंडे पूरी तरह परिपक्व होकर बाहर नहीं निकल पाते और छोटे फॉलिकल्स के रूप में अंडाशय में ही रह जाते हैं।",
      },
    },
    practicalGuidance: {
      en: [
        "Adopt a balanced low-glycemic dietary approach emphasizing fiber, protein, and unrefined grains to minimize insulin spikes.",
        "Engage in combined resistance training (strength exercises) and cardiovascular movement to increase cellular insulin sensitivity.",
        "Work with an endocrinologist or gynecologist; treatments may include inositol, metformin, or cyclic progestins to protect the endometrial lining.",
        "Ensure at least one period every 3 months to prevent endometrial hyperplasia (abnormal thickening of the uterine lining).",
      ],
      hi: [
        "रक्त में इंसुलिन को नियंत्रित रखने के लिए फाइबर, प्रोटीन और साबुत अनाज युक्त आहार लें।",
        "मांसपेशियों को मजबूत करने वाली कसरत और पैदल चलना इंसुलिन संवेदनशीलता को बहुत सुधारता है।",
        "स्त्री रोग विशेषज्ञ से परामर्श लें; वे गर्भाशय की सुरक्षा के लिए उपयुक्त दवाएं दे सकते हैं।",
        "यह सुनिश्चित करना जरूरी है कि कम से कम 3 महीने में एक बार माहवारी जरूर आए, ताकि गर्भाशय की परत सुरक्षित रहे।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Having PCOS means you are permanently infertile and will never be able to have children.",
          hi: "PCOS होने का मतलब है कि महिला कभी मां नहीं बन सकती।",
        },
        fact: {
          en: "PCOS causes subfertility due to irregular ovulation, not permanent infertility. With lifestyle management, ovulatory medications, or reproductive assistance, most individuals with PCOS can successfully conceive.",
          hi: "PCOS केवल ओव्यूलेशन में देरी या अनियमितता पैदा करता है, बांझपन नहीं। सही जीवनशैली और डॉक्टरी सलाह से अधिकांश महिलाएं सामान्य रूप से गर्भधारण कर सकती हैं।",
        },
      },
      {
        myth: {
          en: "PCOS only affects people who are overweight.",
          hi: "PCOS केवल अधिक वजन वाली महिलाओं को ही होता है।",
        },
        fact: {
          en: "'Lean PCOS' affects many individuals with normal or low body mass index who still experience insulin resistance, hormonal disruptions, and irregular cycles.",
          hi: "सामान्य या कम वजन वाली महिलाओं में भी 'लीन PCOS' हो सकता है, जिसमें अंदरूनी इंसुलिन और हार्मोनल असंतुलन होता है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Periods occur less than 9 times a year or stop completely for more than 90 days.",
        "Rapid onset of excess coarse hair growth on the chin, chest, or abdomen (hirsutism).",
        "Severe cystic acne unresponsive to standard dermatological therapies.",
      ],
      hi: [
        "साल में 9 से कम बार माहवारी आना या लगातार 3 महीने तक बिल्कुल न आना।",
        "चेहरे, ठोड़ी या छाती पर अचानक मोटे और काले अनचाहे बाल उगना।",
        "गंभीर मुंहासे जो साधारण त्वचा की क्रीमों से ठीक न हो रहे हों।",
      ],
    },
    keyTakeaways: {
      en: [
        "PCOS is a common endocrine condition diagnosed via cycle irregularities, androgen markers, and ovarian ultrasound.",
        "Insulin resistance is a central driver, making dietary stability and muscle-building exercise primary therapies.",
        "Protecting the endometrial lining from prolonged unopposed estrogen is critical.",
      ],
      hi: [
        "PCOS एक सामान्य हार्मोनल स्थिति है जिसे माहवारी के समय, लक्षणों और अल्ट्रासाउंड से पहचाना जाता है।",
        "इंसुलिन को नियंत्रित करना इसके उपचार का मुख्य आधार है, जिसमें संतुलित भोजन और व्यायाम बहुत मदद करते हैं।",
        "माहवारी को 3 महीने से अधिक न रुकने देना गर्भाशय के स्वास्थ्य के लिए अत्यंत आवश्यक है।",
      ],
    },
    sources: [
      { name: "NHS — Polycystic Ovary Syndrome (PCOS)", url: "https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/" },
      { name: "ACOG — Polycystic Ovary Syndrome", url: "https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos" },
      { name: "International Evidence-Based Guideline for the Assessment and Management of PCOS", url: "https://www.monash.edu" },
    ],
    relatedLessonIds: ["irregular-periods", "missed-periods", "menstrual-acne"],
  },
  {
    id: "understanding-endometriosis",
    category: "conditions",
    readTime: "5 min",
    featured: false,
    startHere: false,
    title: {
      en: "Understanding Endometriosis",
      hi: "एंडोमेट्रियोसिस को समझें",
    },
    intro: {
      en: "Endometriosis is a chronic inflammatory condition where tissue similar to the lining of the uterus grows outside the uterus, causing pelvic pain and adhesions.",
      hi: "एंडोमेट्रियोसिस एक सूजन संबंधी बीमारी है जिसमें गर्भाशय की परत जैसा ऊतक गर्भाशय के बाहर (अंडाशय, आंतों आदि पर) बढ़ने लगता है, जिससे तेज दर्द होता है।",
    },
    whatYouWillLearn: {
      en: [
        "What endometrial-like lesions are and where they typically implant.",
        "Why ectopic tissue bleeds and inflames surrounding pelvic peritoneum each month.",
        "Classic symptoms: severe dysmenorrhea, dyspareunia, and chronic pelvic pain.",
        "The diagnostic pathway and contemporary multimodal treatment options.",
      ],
      hi: [
        "एंडोमेट्रियोसिस के घाव क्या होते हैं और वे शरीर में कहां-कहां विकसित हो सकते हैं।",
        "माहवारी के समय यह बाहर मौजूद ऊतक क्यों सूज जाता है और दर्द पैदा करता है।",
        "मुख्य लक्षण: असहनीय ऐंठन, संबंध बनाने में दर्द और कमर व पेट का पुराना दर्द।",
        "इसकी जांच के तरीके और आधुनिक चिकित्सीय उपचार।",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Happens in Endometriosis?",
          hi: "एंडोमेट्रियोसिस में शरीर में क्या होता है?",
        },
        body: {
          en: "In endometriosis, tissue histologically similar to the endometrium implants on organs outside the uterus—most frequently on the ovaries, fallopian tubes, the outer uterine surface, bowel, bladder, and pelvic peritoneum. Like the uterine lining, these lesions respond to cyclical estrogen and progesterone: they thicken, break down, and bleed each cycle. Because this internal blood has no exit pathway, it triggers localized inflammation, nerve sensitization, scar tissue, and internal adhesions.",
          hi: "इस स्थिति में गर्भाशय की आंतरिक परत जैसा ऊतक गर्भाशय के बाहर अंडाशय, फैलोपियन ट्यूब, आंतों या मूत्राशय पर चिपक जाता है। हर महीने माहवारी के दौरान यह बाहरी ऊतक भी हार्मोनों के प्रभाव से फूलता है और इसमें से खून निकलता है। चूंकि इस खून के बाहर निकलने का कोई रास्ता नहीं होता, इसलिए यह अंदर ही सूजन, जलन और अंगों को आपस में चिपकाने वाले घाव (Adhesions) बना देता है।",
        },
      },
      {
        heading: {
          en: "Recognizing the Hallmark Symptoms",
          hi: "मुख्य लक्षणों की पहचान",
        },
        body: {
          en: "While mild menstrual cramps are common, endometriosis is characterized by severe pelvic pain that does not resolve with standard painkillers, pain during or after sexual intercourse (dyspareunia), painful bowel movements or urination especially during bleeding, and deep lower back and leg aching. Pain can also occur mid-cycle during ovulation and progress into chronic non-menstrual pelvic pain.",
          hi: "साधारण माहवारी के दर्द के विपरीत, एंडोमेट्रियोसिस का दर्द अत्यधिक तीव्र होता है जो साधारण दवाओं से ठीक नहीं होता। संबंध बनाने के दौरान या बाद में तेज दर्द, माहवारी के समय शौच या पेशाब करने में अत्यधिक चुभन, और कमर से नीचे पैरों तक जाने वाला दर्द इसके प्रमुख लक्षण हैं।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Neuroangiogenesis, Peritoneal Inflammation, and Prostaglandin Cascades",
        hi: "नसों का फैलाव और सूजन संबंधी रसायन",
      },
      text: {
        en: "Endometriotic lesions recruit their own sensory nerve fibers (neuroangiogenesis) and secrete high concentrations of VEGF, TNF-alpha, IL-6, and COX-2-driven PGE2. Over time, persistent nociceptive input causes central sensitization in the spinal cord, amplifying non-menstrual pain perception.",
        hi: "बाहरी घाव अपने चारों ओर नई दर्द-संवेदी नसों और सूजन पैदा करने वाले रसायनों का जाल बना लेते हैं। लगातार दर्द के संकेत जाने से रीढ़ की हड्डी और मस्तिष्क दर्द के प्रति बहुत ज्यादा संवेदनशील हो जाते हैं।",
      },
    },
    practicalGuidance: {
      en: [
        "Keep a detailed pain and symptom diary documenting pain intensity, location, and relationship to cycle days.",
        "Advocate for yourself: do not accept that debilitating pain is 'just what being a woman feels like'.",
        "Consult a specialist gynecologist experienced in endometriosis and minimally invasive laparoscopic surgery.",
        "Incorporate an anti-inflammatory nutritional approach and pelvic floor physical therapy to relax chronic hypertonic pelvic muscles.",
      ],
      hi: [
        "दर्द की गंभीरता, स्थान और माहवारी की तारीखों का एक विस्तृत रिकॉर्ड रखें।",
        "अपनी तकलीफ को खुलकर व्यक्त करें; यह कभी न मानें कि असहनीय दर्द सामान्य बात है।",
        "स्त्री रोग विशेषज्ञ से मिलें जो एंडोमेट्रियोसिस की पहचान और लैप्रोस्कोपी में अनुभवी हों।",
        "सूजन कम करने वाला पौष्टिक आहार लें और पेल्विक फिजियोथेरेपी से जकड़ी हुई मांसपेशियों को आराम दें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Getting pregnant or having a hysterectomy is a guaranteed, permanent cure for endometriosis.",
          hi: "गर्भवती होना या बच्चेदानी निकलवाना (हिस्टेरेक्टॉमी) एंडोमेट्रियोसिस का पक्का और स्थायी इलाज है।",
        },
        fact: {
          en: "Pregnancy may temporarily pause symptoms due to high progesterone, but it is not a cure. Lesions outside the uterus can persist or recur even after a hysterectomy if not completely excised.",
          hi: "गर्भावस्था के दौरान हार्मोन बदलने से दर्द कुछ समय के लिए दब सकता है, लेकिन यह बीमारी का स्थायी इलाज नहीं है। घावों को सही तरीके से निकालना ही मुख्य उपचार है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Period pain causes you to miss school, university, or employment on a regular basis.",
        "Pain during sexual intercourse, bowel movements, or urination.",
        "Unexplained difficulty becoming pregnant after 12 months of unprotected intercourse.",
      ],
      hi: [
        "माहवारी के दर्द के कारण हर महीने स्कूल, कॉलेज या काम से छुट्टी लेनी पड़ती हो।",
        "संबंध बनाने, शौच या पेशाब के समय असहनीय दर्द होना।",
        "एक साल तक प्रयास करने के बावजूद गर्भधारण में कठिनाई आना।",
      ],
    },
    keyTakeaways: {
      en: [
        "Endometriosis involves endometrial-like tissue growing outside the uterus, triggering chronic inflammation and scarring.",
        "Debilitating pain is never normal and warrants a timely, thorough medical investigation.",
        "Management includes medical hormonal suppression, specialist laparoscopic excision, and pelvic physiotherapy.",
      ],
      hi: [
        "एंडोमेट्रियोसिस में गर्भाशय जैसी परत बाहर उगती है, जिससे अंदरूनी सूजन और घाव बनते हैं।",
        "असहनीय दर्द कभी भी सामान्य नहीं होता और इसके लिए सही जांच जरूरी है।",
        "हार्मोनल दवाएं, लैप्रोस्कोपिक सर्जरी और फिजियोथेरेपी इसके प्रभावी उपचार हैं।",
      ],
    },
    sources: [
      { name: "WHO — Endometriosis Fact Sheet", url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis" },
      { name: "NHS — Endometriosis", url: "https://www.nhs.uk/conditions/endometriosis/" },
      { name: "ACOG — Endometriosis Overview and Clinical FAQs", url: "https://www.acog.org" },
    ],
    relatedLessonIds: ["when-pain-needs-doctor", "menstrual-cramps", "questions-for-doctor"],
  },
  {
    id: "thyroid-menstrual-changes",
    category: "conditions",
    readTime: "4 min",
    featured: false,
    startHere: false,
    title: {
      en: "Thyroid Disorders and Menstrual Changes",
      hi: "थायरॉयड समस्याएं और माहवारी में बदलाव",
    },
    intro: {
      en: "The butterfly-shaped thyroid gland sets your metabolic pace; both underactive and overactive thyroids disrupt ovulation and alter menstrual flow.",
      hi: "गले में स्थित थायरॉयड ग्रंथि शरीर के चयापचय (मेटाबॉलिज्म) को नियंत्रित करती है; थायरॉयड का कम या ज्यादा होना माहवारी को सीधे प्रभावित करता है।",
    },
    whatYouWillLearn: {
      en: [
        "How thyroid hormones (T3 and T4) interact with ovarian steroidogenesis.",
        "The menstrual pattern of Hypothyroidism (heavy, prolonged, or frequent bleeding).",
        "The menstrual pattern of Hyperthyroidism (scanty, light, or completely absent periods).",
        "Why a simple TSH blood test is a first-line diagnostic tool for cycle irregularities.",
      ],
      hi: [
        "थायरॉयड हार्मोन (T3 और T4) अंडाशय के कार्यों को कैसे प्रभावित करते हैं।",
        "हाइपोथायरॉयडिज्म (धीमा थायरॉयड) में भारी, लंबे समय तक चलने वाला रक्तस्राव क्यों होता है।",
        "हाइपरथायरॉयडिज्म (तेज थायरॉयड) में बहुत हल्का या बंद रक्तस्राव क्यों होता है।",
        "माहवारी की गड़बड़ी में TSH ब्लड टेस्ट कराना क्यों सबसे पहला कदम है।",
      ],
    },
    sections: [
      {
        heading: {
          en: "Hypothyroidism (Underactive Thyroid) and Heavy Periods",
          hi: "हाइपोथायरॉयडिज्म (अंडरएक्टिव थायरॉयड) और भारी माहवारी",
        },
        body: {
          en: "When the thyroid produces insufficient thyroxine, the pituitary compensates by releasing high amounts of Thyroid-Stimulating Hormone (TSH) and Thyrotropin-Releasing Hormone (TRH). High TRH stimulates prolactin secretion, which blunts GnRH and halts regular ovulation. Without ovulation, the corpus luteum does not form, progesterone is absent, and the endometrium continues to thicken under unopposed estrogen until it sheds erratically as heavy, prolonged, or frequent menstrual bleeding (menorrhagia).",
          hi: "जब थायरॉयड ग्रंथि कम हार्मोन बनाती है (हाइपोथायरॉयडिज्म), तो मस्तिष्क से प्रोलैक्टिन हार्मोन बढ़ सकता है। इससे ओव्यूलेशन रुक जाता है और शरीर में प्रोजेस्टेरोन नहीं बनता। गर्भाशय की परत मोटी होती जाती है और फिर बहुत भारी, लंबे समय तक चलने वाले या बार-बार होने वाले रक्तस्राव के रूप में गिरती है। साथ ही वजन बढ़ना, ठंड लगना और थकान जैसे लक्षण भी होते हैं।",
        },
      },
      {
        heading: {
          en: "Hyperthyroidism (Overactive Thyroid) and Light Periods",
          hi: "हाइपरथायरॉयडिज्म (ओवरएक्टिव थायरॉयड) और हल्की माहवारी",
        },
        body: {
          en: "Conversely, an overactive thyroid secretes excess thyroid hormone, accelerating metabolism and stimulating liver production of Sex Hormone-Binding Globulin (SHBG). Elevated SHBG binds tightly to circulating sex steroids, decreasing biologically active free estrogen. As a result, menstrual bleeding often becomes noticeably lighter (hypomenorrhea), cycles become spaced further apart (oligomenorrhea), or bleeding stops altogether (amenorrhea).",
          hi: "जब थायरॉयड ग्रंथि आवश्यकता से अधिक हार्मोन बनाती है (हाइपरथायरॉयडिज्म), तो शरीर में मेटाबॉलिज्म तेज हो जाता है। इससे रक्त में सक्रिय एस्ट्रोजन कम हो जाता है, जिससे माहवारी बहुत हल्की हो जाती है, देर से आती है या बिल्कुल बंद हो जाती है। इसके साथ धड़कन तेज होना, वजन घटना, पसीना आना और घबराहट के लक्षण दिख सकते हैं।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "TRH-Induced Hyperprolactinemia and SHBG Synthesis",
        hi: "TRH, प्रोलैक्टिन और SHBG का संतुलन",
      },
      text: {
        en: "TRH stimulates lactotroph cells in the anterior pituitary to secrete prolactin, which inhibits kisspeptin and GnRH pulsatility. In hyperthyroidism, high T3/T4 stimulates hepatic SHBG transcription via hepatocyte nuclear factor 4 alpha (HNF-4α), sequestering bioavailable androgens and estrogens.",
        hi: "थायरॉयड की गड़बड़ी मस्तिष्क के उन सिग्नलों को बाधित करती है जो हर महीने अंडा बनाने के लिए जरूरी हैं। साथ ही यह लिवर में प्रोटीनों का संतुलन बदलकर हार्मोनों के असर को कम या ज्यादा कर देती है।",
      },
    },
    practicalGuidance: {
      en: [
        "Request a complete thyroid panel (TSH, Free T3, Free T4, and anti-TPO antibodies) if your cycle changes suddenly.",
        "If prescribed thyroid hormone replacement (e.g., levothyroxine), take it on an empty stomach with plain water at least 30–60 minutes before breakfast.",
        "Avoid taking iron or calcium supplements within 4 hours of your thyroid medication, as they bind to thyroid hormone and inhibit absorption.",
        "Track how cycle duration and flow change as your thyroid markers normalize under clinical care.",
      ],
      hi: [
        "यदि माहवारी अचानक बहुत भारी या हल्की हो जाए, तो डॉक्टर से थायरॉयड प्रोफाइल (TSH, Free T3, Free T4) टेस्ट कराने को कहें।",
        "यदि थायरॉयड की दवा चल रही हो, तो उसे सुबह खाली पेट केवल सादे पानी से नाश्ते से 1 घंटा पहले लें।",
        "थायरॉयड की दवा और आयरन या कैल्शियम की गोलियों के बीच कम से कम 4 घंटे का अंतर रखें।",
        "दवा से थायरॉयड स्तर सामान्य होते ही माहवारी का चक्र भी धीरे-धीरे अपने आप सामान्य हो जाता है।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Thyroid problems are always obvious and always cause immediate drastic weight changes.",
          hi: "थायरॉयड की बीमारी में हमेशा अचानक बहुत ज्यादा वजन बढ़ता या घटता है।",
        },
        fact: {
          en: "Subclinical thyroid disorders frequently present with subtle signs, with menstrual irregularities and mild fatigue being the very first noticeable symptoms.",
          hi: "शुरुआती थायरॉयड में कई बार वजन में कोई बड़ा बदलाव नहीं दिखता; माहवारी में अनियमितता और थकान ही इसका सबसे पहला लक्षण हो सकते हैं।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Periods become unexpectedly very heavy or completely absent for more than 2 months.",
        "Cycle irregularities accompanied by tremors, heat intolerance, unexplained weight shifts, or neck swelling.",
      ],
      hi: [
        "माहवारी अचानक बहुत अधिक भारी हो जाए या 2 महीने से अधिक समय तक न आए।",
        "माहवारी की गड़बड़ी के साथ हाथ कांपना, बहुत ज्यादा गर्मी या ठंड लगना, या गले में सूजन (घेंघा) दिखना।",
      ],
    },
    keyTakeaways: {
      en: [
        "The thyroid gland fundamentally regulates the HPO axis and menstrual rhythm.",
        "Hypothyroidism commonly causes heavy or frequent periods; hyperthyroidism causes light or absent periods.",
        "A routine TSH blood test easily identifies underlying thyroid imbalances.",
      ],
      hi: [
        "थायरॉयड ग्रंथि अंडाशय और माहवारी के तालमेल को सीधे नियंत्रित करती है।",
        "अंडरएक्टिव थायरॉयड में भारी रक्तस्राव और ओवरएक्टिव थायरॉयड में बहुत कम रक्तस्राव होना आम है।",
        "एक साधारण TSH ब्लड टेस्ट से थायरॉयड की जांच आसानी से हो जाती है।",
      ],
    },
    sources: [
      { name: "NHS — Underactive Thyroid (Hypothyroidism)", url: "https://www.nhs.uk/conditions/underactive-thyroid-hypothyroidism/" },
      { name: "NHS — Overactive Thyroid (Hyperthyroidism)", url: "https://www.nhs.uk/conditions/overactive-thyroid-hyperthyroidism/" },
      { name: "ACOG — Thyroid Disease in Women", url: "https://www.acog.org" },
    ],
    relatedLessonIds: ["irregular-periods", "heavy-menstrual-bleeding", "missed-periods"],
  },
  {
    id: "irregular-periods",
    category: "conditions",
    readTime: "4 min",
    featured: false,
    startHere: false,
    title: {
      en: "Understanding Irregular Periods",
      hi: "अनियमित माहवारी को समझें",
    },
    intro: {
      en: "A cycle that consistently arrives earlier than 21 days, later than 35 days, or fluctuates unpredictably month to month warrants systematic evaluation.",
      hi: "यदि माहवारी लगातार 21 दिन से पहले, 35 दिन के बाद आए या हर महीने अनिश्चित बनी रहे, तो उसके कारणों को समझना आवश्यक है।",
    },
    whatYouWillLearn: {
      en: [
        "The clinical definition of menstrual irregularity across different life stages.",
        "Why periods are naturally irregular during puberty and perimenopause.",
        "Common physiological causes: stress, rapid weight changes, PCOS, and thyroid shifts.",
        "When to monitor at home versus when to schedule a clinical appointment.",
      ],
      hi: [
        "उम्र के अलग-अलग पड़ावों पर अनियमित माहवारी की डॉक्टरी परिभाषा।",
        "किशोरावस्था की शुरुआत और मेनोपॉज से पहले माहवारी का स्वाभाविक रूप से अनियमित होना।",
        "मुख्य कारण: तनाव, वजन में अचानक बदलाव, PCOS और थायरॉयड की स्थिति।",
        "कब घर पर ट्रैक करना पर्याप्त है और कब डॉक्टर से मिलना जरूरी है।",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Defines an Irregular Cycle?",
          hi: "अनियमित चक्र किसे कहते हैं?",
        },
        body: {
          en: "In healthy adult women, cycle variation of 2 to 4 days from month to month is entirely normal. Clinical irregularity is defined when the interval between bleeding episodes varies by more than 7 to 9 days consistently, when cycles are consistently shorter than 21 days (polymenorrhea), or when cycles consistently exceed 35 days (oligomenorrhea).",
          hi: "वयस्क महिलाओं में हर महीने 2 से 4 दिन का आगे-पीछे होना बिल्कुल सामान्य है। लेकिन यदि चक्रों के बीच का अंतर लगातार 7 से 9 दिन से अधिक बदलता रहे, माहवारी 21 दिन से पहले आ जाए, या 35 दिन से ज्यादा समय ले, तो उसे चिकित्सकीय रूप से अनियमित माना जाता है।",
        },
      },
      {
        heading: {
          en: "The Normal Irregularity of Life Stages",
          hi: "जीवन के पड़ावों में स्वाभाविक बदलाव",
        },
        body: {
          en: "Menstrual irregularity is physiologically expected at two key transitional life stages. In adolescents (for 1 to 3 years after menarche), the HPO axis is still maturing, resulting in frequent anovulatory cycles. Similarly, in perimenopause (typically late 40s), ovarian follicular depletion causes wide swings in estrogen before periods cease permanently.",
          hi: "जीवन के दो चरणों में अनियमितता स्वाभाविक होती है। पहला, किशोरावस्था में पहली माहवारी के बाद 1 से 3 साल तक, जब मस्तिष्क और अंडाशय का तालमेल पूरी तरह विकसित हो रहा होता है। दूसरा, 45-50 वर्ष की उम्र में मेनोपॉज से पहले (पेरीमेनोपॉज), जब अंडाशय में अंडे कम होने से माहवारी आगे-पीछे होने लगती है।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Anovulatory Follicular Persistence and Breakthrough Bleeding",
        hi: "एनोव्यूलेटरी चक्र और अनिश्चित रक्तस्राव",
      },
      text: {
        en: "When an LH surge fails to trigger ovulation, no corpus luteum forms and no progesterone is produced. Continued estrogen stimulation causes the endometrium to outgrow its blood supply, resulting in patchy, uncoordinated desquamation known as estrogen breakthrough bleeding.",
        hi: "जब किसी चक्र में अंडा नहीं निकलता (Anovulation), तो प्रोजेस्टेरोन हार्मोन नहीं बन पाता। गर्भाशय की परत बिना किसी निश्चित चक्र के असमान रूप से टूटने लगती है, जिससे रक्तस्राव कभी जल्दी, कभी देर से और कभी हल्का या भारी हो जाता है।",
      },
    },
    practicalGuidance: {
      en: [
        "Track cycle start dates, bleeding duration, and flow intensity across at least 3 to 6 consecutive cycles.",
        "Avoid self-prescribing hormonal pills or supplements before obtaining an accurate diagnosis.",
        "Evaluate lifestyle factors: have you experienced acute stress, extreme dieting, or sudden intense workouts?",
        "Bring your cycle tracking log to your healthcare provider for an informed consultation.",
      ],
      hi: [
        "कम से कम 3 से 6 महीने तक माहवारी के शुरू होने की तारीख, दिनों की संख्या और बहाव को डायरी या ऐप में दर्ज करें।",
        "बिना डॉक्टरी सलाह के कोई भी हार्मोनल गोली या सप्लीमेंट खुद से न लें।",
        "अपनी जीवनशैली देखें: क्या हाल ही में बहुत तनाव रहा है, वजन घटा है या बहुत ज्यादा कसरत शुरू की है?",
        "डॉक्टर के पास जाते समय अपना मासिक ट्रैकिंग रिकॉर्ड साथ ले जाएं ताकि वे सही निदान कर सकें।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "An irregular cycle automatically means you have a serious medical disease.",
          hi: "अनियमित माहवारी का मतलब है कि कोई बहुत गंभीर बीमारी हो गई है।",
        },
        fact: {
          en: "Temporary cycle variations are frequently benign responses to sleep disruption, travel, illness, or acute stress, and resolve once balance is restored.",
          hi: "अक्सर नींद की कमी, यात्रा, बुखार या सामान्य तनाव से चक्र कुछ दिनों के लिए बदल जाता है, जो जीवनशैली ठीक होते ही अपने आप सामान्य हो जाता है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "Cycles are consistently shorter than 21 days or longer than 35 days in non-adolescents.",
        "Bleeding occurs between menstrual periods or following sexual intercourse.",
        "Bleeding lasts longer than 7 to 8 consecutive days.",
      ],
      hi: [
        "वयस्कों में चक्र लगातार 21 दिन से छोटा या 35 दिन से लंबा बना रहे।",
        "दो माहवारी के बीच में या संबंध बनाने के बाद रक्तस्राव या धब्बे (स्पॉटिंग) दिखें।",
        "रक्तस्राव लगातार 7-8 दिनों से अधिक समय तक जारी रहे।",
      ],
    },
    keyTakeaways: {
      en: [
        "Minor month-to-month variation is normal; consistent deviation beyond 21–35 days requires investigation.",
        "Adolescence and perimenopause are life stages with physiologically normal irregularity.",
        "Logging cycle dates provides vital clinical evidence for your gynecologist.",
      ],
      hi: [
        "2-4 दिन का अंतर सामान्य है; लेकिन 21 से 35 दिन की सीमा से बाहर जाना जांच का विषय है।",
        "शुरुआती किशोरावस्था और मेनोपॉज के समय कुछ अनियमितता पूरी तरह प्राकृतिक है।",
        "तारीखों का सही रिकॉर्ड डॉक्टर को समस्या की जड़ तक पहुंचने में सबसे ज्यादा मदद करता है।",
      ],
    },
    sources: [
      { name: "NHS — Irregular Periods", url: "https://www.nhs.uk/conditions/irregular-periods/" },
      { name: "ACOG — Abnormal Uterine Bleeding", url: "https://www.acog.org" },
      { name: "WHO — Menstrual Health and Cycle Variations", url: "https://www.who.int" },
    ],
    relatedLessonIds: ["missed-periods", "understanding-pcos", "early-late-periods"],
  },
  {
    id: "missed-periods",
    category: "conditions",
    readTime: "4 min",
    featured: false,
    startHere: false,
    title: {
      en: "Missed Periods and Their Possible Causes",
      hi: "माहवारी का न आना (Missed Period) और इसके कारण",
    },
    intro: {
      en: "Missing a period is a signal from your body; while pregnancy is the most common reason, many hormonal and physiological factors can pause menstruation.",
      hi: "माहवारी न आना शरीर का एक महत्वपूर्ण संकेत है; यद्यपि गर्भावस्था सबसे आम कारण है, लेकिन कई हार्मोनल और शारीरिक कारण भी माहवारी को रोक सकते हैं।",
    },
    whatYouWillLearn: {
      en: [
        "The difference between primary amenorrhea and secondary amenorrhea.",
        "Why pregnancy testing is always the necessary first clinical step.",
        "Functional Hypothalamic Amenorrhea (FHA) driven by energy deficit or stress.",
        "Other endocrine causes: hyperprolactinemia, PCOS, and premature ovarian insufficiency.",
      ],
      hi: [
        "प्राथमिक एमेनोरिया (15 वर्ष तक शुरू न होना) और द्वितीयक एमेनोरिया (आने के बाद बंद होना) में अंतर।",
        "सबसे पहले प्रेग्नेंसी टेस्ट करना क्यों आवश्यक होता है।",
        "ऊर्जा की कमी, डाइटिंग या अत्यधिक तनाव से माहवारी का रुकना (FHA)।",
        "अन्य हार्मोनल कारण: प्रोलैक्टिन बढ़ना, PCOS और थायरॉयड की समस्याएं।",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Is Amenorrhea?",
          hi: "एमेनोरिया क्या है?",
        },
        body: {
          en: "In clinical medicine, the absence of menstrual bleeding is called amenorrhea. Primary amenorrhea refers to the absence of menses by age 15 in the presence of normal secondary sexual characteristics (or by age 13 without breast development). Secondary amenorrhea is defined as the cessation of periods for 3 consecutive months in individuals with previously regular cycles, or for 6 months in those with irregular cycles.",
          hi: "चिकित्सीय भाषा में माहवारी न आने को एमेनोरिया कहते हैं। यदि 15 वर्ष की आयु तक पहली माहवारी शुरू न हो, तो इसे प्राथमिक एमेनोरिया कहते हैं। यदि नियमित माहवारी आने के बाद लगातार 3 महीने तक या अनियमित माहवारी में 6 महीने तक माहवारी न आए, तो इसे द्वितीयक एमेनोरिया कहा जाता है।",
        },
      },
      {
        heading: {
          en: "Common Non-Pregnancy Causes",
          hi: "गर्भावस्था के अलावा अन्य मुख्य कारण",
        },
        body: {
          en: "After pregnancy is ruled out with a sensitive urine or blood hCG test, physicians evaluate several physiological systems: 1) Functional Hypothalamic Amenorrhea, caused by low energy availability (restrictive dieting, eating disorders, or intense athletic training); 2) Polycystic Ovary Syndrome (PCOS); 3) Thyroid dysfunction (hypo- or hyperthyroidism); 4) Hyperprolactinemia (elevated prolactin, often from benign pituitary microadenomas or medications); and 5) Hormonal contraception (IUDs, implants, or continuous pills).",
          hi: "प्रेग्नेंसी टेस्ट नेगेटिव होने के बाद डॉक्टर अन्य कारणों की जांच करते हैं: 1) शरीर में कैलोरी और पोषण की अत्यधिक कमी (कठिन डाइटिंग या अत्यधिक कसरत); 2) PCOS; 3) थायरॉयड विकार; 4) प्रोलैक्टिन हार्मोन का बढ़ जाना; 5) गर्भनिरोधक गोलियां, इंजेक्शन या हार्मोनल कॉपर-टी (IUD) का प्रभाव।",
        },
      },
    ],
    biologicalMechanism: {
      title: {
        en: "Hypothalamic Energy Sensing via Leptin and AMPK",
        hi: "मस्तिष्क में ऊर्जा की पहचान और लेप्टिन हार्मोन",
      },
      text: {
        en: "Low systemic energy availability decreases adipocyte leptin secretion and activates cellular AMP-activated protein kinase (AMPK). Hypothalamic kisspeptin neurons interpret this as insufficient metabolic reserves to support pregnancy, entering an energy-conservation state that halts GnRH pulsatility and menses.",
        hi: "जब शरीर को जरूरत से कम भोजन मिलता है या अत्यधिक ऊर्जा खर्च होती है, तो वसा कोशिकाओं से निकलने वाला लेप्टिन हार्मोन घट जाता है। मस्तिष्क यह समझता है कि शरीर गर्भधारण के लिए तैयार नहीं है, इसलिए वह ऊर्जा बचाने के लिए माहवारी को अस्थायी रूप से रोक देता है।",
      },
    },
    practicalGuidance: {
      en: [
        "Take a reliable home urine pregnancy test first if you have engaged in sexual activity.",
        "Assess whether you have had significant recent weight loss, extreme changes in dietary intake, or high psychological stress.",
        "Schedule a clinical evaluation if you have missed your period for 3 consecutive months.",
        "Do not ignore absent periods; prolonged low estrogen levels can impact bone mineral density and cardiovascular health.",
      ],
      hi: [
        "यदि आप यौन रूप से सक्रिय हैं, तो सबसे पहले घर पर यूरिन प्रेग्नेंसी टेस्ट करें।",
        "देखें कि क्या हाल में वजन बहुत कम हुआ है, खाना बहुत कम खाया है या बहुत ज्यादा मानसिक तनाव रहा है।",
        "यदि लगातार 3 महीने तक माहवारी न आए तो डॉक्टर से अवश्य मिलें।",
        "माहवारी रुकने को नजरअंदाज न करें, क्योंकि लंबे समय तक एस्ट्रोजन कम रहने से हड्डियां कमजोर हो सकती हैं।",
      ],
    },
    commonMisconceptions: [
      {
        myth: {
          en: "Missing a few periods is fine and convenient because you don't have to deal with pads or bleeding.",
          hi: "माहवारी न आना तो अच्छी और सुविधाजनक बात है क्योंकि पैड और दर्द का झंझट नहीं रहता।",
        },
        fact: {
          en: "Menstruation is considered a vital sign of overall health. Missing periods without hormonal contraception reflects an underlying endocrine imbalance that requires medical attention.",
          hi: "माहवारी महिला के संपूर्ण स्वास्थ्य का एक आईना (वाइटल साइन) है। बिना किसी गर्भनिरोधक के माहवारी का रुकना अंदरूनी हार्मोनल गड़बड़ी का संकेत है जिसकी जांच जरूरी है।",
        },
      },
    ],
    whenToSeekDoctor: {
      en: [
        "You have missed periods for 3 consecutive months (or 6 months if previously irregular).",
        "You are 15 years old and have never experienced your first menstrual period.",
        "A missed period is accompanied by milk-like nipple discharge, severe headaches, or vision changes (signs of elevated prolactin).",
      ],
      hi: [
        "लगातार 3 महीने तक माहवारी न आए।",
        "आप 15 वर्ष की हो चुकी हैं और अभी तक पहली माहवारी शुरू नहीं हुई है।",
        "माहवारी रुकने के साथ स्तनों से दूध जैसा स्राव होना, तेज सिरदर्द या आंखों से धुंधला दिखना।",
      ],
    },
    keyTakeaways: {
      en: [
        "Rule out pregnancy first with a clinical or home hCG test.",
        "Amenorrhea can stem from energy deficit, thyroid shifts, PCOS, or elevated prolactin.",
        "Missing periods for 3 months warrants medical investigation to safeguard bone and endocrine health.",
      ],
      hi: [
        "सबसे पहले प्रेग्नेंसी टेस्ट करके स्थिति स्पष्ट करें।",
        "माहवारी का रुकना पोषण की कमी, तनाव, PCOS या थायरॉयड से हो सकता है।",
        "3 महीने तक माहवारी न आने पर हड्डियों और हार्मोनों की सुरक्षा के लिए डॉक्टरी परामर्श आवश्यक है।",
      ],
    },
    sources: [
      { name: "NHS — Stopped or Missed Periods", url: "https://www.nhs.uk/conditions/stopped-or-missed-periods/" },
      { name: "ACOG — Amenorrhea: Absence of Periods", url: "https://www.acog.org" },
      { name: "Endocrine Society Clinical Practice Guidelines on Hypothalamic Amenorrhea", url: "https://www.endocrine.org" },
    ],
    relatedLessonIds: ["irregular-periods", "stress-menstrual-health", "understanding-pcos"],
  },
];

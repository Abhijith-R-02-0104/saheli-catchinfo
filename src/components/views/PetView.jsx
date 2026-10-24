import { useState, useRef, useEffect } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { PetCanvas3D } from "../pet/PetCanvas3D.jsx";

const PET_TYPES = [
  { id: "bunny", labelKey: "petBunny", icon: "🐰", descKey: "Soft & Cuddly Plush Bunny" },
  { id: "kitten", labelKey: "petKitten", icon: "🐱", descKey: "Gentle Purring Companion" },
  { id: "puppy", labelKey: "petPuppy", icon: "🐶", descKey: "Loyal Cheerful Friend" },
  { id: "fox", labelKey: "petFox", icon: "🦊", descKey: "Clever Warm Guardian" },
  { id: "capybara", labelKey: "petCapybara", icon: "🐹", descKey: "Calm Peaceful Soul" },
];

function calculateGrowthStage(hearts) {
  if (hearts >= 30) return "grown";
  if (hearts >= 15) return "growing";
  return "baby";
}

export function PetView() {
  const { appData, updatePetState } = useAppData();
  const { lang, t } = useTranslation();

  const rawPet = appData.petState || {};
  const hearts = Number.isFinite(rawPet.hearts) ? rawPet.hearts : 5;
  const snacks = Number.isFinite(rawPet.snacks) ? rawPet.snacks : 4;
  const isSleeping = Boolean(rawPet.isSleeping);
  const growthStage = rawPet.growthStage || calculateGrowthStage(hearts);
  const petName = rawPet.name || "Chotu";
  const petType = rawPet.petType || "bunny";

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(petName);
  const [currentAction, setCurrentAction] = useState("idle");
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [berryToast, setBerryToast] = useState(null);
  const [milestoneCelebration, setMilestoneCelebration] = useState(null);

  const petTimerRef = useRef(null);
  const lastAffectionTimeRef = useRef(0);
  const lastMessageIndexRef = useRef(-1);

  useEffect(() => {
    return () => {
      if (petTimerRef.current) {
        clearTimeout(petTimerRef.current);
      }
    };
  }, []);

  const [actionFeedback, setActionFeedback] = useState(() =>
    isSleeping
      ? lang === "hi"
        ? `${petName} शांति से मीठी नींद में सो रहा है...`
        : `${petName} is sleeping soundly and dreaming sweet dreams...`
      : t("pet", "calmMessage"),
  );

  const selectedPet = PET_TYPES.find((p) => p.id === petType) || PET_TYPES[0];

  // Progression Milestones
  let stageLabel;
  let nextMilestoneText;
  let progressPercent;

  if (hearts >= 50) {
    stageLabel = t("pet", "grownStage");
    nextMilestoneText =
      lang === "hi"
        ? "पूर्ण स्नेह अवस्था प्राप्त! (50/50 ❤️) आपका साथी हमेशा आपके साथ है।"
        : "Cherished maximum affection reached (50/50 ❤️)!";
    progressPercent = 100;
  } else if (growthStage === "grown") {
    stageLabel = t("pet", "grownStage");
    const diff = Math.max(0, 50 - hearts);
    nextMilestoneText =
      lang === "hi"
        ? `सर्वोच्च प्रेम स्तर के लिए ${diff} और स्नेह की आवश्यकता`
        : `${diff} more affection until complete devotion (50 hearts)`;
    progressPercent = Math.min(100, Math.round(((hearts - 30) / 20) * 100));
  } else if (growthStage === "growing") {
    stageLabel = t("pet", "growingStage");
    const diff = Math.max(0, 30 - hearts);
    nextMilestoneText =
      lang === "hi"
        ? `प्यारे बड़े साथी के लिए ${diff} और स्नेह की आवश्यकता`
        : `${diff} more affection until Cherished stage`;
    progressPercent = Math.min(100, Math.round(((hearts - 15) / 15) * 100));
  } else {
    stageLabel = t("pet", "babyStage");
    const diff = Math.max(0, 15 - hearts);
    nextMilestoneText =
      lang === "hi"
        ? `बढ़ती अवस्था के लिए ${diff} और स्नेह की आवश्यकता`
        : `${diff} more affection until Growing stage`;
    progressPercent = Math.min(100, Math.round((hearts / 15) * 100));
  }

  // Helper for milestone celebratory notifications
  function checkMilestone(prevH, nextH) {
    if (prevH < 15 && nextH >= 15) {
      setMilestoneCelebration({
        stage: "growing",
        title:
          lang === "hi"
            ? "🎉 मील का पत्थर: बढ़ता साथी! (Growing Companion)"
            : "🎉 Milestone: Reached Growing Companion Stage!",
        description:
          lang === "hi"
            ? "आपके साथी ने नए पंख फैलाए हैं और आपका बंधन और मजबूत हो गया है।"
            : "Your companion has grown noticeably and feels your loving care.",
      });
      setTimeout(() => setMilestoneCelebration(null), 4500);
    } else if (prevH < 30 && nextH >= 30) {
      setMilestoneCelebration({
        stage: "grown",
        title:
          lang === "hi"
            ? "👑 मील का पत्थर: प्यारा बड़ा साथी! (Cherished Companion)"
            : "👑 Milestone: Reached Cherished Companion Stage!",
        description:
          lang === "hi"
            ? "सर्वोच्च स्नेह अवस्था! आपका साथी आपके साथ हमेशा सुरक्षित महसूस करता है।"
            : "Deep companion bond! Your friend is fully cherished and content.",
      });
      setTimeout(() => setMilestoneCelebration(null), 4500);
    } else if (prevH < 50 && nextH >= 50) {
      setMilestoneCelebration({
        stage: "max",
        title:
          lang === "hi"
            ? "💖 असीम स्नेह प्राप्त! (50/50)"
            : "💖 Complete Affection Mastery! (50/50)",
        description:
          lang === "hi"
            ? "आपके साथी के पास असीम स्नेह और सुखद शांति है।"
            : "Your companion's heart is completely overflowing with calm and warmth.",
      });
      setTimeout(() => setMilestoneCelebration(null), 4500);
    }
  }

  // Species-specific rich feedback messages with context-sensitive pools
  function getPetMessage(species, name, zone = "head", currentLang = "en") {
    const isHead = zone === "head";

    if (currentLang === "hi") {
      const headPool = [
        `${name} प्यार से आपकी हथेली में सिर सटाता है और स्नेह महसूस करता है! 💗`,
        `${name} ने सिर्फ आपके लिए एक खुशहाल और मीठी झपकी ली! ✨`,
        "थोड़ा सा लाड़ सब कुछ और अधिक सुखद और शांत बना देता है। 🌸",
        "कोई इन प्यार भरे कोमल दुलारों का भरपूर आनंद ले रहा है! 💖",
      ];
      const bodyPool = [
        "हीही, गुदगुदी हो रही है! 💗",
        `${name} खुशी से थोड़ा उछलकर कोमल दुलार का स्वागत करता है! ✨`,
        "कोमल, गर्मजोशी भरा और खुशियों से महकता एहसास। 🌸",
        "प्यारा साथी आपके स्पर्श में पूरी तरह खो गया है! 💖",
      ];

      let speciesHead;
      let speciesBody;
      switch (species) {
        case "capybara":
          speciesHead = `${name} शांत व सौम्य भाव से आंखें मूंदकर आपके पास झुकता है! 🐹`;
          speciesBody = `${name} एक गहरी, सुकून भरी सांस लेता है और आराम से रम जाता है। 🐹🌸`;
          break;
        case "kitten":
          speciesHead = `${name} कोमल म्याऊं और मीठी खरखराहट (purr) के साथ आपके हाथ को छूता है! 🐱`;
          speciesBody = `${name} खुशी से नन्हे पंजे चलाता है और पूंछ लहराता है! 🐱💗`;
          break;
        case "puppy":
          speciesHead = `${name} खुशी से अपने कान पीछे करता है और वफादारी से देखता है! 🐶`;
          speciesBody = `${name} उत्साह से पूंछ हिलाता है और मस्ती में झूम उठता है! 🐶💖`;
          break;
        case "fox":
          speciesHead = `${name} समझदारी से अपने कान झुकाकर गर्मजोशी से दुलार महसूस करता है! 🦊`;
          speciesBody = `${name} एक सुंदर नन्ही छलांग लगाता है और घनी पूंछ से गर्माहट देता है! 🦊✨`;
          break;
        default:
          speciesHead = `${name} अपने लंबे कान फड़फड़ाते हुए प्यार से आपकी हथेली में झुकता है! 🐰`;
          speciesBody = `${name} खुशी से नन्ही छलांग लगाता है और अपनी नाक हिलाता है! 🐰✨`;
          break;
      }

      const pool = isHead
        ? [speciesHead, ...headPool]
        : [speciesBody, ...bodyPool];
      let idx = Math.floor(Math.random() * pool.length);
      if (idx === lastMessageIndexRef.current && pool.length > 1) {
        idx = (idx + 1) % pool.length;
      }
      lastMessageIndexRef.current = idx;
      return pool[idx];
    }

    // English context-sensitive message pools
    const headPool = [
      "Your companion nuzzles your hand with tender warmth. 💗",
      "A happy little blink just for you ✨",
      "A little cuddle makes everything cosier.",
      "Someone is enjoying these gentle pets! 💖",
    ];
    const bodyPool = [
      "Hehe, that tickles! 💗",
      "Gentle tummy tickles bring a cheerful, happy bounce! ✨",
      "Soft, warm, and feeling completely safe and cherished.",
      "A happy little wiggle of pure cozy contentment! 🌸",
    ];

    let speciesHead;
    let speciesBody;
    switch (species) {
      case "capybara":
        speciesHead = `${name} leans in with zen serenity, twitching small shell ears in peaceful bliss! 🐹`;
        speciesBody = `${name} gives a relaxed, cosy sigh as they sink into the gentle stroke. 🐹🌸`;
        break;
      case "kitten":
        speciesHead = `${name} arches into your palm with a soothing purr and slow blink of trust! 🐱`;
        speciesBody = `${name} kneads playfully with tiny paws and swishes its tail in delight! 🐱💗`;
        break;
      case "puppy":
        speciesHead = `${name} tilts its head lovingly, flapping floppy ears with pure devotion! 🐶`;
        speciesBody = `${name} wags its tail at top speed with happy, bouncy puppy wiggles! 🐶💖`;
        break;
      case "fox":
        speciesHead = `${name} tilts pointed ears back in tender trust, enjoying your soft touch! 🦊`;
        speciesBody = `${name} does a graceful little bounce, wrapping its big bushy tail in warmth! 🦊✨`;
        break;
      default:
        speciesHead = `${name} leans in with joyful wiggles, fluttering tall ears with pure delight! 🐰`;
        speciesBody = `${name} does a tiny happy hop, twitching its cute nose with soft tickles! 🐰✨`;
        break;
    }

    const pool = isHead
      ? [speciesHead, ...headPool]
      : [speciesBody, ...bodyPool];
    let idx = Math.floor(Math.random() * pool.length);
    if (idx === lastMessageIndexRef.current && pool.length > 1) {
      idx = (idx + 1) % pool.length;
    }
    lastMessageIndexRef.current = idx;
    return pool[idx];
  }

  function getFeedMessage(species, name) {
    if (lang === "hi") {
      switch (species) {
        case "capybara":
          return `${name} ने शांति से रसीली ताज़ी स्ट्रॉबेरी का आनंद लिया! 🍓`;
        case "kitten":
          return `${name} अपनी मूंछें चाटते हुए स्वादिष्ट नाश्ता खुशी से खाता है! 🍓`;
        case "puppy":
          return `${name} ने स्वादिष्ट बेरी को मजे से चट कर लिया और खुशी से पूंछ हिलाई! 🍓`;
        case "fox":
          return `${name} ने चपलता से स्वादिष्ट मीठी बेरी का आनंद लिया! 🍓`;
        default:
          return `${name} ने स्वादिष्ट ताज़ी स्ट्रॉबेरी को मजे से खाया! 🍓`;
      }
    }
    switch (species) {
      case "capybara":
        return `${name} munches peaceful bites of the fresh berry with a blissful zen expression! 🍓`;
      case "kitten":
        return `${name} licks its whiskers and savors the sweet treat with joyful purrs! 🍓`;
      case "puppy":
        return `${name} gobbles up the delicious berry treat with enthusiastic tail wags! 🍓`;
      case "fox":
        return `${name} crunches the sweet berry with sharp, playful elegance! 🍓`;
      default:
        return `${name} munches happily on a sweet, juicy strawberry! 🍓`;
    }
  }

  function getPlayMessage(species, name) {
    if (lang === "hi") {
      switch (species) {
        case "capybara":
          return `${name} शांति से अपने पंजे से पेस्टल गेंद को कालीन पर लुढ़काता है! 🎾`;
        case "kitten":
          return `${name} चपलता से गेंद पर झपट्टा मारता है और उछल-कूद करता है! 🎾`;
        case "puppy":
          return `${name} उत्साह से उछलकर गेंद को अपने पंजे से आगे धकेलता है! 🎾`;
        case "fox":
          return `${name} तेजी से गेंद का पीछा करता है और चतुर पंजे से रोकता है! 🎾`;
        default:
          return `${name} चंचलता से पेस्टल गेंद को अपने पंजे से उछाल रहा है! 🎾`;
      }
    }
    switch (species) {
      case "capybara":
        return `${name} curiously and calmly bats the pastel ball across the soft rug! 🎾`;
      case "kitten":
        return `${name} pounces gracefully, batting the bouncy ball with lightning cat reflexes! 🎾`;
      case "puppy":
        return `${name} bounds with happy puppy hops, nudging the ball across the room! 🎾`;
      case "fox":
        return `${name} darts swiftly, outsmarting the rolling ball with clever paw taps! 🎾`;
      default:
        return `${name} playfully bats and chases the pastel ball across the rug! 🎾`;
    }
  }

  // --- Real State Actions with Responsive Cooldown & Graceful Locking ---

  function handlePet(petZone = "head") {
    if (isSleeping) {
      setActionFeedback(
        lang === "hi"
          ? `${petName} अभी आराम से सो रहा है। प्यार करने के लिए पहले जगाएं!`
          : `${petName} is resting peacefully. Wake them up first to pet!`,
      );
      return;
    }

    // Resolve petZone safely (e.g. from direct canvas click or button click)
    const resolvedZone = typeof petZone === "string" ? petZone : "head";

    const now = Date.now();
    const canIncrementAffection = now - lastAffectionTimeRef.current >= 400;

    if (canIncrementAffection) {
      lastAffectionTimeRef.current = now;
      const nextHearts = Math.min(50, hearts + 1);
      const nextStage = calculateGrowthStage(nextHearts);
      checkMilestone(hearts, nextHearts);

      updatePetState({
        hearts: nextHearts,
        growthStage: nextStage,
        lastAction: "pet",
        lastInteractionDate: new Date().toISOString(),
      });
    }

    // Set interactive visual action state immediately
    setCurrentAction(resolvedZone === "body" ? "pet_body" : "pet_head");
    setActionFeedback(getPetMessage(petType, petName, resolvedZone, lang));
    setIsActionInProgress(true);

    if (petTimerRef.current) {
      clearTimeout(petTimerRef.current);
    }

    petTimerRef.current = setTimeout(() => {
      setCurrentAction("idle");
      setIsActionInProgress(false);
    }, 1800);
  }

  function handleFeed() {
    if (isSleeping) {
      setActionFeedback(
        lang === "hi"
          ? `${petName} सो रहा है। नाश्ता कराने के लिए पहले जगाएं!`
          : `${petName} is sleeping soundly. Wake them up first for a snack!`,
      );
      return;
    }

    if (isActionInProgress) return;

    if (snacks <= 0) {
      setActionFeedback(
        lang === "hi"
          ? "सारा नाश्ता समाप्त! नए फल लेने के लिए 'ताज़ा बेरी लें' बटन दबाएं।"
          : "All snacks enjoyed! Tap 'Pick Fresh Berry' below to gather more treats.",
      );
      return;
    }

    setIsActionInProgress(true);

    const nextHearts = Math.min(50, hearts + 2);
    const nextSnacks = Math.max(0, snacks - 1);
    const nextStage = calculateGrowthStage(nextHearts);
    checkMilestone(hearts, nextHearts);

    setCurrentAction("feed");
    setActionFeedback(getFeedMessage(petType, petName));

    updatePetState({
      hearts: nextHearts,
      snacks: nextSnacks,
      growthStage: nextStage,
      lastAction: "feed",
      lastInteractionDate: new Date().toISOString(),
    });

    setTimeout(() => {
      setCurrentAction("idle");
      setIsActionInProgress(false);
    }, 2000);
  }

  function handlePlayBall() {
    if (isSleeping) {
      setActionFeedback(
        lang === "hi"
          ? `${petName} अभी सो रहा है। गेंद खेलने के लिए पहले जगाएं!`
          : `${petName} is sleeping. Wake them up first to play ball!`,
      );
      return;
    }

    if (isActionInProgress) return;
    setIsActionInProgress(true);

    const nextHearts = Math.min(50, hearts + 2);
    const nextStage = calculateGrowthStage(nextHearts);
    checkMilestone(hearts, nextHearts);

    setCurrentAction("play");
    setActionFeedback(getPlayMessage(petType, petName));

    updatePetState({
      hearts: nextHearts,
      growthStage: nextStage,
      lastAction: "play",
      lastInteractionDate: new Date().toISOString(),
    });

    setTimeout(() => {
      setCurrentAction("idle");
      setIsActionInProgress(false);
    }, 3000);
  }

  function handleNap() {
    if (isActionInProgress) return;
    setIsActionInProgress(true);

    setCurrentAction("idle");
    setActionFeedback(
      lang === "hi"
        ? `${petName} शांति से तकिए पर सो गया है। मीठे सपने...`
        : `${petName} curls up comfortably on the soft rug for a peaceful nap.`,
    );

    updatePetState({
      isSleeping: true,
      lastAction: "nap",
      lastInteractionDate: new Date().toISOString(),
    });

    setTimeout(() => setIsActionInProgress(false), 800);
  }

  function handleWake() {
    if (isActionInProgress) return;
    setIsActionInProgress(true);

    setCurrentAction("idle");
    setActionFeedback(
      lang === "hi"
        ? `${petName} अंगड़ाई लेकर खुशी से जाग गया है! आपका स्वागत है।`
        : `${petName} stretches gently with a sweet yawn and opens bright happy eyes!`,
    );

    updatePetState({
      isSleeping: false,
      lastAction: "wake",
      lastInteractionDate: new Date().toISOString(),
    });

    setTimeout(() => setIsActionInProgress(false), 1200);
  }

  function handlePickSnack() {
    if (isSleeping) {
      setActionFeedback(
        lang === "hi"
          ? `${petName} अभी सो रहा है। जागने के बाद नए फल तोड़ें!`
          : `${petName} is sleeping soundly. Gather treats once they wake!`,
      );
      return;
    }

    if (isActionInProgress) return;

    if (snacks >= 8) {
      setActionFeedback(
        lang === "hi"
          ? "आपकी फलों की टोकरी पहले से भरी है (8/8)! साथी को खिलाएं।"
          : "Your berry basket is already full (8/8)! Share treats with your companion.",
      );
      return;
    }

    setIsActionInProgress(true);
    const nextSnacks = Math.min(8, snacks + 2);

    setBerryToast("+2 🍓");
    setActionFeedback(
      lang === "hi"
        ? "प्यार से 2 ताज़े फल तोड़े गए! साथी को खिलाने के लिए तैयार।"
        : "Picked 2 fresh sweet berries! Ready for healthy treat time.",
    );

    updatePetState({
      snacks: nextSnacks,
      lastInteractionDate: new Date().toISOString(),
    });

    setTimeout(() => {
      setBerryToast(null);
      setIsActionInProgress(false);
    }, 1500);
  }

  function handleSaveName() {
    const trimmed = tempName.trim() || "Chotu";
    updatePetState({ name: trimmed });
    setEditingName(false);
  }

  function handlePetChange(typeId) {
    if (isActionInProgress) return;
    const newPet = PET_TYPES.find((p) => p.id === typeId) || PET_TYPES[0];
    updatePetState({ petType: typeId });
    setActionFeedback(
      lang === "hi"
        ? `साथी बदलकर ${t("pet", newPet.labelKey)} चुना गया! ${newPet.icon}`
        : `Switched companion to ${t("pet", newPet.labelKey)}! ${newPet.icon}`,
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
            {t("nav", "pet")}
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
            {t("pet", "title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("pet", "subtitle")}
          </p>
        </div>

        {/* State Badges */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
              isSleeping
                ? "bg-[#3D2D49] text-[#F3E6F4] border-[#554064]"
                : "bg-[#DCEBDD]/40 text-[#2B4B2F] dark:bg-[#1E3722] dark:text-[#88C690] border-[#C4DEC6] dark:border-[#2F5A35]"
            }`}
          >
            <span>{isSleeping ? "🌙" : "☀️"}</span>
            <span>
              {isSleeping
                ? t("pet", "sleepingBadge")
                : t("pet", "awakeBadge")}
            </span>
          </span>

          <span className="relative inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF2F6] dark:bg-[#341F2E] text-[#79516F] dark:text-[#E8A8BF] border border-[#E9B7C8] dark:border-[#5C2E4A]">
            <span>🍓</span>
            <span>{snacks} {t("pet", "snacksCount")}</span>
            {berryToast && (
              <span className="absolute -bottom-6 right-0 bg-[#2D5A32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs animate-bounce whitespace-nowrap">
                {berryToast}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Cozy Sanctuary Chamber Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all duration-700 shadow-sm ${
          isSleeping
            ? "border-[#4A3857] bg-gradient-to-b from-[#2E2236] via-[#3B2C46] to-[#251B2C] text-[#F5EAF5]"
            : "border-[var(--line)] bg-gradient-to-b from-[#FFF5F8] via-[#FAF5F0] to-white dark:from-[#2A1D33] dark:via-[#22182B] dark:to-[#1B1522] text-[var(--ink)]"
        }`}
      >
        {/* Milestone Celebration Banner */}
        {milestoneCelebration && (
          <div
            className="mx-6 mt-6 rounded-2xl bg-gradient-to-r from-[#FFF0F5] to-[#F3EBF4] dark:from-[#341F2E] dark:to-[#281F30] border border-[#E9B7C8] dark:border-[#5C2E4A] p-3.5 text-center shadow-xs animate-fade-in"
            role="status"
            aria-live="polite"
          >
            <p className="text-xs sm:text-sm font-bold text-[var(--plum)]">
              {milestoneCelebration.title}
            </p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              {milestoneCelebration.description}
            </p>
          </div>
        )}

        {/* Ambient Room Header / Companion Name & Stage */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
          {/* Editable Name */}
          <div className="flex flex-col items-center gap-1.5">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={18}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-3 py-1.5 text-base font-bold text-[var(--ink)] text-center shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#79516F]"
                  aria-label={t("pet", "petName")}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="touch-target rounded-xl bg-[#79516F] text-white px-3.5 py-1.5 text-xs font-bold hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] transition-all"
                >
                  {t("buttons", "save")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(petName);
                    setEditingName(false);
                  }}
                  className="touch-target rounded-xl bg-[var(--card-subtle)] border border-[var(--line)] text-[var(--muted)] px-2.5 py-1.5 text-xs font-semibold hover:bg-[var(--card)] transition-all"
                >
                  {t("buttons", "cancel")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempName(petName);
                  setEditingName(true);
                }}
                className={`group flex items-center gap-2 font-serif text-2xl sm:text-3xl font-bold transition-colors ${
                  isSleeping
                    ? "text-[#F8EDF5] hover:text-[#E9B7C8]"
                    : "text-[var(--ink)] hover:text-[var(--plum)]"
                }`}
                title={t("pet", "renameHint")}
              >
                <span>{petName}</span>
                <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                  ✏️
                </span>
              </button>
            )}

            {/* Growth Stage Pill */}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  isSleeping
                    ? "bg-[#4D395B] border-[#664C77] text-[#EAD8EC]"
                    : "bg-[#F7EBF2] dark:bg-[#341F2E] border-[#E9B7C8] dark:border-[#5C2E4A] text-[var(--plum)]"
                }`}
              >
                {stageLabel}
              </span>
              <span
                className={`text-xs font-medium ${
                  isSleeping ? "text-[#CBB5CE]" : "text-[var(--muted)]"
                }`}
              >
                ❤️ {hearts} / 50 {t("pet", "heartsLabel")}
              </span>
            </div>
          </div>

          {/* Gentle Growth Progress Meter */}
          <div className="w-full max-w-xs space-y-1">
            <div
              className={`h-2 w-full rounded-full overflow-hidden ${
                isSleeping ? "bg-[#453351]" : "bg-[var(--card-subtle)] border border-[var(--line)]"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-[#E9B7C8] to-[#79516F] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p
              className={`text-[11px] italic ${
                isSleeping ? "text-[#CBB5CE]" : "text-[var(--muted)]"
              }`}
            >
              {nextMilestoneText}
            </p>
          </div>
        </div>

        {/* 3D Plush Companion Sanctuary Floor */}
        <div className="relative flex flex-col items-center justify-center px-4 pb-4">
          {/* Touch Hint / Interaction Prompt */}
          <p
            className={`text-xs font-medium mb-1 tracking-wide select-none ${
              isSleeping ? "text-[#BBA3BF]" : "text-[var(--plum)]"
            }`}
          >
            {isSleeping ? t("pet", "sleepingNotice") : t("pet", "touchHint")}
          </p>

          {/* Genuine 3D Plush Canvas with WebGL & Fallback */}
          <div className="relative w-full flex items-center justify-center">
            <PetCanvas3D
              petState={{ name: petName, hearts, growthStage }}
              petType={petType}
              currentAction={currentAction}
              isSleeping={isSleeping}
              growthStage={growthStage}
              onPetClick={handlePet}
              onPlayBallClick={handlePlayBall}
            />
          </div>

          {/* Companion Speech / Reaction Bubble */}
          <div
            className={`mt-4 rounded-2xl px-6 py-3 border shadow-xs max-w-md w-full transition-all duration-300 text-center ${
              isSleeping
                ? "bg-[#3D2D49]/90 border-[#5A436B] text-[#F3E6F4]"
                : "bg-[var(--card)]/95 border-[var(--line)] text-[var(--ink)]"
            }`}
            aria-live="polite"
          >
            <p className="text-xs sm:text-sm font-medium leading-relaxed italic">
              "{actionFeedback}"
            </p>
          </div>
        </div>

        {/* Real Action Interaction Controls */}
        <div
          className={`p-6 sm:p-8 border-t flex flex-wrap items-center justify-center gap-3 transition-colors ${
            isSleeping ? "border-[#4A3857] bg-[#291E30]/60" : "border-[var(--line)] bg-[var(--card)]/70"
          }`}
        >
          {/* 1. Pet 🌸 */}
          <button
            type="button"
            onClick={handlePet}
            disabled={isSleeping || isActionInProgress}
            className={`touch-target rounded-2xl px-4 py-2.5 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#79516F] ${
              isSleeping || isActionInProgress
                ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border border-transparent"
                : "bg-[var(--card)] border border-[#E9B7C8] dark:border-[#5C2E4A] text-[var(--plum)] hover:bg-[#FCF4F7] dark:hover:bg-[#34243E] hover:scale-102 active:scale-98"
            }`}
            title={
              isSleeping
                ? t("pet", "sleepingNotice")
                : isActionInProgress
                ? "..."
                : t("pet", "petAction")
            }
            aria-label={t("pet", "petAction")}
          >
            <span>{t("pet", "petAction")}</span>
          </button>

          {/* 2. Feed Snack 🍓 */}
          <button
            type="button"
            onClick={handleFeed}
            disabled={isSleeping || snacks <= 0 || isActionInProgress}
            className={`touch-target rounded-2xl px-4 py-2.5 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#79516F] ${
              isSleeping || snacks <= 0 || isActionInProgress
                ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border border-transparent"
                : "bg-[var(--card)] border border-[#DCEBDD] dark:border-[#2F5A35] text-[#2D5A32] dark:text-[#88C690] hover:bg-[#F4FAF5] dark:hover:bg-[#1E3722] hover:scale-102 active:scale-98"
            }`}
            title={
              isSleeping
                ? t("pet", "sleepingNotice")
                : snacks <= 0
                ? t("pet", "noSnacks")
                : isActionInProgress
                ? "..."
                : t("pet", "feedAction")
            }
            aria-label={`${t("pet", "feedAction")} (${snacks} left)`}
          >
            <span>{t("pet", "feedAction")}</span>
            <span className="text-[11px] font-semibold opacity-75">
              ({snacks})
            </span>
          </button>

          {/* 3. Play Ball 🎾 */}
          <button
            type="button"
            onClick={handlePlayBall}
            disabled={isSleeping || isActionInProgress}
            className={`touch-target rounded-2xl px-4 py-2.5 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#79516F] ${
              isSleeping || isActionInProgress
                ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border border-transparent"
                : "bg-[var(--card)] border border-[#FBE6B8] dark:border-[#5E3F1F] text-[#854D0E] dark:text-[#FFE0B2] hover:bg-[#FFFDF5] dark:hover:bg-[#332211] hover:scale-102 active:scale-98"
            }`}
            title={
              isSleeping
                ? t("pet", "sleepingNotice")
                : isActionInProgress
                ? "..."
                : t("pet", "playAction")
            }
            aria-label={t("pet", "playAction")}
          >
            <span>{t("pet", "playAction")}</span>
          </button>

          {/* 4. Take a Nap 🌙 OR Wake Up ☀️ */}
          {isSleeping ? (
            <button
              type="button"
              onClick={handleWake}
              disabled={isActionInProgress}
              className={`touch-target rounded-2xl bg-[#E9B7C8] border border-[#F5C4D8] px-5 py-2.5 text-xs font-bold text-[#451A31] shadow-md hover:bg-[#F3C4D5] hover:scale-103 active:scale-97 transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#79516F] ${
                isActionInProgress ? "opacity-60 cursor-not-allowed" : ""
              }`}
              aria-label={t("pet", "wakeAction")}
            >
              <span>{t("pet", "wakeAction")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNap}
              disabled={isActionInProgress}
              className={`touch-target rounded-2xl bg-[#79516F] border border-[#633E5A] dark:bg-[#8D5C82] dark:border-[#8D5C82] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#633E5A] dark:hover:bg-[#A06B95] hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#E9B7C8] ${
                isActionInProgress ? "opacity-60 cursor-not-allowed" : ""
              }`}
              aria-label={t("pet", "napAction")}
            >
              <span>{t("pet", "napAction")}</span>
            </button>
          )}

          {/* Pick Fresh Berries Button */}
          <button
            type="button"
            onClick={handlePickSnack}
            disabled={isSleeping || isActionInProgress || snacks >= 8}
            className={`touch-target rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all border focus:outline-hidden focus:ring-2 focus:ring-[#79516F] ${
              isSleeping || isActionInProgress || snacks >= 8
                ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border-transparent"
                : isSleeping
                ? "bg-[#3D2D49] border-[#5A436B] text-[#EAD8EC] hover:bg-[#4C385B]"
                : "bg-[var(--card-subtle)] border-[var(--line-strong)] text-[var(--plum)] hover:bg-[#F5ECE5] dark:hover:bg-[#34263E]"
            }`}
            title={
              isSleeping
                ? t("pet", "sleepingNotice")
                : snacks >= 8
                ? "Basket full (8/8)"
                : t("pet", "pickSnackDesc")
            }
          >
            {t("pet", "pickSnackBtn")}
          </button>
        </div>

        {/* Change Companion Profile & Breed Selector */}
        <div
          className={`px-6 py-6 border-t flex flex-col items-center text-center space-y-3 transition-colors ${
            isSleeping ? "border-[#4A3857] bg-[#231A29]" : "border-[var(--line)] bg-[var(--card-subtle)]/60"
          }`}
        >
          <label
            className={`text-xs font-bold uppercase tracking-wider ${
              isSleeping ? "text-[#CBB5CE]" : "text-[var(--muted)]"
            }`}
          >
            {t("pet", "choosePet")}
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {PET_TYPES.map((pt) => {
              const isCurrent = selectedPet.id === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => handlePetChange(pt.id)}
                  className={`touch-target relative flex flex-col items-center rounded-2xl p-2.5 px-3 text-xs font-semibold transition-all border ${
                    isCurrent
                      ? "bg-[#79516F] text-white border-[#79516F] shadow-sm scale-105 ring-2 ring-[#E9B7C8] dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                      : isSleeping
                      ? "bg-[#3D2D49] text-[#F3E6F4] border-[#554064] hover:bg-[#4C385B]"
                      : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
                  }`}
                  aria-pressed={isCurrent}
                >
                  <span className="text-xl mb-1">{pt.icon}</span>
                  <span className="text-[11px] font-bold">
                    {t("pet", pt.labelKey).split(" ")[0]}
                  </span>
                  {isCurrent && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#E9B7C8] text-[#79516F] rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p
            className={`text-xs font-serif font-bold ${
              isSleeping ? "text-[#E9B7C8]" : "text-[var(--plum)]"
            }`}
          >
            {selectedPet.icon} {t("pet", selectedPet.labelKey)} — {selectedPet.descKey}
          </p>

          {/* Reassuring Cute Luxury Disclaimer */}
          <p
            className={`text-[11px] max-w-sm mx-auto leading-relaxed ${
              isSleeping ? "text-[#A992AD]" : "text-[var(--muted)]"
            }`}
          >
            {lang === "hi"
              ? "सहेली का वर्चुअल साथी केवल आपके सुखद अनुभव और तनावमुक्ति के लिए है। कोई दंड या स्वास्थ्य डेटा का दबाव नहीं है।"
              : "Saheli's companion is a peaceful, comforting friend. No penalties, no streaks, and no connection to your sensitive health logs."}
          </p>
        </div>
      </div>
    </div>
  );
}

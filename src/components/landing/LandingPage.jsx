import { useState, useEffect, useMemo } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { calculateCyclePrediction } from "../../lib/cycle.js";
import { getTodayLocalDate, daysBetween, addDays, isValidDateOnly } from "../../lib/dates.js";
import heroArtwork from "../../assets/hero-artwork.jpg";
import { SaheliHiddenHeartSymbol, SaheliLogo } from "../common/SaheliLogo.jsx";
import {
  IconLotus,
  IconArrowRight,
  IconCheck,
  IconLock,
  IconShield,
  IconSparkles,
  IconCalendar,
  IconBookOpen,
  IconStethoscope,
  IconBrain,
  IconDroplet,
  IconDroplets,
  IconMenu,
  IconClose,
  IconChevronDown,
  IconCalculators,
  IconMySpace,
  IconAsk,
} from "../common/Icons.jsx";

function formatFriendlyDate(dateStr, lang) {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function LandingPage({ onOpenApp }) {
  const { appData, updateSettings } = useAppData();
  const { lang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHighContrast = Boolean(appData?.settings?.highContrast);
  const textSize = appData?.settings?.textSize || "normal";
  const themeSetting = appData?.settings?.theme || "light";

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemIsDark(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const resolvedTheme =
    themeSetting === "system" ? (systemIsDark ? "dark" : "light") : themeSetting;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
      document.documentElement.setAttribute("data-contrast", isHighContrast ? "high" : "normal");
      document.documentElement.setAttribute("data-text-size", textSize);
    }
  }, [resolvedTheme, isHighContrast, textSize]);

  function scrollToSection(id) {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  // --- Real Cycle Data Connection ---
  const today = getTodayLocalDate();

  const entries = useMemo(() => {
    return Object.entries(appData?.logsByDate || {})
      .filter(([d, log]) => isValidDateOnly(d) && log?.period?.isPeriod === true)
      .sort(([a], [b]) => a.localeCompare(b));
  }, [appData?.logsByDate]);

  const periodStarts = useMemo(() => {
    const datesSet = new Set(entries.map(([d]) => d));
    return entries
      .map(([d]) => d)
      .filter((date) => !datesSet.has(addDays(date, -1)));
  }, [entries]);

  const hasPeriodRecords = periodStarts.length > 0;

  const cycleAnalysis = useMemo(() => {
    if (!hasPeriodRecords) return null;
    try {
      return calculateCyclePrediction(periodStarts);
    } catch {
      return null;
    }
  }, [periodStarts, hasPeriodRecords]);

  const latestPeriodStart = hasPeriodRecords
    ? periodStarts[periodStarts.length - 1]
    : null;

  let currentCycleDay = null;
  if (latestPeriodStart) {
    const diff = daysBetween(latestPeriodStart, today);
    if (diff >= 0) {
      currentCycleDay = diff + 1;
    }
  }

  const medianCycleLen = cycleAnalysis?.medianCycleLength
    ? Math.round(cycleAnalysis.medianCycleLength)
    : 28;

  // Determine current active phase strictly based on actual data
  let currentPhase = null;
  if (currentCycleDay !== null) {
    if (currentCycleDay <= 5) {
      currentPhase = {
        id: "menstrual",
        nameEn: "Menstrual Phase",
        nameHi: "माहवारी चरण",
        days: "Days 1 – 5",
        status: "Active Phase",
        toneEn: "Rest & Hydrate",
        toneHi: "विश्राम और जलयोजन",
        descEn:
          "Your uterine lining sheds. Estrogen and progesterone are at baseline. Prioritize warm gentle meals, restorative rest, and comfortable pacing.",
        descHi:
          "एस्ट्रोजन और प्रोजेस्टेरोन का स्तर न्यूनतम होता है। गर्म पौष्टिक भोजन, आराम और शरीर की गति को धीमा रखें।",
        badgeClass:
          "bg-[#F7E3EC] text-[#79516F] border-[#E9B7C8] dark:bg-[#3C2333] dark:text-[#E8A8BF] dark:border-[#543048]",
        tipEn:
          "WHO & ACOG guidance: Stay well hydrated, prioritize iron-rich warm meals, and give yourself unhurried rest.",
        tipHi:
          "पर्याप्त पानी पिएं, गर्म व आयरन युक्त पौष्टिक आहार लें और शरीर को पर्याप्त विश्राम दें।",
      };
    } else if (currentCycleDay <= 13) {
      currentPhase = {
        id: "follicular",
        nameEn: "Follicular Phase",
        nameHi: "फॉलिक्युलर चरण",
        days: "Days 6 – 13",
        status: "Active Phase",
        toneEn: "Rising Energy & Focus",
        toneHi: "ऊर्जा और एकाग्रता",
        descEn:
          "FSH prompts follicles to mature and estrogen rises steadily. Mental focus, stamina, and curiosity naturally elevate as your body prepares for ovulation.",
        descHi:
          "एस्ट्रोजन बढ़ता है। मानसिक एकाग्रता, ऊर्जा और स्फूर्ति स्वाभाविक रूप से बढ़ती है जब शरीर ओव्यूलेशन की तैयारी करता है।",
        badgeClass:
          "bg-[#DCEBDD] text-[#3F6344] border-[#A2C8A5] dark:bg-[#1E3322] dark:text-[#C4E2C7] dark:border-[#2C4830]",
        tipEn:
          "Rising estrogen supports mental focus and endurance. An uplifting window for physical movement and creative learning.",
        tipHi:
          "बढ़ता एस्ट्रोजन मानसिक एकाग्रता और ऊर्जा को बढ़ाता है। नई चीजें सीखने और सक्रिय रहने का उत्तम समय।",
      };
    } else if (currentCycleDay <= 16) {
      currentPhase = {
        id: "ovulation",
        nameEn: "Ovulation Window",
        nameHi: "ओव्यूलेशन खिड़की",
        days: "Days 14 – 16",
        status: "Active Phase",
        toneEn: "Peak Vitality",
        toneHi: "चरम सक्रियता",
        descEn:
          "LH surge triggers the release of a mature egg. Natural vitality and confidence peak. (Note: calculated estimates are educational, not contraception).",
        descHi:
          "एलएच हार्मोन के बढ़ने से परिपक्व अंडाणु निकलता है। ऊर्जा चरम पर होती है। (नोट: अनुमान शैक्षणिक हैं, गर्भनिरोधक नहीं)।",
        badgeClass:
          "bg-[#FFF8EB] text-[#854D0E] border-[#FCD34D] dark:bg-[#2E2412] dark:text-[#FCD34D] dark:border-[#4D3B1E]",
        tipEn:
          "Channel peak vitality while maintaining restful sleep and generous hydration.",
        tipHi:
          "अपनी सकारात्मक ऊर्जा का सदुपयोग करें और भरपूर पानी पीते हुए नींद का संतुलन बनाए रखें।",
      };
    } else {
      currentPhase = {
        id: "luteal",
        nameEn: "Luteal Phase",
        nameHi: "ल्यूटियल चरण",
        days: `Days 17 – ${medianCycleLen}`,
        status: "Active Phase",
        toneEn: "Nurture & Ground",
        toneHi: "संरक्षण और स्थिरता",
        descEn:
          "Progesterone rises then tapers. Your metabolic rate gently climbs. Support your nervous system with magnesium-rich foods and grounding mindfulness.",
        descHi:
          "प्रोजेस्टेरोन बढ़ता है फिर घटता है। मैग्नीशियम युक्त आहार और ध्यान के माध्यम से अपने तंत्रिका तंत्र को पोषण दें।",
        badgeClass:
          "bg-[#F2E8F0] text-[#79516F] border-[#DECED9] dark:bg-[#34263E] dark:text-[#D9A4C7] dark:border-[#543F61]",
        tipEn:
          "Incorporate magnesium-rich foods like nuts, pumpkin seeds, and leafy greens to support physical comfort.",
        tipHi:
          "शारीरिक सहजता और बेहतर नींद के लिए मेवे, बीज और हरी पत्तेदार सब्जियों को आहार में शामिल करें।",
      };
    }
  }

  // Circular wheel geometry calculations - compact dimensions for balanced viewport height
  const totalDays = Math.max(21, Math.min(45, medianCycleLen || 28));
  const safeCurrentDay = currentCycleDay ? Math.min(currentCycleDay, totalDays) : 0;
  const progressRatio = safeCurrentDay > 0 ? (safeCurrentDay - 1) / totalDays : 0;
  const pointerAngle = progressRatio * 360 - 90;
  const pointerRad = (pointerAngle * Math.PI) / 180;
  const wheelRadius = 50;
  const wheelCenter = 66;
  const pointerX = wheelCenter + wheelRadius * Math.cos(pointerRad);
  const pointerY = wheelCenter + wheelRadius * Math.sin(pointerRad);

  const wheelCircumference = 2 * Math.PI * wheelRadius;
  const menstrualArc = (5 / totalDays) * wheelCircumference;
  const follicularArc = (8 / totalDays) * wheelCircumference;
  const ovulationArc = (3 / totalDays) * wheelCircumference;
  const lutealArc = ((totalDays - 16) / totalDays) * wheelCircumference;

  return (
    <div
      data-theme={resolvedTheme}
      data-contrast={isHighContrast ? "high" : "normal"}
      data-text-size={textSize}
      lang={lang}
      className={`min-h-screen bg-[#FBF7F3] dark:bg-[#1B1522] text-[var(--ink)] ${
        resolvedTheme === "dark" ? "dark" : ""
      } font-sans flex flex-col selection:bg-[#E9B7C8] selection:text-[#292536]`}
    >
      {/* 1. Floating Pill-Shaped Header */}
      <div className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 w-full max-w-6xl mx-auto transition-all">
        <header className="relative flex items-center justify-between rounded-full border border-[#DECED9]/80 dark:border-[#543F61]/80 bg-white/90 dark:bg-[#281F30]/90 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-2.5 shadow-md shadow-[#292536]/5">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-full p-0.5 cursor-pointer"
              aria-label="Saheli Home"
            >
              <SaheliLogo variant="horizontal" showTagline={true} />
            </button>
          </div>

          {/* Desktop Navigation Links (Centred Section with Delicate Line Icons) */}
          <nav
            className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-semibold text-[var(--muted)]"
            aria-label="Main Navigation"
          >
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="inline-flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-full cursor-pointer"
            >
              <IconSparkles className="h-3.5 w-3.5 text-[var(--plum)] dark:text-[#E8A8BF]" aria-hidden="true" />
              <span>{t("landing", "navFeatures")}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("wellness")}
              className="inline-flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-full cursor-pointer"
            >
              <IconLotus className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" aria-hidden="true" />
              <span>{t("landing", "navWellness")}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("privacy")}
              className="inline-flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-full cursor-pointer"
            >
              <IconShield className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" aria-hidden="true" />
              <span>{t("landing", "navPrivacy")}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="inline-flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-full cursor-pointer"
            >
              <IconBookOpen className="h-3.5 w-3.5 text-[#854D0E] dark:text-[#FCD34D]" aria-hidden="true" />
              <span>{t("landing", "navAbout")}</span>
            </button>
          </nav>

          {/* Right Controls: Bilingual Selector & Muted-Plum CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Bilingual Toggle */}
            <div
              role="radiogroup"
              aria-label="Language selection"
              className="inline-flex items-center rounded-full border border-[var(--line-strong)] bg-[var(--card-subtle)] p-0.5 text-xs shadow-2xs"
            >
              <button
                type="button"
                role="radio"
                aria-checked={lang === "en"}
                onClick={() => updateSettings({ language: "en" })}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] ${
                  lang === "en"
                    ? "bg-[#79516F] text-white shadow-xs font-bold dark:bg-[#8D5C82]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
                aria-label="English"
              >
                EN
              </button>
              <span className="text-[var(--line-strong)] mx-0.5 text-[10px] select-none" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                role="radio"
                aria-checked={lang === "hi"}
                onClick={() => updateSettings({ language: "hi" })}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] ${
                  lang === "hi"
                    ? "bg-[#79516F] text-white shadow-xs font-bold dark:bg-[#8D5C82]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
                aria-label="Hindi (हिंदी)"
              >
                हिंदी
              </button>
            </div>

            {/* Muted-Plum Primary CTA to enter App */}
            <button
              type="button"
              onClick={() => onOpenApp("today")}
              className="hidden sm:inline-flex touch-target items-center gap-1.5 rounded-full bg-[#79516F] dark:bg-[#8D5C82] hover:bg-[#633E5A] dark:hover:bg-[#A06B95] text-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold shadow-xs transition-all hover:translate-y-[-1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] cursor-pointer"
            >
              <span>{t("landing", "ctaOpen")}</span>
              <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--card-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--plum)] cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-3xl border border-[var(--line-strong)] bg-white/95 dark:bg-[#281F30]/95 backdrop-blur-md p-4 space-y-2 shadow-xl">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-subtle)]"
            >
              <IconSparkles className="h-4 w-4 text-[var(--plum)]" />
              <span>{t("landing", "navFeatures")}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("wellness")}
              className="flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-subtle)]"
            >
              <IconLotus className="h-4 w-4 text-[#3F6344]" />
              <span>{t("landing", "navWellness")}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("privacy")}
              className="flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-subtle)]"
            >
              <IconShield className="h-4 w-4 text-[#3F6344]" />
              <span>{t("landing", "navPrivacy")}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-subtle)]"
            >
              <IconBookOpen className="h-4 w-4 text-[#854D0E]" />
              <span>{t("landing", "navAbout")}</span>
            </button>
            <div className="pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => onOpenApp("today")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white py-3 text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>{t("landing", "ctaOpen")}</span>
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Spacious Editorial Hero Section with Botanical & Illustrated Woman Artwork */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 border-b border-[var(--line)] flex items-center min-h-[560px] lg:min-h-[620px]">
        {/* Full Atmospheric Background Artwork */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          {/* Editorial artwork preserved in its original orientation, positioned so the illustrated woman's face and upper body sit clearly in the open space between the left text and right cycle card */}
          <img
            src={heroArtwork}
            alt=""
            className="hero-artwork-img opacity-95 dark:opacity-25 transition-opacity"
          />

          {/* Gentle top edge blend for floating header separation */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FBF7F3]/70 to-transparent dark:from-[#1B1522]/80 pointer-events-none" />
        </div>

        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left relative z-20">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/85 dark:bg-[#281F30]/85 backdrop-blur-sm px-3.5 py-1.5 shadow-2xs">
                <IconLotus className="h-3.5 w-3.5 text-[var(--plum)] dark:text-[#E8A8BF]" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--plum)] dark:text-[#E8A8BF]">
                  {t("landing", "heroEyebrow")}
                </span>
              </div>

              {/* Main Headline with refined width and line spacing to prevent awkward wrapping */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-[var(--ink)] leading-[1.16] tracking-tight max-w-lg mx-auto lg:mx-0">
                {lang === "hi" ? (
                  <>
                    अपने चक्र को <span className="italic font-serif text-[#C96886] dark:text-[#E8A8BF]">गहराई से समझें</span>।<br />
                    स्वयं से अधिक जुड़ाव महसूस करें।
                  </>
                ) : (
                  <>
                    Understand <span className="italic font-serif text-[#C96886] dark:text-[#E8A8BF]">your cycle</span>.<br />
                    Feel more in tune with yourself.
                  </>
                )}
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
                {t("landing", "heroSubheading")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenApp("today")}
                  className="touch-target w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#79516F] dark:bg-[#8D5C82] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-[#633E5A] dark:hover:bg-[#A06B95] transition-all hover:translate-y-[-1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] cursor-pointer"
                >
                  <span>{t("landing", "ctaExplore")}</span>
                  <IconArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("features")}
                  className="touch-target w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/85 dark:bg-[#281F30]/85 text-[var(--ink)] px-5 py-3 text-xs sm:text-sm font-semibold hover:bg-[var(--card-subtle)] transition-all focus-visible:outline-2 focus-visible:outline-[var(--plum)] cursor-pointer backdrop-blur-sm"
                >
                  <span>{t("landing", "ctaFeatures")}</span>
                  <IconChevronDown className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                </button>
              </div>

              {/* Compact Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-5 text-xs text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <IconShield className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" aria-hidden="true" />
                  <span>{t("landing", "trustLocal")}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <IconLock className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" aria-hidden="true" />
                  <span>{t("landing", "trustNoAccount")}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <IconBookOpen className="h-3.5 w-3.5 text-[var(--plum)] dark:text-[#E8A8BF]" aria-hidden="true" />
                  <span>{t("landing", "trustClinical")}</span>
                </span>
              </div>
            </div>

            {/* Right Column: Floating Compact Cycle Dashboard */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-20">
              <div className="relative w-full max-w-[340px] sm:max-w-[350px] lg:max-w-[355px] rounded-3xl border border-[#DECED9]/80 dark:border-[#543F61]/80 bg-white/95 dark:bg-[#281F30]/95 backdrop-blur-md p-4 sm:p-4.5 shadow-xl shadow-[#292536]/6 transition-all hover:shadow-2xl">
                {/* Dashboard Card Header */}
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-2 w-2 rounded-full bg-[#528C5A] ring-3 ring-[#DCEBDD] dark:ring-[#1E3322]"
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]">
                      {t("landing", "cycleToday")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenApp("calendar")}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--plum)] dark:text-[#E8A8BF] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded px-1 py-0.5 cursor-pointer"
                  >
                    <span>{t("landing", "viewCalendar")}</span>
                    <IconCalendar className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>

                {/* Main Section: Circular Cycle Visualization */}
                <div className="my-2 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 sm:w-34 sm:h-34 flex items-center justify-center">
                    <svg
                      width="132"
                      height="132"
                      viewBox="0 0 132 132"
                      className="w-full h-full overflow-visible select-none transition-transform duration-700 ease-out"
                      role="img"
                      aria-label={
                        hasPeriodRecords && currentCycleDay
                          ? `${t("landing", "cycleDay")} ${currentCycleDay}`
                          : t("landing", "cycleStartsHere")
                      }
                    >
                      {/* Outer decorative track */}
                      <circle
                        cx={wheelCenter}
                        cy={wheelCenter}
                        r={wheelRadius + 8}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        className="text-[#EFE6EC] dark:text-[#3D2E47] opacity-80"
                      />

                      {/* Inner delicate concentric dial */}
                      <circle
                        cx={wheelCenter}
                        cy={wheelCenter}
                        r={wheelRadius - 8}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-[#F2E8F0] dark:text-[#2A1D31] opacity-75"
                      />

                      {/* Main track base */}
                      <circle
                        cx={wheelCenter}
                        cy={wheelCenter}
                        r={wheelRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="7"
                        className="text-[#F7E3EC]/30 dark:text-[#211928]"
                      />

                      {hasPeriodRecords ? (
                        <>
                          {/* Segment 1: Menstrual Phase (Plum) */}
                          <circle
                            cx={wheelCenter}
                            cy={wheelCenter}
                            r={wheelRadius}
                            fill="none"
                            stroke="#79516F"
                            strokeWidth={currentPhase?.id === "menstrual" ? "9" : "7"}
                            strokeDasharray={`${menstrualArc - 2} ${wheelCircumference}`}
                            strokeDashoffset={0}
                            transform={`rotate(-90 ${wheelCenter} ${wheelCenter})`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />

                          {/* Segment 2: Follicular Phase (Sage) */}
                          <circle
                            cx={wheelCenter}
                            cy={wheelCenter}
                            r={wheelRadius}
                            fill="none"
                            stroke="#4A7C59"
                            strokeWidth={currentPhase?.id === "follicular" ? "9" : "7"}
                            strokeDasharray={`${follicularArc - 2} ${wheelCircumference}`}
                            strokeDashoffset={`-${menstrualArc}`}
                            transform={`rotate(-90 ${wheelCenter} ${wheelCenter})`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />

                          {/* Segment 3: Ovulation Window (Rose/Amber) */}
                          <circle
                            cx={wheelCenter}
                            cy={wheelCenter}
                            r={wheelRadius}
                            fill="none"
                            stroke="#E9B7C8"
                            strokeWidth={currentPhase?.id === "ovulation" ? "9" : "7"}
                            strokeDasharray={`${ovulationArc - 2} ${wheelCircumference}`}
                            strokeDashoffset={`-${menstrualArc + follicularArc}`}
                            transform={`rotate(-90 ${wheelCenter} ${wheelCenter})`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />

                          {/* Segment 4: Luteal Phase (Lavender) */}
                          <circle
                            cx={wheelCenter}
                            cy={wheelCenter}
                            r={wheelRadius}
                            fill="none"
                            stroke="#A37B9C"
                            strokeWidth={currentPhase?.id === "luteal" ? "9" : "7"}
                            strokeDasharray={`${lutealArc - 2} ${wheelCircumference}`}
                            strokeDashoffset={`-${menstrualArc + follicularArc + ovulationArc}`}
                            transform={`rotate(-90 ${wheelCenter} ${wheelCenter})`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />

                          {/* Pointer Node positioned at current cycle day */}
                          {currentCycleDay !== null && (
                            <g className="transition-all duration-700 ease-out">
                              <circle
                                cx={pointerX}
                                cy={pointerY}
                                r="4.5"
                                fill="#FFFFFF"
                                stroke="#79516F"
                                strokeWidth="2"
                                className="filter drop-shadow-sm"
                              />
                              <circle cx={pointerX} cy={pointerY} r="1.5" fill="#79516F" />
                            </g>
                          )}
                        </>
                      ) : (
                        /* Neutral decorative empty-state ring (graceful guide without fabricated progress) */
                        <>
                          <circle
                            cx={wheelCenter}
                            cy={wheelCenter}
                            r={wheelRadius}
                            fill="none"
                            stroke="#DECED9"
                            strokeWidth="1.5"
                            strokeDasharray="3 4"
                            className="opacity-75"
                          />
                          {[0, 90, 180, 270].map((deg) => {
                            const rad = (deg * Math.PI) / 180;
                            return (
                              <circle
                                key={deg}
                                cx={wheelCenter + wheelRadius * Math.cos(rad)}
                                cy={wheelCenter + wheelRadius * Math.sin(rad)}
                                r="2"
                                fill="#E9B7C8"
                              />
                            );
                          })}
                        </>
                      )}
                    </svg>

                    {/* Wheel Center Display */}
                    <div className="absolute inset-3 sm:inset-3.5 rounded-full bg-[var(--card-subtle)] border border-[var(--line)] flex flex-col items-center justify-center text-center p-2 shadow-2xs">
                      {hasPeriodRecords && currentCycleDay !== null ? (
                        currentCycleDay <= 90 ? (
                          <>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">
                              {t("landing", "cycleDay")}
                            </span>
                            <span className="font-serif text-2xl font-bold text-[var(--ink)] leading-none my-0.5">
                              {currentCycleDay}
                            </span>
                            <p className="font-semibold text-[10px] text-[var(--ink)] line-clamp-1 leading-tight">
                              {currentPhase
                                ? lang === "hi"
                                  ? currentPhase.nameHi
                                  : currentPhase.nameEn
                                : t("landing", "cycleTrackingStarted")}
                            </p>
                            <span className="text-[9px] font-medium text-[var(--plum)] dark:text-[#E8A8BF] line-clamp-1 leading-tight">
                              {currentPhase
                                ? lang === "hi"
                                  ? currentPhase.toneHi
                                  : currentPhase.toneEn
                                : t("landing", "moreRecordsNeeded")}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="h-6 w-6 rounded-lg bg-[#F7E3EC] dark:bg-[#3D2636] flex items-center justify-center text-[var(--plum)] dark:text-[#E8A8BF] mb-0.5">
                              <SaheliHiddenHeartSymbol className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-[var(--ink)] leading-tight">
                              {t("landing", "cycleTrackingStarted")}
                            </span>
                            <span className="text-[9px] text-[var(--muted)] leading-tight mt-0.5 max-w-[110px]">
                              {t("landing", "moreRecordsNeeded")}
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-lg bg-[#F7E3EC] dark:bg-[#3D2636] flex items-center justify-center text-[var(--plum)] dark:text-[#E8A8BF] mb-0.5">
                            <SaheliHiddenHeartSymbol className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-serif text-xs font-bold text-[var(--ink)] leading-snug">
                            {t("landing", "cycleAwaits")}
                          </span>
                          <span className="text-[10px] text-[var(--muted)] leading-tight mt-0.5 font-medium">
                            {t("landing", "cycleAwaitsDesc")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Current-Phase Information Panel OR Graceful Empty State */}
                {hasPeriodRecords && currentPhase ? (
                  <div className="rounded-xl p-2.5 border border-[var(--line)] bg-[var(--card-subtle)] space-y-1 transition-all">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${currentPhase.badgeClass}`}
                      >
                        {lang === "hi" ? currentPhase.nameHi : currentPhase.nameEn}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--muted)]">
                        {currentPhase.days}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--ink)] leading-relaxed">
                      {lang === "hi" ? currentPhase.descHi : currentPhase.descEn}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl p-3 border border-[var(--line)] bg-[var(--card-subtle)] space-y-1.5 text-center">
                    <h4 className="font-serif text-xs font-bold text-[var(--ink)]">
                      {t("landing", "cycleStartsHere")}
                    </h4>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed max-w-[270px] mx-auto">
                      {t("landing", "cycleStartsHereDesc")}
                    </p>
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => onOpenApp("log", { isFirstPeriod: true })}
                        className="touch-target inline-flex items-center justify-center gap-2 rounded-full bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] cursor-pointer hover:scale-[1.02]"
                      >
                        <span>{t("landing", "logFirstPeriod")}</span>
                        <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Compact Useful Event Rows */}
                <div className="mt-2.5 space-y-1.5">
                  {/* Row 1: Estimated Next Period */}
                  <div className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-lg bg-[#F7E3EC] dark:bg-[#3D2636] flex items-center justify-center text-[var(--plum)] shrink-0">
                        <IconDroplet className="h-3 w-3" />
                      </div>
                      <span className="font-semibold text-[11px] text-[var(--ink)]">
                        {t("landing", "estimatedPeriod")}
                      </span>
                    </div>
                    <div className="text-right">
                      {cycleAnalysis?.prediction?.available ? (
                        <>
                          <span className="font-bold text-xs text-[var(--ink)] block">
                            {formatFriendlyDate(cycleAnalysis.prediction.estimatedDate, lang)}
                          </span>
                          <span className="text-[9px] text-[var(--muted)] block">
                            ±{cycleAnalysis.prediction.spreadDays}{" "}
                            {lang === "hi" ? "दिन का दायरा" : "days"}
                          </span>
                        </>
                      ) : periodStarts.length === 1 ? (
                        <span className="text-[10px] text-[var(--muted)]">
                          {lang === "hi" ? "अगले चक्र के बाद" : "After 2nd cycle"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--muted)]">
                          {t("landing", "pendingFirstLog")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Estimated Ovulation / Fertile Window */}
                  <div className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-lg bg-[#FFF8EB] dark:bg-[#2E2412] flex items-center justify-center text-[#854D0E] dark:text-[#FCD34D] shrink-0">
                        <IconSparkles className="h-3 w-3" />
                      </div>
                      <span className="font-semibold text-[11px] text-[var(--ink)]">
                        {t("landing", "estimatedOvulation")}
                      </span>
                    </div>
                    <div className="text-right">
                      {cycleAnalysis?.ovulationEstimate && !cycleAnalysis?.isIrregular ? (
                        <>
                          <span className="font-bold text-xs text-[var(--ink)] block">
                            {formatFriendlyDate(cycleAnalysis.ovulationEstimate.estimatedDate, lang)}
                          </span>
                          <span className="text-[9px] text-[var(--muted)] block">
                            {formatFriendlyDate(cycleAnalysis.ovulationEstimate.fertileWindowStart, lang)} –{" "}
                            {formatFriendlyDate(cycleAnalysis.ovulationEstimate.fertileWindowEnd, lang)}
                          </span>
                        </>
                      ) : cycleAnalysis?.isIrregular ? (
                        <span className="text-[10px] text-[var(--muted)] italic block">
                          {lang === "hi" ? "अनियमित चक्र" : "Irregular cycle"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--muted)]">
                          {t("landing", "pendingRegularLogs")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Softly Tinted Wellness Tip Panel */}
                <div className="mt-2.5 rounded-xl border border-[#DECED9]/50 dark:border-[#543F61]/50 bg-[#FAF5F0] dark:bg-[#211928] p-2.5 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-[var(--ink)]">
                    <IconSparkles className="h-3 w-3 text-[var(--plum)] dark:text-[#E8A8BF]" aria-hidden="true" />
                    <span>{t("landing", "wellnessTipTitle")}</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    {currentPhase
                      ? lang === "hi"
                        ? currentPhase.tipHi
                        : currentPhase.tipEn
                      : lang === "hi"
                      ? "दैनिक लय: नींद, ऊर्जा और मनोदशा जैसी छोटी बातों को दर्ज करने से आपको अपने शरीर की स्वाभाविक लय समझने में मदद मिलती है।"
                      : "Tracking everyday cues like sleep, energy, and mood helps uncover your body's natural rhythm."}
                  </p>
                </div>

                {/* Readable Medical Estimate Disclaimer */}
                <p className="mt-2 text-[10px] text-center text-[var(--muted)] leading-normal">
                  {t("landing", "estimateDisclaimer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Thoughtfully Designed Features Section */}
      <section id="features" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--plum)] dark:text-[#E8A8BF]">
              {t("landing", "navFeatures")}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
              {t("landing", "featuresTitle")}
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)]">
              {t("landing", "featuresSubtitle")}
            </p>
          </div>

          {/* Editorial Grid: Asymmetric Highlight Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Cycle & Symptom Tracking (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8]/50 flex items-center justify-center text-[var(--plum)]">
                  <IconDroplets className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                    {t("landing", "feat1Title")}
                  </h3>
                  <span className="text-[11px] text-[var(--muted)] font-medium">Daily 30-Second Check-in</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat1Desc")}
              </p>

              {/* Visual preview of flow intensity chips */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-[var(--muted)] mr-1">Supported Metrics:</span>
                {["Spotting", "Light Flow", "Medium", "Heavy", "Cramps", "Mood", "Sleep Hours", "Energy 1-5"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--card-subtle)] px-3 py-1 text-[11px] font-medium text-[var(--ink)]"
                  >
                    <IconCheck className="h-3 w-3 text-[#3F6344] dark:text-[#88C690]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Personalized Cycle Overview */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#DCEBDD] dark:bg-[#1E3322] border border-[#A2C8A5]/50 flex items-center justify-center text-[#3F6344] dark:text-[#88C690]">
                <IconCalendar className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat2Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat2Desc")}
              </p>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-3 text-[11px] text-[var(--muted)] space-y-1">
                <span className="font-semibold text-[var(--ink)] block">Honest Science:</span>
                <span>Predictions require at least 2 logged periods and display median variance (± days) with full transparency.</span>
              </div>
            </div>

            {/* 3. Wellness & Health Insights */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#F2E8F0] dark:bg-[#34263E] border border-[#DECED9]/50 flex items-center justify-center text-[var(--plum)]">
                <IconBrain className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat3Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat3Desc")}
              </p>
            </div>

            {/* 4. Health Education & Certified Lessons */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#FFF8EB] dark:bg-[#2E2412] border border-[#FCD34D]/50 flex items-center justify-center text-[#854D0E] dark:text-[#FCD34D]">
                <IconBookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat4Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat4Desc")}
              </p>
            </div>

            {/* 5. Doctor Guidance & Safety */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#FDF2F0] dark:bg-[#341619] border border-[#F4B8B0]/50 flex items-center justify-center text-[#8F1D1D] dark:text-[#FFB3B8]">
                <IconStethoscope className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat5Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat5Desc")}
              </p>
            </div>

            {/* 6. Ask Saheli Voice & Text */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8]/50 flex items-center justify-center text-[var(--plum)]">
                <IconAsk className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat6Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat6Desc")}
              </p>
            </div>

            {/* 7. Private Reflections & Notes (My Space) */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#F2E8F0] dark:bg-[#34263E] border border-[#DECED9]/50 flex items-center justify-center text-[var(--plum)]">
                <IconMySpace className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat7Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat7Desc")}
              </p>
            </div>

            {/* 8. Health Calculators & Tools */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs hover:border-[var(--line-strong)] transition-all space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-[#DCEBDD] dark:bg-[#1E3322] border border-[#A2C8A5]/50 flex items-center justify-center text-[#3F6344] dark:text-[#88C690]">
                <IconCalculators className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {t("landing", "feat8Title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t("landing", "feat8Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Wellness Experience Sequence */}
      <section id="wellness" className="py-16 sm:py-24 border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3F6344] dark:text-[#88C690]">
              {t("landing", "navWellness")}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
              {t("landing", "wellnessTitle")}
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)]">
              {t("landing", "wellnessSubtitle")}
            </p>
          </div>

          {/* 4 Sequential Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: t("landing", "step1Title"),
                desc: t("landing", "step1Desc"),
                icon: <IconDroplet className="h-5 w-5 text-[var(--plum)]" />,
              },
              {
                step: "02",
                title: t("landing", "step2Title"),
                desc: t("landing", "step2Desc"),
                icon: <IconSparkles className="h-5 w-5 text-[#3F6344] dark:text-[#88C690]" />,
              },
              {
                step: "03",
                title: t("landing", "step3Title"),
                desc: t("landing", "step3Desc"),
                icon: <IconBookOpen className="h-5 w-5 text-[#854D0E] dark:text-[#FCD34D]" />,
              },
              {
                step: "04",
                title: t("landing", "step4Title"),
                desc: t("landing", "step4Desc"),
                icon: <IconStethoscope className="h-5 w-5 text-[#8F1D1D] dark:text-[#FFB3B8]" />,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 space-y-3 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-[var(--card-subtle)] border border-[var(--line)] flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-serif text-xl font-bold text-[var(--line-strong)] select-none">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                  {s.title}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Safety Callout Box */}
          <div className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-5 text-center max-w-3xl mx-auto">
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--ink)]">Clinical Notice:</strong> Cycle estimates are educational indicators based on median calculations from your recorded data. They must never be relied on for pregnancy prevention or medical diagnosis.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Privacy and Trust Section */}
      <section id="privacy" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--card)]/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[var(--line-strong)] bg-[var(--card)] p-8 sm:p-12 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCEBDD] dark:bg-[#1E3322] border border-[#A2C8A5]/50 text-[#3F6344] dark:text-[#88C690] mx-auto shadow-2xs">
                <IconShield className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
                {t("landing", "privacyTitle")}
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)]">
                {t("landing", "privacySubtitle")}
              </p>
            </div>

            {/* 3 Privacy Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#3F6344] dark:text-[#88C690]">
                  <IconLock className="h-4 w-4" />
                  <h3 className="font-serif text-sm font-bold text-[var(--ink)]">
                    {t("landing", "privacyPoint1Title")}
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {t("landing", "privacyPoint1Desc")}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#3F6344] dark:text-[#88C690]">
                  <IconLotus className="h-4 w-4" />
                  <h3 className="font-serif text-sm font-bold text-[var(--ink)]">
                    {t("landing", "privacyPoint2Title")}
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {t("landing", "privacyPoint2Desc")}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-subtle)] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#3F6344] dark:text-[#88C690]">
                  <IconCheck className="h-4 w-4" />
                  <h3 className="font-serif text-sm font-bold text-[var(--ink)]">
                    {t("landing", "privacyPoint3Title")}
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {t("landing", "privacyPoint3Desc")}
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-[var(--muted)] border-t border-[var(--line)] pt-6">
              {t("landing", "privacyDisclaimer")}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="py-20 sm:py-28 relative overflow-hidden text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8]/50 text-[var(--plum)] shadow-2xs mx-auto">
            <SaheliHiddenHeartSymbol className="h-7 w-7" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight">
            {t("landing", "finalCtaHeading")}
          </h2>

          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            {t("landing", "finalCtaSubheading")}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenApp("today")}
              className="touch-target inline-flex items-center gap-2.5 rounded-full bg-[#79516F] dark:bg-[#8D5C82] text-white px-8 py-4 text-base font-bold shadow-md hover:bg-[#633E5A] dark:hover:bg-[#A06B95] transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] cursor-pointer"
            >
              <span>{t("landing", "ctaOpen")}</span>
              <IconArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer id="about" className="border-t border-[var(--line)] bg-[var(--card-subtle)] py-12 text-xs text-[var(--muted)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--line)] pb-8">
            <SaheliLogo variant="horizontal" showTagline={true} />

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
              <button
                type="button"
                onClick={() => onOpenApp("today")}
                className="text-[var(--plum)] font-bold hover:underline cursor-pointer"
              >
                {t("landing", "ctaOpen")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                {t("landing", "navFeatures")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("wellness")}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                {t("landing", "navWellness")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("privacy")}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                {t("landing", "navPrivacy")}
              </button>
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> {t("landing", "footerDisclaimer")}
            </p>
            <p className="leading-relaxed text-[11px]">
              References: World Health Organization (WHO), American College of Obstetricians and Gynecologists (ACOG), National Health Service (NHS), National Tele Mental Health Programme of India (Tele-MANAS: 14416).
            </p>
            <p className="pt-2 text-[11px] text-[var(--muted)]">
              © {new Date().getFullYear()} {t("landing", "footerRights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

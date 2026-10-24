import { useState, useEffect } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
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

export function LandingPage({ onOpenApp }) {
  const { appData, updateSettings } = useAppData();
  const { lang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewPhase, setPreviewPhase] = useState("follicular");

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

  const cyclePhases = [
    {
      id: "menstrual",
      nameEn: "Menstrual Phase",
      nameHi: "माहवारी चरण",
      days: "Days 1 – 5",
      tone: "Rest & Hydrate",
      toneHi: "विश्राम और जलयोजन",
      descEn:
        "Your uterine lining sheds. Estrogen and progesterone are at baseline. Prioritize warm gentle meals, restorative rest, and comfortable pacing.",
      descHi:
        "एस्ट्रोजन और प्रोजेस्टेरोन का स्तर न्यूनतम होता है। गर्म पौष्टिक भोजन, आराम और शरीर की गति को धीमा रखें।",
      badgeClass: "bg-[#F7E3EC] text-[#79516F] border-[#E9B7C8] dark:bg-[#3C2333] dark:text-[#E8A8BF] dark:border-[#543048]",
    },
    {
      id: "follicular",
      nameEn: "Follicular Phase",
      nameHi: "फॉलिक्युलर चरण",
      days: "Days 6 – 13",
      tone: "Rising Energy",
      toneHi: "ऊर्जा का संचार",
      descEn:
        "FSH prompts follicles to mature and estrogen rises steadily. Mental focus, stamina, and curiosity naturally elevate as your body prepares for ovulation.",
      descHi:
        "एस्ट्रोजन बढ़ता है। मानसिक एकाग्रता, ऊर्जा और स्फूर्ति स्वाभाविक रूप से बढ़ती है जब शरीर ओव्यूलेशन की तैयारी करता है।",
      badgeClass: "bg-[#DCEBDD] text-[#3F6344] border-[#A2C8A5] dark:bg-[#1E3322] dark:text-[#C4E2C7] dark:border-[#2C4830]",
    },
    {
      id: "ovulation",
      nameEn: "Ovulation Window",
      nameHi: "ओव्यूलेशन खिड़की",
      days: "Days 14 – 16",
      tone: "Peak Vitality",
      toneHi: "चरम सक्रियता",
      descEn:
        "LH surge triggers the release of a mature egg. Energy and social confidence peak. (Note: calculated estimates are educational, not contraception).",
      descHi:
        "एलएच हार्मोन के बढ़ने से परिपक्व अंडाणु निकलता है। ऊर्जा चरम पर होती है। (नोट: अनुमान शैक्षणिक हैं, गर्भनिरोधक नहीं)।",
      badgeClass: "bg-[#FFF8EB] text-[#854D0E] border-[#FCD34D] dark:bg-[#2E2412] dark:text-[#FCD34D] dark:border-[#4D3B1E]",
    },
    {
      id: "luteal",
      nameEn: "Luteal Phase",
      nameHi: "ल्यूटियल चरण",
      days: "Days 17 – 28",
      tone: "Nurture & Ground",
      toneHi: "संरक्षण और स्थिरता",
      descEn:
        "Progesterone rises then tapers. Your metabolic rate gently climbs. Support your nervous system with magnesium-rich foods and grounding mindfulness.",
      descHi:
        "प्रोजेस्टेरोन बढ़ता है फिर घटता है। मैग्नीशियम युक्त आहार और ध्यान के माध्यम से अपने तंत्रिका तंत्र को पोषण दें।",
      badgeClass: "bg-[#F2E8F0] text-[#79516F] border-[#DECED9] dark:bg-[#34263E] dark:text-[#D9A4C7] dark:border-[#543F61]",
    },
  ];

  const activePhaseData = cyclePhases.find((p) => p.id === previewPhase) || cyclePhases[1];

  return (
    <div
      data-theme={resolvedTheme}
      data-contrast={isHighContrast ? "high" : "normal"}
      data-text-size={textSize}
      lang={lang}
      className={`min-h-screen bg-[var(--bg)] text-[var(--ink)] ${
        resolvedTheme === "dark" ? "dark" : ""
      } font-sans flex flex-col selection:bg-[#E9B7C8] selection:text-[#292536]`}
    >
      {/* 1. Refined Public Landing Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded-lg p-0.5"
              aria-label="Saheli Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8]/50 text-[var(--plum)] dark:text-[#E8A8BF] shadow-2xs group-hover:scale-105 transition-transform">
                <IconLotus className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="font-serif text-2xl font-normal tracking-tight text-[var(--ink)] leading-none block">
                  saheli
                </span>
                <span className="text-[10px] text-[var(--muted)] font-medium tracking-wide hidden sm:block">
                  {t("landing", "brandTagline")}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--muted)]" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded"
            >
              {t("landing", "navFeatures")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("wellness")}
              className="hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded"
            >
              {t("landing", "navWellness")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("privacy")}
              className="hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded"
            >
              {t("landing", "navPrivacy")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="hover:text-[var(--ink)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[var(--plum)] rounded"
            >
              {t("landing", "navAbout")}
            </button>
          </nav>

          {/* Right Controls: Language Selector & Primary CTA */}
          <div className="flex items-center gap-3">
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

            {/* Primary Action Button to enter App */}
            <button
              type="button"
              onClick={onOpenApp}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white px-4 py-2 text-xs font-bold hover:bg-[#633E5A] dark:hover:bg-[#A06B95] shadow-xs transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] cursor-pointer"
            >
              <span>{t("landing", "ctaOpen")}</span>
              <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--card-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--plum)]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--line)] bg-[var(--card)] px-4 py-4 space-y-3 shadow-md">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="block w-full text-left py-2 text-sm font-medium text-[var(--ink)] hover:text-[var(--plum)]"
            >
              {t("landing", "navFeatures")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("wellness")}
              className="block w-full text-left py-2 text-sm font-medium text-[var(--ink)] hover:text-[var(--plum)]"
            >
              {t("landing", "navWellness")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("privacy")}
              className="block w-full text-left py-2 text-sm font-medium text-[var(--ink)] hover:text-[var(--plum)]"
            >
              {t("landing", "navPrivacy")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 text-sm font-medium text-[var(--ink)] hover:text-[var(--plum)]"
            >
              {t("landing", "navAbout")}
            </button>

            <div className="pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={onOpenApp}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white py-3 text-xs font-bold hover:bg-[#633E5A] shadow-xs"
              >
                <span>{t("landing", "ctaOpen")}</span>
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[var(--line)]">
        {/* Subtle Decorative Ambient Gradient Blooms */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-b from-[#E9B7C8]/25 via-[#DCEBDD]/20 to-transparent blur-3xl dark:from-[#3D2636]/30 dark:via-[#1E3322]/20"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-3.5 py-1.5 shadow-2xs">
                <IconLotus className="h-3.5 w-3.5 text-[var(--plum)] dark:text-[#E8A8BF]" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--plum)] dark:text-[#E8A8BF]">
                  {t("landing", "heroEyebrow")}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] font-bold text-[var(--ink)] leading-[1.12] tracking-tight">
                {t("landing", "heroHeading")}
              </h1>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                {t("landing", "heroSubheading")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onOpenApp}
                  className="touch-target w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white px-7 py-3.5 text-sm font-bold shadow-sm hover:bg-[#633E5A] dark:hover:bg-[#A06B95] transition-all hover:translate-y-[-1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)]"
                >
                  <span>{t("landing", "ctaExplore")}</span>
                  <IconArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("features")}
                  className="touch-target w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] text-[var(--ink)] px-6 py-3.5 text-sm font-semibold hover:bg-[var(--card-subtle)] transition-all focus-visible:outline-2 focus-visible:outline-[var(--plum)]"
                >
                  <span>{t("landing", "ctaFeatures")}</span>
                  <IconChevronDown className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <IconShield className="h-4 w-4 text-[#3F6344] dark:text-[#88C690]" aria-hidden="true" />
                  <span>100% Local-First Storage</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <IconLock className="h-3.5 w-3.5 text-[#3F6344] dark:text-[#88C690]" aria-hidden="true" />
                  <span>No Account Required</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <IconBookOpen className="h-3.5 w-3.5 text-[var(--plum)]" aria-hidden="true" />
                  <span>Clinical WHO & ACOG Sources</span>
                </span>
              </div>
            </div>

            {/* Right Visual Composition: Interactive Cycle Phases Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl border border-[var(--line-strong)] bg-[var(--card)] p-6 sm:p-7 shadow-md">
                {/* Header label in card */}
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#88C690] animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                      {lang === "hi" ? "चक्र चरण सिमुलेशन" : "Cycle Phases Rhythm"}
                    </span>
                  </div>
                  <span className="rounded-full bg-[var(--card-subtle)] border border-[var(--line)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                    {lang === "hi" ? "पूर्वावलोकन" : "Interactive Preview"}
                  </span>
                </div>

                {/* Concentric Cycle Wheel Graphic */}
                <div className="my-6 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                    {/* Outer decorative ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--line-strong)]" />
                    
                    {/* SVG Segmented Arc Indicator */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-[var(--card-subtle)]"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeDasharray="251.2"
                        strokeDashoffset={
                          previewPhase === "menstrual"
                            ? "188"
                            : previewPhase === "follicular"
                            ? "125"
                            : previewPhase === "ovulation"
                            ? "90"
                            : "30"
                        }
                        strokeLinecap="round"
                        className="text-[#79516F] dark:text-[#E8A8BF] transition-all duration-700 ease-out"
                      />
                    </svg>

                    {/* Center Core */}
                    <div className="absolute inset-4 rounded-full bg-[var(--card-subtle)] border border-[var(--line)] flex flex-col items-center justify-center text-center p-3 shadow-inner">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                        {activePhaseData.days}
                      </span>
                      <p className="font-serif text-sm sm:text-base font-bold text-[var(--ink)] mt-0.5">
                        {lang === "hi" ? activePhaseData.nameHi : activePhaseData.nameEn}
                      </p>
                      <span className="text-[11px] text-[var(--plum)] font-medium mt-0.5">
                        {lang === "hi" ? activePhaseData.toneHi : activePhaseData.tone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phase Selection Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[var(--card-subtle)] border border-[var(--line)]">
                  {cyclePhases.map((phase) => {
                    const isSelected = previewPhase === phase.id;
                    return (
                      <button
                        key={phase.id}
                        type="button"
                        onClick={() => setPreviewPhase(phase.id)}
                        className={`rounded-xl py-1.5 text-[11px] font-semibold transition-all ${
                          isSelected
                            ? "bg-[#79516F] text-white shadow-2xs font-bold dark:bg-[#8D5C82]"
                            : "text-[var(--muted)] hover:text-[var(--ink)]"
                        }`}
                      >
                        {phase.id === "menstrual"
                          ? lang === "hi" ? "माहवारी" : "Period"
                          : phase.id === "follicular"
                          ? lang === "hi" ? "फॉलिक्युलर" : "Follicle"
                          : phase.id === "ovulation"
                          ? lang === "hi" ? "ओव्यूलेशन" : "Ovulate"
                          : lang === "hi" ? "ल्यूटियल" : "Luteal"}
                      </button>
                    );
                  })}
                </div>

                {/* Explanatory description card */}
                <div className="mt-4 rounded-2xl p-3.5 border text-xs leading-relaxed transition-all duration-300">
                  <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border mb-1.5 ${activePhaseData.badgeClass}`}>
                    {lang === "hi" ? activePhaseData.nameHi : activePhaseData.nameEn}
                  </div>
                  <p className="text-[var(--ink)]">
                    {lang === "hi" ? activePhaseData.descHi : activePhaseData.descEn}
                  </p>
                </div>

                {/* Sample Note */}
                <p className="mt-3 text-[10px] text-center text-[var(--muted)]">
                  {t("landing", "heroSampleNote")}
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
            <IconLotus className="h-6 w-6" />
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
              onClick={onOpenApp}
              className="touch-target inline-flex items-center gap-2.5 rounded-2xl bg-[#79516F] dark:bg-[#8D5C82] text-white px-8 py-4 text-base font-bold shadow-md hover:bg-[#633E5A] dark:hover:bg-[#A06B95] transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] cursor-pointer"
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
            <div className="flex items-center gap-2.5">
              <IconLotus className="h-5 w-5 text-[var(--plum)]" aria-hidden="true" />
              <span className="font-serif text-2xl font-bold text-[var(--ink)]">saheli</span>
              <span className="text-xs text-[var(--muted)]">· {t("landing", "brandTagline")}</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
              <button
                type="button"
                onClick={onOpenApp}
                className="text-[var(--plum)] font-bold hover:underline"
              >
                {t("landing", "ctaOpen")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="hover:text-[var(--ink)]"
              >
                {t("landing", "navFeatures")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("wellness")}
                className="hover:text-[var(--ink)]"
              >
                {t("landing", "navWellness")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("privacy")}
                className="hover:text-[var(--ink)]"
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

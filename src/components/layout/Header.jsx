import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import {
  IconSaheliHeart,
  IconLeaf,
  IconLock,
  IconSettingsGear,
} from "../common/Icons.jsx";

export function Header({ onOpenSettings, onNavigateToLanding }) {
  const { appData, updateSettings } = useAppData();
  const { lang, t } = useTranslation();

  const isDiscreet = Boolean(appData.settings.discreetMode);
  const brandTitle = isDiscreet
    ? (lang === "hi" ? "दैनिक वेलनेस" : "Daily Wellness")
    : t("common", "appName");
  const brandTagline = isDiscreet
    ? t("common", "discreetTagline")
    : t("common", "appTagline");

  return (
    <header className="border-b border-[var(--line)] bg-[var(--card)]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* Brand area — Saheli wordmark as visual anchor with hidden-heart emblem and navigation back to landing */}
        <div className="flex flex-col min-w-0">
          <button
            type="button"
            onClick={onNavigateToLanding}
            className="group flex items-center gap-2 text-left rounded-lg p-0.5 -ml-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] cursor-pointer"
            aria-label={lang === "hi" ? "सहेली होम / अवलोकन पर जाएं" : "Saheli - Return to Overview"}
            title={lang === "hi" ? "होम / लैंडिंग पेज पर जाएं" : "Go to Landing Page / Overview"}
          >
            <h1 className="font-serif text-2xl sm:text-[26px] font-normal tracking-tight text-[var(--ink)] leading-none select-none group-hover:text-[var(--plum)] transition-colors">
              {brandTitle}
            </h1>
            {isDiscreet ? (
              <IconLeaf className="h-4.5 w-4.5 text-[var(--plum)] stroke-[1.6] shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
            ) : (
              <IconSaheliHeart className="h-4.5 w-4.5 text-[var(--plum)] stroke-[1.6] shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
            )}
          </button>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-[11px] text-[var(--muted)] font-normal leading-tight tracking-wide">
              {brandTagline}
            </p>
            <span className="text-[var(--line-strong)] text-[10px] hidden sm:inline" aria-hidden="true">
              ·
            </span>
            {/* Discreet secondary privacy indicator (subdued so it never competes with wordmark) */}
            <span
              className="inline-flex items-center gap-1 text-[10px] text-[var(--muted)] opacity-85 cursor-default font-normal"
              title={t("common", "privacyNotice")}
            >
              <IconLock className="h-2.5 w-2.5 shrink-0 opacity-70" aria-hidden="true" />
              <span className="hidden sm:inline">{t("common", "privacyNotice")}</span>
              <span className="inline sm:hidden">{lang === "hi" ? "निजी" : "Private"}</span>
            </span>
          </div>
        </div>

        {/* Actions — right: overview link, compact EN/हिंदी selector, and refined settings button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-2">
          {/* Discreet link back to landing page overview */}
          {onNavigateToLanding && (
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--card-subtle)] text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--plum)]/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)]"
              title={lang === "hi" ? "सहेली अवलोकन देखें" : "View Saheli Overview"}
            >
              <span>{lang === "hi" ? "अवलोकन" : "Overview"}</span>
            </button>
          )}

          {/* Compact, elegant EN / हिंदी selector */}
          <div
            role="radiogroup"
            aria-label={lang === "hi" ? "भाषा चयन" : "Language selection"}
            className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--card-subtle)] p-0.5 text-xs shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={lang === "en"}
              onClick={() => updateSettings({ language: "en" })}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] ${
                lang === "en"
                  ? "bg-[#79516F] text-white shadow-2xs font-bold dark:bg-[#8D5C82]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
              aria-label="English"
            >
              EN
            </button>
            <span className="text-[var(--line-strong)] mx-0.5 text-[9px] select-none" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              role="radio"
              aria-checked={lang === "hi"}
              onClick={() => updateSettings({ language: "hi" })}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)] ${
                lang === "hi"
                  ? "bg-[#79516F] text-white shadow-2xs font-bold dark:bg-[#8D5C82]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
              aria-label="Hindi (हिंदी)"
            >
              हिंदी
            </button>
          </div>

          {/* Refined settings icon button */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-[var(--line)] bg-[var(--card-subtle)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--plum)]/30 shadow-2xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)]"
              aria-label={t("nav", "settings")}
              title={t("nav", "settings")}
            >
              <IconSettingsGear
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

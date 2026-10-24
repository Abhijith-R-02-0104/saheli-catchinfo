import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import {
  IconLotus,
  IconLeaf,
  IconLock,
  IconSettingsGear,
} from "../common/Icons.jsx";

export function Header({ onOpenSettings }) {
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Brand area — Saheli wordmark as visual anchor with botanical emblem */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-[28px] font-normal tracking-tight text-[var(--ink)] leading-none select-none">
              {brandTitle}
            </h1>
            {isDiscreet ? (
              <IconLeaf className="h-5 w-5 text-[var(--plum)] stroke-[1.6] shrink-0" aria-hidden="true" />
            ) : (
              <IconLotus className="h-5 w-5 text-[var(--plum)] stroke-[1.6] shrink-0" aria-hidden="true" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-[11px] sm:text-xs text-[var(--muted)] font-normal leading-tight tracking-wide">
              {brandTagline}
            </p>
            <span className="text-[var(--line-strong)] text-xs hidden sm:inline" aria-hidden="true">
              ·
            </span>
            {/* Discreet secondary privacy indicator (no oversized green pill) */}
            <span
              className="inline-flex items-center gap-1 text-[11px] text-[#3F6344] dark:text-[#88C690] cursor-default font-medium"
              title={t("common", "privacyNotice")}
            >
              <IconLock className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{t("common", "privacyNotice")}</span>
              <span className="inline sm:hidden">{lang === "hi" ? "निजी" : "Private"}</span>
            </span>
          </div>
        </div>

        {/* Actions — right: compact EN/हिंदी selector and matching refined settings */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-3">
          {/* Compact, elegant EN / हिंदी selector */}
          <div
            role="radiogroup"
            aria-label={lang === "hi" ? "भाषा चयन" : "Language selection"}
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

          {/* Refined settings icon button */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[var(--line-strong)] bg-[var(--card-subtle)] text-[var(--ink)] shadow-2xs transition-all hover:bg-[var(--plum-light)] hover:text-[var(--plum)] hover:border-[var(--plum)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plum)]"
              aria-label={t("nav", "settings")}
              title={t("nav", "settings")}
            >
              <IconSettingsGear
                className="h-4 w-4 text-[var(--ink)] hover:text-[var(--plum)] transition-colors"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { Header } from "./Header.jsx";
import { Navigation } from "./Navigation.jsx";

export function Layout({ activeTab, onSelectTab, children }) {
  const { appData, storageError, clearStorageError } = useAppData();
  const { lang, t } = useTranslation();

  const isHighContrast = Boolean(appData.settings.highContrast);
  const textSize = appData.settings.textSize || "normal";
  const themeSetting = appData.settings.theme || "light";

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

  return (
    <div
      data-theme={resolvedTheme}
      data-contrast={isHighContrast ? "high" : "normal"}
      data-text-size={textSize}
      lang={lang}
      className={`min-h-screen bg-[var(--bg)] text-[var(--ink)] ${
        resolvedTheme === "dark" ? "dark" : ""
      } font-sans flex flex-col transition-colors selection:bg-[#E9B7C8] selection:text-[#292536]`}
    >
      {/* 1. Storage Warning Alert Banner (Preserved from Phase 2) */}
      {storageError && (
        <aside
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-lg">⚠️</span>
            <p className="text-sm font-medium">
              <strong className="font-semibold">
                {lang === "hi" ? "स्टोरेज चेतावनी:" : "Storage warning:"}
              </strong>{" "}
              {storageError}
            </p>
          </div>
          <button
            type="button"
            onClick={clearStorageError}
            className="touch-target inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-amber-800"
            aria-label={t("buttons", "dismiss")}
          >
            {t("buttons", "dismiss")}
          </button>
        </aside>
      )}

      {/* 2. Top Header with Branding & Language Switcher */}
      <Header onOpenSettings={() => onSelectTab("settings")} />

      {/* 3. Navigation Bar (Desktop top bar + Mobile bottom bar) */}
      <Navigation activeTab={activeTab} onSelectTab={onSelectTab} />

      {/* 4. Main Page Content Canvas */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 md:py-8 pb-32 md:pb-16">
        {children}
      </main>

      {/* 5. Serene & Accessible Footer */}
      <footer className="mt-auto border-t border-[var(--line)] bg-[var(--card-subtle)] px-4 py-8 text-center text-xs text-[var(--muted)] hidden md:block">
        <div className="mx-auto max-w-4xl space-y-2">
          <p className="font-medium text-[var(--ink)]">
            {t("common", "medicalDisclaimer")}
          </p>
          <p>
            {t("common", "privacyNotice")} · {t("common", "appName")}
          </p>
        </div>
      </footer>
    </div>
  );
}

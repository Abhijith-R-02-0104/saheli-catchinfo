import { useState } from "react";

import { AppDataContext } from "./appDataContext.js";

import {
  loadAppData,
  saveAppData,
  saveDayLog,
  deleteDayLog as deleteStoredDayLog,
  clearAppData,
  getRawStoredData,
} from "../repositories/appRepository.js";

import { createDefaultAppData } from "../data/defaultAppData.js";

export function AppDataProvider({ children }) {
  const [initError, setInitError] = useState(() => {
    try {
      loadAppData();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  });

  const [appData, setAppData] = useState(() => {
    try {
      return loadAppData();
    } catch {
      return createDefaultAppData();
    }
  });

  const [storageError, setStorageError] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  function updateDayLog(date, log) {
    try {
      saveDayLog(date, log);
      setStorageError(null);
      setAppData(loadAppData());
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStorageError(`Failed to save log to local storage: ${message}`);
      // Requirement 6: Ensure the UI does not lose its current in-memory data
      // merely because a persistence operation failed.
      setAppData((prev) => ({
        ...prev,
        logsByDate: {
          ...prev.logsByDate,
          [date]: {
            ...log,
            date,
          },
        },
      }));
      return { success: false, error };
    }
  }

  function deleteDayLog(date) {
    try {
      deleteStoredDayLog(date);
      setStorageError(null);
      setAppData(loadAppData());
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStorageError(`Failed to delete log from local storage: ${message}`);
      setAppData((prev) => {
        const nextLogs = { ...prev.logsByDate };
        delete nextLogs[date];
        return {
          ...prev,
          logsByDate: nextLogs,
        };
      });
      return { success: false, error };
    }
  }

  function updateSettings(patch) {
    try {
      const current = loadAppData();
      const nextData = {
        ...current,
        settings: {
          ...current.settings,
          ...patch,
        },
      };

      saveAppData(nextData);
      setStorageError(null);
      setAppData(nextData);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStorageError(`Failed to save settings to local storage: ${message}`);
      setAppData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...patch,
        },
      }));
      return { success: false, error };
    }
  }

  function resetData() {
    try {
      clearAppData();
      setStorageError(null);
      setInitError(null);
      setShowResetConfirm(false);
      setAppData(createDefaultAppData());
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStorageError(`Failed to clear local storage: ${message}`);
      setAppData(createDefaultAppData());
      return { success: false, error };
    }
  }

  function clearStorageError() {
    setStorageError(null);
  }

  function handleCopyRawData() {
    const raw = getRawStoredData() ?? "";
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(raw)
        .then(() => {
          setCopiedRaw(true);
          setCopyFailed(false);
          setTimeout(() => setCopiedRaw(false), 2500);
        })
        .catch(() => {
          setCopyFailed(true);
          setCopiedRaw(false);
        });
    } else {
      setCopyFailed(true);
      setCopiedRaw(false);
    }
  }

  // If corrupted or invalid data prevented startup, render accessible recovery interface
  if (initError !== null) {
    const rawData = getRawStoredData() ?? "No raw data found in storage.";

    return (
      <main className="min-h-screen bg-[#FBF7F3] px-4 py-12 text-[#292536] font-sans">
        <section
          role="alertdialog"
          aria-labelledby="recovery-title"
          aria-describedby="recovery-desc"
          className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-md ring-1 ring-[#DECED9] sm:p-8"
        >
          <div className="flex items-center gap-3 text-[#8F1D1D]">
            <span aria-hidden="true" className="text-2xl">⚠️</span>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8F1D1D]">
              Saheli · Data Recovery
            </p>
          </div>

          <h1 id="recovery-title" className="mt-3 text-2xl font-bold text-[#292536]">
            Unable to read saved data
          </h1>

          <p id="recovery-desc" className="mt-3 text-slate-700 leading-relaxed">
            Saheli could not read your existing records because the saved data appears corrupted or has an unsupported format.
          </p>

          <div className="mt-4 rounded-xl border border-[#F4B8B0] bg-[#FDF2F0] p-4 text-sm text-[#8F1D1D]">
            <p className="font-semibold">Reason:</p>
            <p className="mt-1 font-mono text-xs break-all">{initError}</p>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Your data has not been deleted:</p>
            <p className="mt-1">
              To protect your health records, Saheli has preserved the stored data as-is. It will not be overwritten automatically.
            </p>
          </div>

          <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-slate-800 select-none">
              Inspect raw unreadable data
            </summary>
            <pre
              tabIndex={0}
              className="mt-3 max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-green-300 select-all focus:ring-2 focus:ring-[#79516F] focus:outline-none"
            >
              {rawData}
            </pre>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyRawData}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#79516F]"
              >
                {copiedRaw ? "Copied to clipboard!" : "Copy raw data to clipboard"}
              </button>
              {copyFailed && (
                <p role="status" className="text-xs text-amber-800">
                  Clipboard access was denied or unsupported. Please select the text above directly to copy manually.
                </p>
              )}
            </div>
          </details>

          {!showResetConfirm ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#79516F]"
              >
                Retry loading
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="min-h-12 flex-1 rounded-xl bg-[#8F1D1D] px-5 py-3 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-red-700"
              >
                Reset data &amp; start fresh
              </button>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border-2 border-red-300 bg-red-50 p-5">
              <h2 className="text-base font-bold text-red-900">
                Are you sure you want to reset?
              </h2>
              <p className="mt-2 text-sm text-red-800 leading-relaxed">
                This will permanently erase the unreadable storage data on this device and initialize a fresh, clean Saheli profile. This action cannot be undone.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetData}
                  className="min-h-12 flex-1 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-red-700"
                >
                  Yes, permanently reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  const value = {
    appData,
    updateDayLog,
    deleteDayLog,
    updateSettings,
    resetData,
    storageError,
    clearStorageError,
    initError,
  };

  return (
    <AppDataContext.Provider value={value}>
      {storageError && (
        <div
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-lg">⚠️</span>
            <p className="text-sm font-medium">
              <strong className="font-semibold">Storage warning:</strong> {storageError}
            </p>
          </div>
          <button
            type="button"
            onClick={clearStorageError}
            className="min-h-8 rounded-lg px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-amber-800"
            aria-label="Dismiss storage warning"
          >
            Dismiss
          </button>
        </div>
      )}
      {children}
    </AppDataContext.Provider>
  );
}

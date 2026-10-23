import { useState } from "react";

import { AppDataContext } from "./appDataContext.js";

import {
  loadAppData,
  saveAppData,
  saveDayLog,
  deleteDayLog as deleteStoredDayLog,
  clearAppData,
} from "../repositories/appRepository.js";

import { createDefaultAppData } from "../data/defaultAppData.js";

export function AppDataProvider({ children }) {
  const [appData, setAppData] = useState(() => loadAppData());

  function updateDayLog(date, log) {
    saveDayLog(date, log);
    setAppData(loadAppData());
  }

  function deleteDayLog(date) {
    deleteStoredDayLog(date);
    setAppData(loadAppData());
  }

  function updateSettings(patch) {
    const nextData = {
      ...appData,
      settings: {
        ...appData.settings,
        ...patch,
      },
    };

    saveAppData(nextData);
    setAppData(nextData);
  }

  function resetData() {
    clearAppData();
    setAppData(createDefaultAppData());
  }

  const value = {
    appData,
    updateDayLog,
    deleteDayLog,
    updateSettings,
    resetData,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

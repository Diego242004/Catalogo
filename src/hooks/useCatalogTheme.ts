"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "jersey-catalog-theme";
const THEME_EVENT = "jersey-catalog-theme-change";
let memoryTheme = false;

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    memoryTheme = window.localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    // Some privacy settings disable storage. The theme still works in memory.
  }
  return memoryTheme;
}

function getServerSnapshot() {
  return false;
}

export function useCatalogTheme() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    memoryTheme = !isDark;
    try {
      window.localStorage.setItem(STORAGE_KEY, memoryTheme ? "dark" : "light");
    } catch {
      // Keep the selected theme for this page session when storage is blocked.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { isDark, toggleTheme };
}

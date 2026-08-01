"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "jersey-catalog-theme";
const THEME_EVENT = "jersey-catalog-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "dark";
}

function getServerSnapshot() {
  return false;
}

export function useCatalogTheme() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    window.localStorage.setItem(STORAGE_KEY, isDark ? "light" : "dark");
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { isDark, toggleTheme };
}

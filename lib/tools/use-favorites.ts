"use client";
import { useCallback, useEffect, useState } from "react";
const STORAGE_KEY = "gaget:favorites:v1";
const CHANGE_EVENT = "gaget:favorites-change";
function readFavorites(): string[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch { return []; }
}
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(CHANGE_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const toggleFavorite = useCallback((href: string) => {
    const current = readFavorites();
    const next = current.includes(href) ? current.filter((item) => item !== href) : [...current, href];
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage may be unavailable. */ }
    setFavorites(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  return { favorites, toggleFavorite };
}

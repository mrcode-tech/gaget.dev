"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/messages";

export const MOBILE_FEATURE_SEARCH_BREAKPOINT = 768;
export const FEATURE_SEARCH_THRESHOLD = 8;

export function shouldShowFeatureSearch(featureCount: number, viewportWidth: number): boolean {
  return viewportWidth < MOBILE_FEATURE_SEARCH_BREAKPOINT && featureCount > FEATURE_SEARCH_THRESHOLD;
}

export function matchesFeatureSearch(query: string, fields: readonly string[], locale: Locale = "en"): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  if (!normalizedQuery) return true;
  return fields.join(" ").toLocaleLowerCase(locale).includes(normalizedQuery);
}

export function useFeatureMenuSearch(isOpen: boolean, featureCount: number, editorKey: string, locale: Locale) {
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState("");
  const editorKeyRef = useRef(editorKey);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_FEATURE_SEARCH_BREAKPOINT);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (editorKeyRef.current !== editorKey) {
      editorKeyRef.current = editorKey;
      setQuery("");
    }
    if (!isOpen || !isMobile || featureCount <= FEATURE_SEARCH_THRESHOLD) setQuery("");
  }, [isOpen, isMobile, featureCount, editorKey]);

  return {
    canSearch: isOpen && shouldShowFeatureSearch(featureCount, isMobile ? MOBILE_FEATURE_SEARCH_BREAKPOINT - 1 : MOBILE_FEATURE_SEARCH_BREAKPOINT),
    query: isOpen && isMobile && featureCount > FEATURE_SEARCH_THRESHOLD ? query : "",
    setQuery,
    matches: (fields: readonly string[]) => matchesFeatureSearch(isOpen && isMobile && featureCount > FEATURE_SEARCH_THRESHOLD ? query : "", fields, locale),
  };
}

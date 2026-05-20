"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "spendlens_form";

export function useFormPersist<T>(
  state: T,
  setState: (value: T) => void
) {
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch {
      // Silently fail on parse errors
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage on every state change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full or unavailable
    }
  }, [state]);

  const clearForm = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { clearForm };
}

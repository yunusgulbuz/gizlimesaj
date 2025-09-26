"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const PREVIEW_WIDTH_STORAGE_KEY = "previewWidth";

export const PREVIEW_MIN_PX = 320;
export const PREVIEW_MAX_PX = 900;
export const PREVIEW_MIN_RATIO = 0.2;
export const PREVIEW_MAX_RATIO = 0.7;

const DEFAULT_WIDTH = 520;

const isBrowser = () => typeof window !== "undefined";

export const clampPreviewWidth = (width: number, containerWidth?: number | null) => {
  if (!containerWidth || containerWidth <= 0) {
    return Math.min(Math.max(width, PREVIEW_MIN_PX), PREVIEW_MAX_PX);
  }

  const minFromRatio = PREVIEW_MIN_RATIO * containerWidth;
  const maxFromRatio = PREVIEW_MAX_RATIO * containerWidth;
  const effectiveMin = Math.max(PREVIEW_MIN_PX, Math.floor(minFromRatio));
  const effectiveMax = Math.min(PREVIEW_MAX_PX, Math.ceil(maxFromRatio));

  if (effectiveMin > effectiveMax) {
    return Math.min(Math.max(width, PREVIEW_MIN_PX), PREVIEW_MAX_PX);
  }

  return Math.min(Math.max(width, effectiveMin), effectiveMax);
};

export function usePreviewWidth() {
  const hasHydrated = useRef(false);
  const [width, setWidthState] = useState<number>(DEFAULT_WIDTH);

  useEffect(() => {
    if (!isBrowser()) return;
    try {
      const stored = window.localStorage.getItem(PREVIEW_WIDTH_STORAGE_KEY);
      if (stored) {
        const parsed = Number.parseFloat(stored);
        if (!Number.isNaN(parsed)) {
          setWidthState(parsed);
        }
      }
    } catch (error) {
      console.warn("usePreviewWidth: failed to load stored width", error);
    }
    hasHydrated.current = true;
  }, []);

  const setWidth = useCallback((nextWidth: number) => {
    setWidthState(nextWidth);
  }, []);

  const commitWidth = useCallback((nextWidth: number) => {
    setWidthState(nextWidth);
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(PREVIEW_WIDTH_STORAGE_KEY, String(Math.round(nextWidth)));
    } catch (error) {
      console.warn("usePreviewWidth: failed to persist width", error);
    }
  }, []);

  return { width, setWidth, commitWidth, hasHydrated } as const;
}


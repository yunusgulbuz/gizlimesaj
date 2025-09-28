"use client";

import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PreviewPane from "./PreviewPane";
import ResizeHandle from "./ResizeHandle";
import { PREVIEW_MIN_PX, PREVIEW_MAX_PX, clampPreviewWidth } from "@/hooks/usePreviewWidth";

interface ResizableLayoutProps {
  form: ReactNode;
  preview: ReactNode;
  previewWidth: number;
  commitPreviewWidth: (width: number) => void;
  previewUrl?: string;
}

type ActiveTab = "form" | "preview";

const SPRING = { type: "spring", stiffness: 140, damping: 22, mass: 1 } as const;

export default function ResizableLayout({ form, preview, previewWidth, commitPreviewWidth, previewUrl }: ResizableLayoutProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("form");
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentWidth, setCurrentWidth] = useState<number>(previewWidth);

  const widthMotion = useMotionValue(previewWidth);
  const widthVar = useMotionTemplate`${widthMotion}px`;

  const effectiveMinMax = useMemo(() => {
    if (!containerWidth) {
      return { min: PREVIEW_MIN_PX, max: PREVIEW_MAX_PX };
    }
    return {
      min: clampPreviewWidth(PREVIEW_MIN_PX, containerWidth),
      max: clampPreviewWidth(PREVIEW_MAX_PX, containerWidth),
    };
  }, [containerWidth]);

  useEffect(() => {
    setCurrentWidth(previewWidth);
    if (!isDragging) {
      animate(widthMotion, previewWidth, { ...SPRING });
    }
  }, [previewWidth, widthMotion, isDragging]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (!event.matches) {
        setActiveTab("form");
      }
    };

    setIsDesktop(media.matches);
    if (!media.matches) {
      setActiveTab("form");
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerWidth) return;
    setCurrentWidth((prev) => {
      const clamped = clampPreviewWidth(prev, containerWidth);
      if (Math.abs(clamped - prev) > 0.5) {
        widthMotion.set(clamped);
        return clamped;
      }
      return prev;
    });
  }, [containerWidth, widthMotion]);

  const applyWidthFromClientX = useCallback((clientX: number) => {
    const element = containerRef.current;
    if (!element) return;
    const { left, width } = element.getBoundingClientRect();
    if (width <= 0) return;

    const offset = clientX - left;
    const proposed = width - offset;
    const clamped = clampPreviewWidth(proposed, width);

    widthMotion.set(clamped);
    setCurrentWidth(clamped);
  }, [widthMotion]);

  const stopDragging = useCallback((clientX?: number) => {
    const handleEl = handleRef.current;
    if (pointerIdRef.current !== null && handleEl) {
      handleEl.releasePointerCapture?.(pointerIdRef.current);
    }
    pointerIdRef.current = null;
    setIsDragging(false);

    const finalWidth = clampPreviewWidth(clientX ? (() => {
      const element = containerRef.current;
      if (!element) return currentWidth;
      const { left, width } = element.getBoundingClientRect();
      const offset = clientX - left;
      return width - offset;
    })() : currentWidth, containerWidth);

    commitPreviewWidth(finalWidth);
    setCurrentWidth(finalWidth);
    animate(widthMotion, finalWidth, { ...SPRING });
  }, [commitPreviewWidth, containerWidth, currentWidth, widthMotion]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    event.preventDefault();
    pointerIdRef.current = event.pointerId;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    applyWidthFromClientX(event.clientX);

    const handleMove = (moveEvent: PointerEvent) => {
      applyWidthFromClientX(moveEvent.clientX);
    };

    const handleUp = (upEvent: PointerEvent) => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      stopDragging(upEvent.clientX);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
  }, [applyWidthFromClientX, isDesktop, stopDragging]);

  const handleKeyAdjust = useCallback((delta: number) => {
    if (!isDesktop) return;
    const element = containerRef.current;
    if (!element) return;
    const { width } = element.getBoundingClientRect();
    const nextWidth = clampPreviewWidth(currentWidth + delta, width);
    setCurrentWidth(nextWidth);
    commitPreviewWidth(nextWidth);
    animate(widthMotion, nextWidth, { ...SPRING });
  }, [commitPreviewWidth, currentWidth, isDesktop, widthMotion]);

  const animateToPercent = useCallback((percent: number) => {
    const element = containerRef.current;
    if (!element) return;
    const { width } = element.getBoundingClientRect();
    const target = clampPreviewWidth(width * percent, width);
    setCurrentWidth(target);
    commitPreviewWidth(target);
    animate(widthMotion, target, { ...SPRING });
  }, [commitPreviewWidth, widthMotion]);

  const layoutClass = isDesktop
    ? "relative flex w-full gap-0 rounded-3xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur"
    : "rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur";

  return (
    <section ref={containerRef} className="mt-10">
      <div className={layoutClass}>
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="w-full lg:flex-1 lg:pr-4">
            <div className="lg:hidden">
              <div role="tablist" aria-label="Şablon düzenleyici" className="mb-4 flex rounded-full bg-white/70 p-1 shadow-inner ring-1 ring-white/60">
                {(["form", "preview"] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    type="button"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 ${
                      activeTab === tab ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "form" ? "Form" : "Önizleme"}
                  </button>
                ))}
              </div>
            </div>

            <div className={activeTab === "form" ? "block" : "hidden lg:block"}>
              {form}
            </div>

            <AnimatePresence>
              {activeTab === "preview" && !isDesktop && (
                <motion.div
                  key="mobile-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mt-4"
                >
                  <PreviewPane
                    mode="mobile"
                    widthMotion={widthMotion}
                    widthVariable={widthVar}
                    onExpand={() => animateToPercent(0.7)}
                    onCompress={() => animateToPercent(0.35)}
                    onOpenPreview={() => {
                      if (!previewUrl) return;
                      window.open(previewUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    {preview}
                  </PreviewPane>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden items-stretch lg:flex lg:gap-3">
            <div className="relative flex h-full w-[18px] items-center justify-center">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-rose-200 via-purple-200 to-indigo-200" />
              <ResizeHandle
                ref={handleRef}
                onPointerDown={handlePointerDown}
                onKeyAdjust={handleKeyAdjust}
                value={currentWidth}
                min={effectiveMinMax.min}
                max={effectiveMinMax.max}
              />
            </div>
            <PreviewPane
              widthMotion={widthMotion}
              widthVariable={widthVar}
              onExpand={() => animateToPercent(0.7)}
              onCompress={() => animateToPercent(0.35)}
              onOpenPreview={() => {
                if (!previewUrl) return;
                window.open(previewUrl, "_blank", "noopener,noreferrer");
              }}
            >
              {preview}
            </PreviewPane>
          </div>
        </div>
      </div>
    </section>
  );
}

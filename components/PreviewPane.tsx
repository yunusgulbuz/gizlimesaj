"use client";

import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import PreviewHeader from "./PreviewHeader";

type PreviewMotionStyle = MotionStyle & { "--preview-w": string };

interface PreviewPaneProps {
  widthMotion: MotionValue<number>;
  widthVariable: MotionValue<string>;
  onExpand: () => void;
  onCompress: () => void;
  mode?: "desktop" | "mobile";
  onOpenPreview: () => void;
  children: ReactNode;
}

const OVERLAY_TRANSITION = { type: "spring", stiffness: 180, damping: 24 } as const;

export default function PreviewPane({
  widthMotion,
  widthVariable,
  onExpand,
  onCompress,
  mode = "desktop",
  onOpenPreview,
  children,
}: PreviewPaneProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssWidth, setCssWidth] = useState("520px");

  useEffect(() => {
    const initial = widthVariable.get();
    if (initial) {
      setCssWidth(initial);
    }
  }, [widthVariable]);

  useMotionValueEvent(widthVariable, "change", (value) => {
    if (value) {
      setCssWidth(value);
    }
  });

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const handleFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  const inlineStyle: PreviewMotionStyle = useMemo(() => {
    if (mode === "desktop") {
      return {
        width: widthMotion,
        maxWidth: "100%",
        flex: "0 0 auto",
        "--preview-w": cssWidth,
      } satisfies PreviewMotionStyle;
    }
    return {
      width: "100%",
      maxWidth: "100%",
      flex: "0 0 auto",
      "--preview-w": cssWidth,
    } satisfies PreviewMotionStyle;
  }, [cssWidth, mode, widthMotion]);

  const scrollContainer = (
    <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-purple-50 to-rose-50 shadow-inner">
      <div className="preview-scroll h-full overflow-y-auto px-5 py-6">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <motion.div className="preview-shell flex h-full flex-col" style={inlineStyle}>
        <div className="preview-pane flex h-full flex-col gap-4 rounded-2xl bg-white/85 p-4 shadow-2xl shadow-purple-200/40 ring-1 ring-white/70 backdrop-blur">
          <PreviewHeader
            widthLabel={cssWidth}
            onExpand={onExpand}
            onCompress={onCompress}
            onFullscreen={handleFullscreen}
            onOpenPreview={onOpenPreview}
          />
          {scrollContainer}
        </div>
      </motion.div>

      {isFullscreen && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isFullscreen && (
                <motion.div
                  key="preview-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={OVERLAY_TRANSITION}
                    className="mx-auto max-h-[90vh] w-full max-w-[min(900px,90vw)] overflow-hidden rounded-3xl bg-white/90 p-6 shadow-2xl"
                    style={{ "--preview-w": cssWidth } as CSSProperties & { "--preview-w": string }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Tam ekran önizleme</h3>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">Genişlik: {cssWidth}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                        onClick={closeFullscreen}
                      >
                        Kapat (Esc)
                      </button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white via-purple-50 to-rose-50 p-6">
                      {children}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}

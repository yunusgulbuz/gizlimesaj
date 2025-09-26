"use client";

import { forwardRef } from "react";

interface ResizeHandleProps {
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onKeyAdjust: (delta: number) => void;
  value: number;
  min: number;
  max: number;
}

const KEY_STEP = 16;
const KEY_STEP_FAST = 64;

const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(function ResizeHandle(
  { onPointerDown, onKeyAdjust, value, min, max },
  ref
) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let delta = 0;
    const isFast = event.shiftKey ? KEY_STEP_FAST : KEY_STEP;

    switch (event.key) {
      case "ArrowLeft":
        delta = isFast;
        break;
      case "ArrowRight":
        delta = -isFast;
        break;
      case "Home":
        delta = max - value;
        break;
      case "End":
        delta = min - value;
        break;
      default:
        return;
    }

    event.preventDefault();
    onKeyAdjust(delta);
  };

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={Math.round(min)}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={handleKeyDown}
      className="relative z-20 hidden h-full w-3 cursor-col-resize touch-none items-center justify-center rounded-full outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:flex"
    >
      <div className="h-20 w-[3px] rounded-full bg-gradient-to-b from-rose-400 via-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(255,255,255,0.45)]" />
      <span className="sr-only">Panel genişliğini ayarla</span>
    </div>
  );
});

export default ResizeHandle;

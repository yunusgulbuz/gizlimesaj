'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CatchTheHeartProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  playfulTitle: 'Seni Seviyorum 💘',
  playfulSubtitle: 'Ama yakalarsan söyleyeceğim 😄',
  playfulButtonLabel: 'Kalbi Yakala ❤️',
  playfulInstruction: 'Hazır ol! Kalp ekranda zıpladığında yakalamak için dokun.',
  playfulChasingText: 'Kalp kaçıyor... Parmağını takip et ve yakala! 💞',
  playfulAfterClickText: 'Yakaladın! 💞',
  playfulBackgroundHelper: 'Opsiyonel arka plan için URL ekle',
  playfulCreatorLabel: 'Mesajın sahibi:',
};

// Seeded random for consistent SSR/Client rendering
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const FLOATING_HEARTS = Array.from({ length: 24 }).map((_, index) => ({
  id: index,
  left: seededRandom(index * 7) * 100,
  delay: seededRandom(index * 11) * 6,
  duration: 8 + seededRandom(index * 13) * 6,
  size: 18 + seededRandom(index * 17) * 16,
  opacity: 0.15 + seededRandom(index * 19) * 0.25,
}));

type FieldKey =
  | 'playfulTitle'
  | 'playfulSubtitle'
  | 'playfulButtonLabel'
  | 'playfulInstruction'
  | 'playfulChasingText'
  | 'playfulAfterClickText'
  | 'playfulBackgroundUrl'
  | 'playfulBackgroundHelper'
  | 'playfulCreatorLabel';

export default function CatchTheHeart({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: CatchTheHeartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isChasing, setIsChasing] = useState(false);
  const [caught, setCaught] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ top: 45, left: 40 });
  const [burstHearts, setBurstHearts] = useState<Array<{ id: number; left: number }>>([]);
  const chaseTimerRef = useRef<number | null>(null);

  const initialValues = useMemo(
    () => ({
      playfulTitle: textFields?.playfulTitle || DEFAULTS.playfulTitle,
      playfulSubtitle:
        textFields?.playfulSubtitle ||
        (recipientName ? `${recipientName}, ${DEFAULTS.playfulSubtitle}` : DEFAULTS.playfulSubtitle),
      playfulButtonLabel: textFields?.playfulButtonLabel || DEFAULTS.playfulButtonLabel,
      playfulInstruction: textFields?.playfulInstruction || DEFAULTS.playfulInstruction,
      playfulChasingText: textFields?.playfulChasingText || DEFAULTS.playfulChasingText,
      playfulAfterClickText: textFields?.playfulAfterClickText || message || DEFAULTS.playfulAfterClickText,
      playfulBackgroundUrl: textFields?.playfulBackgroundUrl || '',
      playfulBackgroundHelper: textFields?.playfulBackgroundHelper || DEFAULTS.playfulBackgroundHelper,
      playfulCreatorLabel: textFields?.playfulCreatorLabel || DEFAULTS.playfulCreatorLabel,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChasing) {
      if (chaseTimerRef.current) {
        window.clearInterval(chaseTimerRef.current);
        chaseTimerRef.current = null;
      }
      return;
    }

    const moveHeart = () => {
      setHeartPosition({
        top: 20 + Math.random() * 55,
        left: 10 + Math.random() * 75,
      });
    };

    moveHeart();
    chaseTimerRef.current = window.setInterval(moveHeart, 1100);

    return () => {
      if (chaseTimerRef.current) {
        window.clearInterval(chaseTimerRef.current);
        chaseTimerRef.current = null;
      }
    };
  }, [isChasing]);

  const displayValue = (key: FieldKey) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleContentChange = (key: FieldKey, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const handleStart = () => {
    setIsChasing(true);
    setCaught(false);
    setShowHeart(true);
    setBurstHearts([]);
  };

  const handleCatch = () => {
    setCaught(true);
    setIsChasing(false);
    setShowHeart(true);
    setBurstHearts(
      Array.from({ length: 20 }).map((_, index) => ({
        id: index,
        left: 10 + Math.random() * 80,
      }))
    );
  };

  const backgroundUrl = displayValue('playfulBackgroundUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#ff2f6e] via-[#ff5a8a] to-[#ff8fb5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]" />

      {isMounted && FLOATING_HEARTS.map((heart) => (
        <span
          key={heart.id}
          className="pointer-events-none absolute top-full text-2xl"
          style={{
            left: `${heart.left}%`,
            animation: `heart-rise ${heart.duration}s ease-in ${heart.delay}s infinite`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
        >
          💖
        </span>
      ))}

      {burstHearts.map((heart) => (
        <span
          key={`burst-${heart.id}`}
          className="pointer-events-none absolute text-xl"
          style={{
            left: `${heart.left}%`,
            top: '45%',
            animation: 'heart-burst 0.9s ease-out both',
          }}
        >
          💞
        </span>
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-8">
        <div
          className={`relative w-full max-w-3xl overflow-hidden rounded-[40px] border border-white/35 bg-white/10 p-8 shadow-[0_40px_120px_rgba(255,64,122,0.45)] backdrop-blur-2xl transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={
              backgroundUrl
                ? {
                    backgroundImage: `url(${backgroundUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff8fb5]/40 via-[#ff5a8a]/30 to-[#ff2f6e]/45" />

          <div className="relative flex flex-col items-center gap-6 text-center text-white">
            <h1
              className={`text-4xl font-semibold leading-tight drop-shadow-[0_10px_40px_rgba(255,47,110,0.55)] sm:text-5xl ${
                isEditable ? 'cursor-text rounded-3xl px-5 py-4 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('playfulTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('playfulTitle')}
            </h1>

            <p
              className={`max-w-xl text-base text-white/85 sm:text-lg ${
                isEditable ? 'cursor-text rounded-3xl px-5 py-3 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('playfulSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('playfulSubtitle')}
            </p>

            <Button
              type="button"
              onClick={handleStart}
              className="relative overflow-hidden rounded-full bg-white px-9 py-4 text-base font-semibold text-[#ff2f6e] shadow-[0_20px_70px_rgba(255,98,140,0.45)] transition-transform duration-300 hover:scale-[1.05] sm:text-lg"
            >
              <span
                className={`${isEditable ? 'cursor-text' : 'pointer-events-none'} relative z-10`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleContentChange('playfulButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('playfulButtonLabel')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff7aa5] via-white to-[#ffd3e3] opacity-0 transition-opacity duration-500 hover:opacity-60" />
            </Button>

            <p
              className={`min-h-[3rem] max-w-xl text-sm text-white/85 sm:text-base ${
                isEditable ? 'cursor-text rounded-3xl px-4 py-3 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('playfulInstruction', event.currentTarget.textContent || '')}
            >
              {!showHeart && !caught && displayValue('playfulInstruction')}
              {isChasing && displayValue('playfulChasingText')}
              {caught && displayValue('playfulAfterClickText')}
            </p>

            {isEditable && (
              <div className="flex flex-col items-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-xs text-white/80">
                <span>{displayValue('playfulBackgroundHelper')}</span>
                <span
                  className="w-full max-h-20 overflow-y-auto break-all rounded-lg bg-white/20 px-3 py-2"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('playfulBackgroundUrl', event.currentTarget.textContent?.trim() || '')
                  }
                  onInput={(event) =>
                    handleContentChange('playfulBackgroundUrl', event.currentTarget.textContent?.trim() || '')
                  }
                >
                  {backgroundUrl}
                </span>
              </div>
            )}

            {creatorName && (
              <div className="pt-2 text-sm text-white/80">
                <span
                  className={`${
                    isEditable ? 'cursor-text rounded-full px-2 py-1 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('playfulCreatorLabel', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('playfulCreatorLabel')}
                </span>{' '}
                <strong className="font-semibold text-white">{creatorName}</strong>
              </div>
            )}
          </div>

          {showHeart && (
            <button
              type="button"
              onClick={handleCatch}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-3xl text-white shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 ${
                caught ? 'animate-[heart-pop_0.8s_ease]' : 'animate-[heart-bounce_1.8s_ease-in-out_infinite]'
              }`}
              style={{ top: `${heartPosition.top}%`, left: `${heartPosition.left}%` }}
            >
              <span className="pointer-events-none">💗</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes heart-rise {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(0, -120vh, 0);
            opacity: 0;
          }
        }

        @keyframes heart-bounce {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -58%) scale(1.1);
          }
        }

        @keyframes heart-pop {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          40% {
            transform: translate(-50%, -50%) scale(1.3);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes heart-burst {
          0% {
            transform: translate3d(0, 0, 0) scale(0.4);
            opacity: 0.8;
          }
          60% {
            transform: translate3d(0, -70px, 0) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate3d(0, -120px, 0) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

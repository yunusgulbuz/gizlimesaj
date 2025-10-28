'use client';

import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

interface GlassLoveCardProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  modernTitle: 'Sevgililer Günün Kutlu Olsun ❤️',
  modernSubtitle: 'Kalbimde her zaman sen varsın.',
  modernButtonLabel: 'Sürprizi Gör 💌',
  modernAfterClickText: 'Bu kalp sadece senin için atıyor 💓',
  modernSupportingText: 'Adımlarımız aynı ritimde attıkça dünya güzelleşiyor.',
  modernPhotoPlaceholder: 'Fotoğraf URL\'si ekleyin',
  modernCreatorLabel: 'Hazırlayan:',
};

// Seeded random for consistent SSR/Client rendering
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const HEART_PARTICLES = Array.from({ length: 14 }).map((_, index) => ({
  id: index,
  size: 80 + seededRandom(index * 7) * 120,
  left: seededRandom(index * 11) * 100,
  top: seededRandom(index * 13) * 100,
  duration: 12 + seededRandom(index * 17) * 6,
  delay: seededRandom(index * 19) * 4,
  opacity: 0.12 + seededRandom(index * 23) * 0.18,
}));

type FieldKey =
  | 'modernTitle'
  | 'modernSubtitle'
  | 'modernButtonLabel'
  | 'modernAfterClickText'
  | 'modernSupportingText'
  | 'modernPhotoUrl'
  | 'modernPhotoPlaceholder'
  | 'modernCreatorLabel';

export default function GlassLoveCard({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: GlassLoveCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  const initialValues = useMemo(
    () => ({
      modernTitle: textFields?.modernTitle || DEFAULTS.modernTitle,
      modernSubtitle:
        textFields?.modernSubtitle ||
        (recipientName ? `${recipientName}, ${DEFAULTS.modernSubtitle}` : DEFAULTS.modernSubtitle),
      modernButtonLabel: textFields?.modernButtonLabel || DEFAULTS.modernButtonLabel,
      modernAfterClickText:
        textFields?.modernAfterClickText ||
        message ||
        DEFAULTS.modernAfterClickText,
      modernSupportingText: textFields?.modernSupportingText || DEFAULTS.modernSupportingText,
      modernPhotoUrl: textFields?.modernPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
      modernPhotoPlaceholder: textFields?.modernPhotoPlaceholder || DEFAULTS.modernPhotoPlaceholder,
      modernCreatorLabel: textFields?.modernCreatorLabel || DEFAULTS.modernCreatorLabel,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

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

  const handleReveal = () => {
    setShowSecret((prev) => !prev);
    setShakeCard(true);
    window.setTimeout(() => setShakeCard(false), 420);
  };

  const modernPhotoUrl = displayValue('modernPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(160deg,_#ffe5f4,_#fde9ff_45%,_#f2f6ff)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,192,203,0.45),_transparent_65%)]" />
      {isMounted && (
        <div className="absolute inset-0">
          {HEART_PARTICLES.map((heart) => (
            <span
              key={heart.id}
              className="absolute block rounded-full bg-gradient-to-br from-[#ff9ab5] via-[#ff80c0] to-[#fbc1ff]"
              style={{
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                opacity: heart.opacity,
                filter: 'blur(18px)',
                animation: `glass-heart-float ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-20 pt-16 sm:px-8">
        <div
          className={`relative w-full max-w-2xl overflow-hidden rounded-[34px] border border-white/40 bg-white/20 p-8 shadow-[0_40px_120px_rgba(255,160,190,0.45)] backdrop-blur-2xl transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={shakeCard ? { animation: 'glass-card-shake 0.45s ease-in-out' } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/0" />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center gap-4">
              {modernPhotoUrl ? (
                <div className="relative">
                  <img
                    src={modernPhotoUrl}
                    alt={displayValue('modernTitle') || 'Sevgililer Günü fotoğrafı'}
                    className="h-28 w-28 rounded-2xl border border-white/40 object-cover shadow-[0_18px_50px_rgba(255,158,190,0.45)] sm:h-32 sm:w-32"
                  />
                  {isEditable && (
                    <div
                      className="absolute inset-x-0 bottom-[-2.75rem] mx-auto w-full max-w-[16rem] overflow-x-auto break-all rounded-full border border-white/30 bg-white/70 px-3 py-1 text-[0.7rem] text-[#6d0f2b] shadow-sm"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                      onInput={(event) =>
                        handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {modernPhotoUrl}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/45 bg-white/35 px-3 text-center text-xs text-[#ba4666] sm:h-32 sm:w-32">
                  <p>{displayValue('modernPhotoPlaceholder')}</p>
                  {isEditable && (
                    <span
                      className="w-full max-h-20 overflow-y-auto break-all rounded-lg bg-white/60 px-2 py-1 text-[0.65rem] text-[#6d0f2b]"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                      onInput={(event) =>
                        handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {displayValue('modernPhotoUrl')}
                    </span>
                  )}
                </div>
              )}
            </div>

            <h1
              className={`text-4xl font-semibold tracking-tight text-[#6d0f2b] drop-shadow-[0_10px_30px_rgba(255,160,190,0.45)] sm:text-5xl ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/20' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('modernTitle')}
            </h1>

            <p
              className={`max-w-xl text-base text-[#8d1b3d]/90 sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/20' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('modernSubtitle')}
            </p>

            <Button
              type="button"
              onClick={handleReveal}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#ff9ab5] via-[#ff6fa6] to-[#f66fc0] px-9 py-4 text-base font-semibold text-white shadow-[0_16px_60px_rgba(255,132,180,0.55)] transition-transform duration-300 hover:scale-[1.03] sm:text-lg"
            >
              <span
                className={`${isEditable ? 'cursor-text' : 'pointer-events-none'} relative z-10`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleContentChange('modernButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('modernButtonLabel')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/70 to-white/0 opacity-0 transition-opacity duration-500 hover:opacity-100" />
            </Button>

            <p
              className={`text-sm uppercase tracking-[0.4em] text-[#a5526d] sm:text-base ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernSupportingText', event.currentTarget.textContent || '')}
            >
              {displayValue('modernSupportingText')}
            </p>

            <div
              className={`w-full overflow-hidden rounded-3xl border border-white/40 bg-white/40 p-6 text-base text-[#6b1a33] shadow-inner transition-all duration-500 ease-out sm:text-lg ${
                showSecret ? 'max-h-96 translate-y-0 opacity-100 backdrop-blur-lg' : 'pointer-events-none max-h-0 -translate-y-4 opacity-0'
              }`}
            >
              <p
                className={`${isEditable ? 'cursor-text rounded-2xl px-2 py-2 hover:bg-white/30' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('modernAfterClickText', event.currentTarget.textContent || '')}
              >
                {displayValue('modernAfterClickText')}
              </p>
            </div>

            {creatorName && (
              <div className="pt-2 text-sm text-[#a5526d] sm:text-base">
                <span
                  className={`${
                    isEditable ? 'cursor-text rounded-xl px-2 py-1 hover:bg-white/20' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('modernCreatorLabel', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('modernCreatorLabel')}
                </span>{' '}
                <strong className="font-semibold text-[#6d0f2b]">{creatorName}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glass-heart-float {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(12px, -18px, 0) scale(1.1);
          }
        }

        @keyframes glass-card-shake {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(-6px, 2px, 0) rotate(-0.6deg);
          }
          50% {
            transform: translate3d(6px, -2px, 0) rotate(0.6deg);
          }
          75% {
            transform: translate3d(-4px, 2px, 0) rotate(-0.35deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

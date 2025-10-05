'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';

interface GoldenMidnightProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type StarStyle = CSSProperties & Record<'--duration' | '--delay', string>;

const DEFAULTS = {
  goldTitle: 'Yeni Yılın Kutlu Olsun 🥂',
  goldSubtitle: 'Yeni yılın zarif ışıltısı hep seninle olsun.',
  goldButtonLabel: 'Sürprizi Aç 🎁',
  goldAfterMessage: 'Nice Mutlu Senelere!',
  goldBodyMessage:
    'Gece yarısının altın saatinde, tüm dileklerin yıldız tozuyla gerçek olsun. Yeni başlangıçlara birlikte kadeh kaldıralım.',
  goldPhotoUrl: '',
};

export default function GoldenMidnight({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: GoldenMidnightProps) {
  const starField = useMemo(
    () =>
      Array.from({ length: 65 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1.2,
        delay: Math.random() * 4,
        duration: 2.2 + Math.random(),
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      goldTitle: textFields?.goldTitle || DEFAULTS.goldTitle,
      goldSubtitle:
        textFields?.goldSubtitle ||
        `${recipientName ? `${recipientName}, ` : ''}${DEFAULTS.goldSubtitle}`.trim(),
      goldButtonLabel: textFields?.goldButtonLabel || DEFAULTS.goldButtonLabel,
      goldAfterMessage: textFields?.goldAfterMessage || DEFAULTS.goldAfterMessage,
      goldBodyMessage: textFields?.goldBodyMessage || message || DEFAULTS.goldBodyMessage,
      goldPhotoUrl: textFields?.goldPhotoUrl || DEFAULTS.goldPhotoUrl,
    }),
    [recipientName, message, textFields]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [showRadiance, setShowRadiance] = useState(false);
  const [showAfterMessage, setShowAfterMessage] = useState(false);
  const radianceTimeoutRef = useRef<number | null>(null);
  const afterMessageTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    return () => {
      if (radianceTimeoutRef.current) {
        window.clearTimeout(radianceTimeoutRef.current);
      }
      if (afterMessageTimeoutRef.current) {
        window.clearTimeout(afterMessageTimeoutRef.current);
      }
    };
  }, []);

  const handleFieldChange = (key: keyof typeof initialValues, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const displayValue = (key: keyof typeof initialValues) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleReveal = () => {
    if (radianceTimeoutRef.current) {
      window.clearTimeout(radianceTimeoutRef.current);
    }
    setShowRadiance(true);
    radianceTimeoutRef.current = window.setTimeout(() => {
      setShowRadiance(false);
    }, 2400);

    if (afterMessageTimeoutRef.current) {
      window.clearTimeout(afterMessageTimeoutRef.current);
    }

    if (isEditable) {
      setShowAfterMessage((prev) => !prev);
    } else {
      setShowAfterMessage(true);
      afterMessageTimeoutRef.current = window.setTimeout(() => {
        setShowAfterMessage(false);
      }, 3400);
    }
  };

  const photoUrl = displayValue('goldPhotoUrl').trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020203] text-white">
      <div className="absolute inset-0 bg-[#020203]" />
      <div className="pointer-events-none absolute inset-0">
        {starField.map((star) => {
          const style: StarStyle = {
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          };
          return (
            <span
              key={star.id}
              className="absolute rounded-full bg-white/80 opacity-70 animate-[twinkle_var(--duration)_ease-in-out_var(--delay)_infinite]"
              style={style}
            />
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 border-x border-white/5">
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-amber-400/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-amber-400/60 to-transparent" />
      </div>

      {showRadiance && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.65),rgba(0,0,0,0)_70%)] blur-[50px] opacity-80" />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="relative w-full max-w-3xl rounded-[34px] border border-amber-500/20 bg-black/60 p-8 shadow-[0_30px_120px_rgba(255,196,45,0.28)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 border border-amber-200/20" />
          <div className="pointer-events-none absolute inset-12 border border-amber-200/10" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:gap-8">
            {isEditable ? (
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full justify-center">
                  <input
                    className="w-full max-w-xs rounded-full border border-amber-500/30 bg-black/70 px-5 py-2 text-sm text-amber-200 placeholder:text-amber-200/60 focus:border-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                    placeholder="Fotoğraf URL'sini buraya girin"
                    value={displayValue('goldPhotoUrl')}
                    onChange={(event) => handleFieldChange('goldPhotoUrl', event.currentTarget.value)}
                  />
                </div>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={displayValue('goldTitle') || 'Kutlama fotoğrafı'}
                    className="h-32 w-32 rounded-full border-4 border-amber-300/40 object-cover shadow-[0_18px_60px_rgba(253,230,138,0.4)]"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-amber-200/30 bg-black/40 text-center text-xs text-amber-100/70">
                    Fotoğraf URL&#39;si girildiğinde önizleme burada
                  </div>
                )}
              </div>
            ) : photoUrl ? (
              <img
                src={photoUrl}
                alt={displayValue('goldTitle') || 'Kutlama fotoğrafı'}
                className="h-32 w-32 rounded-full border-4 border-amber-300/40 object-cover shadow-[0_18px_60px_rgba(253,230,138,0.4)]"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-amber-200/30 bg-black/40 text-center text-xs text-amber-100/70">
                Fotoğraf eklemek için URL girin
              </div>
            )}

            <div
              className={`text-4xl font-semibold text-amber-200 drop-shadow-[0_0_20px_rgba(255,215,0,0.45)] sm:text-5xl lg:text-6xl ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('goldTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('goldTitle')}
            </div>

            <p
              className={`max-w-2xl text-base text-amber-100/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('goldSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('goldSubtitle')}
            </p>

            <div
              className={`max-w-2xl rounded-3xl border border-amber-200/20 bg-black/60 p-6 text-base leading-relaxed text-amber-100/90 shadow-[0_24px_70px_rgba(255,215,0,0.18)] transition ${
                isEditable ? 'cursor-text hover:bg-white/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('goldBodyMessage', event.currentTarget.textContent || '')}
            >
              {displayValue('goldBodyMessage')}
            </div>

            <Button
              type="button"
              onClick={handleReveal}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] px-10 py-4 text-base font-semibold text-black shadow-[0_22px_70px_rgba(251,191,36,0.45)] transition-transform duration-300 hover:scale-[1.03] sm:text-lg"
            >
              <span
                className={`${
                  isEditable ? 'cursor-text' : 'pointer-events-none'
                } relative z-10`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleFieldChange('goldButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('goldButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[goldSheen_3.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0" />
            </Button>

            <div
              className={`mt-6 max-w-2xl rounded-3xl border border-amber-200/30 bg-black/65 px-6 py-5 text-base leading-relaxed text-amber-100/90 shadow-[0_24px_70px_rgba(255,215,0,0.22)] transition-all duration-500 ${
                showAfterMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              } ${showAfterMessage ? 'pointer-events-auto' : 'pointer-events-none'} ${
                isEditable ? 'cursor-text hover:bg-white/5 focus:outline-none' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('goldAfterMessage', event.currentTarget.textContent || '')}
              aria-hidden={!showAfterMessage && !isEditable}
            >
              {displayValue('goldAfterMessage')}
            </div>
            {isEditable && !showAfterMessage && (
              <p className="text-xs text-amber-100/70">
                Bu metin butona tıklayınca görünür. Önizlemek ve düzenlemek için butonu kullanın.
              </p>
            )}
          </div>
        </div>
      </div>

      {creatorName && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.42em] text-amber-200/60">
          Hazırlayan: {creatorName}
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.6);
          }
        }

        @keyframes goldSheen {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
}

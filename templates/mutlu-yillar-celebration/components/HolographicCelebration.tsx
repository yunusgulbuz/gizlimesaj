'use client';

import { FocusEvent, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';

interface HolographicCelebrationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  holoTitle: 'Mutlu Yıllar 🎆',
  holoSubtitle: 'Yeni yılın ışıkları umutlarını parıldatsın.',
  holoButtonLabel: 'Yeni Yıla Başla ✨',
  holoAfterMessage: 'Harika bir yıl seni bekliyor',
  holoBodyMessage:
    'Bu yıl gökyüzündeki her yıldız senin için parlasın. Dileklerin holografik ışıklar gibi hayatına yansısın.',
  holoPhotoUrl: 'https://i.hizliresim.com/mojpwcv.png',
};

type ConfettiStyle = CSSProperties & Record<'--duration' | '--delay', string>;

export default function HolographicCelebration({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: HolographicCelebrationProps) {
const confettiPieces = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4.5 + Math.random() * 2.5,
        delay: Math.random() * 1.8,
        color:
          ['#c084fc', '#a855f7', '#22d3ee', '#f472b6', '#60a5fa'][
            index % 5
          ],
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      holoTitle: textFields?.holoTitle || DEFAULTS.holoTitle,
      holoSubtitle:
        textFields?.holoSubtitle ||
        `${recipientName ? `${recipientName}, ` : ''}${DEFAULTS.holoSubtitle}`.trim(),
      holoButtonLabel: textFields?.holoButtonLabel || DEFAULTS.holoButtonLabel,
      holoAfterMessage: textFields?.holoAfterMessage || DEFAULTS.holoAfterMessage,
      holoBodyMessage: textFields?.holoBodyMessage || message || DEFAULTS.holoBodyMessage,
      holoPhotoUrl: textFields?.holoPhotoUrl || DEFAULTS.holoPhotoUrl,
    }),
    [recipientName, message, textFields]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

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

  const handleCelebrate = () => {
    setIsCelebrating(true);
    window.setTimeout(() => {
      setIsCelebrating(false);
    }, 3800);
  };

  const photoUrl = displayValue('holoPhotoUrl').trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040013] text-white">
      <div className="absolute inset-0 bg-[#040013]" />
      <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(135deg, rgba(34,180,255,0.25), rgba(164,80,255,0.25))' }} />
      <div className="absolute inset-0 animate-[holoGradient_16s_ease_infinite] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.35)_0%,rgba(4,0,19,0.4)_45%,rgba(4,0,19,0.9)_100%)]" />

      {isCelebrating && (
        <div className="pointer-events-none absolute inset-0">
          {confettiPieces.map((piece) => {
            const style: ConfettiStyle = {
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              background: piece.color,
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))',
              '--duration': `${piece.duration}s`,
              '--delay': `${piece.delay}s`,
            };
            return (
              <span
                key={piece.id}
                className="absolute h-12 w-[3px] animate-[confettiFall_var(--duration)_linear_var(--delay)_both] rounded-full"
                style={style}
              />
            );
          })}
        </div>
      )}

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_rgba(124,58,237,0.45)] backdrop-blur-2xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),rgba(255,255,255,0.02)_65%)]" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#7c3aed]/30 blur-[120px]" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:gap-8">
            {isEditable ? (
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full justify-center">
                  <input
                    className="w-full max-w-xs rounded-full border border-white/20 bg-black/40 px-5 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Fotoğraf URL'sini buraya girin"
                    value={displayValue('holoPhotoUrl')}
                    onChange={(event) => handleFieldChange('holoPhotoUrl', event.currentTarget.value)}
                  />
                </div>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={displayValue('holoTitle') || 'Profil fotoğrafı'}
                    className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-[0_18px_55px_rgba(168,113,255,0.45)]"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-center text-xs text-white/60">
                    Fotoğraf URL&#39;si girildiğinde önizleme burada
                  </div>
                )}
              </div>
            ) : photoUrl ? (
              <img
                src={photoUrl}
                alt={displayValue('holoTitle') || 'Profil fotoğrafı'}
                className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-[0_18px_55px_rgba(168,113,255,0.45)]"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-center text-xs text-white/60">
                Profil fotoğrafı eklemek için URL girin
              </div>
            )}

            <div
              className={`text-4xl font-bold tracking-wide text-white drop-shadow-[0_0_22px_rgba(244,114,182,0.55)] sm:text-5xl lg:text-6xl ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('holoTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('holoTitle')}
            </div>

            <p
              className={`max-w-2xl text-base text-white/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('holoSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('holoSubtitle')}
            </p>

            <div
              className={`max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 text-base leading-relaxed text-white/85 shadow-[0_18px_60px_rgba(148,93,255,0.25)] transition ${
                isEditable ? 'cursor-text hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('holoBodyMessage', event.currentTarget.textContent || '')}
            >
              {displayValue('holoBodyMessage')}
            </div>

            <Button
              type="button"
              onClick={handleCelebrate}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#22d3ee] px-10 py-4 text-base font-semibold text-white shadow-[0_20px_65px_rgba(124,58,237,0.55)] transition-transform duration-300 hover:scale-[1.03] sm:text-lg"
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
                        handleFieldChange('holoButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('holoButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[sheen_2.8s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0" />
            </Button>

            {(isCelebrating || isEditable) && (
              <div
                className={`text-lg font-medium text-white/90 transition-opacity duration-500 ${
                  isCelebrating ? 'opacity-100' : 'opacity-60'
                } ${isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleFieldChange('holoAfterMessage', event.currentTarget.textContent || '')}
              >
                {displayValue('holoAfterMessage')}
              </div>
            )}
          </div>
        </div>
      </div>

      {creatorName && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.4em] text-white/40">
          Hazırlayan: {creatorName}
        </div>
      )}

      <style jsx>{`
        @keyframes holoGradient {
          0% {
            transform: translate3d(-10%, -5%, 0) scale(1.05);
          }
          50% {
            transform: translate3d(12%, 8%, 0) scale(1.1);
          }
          100% {
            transform: translate3d(-10%, -5%, 0) scale(1.05);
          }
        }

        @keyframes sheen {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }
          30% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-20vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

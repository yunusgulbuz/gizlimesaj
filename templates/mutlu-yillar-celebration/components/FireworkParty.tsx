'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';

interface FireworkPartyProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type FloatStarStyle = CSSProperties & Record<'--duration' | '--delay' | '--scale', string>;
type BurstStyle = CSSProperties & Record<'--delay', string>;
type ParticleStyle = CSSProperties & Record<'--delay', string>;

const DEFAULTS = {
  partyTitle: 'Mutlu Yıllar 🎇',
  partySubtitle: 'Yeni yılın ilk dakikalarında seninle kutlamak bir harika!',
  partyButtonLabel: 'Ateşle Gösteriyi 🎆',
  partyAfterMessage: 'Harika Bir Yıl Seninle!',
  partyBodyMessage:
    'Gökyüzü patlayan renklerle doluyor; dileklerin anında ışığa dönüşüyor. Yeni yılın her günü, bu an kadar eğlenceli ve renkli olsun!',
  partyPhotoUrl: '',
};

export default function FireworkParty({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: FireworkPartyProps) {
  const floatingStars = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 12 + Math.random() * 6,
        delay: Math.random() * 8,
        scale: 0.6 + Math.random() * 0.8,
      })),
    []
  );

  const fireworksBursts = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        id: index,
        left: 12 + Math.random() * 76,
        top: 18 + Math.random() * 50,
        delay: index * 0.4,
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      partyTitle: textFields?.partyTitle || DEFAULTS.partyTitle,
      partySubtitle:
        textFields?.partySubtitle ||
        `${recipientName ? `${recipientName}, ` : ''}${DEFAULTS.partySubtitle}`.trim(),
      partyButtonLabel: textFields?.partyButtonLabel || DEFAULTS.partyButtonLabel,
      partyAfterMessage: textFields?.partyAfterMessage || DEFAULTS.partyAfterMessage,
      partyBodyMessage: textFields?.partyBodyMessage || message || DEFAULTS.partyBodyMessage,
      partyPhotoUrl: textFields?.partyPhotoUrl || DEFAULTS.partyPhotoUrl,
    }),
    [recipientName, message, textFields]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [showAfterMessage, setShowAfterMessage] = useState(false);
  const fireworksTimeoutRef = useRef<number | null>(null);
  const afterMessageTimeoutRef = useRef<number | null>(null);

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

  const handleFireworks = () => {
    if (fireworksTimeoutRef.current) {
      window.clearTimeout(fireworksTimeoutRef.current);
    }
    setFireworksActive(true);
    fireworksTimeoutRef.current = window.setTimeout(() => {
      setFireworksActive(false);
    }, 1800);

    if (afterMessageTimeoutRef.current) {
      window.clearTimeout(afterMessageTimeoutRef.current);
    }

    if (isEditable) {
      setShowAfterMessage((prev) => !prev);
    } else {
      setShowAfterMessage(true);
      afterMessageTimeoutRef.current = window.setTimeout(() => {
        setShowAfterMessage(false);
      }, 3600);
    }
  };

  useEffect(() => {
    return () => {
      if (fireworksTimeoutRef.current) {
        window.clearTimeout(fireworksTimeoutRef.current);
      }
      if (afterMessageTimeoutRef.current) {
        window.clearTimeout(afterMessageTimeoutRef.current);
      }
    };
  }, []);

  const photoUrl = displayValue('partyPhotoUrl').trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040b2d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(14,165,233,0.35),rgba(168,85,247,0.25),rgba(236,72,153,0.25))] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#0f172a,transparent_60%)]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingStars.map((star) => {
          const style: FloatStarStyle = {
            left: `${star.left}%`,
            top: `${star.top}%`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
            '--scale': `${star.scale}`
          };
          return (
            <span
              key={star.id}
              className="absolute h-1 w-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-[parallaxFloat_var(--duration)_ease-in-out_var(--delay)_infinite]"
              style={style}
            />
          );
        })}
      </div>

      {fireworksActive && (
        <div className="pointer-events-none absolute inset-0">
          {fireworksBursts.map((burst) => {
            const burstStyle: BurstStyle = {
              left: `${burst.left}%`,
              top: `${burst.top}%`,
              '--delay': `${burst.delay}s`,
            };
            return (
              <div
                key={burst.id}
                className="absolute h-0 w-0 animate-[fireworkBurst_1.6s_ease-out_var(--delay)_both]"
                style={burstStyle}
              >
                {Array.from({ length: 14 }).map((_, index) => {
                  const particleStyle: ParticleStyle = {
                    transform: `rotate(${(360 / 14) * index}deg)`,
                    background: ['#38bdf8', '#f97316', '#a855f7', '#facc15'][index % 4],
                    boxShadow: '0 0 8px currentColor',
                    '--delay': `${burst.delay}s`,
                  };
                  return (
                    <span
                      key={index}
                      className="absolute h-1 w-1 origin-bottom-left animate-[fireworkParticle_1.6s_ease-out_var(--delay)_both]"
                      style={particleStyle}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_110px_rgba(59,130,246,0.45)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),rgba(17,24,39,0.3))]" />
          <div className="pointer-events-none absolute inset-0 animate-[partyGlow_10s_linear_infinite] bg-[conic-gradient(from_0deg,#38bdf8,#a855f7,#f97316,#facc15,#38bdf8)] opacity-10" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:gap-8">
            {isEditable && (
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full justify-center">
                  <input
                    className="w-full max-w-xs rounded-full border border-white/30 bg-black/40 px-5 py-2 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-sky-300/70"
                    placeholder="Fotoğraf URL'sini buraya girin"
                    value={displayValue('partyPhotoUrl')}
                    onChange={(event) => handleFieldChange('partyPhotoUrl', event.currentTarget.value)}
                  />
                </div>
                {photoUrl ? (
                  <div className="pointer-events-none w-24 overflow-hidden rounded-2xl border border-white/40 bg-white/10 shadow-[0_12px_40px_rgba(56,189,248,0.35)]">
                    <img src={photoUrl} alt="Kutlama fotoğrafı" className="h-24 w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-white/40 bg-white/10 text-center text-[0.7rem] text-white/70">
                    URL girildiğinde önizleme burada
                  </div>
                )}
              </div>
            )}

            <div
              className={`text-4xl font-bold tracking-wide text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.6)] sm:text-5xl lg:text-6xl ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('partyTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('partyTitle')}
            </div>

            <p
              className={`max-w-2xl text-base text-white/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('partySubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('partySubtitle')}
            </p>

            <div
              className={`max-w-2xl rounded-3xl border border-white/15 bg-black/40 p-6 text-base leading-relaxed text-white/85 shadow-[0_20px_70px_rgba(56,189,248,0.25)] transition ${
                isEditable ? 'cursor-text hover:bg-black/50' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('partyBodyMessage', event.currentTarget.textContent || '')}
            >
              {displayValue('partyBodyMessage')}
            </div>

            <Button
              type="button"
              onClick={handleFireworks}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#f97316] px-10 py-4 text-base font-semibold text-white shadow-[0_28px_75px_rgba(56,189,248,0.4)] transition-transform duration-300 hover:scale-[1.08] focus-visible:scale-[1.05] sm:text-lg"
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
                        handleFieldChange('partyButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('partyButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[partySheen_2.8s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0" />
            </Button>

            <div
              className={`mt-6 max-w-md rounded-full border border-white/30 bg-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-all duration-500 ${
                showAfterMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              } ${showAfterMessage ? 'pointer-events-auto' : 'pointer-events-none'} ${
                isEditable ? 'cursor-text hover:bg-white/20 focus:outline-none' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('partyAfterMessage', event.currentTarget.textContent || '')}
              aria-hidden={!showAfterMessage && !isEditable}
            >
              {displayValue('partyAfterMessage')}
            </div>
            {isEditable && !showAfterMessage && (
              <p className="text-xs text-white/70">
                Bu metin butona tıklayınca görünür. Önizlemek için butona bas.
              </p>
            )}
          </div>
        </div>
      </div>

      {!isEditable && photoUrl && (
        <div className="pointer-events-none absolute bottom-6 right-6 z-20 w-24 overflow-hidden rounded-2xl border border-white/40 bg-white/10 shadow-[0_18px_55px_rgba(56,189,248,0.25)] backdrop-blur-lg">
          <img src={photoUrl} alt="Kutlama fotoğrafı" className="h-24 w-full object-cover" />
        </div>
      )}

      {creatorName && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.45em] text-white/50">
          Hazırlayan: {creatorName}
        </div>
      )}

      <style jsx>{`
        @keyframes parallaxFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(var(--scale, 1));
            opacity: 0.6;
          }
          50% {
            transform: translate3d(10px, -16px, 0) scale(calc(var(--scale, 1) * 1.05));
            opacity: 1;
          }
        }

        @keyframes fireworkBurst {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes fireworkParticle {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          20% {
            transform: scaleY(1) translateY(-40px);
            opacity: 1;
          }
          100% {
            transform: scaleY(1) translateY(-120px);
            opacity: 0;
          }
        }

        @keyframes partyGlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes partySheen {
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

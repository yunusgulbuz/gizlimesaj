'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type OrbitStyle = CSSProperties & { '--distance': string };

interface RoyalLightHarmonyProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  royalTitle: 'Mübarek Kandiliniz Hayırlara Vesile Olsun 🌟',
  royalMessage: 'Zümrüt gecenin ışığında dualarınızın kabul olmasını diliyorum.',
  royalBlessing: 'Altın ışıkların çevrelediği bu gecede gönlünüz huzurla dolsun.',
};

export default function RoyalLightHarmony({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: RoyalLightHarmonyProps) {
  const orbitParticles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => ({
        id: index,
        distance: 140 + Math.random() * 40,
        duration: 14 + Math.random() * 6,
      })),
    []
  );

  const shimmerColumns = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, index) => ({
        id: index,
        delay: index * 1.2,
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      royalTitle: textFields?.royalTitle || DEFAULTS.royalTitle,
      royalMessage:
        textFields?.royalMessage ||
        (recipientName ? `${recipientName}, ${DEFAULTS.royalMessage}` : DEFAULTS.royalMessage),
      royalBlessing: textFields?.royalBlessing || DEFAULTS.royalBlessing,
    }),
    [textFields, recipientName]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsActive(true), 100);
    return () => window.clearTimeout(timeout);
  }, []);

  const onFieldUpdate = (key: keyof typeof initialValues, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const displayValue = (key: keyof typeof initialValues) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05100f] text-[#f3eddc]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(8,46,42,0.85),rgba(3,10,7,0.96))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(14,64,55,0.8),transparent_55%,rgba(36,96,76,0.65),transparent_85%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,213,128,0.18),rgba(0,0,0,0)_70%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20 sm:px-10">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[42px] border border-[#2c4e44]/70 bg-[#061816]/70 px-10 py-16 shadow-[0_50px_160px_rgba(3,30,25,0.75)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 border border-[#51a38f]/20" />
          <div className="pointer-events-none absolute inset-8 rounded-[30px] border border-[#d2caa2]/12" />

          <div className="relative flex flex-col items-center gap-10 text-center">
            <div className="relative flex h-56 w-56 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,216,142,0.35),rgba(6,24,22,0.0)_65%)] blur-xl" />
              <div className="absolute inset-3 rounded-full border border-[#f0d996]/30" />
              <div className="absolute inset-7 rounded-full border border-[#f0d996]/25" />
              <div className="absolute inset-12 rounded-full border border-[#f0d996]/15" />

              {orbitParticles.map((particle) => (
                <span
                  key={particle.id}
                  className="absolute h-[6px] w-[6px] rounded-full bg-[#ffe7b1] shadow-[0_0_12px_rgba(255,224,168,0.8)]"
                  style={{
                    transformOrigin: '50% 50%',
                    animation: `orbit ${particle.duration}s linear infinite`,
                    animationDelay: `${particle.id * 0.1}s`,
                    opacity: 0.55,
                    '--distance': `${particle.distance}px`,
                  } as OrbitStyle}
                />
              ))}

              <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(9,42,35,0.85),rgba(6,24,22,0.9))] shadow-[0_35px_90px_rgba(0,0,0,0.55)]">
                <div className="absolute inset-[18%] rounded-full border border-[#f5e7c4]/30" />
                <div className="absolute inset-[28%] rounded-full bg-[conic-gradient(from_0deg,rgba(255,198,120,0.45),rgba(255,234,170,0.8),rgba(255,198,120,0.45))] opacity-80" />
                <div className="absolute inset-[35%] rounded-full bg-[radial-gradient(circle,rgba(4,19,17,0.9),rgba(8,42,33,0.95))]" />
                <div className="absolute inset-6 animate-[royalGlow_4.5s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,219,147,0.5),rgba(255,219,147,0)_70%)]" />
                <svg viewBox="0 0 120 120" className="relative h-24 w-24 text-[#ffeab7] drop-shadow-[0_0_28px_rgba(255,225,166,0.55)]">
                  <path
                    d="M60 20c-9.1 0-17.5 2.7-24.5 7.3 5.5 8.4 8.7 18.4 8.7 29.2 0 10.7-3.2 20.6-8.6 29 7 4.6 15.4 7.3 24.4 7.3 24.9 0 45-20.1 45-45S84.9 20 60 20zm25.3 59.7C80.5 73 82 67.1 82 60.1c0-7-1.5-12.9-4.6-19.6 9 4.7 15.2 13.7 15.2 24.4 0 10.9-6.4 20-15.3 24.8z"
                    fill="currentColor"
                  />
                  <circle cx="86" cy="34" r="6" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <h2
                className={`font-serif text-[clamp(2.5rem,4vw,3.5rem)] leading-tight text-[#f3eddc] drop-shadow-[0_0_24px_rgba(255,231,178,0.45)] ${
                  isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldUpdate('royalTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('royalTitle')}
              </h2>

              <p
                className={`max-w-2xl text-base leading-relaxed text-[#e7dbb7]/80 sm:text-lg ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldUpdate('royalMessage', event.currentTarget.textContent || '')}
              >
                {displayValue('royalMessage')}
              </p>

              <p
                className={`text-xs uppercase tracking-[0.38em] text-[#d7c48d]/80 sm:text-sm ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldUpdate('royalBlessing', event.currentTarget.textContent || '')}
              >
                {displayValue('royalBlessing')}
              </p>
            </div>

            {creatorName && (
              <div className="mt-6 flex flex-col items-center gap-1 text-[0.65rem] uppercase tracking-[0.42em] text-[#d4c49a]/70">
                Mesaj Sahibi
                <span className="text-[#f3eddc]">{creatorName}</span>
              </div>
            )}

            <div className="grid w-full grid-cols-5 gap-6 opacity-70">
              {shimmerColumns.map((column) => (
                <div key={column.id} className="relative h-24 overflow-hidden rounded-full bg-[#0d2a24]/70">
                  <span
                    className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-b from-transparent via-[#ffe19f]/40 to-transparent"
                    style={{ animation: isActive ? `columnGlow 6s ease-in-out ${column.delay}s infinite` : 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(var(--distance)) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(var(--distance)) rotate(-360deg);
          }
        }
        @keyframes royalGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.05);
          }
        }
        @keyframes columnGlow {
          0%, 100% {
            opacity: 0.1;
            transform: translateY(-30%);
          }
          50% {
            opacity: 0.6;
            transform: translateY(30%);
          }
        }
      `}</style>
    </div>
  );
}

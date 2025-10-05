'use client';

import { useEffect, useMemo, useState } from 'react';

interface GoldenGlowMinimalProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  glowTitle: 'Hayırlı Kandiller ✨',
  glowMessage: 'Kalbinizi aydınlatan duaların huzurunu diliyorum.',
  glowAccent: 'Altın bir halo gibi çepeçevre saran rahmeti hisset.',
};

export default function GoldenGlowMinimal({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: GoldenGlowMinimalProps) {
  const haloRings = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, index) => ({
        id: index,
        scale: 1 + index * 0.18,
        opacity: 0.5 - index * 0.08,
      })),
    []
  );

  const floatDots = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => ({
        id: index,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 4,
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      glowTitle: textFields?.glowTitle || DEFAULTS.glowTitle,
      glowMessage:
        textFields?.glowMessage ||
        (recipientName ? `${recipientName}, ${DEFAULTS.glowMessage}` : DEFAULTS.glowMessage),
      glowAccent: textFields?.glowAccent || DEFAULTS.glowAccent,
    }),
    [textFields, recipientName]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsReady(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  const updateField = (key: keyof typeof initialValues, value: string) => {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7f3ea] text-[#5c523e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,224,173,0.35),rgba(247,243,234,0.95)_60%)]" />

      <div className="pointer-events-none absolute inset-0">
        {floatDots.map((dot) => (
          <span
            key={dot.id}
            className="absolute h-2 w-2 rounded-full bg-gradient-to-br from-[#f6d479] to-[#f1c24d] opacity-60"
            style={{
              top: `${dot.top}%`,
              left: `${dot.left}%`,
              animation: `soft-float ${dot.duration}s ease-in-out ${dot.delay}s infinite` as const,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.6),rgba(255,243,215,0.2))]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
        <div
          className={`relative w-full max-w-2xl overflow-hidden rounded-[44px] border border-[#eadfc9]/80 bg-white/70 px-8 py-16 shadow-[0_40px_120px_rgba(241,200,115,0.35)] backdrop-blur-3xl sm:px-12 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } transition-all duration-600`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,234,197,0.55),rgba(255,255,255,0)_70%)]" />
          <div className="pointer-events-none absolute inset-4 rounded-[38px] border border-white/70" />

          <div className="relative flex flex-col items-center gap-10 text-center">
            <div className="relative flex flex-col items-center gap-6">
              <div className="relative h-44 w-44">
                {haloRings.map((ring) => (
                  <div
                    key={ring.id}
                    className="absolute inset-0 rounded-full border border-[#f1d18a]/40"
                    style={{
                      transform: `scale(${ring.scale})`,
                      opacity: ring.opacity,
                    }}
                  />
                ))}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,224,173,0.45),rgba(255,224,173,0.05)_70%,rgba(255,224,173,0)_100%)]" />
                <div className="absolute inset-6 rounded-full bg-white/80 backdrop-blur-sm" />
                <div className="absolute inset-10 rounded-[40%] bg-[conic-gradient(from_0deg,rgba(255,214,130,0.25),rgba(255,214,130,0.68),rgba(255,214,130,0.25))] opacity-80" />
                <div className="absolute inset-4 animate-[haloPulse_5s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(251,212,137,0.55),rgba(251,212,137,0.0)_70%)]" />
              </div>

              <div className="flex flex-col gap-6">
                <h2
                  className={`text-3xl font-semibold tracking-[0.08em] text-[#4f4536] sm:text-4xl md:text-5xl ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/60' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => updateField('glowTitle', event.currentTarget.textContent || '')}
                >
                  {displayValue('glowTitle')}
                </h2>

                <p
                  className={`max-w-xl text-base leading-relaxed text-[#5c523e]/80 sm:text-lg ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/60' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => updateField('glowMessage', event.currentTarget.textContent || '')}
                >
                  {displayValue('glowMessage')}
                </p>

                <p
                  className={`max-w-xl text-sm uppercase tracking-[0.32em] text-[#a18a58] sm:text-base ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/60' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => updateField('glowAccent', event.currentTarget.textContent || '')}
                >
                  {displayValue('glowAccent')}
                </p>
              </div>
            </div>

            {creatorName && (
              <div className="flex flex-col items-center gap-1 text-xs uppercase tracking-[0.4em] text-[#85724a]/70">
                Yayımlayan
                <span className="text-[#5c523e]">{creatorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes soft-float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(0, -12px, 0);
            opacity: 0.7;
          }
        }
        @keyframes haloPulse {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}

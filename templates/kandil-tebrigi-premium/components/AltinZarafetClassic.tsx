'use client';

import { useEffect, useMemo, useState } from 'react';

interface AltinZarafetClassicProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  luxClassicTitle: 'Kandiliniz Mübarek Olsun 🌙',
  luxClassicMessage: 'Bu mübarek gecenin bereketi üzerinizde olsun.',
  luxClassicBlessing: 'Hilalin ışığında dualarımız buluşsun.',
};

export default function AltinZarafetClassic({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: AltinZarafetClassicProps) {
  const shimmerLines = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, index) => ({
        id: index,
        angle: 12 + index * 6,
        delay: index * 0.4,
      })),
    []
  );

  const haloParticles = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        scale: 0.8 + Math.random() * 0.6,
        delay: Math.random() * 5,
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      luxClassicTitle: textFields?.luxClassicTitle || DEFAULTS.luxClassicTitle,
      luxClassicMessage:
        textFields?.luxClassicMessage ||
        (recipientName ? `Sevgili ${recipientName}, ${DEFAULTS.luxClassicMessage}` : DEFAULTS.luxClassicMessage),
      luxClassicBlessing: textFields?.luxClassicBlessing || DEFAULTS.luxClassicBlessing,
    }),
    [textFields, recipientName]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 60);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleContentChange = (key: keyof typeof initialValues, value: string) => {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#040713] text-[#f5ecd6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(18,28,56,0.92),rgba(4,7,19,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {haloParticles.map((particle) => (
          <span
            key={particle.id}
            className="absolute h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,215,128,0.35),rgba(0,0,0,0))] blur-2xl"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              transform: `scale(${particle.scale})`,
              animation: `float-glint 9s ease-in-out ${particle.delay}s infinite` as const,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,233,186,0.08),transparent_46%,rgba(255,210,130,0.12),transparent_78%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,214,145,0.08),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20 sm:px-8">
        <div
          className={`relative w-full max-w-3xl overflow-hidden rounded-[40px] border border-[#d9b886]/40 bg-white/5 px-8 py-12 shadow-[0_40px_140px_rgba(28,24,8,0.55)] backdrop-blur-2xl sm:px-12 sm:py-16 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          } transition-all duration-700`}
        >
          <div className="pointer-events-none absolute inset-0 border border-white/10" />
          <div className="pointer-events-none absolute inset-6 rounded-[30px] border border-white/10" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-10 flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#f1d8a1]/20" />
              <div className="absolute inset-4 rounded-full border border-[#f0d4a4]/20" />
              <div className="absolute inset-2 rounded-full bg-[conic-gradient(from_90deg,rgba(255,214,145,0.08),rgba(255,214,145,0.4),rgba(255,214,145,0.08))] opacity-60" />
              <div className="absolute inset-0 animate-[crescentPulse_4.6s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,219,173,0.35),rgba(0,0,0,0)_68%)]" />
              <svg
                viewBox="0 0 120 120"
                className="relative h-20 w-20 text-[#ffe3b0] drop-shadow-[0_0_20px_rgba(255,223,166,0.45)]"
              >
                <path
                  d="M78.5 18.6c-22.2 6-35.3 29.1-29.3 51.3 4 14.9 14.9 25.8 28.3 29.8-18.4 4.9-37.3-5.7-42.2-24.1-4.9-18.4 5.7-37.3 24.1-42.2 6.5-1.7 13-1.6 19.1 0.6z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mb-10 flex flex-col items-center gap-4 sm:gap-6">
              <h1
                className={`font-serif text-4xl tracking-wide text-[#ffe7c8] drop-shadow-[0_0_22px_rgba(255,220,170,0.4)] sm:text-5xl md:text-6xl ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('luxClassicTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('luxClassicTitle')}
              </h1>

              <p
                className={`max-w-xl text-base text-[#f7e6c9]/90 sm:text-lg md:text-xl ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('luxClassicMessage', event.currentTarget.textContent || '')}
              >
                {displayValue('luxClassicMessage')}
              </p>

              <p
                className={`max-w-xl font-serif text-lg italic text-[#f1ddb7] sm:text-xl ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('luxClassicBlessing', event.currentTarget.textContent || '')}
              >
                {displayValue('luxClassicBlessing')}
              </p>
            </div>

            <div className="mb-12 flex w-full max-w-xl flex-col items-center gap-4">
              <div className="flex w-full items-center justify-center gap-6">
                <span className="h-px w-24 bg-gradient-to-r from-transparent via-[#f0d5a3]/50 to-[#f0d5a3]/80" />
                <span className="h-2 w-2 rotate-45 rounded-sm bg-[#f6dea7]/70" />
                <span className="h-px w-24 bg-gradient-to-l from-transparent via-[#f0d5a3]/50 to-[#f0d5a3]/80" />
              </div>

              {creatorName && (
                <div className="text-xs uppercase tracking-[0.3em] text-[#f7e6c9]/70">
                  Hazırlayan
                  <span className="ml-2 font-semibold text-[#ffe7c8]">{creatorName}</span>
                </div>
              )}
            </div>

            <div className="grid w-full grid-cols-2 gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-[#f7e6c9]/45 sm:grid-cols-4">
              {shimmerLines.map((line) => (
                <div
                  key={line.id}
                  className="relative flex h-16 items-center justify-center"
                  style={{
                    animation: `line-sheen 8s linear ${line.delay}s infinite` as const,
                  }}
                >
                  <span className="pointer-events-none absolute h-px w-20 bg-gradient-to-r from-transparent via-[#f3d9a3]/60 to-transparent opacity-80" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-glint {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.45;
          }
          50% {
            transform: translate3d(4px, -10px, 0) scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes crescentPulse {
          0%, 100% {
            opacity: 0.38;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        @keyframes line-sheen {
          0%, 100% {
            opacity: 0.05;
            transform: translateX(-20%);
          }
          50% {
            opacity: 0.55;
            transform: translateX(20%);
          }
        }
      `}</style>
    </div>
  );
}

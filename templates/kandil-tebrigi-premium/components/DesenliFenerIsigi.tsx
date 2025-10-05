'use client';

import { useEffect, useMemo, useState } from 'react';

interface DesenliFenerIsigiProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  fenerTitle: 'Kandiliniz Mübarek Olsun',
  fenerMessage: 'Gecenin bereketi ışık saçsın, dualar gönüllere huzur taşısın.',
  fenerFooter: 'Fenerlerin sıcak ışığında buluşuyoruz.',
};

export default function DesenliFenerIsigi({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: DesenliFenerIsigiProps) {
  const lanterns = useMemo(
    () =>
      [
        { id: 1, left: '16%', delay: 0 },
        { id: 2, left: '50%', delay: 1.4 },
        { id: 3, left: '78%', delay: 0.8 },
      ],
    []
  );

  const motifGrid = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, index) => ({
        id: index,
        rotate: (index % 4) * 45,
        delay: Math.random() * 6,
      })),
    []
  );

  const initialValues = useMemo(
    () => ({
      fenerTitle: textFields?.fenerTitle || DEFAULTS.fenerTitle,
      fenerMessage:
        textFields?.fenerMessage ||
        (recipientName ? `${recipientName}, ${DEFAULTS.fenerMessage}` : DEFAULTS.fenerMessage),
      fenerFooter: textFields?.fenerFooter || DEFAULTS.fenerFooter,
    }),
    [textFields, recipientName]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [showLights, setShowLights] = useState(false);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowLights(true), 120);
    return () => window.clearTimeout(timeout);
  }, []);

  const changeField = (key: keyof typeof initialValues, value: string) => {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#07160f] text-[#f5e7cb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,54,39,0.9),rgba(4,16,10,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,40,28,0.65)_1px,transparent_1px),linear-gradient(0deg,rgba(10,40,28,0.65)_1px,transparent_1px)]" style={{ backgroundSize: '120px 120px' }} />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {motifGrid.map((motif) => (
          <div
            key={motif.id}
            className="absolute h-16 w-16 opacity-20"
            style={{
              top: `${(motif.id % 5) * 20 + 6}%`,
              left: `${Math.floor(motif.id / 5) * 18 + 8}%`,
              transform: `rotate(${motif.rotate}deg)`
            }}
          >
            <div
              className="h-full w-full bg-[conic-gradient(from_90deg,rgba(240,220,170,0.05),rgba(240,220,170,0.12),rgba(240,220,170,0.05))]"
              style={{
                animation: `motifPulse 10s ease-in-out ${motif.delay}s infinite` as const,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20 sm:px-10">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[38px] border border-[#e6cf9f]/30 bg-[#0b2416]/70 px-10 py-16 shadow-[0_40px_140px_rgba(9,52,34,0.65)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 border border-white/10" />
          <div className="pointer-events-none absolute inset-6 rounded-[28px] border border-[#e9d8aa]/15" />

          <div className="relative flex flex-col items-center gap-10 text-center">
            <div className="absolute inset-x-0 top-0 flex translate-y-[-32%] justify-center gap-16">
              {lanterns.map((lantern) => (
                <div
                  key={lantern.id}
                  className="relative flex flex-col items-center"
                  style={{ animation: showLights ? `lanternFloat 6s ease-in-out ${lantern.delay}s infinite` : 'none' }}
                >
                  <div className="mb-2 h-12 w-[2px] bg-gradient-to-b from-transparent to-[#f5d78d]/80" />
                  <div className="relative h-20 w-16 rounded-[18px] border border-[#f6d492]/40 bg-[radial-gradient(circle_at_top,rgba(251,220,144,0.75),rgba(13,32,20,0.85))] shadow-[0_18px_45px_rgba(255,218,135,0.4)]">
                    <div className="absolute inset-x-4 top-[6px] h-2 rounded-full bg-[#f5d68b]/60" />
                    <div className="absolute inset-2 flex items-center justify-center rounded-[14px] border border-[#f9e2a2]/30 bg-[radial-gradient(circle,rgba(251,218,140,0.55),rgba(251,218,140,0.1))]" />
                    <div className="absolute inset-x-3 bottom-[6px] h-[6px] rounded-full bg-[#f6d590]/70" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 sm:gap-8">
              <h2
                className={`font-serif text-4xl text-[#f5e7cb] drop-shadow-[0_0_24px_rgba(255,226,174,0.45)] sm:text-5xl md:text-6xl ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => changeField('fenerTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('fenerTitle')}
              </h2>

              <p
                className={`max-w-2xl text-base leading-relaxed text-[#f1ddaf]/90 sm:text-lg ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => changeField('fenerMessage', event.currentTarget.textContent || '')}
              >
                {displayValue('fenerMessage')}
              </p>

              <p
                className={`text-xs uppercase tracking-[0.32em] text-[#cbb883] ${
                  isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => changeField('fenerFooter', event.currentTarget.textContent || '')}
              >
                {displayValue('fenerFooter')}
              </p>
            </div>

            {creatorName && (
              <div className="mt-6 text-[0.65rem] uppercase tracking-[0.42em] text-[#d9c79b]/80">
                Mesajı Hazırlayan <span className="ml-2 text-[#f5e7cb]">{creatorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes lanternFloat {
          0%, 100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(8px);
          }
        }
        @keyframes motifPulse {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.28;
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';

interface EmeraldLightGreetingProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  emeraldTitle: 'Hayırlı Cumalar 🌿',
  emeraldMessage: 'Dualarınız kabul, gönlünüz huzurla dolsun.',
  emeraldBlessing: 'Zümrüt ışıkların sıcaklığında buluşalım.',
};

const LANTERN_PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: `emerald-particle-${index}`,
  left: Math.random() * 100,
  top: 30 + Math.random() * 60,
  duration: 6 + Math.random() * 4,
  delay: index * 0.25,
}));

export default function EmeraldLightGreeting({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: EmeraldLightGreetingProps) {
  const personalRecipient = useMemo(() => recipientName?.trim() || '', [recipientName]);
  const [localFields, setLocalFields] = useState(() => ({
    emeraldTitle: textFields?.emeraldTitle || DEFAULTS.emeraldTitle,
    emeraldMessage: textFields?.emeraldMessage || DEFAULTS.emeraldMessage,
    emeraldBlessing: textFields?.emeraldBlessing || DEFAULTS.emeraldBlessing,
  }));

  useEffect(() => {
    setLocalFields({
      emeraldTitle: textFields?.emeraldTitle || DEFAULTS.emeraldTitle,
      emeraldMessage: textFields?.emeraldMessage || DEFAULTS.emeraldMessage,
      emeraldBlessing: textFields?.emeraldBlessing || DEFAULTS.emeraldBlessing,
    });
  }, [textFields]);

  const displayCreatorName = useMemo(() => {
    return (textFields?.creatorName || creatorName || '').trim();
  }, [creatorName, textFields]);

  const handleFieldChange = (key: keyof typeof localFields, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const displayValue = (key: keyof typeof localFields) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || localFields[key];
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0d261f] via-[#0f3528] to-[#051912] text-[#f4f6ea]">
      <div className="absolute inset-0 opacity-25">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="emerald-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
              <path
                d="M80 4 L150 40 L150 120 L80 156 L10 120 L10 40 Z"
                fill="none"
                stroke="rgba(201,177,95,0.18)"
                strokeWidth="1.4"
              />
              <path
                d="M80 40 L120 60 L120 100 L80 120 L40 100 L40 60 Z"
                fill="rgba(17,68,54,0.25)"
                stroke="rgba(221,197,122,0.18)"
                strokeWidth="0.9"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#emerald-pattern)" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(78,186,143,0.35)_0%,_transparent_58%)]" />

      <div className="absolute inset-x-0 top-0 flex justify-center">
        <div className="relative mt-8 flex flex-col items-center">
          <div className="h-32 w-[2px] bg-gradient-to-b from-transparent via-[#f0dca2]/40 to-[#f0dca2]/70" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#f0dca2]/40 bg-gradient-to-br from-[#245b48] to-[#163c2f] shadow-[0_0_30px_rgba(229,198,118,0.35)]">
            <div className="absolute inset-4 rounded-full border border-[#f8e7b6]/20" />
            <div className="absolute inset-0 animate-[emeraldLanternPulse_6s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-[#ffeec5]/15 via-[#f9d47a]/10 to-transparent" />
            <span className="text-4xl" role="img" aria-label="Fener">🕯️</span>
          </div>
        </div>
      </div>

      {LANTERN_PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className="pointer-events-none absolute h-2 w-2 rounded-full bg-[#f1d889]/80"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            filter: 'blur(1px)',
            animation: `emeraldFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-16 pt-40">
        <div className="w-full max-w-3xl rounded-[38px] border border-[#f0dca2]/30 bg-white/5 p-10 text-center shadow-[0_30px_120px_rgba(9,38,29,0.7)] backdrop-blur-xl">
          <h1
            className={`font-['Playfair_Display',_serif] text-3xl font-semibold tracking-wide text-[#f3e6c5] sm:text-4xl md:text-5xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-[#f0dca2]/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('emeraldTitle', event.currentTarget.textContent || '')}
            style={{
              textShadow: '0 0 22px rgba(233, 207, 145, 0.45)',
            }}
          >
            {displayValue('emeraldTitle')}
          </h1>

          <div className="mx-auto my-10 max-w-2xl text-lg leading-relaxed text-[#e7ddc5] sm:text-xl">
            <p
              className={`${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-[#1d4436]/50' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('emeraldMessage', event.currentTarget.textContent || '')}
            >
              {displayValue('emeraldMessage')}
            </p>
          </div>

          <p
            className={`mt-6 text-sm uppercase tracking-[0.38em] text-[#d6c79b] ${
              isEditable ? 'cursor-text rounded-xl px-4 py-1 transition hover:bg-[#244d3d]/60' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('emeraldBlessing', event.currentTarget.textContent || '')}
          >
            {displayValue('emeraldBlessing')}
          </p>

          {displayCreatorName && (
            <p className="mt-12 text-xs uppercase tracking-[0.32em] text-[#ceb97c]">
              Hazırlayan: {displayCreatorName}
            </p>
          )}
          {personalRecipient && (
            <span className="sr-only">Bu mesaj {personalRecipient} için ışık saçıyor.</span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes emeraldFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-12px); opacity: 1; }
        }
        @keyframes emeraldLanternPulse {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';

interface RoyalSerenityAuraProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  royalTitle: 'Cumanız Mübarek Olsun 🌟',
  royalMessage: 'Bu mübarek gün kalbinizi ferahlıkla, evinizi huzurla doldursun.',
  royalBlessing: 'Altın ışıkların rehberliğinde sevdiklerinizle buluşun.',
};

const ORBIT_PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: `royal-particle-${index}`,
  offset: index * (360 / 18),
  radius: 130 + (index % 4) * 12,
  size: 3 + (index % 3),
}));

export default function RoyalSerenityAura({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: RoyalSerenityAuraProps) {
  const personalRecipient = useMemo(() => recipientName?.trim() || '', [recipientName]);
  const [localFields, setLocalFields] = useState(() => ({
    royalTitle: textFields?.royalTitle || DEFAULTS.royalTitle,
    royalMessage: textFields?.royalMessage || DEFAULTS.royalMessage,
    royalBlessing: textFields?.royalBlessing || DEFAULTS.royalBlessing,
  }));

  useEffect(() => {
    setLocalFields({
      royalTitle: textFields?.royalTitle || DEFAULTS.royalTitle,
      royalMessage: textFields?.royalMessage || DEFAULTS.royalMessage,
      royalBlessing: textFields?.royalBlessing || DEFAULTS.royalBlessing,
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#070b10] to-[#06201a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(222,183,87,0.25)_0%,_transparent_62%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-25">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="royal-grid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M0 60 H120 M60 0 V120"
                stroke="rgba(136,198,153,0.12)"
                strokeWidth="0.6"
              />
              <circle cx="60" cy="60" r="48" stroke="rgba(222,183,87,0.18)" strokeWidth="0.8" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#royal-grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[44px] border border-[#dcbc6d]/30 bg-gradient-to-br from-[#0b1218]/90 via-[#05080c]/85 to-[#041611]/90 p-12 text-center shadow-[0_50px_160px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
          <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          <div className="absolute inset-x-12 bottom-10 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

          <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
            <div className="absolute h-40 w-40 rounded-full border border-[#d4af37]/40" />
            <div className="absolute h-44 w-44 rounded-full border border-[#86c89f]/20" />
            <div className="absolute h-[360px] w-[360px] max-w-[85vw] animate-[royalSpin_22s_linear_infinite]">
              {ORBIT_PARTICLES.map((particle) => (
                <span
                  key={particle.id}
                  className="absolute block rounded-full bg-[#f1d48a] shadow-[0_0_12px_rgba(241,212,138,0.85)]"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    left: '50%',
                    top: '50%',
                    marginLeft: `-${particle.size / 2}px`,
                    marginTop: `-${particle.size / 2}px`,
                    transform: `rotate(${particle.offset}deg) translate(${particle.radius}px) rotate(-${particle.offset}deg)`,
                  }}
                />
              ))}
            </div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#111b24] via-[#0b141a] to-[#0c261d] shadow-[0_0_80px_rgba(222,183,87,0.45)]">
              <div className="absolute inset-1 rounded-full border border-[#d4af37]/40" />
              <div className="absolute inset-0 animate-[royalHalo_7s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-[#f0d48b]/35 via-transparent to-transparent" />
              <span className="text-5xl" role="img" aria-label="Hilal">🌙</span>
            </div>
          </div>

          <h1
            className={`font-['Cinzel',_serif] text-3xl font-semibold tracking-[0.16em] text-[#f4e1b9] sm:text-4xl md:text-5xl ${
              isEditable ? 'cursor-text rounded-2xl px-6 py-2 transition hover:bg-[#d4af37]/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('royalTitle', event.currentTarget.textContent || '')}
            style={{
              textShadow: '0 0 24px rgba(223, 192, 108, 0.45)',
            }}
          >
            {displayValue('royalTitle')}
          </h1>

          <p
            className={`mx-auto mt-10 max-w-2xl font-['Noto_Serif_Display',_serif] text-lg leading-relaxed text-[#f3e7c6]/90 sm:text-xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-white/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('royalMessage', event.currentTarget.textContent || '')}
          >
            {displayValue('royalMessage')}
          </p>

          <p
            className={`mt-8 text-sm uppercase tracking-[0.42em] text-[#b9b085] ${
              isEditable ? 'cursor-text rounded-xl px-4 py-1 transition hover:bg-[#16221d]/70' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('royalBlessing', event.currentTarget.textContent || '')}
          >
            {displayValue('royalBlessing')}
          </p>

          {displayCreatorName && (
            <p className="mt-12 text-xs uppercase tracking-[0.34em] text-[#a7a16b]">
              Hazırlayan: {displayCreatorName}
            </p>
          )}
          {personalRecipient && (
            <span className="sr-only">Bu mesaj {personalRecipient} için ışıltıyla hazırlandı.</span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes royalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes royalHalo {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

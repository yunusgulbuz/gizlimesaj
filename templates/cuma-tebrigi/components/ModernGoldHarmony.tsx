'use client';

import { useEffect, useMemo, useState } from 'react';

interface ModernGoldHarmonyProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  modernTitle: 'Hayırlı Cumalar ✨',
  modernMessage: 'Cumanız bereket, dualarınız kabul olsun.',
  modernAccent: 'Altın ışığın huzuru kalplere dolsun.',
};

const PARTICLES = Array.from({ length: 14 }, (_, index) => ({
  id: `particle-${index}`,
  left: Math.random() * 100,
  top: Math.random() * 100,
  scale: 1 + Math.random() * 1.4,
  delay: index * 0.35,
}));

export default function ModernGoldHarmony({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ModernGoldHarmonyProps) {
  const personalRecipient = useMemo(() => recipientName?.trim() || '', [recipientName]);
  const [localFields, setLocalFields] = useState(() => ({
    modernTitle: textFields?.modernTitle || DEFAULTS.modernTitle,
    modernMessage: textFields?.modernMessage || DEFAULTS.modernMessage,
    modernAccent: textFields?.modernAccent || DEFAULTS.modernAccent,
  }));

  useEffect(() => {
    setLocalFields({
      modernTitle: textFields?.modernTitle || DEFAULTS.modernTitle,
      modernMessage: textFields?.modernMessage || DEFAULTS.modernMessage,
      modernAccent: textFields?.modernAccent || DEFAULTS.modernAccent,
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white via-[#fffaf3] to-[#f6efe3] text-[#1e1b16]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,224,171,0.45)_0%,_transparent_60%)]" />

      {PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#d9b15d]/60"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            transform: `scale(${particle.scale})`,
            animation: `pulse ${4.2 + particle.delay}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[520px] w-[520px] max-w-[90vw] rounded-full bg-gradient-to-br from-[#fef8ec] via-[#f9edd4] to-transparent opacity-80 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-[46px] border border-[#f0e2c6]/70 bg-white/70 p-12 text-center shadow-[0_40px_90px_rgba(218,193,135,0.35)] backdrop-blur-xl">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#ddc28f]/60">
            <div className="h-16 w-16 rounded-full border border-[#d4af37]/40 bg-[#fffaf3]" />
          </div>

          <h1
            className={`font-['Manrope',_sans-serif] text-3xl font-medium tracking-tight text-[#1f1b16] sm:text-4xl md:text-5xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-[#f8ecd5]/60' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('modernTitle', event.currentTarget.textContent || '')}
          >
            {displayValue('modernTitle')}
          </h1>

          <div className="mx-auto my-10 h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

          <p
            className={`mx-auto max-w-xl text-base leading-relaxed text-[#4b453d] sm:text-lg ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-white/70' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('modernMessage', event.currentTarget.textContent || '')}
          >
            {displayValue('modernMessage')}
          </p>

          <p
            className={`mt-8 text-sm uppercase tracking-[0.4em] text-[#b69964] ${
              isEditable ? 'cursor-text rounded-xl px-4 py-1 transition hover:bg-[#fdf5e8]/70' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('modernAccent', event.currentTarget.textContent || '')}
          >
            {displayValue('modernAccent')}
          </p>

          {displayCreatorName && (
            <p className="mt-12 text-xs uppercase tracking-[0.32em] text-[#bca279]">
              Hazırlayan: {displayCreatorName}
            </p>
          )}
          {personalRecipient && (
            <span className="sr-only">Bu mesaj {personalRecipient} için hazırlandı.</span>
          )}
        </div>
      </div>
    </div>
  );
}

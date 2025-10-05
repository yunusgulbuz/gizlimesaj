'use client';

import { useState, useEffect } from 'react';

interface ModernSoftGlowProps {
  recipientName: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  mainTitle: 'Hayırlı Kandiller 🌙',
  subMessage: 'Gönlünüz nurla, ömrünüz huzurla dolsun.',
};

export default function ModernSoftGlow({
  recipientName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ModernSoftGlowProps) {
  const [localFields, setLocalFields] = useState({
    mainTitle: textFields?.mainTitle || DEFAULTS.mainTitle,
    subMessage: textFields?.subMessage || DEFAULTS.subMessage,
  });

  useEffect(() => {
    setLocalFields({
      mainTitle: textFields?.mainTitle || DEFAULTS.mainTitle,
      subMessage: textFields?.subMessage || DEFAULTS.subMessage,
    });
  }, [textFields]);

  const handleChange = (key: string, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const displayValue = (key: keyof typeof localFields) => {
    return isEditable ? localFields[key] : textFields?.[key] || localFields[key];
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white via-[#fefaf5] to-[#f9f3e8]">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f0e5d0]/10 blur-3xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#d4af37]/10 blur-2xl" />
              <div className="relative text-6xl">🌙</div>
            </div>
          </div>

          <h1
            className={`font-sans text-4xl font-light tracking-wide text-[#2c2416] sm:text-5xl md:text-6xl ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f5ece1]/30' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('mainTitle', e.currentTarget.textContent || '')}
          >
            {displayValue('mainTitle')}
          </h1>

          <div className="my-10 flex justify-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          </div>

          <p
            className={`mx-auto max-w-lg font-serif text-base italic text-[#5a4a3a] sm:text-lg ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f5ece1]/30' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('subMessage', e.currentTarget.textContent || '')}
          >
            {displayValue('subMessage')}
          </p>

          <div className="mt-16 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#d4af37]/60"
                style={{
                  animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface MinimalistGeceNurProps {
  recipientName: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  mainTitle: 'Bu Kandil Gecesi Size Huzur Getirsin',
  subMessage: 'Geceniz mübarek, gönlünüz ferah olsun.',
};

export default function MinimalistGeceNur({
  recipientName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: MinimalistGeceNurProps) {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a0e1a] via-[#1a2540] to-[#0f1828]">
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-[#d4af37]/10 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#d4af37] opacity-20 blur-xl" style={{ animationDuration: '3s' }} />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#d4af37]/30 bg-gradient-to-br from-[#1a2540]/50 to-transparent backdrop-blur-sm">
                <span className="text-5xl drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">🌙</span>
              </div>
            </div>
          </div>

          <h1
            className={`font-sans text-3xl font-light leading-relaxed text-white sm:text-4xl md:text-5xl ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/5' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('mainTitle', e.currentTarget.textContent || '')}
          >
            {displayValue('mainTitle')}
          </h1>

          <div className="my-10 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <div className="h-1 w-1 rounded-full bg-[#d4af37]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>

          <p
            className={`mx-auto max-w-md font-serif text-base text-[#c4b5a0] sm:text-lg ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/5' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('subMessage', e.currentTarget.textContent || '')}
          >
            {displayValue('subMessage')}
          </p>

          <div className="mt-20 flex justify-center gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-0.5 w-0.5 rounded-full bg-[#d4af37] animate-pulse"
                style={{
                  boxShadow: '0 0 8px #d4af37',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

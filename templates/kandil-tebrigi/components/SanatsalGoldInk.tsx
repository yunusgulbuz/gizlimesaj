'use client';

import { useState, useEffect } from 'react';

interface SanatsalGoldInkProps {
  recipientName: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  mainTitle: 'Mübarek Kandil Geceniz Hayırlara Vesile Olsun',
  subMessage: "Allah'ın rahmeti üzerinizde olsun.",
};

export default function SanatsalGoldInk({
  recipientName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: SanatsalGoldInkProps) {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#f5f0e8] via-[#faf7f0] to-[#ede5d8]">
      <div className="absolute inset-0 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
            width: `${80 + Math.random() * 120}px`,
            height: `${80 + Math.random() * 120}px`,
            background: `radial-gradient(circle, rgba(212,175,55,${0.05 + Math.random() * 0.1}) 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${10 + i * 2}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <div className="rounded-3xl border border-[#d4af37]/20 bg-gradient-to-br from-white/60 via-[#fefcf8]/50 to-[#f9f5ed]/60 p-12 shadow-2xl backdrop-blur-sm">
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-xl" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#d4af37]/40 bg-gradient-to-br from-[#fefcf8] to-[#f5ede0]">
                  <div className="absolute inset-2 rounded-full border border-[#d4af37]/20" />
                  <span className="text-6xl">🌙</span>
                </div>
              </div>
            </div>

            <h1
              className={`text-center font-serif text-3xl font-normal leading-relaxed text-[#3a2f1f] sm:text-4xl md:text-5xl ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f5ece1]/40' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('mainTitle', e.currentTarget.textContent || '')}
              style={{
                textShadow: '0 1px 2px rgba(212,175,55,0.1)',
              }}
            >
              {displayValue('mainTitle')}
            </h1>

            <div className="my-8 flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-[#d4af37]/60" />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-1 w-1 rounded-full bg-[#d4af37]/60" />
                ))}
              </div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent via-[#d4af37]/40 to-[#d4af37]/60" />
            </div>

            <p
              className={`text-center font-serif text-lg italic text-[#5a4a38] sm:text-xl ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f5ece1]/40' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('subMessage', e.currentTarget.textContent || '')}
            >
              {displayValue('subMessage')}
            </p>

            <div className="mt-10 flex justify-center gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rotate-45 border border-[#d4af37]/40 animate-pulse"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

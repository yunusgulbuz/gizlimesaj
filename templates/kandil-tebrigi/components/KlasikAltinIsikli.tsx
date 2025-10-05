'use client';

import { useState, useEffect } from 'react';

interface KlasikAltinIsikliProps {
  recipientName: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  mainTitle: 'Mübarek Kandiliniz Kutlu Olsun',
  subMessage: 'Bu mübarek gecede dualarınız kabul olsun.',
};

export default function KlasikAltinIsikli({
  recipientName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: KlasikAltinIsikliProps) {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a2847] to-[#0f1e3a]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(212,175,55,0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(212,175,55,0.1) 0%, transparent 50%)`
        }} />
      </div>

      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${15 + i * 12}%`,
            top: `${10 + (i % 3) * 30}%`,
            width: '2px',
            height: '2px',
            background: '#d4af37',
            borderRadius: '50%',
            boxShadow: '0 0 10px #d4af37',
            animationDelay: `${i * 0.5}s`,
            animationDuration: '3s',
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#d4af37] opacity-20 blur-xl" />
              <svg className="relative h-20 w-20 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4.5L19.5 12L12 19.5L4.5 12L12 4.5M12 7C9.79 7 8 8.79 8 11C8 13.21 9.79 15 12 15C14.21 15 16 13.21 16 11C16 8.79 14.21 7 12 7Z" />
              </svg>
            </div>
          </div>

          <h1
            className={`font-serif text-4xl font-bold text-[#d4af37] sm:text-5xl md:text-6xl ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/5' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('mainTitle', e.currentTarget.textContent || '')}
            style={{
              textShadow: '0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.3)',
            }}
          >
            {displayValue('mainTitle')}
          </h1>

          <div className="my-12 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="h-2 w-2 rotate-45 border border-[#d4af37]" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>

          <p
            className={`mx-auto max-w-xl font-serif text-lg text-[#e8d4a0] sm:text-xl ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/5' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('subMessage', e.currentTarget.textContent || '')}
          >
            {displayValue('subMessage')}
          </p>

          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#d4af37] opacity-10 blur-2xl" style={{ animationDuration: '4s' }} />
              <div className="relative h-32 w-32 rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-[#1a2847]/80 to-[#0f1e3a]/80 backdrop-blur-sm flex items-center justify-center">
                <span className="text-5xl">🌙</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

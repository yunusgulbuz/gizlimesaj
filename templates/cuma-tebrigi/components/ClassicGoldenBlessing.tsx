'use client';

import { useEffect, useMemo, useState } from 'react';

interface ClassicGoldenBlessingProps {
  recipientName: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  classicTitle: 'Hayırlı Cumalar 🌙',
  classicMessage: 'Bu mübarek gün kalplerinize huzur, evinize bereket getirsin.',
};

const STAR_CLUSTER = Array.from({ length: 9 }, (_, index) => ({
  id: `star-${index}`,
  left: 8 + index * 9,
  top: 12 + (index % 3) * 23,
  size: 6 + (index % 4),
  delay: index * 0.55,
}));

export default function ClassicGoldenBlessing({
  recipientName,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ClassicGoldenBlessingProps) {
  const [localFields, setLocalFields] = useState(() => ({
    classicTitle: textFields?.classicTitle || DEFAULTS.classicTitle,
    classicMessage: textFields?.classicMessage || DEFAULTS.classicMessage,
  }));

  useEffect(() => {
    setLocalFields({
      classicTitle: textFields?.classicTitle || DEFAULTS.classicTitle,
      classicMessage: textFields?.classicMessage || DEFAULTS.classicMessage,
    });
  }, [textFields]);

  const displayCreatorName = useMemo(() => {
    const candidate = textFields?.creatorName || creatorName || '';
    if (recipientName && !candidate) {
      return '';
    }
    return candidate.trim();
  }, [creatorName, recipientName, textFields]);

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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050c1d] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050b1a] via-[#0b1b3a] to-[#193053]" />

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cuma-hat-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M60 6 L90 60 L60 114 L30 60 Z"
                fill="none"
                stroke="rgba(212,175,55,0.18)"
                strokeWidth="1.2"
              />
              <circle cx="60" cy="60" r="18" stroke="rgba(212,175,55,0.25)" strokeWidth="1" fill="none" />
              <path
                d="M60 24 C78 24 96 42 96 60 C96 78 78 96 60 96 C42 96 24 78 24 60 C24 42 42 24 60 24"
                fill="none"
                stroke="rgba(236,204,113,0.12)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cuma-hat-pattern)" />
        </svg>
      </div>

      {STAR_CLUSTER.map((item) => (
        <div
          key={item.id}
          className="absolute rounded-full bg-[#f7d37c]/80 shadow-[0_0_12px_rgba(247,211,124,0.65)]"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animation: `pulse ${3.6 + item.delay}s ease-in-out ${item.delay}s infinite`,
          }}
        />
      ))}

      <div className="absolute inset-x-[10%] top-0 h-48 rounded-b-[3rem] border-x border-b border-[#f8d87a]/30 bg-gradient-to-b from-[#f8d87a]/15 via-[#f7cd62]/10 to-transparent backdrop-blur-sm" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl rounded-[40px] border border-[#f8d87a]/30 bg-white/5 p-10 text-center shadow-[0_40px_120px_rgba(15,30,60,0.65)] backdrop-blur-xl">
          <div className="mx-auto mb-8 w-32">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-[#f8d87a]/20 blur-3xl" />
              <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-full border border-[#f8d87a]/60 bg-gradient-to-br from-[#0b1a33] to-[#13294b]">
                <span className="text-5xl" role="img" aria-label="Hilal">🌙</span>
              </div>
            </div>
          </div>

          <h1
            className={`font-['Cormorant_Garamond',_serif] text-3xl font-semibold tracking-wide text-[#f8e6a8] sm:text-4xl md:text-5xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-[#f8d87a]/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('classicTitle', event.currentTarget.textContent || '')}
            style={{
              textShadow: '0 0 18px rgba(248, 216, 122, 0.25)',
            }}
          >
            {displayValue('classicTitle')}
          </h1>

          <div className="mx-auto my-10 flex w-full max-w-xs items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#f8d87a]/40 to-[#f8d87a]/70" />
            <span className="text-[#f8d87a]">﴾</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent via-[#f8d87a]/40 to-[#f8d87a]/70" />
          </div>

          <p
            className={`mx-auto max-w-2xl font-['Cormorant_Garamond',_serif] text-lg text-[#f1e3c4] sm:text-xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 transition hover:bg-white/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleFieldChange('classicMessage', event.currentTarget.textContent || '')}
          >
            {displayValue('classicMessage')}
          </p>

          {displayCreatorName && (
            <p className="mt-12 text-xs uppercase tracking-[0.35em] text-[#f0dba1]/70">
              Hazırlayan: {displayCreatorName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


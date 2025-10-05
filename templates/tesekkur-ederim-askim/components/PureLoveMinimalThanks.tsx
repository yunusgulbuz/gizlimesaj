'use client';

import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PureLoveMinimalThanksProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const MINIMAL_DEFAULTS = {
  minimalMainText: 'Teşekkür Ederim',
  minimalAccentText: 'Aşkım',
  minimalButtonLabel: '❤️',
  minimalPopupText: 'Sen her şeyin en güzeline layıksın',
  minimalBodyText: 'Sıradan bir gün, seninle olağanüstü bir ana dönüşüyor.',
};

export default function PureLoveMinimalThanks({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: PureLoveMinimalThanksProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [pulse, setPulse] = useState(false);

  const initialValues = useMemo(() => ({
    minimalMainText: textFields?.minimalMainText || MINIMAL_DEFAULTS.minimalMainText,
    minimalAccentText:
      textFields?.minimalAccentText || recipientName || MINIMAL_DEFAULTS.minimalAccentText,
    minimalButtonLabel: textFields?.minimalButtonLabel || MINIMAL_DEFAULTS.minimalButtonLabel,
    minimalPopupText: textFields?.minimalPopupText || message || MINIMAL_DEFAULTS.minimalPopupText,
    minimalBodyText: textFields?.minimalBodyText || MINIMAL_DEFAULTS.minimalBodyText,
  }), [textFields, recipientName, message]);

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  const displayValue = (key: keyof typeof initialValues) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleContentChange = (key: keyof typeof initialValues, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const handleReveal = () => {
    setShowMessage(true);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 600);
  };

  useEffect(() => {
    if (!showMessage) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMessage(false);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showMessage]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-white to-[#f6f7fb] px-6 py-16 text-[#1e1e1e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,222,255,0.45)_0,_rgba(255,255,255,0.9)_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, rgba(220,226,234,0.25) 0%, transparent 45%, rgba(206,212,223,0.25) 100%)' }} />

      <div className="relative z-10 w-full max-w-2xl rounded-[36px] border border-[#e0e6f0] bg-white/80 p-10 text-center shadow-[0_50px_120px_rgba(95,107,134,0.12)] backdrop-blur-xl">
        <div className="space-y-6">
          <div
            className={`text-4xl font-light tracking-tight text-[#161616] sm:text-5xl md:text-6xl ${
              isEditable ? 'cursor-text rounded-[24px] px-3 py-2 hover:bg-[#f6f7fb]' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('minimalMainText', event.currentTarget.textContent || '')}
          >
            {displayValue('minimalMainText')}
          </div>

          <div
            className={`text-xl font-medium text-[#b189c6] sm:text-2xl ${
              isEditable ? 'cursor-text rounded-[20px] px-3 py-1 hover:bg-[#f6f7fb]' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('minimalAccentText', event.currentTarget.textContent || '')}
          >
            {displayValue('minimalAccentText')}
          </div>

          <p
            className={`text-base text-[#5f6470] sm:text-lg ${
              isEditable ? 'cursor-text rounded-[18px] px-3 py-2 hover:bg-[#f6f7fb]' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('minimalBodyText', event.currentTarget.textContent || '')}
          >
            {displayValue('minimalBodyText')}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            onClick={handleReveal}
            className={`h-16 w-16 rounded-full bg-white/80 text-xl shadow-[0_12px_40px_rgba(158,110,190,0.25)] transition-all duration-300 ${
              pulse ? 'scale-110 shadow-[0_20px_55px_rgba(158,110,190,0.4)]' : 'hover:scale-105'
            }`}
          >
            <span
              className={`${
                isEditable ? 'cursor-text' : 'pointer-events-none'
              } text-2xl`}
              {...(isEditable
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                      handleContentChange('minimalButtonLabel', event.currentTarget.textContent || ''),
                  }
                : {})}
            >
              {displayValue('minimalButtonLabel')}
            </span>
          </Button>
        </div>

        <div
          className={`fixed inset-0 z-20 flex items-center justify-center px-6 transition-opacity duration-500 ${
            showMessage ? 'pointer-events-auto opacity-100 backdrop-blur-[6px]' : 'pointer-events-none opacity-0 backdrop-blur-none'
          }`}
          aria-hidden={!showMessage}
          onClick={() => setShowMessage(false)}
        >
          <div
            className={`relative max-w-md rounded-3xl border border-[#e2d6ef] bg-white/90 px-8 py-10 text-center text-[#342f3b] shadow-[0_30px_80px_rgba(94,78,117,0.25)] transition-transform duration-500 ${
              showMessage ? 'scale-100' : 'scale-95'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <p
              className={`${
                isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white' : ''
              } text-lg font-medium leading-relaxed`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('minimalPopupText', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalPopupText')}
            </p>
          </div>
        </div>

        {creatorName && (
          <p className="mt-8 text-xs uppercase tracking-[0.4em] text-[#8d8f95]">Hazırlayan: {creatorName}</p>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .fixed > div {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

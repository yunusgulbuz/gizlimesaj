'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CleanRomanticPlanProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  minimalTitle: 'Küçük Bir Planım Var 💙',
  minimalSubtitle: 'Cumartesi seni şaşırtacağım... Rahat bir şeyler giy lütfen.',
  minimalButtonLabel: 'Spoiler Verme 🙈',
  minimalBubbleText: 'Sadece küçük bir ipucu: kısa bir yürüyüş ve ardından sıcak bir kahve molası.',
  minimalPhotoHint: 'Polaroidi Aç',
  minimalSignatureLabel: 'Buluşma ortağın:'
};

type FieldKey =
  | 'minimalTitle'
  | 'minimalSubtitle'
  | 'minimalButtonLabel'
  | 'minimalBubbleText'
  | 'minimalPhotoUrl'
  | 'minimalPhotoHint'
  | 'minimalSignatureLabel';

export default function CleanRomanticPlan({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: CleanRomanticPlanProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(() => ({
    minimalTitle: textFields?.minimalTitle || DEFAULTS.minimalTitle,
    minimalSubtitle:
      textFields?.minimalSubtitle ||
      (recipientName ? `${recipientName} için planım: ${DEFAULTS.minimalSubtitle}` : DEFAULTS.minimalSubtitle),
    minimalButtonLabel: textFields?.minimalButtonLabel || DEFAULTS.minimalButtonLabel,
    minimalBubbleText: textFields?.minimalBubbleText || message || DEFAULTS.minimalBubbleText,
    minimalPhotoUrl: textFields?.minimalPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
    minimalPhotoHint: textFields?.minimalPhotoHint || DEFAULTS.minimalPhotoHint,
    minimalSignatureLabel: textFields?.minimalSignatureLabel || DEFAULTS.minimalSignatureLabel,
  }), [textFields, recipientName, message]);

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 60);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (showPhoto && !isEditable) {
      const handleClickOutside = (event: MouseEvent) => {
        if (photoRef.current && !photoRef.current.contains(event.target as Node)) {
          setShowPhoto(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPhoto, isEditable]);

  const displayValue = (key: FieldKey) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleContentChange = (key: FieldKey, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const minimalPhotoUrl = displayValue('minimalPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#f5f8ff] via-[#fbfdff] to-[#edf2f8] text-[#0f1a2a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(164,197,255,0.28),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22140%22%20height%3D%22140%22%20viewBox%3D%220%200%20140%20140%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%221%22%20height%3D%22140%22%20fill%3D%22rgba(12%2C36%2C64%2C0.08)%22%2F%3E%3Crect%20height%3D%221%22%20width%3D%22140%22%20fill%3D%22rgba(12%2C36%2C64%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div
          className={`w-full max-w-2xl rounded-[32px] border border-[#d8e2f3] bg-white/80 p-8 shadow-[0_25px_60px_rgba(120,140,190,0.18)] backdrop-blur-lg transition-all duration-600 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-8 text-center">
            {minimalPhotoUrl ? (
              <div className="flex flex-col items-center gap-3">
                {(isEditable || !showPhoto) && (
                  isEditable ? (
                    <div
                      className="rounded-full border border-[#c4d3e6] bg-white px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#58719b]"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('minimalPhotoHint', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {displayValue('minimalPhotoHint')}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowPhoto(true);
                      }}
                      className="rounded-full border border-[#c4d3e6] bg-white px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#58719b] transition hover:bg-[#dce7f8]"
                    >
                      {displayValue('minimalPhotoHint')}
                    </button>
                  )
                )}

                {(isEditable || showPhoto) && (
                  <div
                    ref={photoRef}
                    className="polaroid relative w-36 rounded-lg bg-white p-3 shadow-[0_15px_35px_rgba(15,26,42,0.12)]"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded bg-[#eef2f8]">
                      <img src={minimalPhotoUrl} alt="Polaroid önizleme" className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#dbe4f2]" />
                  </div>
                )}

                {isEditable && (
                  <div
                    className="text-[0.7rem] text-[#58719b]"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('minimalPhotoUrl', event.currentTarget.textContent?.trim() || '')
                    }
                  >
                    {minimalPhotoUrl || 'Fotoğraf için URL girin'}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-[#c4d3e6] bg-white text-xs text-[#58719b] ${
                  isEditable ? 'cursor-text px-5 text-center' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) =>
                  handleContentChange('minimalPhotoUrl', event.currentTarget.textContent?.trim() || '')
                }
              >
                {isEditable ? 'Fotoğraf için URL girin' : ''}
              </div>
            )}

            <div
              className={`text-3xl font-semibold tracking-tight text-[#0f1a2a] sm:text-4xl md:text-[3rem] ${
                isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-[#eef4fc]' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('minimalTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalTitle')}
            </div>

            <p
              className={`max-w-xl text-base text-[#3a4c63] sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-[#eef4fc]' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('minimalSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalSubtitle')}
            </p>

            <Button
              onClick={() => setShowSpoiler((prev) => !prev)}
              className="relative overflow-hidden rounded-full border border-[#9ab8de] bg-gradient-to-r from-[#f1f6ff] via-[#e0ebff] to-[#d0e5ff] px-10 py-3 text-base font-medium text-[#20406b] shadow-[0_18px_40px_rgba(80,110,155,0.18)] transition hover:scale-[1.02]"
            >
              <span
                className={`${
                  isEditable ? 'cursor-text text-[#20406b]' : 'pointer-events-none'
                } relative z-10 select-text`}
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
              <div className="absolute inset-0 animate-[softShimmer_3.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </Button>

            <div
              className={`relative w-full overflow-hidden transition-all duration-500 ${
                showSpoiler ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div
                className={`spoiler-bubble mx-auto max-w-xl rounded-[26px] border border-[#c4d3e6] bg-white px-7 py-6 text-[#2b3f57] shadow-[0_20px_40px_rgba(150,170,200,0.18)] transition-all duration-500 ${
                  showSpoiler ? 'translate-y-0' : 'translate-y-4'
                } ${isEditable ? 'cursor-text hover:bg-[#f7faff]' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('minimalBubbleText', event.currentTarget.textContent || '')}
              >
                {displayValue('minimalBubbleText')}
              </div>
            </div>

            {creatorName && (
              <p className="text-xs uppercase tracking-[0.4em] text-[#8496b5]">
                <span
                  className={isEditable ? 'cursor-text rounded px-2 py-1 hover:bg-[#eef4fc]' : ''}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('minimalSignatureLabel', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('minimalSignatureLabel')}
                </span>{' '}
                {creatorName}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .polaroid::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(12, 36, 64, 0.06) 100%);
          pointer-events: none;
        }

        .spoiler-bubble {
          position: relative;
        }

        .spoiler-bubble::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          width: 28px;
          height: 28px;
          background: inherit;
          border-bottom: inherit;
          border-right: inherit;
          transform-origin: top;
          transform: translate(-50%, -2px) rotate(45deg);
        }

        @keyframes softShimmer {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
}

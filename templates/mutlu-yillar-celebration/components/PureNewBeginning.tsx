'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PureNewBeginningProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  minimalTitle: 'Mutlu Yıllar!',
  minimalSubtitle: 'Yeni yıl sana huzur, denge ve taze başlangıçlar getirsin.',
  minimalButtonLabel: 'Yeni Yılı Kutla 🎈',
  minimalAfterMessage: 'Yeni bir sayfa başladı ✨',
  minimalBodyMessage:
    'Geçmişin ağırlığını geride bırakıp, umut dolu bir yılın kapısını aralıyoruz. Her yeni gün, hafif bir nefes ve sıcak bir tebessüm getirsin.',
  minimalPhotoUrl: '',
};

export default function PureNewBeginning({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: PureNewBeginningProps) {
  const initialValues = useMemo(
    () => ({
      minimalTitle: textFields?.minimalTitle || DEFAULTS.minimalTitle,
      minimalSubtitle:
        textFields?.minimalSubtitle ||
        `${recipientName ? `${recipientName}, ` : ''}${DEFAULTS.minimalSubtitle}`.trim(),
      minimalButtonLabel: textFields?.minimalButtonLabel || DEFAULTS.minimalButtonLabel,
      minimalAfterMessage: textFields?.minimalAfterMessage || DEFAULTS.minimalAfterMessage,
      minimalBodyMessage: textFields?.minimalBodyMessage || message || DEFAULTS.minimalBodyMessage,
      minimalPhotoUrl: textFields?.minimalPhotoUrl || DEFAULTS.minimalPhotoUrl,
    }),
    [recipientName, message, textFields]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const revealTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 90);
    return () => window.clearTimeout(timer);
  }, []);

  const handleFieldChange = (key: keyof typeof initialValues, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const displayValue = (key: keyof typeof initialValues) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleCelebrate = () => {
    if (revealTimeoutRef.current) {
      window.clearTimeout(revealTimeoutRef.current);
    }

    if (isEditable) {
      setIsRevealed((prev) => !prev);
    } else {
      setIsRevealed(true);
      revealTimeoutRef.current = window.setTimeout(() => {
        setIsRevealed(false);
      }, 3200);
    }
  };

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  const photoUrl = displayValue('minimalPhotoUrl').trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#eef2f7] to-[#dfe7ef] text-[#1e293b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(191,219,254,0.28),transparent_40%,rgba(226,232,240,0.45))]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-14 sm:px-6 lg:px-10">
        <div
          className={`relative w-full max-w-3xl rounded-[28px] border border-slate-200/70 bg-white/70 p-6 shadow-[0_22px_80px_rgba(148,163,184,0.25)] backdrop-blur-xl transition-all duration-700 sm:p-10 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/60" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:gap-8">
            {isEditable ? (
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full justify-center">
                  <input
                    className="w-full max-w-xs rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Fotoğraf URL'sini buraya girin"
                    value={displayValue('minimalPhotoUrl')}
                    onChange={(event) => handleFieldChange('minimalPhotoUrl', event.currentTarget.value)}
                  />
                </div>
                {photoUrl ? (
                  <div className="relative -mb-2 w-32 max-w-full">
                    <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[14px] border border-slate-300/40 bg-slate-100" />
                    <img
                      src={photoUrl}
                      alt={displayValue('minimalTitle') || 'Yeni yıl fotoğrafı'}
                      className="relative z-10 w-full rounded-[14px] border border-white object-cover shadow-[0_18px_45px_rgba(100,116,139,0.35)]"
                    />
                    <div className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">Önizleme</div>
                  </div>
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-[14px] border border-dashed border-slate-300/60 bg-white/70 text-center text-xs text-slate-500">
                    URL eklediğinizde fotoğraf burada görünecek
                  </div>
                )}
              </div>
            ) : photoUrl ? (
              <div className="relative -mb-2 w-32 max-w-full">
                <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[14px] border border-slate-300/40 bg-slate-100" />
                <img
                  src={photoUrl}
                  alt={displayValue('minimalTitle') || 'Yeni yıl fotoğrafı'}
                  className="relative z-10 w-full rounded-[14px] border border-white object-cover shadow-[0_18px_45px_rgba(100,116,139,0.35)]"
                />
                <div className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">Anıyı Sakla</div>
              </div>
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-[14px] border border-dashed border-slate-300/60 bg-white/70 text-center text-xs text-slate-500">
                Fotoğraf eklemek için URL girin
              </div>
            )}

            <div
              className={`text-3xl font-semibold text-slate-700 sm:text-4xl lg:text-[2.8rem] ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-slate-100/80' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('minimalTitle', event.currentTarget.textContent || '')}
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.1rem)' }}
            >
              {displayValue('minimalTitle')}
            </div>

            <p
              className={`max-w-2xl text-sm text-slate-500 sm:text-base ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-slate-100/80' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('minimalSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalSubtitle')}
            </p>

            <div
              className={`max-w-2xl rounded-[22px] border border-slate-200 bg-white/80 p-6 text-base leading-relaxed text-slate-600 shadow-inner transition ${
                isEditable ? 'cursor-text hover:bg-white' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('minimalBodyMessage', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalBodyMessage')}
            </div>

            <Button
              type="button"
              onClick={handleCelebrate}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 px-9 py-3 text-base font-medium text-white shadow-[0_18px_45px_rgba(15,23,42,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800/90 sm:text-lg animate-[minimalBounce_3.6s_ease-in-out_infinite]"
            >
              <span
                className={`${
                  isEditable ? 'cursor-text' : 'pointer-events-none'
                } relative z-10`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleFieldChange('minimalButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('minimalButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[minimalSheen_3.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0" />
            </Button>

            <div
              className={`mt-6 max-w-md rounded-3xl border border-slate-200/80 bg-white/90 px-6 py-6 text-base font-medium text-slate-600 shadow-[0_18px_45px_rgba(95,107,134,0.22)] transition-all duration-500 ${
                isRevealed ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              } ${isRevealed ? 'pointer-events-auto' : 'pointer-events-none'} ${
                isEditable ? 'cursor-text hover:bg-white focus:outline-none' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleFieldChange('minimalAfterMessage', event.currentTarget.textContent || '')}
              aria-hidden={!isRevealed && !isEditable}
            >
              {displayValue('minimalAfterMessage')}
            </div>
            {isEditable && !isRevealed && (
              <p className="mt-2 text-xs text-slate-400">
                Bu metin butona tıklanınca görünür. Önizleyip düzenlemek için butona bas.
              </p>
            )}
          </div>
        </div>
      </div>

      {creatorName && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.35em] text-slate-400">
          Hazırlayan: {creatorName}
        </div>
      )}

      <style jsx>{`
        @keyframes minimalBounce {
          0%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
          60% {
            transform: translateY(-2px);
          }
        }

        @keyframes minimalSheen {
          0% {
            opacity: 0;
            transform: translateX(-140%);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(140%);
          }
        }
      `}</style>
    </div>
  );
}

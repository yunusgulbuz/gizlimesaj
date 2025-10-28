'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PastelGradientCelebrationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  pastelTitle: 'Doğum Günün Kutlu Olsun 🎉',
  pastelSubtitle: 'Bugün senin günün! Tüm dileklerin gerçek olsun 🎂',
  pastelButtonLabel: 'Kutlamayı Başlat 🎂',
  pastelWishText: 'Dileğini Tut! ✨',
  pastelPhotoHint: 'Özel Anıyı Gör',
};

type FieldKey =
  | 'pastelTitle'
  | 'pastelSubtitle'
  | 'pastelButtonLabel'
  | 'pastelWishText'
  | 'pastelPhotoUrl'
  | 'pastelPhotoHint';

export default function PastelGradientCelebration({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: PastelGradientCelebrationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      pastelTitle: textFields?.pastelTitle || DEFAULTS.pastelTitle,
      pastelSubtitle: textFields?.pastelSubtitle || message || DEFAULTS.pastelSubtitle,
      pastelButtonLabel: textFields?.pastelButtonLabel || DEFAULTS.pastelButtonLabel,
      pastelWishText: textFields?.pastelWishText || DEFAULTS.pastelWishText,
      pastelPhotoUrl: textFields?.pastelPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
      pastelPhotoHint: textFields?.pastelPhotoHint || DEFAULTS.pastelPhotoHint,
    }),
    [textFields, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

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

  const handleCelebrate = () => {
    setIsAnimating(true);
    if (confettiRef.current) {
      confettiRef.current.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.background = ['#E6B3FF', '#FFB3C1', '#B3E5FC', '#FFF9C4', '#FFE0B2'][
          Math.floor(Math.random() * 5)
        ];
        confettiRef.current.appendChild(confetti);
      }
    }
    setTimeout(() => setIsAnimating(false), 3000);
  };

  const pastelPhotoUrl = displayValue('pastelPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6B3FF] via-[#FFB3C1] to-[#B3E5FC]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.5%22%20fill%3D%22rgba(255%2C255%2C255%2C0.25)%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />

      <div ref={confettiRef} className="confetti-container" />

      {isAnimating && (
        <div className="absolute top-20 left-1/2 z-50 -translate-x-1/2 animate-[fadeInScale_0.5s_ease-out]">
          <div
            className={`rounded-3xl bg-white/95 px-8 py-6 text-2xl font-bold backdrop-blur-md ${
              isEditable ? 'cursor-text' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('pastelWishText', e.currentTarget.textContent || '')}
          >
            {displayValue('pastelWishText')}
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl animate-[fadeInUp_0.8s_ease-out]">
          <div className="overflow-hidden rounded-[32px] border border-white/30 bg-white/20 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            <div className="flex flex-col items-center space-y-6 text-center">
              {pastelPhotoUrl ? (
                <div className="flex flex-col items-center gap-3">
                  {(isEditable || !showPhoto) &&
                    (isEditable ? (
                      <div
                        className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-wider text-purple-700"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleContentChange('pastelPhotoHint', e.currentTarget.textContent?.trim() || '')
                        }
                      >
                        {displayValue('pastelPhotoHint')}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPhoto(true);
                        }}
                        className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-wider text-purple-700 transition hover:scale-105 hover:bg-white"
                      >
                        {displayValue('pastelPhotoHint')}
                      </button>
                    ))}

                  {(isEditable || showPhoto) && (
                    <div
                      ref={photoRef}
                      className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
                    >
                      <img src={pastelPhotoUrl} alt="Doğum günü fotoğrafı" className="h-full w-full object-cover" />
                    </div>
                  )}

                  {isEditable && (
                    <div className="mt-2 flex w-full max-w-md flex-col gap-2">
                      <label className="text-xs font-medium text-white/90">Fotoğraf URL</label>
                      <input
                        type="url"
                        value={pastelPhotoUrl}
                        onChange={(e) => handleContentChange('pastelPhotoUrl', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="rounded-lg border border-white/30 bg-white/20 px-4 py-2 text-sm text-white placeholder-white/50 backdrop-blur-md focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </div>
                  )}
                </div>
              ) : (
                isEditable && (
                  <div className="flex w-full max-w-md flex-col gap-2">
                    <label className="text-xs font-medium text-white/90">Fotoğraf URL</label>
                    <input
                      type="url"
                      value={pastelPhotoUrl}
                      onChange={(e) => handleContentChange('pastelPhotoUrl', e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="rounded-lg border border-white/30 bg-white/20 px-4 py-2 text-sm text-white placeholder-white/50 backdrop-blur-md focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                )
              )}

              <h1
                className={`font-['Poppins',sans-serif] text-4xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)] sm:text-5xl md:text-6xl ${
                  isEditable ? 'cursor-text rounded-3xl px-6 py-4 hover:bg-white/10' : ''
                }`}
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('pastelTitle', e.currentTarget.textContent || '')}
              >
                {displayValue('pastelTitle')}
              </h1>

              <p
                className={`font-['Poppins',sans-serif] max-w-xl text-lg text-white/95 sm:text-xl ${
                  isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-white/10' : ''
                }`}
                style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('pastelSubtitle', e.currentTarget.textContent || '')}
              >
                {displayValue('pastelSubtitle')}
              </p>

              <Button
                onClick={handleCelebrate}
                disabled={isAnimating}
                className="mt-6 rounded-full bg-white px-10 py-6 font-['Poppins',sans-serif] text-lg font-semibold text-purple-600 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] disabled:opacity-50"
              >
                <span
                  className={`${isEditable ? 'cursor-text' : 'pointer-events-none'}`}
                  {...(isEditable
                    ? {
                        contentEditable: true,
                        suppressContentEditableWarning: true,
                        onBlur: (e: React.FocusEvent<HTMLSpanElement>) =>
                          handleContentChange('pastelButtonLabel', e.currentTarget.textContent || ''),
                      }
                    : {})}
                >
                  {displayValue('pastelButtonLabel')}
                </span>
              </Button>

              {creatorName && (
                <p className="mt-4 font-['Poppins',sans-serif] text-sm text-white/80">
                  <span className="opacity-70">💝</span> {creatorName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 40;
        }

        :global(.confetti-piece) {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0;
          animation: confettiFall 3s ease-out forwards;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

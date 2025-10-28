'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ElegantGoldInvitationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  klasikTitle: 'Doğum Günün Kutlu Olsun',
  klasikSubtitle: 'Bugün senin günün 💫',
  klasikButtonLabel: 'Sürprizi Gör ✨',
  klasikModalMessage: 'Nice mutlu senelere! Hayatın hep güzel sürprizlerle dolu olsun. 🎂✨',
  klasikPhotoHint: 'Hatırayı Gör',
};

type FieldKey =
  | 'klasikTitle'
  | 'klasikSubtitle'
  | 'klasikButtonLabel'
  | 'klasikModalMessage'
  | 'klasikPhotoUrl'
  | 'klasikPhotoHint';

export default function ElegantGoldInvitation({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ElegantGoldInvitationProps) {
  const [showModal, setShowModal] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      klasikTitle: textFields?.klasikTitle || DEFAULTS.klasikTitle,
      klasikSubtitle: textFields?.klasikSubtitle || DEFAULTS.klasikSubtitle,
      klasikButtonLabel: textFields?.klasikButtonLabel || DEFAULTS.klasikButtonLabel,
      klasikModalMessage: textFields?.klasikModalMessage || message || DEFAULTS.klasikModalMessage,
      klasikPhotoUrl: textFields?.klasikPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
      klasikPhotoHint: textFields?.klasikPhotoHint || DEFAULTS.klasikPhotoHint,
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

  useEffect(() => {
    if (showModal && !isEditable) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setShowModal(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showModal, isEditable]);

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

  const klasikPhotoUrl = displayValue('klasikPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFF8E7]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200L100%20100M100%200L0%20100%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%220.5%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />

      <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-30" />
      <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#D4AF37] to-transparent opacity-30" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-[10%] py-12">
        <div className="w-full max-w-3xl animate-[fadeIn_1s_ease-out]">
          <div className="relative overflow-hidden rounded-3xl border-4 border-[#D4AF37]/40 bg-gradient-to-br from-[#FFFBF0] to-[#F5E6D3] p-12 shadow-[0_20px_80px_rgba(212,175,55,0.3)]">
            <div className="golden-shine absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

            <div className="flex flex-col items-center space-y-8 text-center">
              {klasikPhotoUrl ? (
                <div className="flex flex-col items-center gap-4">
                  {(isEditable || !showPhoto) &&
                    (isEditable ? (
                      <div
                        className="rounded-full border border-[#D4AF37]/40 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#8B7355]"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleContentChange('klasikPhotoHint', e.currentTarget.textContent?.trim() || '')
                        }
                      >
                        {displayValue('klasikPhotoHint')}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPhoto(true);
                        }}
                        className="rounded-full border border-[#D4AF37]/40 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#8B7355] transition hover:bg-[#D4AF37]/20"
                      >
                        {displayValue('klasikPhotoHint')}
                      </button>
                    ))}

                  {(isEditable || showPhoto) && (
                    <div
                      ref={photoRef}
                      className="relative h-40 w-40 overflow-hidden rounded-lg border-4 border-[#D4AF37] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
                    >
                      <img src={klasikPhotoUrl} alt="Doğum günü fotoğrafı" className="h-full w-full object-cover" />
                    </div>
                  )}

                  {isEditable && (
                    <div className="mt-2 flex w-full max-w-md flex-col gap-2">
                      <label className="text-xs font-medium text-[#8B7355]">Fotoğraf URL</label>
                      <input
                        type="url"
                        value={klasikPhotoUrl}
                        onChange={(e) => handleContentChange('klasikPhotoUrl', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="rounded-lg border-2 border-[#D4AF37]/30 bg-white px-4 py-2 text-sm text-[#6B5344] placeholder-[#8B7355]/50 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
                      />
                    </div>
                  )}
                </div>
              ) : (
                isEditable && (
                  <div className="flex w-full max-w-md flex-col gap-2">
                    <label className="text-xs font-medium text-[#8B7355]">Fotoğraf URL</label>
                    <input
                      type="url"
                      value={klasikPhotoUrl}
                      onChange={(e) => handleContentChange('klasikPhotoUrl', e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="rounded-lg border-2 border-[#D4AF37]/30 bg-white px-4 py-2 text-sm text-[#6B5344] placeholder-[#8B7355]/50 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
                    />
                  </div>
                )
              )}

              <h1
                className={`font-['Playfair_Display',serif] text-5xl font-bold text-[#6B5344] drop-shadow-sm sm:text-6xl md:text-7xl ${
                  isEditable ? 'cursor-text rounded-2xl px-6 py-4 hover:bg-white/30' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('klasikTitle', e.currentTarget.textContent || '')}
              >
                {displayValue('klasikTitle')}
              </h1>

              <p
                className={`font-['Playfair_Display',serif] text-xl italic text-[#8B7355] sm:text-2xl ${
                  isEditable ? 'cursor-text rounded-xl px-5 py-3 hover:bg-white/30' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('klasikSubtitle', e.currentTarget.textContent || '')}
              >
                {displayValue('klasikSubtitle')}
              </p>

              <div className="my-6 h-[1px] w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <Button
                onClick={() => setShowModal(true)}
                className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C9A961] px-10 py-6 font-['Playfair_Display',serif] text-lg font-semibold text-white shadow-[0_10px_40px_rgba(212,175,55,0.4)] transition-all hover:scale-105 hover:shadow-[0_15px_50px_rgba(212,175,55,0.5)]"
              >
                <span
                  className={`${isEditable ? 'cursor-text' : 'pointer-events-none'}`}
                  {...(isEditable
                    ? {
                        contentEditable: true,
                        suppressContentEditableWarning: true,
                        onBlur: (e: React.FocusEvent<HTMLSpanElement>) =>
                          handleContentChange('klasikButtonLabel', e.currentTarget.textContent || ''),
                      }
                    : {})}
                >
                  {displayValue('klasikButtonLabel')}
                </span>
              </Button>

              {creatorName && (
                <p className="mt-4 font-['Playfair_Display',serif] text-sm italic text-[#8B7355]/80">
                  Sevgiyle, {creatorName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="animate-[modalIn_0.3s_ease-out] max-w-md overflow-hidden rounded-2xl border-4 border-[#D4AF37]/60 bg-gradient-to-br from-white to-[#FFF8E7] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className={`font-['Playfair_Display',serif] text-center text-lg leading-relaxed text-[#6B5344] sm:text-xl ${
                isEditable ? 'cursor-text rounded-xl px-4 py-3 hover:bg-[#D4AF37]/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('klasikModalMessage', e.currentTarget.textContent || '')}
            >
              {displayValue('klasikModalMessage')}
            </p>
            {!isEditable && (
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full rounded-full bg-[#D4AF37] px-6 py-3 font-['Playfair_Display',serif] font-semibold text-white transition hover:bg-[#C9A961]"
              >
                Kapat
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .golden-shine {
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(300%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

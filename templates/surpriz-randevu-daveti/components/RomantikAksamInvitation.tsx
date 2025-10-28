'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface RomantikAksamInvitationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  classicTitle: 'Seni Özel Bir Akşama Davet Ediyorum 🌙',
  classicSubtitle: "18 Şubat Cumartesi | 20.00 | Galata'da buluşma noktası",
  classicButtonLabel: 'Davetiyeyi Aç ✨',
  classicEnvelopeHeading: 'Altın Zarfı Aç',
  classicEnvelopeMessage:
    'Seni zarif bir akşam yemeğine davet ediyorum. Şehrin ışıkları altında yalnızca ikimizin paylaşacağı bir masa ayırttım. Gecenin her detayı seninle daha da güzel olacak.',
  classicEnvelopeFooter: 'El ele yıldızları izlemeye ne dersin?',
  classicPhotoHint: 'Fotoğrafı Gör',
  classicSignatureLabel: 'Kalpten davetle,'
};

type FieldKey =
  | 'classicTitle'
  | 'classicSubtitle'
  | 'classicButtonLabel'
  | 'classicEnvelopeHeading'
  | 'classicEnvelopeMessage'
  | 'classicEnvelopeFooter'
  | 'classicPhotoUrl'
  | 'classicPhotoHint'
  | 'classicSignatureLabel';

export default function RomantikAksamInvitation({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: RomantikAksamInvitationProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(() => ({
    classicTitle: textFields?.classicTitle || DEFAULTS.classicTitle,
    classicSubtitle:
      textFields?.classicSubtitle ||
      (recipientName ? `${recipientName}, ${DEFAULTS.classicSubtitle}` : DEFAULTS.classicSubtitle),
    classicButtonLabel: textFields?.classicButtonLabel || DEFAULTS.classicButtonLabel,
    classicEnvelopeHeading: textFields?.classicEnvelopeHeading || DEFAULTS.classicEnvelopeHeading,
    classicEnvelopeMessage: textFields?.classicEnvelopeMessage || message || DEFAULTS.classicEnvelopeMessage,
    classicEnvelopeFooter: textFields?.classicEnvelopeFooter || DEFAULTS.classicEnvelopeFooter,
    classicPhotoUrl: textFields?.classicPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
    classicPhotoHint: textFields?.classicPhotoHint || DEFAULTS.classicPhotoHint,
    classicSignatureLabel: textFields?.classicSignatureLabel || DEFAULTS.classicSignatureLabel,
  }), [textFields, recipientName, message]);

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

  const classicPhotoUrl = displayValue('classicPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03040c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,221,150,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#020e2a]/80 via-[#0f1d3a]/82 to-[#03040c]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%222%22%20fill%3D%22rgba(255%2C215%2C0%2C0.12)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl overflow-hidden rounded-[38px] border border-[#cda776]/30 bg-[#0d1024]/70 p-10 shadow-[0_40px_120px_rgba(20,20,40,0.7)] backdrop-blur-xl animate-[fadeInUp_0.7s_ease-out]">
          <div className="flex flex-col items-center space-y-8 text-center">
            {classicPhotoUrl ? (
              <div className="flex flex-col items-center gap-3">
                {(isEditable || !showPhoto) && (
                  isEditable ? (
                    <div
                      className="rounded-full border border-[#d4af37]/40 bg-[#1a1f33]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#f9e6ba]/80"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('classicPhotoHint', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {displayValue('classicPhotoHint')}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowPhoto(true);
                      }}
                      className="rounded-full border border-[#d4af37]/40 bg-[#1a1f33]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#f9e6ba]/80 transition hover:bg-[#d4af37]/20"
                    >
                      {displayValue('classicPhotoHint')}
                    </button>
                  )
                )}

                {(isEditable || showPhoto) && (
                  <div
                    ref={photoRef}
                    className="relative h-32 w-32 overflow-hidden rounded-xl border-4 border-[#d4af37]/60 bg-[#0b0f1f] shadow-[0_20px_50px_rgba(12,10,30,0.8)]"
                  >
                    <img src={classicPhotoUrl} alt="Özel davet görseli" className="h-full w-full object-cover" />
                  </div>
                )}

                {isEditable && (
                  <div
                    className="text-[0.7rem] text-[#f9e6ba]/70"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('classicPhotoUrl', event.currentTarget.textContent?.trim() || '')
                    }
                  >
                    {classicPhotoUrl || 'Fotoğraf için URL girin'}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-[#d4af37]/40 bg-[#1a1f33]/60 text-xs text-[#f9e6ba]/70 ${
                  isEditable ? 'cursor-text px-5 text-center' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) =>
                  handleContentChange('classicPhotoUrl', event.currentTarget.textContent?.trim() || '')
                }
              >
                {isEditable ? 'Fotoğraf için URL girin' : ''}
              </div>
            )}

            <div
              className={`text-3xl font-serif tracking-wide text-[#f8ead0] drop-shadow-[0_12px_40px_rgba(200,160,80,0.45)] sm:text-4xl md:text-[3.1rem] ${
                isEditable ? 'cursor-text rounded-2xl px-6 py-3 hover:bg-white/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('classicTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('classicTitle')}
            </div>

            <p
              className={`max-w-2xl font-serif text-base text-[#f1ddb3] sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-white/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('classicSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('classicSubtitle')}
            </p>

            <div className="relative mt-4 flex w-full justify-center">
              <div className={`classic-envelope ${isEnvelopeOpen ? 'open' : ''}`}>
                <div className="envelope-shadow" />
                <div className="envelope-back" />
                <div className="envelope-letter">
                  <div
                    className={`text-xs font-medium uppercase tracking-[0.38em] text-[#454356] ${
                      isEditable ? 'cursor-text rounded px-3 py-2 hover:bg-[#f9f4ed]' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('classicEnvelopeHeading', event.currentTarget.textContent || '')
                    }
                  >
                    {displayValue('classicEnvelopeHeading')}
                  </div>

                  <p
                    className={`font-serif text-base leading-relaxed text-[#2b2846] sm:text-lg ${
                      isEditable ? 'cursor-text rounded-xl px-4 py-3 hover:bg-[#f9f4ed]' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('classicEnvelopeMessage', event.currentTarget.textContent || '')
                    }
                  >
                    {displayValue('classicEnvelopeMessage')}
                  </p>

                  <p
                    className={`font-serif text-sm text-[#4f4a6a] sm:text-base ${
                      isEditable ? 'cursor-text rounded px-3 py-2 hover:bg-[#f9f4ed]' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('classicEnvelopeFooter', event.currentTarget.textContent || '')
                    }
                  >
                    {displayValue('classicEnvelopeFooter')}
                  </p>

                  {creatorName && (
                    <p className="font-serif text-xs uppercase tracking-[0.45em] text-[#6d5d3f]">
                      <span
                        className={isEditable ? 'cursor-text rounded px-2 py-1 hover:bg-[#f9f4ed]' : ''}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) =>
                          handleContentChange('classicSignatureLabel', event.currentTarget.textContent || '')
                        }
                      >
                        {displayValue('classicSignatureLabel')}
                      </span>{' '}
                      {creatorName}
                    </p>
                  )}
                </div>
                <div className="envelope-front" />
                <div className="envelope-lid" />
              </div>
            </div>

            <Button
              onClick={() => setIsEnvelopeOpen((prev) => !prev)}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#d4af37] via-[#b8860b] to-[#c08401] px-12 py-4 text-base font-semibold text-[#291304] shadow-[0_20px_60px_rgba(212,175,55,0.45)] transition-transform duration-300 hover:scale-[1.02]"
            >
              <span
                className={`${
                  isEditable ? 'cursor-text text-[#291304]' : 'pointer-events-none'
                } relative z-10 select-text`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleContentChange('classicButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('classicButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[goldenSheen_2.6s_linear_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .classic-envelope {
          position: relative;
          width: min(340px, 82vw);
          height: 220px;
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .classic-envelope .envelope-shadow {
          position: absolute;
          inset: auto -16% -28%;
          height: 80px;
          background: radial-gradient(60% 65% at 50% 50%, rgba(6, 3, 0, 0.36) 0%, rgba(6, 3, 0, 0) 68%);
          filter: blur(22px);
          opacity: 0.6;
          z-index: 0;
          pointer-events: none;
        }

        .classic-envelope .envelope-back {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 72%;
          background: linear-gradient(180deg, #f6ead6 0%, #e5caa4 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
          overflow: hidden;
          z-index: 1;
        }

        .classic-envelope .envelope-back::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(210, 174, 126, 0.08) 60%);
          opacity: 0.95;
        }

        .classic-envelope .envelope-letter {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: calc(100% - 36px);
          transform: translate(-50%, 72%);
          background: radial-gradient(circle at top, #ffffff 0%, #f8f0e4 62%, #e7d2b3 100%);
          border-radius: 18px;
          padding: 32px 28px 36px;
          box-shadow: 0 28px 60px rgba(18, 10, 5, 0.33);
          opacity: 0;
          transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.28, 1), opacity 0.55s ease;
          z-index: 6;
          max-height: 450px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .classic-envelope .envelope-letter::after {
          content: '';
          position: absolute;
          inset: 10px;
          border-radius: 14px;
          border: 1px solid rgba(209, 176, 130, 0.35);
          opacity: 0.7;
          pointer-events: none;
        }

        .classic-envelope .envelope-front {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 70%;
          border-radius: 20px 20px 18px 18px;
          background: linear-gradient(180deg, #fdf2e1 0%, #e5c7a6 100%);
          box-shadow: 0 22px 55px rgba(20, 11, 4, 0.3);
          transition: transform 0.65s ease, box-shadow 0.65s ease, opacity 0.45s ease;
          z-index: 3;
        }

        .classic-envelope .envelope-front::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          height: 48%;
          border-radius: 18px 18px 12px 12px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0) 100%);
          box-shadow: inset 0 8px 16px rgba(255, 255, 255, 0.3);
          opacity: 0.7;
        }

        .classic-envelope .envelope-front::after {
          content: '';
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 78%;
          height: 26px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(209, 173, 123, 0.48) 0%, rgba(209, 173, 123, 0) 100%);
          opacity: 0.38;
        }

        .classic-envelope .envelope-lid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 118px;
          background: linear-gradient(180deg, #f9f4ed 0%, #e8d9bd 100%);
          border-radius: 22px 22px 10px 10px;
          transform-origin: top;
          transform: rotateX(0deg);
          transition: transform 0.6s ease, box-shadow 0.6s ease;
          box-shadow: 0 20px 42px rgba(0, 0, 0, 0.24);
          z-index: 2;
        }

        .classic-envelope.open .envelope-lid {
          transform: rotateX(176deg);
          box-shadow: 0 26px 60px rgba(20, 12, 4, 0.32);
        }

        .classic-envelope.open .envelope-letter {
          transform: translate(-50%, -25%) translateZ(100px);
          opacity: 1;
        }

        .classic-envelope.open .envelope-front {
          transform: translateY(125%);
          opacity: 0;
          pointer-events: none;
        }

        @keyframes goldenSheen {
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

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

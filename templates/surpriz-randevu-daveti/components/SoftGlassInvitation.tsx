'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SoftGlassInvitationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  modernTitle: 'Birlikte Olmak İster misin?',
  modernSubtitle: 'Lavanta tonlarında bir akşam planladım. 14 Şubat 19.30, favori kafemizde buluşalım mı?',
  modernButtonLabel: 'Detayları Gör 💫',
  modernPanelTitle: 'Cam Panelin Ardındaki Sürpriz',
  modernPanelMessage:
    'Önce seni mor ışıklarla karşılayacak ufak bir galeriye götürüyorum. Sonra gizli terasta senin için hazırladığım menü var.',
  modernPanelSecondary: 'Dress code: Lavanta & beyaz. Rahat ayakkabı getir.',
  modernPhotoHint: 'Fotoğrafı Görüntüle',
  modernSignatureLabel: 'Sevgilerle,'
};

const LIGHT_ORBS = Array.from({ length: 9 }).map((_, index) => ({
  id: index,
  size: 240 + Math.random() * 160,
  left: Math.random() * 100,
  top: Math.random() * 100,
  opacity: 0.08 + Math.random() * 0.18,
  duration: 12 + Math.random() * 6,
}));

type FieldKey =
  | 'modernTitle'
  | 'modernSubtitle'
  | 'modernButtonLabel'
  | 'modernPanelTitle'
  | 'modernPanelMessage'
  | 'modernPanelSecondary'
  | 'modernPhotoUrl'
  | 'modernPhotoHint'
  | 'modernSignatureLabel';

export default function SoftGlassInvitation({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: SoftGlassInvitationProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoPreviewRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(() => ({
    modernTitle: textFields?.modernTitle || DEFAULTS.modernTitle,
    modernSubtitle:
      textFields?.modernSubtitle ||
      (recipientName
        ? `${recipientName}, ${DEFAULTS.modernSubtitle}`
        : DEFAULTS.modernSubtitle),
    modernButtonLabel: textFields?.modernButtonLabel || DEFAULTS.modernButtonLabel,
    modernPanelTitle: textFields?.modernPanelTitle || DEFAULTS.modernPanelTitle,
    modernPanelMessage: textFields?.modernPanelMessage || message || DEFAULTS.modernPanelMessage,
    modernPanelSecondary: textFields?.modernPanelSecondary || DEFAULTS.modernPanelSecondary,
    modernPhotoUrl: textFields?.modernPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
    modernPhotoHint: textFields?.modernPhotoHint || DEFAULTS.modernPhotoHint,
    modernSignatureLabel: textFields?.modernSignatureLabel || DEFAULTS.modernSignatureLabel,
  }), [textFields, recipientName, message]);

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (showPhoto && !isEditable) {
      const handleClickOutside = (event: MouseEvent) => {
        if (photoPreviewRef.current && !photoPreviewRef.current.contains(event.target as Node)) {
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

  const modernPhotoUrl = displayValue('modernPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0413] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(164,120,255,0.35),_transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d1d60]/60 via-[#101020]/85 to-[#03010c]" />

      {LIGHT_ORBS.map((orb) => (
        <div
          key={orb.id}
          className="pointer-events-none absolute rounded-full bg-[conic-gradient(from_45deg,_rgba(255,255,255,0.08),_rgba(186,127,255,0.18),_rgba(255,255,255,0.05))] shadow-[0_0_140px_rgba(155,120,255,0.45)]"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            opacity: orb.opacity,
            animation: `floatOrb ${orb.duration}s ease-in-out infinite`,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div
          className={`relative w-full max-w-3xl overflow-hidden rounded-[40px] border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_rgba(92,47,152,0.34)] backdrop-blur-2xl transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(200,170,255,0.28),_transparent_55%)]" />

          <div className="relative flex flex-col items-center space-y-8 text-center">
            {modernPhotoUrl ? (
              <div className="relative flex flex-col items-center gap-3">
                {(isEditable || !showPhoto) && (
                  isEditable ? (
                    <div
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('modernPhotoHint', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {displayValue('modernPhotoHint')}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowPhoto(true);
                      }}
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70 transition hover:bg-white/20"
                    >
                      {displayValue('modernPhotoHint')}
                    </button>
                  )
                )}

                {(isEditable || showPhoto) && (
                  <div
                    ref={photoPreviewRef}
                    className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-white/10 shadow-[0_25px_60px_rgba(121,76,191,0.45)] backdrop-blur"
                  >
                    {modernPhotoUrl ? (
                      <img
                        src={modernPhotoUrl}
                        alt={displayValue('modernTitle') || 'Özel fotoğraf'}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                )}

                {isEditable && (
                  <div
                    className="text-[0.7rem] text-white/60"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')
                    }
                  >
                    {modernPhotoUrl || 'Fotoğraf için URL girin'}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-xs text-white/60 ${
                  isEditable ? 'cursor-text px-5 text-center' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) =>
                  handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')
                }
              >
                {isEditable ? 'Fotoğraf için URL girin' : ''}
              </div>
            )}

            <div
              className={`text-4xl font-semibold tracking-tight text-white drop-shadow-[0_0_25px_rgba(190,135,255,0.45)] sm:text-5xl md:text-[3.6rem] ${
                isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('modernTitle')}
            </div>

            <p
              className={`max-w-2xl text-base text-white/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('modernSubtitle')}
            </p>

            <Button
              onClick={() => setShowPanel((prev) => !prev)}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#b892ff] via-[#7c4dff] to-[#5a24ea] px-12 py-4 text-base font-semibold text-white shadow-[0_20px_60px_rgba(122,63,212,0.45)] transition-transform duration-300 hover:scale-[1.02]"
            >
              <span
                className={`${
                  isEditable ? 'cursor-text' : 'pointer-events-none'
                } relative z-10 select-text`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleContentChange('modernButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('modernButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[sheen_2.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </Button>

            <div
              className={`relative w-full overflow-hidden rounded-[28px] border border-white/12 bg-white/8 p-0 shadow-inner backdrop-blur transition-all duration-500 ${
                showPanel ? 'max-h-[460px] scale-100 opacity-100 py-8' : 'max-h-0 scale-95 opacity-0'
              }`}
            >
              <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-6 text-center text-white/85">
                <h3
                  className={`text-lg font-semibold uppercase tracking-[0.3em] text-white/70 ${
                    isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('modernPanelTitle', event.currentTarget.textContent || '')}
                >
                  {displayValue('modernPanelTitle')}
                </h3>

                <p
                  className={`text-base leading-relaxed sm:text-lg ${
                    isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('modernPanelMessage', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('modernPanelMessage')}
                </p>

                <p
                  className={`text-sm text-white/70 sm:text-base ${
                    isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('modernPanelSecondary', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('modernPanelSecondary')}
                </p>

                {creatorName && (
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                    <span
                      className={isEditable ? 'cursor-text rounded px-2 py-1 hover:bg-white/10' : ''}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('modernSignatureLabel', event.currentTarget.textContent || '')
                      }
                    >
                      {displayValue('modernSignatureLabel')}
                    </span>{' '}
                    {creatorName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sheen {
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

        @keyframes floatOrb {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(16px, -20px, 0) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

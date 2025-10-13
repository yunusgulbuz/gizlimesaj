'use client';

import { useEffect, useMemo, useState } from 'react';

interface CinematicValentineProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  classicFootnote: 'Cinematic Valentine Premiere',
  classicTitle: 'Aşkın Her Haliyle Güzel',
  classicSubtitle: 'Sevgililer Günün Kutlu Olsun 💫',
  classicNarration:
    'Sen benim hayatımın en güzel sahnesisin. Her karede gülüşün, her diyalogda kalbimizin sesi var. Bu gece yine başrolümüz aşk.',
  classicExtraText: 'Seni her zaman seveceğim.',
  classicSpotlightLabel: 'Spotlight',
  classicSpotlightNote: 'Kalbimizin perdeleri hep açık kalsın.',
  classicCreatorLabel: 'Sonsuz aşk ile,',
  classicBackgroundHelper: 'Arka plan için URL ekleyin',
};

type FieldKey =
  | 'classicFootnote'
  | 'classicTitle'
  | 'classicSubtitle'
  | 'classicNarration'
  | 'classicExtraText'
  | 'classicSpotlightLabel'
  | 'classicSpotlightNote'
  | 'classicCreatorLabel'
  | 'classicBackgroundUrl'
  | 'classicBackgroundHelper';

export default function CinematicValentine({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: CinematicValentineProps) {
  const [isMounted, setIsMounted] = useState(false);

  const initialValues = useMemo(
    () => ({
      classicFootnote: textFields?.classicFootnote || DEFAULTS.classicFootnote,
      classicTitle: textFields?.classicTitle || DEFAULTS.classicTitle,
      classicSubtitle:
        textFields?.classicSubtitle ||
        (recipientName ? `${recipientName} için Sevgililer Günü` : DEFAULTS.classicSubtitle),
      classicNarration: textFields?.classicNarration || message || DEFAULTS.classicNarration,
      classicExtraText: textFields?.classicExtraText || DEFAULTS.classicExtraText,
      classicSpotlightLabel: textFields?.classicSpotlightLabel || DEFAULTS.classicSpotlightLabel,
      classicSpotlightNote: textFields?.classicSpotlightNote || DEFAULTS.classicSpotlightNote,
      classicCreatorLabel: textFields?.classicCreatorLabel || DEFAULTS.classicCreatorLabel,
      classicBackgroundUrl: textFields?.classicBackgroundUrl || '',
      classicBackgroundHelper: textFields?.classicBackgroundHelper || DEFAULTS.classicBackgroundHelper,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 90);
    return () => window.clearTimeout(timer);
  }, []);

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

  const backgroundUrl = displayValue('classicBackgroundUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0205] text-white">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={
            backgroundUrl
              ? {
                  backgroundImage: `url(${backgroundUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: 'valentine-pan 18s ease-in-out infinite alternate',
                }
              : {
                  background: 'radial-gradient(circle at center, rgba(160,0,40,0.45), transparent 65%)',
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d000d]/80 via-[#120009]/85 to-[#06010c]/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,220,180,0.22),_transparent_65%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,_rgba(255,80,80,0.22),_rgba(255,196,120,0.18))] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-10">
        <div
          className={`relative w-full max-w-5xl overflow-hidden rounded-[46px] border border-[#f5d4a5]/25 bg-black/50 shadow-[0_50px_140px_rgba(255,120,60,0.28)] backdrop-blur-3xl transition-all duration-800 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-[#4a091c]/40 to-transparent" />
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 120px rgba(6,0,12,0.55)' }} />

          <div className="relative grid gap-10 px-6 pb-12 pt-14 text-left sm:px-12 sm:pb-16 sm:pt-18 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.5em] text-[#f2c58f]/80 ${
                  isEditable ? 'cursor-text rounded-full px-4 py-2 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('classicFootnote', event.currentTarget.textContent || '')}
              >
                {displayValue('classicFootnote')}
              </span>

              <h1
                className={`text-4xl font-semibold leading-tight text-[#f9e7d3] drop-shadow-[0_14px_40px_rgba(255,210,150,0.4)] sm:text-5xl lg:text-6xl ${
                  isEditable ? 'cursor-text rounded-3xl px-4 py-4 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('classicTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('classicTitle')}
              </h1>

              <p
                className={`max-w-xl text-lg text-[#f8d6be]/90 sm:text-xl ${
                  isEditable ? 'cursor-text rounded-3xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('classicSubtitle', event.currentTarget.textContent || '')}
              >
                {displayValue('classicSubtitle')}
              </p>

              <p
                className={`max-w-2xl text-base leading-relaxed text-[#f5c7ae]/85 sm:text-lg ${
                  isEditable ? 'cursor-text rounded-3xl px-4 py-4 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('classicNarration', event.currentTarget.textContent || '')}
              >
                {displayValue('classicNarration')}
              </p>

              <p
                className={`text-lg font-medium text-[#f9d7b2] sm:text-xl ${
                  isEditable ? 'cursor-text rounded-3xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('classicExtraText', event.currentTarget.textContent || '')}
              >
                {displayValue('classicExtraText')}
              </p>

              {creatorName && (
                <div className="pt-4 text-base text-[#f6cba1]">
                  <span
                    className={`${
                      isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('classicCreatorLabel', event.currentTarget.textContent || '')
                    }
                  >
                    {displayValue('classicCreatorLabel')}
                  </span>{' '}
                  <strong className="font-semibold text-[#ffe3c1]">{creatorName}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-1 flex-col justify-center gap-4 rounded-3xl border border-[#f5d4a5]/30 bg-black/40 p-6 shadow-[0_18px_60px_rgba(255,180,120,0.18)]">
                <p
                  className={`text-sm uppercase tracking-[0.38em] text-[#f6cba1]/70 ${
                    isEditable ? 'cursor-text rounded-xl px-3 py-2 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('classicSpotlightLabel', event.currentTarget.textContent || '')}
                >
                  {displayValue('classicSpotlightLabel')}
                </p>
                <p
                  className={`text-base text-[#f9dcb9]/90 sm:text-lg ${
                    isEditable ? 'cursor-text rounded-2xl px-3 py-3 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('classicSpotlightNote', event.currentTarget.textContent || '')}
                >
                  {displayValue('classicSpotlightNote')}
                </p>
              </div>

              {isEditable && (
                <div className="rounded-3xl border border-[#f5d4a5]/30 bg-black/35 p-5 text-sm text-[#f6d2ae]/80">
                  <p>{displayValue('classicBackgroundHelper')}</p>
                  <span
                    className="mt-3 block max-h-20 overflow-y-auto break-all rounded-xl bg-white/10 px-3 py-2 text-xs text-[#fbe4c8]"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      handleContentChange('classicBackgroundUrl', event.currentTarget.textContent?.trim() || '')
                    }
                    onInput={(event) =>
                      handleContentChange('classicBackgroundUrl', event.currentTarget.textContent?.trim() || '')
                    }
                  >
                    {backgroundUrl}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes valentine-pan {
          0% {
            transform: scale(1.08) translate3d(-2%, -2%, 0);
          }
          50% {
            transform: scale(1.12) translate3d(2%, -1%, 0);
          }
          100% {
            transform: scale(1.08) translate3d(-2%, 1%, 0);
          }
        }
      `}</style>
    </div>
  );
}

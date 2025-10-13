'use client';

import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SplitLoveLayoutProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  minimalTitle: 'Sevgililer Günün Kutlu Olsun',
  minimalBody:
    'Seninle yaşam her zamankinden daha anlamlı. Her sabah uyandığımda teşekkür ettiğim ilk şey, hayatımda olman. Tüm yollarımız hep aynı manzaraya çıksın: bize.',
  minimalSubtitle: 'Birlikte nice güzel yıllara ❤️',
  minimalFooter: 'Kalbimdeki en özel yer hep sana ait.',
  minimalToggleLabel: 'Fotoğraf önizleme',
  minimalToggleOnLabel: 'Açık',
  minimalToggleOffLabel: 'Kapalı',
  minimalPhotoHelper: 'Fotoğraf URL\'si ekleyerek burada gösterebilirsin',
  minimalCreatorLabel: 'Sevgiyle,',
};

type FieldKey =
  | 'minimalTitle'
  | 'minimalBody'
  | 'minimalSubtitle'
  | 'minimalFooter'
  | 'minimalToggleLabel'
  | 'minimalToggleOnLabel'
  | 'minimalToggleOffLabel'
  | 'minimalPhotoUrl'
  | 'minimalPhotoHelper'
  | 'minimalCreatorLabel';

export default function SplitLoveLayout({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: SplitLoveLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  const initialValues = useMemo(
    () => ({
      minimalTitle:
        textFields?.minimalTitle ||
        (recipientName ? `${recipientName} için Sevgililer Günü Mesajı` : DEFAULTS.minimalTitle),
      minimalBody: textFields?.minimalBody || message || DEFAULTS.minimalBody,
      minimalSubtitle: textFields?.minimalSubtitle || DEFAULTS.minimalSubtitle,
      minimalFooter: textFields?.minimalFooter || DEFAULTS.minimalFooter,
      minimalToggleLabel: textFields?.minimalToggleLabel || DEFAULTS.minimalToggleLabel,
      minimalToggleOnLabel: textFields?.minimalToggleOnLabel || DEFAULTS.minimalToggleOnLabel,
      minimalToggleOffLabel: textFields?.minimalToggleOffLabel || DEFAULTS.minimalToggleOffLabel,
      minimalPhotoUrl: textFields?.minimalPhotoUrl || '',
      minimalPhotoHelper: textFields?.minimalPhotoHelper || DEFAULTS.minimalPhotoHelper,
      minimalCreatorLabel: textFields?.minimalCreatorLabel || DEFAULTS.minimalCreatorLabel,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);
  const [showPhoto, setShowPhoto] = useState(() => Boolean(initialValues.minimalPhotoUrl.trim()));

  useEffect(() => {
    setLocalFields(initialValues);
    setShowPhoto(Boolean(initialValues.minimalPhotoUrl.trim()));
  }, [initialValues]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 60);
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

  const currentToggleLabelKey = showPhoto ? 'minimalToggleOnLabel' : 'minimalToggleOffLabel';

  const photoUrl = displayValue('minimalPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#ffe5eb] to-[#ffd8dd]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(255,99,132,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(255,200,200,0.24),_transparent_45%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-8">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-[42px] border border-red-200/50 bg-white/70 shadow-[0_40px_120px_rgba(220,20,60,0.18)] backdrop-blur-2xl">
          <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-br from-white via-white/70 to-transparent md:block" />
          <div className="grid min-h-[420px] grid-cols-1 divide-y divide-red-100/60 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div
              className={`relative flex flex-col justify-between gap-8 px-6 py-10 text-left sm:px-10 ${
                isMounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              } transition-all duration-700 ease-out`}
            >
              <div className="flex flex-col gap-6">
                <h1
                  className={`text-3xl font-semibold leading-tight text-[#940818] sm:text-4xl ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-red-50/80' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('minimalTitle', event.currentTarget.textContent || '')}
                >
                  {displayValue('minimalTitle')}
                </h1>

                <p
                  className={`text-base text-[#a21c3d]/90 sm:text-lg ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-red-50/80' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('minimalBody', event.currentTarget.textContent || '')}
                >
                  {displayValue('minimalBody')}
                </p>

                <p
                  className={`text-lg font-medium text-[#d61f4b] sm:text-xl ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-red-50/80' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('minimalSubtitle', event.currentTarget.textContent || '')}
                >
                  {displayValue('minimalSubtitle')}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <p
                  className={`text-sm text-[#b91c1c]/80 sm:text-base ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-red-50/80' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('minimalFooter', event.currentTarget.textContent || '')}
                >
                  {displayValue('minimalFooter')}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`${
                      isEditable ? 'cursor-text rounded-full px-3 py-1 hover:bg-red-50/80' : ''
                    } text-sm font-medium uppercase tracking-[0.32em] text-[#d8526d]/80`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) => handleContentChange('minimalToggleLabel', event.currentTarget.textContent || '')}
                  >
                    {displayValue('minimalToggleLabel')}
                  </span>

                  <Button
                    type="button"
                    onClick={() => setShowPhoto((prev) => !prev)}
                    className={`relative flex items-center gap-3 rounded-full border border-red-200/70 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#be123c] shadow-sm transition-all duration-300 ${
                      showPhoto ? 'shadow-[0_18px_40px_rgba(190,18,60,0.15)]' : 'opacity-80'
                    }`}
                  >
                    <span
                      className={`${isEditable ? 'cursor-text' : 'pointer-events-none'} relative z-10`}
                      {...(isEditable
                        ? {
                            contentEditable: true,
                            suppressContentEditableWarning: true,
                            onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                              handleContentChange(currentToggleLabelKey, event.currentTarget.textContent || ''),
                          }
                        : {})}
                    >
                      {displayValue(currentToggleLabelKey)}
                    </span>
                    <span
                      className={`absolute inset-y-[6px] left-2 inline-flex w-8 items-center rounded-full bg-red-100 transition-transform duration-300 ${
                        showPhoto ? 'translate-x-12 bg-red-400/50' : ''
                      }`}
                    />
                  </Button>
                </div>

                {creatorName && (
                  <div className="pt-1 text-sm text-[#d8526d]">
                    <span
                      className={`${
                        isEditable ? 'cursor-text rounded-full px-2 py-1 hover:bg-red-50/80' : ''
                      }`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('minimalCreatorLabel', event.currentTarget.textContent || '')
                      }
                    >
                      {displayValue('minimalCreatorLabel')}
                    </span>{' '}
                    <strong className="font-semibold text-[#a10f2a]">{creatorName}</strong>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffe2e7] to-[#ffccd4] p-8 ${
                isMounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              } transition-all duration-700 ease-out`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_transparent_70%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(210deg,_rgba(255,175,189,0.35),_rgba(255,195,160,0.18))] mix-blend-multiply" />

              {showPhoto && photoUrl ? (
                <div className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-[0_32px_60px_rgba(190,18,60,0.18)]">
                  <img
                    src={photoUrl}
                    alt={displayValue('minimalTitle') || 'Sevgililer Günü fotoğrafı'}
                    className="h-full w-full object-cover"
                  />
                  {isEditable && (
                    <div
                      className="absolute inset-x-0 bottom-3 mx-auto w-[90%] max-h-20 overflow-y-auto break-all rounded-full border border-white/50 bg-white/70 px-3 py-1 text-[0.7rem] text-[#9a1230]"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('minimalPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                      onInput={(event) =>
                        handleContentChange('minimalPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {photoUrl}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/60 bg-white/60 p-6 text-center text-sm text-[#be123c] shadow-inner">
                  <p>{displayValue('minimalPhotoHelper')}</p>
                  {isEditable && (
                    <span
                      className="relative w-full max-h-20 overflow-y-auto break-all rounded-xl bg-white/90 px-3 py-2 text-[0.7rem] text-[#a21c3d] shadow cursor-text"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('minimalPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                      onInput={(event) =>
                        handleContentChange('minimalPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {photoUrl}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        button span + span {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

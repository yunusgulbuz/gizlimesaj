'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface ElegantGradientOverlayCongratsProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type FieldKey =
  | 'premiumTitle'
  | 'premiumMessage'
  | 'premiumFooter'
  | 'premiumHighlight'
  | 'heroPhotoUrl'
  | 'recipientName'
  | 'companyName'
  | 'eventDate'
  | 'positionTitle';

const DEFAULTS: Record<FieldKey, string> = {
  premiumTitle: 'Yeni Görevinizde Başarılar Dileriz',
  premiumMessage:
    'Emeğinizin karşılığını fazlasıyla hak ettiniz. Yeni sorumluluğunuzda parlak başarılara imza atacağınıza eminiz.',
  premiumFooter: 'Aurora Holdings İnsan Kaynakları',
  premiumHighlight: 'Vizyonunuz yeni ekibinize güç katacak.',
  heroPhotoUrl:
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
  recipientName: 'Elif Demir',
  companyName: 'Aurora Holdings',
  eventDate: '12 Mart 2025',
  positionTitle: 'Global Operasyonlar Direktörü',
};

export default function ElegantGradientOverlayCongrats({
  recipientName,
  message,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ElegantGradientOverlayCongratsProps) {
  const [isMounted, setIsMounted] = useState(false);

  const initialValues = useMemo<Record<FieldKey, string>>(
    () => ({
      premiumTitle: textFields?.premiumTitle || DEFAULTS.premiumTitle,
      premiumMessage: textFields?.premiumMessage || message || DEFAULTS.premiumMessage,
      premiumFooter: textFields?.premiumFooter || DEFAULTS.premiumFooter,
      premiumHighlight: textFields?.premiumHighlight || DEFAULTS.premiumHighlight,
      heroPhotoUrl: textFields?.heroPhotoUrl || DEFAULTS.heroPhotoUrl,
      recipientName: textFields?.recipientName || recipientName || DEFAULTS.recipientName,
      companyName: textFields?.companyName || DEFAULTS.companyName,
      eventDate: textFields?.eventDate || DEFAULTS.eventDate,
      positionTitle: textFields?.positionTitle || DEFAULTS.positionTitle,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState<Record<FieldKey, string>>(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 50);
    return () => window.clearTimeout(timeout);
  }, []);

  const displayValue = (key: FieldKey) => (isEditable ? localFields[key] : initialValues[key]);

  const handleContentChange = (key: FieldKey, value: string) => {
    const cleanedValue = value.trim();
    setLocalFields(prev => ({ ...prev, [key]: cleanedValue }));
    onTextFieldChange?.(key, cleanedValue);
  };

  const heroPhotoUrl = displayValue('heroPhotoUrl');
  const backgroundImage = heroPhotoUrl
    ? `url(${heroPhotoUrl})`
    : 'linear-gradient(160deg, rgba(15,23,42,0.9), rgba(17,24,39,0.95))';

  const editableTextClass = isEditable
    ? 'cursor-text rounded-xl px-3 py-2 transition-colors hover:bg-white/5 focus:outline-none focus:ring-0'
    : '';

  return (
    <section className="relative flex min-h-screen flex-col bg-slate-950 text-white">
      <div className="relative h-[65vh] min-h-[360px] w-full overflow-hidden lg:h-screen">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 transition-[transform] duration-[7000ms] ease-out"
            style={{
              backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: isMounted ? 'scale(1.03)' : 'scale(1.12)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/70 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.18),_rgba(15,23,42,0))] mix-blend-lighten" />
        </div>

        {isEditable && (
          <div className="absolute bottom-6 right-6 z-20 max-w-[75%] rounded-full border border-white/30 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
            <span className="mr-2 font-semibold text-amber-200/80">Fotoğraf URL</span>
            <span
              className={`inline-block max-w-[18rem] overflow-hidden text-ellipsis whitespace-nowrap align-middle ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('heroPhotoUrl', event.currentTarget.textContent || '')}
            >
              {heroPhotoUrl}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 -mt-16 flex flex-1 flex-col px-6 pb-12 sm:px-10 lg:-mt-40 lg:px-24 lg:pb-24">
        <div
          className={`relative w-full max-w-4xl rounded-[36px] border border-amber-200/30 bg-white/5 p-6 sm:p-10 shadow-[0_30px_120px_rgba(30,41,59,0.5)] backdrop-blur-2xl transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <div className="absolute inset-0 rounded-[36px] border border-white/10" />
          <div className="absolute inset-x-12 top-8 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
          <div className="absolute inset-x-10 bottom-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
              <span
                className={editableTextClass}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('eventDate', event.currentTarget.textContent || '')}
              >
                {displayValue('eventDate')}
              </span>
              <span
                className={editableTextClass}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('companyName', event.currentTarget.textContent || '')}
              >
                {displayValue('companyName')}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <span
                className={`text-sm uppercase tracking-[0.35em] text-amber-200/80 ${editableTextClass}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('positionTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('positionTitle')}
              </span>
              <h2
                className={`text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl ${
                  isEditable ? 'cursor-text rounded-3xl px-4 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('premiumTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('premiumTitle')}
              </h2>
              <p
                className={`text-lg leading-8 text-white/80 sm:text-xl ${
                  isEditable ? 'cursor-text rounded-3xl px-4 py-3 hover:bg-white/5' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('premiumMessage', event.currentTarget.textContent || '')}
              >
                {displayValue('premiumMessage')}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.35em] text-white/50">Öne Çıkan Not</span>
              <p
                className={`text-base text-amber-100/80 sm:text-lg ${editableTextClass}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('premiumHighlight', event.currentTarget.textContent || '')}
              >
                {displayValue('premiumHighlight')}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
              <span
                className={`text-sm uppercase tracking-[0.35em] ${editableTextClass}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('recipientName', event.currentTarget.textContent || '')}
              >
                {displayValue('recipientName')}
              </span>
              <span
                className={`text-sm text-white/60 ${editableTextClass}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('premiumFooter', event.currentTarget.textContent || '')}
              >
                {displayValue('premiumFooter')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

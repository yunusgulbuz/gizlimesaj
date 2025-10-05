'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface ModernFocusPortraitCongratsProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type FieldKey =
  | 'modernTitle'
  | 'modernSubtitle'
  | 'modernMessage'
  | 'modernSecondary'
  | 'heroPhotoUrl'
  | 'recipientName'
  | 'positionTitle'
  | 'companyName'
  | 'eventDate'
  | 'optionalQuote';

const DEFAULTS: Record<FieldKey, string> = {
  modernTitle: 'Tebrikler! 🎉',
  modernSubtitle: 'Yeni görevinizde başarılar dileriz.',
  modernMessage:
    'Bu yeni sayfa, profesyonel vizyonunuzun parlayacağı bir sahne olacak. Enerjiniz ve liderlik duruşunuzla takıma ilham vereceğinize inanıyoruz.',
  modernSecondary: 'Yeni görevinizde parlamaya devam edin.',
  heroPhotoUrl:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1500&q=80',
  recipientName: 'Başarılı Profesyonel',
  positionTitle: 'Kıdemli Ürün Müdürü',
  companyName: 'Lumos Tech',
  eventDate: '12 Mart 2025',
  optionalQuote: 'Yeni başlangıçlar cesur adımlarla başlar.',
};

export default function ModernFocusPortraitCongrats({
  recipientName,
  message,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ModernFocusPortraitCongratsProps) {
  const [isMounted, setIsMounted] = useState(false);

  const initialValues = useMemo<Record<FieldKey, string>>(
    () => ({
      modernTitle: textFields?.modernTitle || DEFAULTS.modernTitle,
      modernSubtitle: textFields?.modernSubtitle || DEFAULTS.modernSubtitle,
      modernMessage: textFields?.modernMessage || message || DEFAULTS.modernMessage,
      modernSecondary: textFields?.modernSecondary || DEFAULTS.modernSecondary,
      heroPhotoUrl: textFields?.heroPhotoUrl || DEFAULTS.heroPhotoUrl,
      recipientName: textFields?.recipientName || recipientName || DEFAULTS.recipientName,
      positionTitle: textFields?.positionTitle || DEFAULTS.positionTitle,
      companyName: textFields?.companyName || DEFAULTS.companyName,
      eventDate: textFields?.eventDate || DEFAULTS.eventDate,
      optionalQuote: textFields?.optionalQuote || DEFAULTS.optionalQuote,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState<Record<FieldKey, string>>(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 40);
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
    : 'linear-gradient(135deg, rgba(30,58,138,0.7), rgba(15,23,42,0.9))';

  const editableTextClass = isEditable
    ? 'cursor-text rounded-lg px-2 py-1 transition-colors hover:bg-white/10 focus:outline-none focus:ring-0'
    : '';

  return (
    <section className="relative flex min-h-screen flex-col bg-slate-950 text-white">
      <div className="relative h-[58vh] min-h-[320px] w-full overflow-hidden sm:rounded-b-[2.5rem] lg:h-[68vh]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 transition-transform duration-[7000ms] ease-out"
            style={{
              backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: isMounted ? 'scale(1.02)' : 'scale(1.12)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-slate-950/70 to-slate-950" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {isEditable && (
          <div className="absolute bottom-6 right-6 z-20 max-w-[80%] rounded-full border border-white/30 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur-xl">
            <span className="mr-2 font-semibold text-white/60">Fotoğraf URL</span>
            <span
              className={`inline-block min-w-[6rem] max-w-[16rem] overflow-hidden text-ellipsis whitespace-nowrap align-middle ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('heroPhotoUrl', event.currentTarget.textContent || '')}
            >
              {heroPhotoUrl}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-start px-6 py-10 sm:px-10 lg:px-20 lg:py-16">
        <div
          className={`max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(15,23,42,0.45)] transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] uppercase tracking-[0.35em] text-white/60">
            <span
              className={editableTextClass}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('eventDate', event.currentTarget.textContent || '')}
            >
              {displayValue('eventDate')}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" />
            <span
              className={editableTextClass}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('companyName', event.currentTarget.textContent || '')}
            >
              {displayValue('companyName')}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" />
            <span
              className={editableTextClass}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('modernSecondary', event.currentTarget.textContent || '')}
            >
              {displayValue('modernSecondary')}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:items-center">
            <div
              className={`text-lg font-semibold tracking-[0.25em] text-white sm:text-base ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('recipientName', event.currentTarget.textContent || '')}
            >
              {displayValue('recipientName')}
            </div>
            <div className="hidden h-px flex-1 bg-white/15 sm:block" />
            <div
              className={`text-base text-white/70 ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('positionTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('positionTitle')}
            </div>
          </div>

          <h1
            className={`mt-8 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${
              isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={event => handleContentChange('modernTitle', event.currentTarget.textContent || '')}
          >
            {displayValue('modernTitle')}
          </h1>

          <p
            className={`mt-4 max-w-2xl text-base text-white/75 sm:text-lg ${editableTextClass}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={event => handleContentChange('modernSubtitle', event.currentTarget.textContent || '')}
          >
            {displayValue('modernSubtitle')}
          </p>

          <p
            className={`mt-6 max-w-3xl text-base leading-7 text-white/80 sm:text-lg ${
              isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/05' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={event => handleContentChange('modernMessage', event.currentTarget.textContent || '')}
          >
            {displayValue('modernMessage')}
          </p>

          <div className="mt-10 flex flex-col gap-1 text-sm text-white/60 sm:text-base">
            <span className="uppercase tracking-[0.35em] text-white/40">Not</span>
            <p
              className={`${editableTextClass} italic text-white/70`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('optionalQuote', event.currentTarget.textContent || '')}
            >
              {displayValue('optionalQuote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

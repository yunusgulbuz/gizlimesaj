'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface MinimalCleanFrameCardProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type FieldKey =
  | 'minimalTitle'
  | 'minimalMessage'
  | 'minimalFooter'
  | 'minimalLogoText'
  | 'minimalPhotoUrl'
  | 'recipientName'
  | 'positionTitle'
  | 'eventDate';

const DEFAULTS: Record<FieldKey, string> = {
  minimalTitle: 'Yeni Görevin Hayırlı Olsun',
  minimalMessage: 'Yeni yolculuğunda başarılar.',
  minimalFooter: 'Sevgiyle, Ekibin',
  minimalLogoText: 'Aurora Studio',
  minimalPhotoUrl:
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  recipientName: 'Ayşe Yıldırım',
  positionTitle: 'Strateji Lideri',
  eventDate: '12 Mart 2025',
};

export default function MinimalCleanFrameCard({
  recipientName,
  message,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: MinimalCleanFrameCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  const initialValues = useMemo<Record<FieldKey, string>>(
    () => ({
      minimalTitle: textFields?.minimalTitle || DEFAULTS.minimalTitle,
      minimalMessage: textFields?.minimalMessage || message || DEFAULTS.minimalMessage,
      minimalFooter: textFields?.minimalFooter || DEFAULTS.minimalFooter,
      minimalLogoText: textFields?.minimalLogoText || DEFAULTS.minimalLogoText,
      minimalPhotoUrl: textFields?.minimalPhotoUrl || DEFAULTS.minimalPhotoUrl,
      recipientName: textFields?.recipientName || recipientName || DEFAULTS.recipientName,
      positionTitle: textFields?.positionTitle || DEFAULTS.positionTitle,
      eventDate: textFields?.eventDate || DEFAULTS.eventDate,
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState<Record<FieldKey, string>>(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 60);
    return () => window.clearTimeout(timeout);
  }, []);

  const displayValue = (key: FieldKey) => (isEditable ? localFields[key] : initialValues[key]);

  const handleContentChange = (key: FieldKey, value: string) => {
    const cleanedValue = value.trim();
    setLocalFields(prev => ({ ...prev, [key]: cleanedValue }));
    onTextFieldChange?.(key, cleanedValue);
  };

  const photoUrl = displayValue('minimalPhotoUrl');
  const editableTextClass = isEditable
    ? 'cursor-text rounded-lg px-2 py-1 transition-colors hover:bg-black/5 focus:outline-none focus:ring-0'
    : '';

  return (
    <div className="relative min-h-screen bg-[#f8f7f4] px-6 py-10 text-slate-800 sm:px-10 lg:px-16 lg:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,225,217,0.55),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-[82vh] max-w-4xl items-center justify-center">
        <div
          className={`w-full max-w-3xl rounded-[36px] border border-[#E0E0E0] bg-white/95 p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)] transition-all duration-700 sm:p-12 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
              <span
                className={editableTextClass}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('eventDate', event.currentTarget.textContent || '')}
              >
                {displayValue('eventDate')}
              </span>
              <span className="hidden h-[1px] w-10 bg-slate-200 sm:block" />
              <span
                className={editableTextClass}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={event => handleContentChange('positionTitle', event.currentTarget.textContent || '')}
              >
                {displayValue('positionTitle')}
              </span>
            </div>

            <h2
              className={`text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl ${
                isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-black/5' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('minimalTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalTitle')}
            </h2>

            <p
              className={`mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('minimalMessage', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalMessage')}
            </p>
          </div>

          <div className="relative mt-10 flex justify-center">
            <div className="relative w-full max-w-[360px] overflow-hidden rounded-[28px] border border-[#E6E3DC] bg-[#f5f3ef] shadow-[0_14px_40px_rgba(30,41,59,0.08)]">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayValue('recipientName') || 'Tebrik fotoğrafı'}
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: '3 / 4' }}
                />
              ) : (
                <div
                  className={`flex aspect-[3/4] items-center justify-center text-sm text-slate-400 ${editableTextClass}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={event => handleContentChange('minimalPhotoUrl', event.currentTarget.textContent || '')}
                >
                  Supabase public URL ekleyin
                </div>
              )}
              {isEditable && photoUrl && (
                <div className="absolute inset-x-6 bottom-4 rounded-full bg-white/80 px-3 py-1 text-[0.7rem] text-slate-500 shadow-sm backdrop-blur">
                  <span className="font-medium uppercase tracking-[0.2em] text-slate-400">Fotoğraf URL</span>
                  <div
                    className={`mt-1 truncate text-[0.7rem] ${editableTextClass}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={event => handleContentChange('minimalPhotoUrl', event.currentTarget.textContent || '')}
                  >
                    {photoUrl}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-1 text-center">
            <span
              className={`text-sm uppercase tracking-[0.35em] text-slate-400 ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('recipientName', event.currentTarget.textContent || '')}
            >
              {displayValue('recipientName')}
            </span>
            <span className="h-[1px] w-12 bg-slate-200" />
            <p
              className={`mt-3 max-w-lg text-base text-slate-500 sm:text-lg ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('minimalFooter', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalFooter')}
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="h-px w-20 bg-[#E0E0E0]" />
            <span
              className={`text-xs uppercase tracking-[0.4em] text-slate-300 ${editableTextClass}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={event => handleContentChange('minimalLogoText', event.currentTarget.textContent || '')}
            >
              {displayValue('minimalLogoText')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

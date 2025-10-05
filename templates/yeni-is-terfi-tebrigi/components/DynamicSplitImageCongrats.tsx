'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface DynamicSplitImageCongratsProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type FieldKey =
  | 'creativeHeadline'
  | 'creativeSubheadline'
  | 'creativeNote'
  | 'profilePhotoUrl'
  | 'themePhotoUrl'
  | 'recipientName'
  | 'positionTitle'
  | 'companyName';

const DEFAULTS: Record<FieldKey, string> = {
  creativeHeadline: 'Yeni Başlangıçlara 🚀',
  creativeSubheadline: 'Başarı dolu bir yol seni bekliyor.',
  creativeNote:
    'Attığın her adımda yanındayız. Yeni görevinde ilham veren hikayeler yazacağına inanıyoruz.',
  profilePhotoUrl:
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80',
  themePhotoUrl:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  recipientName: 'Mert Kaplan',
  positionTitle: 'İnovasyon Direktörü',
  companyName: 'Nova Labs',
};

export default function DynamicSplitImageCongrats({
  recipientName,
  message,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: DynamicSplitImageCongratsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [parallax, setParallax] = useState({ profile: 0, theme: 0 });

  const initialValues = useMemo<Record<FieldKey, string>>(
    () => ({
      creativeHeadline: textFields?.creativeHeadline || DEFAULTS.creativeHeadline,
      creativeSubheadline: textFields?.creativeSubheadline || DEFAULTS.creativeSubheadline,
      creativeNote: textFields?.creativeNote || message || DEFAULTS.creativeNote,
      profilePhotoUrl: textFields?.profilePhotoUrl || DEFAULTS.profilePhotoUrl,
      themePhotoUrl: textFields?.themePhotoUrl || DEFAULTS.themePhotoUrl,
      recipientName: textFields?.recipientName || recipientName || DEFAULTS.recipientName,
      positionTitle: textFields?.positionTitle || DEFAULTS.positionTitle,
      companyName: textFields?.companyName || DEFAULTS.companyName,
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

  useEffect(() => {
    let frame = 0;
    const maxProfileOffset = 60;
    const maxThemeOffset = 48;

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setParallax({
          profile: Math.min(scrollY * 0.08, maxProfileOffset),
          theme: Math.min(scrollY * 0.05, maxThemeOffset),
        });
        frame = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const displayValue = (key: FieldKey) => (isEditable ? localFields[key] : initialValues[key]);

  const handleContentChange = (key: FieldKey, value: string) => {
    const cleanedValue = value.trim();
    setLocalFields(prev => ({ ...prev, [key]: cleanedValue }));
    onTextFieldChange?.(key, cleanedValue);
  };

  const editableTextClass = isEditable
    ? 'cursor-text rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus:outline-none focus:ring-0'
    : '';

  const profileUrl = displayValue('profilePhotoUrl');
  const themeUrl = displayValue('themePhotoUrl');

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      <div className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-30%] left-[-10%] h-[480px] w-[480px] rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="relative">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="group relative h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(14,165,233,0.25)] sm:h-[380px] lg:h-[480px]">
              <div
                className="absolute inset-0 transition-transform duration-[6000ms] ease-out"
                style={{
                  backgroundImage: profileUrl ? `url(${profileUrl})` : 'linear-gradient(135deg, rgba(56,189,248,0.35), rgba(15,23,42,0.85))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `translateY(${isMounted ? parallax.profile * -0.5 : 0}px) scale(${isMounted ? 1.05 : 1.1})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-slate-900/50 to-slate-950/70" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                <div className="text-xs uppercase tracking-[0.4em] text-white/70">Profil</div>
              </div>
              {isEditable && (
                <div className="absolute right-5 top-5 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-white/60 backdrop-blur">
                  <span className="mr-2 font-medium text-white/50">URL</span>
                  <span
                    className="inline-block max-w-[12rem] overflow-hidden text-ellipsis whitespace-nowrap align-middle"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={event => handleContentChange('profilePhotoUrl', event.currentTarget.textContent || '')}
                  >
                    {profileUrl}
                  </span>
                </div>
              )}
            </div>

            <div className="group relative h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(251,191,36,0.2)] sm:h-[380px] lg:h-[480px]">
              <div
                className="absolute inset-0 transition-transform duration-[6000ms] ease-out"
                style={{
                  backgroundImage: themeUrl ? `url(${themeUrl})` : 'linear-gradient(135deg, rgba(255,176,67,0.35), rgba(30,41,59,0.9))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `translateY(${isMounted ? parallax.theme * 0.5 : 0}px) scale(${isMounted ? 1.05 : 1.1})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/65 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-950/85 to-transparent p-6 text-right">
                <div className="text-xs uppercase tracking-[0.4em] text-white/70">Yeni Ufuklar</div>
              </div>
              {isEditable && (
                <div className="absolute left-5 top-5 flex min-w-[12rem] max-w-[75%] items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-white/60 backdrop-blur">
                  <span className="font-medium text-white/50">URL</span>
                  <span
                    className="inline-block flex-1 overflow-hidden text-ellipsis whitespace-nowrap align-middle"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={event => handleContentChange('themePhotoUrl', event.currentTarget.textContent || '')}
                  >
                    {themeUrl}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative -mt-20 flex justify-center lg:-mt-28">
            <div
              className={`w-full max-w-4xl rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_120px_rgba(14,165,233,0.25)] backdrop-blur-2xl sm:p-10 transition-all duration-700 ${
                isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <span
                    className={`text-xs uppercase tracking-[0.4em] text-white/60 ${editableTextClass}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={event => handleContentChange('companyName', event.currentTarget.textContent || '')}
                  >
                    {displayValue('companyName')}
                  </span>
                  <span
                    className={`text-xs uppercase tracking-[0.4em] text-cyan-200/70 lg:text-right ${editableTextClass}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={event => handleContentChange('positionTitle', event.currentTarget.textContent || '')}
                  >
                    {displayValue('positionTitle')}
                  </span>
                </div>

                <h2
                  className={`text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={event => handleContentChange('creativeHeadline', event.currentTarget.textContent || '')}
                >
                  {displayValue('creativeHeadline')}
                </h2>

                <p
                  className={`text-base text-white/75 sm:text-lg ${editableTextClass}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={event => handleContentChange('creativeSubheadline', event.currentTarget.textContent || '')}
                >
                  {displayValue('creativeSubheadline')}
                </p>

                <p
                  className={`text-base leading-7 text-white/80 sm:text-lg ${
                    isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/5' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={event => handleContentChange('creativeNote', event.currentTarget.textContent || '')}
                >
                  {displayValue('creativeNote')}
                </p>

                <div className="mt-4 flex flex-col items-center gap-2 text-white/70 lg:flex-row lg:justify-between">
                  <span
                    className={`text-sm uppercase tracking-[0.35em] ${editableTextClass}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={event => handleContentChange('recipientName', event.currentTarget.textContent || '')}
                  >
                    {displayValue('recipientName')}
                  </span>
                  <span className="text-sm uppercase tracking-[0.35em] text-white/40">Yeni Başlangıçlar İçin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

type DesignStyle = 'modern' | 'classic' | 'minimalist' | 'eglenceli';

interface AnniversaryLuxeTemplateProps {
  recipientName: string;
  message: string;
  designStyle: DesignStyle;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface TimelineEntry {
  year: string;
  title: string;
  message: string;
  photoUrl?: string;
}

interface BokehCircle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
}

const FALLBACK_MAIN_MESSAGE = 'Seninle geçen her yıldönümü, ışığın camdan süzülüşü gibi zarif ve özel hissettiriyor.';

const FALLBACK_TIMELINE = `2015|İlk Buluşmamız|O yaz akşamında kalbimin sana ait olduğunu anladım.|https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&q=80\n2017|İlk Tatilimiz|Birlikte yeni yerler keşfetmenin heyecanını yaşadık.|https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=640&q=80\n2020|Evet Dediğin An|Gözlerinin içine bakarken dünyamız güzelleşti.|https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=640&q=80\n2023|Yeni Başlangıç|Hayallerimizi aynı sayfada büyütmeye devam ettik.|https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=640&q=80`;

const generateBokehCircles = (): BokehCircle[] =>
  Array.from({ length: 18 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 140 + 60,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 3
  }));

const generateConfettiPieces = (): ConfettiPiece[] => {
  const palette = ['#f87171', '#fbbf24', '#f472b6', '#fb7185'];
  return Array.from({ length: 28 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    duration: 4 + Math.random() * 3,
    delay: Math.random() * 1.5,
    color: palette[index % palette.length]
  }));
};

const MINIMAL_SPARKLES: Array<{ id: number; left: number; top: number; delay: number }> = [
  { id: 0, left: 18, top: 18, delay: 0 },
  { id: 1, left: 82, top: 22, delay: 0.4 },
  { id: 2, left: 12, top: 64, delay: 0.8 },
  { id: 3, left: 88, top: 68, delay: 1.2 },
  { id: 4, left: 35, top: 82, delay: 1.6 },
  { id: 5, left: 68, top: 12, delay: 2 },
];

const parseTimelineEntries = (entries: string | undefined): TimelineEntry[] => {
  const source = entries && entries.trim().length > 0 ? entries : FALLBACK_TIMELINE;
  return source
    .split('\n')
    .map((line) => {
      const [year, title, message, photoUrl] = line.split('|').map((part) => part?.trim() || '');
      return {
        year: year || '—',
        title: title || 'Unutulmaz An',
        message: message || 'Bu kısmı kendi anınızla doldurun.',
        photoUrl: photoUrl || 'https://i.hizliresim.com/mojpwcv.png'
      };
    })
    .filter((item) => item.title.length > 0 || item.message.length > 0);
};

const serializeTimelineEntries = (entries: TimelineEntry[]): string =>
  entries.map((entry) => `${entry.year}|${entry.title}|${entry.message}|${entry.photoUrl || 'https://i.hizliresim.com/mojpwcv.png'}`).join('\n');

const buildInitialFields = (
  recipientName: string,
  message: string,
  textFields?: TemplateTextFields
) => {
  const primaryMessage = textFields?.mainMessage || message || FALLBACK_MAIN_MESSAGE;

  return {
    recipientName: textFields?.recipientName || recipientName,
    mainMessage: primaryMessage,
    glassHeading: textFields?.glassHeading || 'Mutlu Yıl Dönümü',
    glassSubheading: textFields?.glassSubheading || 'Bu özel gün, camın içinden süzülen ışık gibi zarifçe parlasın.',
    glassBody: textFields?.glassBody || primaryMessage,
    glassButtonLabel: textFields?.glassButtonLabel || 'Özel Notu Gör',
    glassLightNote: textFields?.glassLightNote || 'Işığımız hiç sönmesin.',
    glassPhotoInitial: textFields?.glassPhotoInitial || '♥',
    glassPhotoUrl: textFields?.glassPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
    timelineHeading: textFields?.timelineHeading || 'Zaman Tünelimiz',
    timelineIntro: textFields?.timelineIntro || 'Hatıralarımızı kaydırırken her anı yeniden yaşıyoruz.',
    timelineEntries: textFields?.timelineEntries || FALLBACK_TIMELINE,
    timelineButtonLabel: textFields?.timelineButtonLabel || 'Başa Sar',
    timelineOutroHeading: textFields?.timelineOutroHeading || 'Mutlu Yıl Dönümü',
    timelineOutroMessage: textFields?.timelineOutroMessage || primaryMessage,
    minimalHeading: textFields?.minimalHeading || 'Mutlu Yıl Dönümü',
    minimalMessage: textFields?.minimalMessage || primaryMessage,
    minimalDateLabel: textFields?.minimalDateLabel || '14 Şubat 2024',
    minimalFooter: textFields?.minimalFooter || 'Bugün, bizim hikayemizin en sevdiğim sayfası.',
    minimalCelebrationBadge: textFields?.minimalCelebrationBadge || 'Kutlama',
    minimalCelebrationTitle: textFields?.minimalCelebrationTitle || 'Kutlama Başlıyor!',
    minimalCelebrationSubtitle: textFields?.minimalCelebrationSubtitle || 'Sevgiyle dolu bu anı birlikte kutluyoruz.',
    minimalPhotoUrl: textFields?.minimalPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
    minimalButtonLabel: textFields?.minimalButtonLabel || 'Kutlamayı Paylaş',
    funHeading: textFields?.funHeading || 'Mutlu Yıl Dönümü',
    funSubheading: textFields?.funSubheading || `${recipientName} + Ben`,
    funMessage: textFields?.funMessage || primaryMessage,
    funButtonLabel: textFields?.funButtonLabel || 'Kutlamayı Gör',
    funConfettiMessage: textFields?.funConfettiMessage || 'Aşkımız gökyüzünü konfetiye boğuyor!',
    funFloatingNote: textFields?.funFloatingNote || 'Birlikte nice senelere!',
    funPhotoUrl: textFields?.funPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
    funCelebrationTitle: textFields?.funCelebrationTitle || 'Parti Başlıyor!'
  } satisfies Record<string, string>;
};

export default function AnniversaryLuxeTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange
}: AnniversaryLuxeTemplateProps) {
  const [localFields, setLocalFields] = useState(() => buildInitialFields(recipientName, message, textFields));
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>(() => parseTimelineEntries(localFields.timelineEntries));

  useEffect(() => {
    setLocalFields(buildInitialFields(recipientName, message, textFields));
  }, [recipientName, message, textFields]);

  useEffect(() => {
    setTimelineEntries(parseTimelineEntries(localFields.timelineEntries));
  }, [localFields.timelineEntries]);

  const handleFieldChange = (key: string, value: string) => {
    setLocalFields((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const handleTimelineEntryChange = (index: number, field: keyof TimelineEntry, value: string) => {
    setTimelineEntries((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = {
        ...next[index],
        [field]: value,
      };

      handleFieldChange('timelineEntries', serializeTimelineEntries(next));
      return next;
    });
  };

  const getFieldValue = (key: string): string => {
    if (isEditable) {
      return localFields[key] ?? '';
    }
    return (textFields?.[key] as string | undefined) ?? localFields[key] ?? '';
  };

  const displayRecipientName = useMemo(() => {
    if (isEditable) {
      return localFields.recipientName || recipientName;
    }
    return textFields?.recipientName || recipientName;
  }, [isEditable, localFields.recipientName, recipientName, textFields?.recipientName]);

  const displayMainMessage = useMemo(() => {
    if (isEditable) {
      return localFields.mainMessage || message || FALLBACK_MAIN_MESSAGE;
    }
    return textFields?.mainMessage || message || FALLBACK_MAIN_MESSAGE;
  }, [isEditable, localFields.mainMessage, message, textFields?.mainMessage]);

  switch (designStyle) {
    case 'classic':
      return (
        <TimelineScrollExperience
          creatorName={creatorName}
          isEditable={isEditable}
          displayRecipientName={displayRecipientName}
          getFieldValue={getFieldValue}
          onFieldChange={handleFieldChange}
          timelineEntries={timelineEntries}
          onTimelineEntryChange={handleTimelineEntryChange}
        />
      );
    case 'minimalist':
      return (
        <MinimalElegantSpotlight
          creatorName={creatorName}
          isEditable={isEditable}
          displayRecipientName={displayRecipientName}
          displayMainMessage={displayMainMessage}
          getFieldValue={getFieldValue}
          onFieldChange={handleFieldChange}
        />
      );
    case 'eglenceli':
      return (
        <PlayfulCelebrationExperience
          creatorName={creatorName}
          isEditable={isEditable}
          displayRecipientName={displayRecipientName}
          displayMainMessage={displayMainMessage}
          getFieldValue={getFieldValue}
          onFieldChange={handleFieldChange}
        />
      );
    case 'modern':
    default:
      return (
        <ModernGlassPanel
          creatorName={creatorName}
          isEditable={isEditable}
          displayRecipientName={displayRecipientName}
          displayMainMessage={displayMainMessage}
          getFieldValue={getFieldValue}
          onFieldChange={handleFieldChange}
        />
      );
  }
}
interface SharedStyleProps {
  creatorName?: string;
  isEditable: boolean;
  displayRecipientName: string;
  getFieldValue: (key: string) => string;
  onFieldChange: (key: string, value: string) => void;
}

interface MessageStyleProps extends SharedStyleProps {
  displayMainMessage: string;
}

interface TimelineScrollProps extends SharedStyleProps {
  timelineEntries: TimelineEntry[];
  onTimelineEntryChange: (index: number, field: keyof TimelineEntry, value: string) => void;
}

function ModernGlassPanel({
  creatorName,
  isEditable,
  displayRecipientName,
  displayMainMessage,
  getFieldValue,
  onFieldChange
}: MessageStyleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonActivated, setIsButtonActivated] = useState(false);
  const memoriesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isButtonActivated || typeof window === 'undefined') return;
    const timer = window.setTimeout(() => setIsButtonActivated(false), 3500);
    return () => window.clearTimeout(timer);
  }, [isButtonActivated]);

  const heading = getFieldValue('glassHeading');
  const subheading = getFieldValue('glassSubheading');
  const body = getFieldValue('glassBody') || displayMainMessage;
  const buttonLabel = getFieldValue('glassButtonLabel');
  const lightNote = getFieldValue('glassLightNote');
  const photoUrl = getFieldValue('glassPhotoUrl');
  const photoInitial = getFieldValue('glassPhotoInitial') || (displayRecipientName?.charAt(0) || '♥');

  const [bokehCircles, setBokehCircles] = useState<BokehCircle[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setBokehCircles(generateBokehCircles());
  }, []);

  const handleButtonClick = () => {
    setIsButtonActivated(true);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        memoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-gray-100 to-white text-slate-900">
      <style>{`
        @keyframes bokehGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }
        @keyframes lightSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute right-16 top-28 h-72 w-72 rounded-full bg-pink-100/70 blur-3xl" />
        <div className="absolute bottom-12 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute inset-0">
          {bokehCircles.map((circle) => (
            <span
              key={circle.id}
              className="absolute rounded-full bg-white/40"
              style={{
                left: `${circle.left}%`,
                top: `${circle.top}%`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                animation: `bokehGlow ${circle.duration}s ease-in-out ${circle.delay}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative z-10 flex min-h-screen items-center justify-center px-4 py-14 sm:px-8 lg:px-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-white/40 bg-white/20 p-6 shadow-2xl backdrop-blur-xl sm:p-10 lg:flex-row lg:gap-12">
          <div className="flex-1 space-y-6">
            {creatorName && (
              <p className="text-xs uppercase tracking-[0.32em] text-slate-700/70">
                Hazırlayan: {creatorName}
              </p>
            )}

            <div className="space-y-3">
              <h1
                className={`text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl ${
                  isEditable ? 'cursor-text rounded-lg px-2 py-1 transition-all hover:bg-white/40' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('glassHeading', event.currentTarget.textContent?.trim() || '')}
              >
                {heading}
              </h1>
              <div
                className={`text-lg font-medium uppercase tracking-[0.3em] text-slate-600 sm:text-xl ${
                  isEditable ? 'cursor-text rounded-full px-3 py-1 transition-all hover:bg-white/40' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('recipientName', event.currentTarget.textContent?.trim() || '')}
              >
                {displayRecipientName}
              </div>
              <p
                className={`max-w-xl text-base text-slate-700 sm:text-lg ${
                  isEditable ? 'cursor-text rounded-lg px-2 py-1 transition-all hover:bg-white/40' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('glassSubheading', event.currentTarget.textContent?.trim() || '')}
              >
                {subheading}
              </p>
            </div>

            <p
              className={`max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg ${
                isEditable ? 'cursor-text rounded-lg px-2 py-1 transition-all hover:bg-white/40' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('glassBody', event.currentTarget.textContent?.trim() || '')}
            >
              {body}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleButtonClick}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-lg transition-all hover:bg-white/60 focus:outline-none"
              >
                <span className="absolute inset-0 h-full w-full translate-x-[-120%] bg-white/60 opacity-60 transition-transform duration-500 group-hover:translate-x-[120%]" />
                <span
                  className={`${
                    isEditable ? 'cursor-text rounded-full px-2 py-0.5 transition-all hover:bg-white/70' : ''
                  } relative z-10`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => onFieldChange('glassButtonLabel', event.currentTarget.textContent?.trim() || '')}
                >
                  {buttonLabel}
                </span>
              </button>
            </div>

            <p
              className={`text-xs uppercase tracking-[0.35em] text-slate-500 ${
                isEditable ? 'cursor-text rounded-full px-3 py-1 transition-all hover:bg-white/40' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('glassLightNote', event.currentTarget.textContent?.trim() || '')}
            >
              {lightNote}
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-6 lg:w-auto">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-white/40 blur-xl" />
              <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-white/30 shadow-inner backdrop-blur-lg sm:h-52 sm:w-52">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`💏 ${displayRecipientName} fotoğrafı`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className={`text-4xl font-semibold text-rose-400 drop-shadow ${
                      isEditable ? 'cursor-text rounded-full px-4 py-2 transition-all hover:bg-white/60' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) => onFieldChange('glassPhotoInitial', event.currentTarget.textContent?.trim() || '')}
                  >
                    {photoInitial}
                  </span>
                )}
              </div>
            </div>
            {isEditable && (
              <input
                type="url"
                value={photoUrl}
                onChange={(event) => onFieldChange('glassPhotoUrl', event.currentTarget.value)}
                placeholder="Fotoğraf bağlantısı (isteğe bağlı)"
                className="w-full rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm outline-none transition focus:border-rose-200 focus:bg-white"
              />
            )}
          </div>
        </div>
      </div>

      <div
        ref={memoriesRef}
        className={`relative z-10 mx-auto mt-10 max-w-5xl rounded-3xl border border-white/40 bg-white/60 p-6 sm:p-10 shadow-xl backdrop-blur transition-all duration-500 ${
          isButtonActivated ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-6'
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">Hatıralarımızdan Bir Kesit</h2>
          <span className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">{displayRecipientName}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{displayMainMessage}</p>
      </div>

    </div>
  );
}

function TimelineScrollExperience({
  creatorName,
  isEditable,
  displayRecipientName,
  getFieldValue,
  onFieldChange,
  timelineEntries,
  onTimelineEntryChange
}: TimelineScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [timelineEntries.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const handleScrollEvent = () => {
      const { scrollTop } = container;
      const items = Array.from(container.querySelectorAll('[data-entry-index]')) as HTMLElement[];
      if (!items.length) return;

      let newActive = 0;
      for (let index = 0; index < items.length; index += 1) {
        const element = items[index];
        if (scrollTop >= element.offsetTop - element.offsetHeight * 0.5) {
          newActive = index;
        }
      }
      setActiveIndex(newActive);
    };

    container.addEventListener('scroll', handleScrollEvent);
    handleScrollEvent();

    return () => container.removeEventListener('scroll', handleScrollEvent);
  }, [timelineEntries.length]);

  const heading = getFieldValue('timelineHeading');
  const intro = getFieldValue('timelineIntro');
  const buttonLabel = getFieldValue('timelineButtonLabel');
  const outroHeading = getFieldValue('timelineOutroHeading');
  const outroMessage = getFieldValue('timelineOutroMessage');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fdf7ef] via-[#faf0dd] to-[#f4e4c8] text-slate-900">
      <style>{`
        @keyframes pulseLine {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="absolute inset-0">
        <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8">
        <div className="text-center">
          {creatorName && (
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-700/70">
              Hazırlayan: {creatorName}
            </p>
          )}
          <h1
            className={`text-3xl font-semibold text-amber-900 sm:text-4xl ${
              isEditable ? 'cursor-text rounded-lg px-3 py-1 transition-colors hover:bg-white/60' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('timelineHeading', event.currentTarget.textContent?.trim() || '')}
          >
            {heading}
          </h1>
          <div
            className={`mt-4 text-sm uppercase tracking-[0.32em] text-amber-700 ${
              isEditable ? 'cursor-text rounded-full px-4 py-1 transition-colors hover:bg-white/60' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('recipientName', event.currentTarget.textContent?.trim() || '')}
          >
            {displayRecipientName}
          </div>
          <p
            className={`mx-auto mt-4 max-w-2xl text-base text-amber-800/80 sm:text-lg ${
              isEditable ? 'cursor-text rounded-lg px-3 py-1 transition-colors hover:bg-white/60' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('timelineIntro', event.currentTarget.textContent?.trim() || '')}
          >
            {intro}
          </p>
        </div>

        <div
          ref={scrollRef}
          className="relative max-h-[60vh] overflow-y-auto rounded-3xl border border-amber-200/60 bg-white/70 p-6 shadow-inner backdrop-blur"
        >
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-amber-200 via-amber-400/70 to-amber-200 md:block" />
          <div className="space-y-10">
            {timelineEntries.map((entry, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={`timeline-entry-${index}`}
                  data-entry-index={index}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                    isActive ? 'md:-translate-x-2 md:translate-y-0' : ''
                  }`}
                >
                  <div className="flex items-center md:w-1/2 md:justify-end">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-sm font-semibold uppercase tracking-[0.2em] transition-all md:h-20 md:w-20 md:text-base ${
                        isActive ? 'border-amber-500 bg-amber-100 text-amber-800 shadow-lg' : 'border-amber-200 bg-white text-amber-600'
                      } ${isEditable ? 'cursor-text' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) => onTimelineEntryChange(index, 'year', event.currentTarget.textContent?.trim() || '')}
                    >
                      {entry.year}
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <div
                      className={`rounded-2xl border border-amber-100/70 bg-white/80 p-5 shadow transition-all ${
                        isActive ? 'border-amber-300/80 shadow-xl' : ''
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold text-amber-900 ${
                          isEditable ? 'cursor-text rounded-md px-2 py-1 transition-colors hover:bg-amber-50' : ''
                        }`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onTimelineEntryChange(index, 'title', event.currentTarget.textContent?.trim() || '')}
                      >
                        {entry.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm text-amber-800/80 sm:text-base ${
                          isEditable ? 'cursor-text rounded-md px-2 py-1 transition-colors hover:bg-amber-50' : ''
                        }`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onTimelineEntryChange(index, 'message', event.currentTarget.textContent?.trim() || '')}
                      >
                        {entry.message}
                      </p>

                      {entry.photoUrl ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-amber-100/80 shadow-sm">
                          <img
                            src={entry.photoUrl}
                            alt={`${entry.title} fotoğrafı`}
                            className="h-40 w-full object-cover"
                          />
                        </div>
                      ) : (
                        isEditable && (
                          <div className="mt-4 rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/40 p-4 text-sm text-amber-700/80">
                            Fotoğraf bağlantısı eklediğinizde burada görünecek.
                          </div>
                        )
                      )}

                      {isEditable && (
                        <input
                          type="url"
                          value={entry.photoUrl || 'https://i.hizliresim.com/mojpwcv.png'}
                          onChange={(event) => onTimelineEntryChange(index, 'photoUrl', event.currentTarget.value)}
                          placeholder="Fotoğraf bağlantısı (isteğe bağlı)"
                          className="mt-3 w-full rounded-xl border border-amber-200/80 bg-white px-3 py-2 text-sm text-amber-800 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              const container = scrollRef.current;
              if (container) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
              }
              setActiveIndex(0);
            }}
            className="group inline-flex items-center gap-2 rounded-full border border-amber-400/70 bg-amber-100/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 transition-all hover:bg-amber-200/90"
          >
            <span
              className={`${
                isEditable ? 'cursor-text rounded-full px-2 py-0.5 transition-colors hover:bg-amber-300/60' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('timelineButtonLabel', event.currentTarget.textContent?.trim() || '')}
            >
              {buttonLabel}
            </span>
          </button>

          <div className="mt-8 space-y-3">
            <h2
              className={`text-2xl font-semibold text-amber-900 ${
                isEditable ? 'cursor-text rounded-md px-2 py-1 transition-colors hover:bg-white/60' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('timelineOutroHeading', event.currentTarget.textContent?.trim() || '')}
            >
              {outroHeading}
            </h2>
            <p
              className={`mx-auto max-w-2xl text-base text-amber-800/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-md px-3 py-2 transition-colors hover:bg-white/60' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('timelineOutroMessage', event.currentTarget.textContent?.trim() || '')}
            >
              {outroMessage}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

function MinimalElegantSpotlight({
  creatorName,
  isEditable,
  displayRecipientName,
  displayMainMessage,
  getFieldValue,
  onFieldChange
}: MessageStyleProps) {
  const [isReady, setIsReady] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const celebrationTimerRef = useRef<number | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);

  const clearCelebrationTimer = () => {
    if (typeof window !== 'undefined' && celebrationTimerRef.current) {
      window.clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = null;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 120);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    return () => {
      clearCelebrationTimer();
    };
  }, []);

  useEffect(() => {
    if (!isCelebrating) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!overlayContentRef.current) return;
      if (!overlayContentRef.current.contains(event.target as Node)) {
        setIsCelebrating(false);
        clearCelebrationTimer();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isCelebrating]);

  const heading = getFieldValue('minimalHeading');
  const message = getFieldValue('minimalMessage') || displayMainMessage;
  const dateLabel = getFieldValue('minimalDateLabel');
  const buttonLabel = getFieldValue('minimalButtonLabel');
  const footer = getFieldValue('minimalFooter');
  const photoUrl = getFieldValue('minimalPhotoUrl');
  const celebrationBadge = getFieldValue('minimalCelebrationBadge') || 'Kutlama';
  const celebrationTitle = getFieldValue('minimalCelebrationTitle') || 'Kutlama Başlıyor!';
  const celebrationSubtitle = getFieldValue('minimalCelebrationSubtitle') || message;

  const handleCelebrateClick = () => {
    if (isEditable && isCelebrating) {
      setIsCelebrating(false);
      clearCelebrationTimer();
      return;
    }

    setIsCelebrating(true);

    if (!isEditable && typeof window !== 'undefined') {
      clearCelebrationTimer();
      celebrationTimerRef.current = window.setTimeout(() => setIsCelebrating(false), 2800);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <style>{`
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes minimalCelebrateIn {
          0% { opacity: 0; transform: scale(0.92); }
          60% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes celebrationSparkle {
          0%, 100% { opacity: 0; transform: scale(0.6) translateY(0); }
          50% { opacity: 1; transform: scale(1) translateY(-8px); }
        }
      `}</style>
      {isCelebrating && (
        <div className={`pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-sm`}>
          <div
            ref={overlayContentRef}
            className="relative flex flex-col items-center gap-4 rounded-[3rem] border border-white/60 bg-white/85 px-12 py-10 text-center text-gray-700 shadow-2xl"
            style={{ animation: 'minimalCelebrateIn 0.6s ease-out' }}
          >
            <span
              className={`text-xs uppercase tracking-[0.5em] text-gray-400 ${isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-white/70' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalCelebrationBadge', event.currentTarget.textContent?.trim() || '')}
            >
              {celebrationBadge}
            </span>
            <p
              className={`max-w-md text-lg font-semibold leading-relaxed text-gray-600 ${isEditable ? 'cursor-text rounded-lg px-3 py-2 transition-colors hover:bg-white/70' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalCelebrationSubtitle', event.currentTarget.textContent?.trim() || '')}
            >
              {celebrationSubtitle}
            </p>
            <span
              className={`text-xs uppercase tracking-[0.4em] text-gray-500 ${isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-white/70' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalCelebrationTitle', event.currentTarget.textContent?.trim() || '')}
            >
              {celebrationTitle}
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.45em] text-gray-400">{displayRecipientName}</span>
            {MINIMAL_SPARKLES.map((sparkle) => (
              <span
                key={sparkle.id}
                className="absolute text-lg text-amber-300"
                style={{
                  left: `${sparkle.left}%`,
                  top: `${sparkle.top}%`,
                  animation: `celebrationSparkle 2.4s ease-in-out ${sparkle.delay}s infinite`
                }}
              >
                ✦
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100" />
      <div className="absolute inset-x-0 top-20 mx-auto h-48 w-48 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-2xl rounded-[3rem] border border-gray-200/70 bg-white/80 p-10 shadow-2xl backdrop-blur">
          {creatorName && (
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gray-500">Hazırlayan: {creatorName}</p>
          )}

          <div className="relative mb-10 flex flex-col items-center justify-center gap-4">
            <div className="pointer-events-none absolute inset-0 animate-[subtlePulse_6s_ease-in-out_infinite] rounded-[2.5rem] border border-gray-200/60" />
            <div
              className={`relative flex aspect-square w-64 items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-200 via-white to-gray-100 shadow-inner ${
                isReady ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
              } transition-all duration-700`}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${displayRecipientName} için yıl dönümü fotoğrafı`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-7xl text-gray-400">📷</div>
              )}
            </div>
            {isEditable && (
              <input
                type="url"
                value={photoUrl}
                onChange={(event) => onFieldChange('minimalPhotoUrl', event.currentTarget.value)}
                placeholder="Fotoğraf bağlantısı (isteğe bağlı)"
                className="w-full rounded-full border border-gray-200/80 bg-white px-4 py-2 text-sm text-gray-600 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
              />
            )}
          </div>

          <div className="space-y-4 text-center">
            <h1
              className={`text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl ${
                isEditable ? 'cursor-text rounded-lg px-3 py-1 transition-colors hover:bg-gray-100' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalHeading', event.currentTarget.textContent?.trim() || '')}
            >
              {heading}
            </h1>
            <div
              className={`text-sm uppercase tracking-[0.3em] text-gray-500 ${
                isEditable ? 'cursor-text rounded-full px-4 py-1 transition-colors hover:bg-gray-100' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('recipientName', event.currentTarget.textContent?.trim() || '')}
            >
              {displayRecipientName}
            </div>
            <p
              className={`mx-auto max-w-xl text-base leading-relaxed text-gray-600 ${
                isEditable ? 'cursor-text rounded-lg px-3 py-2 transition-colors hover:bg-gray-100' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalMessage', event.currentTarget.textContent?.trim() || '')}
            >
              {message}
            </p>
            <div
              className={`text-xs uppercase tracking-[0.4em] text-gray-400 ${
                isEditable ? 'cursor-text rounded-full px-4 py-1 transition-colors hover:bg-gray-100' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalDateLabel', event.currentTarget.textContent?.trim() || '')}
            >
              {dateLabel}
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCelebrateClick}
                className="rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
              >
                <span
                  className={`${
                    isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-gray-200' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => onFieldChange('minimalButtonLabel', event.currentTarget.textContent?.trim() || '')}
                >
                  {buttonLabel}
                </span>
              </button>
            </div>
            <p
              className={`text-xs uppercase tracking-[0.3em] text-gray-500 ${
                isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-gray-100' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('minimalFooter', event.currentTarget.textContent?.trim() || '')}
            >
              {footer}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

function PlayfulCelebrationExperience({
  creatorName,
  isEditable,
  displayRecipientName,
  displayMainMessage,
  getFieldValue,
  onFieldChange
}: MessageStyleProps) {
  const [confettiConfig, setConfettiConfig] = useState<ConfettiPiece[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const celebrationTimerRef = useRef<number | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);

  const clearCelebrationTimerFun = () => {
    if (typeof window !== 'undefined' && celebrationTimerRef.current) {
      window.clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setConfettiConfig(generateConfettiPieces());
    return () => {
      clearCelebrationTimerFun();
    };
  }, []);

  useEffect(() => {
    if (!isCelebrating) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!overlayContentRef.current) return;
      if (!overlayContentRef.current.contains(event.target as Node)) {
        setIsCelebrating(false);
        clearCelebrationTimerFun();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isCelebrating]);

  const heading = getFieldValue('funHeading');
  const subheading = getFieldValue('funSubheading');
  const message = getFieldValue('funMessage') || displayMainMessage;
  const buttonLabel = getFieldValue('funButtonLabel');
  const confettiMessage = getFieldValue('funConfettiMessage');
  const floatingNote = getFieldValue('funFloatingNote');
  const photoUrl = getFieldValue('funPhotoUrl');
  const celebrationTitle = getFieldValue('funCelebrationTitle') || 'Parti Başlıyor!';

  const triggerCelebration = () => {
    if (isEditable && isCelebrating) {
      setIsCelebrating(false);
      clearCelebrationTimerFun();
      return;
    }

    setConfettiConfig(generateConfettiPieces());
    setIsCelebrating(true);

    if (!isEditable && typeof window !== 'undefined') {
      clearCelebrationTimerFun();
      celebrationTimerRef.current = window.setTimeout(() => setIsCelebrating(false), 2400);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-white">
      <style>{`
        @keyframes balloonRise {
          0% { transform: translateY(10%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-110%); opacity: 0; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-120%) rotate(0deg); }
          100% { transform: translateY(120%) rotate(360deg); }
        }
      `}</style>

      {isCelebrating && (
        <div className={`pointer-events-auto absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-white/10 via-rose-200/20 to-transparent backdrop-blur-sm`}>
          <div
            ref={overlayContentRef}
            className="flex flex-col items-center gap-4"
          >
            <div
              className={`rounded-full border border-white/80 bg-white/90 px-10 py-4 text-sm font-black uppercase tracking-[0.4em] text-rose-500 shadow-2xl ${isEditable ? 'cursor-text transition-colors hover:bg-white' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('funCelebrationTitle', event.currentTarget.textContent?.trim() || '')}
            >
              {celebrationTitle}
            </div>
            <p
              className={`max-w-md text-xs uppercase tracking-[0.3em] text-white/85 ${isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('funConfettiMessage', event.currentTarget.textContent?.trim() || '')}
            >
              {confettiMessage}
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0">
        {['🎈', '🎉', '🎊', '🎁'].map((emoji, index) => (
          <span
            key={emoji + index}
            className="absolute text-4xl opacity-60"
            style={{
              left: `${(index + 1) * 20}%`,
              animation: `balloonRise ${12 + index * 2}s linear ${index * 1.2}s infinite`
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {isCelebrating && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {confettiConfig.map((item) => (
            <span
              key={item.id}
              className="absolute block h-3 w-1 rounded-full"
              style={{
                left: `${item.left}%`,
                backgroundColor: item.color,
                animation: `confettiFall ${item.duration}s ease-in ${item.delay}s infinite`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        {creatorName && (
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/80">Hazırlayan: {creatorName}</p>
        )}

        <div className={`mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur ${isCelebrating ? 'ring-4 ring-white/80 shadow-[0_0_45px_rgba(255,255,255,0.45)]' : ''}`}>
          <div
            className={`rounded-full bg-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/90 ${
              isEditable ? 'cursor-text transition-colors hover:bg-white/30' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('funFloatingNote', event.currentTarget.textContent?.trim() || '')}
          >
            {floatingNote}
          </div>

          <h1
            className={`text-4xl font-black uppercase tracking-[0.2em] drop-shadow-lg sm:text-5xl ${
              isEditable ? 'cursor-text rounded-lg px-4 py-2 transition-colors hover:bg-white/20' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('funHeading', event.currentTarget.textContent?.trim() || '')}
          >
            {heading}
          </h1>

          <div
            className={`text-base font-semibold uppercase tracking-[0.25em] text-white/85 sm:text-lg ${
              isEditable ? 'cursor-text rounded-full px-4 py-1 transition-colors hover:bg-white/20' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('funSubheading', event.currentTarget.textContent?.trim() || '')}
          >
            {subheading}
          </div>

          <div className="flex w-full flex-col items-center justify-center">
            {photoUrl ? (
              <div className="mt-2 h-28 w-28 overflow-hidden rounded-full border-4 border-white/60 shadow-xl">
                <img src={photoUrl} alt={`${displayRecipientName} kutlama fotoğrafı`} className="h-full w-full object-cover" />
              </div>
            ) : (
              isEditable && (
                <div className="mt-2 rounded-full border border-dashed border-white/60 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/80">
                  Fotoğraf bağlantısı eklemek için aşağıyı kullanın
                </div>
              )
            )}
            {isEditable && (
              <input
                type="url"
                value={photoUrl}
                onChange={(event) => onFieldChange('funPhotoUrl', event.currentTarget.value)}
                placeholder="Kutlama fotoğrafı bağlantısı"
                className="mt-3 w-full rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm text-rose-500 outline-none transition focus:border-white focus:bg-white"
              />
            )}
          </div>

          <div
            className={`text-sm font-semibold uppercase tracking-[0.35em] text-white/90 ${
              isEditable ? 'cursor-text rounded-full px-4 py-1 transition-colors hover:bg-white/20' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('recipientName', event.currentTarget.textContent?.trim() || '')}
          >
            {displayRecipientName}
          </div>

          <p
            className={`max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg ${
              isEditable ? 'cursor-text rounded-lg px-3 py-2 transition-colors hover:bg-white/20' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('funMessage', event.currentTarget.textContent?.trim() || '')}
          >
            {message}
          </p>

          <button
            type="button"
            onClick={triggerCelebration}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-rose-500 shadow-lg transition-transform hover:-translate-y-1 hover:bg-rose-50"
          >
            <span
              className={`${
                isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-rose-100/80' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('funButtonLabel', event.currentTarget.textContent?.trim() || '')}
            >
              {buttonLabel}
            </span>
          </button>

          <p
            className={`text-sm font-semibold uppercase tracking-[0.3em] text-white/80 ${
              isEditable ? 'cursor-text rounded-full px-3 py-1 transition-colors hover:bg-white/20' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('funConfettiMessage', event.currentTarget.textContent?.trim() || '')}
          >
            {confettiMessage}
          </p>
        </div>
      </div>

    </div>
  );
}

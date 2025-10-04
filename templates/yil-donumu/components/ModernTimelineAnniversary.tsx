'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface ModernTimelineAnniversaryProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

const FALLBACK_EVENTS = `2015-06-12|İlk karşılaştığımız gün|O yaz akşamında kalbimin sana ait olduğunu anladım.
2017-09-03|İlk tatilimiz|Birlikte yeni yerler keşfetmenin heyecanını yaşadık.
2020-02-14|Evet dediğin an|Gözlerinin içine bakarken dünyamız güzelleşti.
2023-11-20|Yeni bir başlangıç|Hayallerimizi aynı sayfada büyütmeye devam ettik.`;

export default function ModernTimelineAnniversary({
  recipientName,
  creatorName,
  textFields,
  primaryMessage,
  isEditable = false,
  onTextFieldChange
}: ModernTimelineAnniversaryProps) {
  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localHeadline, setLocalHeadline] = useState('');
  const [localIntro, setLocalIntro] = useState('');
  const [localCtaLabel, setLocalCtaLabel] = useState('');
  const [localClosing, setLocalClosing] = useState('');
  const [localFinalMessage, setLocalFinalMessage] = useState('');

  const sharedMessage = textFields?.mainMessage || primaryMessage;

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalHeadline(textFields?.headlineMessage || 'Zamanda Yolculuk');
    setLocalIntro(textFields?.timelineIntro || sharedMessage || 'Birlikte geçirdiğimiz her an, yıldızlarla dans eden sonsuz bir hikaye.');
    setLocalCtaLabel(textFields?.timelineCta || 'Birlikte Geçen Yıllarımız');
    setLocalClosing(textFields?.timelineClosing || 'Mutlu Yıl Dönümü');
    setLocalFinalMessage(textFields?.timelineFinalMessage || sharedMessage || 'Geçmişten geleceğe uzanan bu yolculukta, her anı birlikte yeniden yazmaya devam edelim.');
  }, [recipientName, textFields, sharedMessage]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'headlineMessage') setLocalHeadline(value);
    else if (key === 'timelineIntro') setLocalIntro(value);
    else if (key === 'timelineCta') setLocalCtaLabel(value);
    else if (key === 'timelineClosing') setLocalClosing(value);
    else if (key === 'timelineFinalMessage') setLocalFinalMessage(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get display values
  const headline = isEditable ? localHeadline : (textFields?.headlineMessage || 'Zamanda Yolculuk');
  const intro = isEditable ? localIntro : (textFields?.timelineIntro || sharedMessage || 'Birlikte geçirdiğimiz her an, yıldızlarla dans eden sonsuz bir hikaye.');
  const ctaLabel = isEditable ? localCtaLabel : (textFields?.timelineCta || 'Birlikte Geçen Yıllarımız');
  const closingMessage = isEditable ? localClosing : (textFields?.timelineClosing || 'Mutlu Yıl Dönümü');
  const finalMessage = isEditable ? localFinalMessage : (textFields?.timelineFinalMessage || sharedMessage || 'Geçmişten geleceğe uzanan bu yolculukta, her anı birlikte yeniden yazmaya devam edelim.');
  const displayRecipientName = isEditable ? localRecipientName : recipientName;

  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const raw = (textFields?.timelineEvents && textFields.timelineEvents.trim().length > 0)
      ? textFields.timelineEvents
      : FALLBACK_EVENTS;

    const parsed = raw
      .split('\n')
      .map(line => {
        const [date, title, description] = line.split('|').map(part => part?.trim() || '');
        return {
          date: date || '—',
          title: title || 'Unutulmaz An',
          description: description || 'Detay ekleyebilirsiniz.'
        };
      })
      .filter(item => item.title.length > 0);

    setEvents(parsed);
  }, [textFields?.timelineEvents]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showFinale, setShowFinale] = useState(false);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  const handleEventChange = (index: number, field: 'date' | 'title' | 'description', value: string) => {
    const updatedEvents = [...events];
    updatedEvents[index] = {
      ...updatedEvents[index],
      [field]: value
    };
    setEvents(updatedEvents);

    // Update textFields
    const serialized = updatedEvents
      .map(e => `${e.date}|${e.title}|${e.description}`)
      .join('\n');

    if (onTextFieldChange) {
      onTextFieldChange('timelineEvents', serialized);
    }
  };

  const [stars, setStars] = useState(() => [] as Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>);

  useEffect(() => {
    const generated = Array.from({ length: 60 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 8,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 text-white">
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.1; transform: scale(0.8); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 10px rgba(255,215,0,0.2); }
          50% { box-shadow: 0 0 35px rgba(255,215,0,0.6); }
          100% { box-shadow: 0 0 10px rgba(255,215,0,0.2); }
        }
      `}</style>

      {/* Star Field */}
      <div className="absolute inset-0">
        {stars.map(star => (
          <span
            key={star.id}
            className="absolute bg-white/80 rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 py-12 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          {creatorName && (
            <p className="mb-3 sm:mb-4 text-xs uppercase tracking-[0.3em] text-white/60">
              Hazırlayan: {creatorName}
            </p>
          )}
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white/90 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('headlineMessage', e.currentTarget.textContent || '')}
          >
            {headline}
          </h1>
          <p
            className={`mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-white/70 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('timelineIntro', e.currentTarget.textContent || '')}
          >
            {intro}
          </p>
        </div>

        <div className="relative w-full max-w-6xl">
          {/* 3D Ribbon */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200 opacity-80" style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.35)' }}></div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
            {events.map((event, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={`${event.title}-${index}`}
                  className={`relative rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 backdrop-blur-md transition-all duration-700 ${
                    isActive ? 'border-amber-400/80 bg-amber-400/10 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/20' : 'opacity-70'
                  }`}
                  style={{
                    transform: isActive ? 'translateY(-4px) scale(1.02)' : 'translateY(0px) scale(0.98)',
                    animation: isActive ? 'glow 6s ease-in-out infinite' : 'none'
                  }}
                >
                  <div className="absolute -left-4 top-6 hidden h-2 w-2 rounded-full bg-amber-300 shadow-lg shadow-amber-500/50 md:block"></div>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <span
                      className={`text-xs uppercase tracking-[0.25em] text-amber-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-2 py-1 transition-colors' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleEventChange(index, 'date', e.currentTarget.textContent || '')}
                    >
                      {event.date}
                    </span>
                    <h3
                      className={`text-lg sm:text-xl md:text-2xl font-semibold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-2 py-1 transition-colors' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleEventChange(index, 'title', e.currentTarget.textContent || '')}
                    >
                      {event.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-base md:text-lg leading-relaxed text-white/75 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-2 py-1 transition-colors' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleEventChange(index, 'description', e.currentTarget.textContent || '')}
                    >
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center gap-3 sm:gap-4">
          <button
            onClick={() => setShowFinale(true)}
            className={`rounded-full border border-amber-300/60 bg-amber-200/20 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-amber-100 transition-all duration-300 hover:scale-105 hover:bg-amber-300/30 focus:outline-none break-words ${isEditable ? 'hover:bg-amber-300/40 cursor-text' : ''}`}
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.35)' }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('timelineCta', e.currentTarget.textContent || '')}
          >
            {ctaLabel}
          </button>
          <p
            className={`text-xs sm:text-sm text-white/60 text-center break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.replace(' ile yazılan yıldızlı hikaye', '') || '')}
          >
            {displayRecipientName ? `${displayRecipientName} ile yazılan yıldızlı hikaye` : 'Yıldızların izinde bir aşk hikayesi'}
          </p>
        </div>
      </div>

      {showFinale && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
          <div className="relative flex max-w-3xl flex-col items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-amber-200/30 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 md:p-10 lg:px-16 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl">💫</div>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-amber-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('timelineClosing', e.currentTarget.textContent || '')}
            >
              {closingMessage}
            </h2>
            <p
              className={`max-w-xl text-sm sm:text-base md:text-lg text-white/75 leading-relaxed break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('timelineFinalMessage', e.currentTarget.textContent || '')}
            >
              {finalMessage}
            </p>
            <button
              onClick={() => setShowFinale(false)}
              className="rounded-full border border-white/20 bg-white/10 px-5 sm:px-6 py-2 text-xs sm:text-sm uppercase tracking-[0.35em] text-white/80 transition hover:bg-white/20"
            >
              Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

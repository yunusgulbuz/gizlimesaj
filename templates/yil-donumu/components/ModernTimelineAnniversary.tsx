'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface ModernTimelineAnniversaryProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
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
  primaryMessage
}: ModernTimelineAnniversaryProps) {
  const sharedMessage = textFields?.mainMessage || primaryMessage;
  const headline = textFields?.headlineMessage || 'Zamanda Yolculuk';
  const intro = textFields?.timelineIntro || sharedMessage || 'Birlikte geçirdiğimiz her an, yıldızlarla dans eden sonsuz bir hikaye.';
  const ctaLabel = textFields?.timelineCta || 'Birlikte Geçen Yıllarımız';
  const closingMessage = textFields?.timelineClosing || 'Mutlu Yıl Dönümü';

  const events = useMemo<TimelineEvent[]>(() => {
    const raw = (textFields?.timelineEvents && textFields.timelineEvents.trim().length > 0)
      ? textFields.timelineEvents
      : FALLBACK_EVENTS;

    return raw
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

  const stars = useMemo(
    () => Array.from({ length: 60 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 8
    })),
    []
  );

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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:px-10">
        <div className="text-center mb-8 md:mb-12">
          {creatorName && (
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/60">
              Hazırlayan: {creatorName}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white/90">
            {headline}
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-white/70">
            {intro}
          </p>
        </div>

        <div className="relative w-full max-w-6xl">
          {/* 3D Ribbon */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200 opacity-80" style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.35)' }}></div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {events.map((event, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={`${event.title}-${index}`}
                  className={`relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-700 md:p-8 ${
                    isActive ? 'border-amber-400/80 bg-amber-400/10 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/20' : 'opacity-70'
                  }`}
                  style={{
                    transform: isActive ? 'translateY(-4px) scale(1.02)' : 'translateY(0px) scale(0.98)',
                    animation: isActive ? 'glow 6s ease-in-out infinite' : 'none'
                  }}
                >
                  <div className="absolute -left-4 top-6 hidden h-2 w-2 rounded-full bg-amber-300 shadow-lg shadow-amber-500/50 md:block"></div>
                  <div className="flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-[0.25em] text-amber-200">
                      {event.date}
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-white/75">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={() => setShowFinale(true)}
            className="rounded-full border border-amber-300/60 bg-amber-200/20 px-8 py-3 text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-amber-100 transition-all duration-300 hover:scale-105 hover:bg-amber-300/30 focus:outline-none"
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.35)' }}
          >
            {ctaLabel}
          </button>
          <p className="text-xs text-white/60">
            {recipientName ? `${recipientName} ile yazılan yıldızlı hikaye` : 'Yıldızların izinde bir aşk hikayesi'}
          </p>
        </div>
      </div>

      {showFinale && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
          <div className="relative flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-amber-200/30 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-10 text-center md:px-16">
            <div className="text-5xl md:text-6xl">💫</div>
            <h2 className="text-3xl md:text-5xl font-semibold text-amber-200">
              {closingMessage}
            </h2>
            <p className="max-w-xl text-sm md:text-lg text-white/75 leading-relaxed">
              {textFields?.timelineFinalMessage || sharedMessage || 'Geçmişten geleceğe uzanan bu yolculukta, her anı birlikte yeniden yazmaya devam edelim.'}
            </p>
            <button
              onClick={() => setShowFinale(false)}
              className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.35em] text-white/80 transition hover:bg-white/20"
            >
              Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

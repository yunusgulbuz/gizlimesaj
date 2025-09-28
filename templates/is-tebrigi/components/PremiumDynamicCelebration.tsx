'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createAnalyticsTracker } from '@/lib/analytics';
import type { TemplateTextFields } from '../../shared/types';

interface PremiumDynamicCelebrationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  shortId?: string;
}

const CONFETTI_SHADES = ['#fb923c', '#f97316', '#38bdf8', '#0ea5e9', '#facc15'];

export default function PremiumDynamicCelebration({
  recipientName,
  message,
  creatorName,
  textFields,
  shortId,
}: PremiumDynamicCelebrationProps) {
  const [sceneActive, setSceneActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chartRise, setChartRise] = useState(false);

  // Initialize analytics tracker if shortId is provided
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;

  useEffect(() => {
    const timeout = setTimeout(() => setSceneActive(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const confetti = useMemo(
    () =>
      Array.from({ length: 42 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        color: CONFETTI_SHADES[id % CONFETTI_SHADES.length],
        spin: Math.random() * 360,
      })),
    []
  );

  const name = recipientName || textFields?.recipientName || 'Sevgili Liderimiz';
  const headline = textFields?.headline || `Tebrikler ${name}!`;
  const subHeadline = textFields?.subHeadline || 'Yeni görevinde başarılar diliyoruz';
  const description = textFields?.mainMessage || message || 'Takımın ve tüm şirketin ilham kaynağı olmaya devam edeceğine inanıyoruz. Enerjin ve vizyonunla yeni döneme güçlü bir başlangıç yapıyorsun!';
  const buttonText = textFields?.celebrationButtonLabel || 'Teşekkürler';

  const handleCelebrate = async () => {
    setShowConfetti(true);
    setChartRise(false);
    requestAnimationFrame(() => {
      setChartRise(true);
    });
    setTimeout(() => setShowConfetti(false), 2400);

    // Track button click
    if (analytics) {
      await analytics.trackButtonClick('celebration_button', {
        buttonText,
        confettiTriggered: true,
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#101114] text-white">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 10%, rgba(8,145,178,0.35), transparent 55%)' }} />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(135deg, rgba(15,118,110,0.4) 0%, transparent 40%, rgba(236,72,153,0.3) 100%)' }} />

      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-40">
          {confetti.map(piece => (
            <span
              key={piece.id}
              className="absolute h-3 w-1 animate-premium-confetti rounded-full"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.spin}deg)`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-20 lg:flex-row lg:items-center">
        <div className={`flex-1 space-y-6 ${sceneActive ? 'animate-rise-in' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-sky-200">
            Yeni Başlangıç · {textFields?.companyName || 'Atlas Teknoloji'}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">{headline}</h1>
            <p className="text-lg text-sky-200 sm:text-xl">{subHeadline}</p>
          </div>

          <p className="text-base leading-relaxed text-slate-200 sm:text-lg">{description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.4em] text-sky-200">Pozisyon</p>
              <p className="font-semibold text-white">{textFields?.newPosition || 'Growth Direktörü'}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.4em] text-sky-200">Takım</p>
              <p className="font-semibold text-white">{textFields?.teamName || 'Strateji ve Analiz'}</p>
            </div>
            {creatorName && (
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.4em] text-sky-200">Hazırlayan</p>
                <p className="font-semibold text-white">{creatorName}</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleCelebrate}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-400 to-sky-400 text-slate-900 shadow-lg shadow-orange-500/40 transition hover:shadow-orange-500/60"
          >
            <span className="relative z-10 flex items-center gap-2 font-semibold">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 21 4 14 10 12 8 20Z" />
                <path d="m14 3 7 7" />
                <path d="M14 10h7v7" />
                <path d="m9 13 6 6" />
              </svg>
              {buttonText}
            </span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-300 opacity-0 transition group-hover:opacity-100" />
          </Button>
        </div>

        <div className="relative flex-1">
          <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-[0_30px_60px_rgba(8,145,178,0.25)] ${
            sceneActive ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative grid gap-6 sm:grid-cols-2">
              <div className="col-span-1 rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/20 to-transparent p-6 shadow-inner">
                <p className="text-xs uppercase tracking-[0.4em] text-sky-200">Ofis Sahnesi</p>
                <div className="mt-6 flex items-end justify-between">
                  <div className={`flex flex-col items-center transition duration-700 ${sceneActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg" />
                    <div className="mt-3 h-12 w-16 rounded-lg bg-white/20" />
                    <div className="mt-2 h-6 w-24 rounded-lg bg-white/10" />
                  </div>
                  <div className={`flex flex-col items-center transition duration-700 delay-150 ${sceneActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <div className="h-16 w-16 -translate-y-4 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg" />
                    <div className="h-10 w-14 rounded-lg bg-white/20" />
                    <div className="mt-2 h-6 w-20 rounded-lg bg-white/10" />
                  </div>
                  <div className={`flex flex-col items-center transition duration-700 delay-300 ${sceneActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg" />
                    <div className="mt-3 h-12 w-16 rounded-lg bg-white/20" />
                    <div className="mt-2 h-6 w-24 rounded-lg bg-white/10" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-300">
                  <span>Takım Guru</span>
                  <span>İlham Veren An</span>
                </div>
              </div>

              <div className="col-span-1 flex flex-col justify-between gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-sky-200">Başarı Grafiği</p>
                  <div className="mt-6 h-40 w-full overflow-hidden">
                    <div className="relative h-full w-full">
                      <svg viewBox="0 0 200 120" className="h-full w-full">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        <polyline
                          points="10,110 50,90 90,80 130,60 170,30"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="6"
                          strokeLinecap="round"
                          className={`origin-bottom transition-all duration-1000 ${chartRise ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                        />
                        <polygon
                          points="10,110 50,90 90,80 130,60 170,30 170,110"
                          fill="url(#chartGradient)"
                          className={`origin-bottom transition-all duration-1000 ${chartRise ? 'scale-y-100 opacity-80' : 'scale-y-0 opacity-0'}`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
                  <p>{textFields?.secondaryMessage || 'Yeni takım ruhu: İnovasyon, işbirliği ve yüksek enerji!'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes premiumConfetti {
          0% {
            transform: translateY(-120%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-premium-confetti {
          animation-name: premiumConfetti;
          animation-timing-function: ease-in;
        }
        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-rise-in {
          animation: riseIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}

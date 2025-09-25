'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';

interface MinimalistProfessionalCardProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
}

export default function MinimalistProfessionalCard({
  recipientName,
  message,
  creatorName,
  textFields,
}: MinimalistProfessionalCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  const name = recipientName || textFields?.recipientName || 'Sevgili İş Ortağımız';
  const title = textFields?.minimalTitle || 'Yeni Göreviniz Hayırlı Olsun';
  const note = textFields?.mainMessage || message || 'Profesyonel yolculuğunuzun bu yeni adımında başarılarınızın devamını diliyoruz.';
  const smallNote = textFields?.supplementMessage || 'Takım arkadaşlarınız sizinle gurur duyuyor.';
  const buttonLabel = textFields?.messageButtonLabel || 'Mesaj Gönder';
  const buttonUrl = textFields?.messageButtonUrl;

  const handleMessage = () => {
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);

    if (buttonUrl) {
      window.open(buttonUrl, '_blank');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-10">
      <div
        className={`relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg backdrop-blur transition duration-700 sm:p-10 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>{textFields?.companyName || 'Atlas Teknoloji'}</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-400">{name}</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{note}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-sm text-slate-500">
            <p>{smallNote}</p>
            {creatorName && <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">Gönderen: {creatorName}</p>}
          </div>

          <div className="relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm text-slate-500">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Yeni rol</p>
              <p className="font-medium text-slate-900">{textFields?.newPosition || 'Operasyon Direktörü'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Başlangıç</p>
              <p className="font-medium text-slate-900">{textFields?.startDate || 'Hemen'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={handleMessage}
              className="group relative flex-1 overflow-hidden bg-slate-900 text-white shadow-sm transition hover:bg-slate-800"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v13H5.17L4 18.17V4Z" />
                  <path d="m10 11 2 2 4-4" />
                </svg>
                {buttonLabel}
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 transition group-hover:opacity-100" />
            </Button>

            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Profesyonel dayanışma</span>
          </div>
        </div>

        {showCheck && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400 bg-white text-emerald-500 shadow-lg">
              <svg className="h-10 w-10 animate-scale-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-scale-bounce {
          animation: scaleBounce 0.6s ease;
        }
        @keyframes scaleBounce {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

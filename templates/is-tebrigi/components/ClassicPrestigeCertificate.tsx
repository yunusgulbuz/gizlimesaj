'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';

interface ClassicPrestigeCertificateProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
}

const STAR_COLORS = ['#facc15', '#fbbf24', '#f59e0b'];

export default function ClassicPrestigeCertificate({
  recipientName,
  message,
  creatorName,
  textFields,
}: ClassicPrestigeCertificateProps) {
  const [animateFrame, setAnimateFrame] = useState(false);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateFrame(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 24 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.8 + Math.random() * 1.2,
        color: STAR_COLORS[id % STAR_COLORS.length],
      })),
    []
  );

  const name = recipientName || textFields?.recipientName || 'Sayın Profesyonel';
  const certificateTitle = textFields?.certificateTitle || 'Tebrikler! Yeni Görevinizde Başarılar';
  const certificateSubtitle = textFields?.certificateSubtitle || `${textFields?.newPosition || 'Bölüm Direktörü'} - ${textFields?.companyName || 'Atlas Teknoloji'}`;
  const dedication = textFields?.mainMessage || message || 'Yeni görevinizdeki liderliğiniz ve vizyonunuzla ilham vermeye devam edeceğinize inanıyoruz. Başarılarınız daim olsun!';
  const footerNote = textFields?.footerMessage || 'Takımınız ve yol arkadaşlarınız adına...';
  const buttonText = textFields?.downloadLabel || 'Tebrik Kartını İndir';

  const handleDownload = () => {
    setShowStars(true);
    setTimeout(() => setShowStars(false), 2600);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f1e5] px-6 py-12 text-slate-900">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#d6cec2 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {showStars && (
        <div className="pointer-events-none absolute inset-0 z-30">
          {stars.map(star => (
            <span
              key={star.id}
              className="absolute h-2 w-2 animate-star-fall rounded-full"
              style={{
                left: `${star.left}%`,
                backgroundColor: star.color,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className={`relative z-20 w-full max-w-3xl rounded-[2.5rem] border-8 border-[#ccb067] bg-gradient-to-b from-[#0f172a] via-[#111c34] to-[#152443] p-2 shadow-[0_25px_40px_rgba(17,28,52,0.25)] ${
        animateFrame ? 'animate-frame-glow' : 'opacity-0'
      }`}>
        <div className="rounded-[2rem] border-4 border-[#f1e4c8] bg-[#faf6ee] p-10 sm:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-3 text-[#c19a3f]">
              <span className="h-px w-8 bg-[#c19a3f]" />
              <span className="text-xs tracking-[0.6em] uppercase">Resmi Tebrik Sertifikası</span>
              <span className="h-px w-8 bg-[#c19a3f]" />
            </div>

            <h1 className="text-3xl font-bold text-[#14203b] sm:text-4xl">{certificateTitle}</h1>
            <p className="mt-3 text-lg italic text-[#c19a3f]">{name}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.4em] text-[#8b6f2f]">{certificateSubtitle}</p>

            <div className="mt-10 w-full max-w-2xl rounded-[1.5rem] border border-[#e4d9bf] bg-white/80 p-8 text-left shadow-inner">
              <p className="text-base leading-relaxed text-[#4b5563] sm:text-lg">{dedication}</p>
              <div className="mt-8 grid gap-2 text-sm text-[#8b6f2f] sm:grid-cols-3">
                <div className="rounded-xl border border-[#e6dcc5] bg-[#fdf8ec] px-4 py-3 text-center">
                  <p className="font-semibold text-[#c19a3f]">Vizyon</p>
                  <p className="text-xs text-[#7f6a3b]">Yeni ufuklar</p>
                </div>
                <div className="rounded-xl border border-[#e6dcc5] bg-[#fdf8ec] px-4 py-3 text-center">
                  <p className="font-semibold text-[#c19a3f]">Liderlik</p>
                  <p className="text-xs text-[#7f6a3b]">İlham dolu</p>
                </div>
                <div className="rounded-xl border border-[#e6dcc5] bg-[#fdf8ec] px-4 py-3 text-center">
                  <p className="font-semibold text-[#c19a3f]">Başarı</p>
                  <p className="text-xs text-[#7f6a3b]">Sürdürülebilir</p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.4em] text-[#8b6f2f]">{footerNote}</p>

            {creatorName && (
              <div className="mt-6 text-xs uppercase tracking-[0.5em] text-[#c19a3f]">
                Hazırlayan: {creatorName}
              </div>
            )}

            <div className="mt-10">
              <Button
                onClick={handleDownload}
                className="group relative overflow-hidden rounded-full border-2 border-[#c19a3f] bg-white px-8 py-6 text-sm font-semibold uppercase tracking-[0.4em] text-[#8b6f2f] transition"
              >
                <span className="relative z-10">{buttonText}</span>
                <span className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-[#facc15] via-[#fbbf24] to-[#c19a3f] transition group-hover:translate-y-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes frameGlow {
          0% {
            box-shadow: 0 0 0 rgba(193, 154, 63, 0.6);
            opacity: 0;
            transform: scale(0.96);
          }
          100% {
            box-shadow: 0 25px 40px rgba(17, 28, 52, 0.25), 0 0 35px rgba(193, 154, 63, 0.35);
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-frame-glow {
          animation: frameGlow 1s ease-out forwards;
        }
        @keyframes starFall {
          0% {
            transform: translateY(-120%) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) scale(1.1);
            opacity: 0;
          }
        }
        .animate-star-fall {
          animation-name: starFall;
          animation-timing-function: ease-in;
        }
      `}</style>
    </div>
  );
}

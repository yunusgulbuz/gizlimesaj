'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Heart, Music2, Crown } from 'lucide-react';
import type { TemplateTextFields } from '../../shared/types';

type DesignStyle = 'modern' | 'classic' | 'minimalist' | 'eglenceli';

interface CikmaTeklifiTemplateProps {
  recipientName: string;
  message: string;
  designStyle: DesignStyle;
  creatorName?: string;
  textFields?: TemplateTextFields;
}

interface BaseTemplateProps {
  recipientName: string;
  proposalQuestion: string;
  mainMessage: string;
  secondaryMessage?: string;
  creatorName?: string;
  musicUrl?: string;
}

export default function CikmaTeklifiTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields
}: CikmaTeklifiTemplateProps) {
  const fields = textFields || {};

  const resolvedRecipient = fields.recipientName || recipientName;
  const proposalQuestion = fields.proposalQuestion || 'Benimle çıkar mısın?';
  const mainMessage = fields.mainMessage || message;
  const secondaryMessage = fields.secondaryMessage;
  const musicUrl = fields.musicUrl;

  const baseProps: BaseTemplateProps = {
    recipientName: resolvedRecipient,
    proposalQuestion,
    mainMessage,
    secondaryMessage,
    creatorName,
    musicUrl,
  };

  switch (designStyle) {
    case 'modern':
      return <UltraModern3DScene {...baseProps} />;
    case 'classic':
      return <MasalsiBroadwayScene {...baseProps} />;
    case 'minimalist':
      return <MinimalistPuzzleScene {...baseProps} />;
    case 'eglenceli':
      return <GamifiedHeartsScene {...baseProps} />;
    default:
      return <UltraModern3DScene {...baseProps} />;
  }
}

function UltraModern3DScene({
  recipientName,
  proposalQuestion,
  mainMessage,
  secondaryMessage,
  creatorName,
}: BaseTemplateProps) {
  const [showFinalScene, setShowFinalScene] = useState(false);
  const [laserSweep, setLaserSweep] = useState(0);

  const hologramLetters = useMemo(() => proposalQuestion.split(''), [proposalQuestion]);
  const confettiPieces = useMemo(
    () => Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      delay: Math.random() * 1.2,
      color: ['#38bdf8', '#f43f5e', '#fde68a', '#a855f7'][i % 4],
    })),
    []
  );
  const buildings = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      id: i,
      height: Math.random() * 50 + 20,
      left: i * 6 + Math.random() * 4,
      glow: Math.random() > 0.5,
    })),
    []
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLaserSweep((prev) => (prev + 1) % 100);
    }, 120);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const handleAccept = () => {
    setShowFinalScene(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#08001f] via-[#030014] to-black" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(147, 197, 253, 0.2), transparent 35%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(244, 63, 94, 0.25), transparent 40%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 50%, rgba(236,72,153,0.08) 100%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#0f1729 0.8px, transparent 0.8px), linear-gradient(90deg, #0f1729 0.8px, transparent 0.8px)', backgroundSize: '80px 80px', mixBlendMode: 'overlay', opacity: 0.4 }} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ perspective: '600px' }}>
        <div className="absolute inset-x-0 bottom-0 h-32" style={{
          background: 'linear-gradient(to top, rgba(2,6,23,0.95), transparent)',
          backdropFilter: 'blur(6px)'
        }} />
        {buildings.map((building) => (
          <div
            key={building.id}
            className="absolute bottom-0 w-6 origin-bottom"
            style={{
              left: `${building.left}%`,
              height: `${building.height}%`,
              background: 'linear-gradient(to top, rgba(30,64,175,0.9), rgba(147,51,234,0.6))',
              boxShadow: building.glow ? '0 0 18px rgba(56,189,248,0.6)' : '0 0 8px rgba(30,64,175,0.3)',
            }}
          >
            <div className="absolute inset-x-1 bottom-2 h-3 bg-slate-200/80 blur-[1px]" />
          </div>
        ))}
        <div
          className="absolute inset-x-[10%] bottom-0 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent animate-[pulse_4s_ease-in-out_infinite]"
          style={{ left: `${laserSweep}%` }}
        />
        <div className="absolute inset-10 border border-white/5 rounded-[40px] backdrop-blur-xl" />
      </div>

      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl text-center">
          {creatorName && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-300/80">
              <Crown className="h-4 w-4 text-amber-400" />
              <span>Hazırlayan: {creatorName}</span>
            </div>
          )}
          <div className="mb-4 text-xs uppercase tracking-[0.6em] text-slate-400">
            Ultra Modern · 3D · Hologram
          </div>

          <div className="relative mx-auto inline-flex flex-wrap justify-center text-4xl font-bold leading-tight tracking-wide text-cyan-200 drop-shadow-[0_0_12px_rgba(8,145,178,0.8)] md:text-6xl">
            {hologramLetters.map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="animate-fade-up"
                style={{
                  animationDelay: `${index * 0.04}s`,
                  textShadow: '0 0 18px rgba(59,130,246,0.7)',
                  color: char.trim() ? undefined : 'transparent',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <div className="pointer-events-none absolute inset-0 animate-pulse rounded-3xl border border-cyan-400/20" />
          </div>

          <div className="mt-8 space-y-5 text-base text-slate-200 md:text-lg">
            {recipientName && (
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/70 md:text-xs">
                {recipientName} için özel fragman
              </p>
            )}
            <p className="mx-auto max-w-3xl text-balance text-slate-200/90">
              {mainMessage}
            </p>
            {secondaryMessage && (
              <p className="mx-auto max-w-2xl text-sm text-slate-400">
                {secondaryMessage}
              </p>
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={handleAccept}
              className="group relative overflow-hidden rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 px-10 py-6 text-lg font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="h-5 w-5 animate-spin-slow text-amber-200" />
                Evet, Başlayalım
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border border-slate-700/70 bg-transparent px-8 py-5 text-slate-200 transition-colors hover:border-slate-500/80 hover:bg-slate-900/50"
            >
              Fragmanı Tekrar İzle
            </Button>
          </div>
        </div>
      </div>

      {showFinalScene && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-80 w-80 md:h-[420px] md:w-[420px]">
            <div className="absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-fuchsia-500/20 via-cyan-400/30 to-rose-500/20 blur-3xl" />
            <div className="absolute inset-[12%] rounded-[40%] bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 shadow-[0_0_80px_rgba(248,113,113,0.6)]" style={{ transform: 'rotate(-8deg)' }} />
            <div className="absolute inset-[22%] animate-[pulse_4s_ease-in-out_infinite] rounded-full border border-white/30" style={{ filter: 'blur(2px)' }} />
            <div className="absolute inset-[30%] animate-ping rounded-full bg-white/40" />
          </div>
        </div>
      )}

      {showFinalScene && (
        <div className="pointer-events-none absolute inset-0">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute h-2 w-2 animate-confetti"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                animationDelay: `${piece.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translate3d(0, -20px, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate3d(20px, 120vh, 0) rotate(720deg); opacity: 0; }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          60% { opacity: 1; transform: translateY(0) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-up {
          animation: fade-up 0.7s ease forwards;
        }
        .animate-confetti {
          animation-duration: 4.5s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function MasalsiBroadwayScene({
  recipientName,
  proposalQuestion,
  mainMessage,
  secondaryMessage,
  creatorName,
}: BaseTemplateProps) {
  const [showMagic, setShowMagic] = useState(false);
  const sparkles = useMemo(
    () => Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      size: Math.random() * 5 + 2,
    })),
    []
  );

  useEffect(() => {
    if (showMagic) {
      const timer = window.setTimeout(() => setShowMagic(false), 5000);
      return () => window.clearTimeout(timer);
    }
  }, [showMagic]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff7f0] via-[#fde7ff] to-[#dbeafe] text-[#3f3d56]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'160\\' height=\\'160\\' viewBox=\\'0 0 160 160\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M80 0 L94 44 L140 44 L102 72 L116 116 L80 88 L44 116 L58 72 L20 44 L66 44 Z\\' fill=\\'%23f5d0fe33\\'/%3E%3C/svg%3E')] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white" />
      </div>

      <div className="absolute inset-y-0 left-0 w-40 -skew-x-[12deg] bg-gradient-to-br from-[#fef3c7] via-[#fef9c3] to-[#fbcfe8] shadow-2xl" />
      <div className="absolute inset-y-0 right-0 w-40 skew-x-[12deg] bg-gradient-to-br from-[#fbcfe8] via-[#fde68a] to-[#fef3c7] shadow-2xl" />

      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-gradient-to-tr from-amber-200 via-white to-pink-200 opacity-70 animate-twinkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl text-center">
          {creatorName && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-amber-600">
              <Wand2 className="h-5 w-5" />
              Hazırlayan: {creatorName}
            </div>
          )}

          <div className="mx-auto mb-10 max-w-3xl rounded-[40px] border-4 border-amber-200/60 bg-white/70 p-8 shadow-[0_20px_80px_rgba(251,191,36,0.25)] backdrop-blur-sm">
            <div className="mb-4 text-sm uppercase tracking-[0.4em] text-rose-500/80">
              Masalsı Sahne
            </div>
            <h1 className="font-serif text-4xl leading-tight text-rose-600 md:text-6xl">
              {proposalQuestion}
            </h1>
            {recipientName && (
              <p className="mt-3 font-sans text-lg text-rose-400">
                {recipientName} için özel perde açılıyor
              </p>
            )}
          </div>

          <p className="mx-auto max-w-2xl text-lg text-rose-700 md:text-xl">
            {mainMessage}
          </p>
          {secondaryMessage && (
            <p className="mt-4 font-serif text-lg italic text-amber-600">
              “{secondaryMessage}”
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => setShowMagic(true)}
              className="group rounded-full border border-amber-300 bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 px-10 py-5 text-lg font-semibold text-rose-700 shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition-transform duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 transition-transform group-hover:rotate-12" />
                Sihri Göster
              </span>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-rose-200 bg-white/70 px-8 py-4 text-rose-500 transition-colors hover:bg-rose-50"
            >
              Perdeyi Kapatma
            </Button>
          </div>
        </div>
      </div>

      {showMagic && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="relative">
            <div className="absolute inset-0 animate-[twinkle_3s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-200 opacity-60 blur-3xl" />
            <div className="relative flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white/70 shadow-2xl">
                <div className="absolute inset-4 rounded-full border-2 border-amber-200/70" />
                <div className="text-5xl animate-bounce">🧚‍♀️</div>
              </div>
              <div className="mt-6 w-full rounded-3xl bg-white/80 p-6 shadow-lg">
                <p className="font-serif text-lg text-rose-500">
                  Küçük peri sihirli çubuğunu salladı ve “Evet” kelimesini kalbe dönüştürdü!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

interface PuzzlePiece {
  id: number;
  text: string;
  placed: boolean;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

function MinimalistPuzzleScene({
  recipientName,
  proposalQuestion,
  mainMessage,
  secondaryMessage,
  creatorName,
}: BaseTemplateProps) {
  const [started, setStarted] = useState(false);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    const words = proposalQuestion.trim().split(/\s+/);
    const chunkSize = Math.max(1, Math.ceil(words.length / 3));
    const chunked: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunked.push(words.slice(i, i + chunkSize).join(' '));
    }
    while (chunked.length < 3) {
      chunked.push('');
    }
    setPieces(
      chunked.slice(0, 3).map((text, index) => ({
        id: index,
        text,
        placed: false,
        rotation: (Math.random() - 0.5) * 12,
        offsetX: (Math.random() - 0.5) * 120,
        offsetY: (Math.random() - 0.5) * 60,
      }))
    );
    setStarted(false);
    setIsCelebrating(false);
  }, [proposalQuestion]);

  const unplacedPieces = pieces.filter((piece) => !piece.placed);
  const puzzleCompleted = pieces.length > 0 && pieces.every((piece) => piece.placed);

  useEffect(() => {
    if (puzzleCompleted) {
      setIsCelebrating(true);
      const timer = window.setTimeout(() => setIsCelebrating(false), 4000);
      return () => window.clearTimeout(timer);
    }
  }, [puzzleCompleted]);

  const handlePieceClick = (id: number) => {
    setPieces((prev) => prev.map((piece) => (piece.id === id ? { ...piece, placed: true } : piece)));
  };

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 py-20">
        {creatorName && (
          <div className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Hazırlayan: {creatorName}
          </div>
        )}

        <div className="text-center">
          <h1 className="text-sm uppercase tracking-[0.5em] text-slate-400">Minimal Puzzle</h1>
          <p className="mt-3 text-lg text-slate-500">
            {recipientName ? `${recipientName} için interaktif teklif` : 'Senin için özel hazırlanmış minimal teklif'}
          </p>
        </div>

        <div className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white/80 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {pieces.map((piece) => (
                <div
                  key={piece.id}
                  className={`relative flex h-28 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all duration-500 ${piece.placed ? 'border-teal-300 bg-gradient-to-br from-teal-50 via-white to-cyan-50' : ''}`}
                >
                  <span className={`text-center text-lg font-medium transition-all duration-500 ${piece.placed ? 'text-slate-800' : 'text-slate-300 blur-[1px]'}`}>
                    {piece.text}
                  </span>
                  {piece.placed && (
                    <span className="absolute -top-2 right-3 text-lg">🧩</span>
                  )}
                </div>
              ))}
            </div>

            <div className="relative mt-10 h-48 overflow-hidden rounded-3xl bg-slate-100/90">
              {unplacedPieces.map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  className="absolute flex min-w-[160px] max-w-[200px] cursor-pointer select-none items-center justify-center rounded-3xl bg-white px-6 py-4 text-base font-medium text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-all duration-500 hover:-translate-y-2 hover:bg-teal-50"
                  style={{
                    left: `calc(50% + ${piece.offsetX}px)`,
                    top: `calc(50% + ${piece.offsetY}px)`,
                    transform: 'translate(-50%, -50%)',
                    rotate: `${piece.rotation}deg`,
                  }}
                >
                  {piece.text}
                </button>
              ))}

              {!started && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 text-center">
                  <p className="max-w-xs text-base text-slate-500">
                    Puzzle parçalarını tamamlamak için aşağıdaki butona tıklayın.
                  </p>
                  <Button
                    onClick={handleStart}
                    className="rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-5 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:from-slate-700 hover:to-slate-900"
                  >
                    Puzzle&apos;ı Tamamla
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4 text-center text-slate-600">
              <p className="text-lg text-slate-500">{mainMessage}</p>
              {secondaryMessage && (
                <p className="text-sm italic text-slate-400">{secondaryMessage}</p>
              )}
            </div>

            {puzzleCompleted && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(45,212,191,0.4)] transition hover:brightness-110"
                >
                  Evet!
                </Button>
                <p className="text-sm uppercase tracking-[0.4em] text-teal-400">
                  Puzzle tamamlandı · Sevgi kazandı
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-slate-400">
          Puzzle parçalarına dokunarak soruyu tamamla ve sürprizi açığa çıkar.
        </div>
      </div>

      {isCelebrating && (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-confetti-minimal rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                backgroundColor: ['#fca5a5', '#fcd34d', '#bfdbfe', '#6ee7b7'][i % 4],
                animationDelay: `${Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-minimal {
          0% { transform: translate3d(0, -10px, 0); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translate3d(10px, 60vh, 0); opacity: 0; }
        }
        .animate-confetti-minimal {
          animation: confetti-minimal 3s ease-in infinite;
        }
      `}</style>
    </div>
  );
}

function GamifiedHeartsScene({
  recipientName,
  proposalQuestion,
  mainMessage,
  secondaryMessage,
  creatorName,
  musicUrl,
}: BaseTemplateProps) {
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [noButtonSize, setNoButtonSize] = useState(1);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 65, y: 70 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hearts = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 90,
      y: Math.random() * 70,
      size: Math.random() * 16 + 12,
      delay: Math.random() * 5,
      speed: Math.random() * 12 + 10,
    })),
    []
  );

  const balloons = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 80,
      delay: Math.random() * 4,
      color: ['#f43f5e', '#fb7185', '#f97316', '#facc15'][i % 4],
    })),
    []
  );

  const moveNoButton = () => {
    setNoButtonSize((prev) => Math.max(0.6, prev - 0.07));
    setNoButtonPosition({
      x: Math.random() * 60 + 20,
      y: Math.random() * 40 + 50,
    });
  };

  const handleHeartCatch = () => {
    setScore((prev) => Math.min(prev + 1, 99));
  };

  const handleAccept = () => {
    setShowCelebration(true);
    try {
      audioRef.current?.play();
    } catch {
      /* ignore autoplay issues */
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#ff6781] via-[#ff8f66] to-[#ffd166] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'160\\' height=\\'160\\' viewBox=\\'0 0 160 160\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'80\\' cy=\\'80\\' r=\\'75\\' fill=\\'%23ffcfd6\\' fill-opacity=\\'0.15\\'/%3E%3C/svg%3E')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/10 to-rose-500/30" />
      </div>

      <div className="absolute inset-0">
        {hearts.map((heart) => (
          <button
            key={heart.id}
            onClick={handleHeartCatch}
            className="group absolute flex items-center justify-center rounded-full text-white shadow-[0_10px_30px_rgba(244,63,94,0.45)]"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              animation: `float ${heart.speed}s ease-in-out ${heart.delay}s infinite`,
              background: 'radial-gradient(circle at 30% 30%, #fff8f0, #f43f5e)',
            }}
          >
            <span className="text-xs drop-shadow-lg">❤️</span>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-64">
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff4d6d] via-transparent to-transparent" />
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className="absolute bottom-[-160px] h-40 w-28 animate-balloon"
            style={{
              left: `${balloon.left}%`,
              animationDelay: `${balloon.delay}s`,
            }}
          >
            <div
              className="mx-auto h-32 w-24 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 20%, #fff7f0, ${balloon.color})`,
                boxShadow: `0 10px 30px ${balloon.color}55`,
              }}
            />
            <div className="mx-auto h-8 w-[2px] bg-white/70" />
          </div>
        ))}
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        {creatorName && (
          <div className="flex items-center justify-center gap-2 rounded-full bg-white/20 px-6 py-2 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-200" />
            Hazırlayan: {creatorName}
          </div>
        )}

        <div className="rounded-3xl bg-white/25 p-6 text-sm uppercase tracking-[0.5em] text-white/70 backdrop-blur-xl">
          Eğlenceli Oyunlaştırma
        </div>

        <div className="relative inline-block max-w-3xl rounded-[40px] bg-white/20 p-8 shadow-[0_20px_80px_rgba(244,63,94,0.45)] backdrop-blur-xl">
          <div className="absolute -top-5 -left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/30 text-2xl">🎈</div>
          <div className="absolute -bottom-6 -right-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/30 text-2xl">🎉</div>
          <h1 className="font-bold text-4xl text-white drop-shadow-[0_4px_20px_rgba(244,63,94,0.45)] md:text-5xl">
            {proposalQuestion}
          </h1>
          {recipientName && (
            <p className="mt-3 text-lg text-white/80">Hey {recipientName}, oyuna hazır mısın?</p>
          )}
        </div>

        <p className="max-w-2xl text-lg text-white/90">
          {mainMessage}
        </p>
        {secondaryMessage && (
          <p className="text-base italic text-white/80">{secondaryMessage}</p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button
            onClick={handleAccept}
            className="rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-12 py-5 text-lg font-semibold text-white shadow-[0_20px_60px_rgba(244,63,94,0.45)] transition-transform duration-300 hover:scale-110"
          >
            <span className="flex items-center gap-3">
              <Heart className="h-5 w-5" /> Evet
            </span>
          </Button>
          <Button
            variant="secondary"
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            className="absolute"
            style={{
              left: `${noButtonPosition.x}%`,
              top: `${noButtonPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${noButtonSize})`,
            }}
          >
            Hayır 🙈
          </Button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
          <div className="rounded-2xl bg-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] backdrop-blur">
            Kalp Yakala · Skor: {score}
          </div>
          <div className="rounded-2xl bg-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] backdrop-blur">
            10 Puan = Özel Mesaj
          </div>
        </div>

        {score >= 10 && (
          <div className="rounded-3xl bg-white/25 p-6 text-lg text-white shadow-[0_12px_50px_rgba(244,114,182,0.35)] backdrop-blur">
            Tebrikler! Küçük kalplerin hepsini yakaladın. Bu aşk oyununda kazanan belli: Sizsiniz! 💖
          </div>
        )}

        {musicUrl && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/20 px-6 py-3 text-left text-sm text-white/80 backdrop-blur">
            <Music2 className="h-5 w-5" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em]">Arka Plan Müziği</p>
              <audio ref={audioRef} src={musicUrl} controls className="mt-1 w-56" preload="none" />
            </div>
          </div>
        )}
      </div>

      {showCelebration && (
        <div className="pointer-events-none absolute inset-0">
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-[pulse_2.5s_ease-in-out_infinite] rounded-full bg-white/30 blur-3xl" />
              <div className="relative flex h-48 w-48 items-center justify-center rounded-[48%] bg-gradient-to-br from-rose-500 to-pink-400 text-6xl shadow-[0_20px_80px_rgba(244,63,94,0.6)]">
                ❤️
              </div>
            </div>
          </div>
          {Array.from({ length: 160 }, (_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-celebrate rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#fff', '#fde68a', '#fca5a5', '#f472b6'][i % 4],
                animationDelay: `${Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        @keyframes celebrate {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(0, 120vh, 0) rotate(540deg); opacity: 0; }
        }
        .animate-celebrate {
          animation: celebrate 5s linear infinite;
        }
        .animate-balloon {
          animation: balloon 12s ease-in-out infinite;
        }
        @keyframes balloon {
          0% { transform: translateY(0); }
          50% { transform: translateY(-60px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

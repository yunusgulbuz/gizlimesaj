'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface HeartAdventureInteractiveProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  shortId?: string;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface FloatingHeart {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
}

const DEFAULT_RECIPIENT = 'Kalbimin Sahibi';
const HEART_COUNT = 10;
const CONFETTI_COLORS = ['#f9739b', '#facc15', '#c084fc', '#38bdf8', '#fb7185'];

const generateHearts = (): FloatingHeart[] =>
  Array.from({ length: HEART_COUNT }, (_, index) => ({
    id: index + 1,
    left: Math.random() * 70 + 15,
    top: Math.random() * 55 + 10,
    delay: Math.random() * 2,
    duration: 6 + Math.random() * 4,
    size: Math.random() * 28 + 48,
  }));

export default function HeartAdventureInteractive({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: HeartAdventureInteractiveProps) {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [collected, setCollected] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [localRecipient, setLocalRecipient] = useState(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
  const [localIntro, setLocalIntro] = useState(textFields?.gameIntro || 'Beni Bulabilir misin?');
  const [localSuccess, setLocalSuccess] = useState(textFields?.gameWinMessage || message || 'Seni Seviyorum');
  const [localButton, setLocalButton] = useState(textFields?.gameButtonText || 'Kalp Avını Başlat ❤️');
  const [localHelper, setLocalHelper] = useState(textFields?.gameHelper || 'Uçuşan kalpleri yakala, sonuncu seni bekliyor!');

  useEffect(() => {
    setLocalRecipient(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
    setLocalIntro(textFields?.gameIntro || 'Beni Bulabilir misin?');
    setLocalSuccess(textFields?.gameWinMessage || message || 'Seni Seviyorum');
    setLocalButton(textFields?.gameButtonText || 'Kalp Avını Başlat ❤️');
    setLocalHelper(textFields?.gameHelper || 'Uçuşan kalpleri yakala, sonuncu seni bekliyor!');
  }, [recipientName, message, textFields]);

  const displayRecipient = isEditable
    ? localRecipient
    : textFields?.recipientName || localRecipient || recipientName || DEFAULT_RECIPIENT;
  const introMessage = isEditable ? localIntro : (textFields?.gameIntro || localIntro);
  const successMessage = isEditable ? localSuccess : (textFields?.gameWinMessage || localSuccess);
  const buttonLabel = isEditable ? localButton : (textFields?.gameButtonText || localButton);
  const helperMessage = isEditable ? localHelper : (textFields?.gameHelper || localHelper);

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setCollected([]);
    setConfettiPieces([]);
    setHearts(generateHearts());
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameFinished(false);
    setCollected([]);
    setConfettiPieces([]);
    setHearts([]);
  };

  const handleHeartClick = (id: number) => {
    if (isEditable || !gameStarted || collected.includes(id)) return;

    setCollected((prev) => [...prev, id]);
    const remaining = hearts.filter((heart) => heart.id !== id);
    setHearts(remaining);

    if (remaining.length === 0) {
      setGameFinished(true);
      setConfettiPieces(
        Array.from({ length: 80 }, (_, index) => ({
          id: index,
          left: Math.random() * 100,
          duration: 3 + Math.random() * 2,
          delay: Math.random() * 0.4,
          color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        }))
      );
    }
  };

  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipient(value);
    if (key === 'gameIntro') setLocalIntro(value);
    if (key === 'gameWinMessage') setLocalSuccess(value);
    if (key === 'gameButtonText') setLocalButton(value);
    if (key === 'gameHelper') setLocalHelper(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const handleGameButtonClick = () => {
    if (isEditable) return;
    if (gameFinished) {
      resetGame();
      window.setTimeout(() => {
        startGame();
      }, 150);
      return;
    }

    if (gameStarted) {
      resetGame();
    } else {
      startGame();
    }
  };

  const displayCreator = (creatorName && creatorName.trim()) ? creatorName : 'Gizli Mesaj';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#ffdee9] via-[#ffe9f3] to-[#fff9fd] text-[#3f2350]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8), transparent 55%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 75% 65%, rgba(255,210,230,0.6), transparent 60%)' }} />

      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#fdf6ff] via-[#ffe8f4] to-transparent opacity-70" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center space-y-10">
        <div className="space-y-4 max-w-xl">
          <p
            className={`uppercase tracking-[0.45em] text-xs text-[#b78bc7] ${
              isEditable ? 'hover:bg-white/50 cursor-text rounded-lg px-3 py-1 transition-colors inline-block' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent?.trim() || '')}
          >
            {displayRecipient}
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#caa4d9]">
            Hazırlayan: {displayCreator}
          </p>

          <h1
            className={`text-4xl font-bold text-[#8c3fa9] drop-shadow-sm ${
              isEditable ? 'hover:bg-white/50 cursor-text rounded-lg px-4 py-2 transition-colors' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('gameIntro', event.currentTarget.textContent || '')}
          >
            {introMessage}
          </h1>

          <p
            className={`text-base sm:text-lg text-[#6d4a8f] ${isEditable ? 'hover:bg-white/50 cursor-text rounded-lg px-3 py-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('gameHelper', event.currentTarget.textContent || '')}
          >
            {helperMessage}
          </p>
        </div>

        <div className="relative h-[400px] w-full max-w-3xl rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_25px_60px_rgba(150,90,180,0.18)] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -left-12 top-12 h-32 w-32 rounded-full bg-gradient-to-tr from-[#fda4af] via-[#fb7185] to-[#f43f5e] blur-2xl opacity-30" />
            <div className="absolute -right-10 bottom-12 h-40 w-40 rounded-full bg-gradient-to-tr from-[#bfdbfe] via-[#93c5fd] to-[#818cf8] blur-3xl opacity-30" />
          </div>

          {gameStarted && hearts.map((heart) => (
            <button
              key={heart.id}
              type="button"
              onClick={() => handleHeartClick(heart.id)}
              className={`absolute flex items-center justify-center text-4xl transition-transform ${
                collected.includes(heart.id) ? 'scale-0 opacity-0' : 'hover:scale-125'
              }`}
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                animation: `floatHeart ${heart.duration}s ease-in-out infinite`,
                animationDelay: `${heart.delay}s`,
                fontSize: `${heart.size}px`,
              }}
            >
              <span role="img" aria-label="kalp" className="drop-shadow-[0_10px_20px_rgba(248,113,113,0.4)]">
                💖
              </span>
            </button>
          ))}

          {gameFinished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#fb7185] via-[#f472b6] to-[#c084fc] shadow-[0_20px_40px_rgba(244,114,182,0.4)] animate-pulse" />
                <span className="absolute inset-0 flex items-center justify-center text-6xl">❤️</span>
              </div>

              <div
                className={`text-4xl font-semibold text-[#8c3fa9] drop-shadow-sm ${
                  isEditable ? 'hover:bg-white/60 cursor-text rounded-lg px-4 py-2 transition-colors' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('gameWinMessage', event.currentTarget.textContent || '')}
              >
                {successMessage}
              </div>
            </div>
          )}

          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-6 rounded-sm"
              style={{
                left: `${piece.left}%`,
                top: '-10%',
                backgroundColor: piece.color,
                animation: `confettiFall ${piece.duration}s ease-in-out forwards`,
                animationDelay: `${piece.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleGameButtonClick}
              className={`rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition ${
                gameFinished
                  ? 'bg-[#22c55e] hover:bg-[#16a34a]'
                  : gameStarted
                    ? 'bg-[#a855f7] hover:bg-[#9333ea]'
                    : 'bg-[#f43f5e] hover:bg-[#e11d48]'
              } ${isEditable ? 'opacity-80' : ''}`}
              variant="default"
            >
              <span
                className={isEditable ? 'hover:bg-white/60 cursor-text rounded-lg px-3 py-1 transition-colors' : ''}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('gameButtonText', event.currentTarget.textContent || '')}
              >
                {buttonLabel}
              </span>
            </Button>

            {!isEditable && (
              <p className="text-xs uppercase tracking-[0.3em] text-[#a979bf]">
                {gameFinished ? 'Kalp avı tamamlandı' : gameStarted ? 'Kalpler seni bekliyor' : 'Hazırsan oyunu başlat'}
              </p>
            )}
          </div>

          {gameStarted && !isEditable && (
            <span className="self-center text-sm text-[#8c3fa9]/70">
              {collected.length}/{HEART_COUNT} kalp
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatHeart {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes confettiFall {
          0% { transform: translate3d(0, -10%, 0) rotateZ(0deg); opacity: 1; }
          50% { transform: translate3d(10px, 50vh, 0) rotateZ(180deg); opacity: 0.9; }
          100% { transform: translate3d(-10px, 110vh, 0) rotateZ(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

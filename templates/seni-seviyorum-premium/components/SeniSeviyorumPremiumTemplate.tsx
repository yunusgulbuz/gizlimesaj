'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

type DesignStyle = 'modern' | 'classic' | 'minimalist' | 'eglenceli';

interface SeniSeviyorumPremiumTemplateProps {
  recipientName: string;
  message: string;
  designStyle: DesignStyle;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface AmbientHeart {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
}

interface Petal {
  id: number;
  left: number;
  duration: number;
  delay: number;
}

interface BurstHeart {
  id: number;
  x: number;
  y: number;
  color: string;
  scale: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

function createSeededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export default function SeniSeviyorumPremiumTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields = {},
  isEditable = false,
  onTextFieldChange
}: SeniSeviyorumPremiumTemplateProps) {
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localMainMessage, setLocalMainMessage] = useState(message);
  const [localSecondaryMessage, setLocalSecondaryMessage] = useState('');
  const [localButtonLabel, setLocalButtonLabel] = useState('Seni Okuyorum ❤️');
  const [localPlayfulButtonLabel, setLocalPlayfulButtonLabel] = useState('Kalbimi Kabul Et 💘');
  const [localMainTitle, setLocalMainTitle] = useState('Seni Seviyorum');
  const [localClassicSignature, setLocalClassicSignature] = useState('Daima Aşk ile');
  const [localMinimalistTagline, setLocalMinimalistTagline] = useState('Sadece Sen ve Ben');
  const [modernGlowActive, setModernGlowActive] = useState(false);

  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstHeartIdRef = useRef(0);
  const confettiIdRef = useRef(0);
  const modernGlowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseSeed = useMemo(() => {
    const tfRecipient = textFields['recipientName'] || '';
    const tfMainMessage = textFields['mainMessage'] || '';
    const tfMainTitle = textFields['mainTitle'] || '';

    const effectiveRecipient = isEditable ? localRecipientName : (tfRecipient || recipientName);
    const effectiveMessage = isEditable ? localMainMessage : (tfMainMessage || message);
    const effectiveTitle = isEditable ? localMainTitle : (tfMainTitle || 'Seni Seviyorum');

    return `${designStyle}-${effectiveRecipient}-${effectiveMessage}-${effectiveTitle}-${creatorName ?? ''}`;
  }, [
    designStyle,
    recipientName,
    message,
    creatorName,
    isEditable,
    localRecipientName,
    localMainMessage,
    localMainTitle,
    textFields,
  ]);

  useEffect(() => {
    setLocalRecipientName(textFields.recipientName || recipientName);
    setLocalMainMessage(textFields.mainMessage || message);
    setLocalSecondaryMessage(textFields.secondaryMessage || 'Kalbimin her ritmindesin.');
    setLocalButtonLabel(textFields.buttonLabel || 'Seni Okuyorum ❤️');
    setLocalPlayfulButtonLabel(textFields.playfulButtonLabel || 'Kalbimi Kabul Et 💘');
    setLocalMainTitle(textFields.mainTitle || 'Seni Seviyorum');
    setLocalClassicSignature(textFields.classicSignature || 'Daima Aşk ile');
    setLocalMinimalistTagline(textFields.minimalistTagline || 'Sadece Sen ve Ben');
  }, [recipientName, message, textFields]);

  useEffect(() => {
    if (designStyle !== 'eglenceli') {
      setBurstHearts([]);
      setConfettiPieces([]);
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = null;
      }
    }
  }, [designStyle]);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
      if (modernGlowTimeoutRef.current) {
        clearTimeout(modernGlowTimeoutRef.current);
      }
    };
  }, []);

  const ambientHearts = useMemo<AmbientHeart[]>(() => {
    const rand = createSeededRandom(`${baseSeed}-ambient`);
    return Array.from({ length: 18 }, (_, index) => ({
      id: index,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 1.5,
      opacity: 0.15 + rand() * 0.25,
      delay: rand() * 6
    }));
  }, [baseSeed]);

  const classicPetals = useMemo<Petal[]>(() => {
    const rand = createSeededRandom(`${baseSeed}-petals`);
    return Array.from({ length: 10 }, (_, index) => ({
      id: index,
      left: rand() * 90 + 5,
      duration: 10 + rand() * 6,
      delay: rand() * 4
    }));
  }, [baseSeed]);

  const playfulFloatingHearts = useMemo<AmbientHeart[]>(() => {
    const rand = createSeededRandom(`${baseSeed}-playful`);
    return Array.from({ length: 22 }, (_, index) => ({
      id: index,
      left: rand() * 100,
      top: rand() * 100,
      size: 0.8 + rand() * 1.6,
      opacity: 0.25 + rand() * 0.35,
      delay: rand() * 4
    }));
  }, [baseSeed]);

  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    if (key === 'mainMessage') setLocalMainMessage(value);
    if (key === 'secondaryMessage') setLocalSecondaryMessage(value);
    if (key === 'buttonLabel') setLocalButtonLabel(value);
    if (key === 'playfulButtonLabel') setLocalPlayfulButtonLabel(value);
    if (key === 'mainTitle') setLocalMainTitle(value);
    if (key === 'classicSignature') setLocalClassicSignature(value);
    if (key === 'minimalistTagline') setLocalMinimalistTagline(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const displayRecipientName = isEditable ? localRecipientName : (textFields.recipientName || recipientName);
  const displayMainMessage = isEditable ? localMainMessage : (textFields.mainMessage || message);
  const displaySecondaryMessage = isEditable ? localSecondaryMessage : (textFields.secondaryMessage || 'Kalbimin her ritmindesin.');
  const displayButtonLabel = isEditable ? localButtonLabel : (textFields.buttonLabel || 'Seni Okuyorum ❤️');
  const displayPlayfulButtonLabel = isEditable ? localPlayfulButtonLabel : (textFields.playfulButtonLabel || 'Kalbimi Kabul Et 💘');
  const displayMainTitle = isEditable ? localMainTitle : (textFields.mainTitle || 'Seni Seviyorum');
  const displayClassicSignature = isEditable ? localClassicSignature : (textFields.classicSignature || 'Daima Aşk ile');
  const displayMinimalistTagline = isEditable ? localMinimalistTagline : (textFields.minimalistTagline || 'Sadece Sen ve Ben');

  const playfulColors = ['#ff6bcb', '#ff9f1c', '#2ec4b6', '#cbf3f0', '#9b5de5', '#f15bb5'];

  const handleModernButtonClick = () => {
    if (designStyle !== 'modern' || isEditable) return;

    setModernGlowActive(true);

    if (modernGlowTimeoutRef.current) {
      clearTimeout(modernGlowTimeoutRef.current);
    }

    modernGlowTimeoutRef.current = setTimeout(() => {
      setModernGlowActive(false);
    }, 1400);
  };

  const handlePlayfulTap = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (designStyle !== 'eglenceli') return;

    const isTouchEvent = 'touches' in event;
    const point = isTouchEvent ? event.touches[0] : (event as React.MouseEvent).nativeEvent;
    const target = event.currentTarget;
    const targetRect = target.getBoundingClientRect();

    const relativeX = ((point.clientX - targetRect.left) / targetRect.width) * 100;
    const relativeY = ((point.clientY - targetRect.top) / targetRect.height) * 100;

    const newHearts = Array.from({ length: 6 }, () => {
      const id = burstHeartIdRef.current++;
      return {
        id,
        x: relativeX + (Math.random() * 14 - 7),
        y: relativeY + (Math.random() * 16 - 8),
        color: playfulColors[Math.floor(Math.random() * playfulColors.length)],
        scale: 0.7 + Math.random() * 1.4
      };
    });

    setBurstHearts((previous) => {
      const merged = [...previous, ...newHearts];
      return merged.slice(-40);
    });
  };

  const handlePlayfulCelebrate = () => {
    if (designStyle !== 'eglenceli') return;

    const newConfetti = Array.from({ length: 80 }, () => {
      const id = confettiIdRef.current++;
      return {
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: playfulColors[Math.floor(Math.random() * playfulColors.length)],
        size: 6 + Math.random() * 10,
        duration: 2.5 + Math.random() * 1.5,
        delay: Math.random() * 0.4
      };
    });

    setConfettiPieces(newConfetti);

    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }

    confettiTimeoutRef.current = setTimeout(() => {
      setConfettiPieces([]);
    }, 3200);
  };

  const renderCreatorBadge = () => {
    if (!creatorName) return null;
    return (
      <div className="text-xs uppercase tracking-[0.3em] text-gray-500/80 mb-4">
        Hazırlayan: {creatorName}
      </div>
    );
  };

  let layout: JSX.Element | null = null;

  if (designStyle === 'modern') {
    layout = (
      <div className="premium-modern-root relative min-h-screen bg-gradient-to-br from-[#ffd9e8] via-[#fff3f7] to-[#fffaf2] text-gray-800 overflow-hidden flex flex-col">
        <div className="absolute inset-0 pointer-events-none">
          <div className="premium-modern-line top-[-160px] left-1/2 -translate-x-1/2" />
          <div className="premium-modern-line top-[220px] left-[-40%] rotate-180" />

          {ambientHearts.map((heart) => (
            <div
              key={heart.id}
              className="premium-modern-heart"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                opacity: heart.opacity,
                animationDelay: `${heart.delay}s`,
                transform: `scale(${heart.size})`
              }}
            >
              ❤
            </div>
          ))}
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-5 py-12 gap-8">
          <div className="w-full flex justify-center">{renderCreatorBadge()}</div>

          <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
            <div className="w-full max-w-sm text-center space-y-4">
              <h1
                className={`text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 relative inline-block premium-modern-heading ${isEditable ? 'cursor-text' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('mainTitle', event.currentTarget.textContent || '')}
              >
                {displayMainTitle}
                <span className="premium-modern-heading__shine" aria-hidden />
              </h1>

              <p
                className={`text-sm uppercase tracking-[0.4em] text-gray-500 ${isEditable ? 'cursor-text rounded-lg px-3 py-1 hover:bg-white/40 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent || '')}
              >
                {displayRecipientName || 'Kalbimin Sahibi'}
              </p>

              <div
                className={`mx-auto w-[85%] sm:w-[80%] rounded-3xl bg-white/70 backdrop-blur-lg px-5 py-6 shadow-xl border border-white/60 ${isEditable ? 'cursor-text hover:bg-white/80 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('mainMessage', event.currentTarget.textContent || '')}
              >
                <p className="text-base sm:text-lg leading-relaxed">
                  {displayMainMessage}
                </p>
              </div>

              <p
                className={`text-sm text-gray-600 tracking-wide ${isEditable ? 'cursor-text rounded-md px-3 py-2 hover:bg-white/50 transition-colors inline-block' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('secondaryMessage', event.currentTarget.textContent || '')}
              >
                {displaySecondaryMessage}
              </p>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="button"
              className={`premium-modern-button ${modernGlowActive ? 'premium-modern-button--active' : ''}`}
              onClick={handleModernButtonClick}
            >
              <span
                className={isEditable ? 'cursor-text' : ''}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('buttonLabel', event.currentTarget.textContent || '')}
              >
                {displayButtonLabel}
              </span>
              <span className="premium-modern-button__sheen" aria-hidden />
              {modernGlowActive && <span className="premium-modern-button__flare" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (designStyle === 'classic') {
    layout = (
      <div className="premium-classic-root relative min-h-screen bg-[#f9ede1] flex items-center justify-center px-5 py-12 overflow-hidden premium-classic-texture">
        <div className="absolute inset-0 pointer-events-none">
          {classicPetals.map((petal) => (
            <div
              key={petal.id}
              className="premium-classic-petal"
              style={{
                left: `${petal.left}%`,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`
              }}
            >
              ❀
            </div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="premium-classic-frame">
            {renderCreatorBadge()}

            <div className="premium-classic-corner premium-classic-corner--tl" />
            <div className="premium-classic-corner premium-classic-corner--tr" />
            <div className="premium-classic-corner premium-classic-corner--bl" />
            <div className="premium-classic-corner premium-classic-corner--br" />

            <div className="space-y-6 text-center">
              <div className="premium-classic-wreath" aria-hidden>
                <span>✦</span>
              </div>

              <h1
                className={`text-5xl sm:text-6xl text-[#b86b45] font-semibold premium-classic-script ${isEditable ? 'cursor-text' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('mainTitle', event.currentTarget.textContent || '')}
              >
                {displayMainTitle}
              </h1>

              <p
                className={`text-sm uppercase tracking-[0.35em] text-[#8a5a40]/70 ${isEditable ? 'cursor-text inline-block rounded-md px-3 py-1 hover:bg-[#f8eadf] transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent || '')}
              >
                {displayRecipientName || 'Beklenen Kalp'}
              </p>

              <p
                className={`text-base text-[#a46b54] italic tracking-wide ${isEditable ? 'cursor-text inline-block rounded-md px-3 py-2 hover:bg-[#f8eadf] transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('secondaryMessage', event.currentTarget.textContent || '')}
              >
                {displaySecondaryMessage}
              </p>

              <div
                className={`bg-[#fff8f1]/90 border border-[#f0d9c6] rounded-[32px] px-6 py-8 shadow-lg premium-classic-letter ${isEditable ? 'cursor-text hover:bg-[#fff2e3] transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('mainMessage', event.currentTarget.textContent || '')}
              >
                <p className="text-base leading-relaxed text-[#7a4a33]">
                  {displayMainMessage}
                </p>
              </div>

              <div className="premium-classic-divider" />

              <p
                className={`text-sm font-medium text-[#a46b54]/90 tracking-[0.2em] ${isEditable ? 'cursor-text inline-block rounded-md px-3 py-1 hover:bg-[#f8eadf] transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('classicSignature', event.currentTarget.textContent || '')}
              >
                {displayClassicSignature}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (designStyle === 'minimalist') {
    layout = (
      <div className="premium-minimal-root min-h-screen bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center space-y-8">
          {renderCreatorBadge()}

          <div className="space-y-5">
            <h1
              className={`text-4xl sm:text-5xl font-light tracking-tight text-gray-900 animate-in fade-in ${isEditable ? 'cursor-text' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('mainTitle', event.currentTarget.textContent || '')}
            >
              {displayMainTitle}
            </h1>

            <p
              className={`text-sm uppercase tracking-[0.35em] text-gray-500 ${isEditable ? 'cursor-text rounded-md px-3 py-1 hover:bg-gray-100 transition-colors inline-block' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent || '')}
            >
              {displayRecipientName || 'Kalbimin Sesi'}
            </p>
          </div>

          <p
            className={`text-base sm:text-lg leading-relaxed text-gray-700 ${isEditable ? 'cursor-text rounded-xl px-5 py-6 bg-gray-50 hover:bg-gray-100 transition-colors block' : 'px-5'}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('mainMessage', event.currentTarget.textContent || '')}
          >
            {displayMainMessage}
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="premium-minimal-heart" aria-hidden>
              <span />
            </div>
            <p
              className={`text-xs uppercase tracking-[0.6em] text-gray-400 ${isEditable ? 'cursor-text inline-block rounded-md px-3 py-1 hover:bg-gray-100 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('minimalistTagline', event.currentTarget.textContent || '')}
            >
              {displayMinimalistTagline}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (designStyle === 'eglenceli') {
    layout = (
      <div
        className="premium-playful-root relative min-h-screen bg-gradient-to-br from-[#ff9a9e] via-[#fad0c4] to-[#fad0c4] flex flex-col justify-between overflow-hidden"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('button')) return;
          handlePlayfulTap(event);
        }}
        onTouchStart={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('button')) return;
          handlePlayfulTap(event);
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {playfulFloatingHearts.map((heart) => (
            <div
              key={heart.id}
              className="premium-playful-heart"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                opacity: heart.opacity,
                animationDelay: `${heart.delay}s`,
                transform: `scale(${heart.size})`
              }}
            >
              💖
            </div>
          ))}
        </div>

        {burstHearts.map((heart) => (
          <div
            key={heart.id}
            className="premium-playful-burst"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              color: heart.color,
              transform: `scale(${heart.scale})`
            }}
          >
            💕
          </div>
        ))}

        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="premium-playful-confetti"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`
            }}
          />
        ))}

        <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-5 py-10 gap-6">
          <div className="w-full text-center space-y-2">
            {renderCreatorBadge()}
            <p
              className={`text-sm uppercase tracking-[0.5em] text-white/80 drop-shadow-sm ${isEditable ? 'cursor-text inline-block rounded-md px-3 py-1 hover:bg-white/20 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent || '')}
            >
              {displayRecipientName || 'Kalbimin Kahramanı'}
            </p>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 text-center">
            <h1
              className={`text-4xl sm:text-5xl font-bold text-white drop-shadow-lg premium-playful-title ${isEditable ? 'cursor-text' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('mainTitle', event.currentTarget.textContent || '')}
            >
              {displayMainTitle}
            </h1>

            <p
              className={`max-w-md text-base sm:text-lg text-white/90 leading-relaxed bg-white/10 backdrop-blur-md rounded-3xl px-6 py-6 border border-white/30 shadow-lg ${isEditable ? 'cursor-text hover:bg-white/20 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('mainMessage', event.currentTarget.textContent || '')}
            >
              {displayMainMessage}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {['💘', '💞', '💝', '💖', '💗'].map((emoji, index) => (
                <span
                  key={index}
                  className="text-2xl sm:text-3xl premium-playful-emoji"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center pb-4">
            <button
              type="button"
              className="premium-playful-button"
              onClick={handlePlayfulCelebrate}
            >
              <span
                className={isEditable ? 'cursor-text' : ''}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleContentChange('playfulButtonLabel', event.currentTarget.textContent || '')}
              >
                {displayPlayfulButtonLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {layout}
      <style jsx global>{`
        @keyframes premiumFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes premiumFloat {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes premiumSweep {
          0% { transform: translateX(-10%) rotate(5deg); opacity: 0.35; }
          50% { opacity: 0.55; }
          100% { transform: translateX(10%) rotate(-5deg); opacity: 0.35; }
        }

        @keyframes premiumPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes premiumPetalDrift {
          0% { transform: translateY(-80px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(120vh) rotate(180deg); opacity: 0; }
        }

        @keyframes premiumConfettiFall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }

        @keyframes premiumBurstHeart {
          0% { transform: scale(0.6) translateY(0); opacity: 0.8; }
          60% { transform: scale(1.4) translateY(-15px); opacity: 1; }
          100% { transform: scale(0.2) translateY(-30px); opacity: 0; }
        }

        @keyframes premiumPlayfulEmoji {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .premium-modern-line {
          position: absolute;
          width: 140%;
          height: 260px;
          background: linear-gradient(110deg, rgba(255, 209, 223, 0.28), rgba(255, 247, 240, 0.8));
          filter: blur(60px);
          animation: premiumSweep 12s ease-in-out infinite;
        }

        .premium-modern-root {
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .premium-modern-heart {
          position: absolute;
          font-size: 32px;
          color: rgba(255, 154, 194, 0.4);
          animation: premiumFloat 6s ease-in-out infinite;
        }

        .premium-modern-heading {
          animation: premiumFadeUp 1s ease forwards;
        }

        .premium-modern-heading__shine {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: linear-gradient(120deg, rgba(255,255,255,0.1), rgba(244,143,177,0.35), rgba(255,255,255,0.1));
          opacity: 0;
          animation: premiumSweep 8s ease-in-out infinite;
        }

        .premium-modern-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.9rem 2.8rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #ff85b3, #ff4f87);
          box-shadow: 0 18px 35px rgba(255, 102, 153, 0.25);
          overflow: hidden;
          border: none;
        }

        .premium-modern-button__sheen {
          position: absolute;
          top: 0;
          left: -120%;
          height: 100%;
          width: 50%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: premiumSweep 3.5s ease-in-out infinite;
        }

        .premium-modern-button--active {
          box-shadow: 0 22px 38px rgba(255, 102, 153, 0.35);
          transform: translateY(-1px);
        }

        .premium-modern-button__flare {
          position: absolute;
          inset: -30%;
          background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,133,179,0.25) 35%, transparent 70%);
          border-radius: 999px;
          animation: premiumButtonFlare 1.2s ease-out forwards;
          pointer-events: none;
        }

        .premium-modern-button:active {
          transform: translateY(1px);
        }

        @keyframes premiumButtonFlare {
          0% { opacity: 0; transform: scale(0.6); }
          30% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }

        .premium-classic-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at top left, rgba(255, 255, 255, 0.65), transparent 55%),
            repeating-linear-gradient(45deg, rgba(208, 164, 120, 0.08) 0, rgba(208, 164, 120, 0.08) 12px, transparent 12px, transparent 24px);
          opacity: 0.4;
          pointer-events: none;
        }

        .premium-classic-root {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
        }

        .premium-classic-frame {
          position: relative;
          padding: clamp(2.5rem, 3vw, 3.5rem);
          background: linear-gradient(145deg, rgba(255, 248, 241, 0.96), rgba(250, 236, 222, 0.92));
          border-radius: 36px;
          border: 2px solid rgba(208, 164, 120, 0.35);
          box-shadow: 0 28px 40px rgba(149, 117, 84, 0.15);
          overflow: hidden;
        }

        .premium-classic-frame::after {
          content: '';
          position: absolute;
          inset: 12px;
          border-radius: 30px;
          border: 1px solid rgba(208, 164, 120, 0.35);
          pointer-events: none;
        }

        .premium-classic-corner {
          position: absolute;
          width: 64px;
          height: 64px;
          border: 2px solid rgba(208, 164, 120, 0.45);
          border-radius: 18px;
        }

        .premium-classic-corner--tl {
          top: 16px;
          left: 16px;
          border-bottom: none;
          border-right: none;
        }

        .premium-classic-corner--tr {
          top: 16px;
          right: 16px;
          border-bottom: none;
          border-left: none;
        }

        .premium-classic-corner--bl {
          bottom: 16px;
          left: 16px;
          border-top: none;
          border-right: none;
        }

        .premium-classic-corner--br {
          bottom: 16px;
          right: 16px;
          border-top: none;
          border-left: none;
        }

        .premium-classic-wreath {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          margin: 0 auto;
          border-radius: 999px;
          border: 1px solid rgba(208, 164, 120, 0.4);
          color: rgba(208, 164, 120, 0.75);
          font-size: 1.1rem;
          background: radial-gradient(circle, rgba(255, 248, 241, 0.9) 40%, transparent 70%);
          animation: premiumPulse 5s ease-in-out infinite;
        }

        .premium-classic-script {
          font-family: 'Great Vibes', 'Playball', 'Palatino', serif;
          letter-spacing: 0.06em;
        }

        .premium-classic-letter {
          backdrop-filter: blur(6px);
        }

        .premium-classic-divider {
          width: 120px;
          height: 1px;
          margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(208, 164, 120, 0.7), transparent);
        }

        .premium-classic-petal {
          position: absolute;
          top: -120px;
          font-size: 1.2rem;
          color: rgba(201, 150, 120, 0.5);
          animation-name: premiumPetalDrift;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }

        .premium-minimal-heart {
          position: relative;
          width: 56px;
          height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .premium-minimal-root {
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
        }

        .premium-minimal-heart span::before,
        .premium-minimal-heart span::after {
          content: '';
          position: absolute;
          width: 28px;
          height: 45px;
          background: #ff5d8f;
          border-radius: 28px 28px 0 0;
          animation: premiumPulse 2.8s ease-in-out infinite;
        }

        .premium-minimal-heart span::before {
          transform: rotate(-45deg);
          transform-origin: bottom right;
        }

        .premium-minimal-heart span::after {
          transform: rotate(45deg);
          transform-origin: bottom left;
        }

        .premium-playful-heart {
          position: absolute;
          font-size: 32px;
          color: rgba(255, 255, 255, 0.7);
          animation: premiumFloat 4.5s ease-in-out infinite;
        }

        .premium-playful-burst {
          position: absolute;
          font-size: 28px;
          pointer-events: none;
          animation: premiumBurstHeart 1.6s ease-out forwards;
        }

        .premium-playful-confetti {
          position: absolute;
          border-radius: 999px;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.35);
          animation-name: premiumConfettiFall;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }

        .premium-playful-title {
          letter-spacing: 0.08em;
          animation: premiumFadeUp 1s ease forwards;
        }

        .premium-playful-emoji {
          animation: premiumPlayfulEmoji 2.8s ease-in-out infinite;
        }

        .premium-playful-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.95rem 3rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 1.05rem;
          color: #ff2e63;
          background: #fff;
          border: none;
          box-shadow: 0 20px 38px rgba(255, 68, 110, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .premium-playful-root {
          font-family: 'Baloo 2', 'Fredoka', 'Nunito', sans-serif;
        }

        .premium-playful-button:active {
          transform: translateY(1px) scale(0.99);
          box-shadow: 0 12px 24px rgba(255, 68, 110, 0.3);
        }
      `}</style>
    </>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface InteractivePartyModeProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  partyTitle: 'Sürprizini Aç 🎁',
  partySubtitle: 'Kutunun içinde seni bekleyen bir mesaj var!',
  partyButtonLabel: 'Kutuyu Aç 🎉',
  partyRevealMessage: 'Doğum Günün Kutlu Olsun!',
  partyPhotoHint: 'Sürpriz Fotoğraf',
};

type FieldKey =
  | 'partyTitle'
  | 'partySubtitle'
  | 'partyButtonLabel'
  | 'partyRevealMessage'
  | 'partyPhotoUrl'
  | 'partyPhotoHint';

export default function InteractivePartyMode({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: InteractivePartyModeProps) {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      partyTitle: textFields?.partyTitle || DEFAULTS.partyTitle,
      partySubtitle: textFields?.partySubtitle || DEFAULTS.partySubtitle,
      partyButtonLabel: textFields?.partyButtonLabel || DEFAULTS.partyButtonLabel,
      partyRevealMessage: textFields?.partyRevealMessage || message || DEFAULTS.partyRevealMessage,
      partyPhotoUrl: textFields?.partyPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
      partyPhotoHint: textFields?.partyPhotoHint || DEFAULTS.partyPhotoHint,
    }),
    [textFields, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (showPhoto && !isEditable) {
      const handleClickOutside = (event: MouseEvent) => {
        if (photoRef.current && !photoRef.current.contains(event.target as Node)) {
          setShowPhoto(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPhoto, isEditable]);

  const displayValue = (key: FieldKey) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleContentChange = (key: FieldKey, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const handleOpenBox = () => {
    setIsBoxOpen(true);
    if (particlesRef.current) {
      particlesRef.current.innerHTML = '';
      const shapes = ['❤️', '⭐', '🎊', '🎉', '💫', '✨'];
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        particle.style.left = `${45 + Math.random() * 10}%`;
        particle.style.animationDelay = `${Math.random() * 0.3}s`;
        particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        particle.style.setProperty('--ty', `${-100 - Math.random() * 200}px`);
        particlesRef.current.appendChild(particle);
      }
    }
  };

  const partyPhotoUrl = displayValue('partyPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#FF6EC7] via-[#A78BFA] to-[#60A5FA]">
      <div className="balloons-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="balloon"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + Math.random() * 3}s`,
            }}
          >
            🎈
          </div>
        ))}
      </div>

      <div ref={particlesRef} className="particles-container" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl animate-[fadeIn_0.8s_ease-out]">
          {!isBoxOpen ? (
            <div className="flex flex-col items-center space-y-8 text-center">
              <h1
                className={`font-['Fredoka',sans-serif] text-5xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)] sm:text-6xl md:text-7xl ${
                  isEditable ? 'cursor-text rounded-3xl px-6 py-4 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('partyTitle', e.currentTarget.textContent || '')}
              >
                {displayValue('partyTitle')}
              </h1>

              <p
                className={`font-['Fredoka',sans-serif] max-w-md text-xl text-white/95 sm:text-2xl ${
                  isEditable ? 'cursor-text rounded-2xl px-5 py-3 hover:bg-white/10' : ''
                }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('partySubtitle', e.currentTarget.textContent || '')}
              >
                {displayValue('partySubtitle')}
              </p>

              <div className="gift-box">
                <div className="box-lid" />
                <div className="box-body" />
                <div className="box-ribbon-v" />
                <div className="box-ribbon-h" />
              </div>

              <Button
                onClick={handleOpenBox}
                className="mt-6 min-h-[44px] rounded-full bg-gradient-to-r from-[#FDE047] to-[#FACC15] px-10 py-6 font-['Fredoka',sans-serif] text-xl font-bold text-purple-900 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] active:scale-95"
              >
                <span
                  className={`${isEditable ? 'cursor-text' : 'pointer-events-none'}`}
                  {...(isEditable
                    ? {
                        contentEditable: true,
                        suppressContentEditableWarning: true,
                        onBlur: (e: React.FocusEvent<HTMLSpanElement>) =>
                          handleContentChange('partyButtonLabel', e.currentTarget.textContent || ''),
                      }
                    : {})}
                >
                  {displayValue('partyButtonLabel')}
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8 text-center animate-[revealMessage_0.8s_ease-out]">
              <div
                className={`font-['Fredoka',sans-serif] text-5xl font-bold text-white sm:text-6xl md:text-7xl ${
                  isEditable ? 'cursor-text rounded-3xl px-6 py-4 hover:bg-white/10' : ''
                }`}
                style={{
                  textShadow:
                    '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5), 0 4px 20px rgba(0,0,0,0.3)',
                }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('partyRevealMessage', e.currentTarget.textContent || '')}
              >
                {displayValue('partyRevealMessage')}
              </div>

              {partyPhotoUrl && (
                <div className="flex flex-col items-center gap-4">
                  {(isEditable || !showPhoto) &&
                    (isEditable ? (
                      <div
                        className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold uppercase tracking-wider text-purple-700"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleContentChange('partyPhotoHint', e.currentTarget.textContent?.trim() || '')
                        }
                      >
                        {displayValue('partyPhotoHint')}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPhoto(true);
                        }}
                        className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold uppercase tracking-wider text-purple-700 transition hover:scale-105 hover:bg-white"
                      >
                        {displayValue('partyPhotoHint')}
                      </button>
                    ))}

                  {(isEditable || showPhoto) && (
                    <div
                      ref={photoRef}
                      className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.3)]"
                    >
                      <img src={partyPhotoUrl} alt="Sürpriz fotoğraf" className="h-full w-full object-cover" />
                    </div>
                  )}

                  {isEditable && (
                    <div className="mt-2 flex w-full max-w-md flex-col gap-2">
                      <label className="text-sm font-medium text-white/90">Fotoğraf URL</label>
                      <input
                        type="url"
                        value={partyPhotoUrl}
                        onChange={(e) => handleContentChange('partyPhotoUrl', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="rounded-lg border-2 border-white/30 bg-white/20 px-4 py-2 text-sm text-white placeholder-white/50 backdrop-blur-md focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </div>
                  )}
                </div>
              )}

              {!partyPhotoUrl && isEditable && (
                <div className="flex w-full max-w-md flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Fotoğraf URL</label>
                  <input
                    type="url"
                    value={partyPhotoUrl}
                    onChange={(e) => handleContentChange('partyPhotoUrl', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="rounded-lg border-2 border-white/30 bg-white/20 px-4 py-2 text-sm text-white placeholder-white/50 backdrop-blur-md focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              )}

              {creatorName && (
                <p className="font-['Fredoka',sans-serif] mt-4 text-lg text-white/90">
                  🎊 {creatorName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .balloons-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .balloon {
          position: absolute;
          bottom: -60px;
          font-size: 3rem;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }

        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
        }

        :global(.particle) {
          position: absolute;
          top: 50%;
          font-size: 1.5rem;
          animation: burst 1.5s ease-out forwards;
        }

        @keyframes burst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0.5);
          }
        }

        .gift-box {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 2rem auto;
        }

        .box-body {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 75%;
          background: linear-gradient(135deg, #ff6ec7 0%, #ff8ed4 100%);
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .box-lid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: linear-gradient(135deg, #a78bfa 0%, #b99dfb 100%);
          border-radius: 8px 8px 0 0;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .box-ribbon-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 100%;
          background: linear-gradient(to bottom, #fde047 0%, #facc15 100%);
          z-index: 1;
        }

        .box-ribbon-h {
          position: absolute;
          top: 22%;
          left: 0;
          width: 100%;
          height: 16px;
          background: linear-gradient(to right, #fde047 0%, #facc15 100%);
          z-index: 2;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes revealMessage {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-5deg);
          }
          50% {
            transform: scale(1.1) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

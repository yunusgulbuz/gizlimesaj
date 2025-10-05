'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';

interface HiddenSurpriseGameProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface ConfettiPiece {
  id: number;
  left: number;
  background: string;
  delay: number;
}

const DEFAULTS = {
  funTitle: 'Sürprizi Bulabilir misin? 🎁',
  funSubtitle: 'Kutulardan biri akşamki planı saklıyor. Hazır mısın?',
  funButtonOneLabel: '1️⃣',
  funButtonTwoLabel: '2️⃣',
  funButtonThreeLabel: '3️⃣',
  funButtonOneMessage: 'Bu kutu sıcak bir hazırlık ipucu veriyor: çikolata molası!',
  funButtonTwoMessage: 'Yaklaştın! Rahat ayakkabıları hazırlamayı unutma.',
  funButtonThreeMessage: "Doğru kutu! Rooftop'ta senin için sakladığım bir masa var.",
  funSuccessMessage: 'Tebrikler! Yarın akşam buluşuyoruz ❤️',
  funPhotoHint: 'Sürpriz Fotoğrafı Gör',
  funSignatureLabel: 'Planın kahramanı:'
};

type FieldKey =
  | 'funTitle'
  | 'funSubtitle'
  | 'funButtonOneLabel'
  | 'funButtonTwoLabel'
  | 'funButtonThreeLabel'
  | 'funButtonOneMessage'
  | 'funButtonTwoMessage'
  | 'funButtonThreeMessage'
  | 'funSuccessMessage'
  | 'funPhotoUrl'
  | 'funPhotoHint'
  | 'funSignatureLabel';

const CORRECT_BOX_ID = 3;

const BUTTON_COLORS = ['from-[#ff8ec7] to-[#ff6f91]', 'from-[#ffa86b] to-[#ff7b39]', 'from-[#8f8aff] to-[#5a5cff]'];

const CONFETTI_COLORS = ['#ff79c6', '#50fa7b', '#8be9fd', '#ffb86c', '#bd93f9', '#ff5555'];

export default function HiddenSurpriseGame({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: HiddenSurpriseGameProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(() => ({
    funTitle: textFields?.funTitle || DEFAULTS.funTitle,
    funSubtitle:
      textFields?.funSubtitle ||
      (recipientName ? `${recipientName}, ${DEFAULTS.funSubtitle}` : DEFAULTS.funSubtitle),
    funButtonOneLabel: textFields?.funButtonOneLabel || DEFAULTS.funButtonOneLabel,
    funButtonTwoLabel: textFields?.funButtonTwoLabel || DEFAULTS.funButtonTwoLabel,
    funButtonThreeLabel: textFields?.funButtonThreeLabel || DEFAULTS.funButtonThreeLabel,
    funButtonOneMessage: textFields?.funButtonOneMessage || DEFAULTS.funButtonOneMessage,
    funButtonTwoMessage: textFields?.funButtonTwoMessage || DEFAULTS.funButtonTwoMessage,
    funButtonThreeMessage: textFields?.funButtonThreeMessage || message || DEFAULTS.funButtonThreeMessage,
    funSuccessMessage: textFields?.funSuccessMessage || DEFAULTS.funSuccessMessage,
    funPhotoUrl: textFields?.funPhotoUrl || '',
    funPhotoHint: textFields?.funPhotoHint || DEFAULTS.funPhotoHint,
    funSignatureLabel: textFields?.funSignatureLabel || DEFAULTS.funSignatureLabel,
  }), [textFields, recipientName, message]);

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

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

  const funPhotoUrl = displayValue('funPhotoUrl').trim();

  const handleBoxSelect = (boxId: number) => {
    setSelectedBox(boxId);
    const isCorrect = boxId === CORRECT_BOX_ID;
    if (isCorrect) {
      setShowPhoto(Boolean(funPhotoUrl));
      setConfetti(
        Array.from({ length: 32 }).map((_, index) => ({
          id: index,
          left: Math.random() * 100,
          background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
          delay: Math.random() * 1.2,
        }))
      );
    } else {
      setShowPhoto(false);
      setConfetti([]);
    }
  };

  const getBoxMessageKey = (boxId: number) => {
    if (boxId === 1) return 'funButtonOneMessage' as const;
    if (boxId === 2) return 'funButtonTwoMessage' as const;
    return 'funButtonThreeMessage' as const;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,137,209,0.25),_transparent_55%)]">
      <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(255,105,180,0.28),_rgba(143,138,255,0.3),_rgba(255,137,209,0.28))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#140021] via-[#1a0242] to-[#060010]" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="wave-one" />
        <div className="wave-two" />
        <div className="wave-three" />
      </div>

      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="pointer-events-none absolute top-[-10%] h-3 w-1 rounded-full opacity-0"
          style={{
            left: `${piece.left}%`,
            background: piece.background,
            animation: `confettiFall 1.8s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-white">
        <div
          className={`w-full max-w-3xl rounded-[34px] border border-white/12 bg-white/10 p-10 shadow-[0_40px_120px_rgba(102,63,211,0.38)] backdrop-blur-xl transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-10 text-center">
            <div
              className={`text-4xl font-semibold tracking-tight text-white drop-shadow-[0_0_22px_rgba(255,120,210,0.55)] sm:text-5xl md:text-[3.4rem] ${
                isEditable ? 'cursor-text rounded-2xl px-6 py-4 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('funTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('funTitle')}
            </div>

            <p
              className={`max-w-2xl text-base text-white/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-2xl px-6 py-4 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('funSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('funSubtitle')}
            </p>

            <div className="grid w-full gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((boxId, index) => (
                <button
                  key={boxId}
                  type="button"
                  onClick={() => handleBoxSelect(boxId)}
                  className={`group relative flex h-28 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br ${BUTTON_COLORS[index]} px-4 text-3xl font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-4 focus:ring-white/30 ${
                    selectedBox === boxId ? 'scale-105' : ''
                  }`}
                >
                  <span
                    className={`${isEditable ? 'cursor-text' : 'pointer-events-none'} select-text`}
                    {...(isEditable
                      ? {
                          contentEditable: true,
                          suppressContentEditableWarning: true,
                          onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                            handleContentChange(
                              boxId === 1
                                ? 'funButtonOneLabel'
                                : boxId === 2
                                ? 'funButtonTwoLabel'
                                : 'funButtonThreeLabel',
                              event.currentTarget.textContent || ''
                            ),
                        }
                      : {})}
                  >
                    {displayValue(
                      boxId === 1
                        ? 'funButtonOneLabel'
                        : boxId === 2
                        ? 'funButtonTwoLabel'
                        : 'funButtonThreeLabel'
                    )}
                  </span>
                  <span className="absolute inset-0 rounded-3xl bg-white/0 transition group-hover:bg-white/10" />
                </button>
              ))}
            </div>

            <div className="relative flex w-full max-w-2xl flex-col items-center gap-5">
              {selectedBox !== null && (
                <div
                  className={`w-full rounded-3xl border border-white/15 bg-white/12 px-6 py-5 text-white/90 shadow-[0_20px_60px_rgba(80,40,160,0.35)] backdrop-blur-lg transition-all duration-500 ${
                    selectedBox === CORRECT_BOX_ID ? 'scale-100 opacity-100' : 'scale-95 opacity-100'
                  } ${isEditable ? 'cursor-text hover:bg-white/16' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange(getBoxMessageKey(selectedBox), event.currentTarget.textContent || '')
                  }
                >
                  {displayValue(getBoxMessageKey(selectedBox))}
                </div>
              )}

              {selectedBox === CORRECT_BOX_ID && (
                <div
                  className={`w-full rounded-3xl border border-white/20 bg-white/18 px-6 py-5 text-lg font-semibold text-white shadow-[0_25px_70px_rgba(255,120,210,0.35)] transition-all duration-500 ${
                    isEditable ? 'cursor-text hover:bg-white/24' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('funSuccessMessage', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('funSuccessMessage')}
                </div>
              )}

              {selectedBox === CORRECT_BOX_ID && funPhotoUrl && (
                <div className="flex flex-col items-center gap-3">
                  {isEditable ? (
                    <div
                      className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/80"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('funPhotoHint', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {displayValue('funPhotoHint')}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPhoto(true)}
                      className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/80 transition hover:bg-white/25"
                    >
                      {displayValue('funPhotoHint')}
                    </button>
                  )}

                  {(isEditable || showPhoto) && (
                    <div
                      ref={photoRef}
                      className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-white/35 bg-white/10 shadow-[0_20px_60px_rgba(255,120,210,0.45)]"
                    >
                      <img src={funPhotoUrl} alt="Sürpriz davet fotoğrafı" className="h-full w-full object-cover" />
                    </div>
                  )}

                  {isEditable && (
                    <div
                      className="text-[0.7rem] text-white/70"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        handleContentChange('funPhotoUrl', event.currentTarget.textContent?.trim() || '')
                      }
                    >
                      {funPhotoUrl || 'Fotoğraf için URL girin'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {creatorName && (
              <p className="text-xs uppercase tracking-[0.45em] text-white/55">
                <span
                  className={isEditable ? 'cursor-text rounded px-3 py-1 hover:bg-white/15' : ''}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    handleContentChange('funSignatureLabel', event.currentTarget.textContent || '')
                  }
                >
                  {displayValue('funSignatureLabel')}
                </span>{' '}
                {creatorName}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .wave-one,
        .wave-two,
        .wave-three {
          position: absolute;
          width: 160%;
          height: 160%;
          left: -30%;
          top: -40%;
          opacity: 0.18;
          background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%);
          filter: blur(40px);
          animation: waveMove 18s linear infinite;
        }

        .wave-two {
          animation-duration: 22s;
          animation-delay: -4s;
          opacity: 0.22;
        }

        .wave-three {
          animation-duration: 26s;
          animation-delay: -8s;
          opacity: 0.16;
        }

        @keyframes waveMove {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(10%, -8%, 0) rotate(15deg);
          }
          100% {
            transform: translate3d(-6%, 12%, 0) rotate(-10deg);
          }
        }

        @keyframes confettiFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -20vh, 0) rotate(0deg);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 90vh, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

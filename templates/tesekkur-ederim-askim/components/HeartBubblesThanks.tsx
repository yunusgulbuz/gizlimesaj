'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface HeartBubblesThanksProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const FUN_DEFAULTS = {
  funTitle: 'Teşekkür Ederim Aşkım!',
  funSubtitle: 'Kalbimi rengârenk baloncuklarla doldurduğun için.',
  funButtonLabel: 'Balonları Patlat 🎈',
  funBubbleMessage1: 'İyi ki varsın!',
  funBubbleMessage2: 'Her günün kahramanı sensin 💖',
  funBubbleMessage3: 'Sevgin her şeyi güzelleştiriyor ✨',
  funBubbleMessage4: 'Sonsuz teşekkürler!',
};

const BUBBLES = Array.from({ length: 18 }).map((_, index) => ({
  id: index,
  left: Math.random() * 100,
  size: 50 + Math.random() * 80,
  delay: Math.random() * 6,
  duration: 14 + Math.random() * 8,
  color: index % 4,
}));

export default function HeartBubblesThanks({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: HeartBubblesThanksProps) {
  const [burst, setBurst] = useState(false);
  const [burstIteration, setBurstIteration] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const photoEditorRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      funTitle: textFields?.funTitle || FUN_DEFAULTS.funTitle,
      funSubtitle:
        textFields?.funSubtitle ||
        (recipientName ? `${recipientName}, her şey için teşekkür ederim!` : FUN_DEFAULTS.funSubtitle),
      funButtonLabel: textFields?.funButtonLabel || FUN_DEFAULTS.funButtonLabel,
      funBubbleMessage1: textFields?.funBubbleMessage1 || FUN_DEFAULTS.funBubbleMessage1,
      funBubbleMessage2: textFields?.funBubbleMessage2 || FUN_DEFAULTS.funBubbleMessage2,
      funBubbleMessage3: textFields?.funBubbleMessage3 || FUN_DEFAULTS.funBubbleMessage3,
      funBubbleMessage4: textFields?.funBubbleMessage4 || message || FUN_DEFAULTS.funBubbleMessage4,
      funPhotoUrl: textFields?.funPhotoUrl || '',
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (!isEditable) {
      setShowPhotoEditor(false);
    }
  }, [isEditable]);

  useEffect(() => {
    if (showPhotoEditor && isEditable && photoEditorRef.current) {
      const node = photoEditorRef.current;
      const value = displayValue('funPhotoUrl');
      requestAnimationFrame(() => {
        if (!node.isConnected) return;
        node.textContent = value;
        node.focus();
      });
    }
  }, [showPhotoEditor, isEditable]);

  const displayValue = (key: keyof typeof initialValues) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleContentChange = (key: keyof typeof initialValues, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const handleBurst = () => {
    setBurst(true);
    setShowMessages(true);
    setBurstIteration((prev) => prev + 1);
    window.setTimeout(() => setBurst(false), 2200);
  };

  const bubbleMessages = [
    { key: 'funBubbleMessage1' as const, color: 'from-[#ff8fb7] to-[#ff5f8a]' },
    { key: 'funBubbleMessage2' as const, color: 'from-[#ffd166] to-[#ff8c42]' },
    { key: 'funBubbleMessage3' as const, color: 'from-[#a855f7] to-[#6366f1]' },
    { key: 'funBubbleMessage4' as const, color: 'from-[#fb7185] to-[#f472b6]' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#ffe1f0] via-[#ffeaf5] to-[#fff8f1] px-6 py-16 text-[#341b35]">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.75)_0,_rgba(255,210,235,0.55)_55%,_rgba(255,178,214,0.35)_100%)]" />

      {BUBBLES.map((bubble) => (
        <span
          key={`${bubble.id}-${burstIteration}`}
          className={`pointer-events-none absolute bottom-[-120px] rounded-full opacity-70 blur-[1px] transition-all duration-700 ${
            burst ? 'scale-0 opacity-0' : ''
          } ${
            bubble.color === 0
              ? 'bg-gradient-to-br from-[#ff9ebd] to-[#ff6fb1]'
              : bubble.color === 1
              ? 'bg-gradient-to-br from-[#d8b4fe] to-[#a855f7]'
              : bubble.color === 2
              ? 'bg-gradient-to-br from-[#fecdd3] to-[#fb7185]'
              : 'bg-gradient-to-br from-[#fcd34d] to-[#fb923c]'
          }`}
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            animation: `bubble-up ${bubble.duration}s ease-in ${bubble.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <div
            className={`text-4xl font-bold tracking-tight text-[#4c2151] drop-shadow-[0_12px_30px_rgba(255,143,183,0.35)] sm:text-5xl md:text-6xl ${
              isEditable ? 'cursor-text rounded-3xl px-4 py-4 hover:bg-white/40' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('funTitle', event.currentTarget.textContent || '')}
          >
            {displayValue('funTitle')}
          </div>

          <p
            className={`mt-4 text-base text-[#6c3f63] sm:text-lg ${
              isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/40' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('funSubtitle', event.currentTarget.textContent || '')}
          >
            {displayValue('funSubtitle')}
          </p>
        </div>

        {(() => {
          const funPhotoUrl = displayValue('funPhotoUrl');
          const funPhotoStatus = funPhotoUrl.trim()
            ? 'Fotoğraf URL kaydedildi ✓'
            : 'Fotoğraf için URL ekleyin';

          if (funPhotoUrl.trim()) {
            return (
              <div className="relative mt-8" onClick={() => isEditable && setShowPhotoEditor(true)}>
                <img
                  src={funPhotoUrl}
                  alt="Neşeli anımız"
                  className="h-28 w-28 rounded-3xl border-4 border-white/80 object-cover shadow-[0_18px_48px_rgba(255,106,142,0.35)]"
                />
                {isEditable && showPhotoEditor && (
                  <div
                    ref={photoEditorRef}
                    className="absolute inset-x-0 bottom-[-2.5rem] mx-auto w-full max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[0.7rem] text-[#b96f94] shadow-sm"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) => {
                      const value = event.currentTarget.textContent?.trim() || '';
                      handleContentChange('funPhotoUrl', value);
                      setShowPhotoEditor(false);
                    }}
                    onInput={(event) => {
                      const value = event.currentTarget.textContent?.trim() || '';
                      handleContentChange('funPhotoUrl', value);
                    }}
                  >
                    {funPhotoUrl}
                  </div>
                )}
                {isEditable && !showPhotoEditor && funPhotoStatus && (
                  <span className="sr-only">{funPhotoStatus}</span>
                )}
              </div>
            );
          }

          return (
            <div
              className={`mt-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-dashed border-[#f5abc4] bg-white/50 text-xs text-[#b96f94] ${
                isEditable ? 'cursor-text px-3 text-center' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('funPhotoUrl', event.currentTarget.textContent?.trim() || '')}
              onInput={(event) => handleContentChange('funPhotoUrl', event.currentTarget.textContent?.trim() || '')}
            >
              {isEditable ? 'Fotoğraf için URL ekleyin' : 'Fotoğraf için URL ekleyin'}
            </div>
          );
        })()}

        <div className="mt-10">
          <Button
            type="button"
            onClick={handleBurst}
            className={`rounded-full bg-gradient-to-r from-[#ff7ab8] via-[#ff6aa2] to-[#ff5f8a] px-10 py-4 text-base font-semibold text-white shadow-[0_20px_60px_rgba(255,117,168,0.38)] transition-all duration-300 sm:text-lg ${
              burst ? 'scale-105 shadow-[0_25px_80px_rgba(255,117,168,0.45)]' : 'hover:scale-105'
            }`}
          >
            <span
              className={`${
                isEditable ? 'cursor-text' : 'pointer-events-none'
              }`}
              {...(isEditable
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                      handleContentChange('funButtonLabel', event.currentTarget.textContent || ''),
                  }
                : {})}
            >
              {displayValue('funButtonLabel')}
            </span>
          </Button>
        </div>

        <div className={`mt-12 grid w-full gap-4 sm:grid-cols-2 ${burst ? 'animate-[cards-in_0.6s_ease-out]' : ''}`}>
          {bubbleMessages.map((item, index) => (
            <div
              key={item.key}
              className={`rounded-3xl border border-white/60 bg-gradient-to-br ${item.color} px-6 py-5 text-left text-white shadow-[0_18px_45px_rgba(255,128,170,0.28)] transition-all duration-300 ${
                burst || showMessages ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${isEditable ? 'cursor-text' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange(item.key, event.currentTarget.textContent || '')}
              style={{ transitionDelay: burst ? `${index * 120}ms` : undefined }}
            >
              {displayValue(item.key)}
            </div>
          ))}
        </div>

        {creatorName && (
          <p className="mt-12 text-xs uppercase tracking-[0.4em] text-[#a24d83]">Hazırlayan: {creatorName}</p>
        )}
      </div>

      <style jsx>{`
        @keyframes bubble-up {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          60% {
            transform: translate3d(15px, -280px, 0) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: translate3d(-12px, -520px, 0) scale(1.05);
            opacity: 0;
          }
        }

        @keyframes cards-in {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

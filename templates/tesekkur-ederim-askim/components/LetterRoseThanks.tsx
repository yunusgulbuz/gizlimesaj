'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface LetterRoseThanksProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const CLASSIC_DEFAULTS = {
  classicTitle: 'Teşekkür Ederim Aşkım',
  classicSubtitle: 'Kalbimin en zarif mektubunu sana gönderiyorum.',
  classicButtonLabel: 'Mektubu Aç ✉️',
  classicLetterMessage:
    'Sevgili aşkım, seninle geçen her an bana hayatın en güzel armağanı gibi geliyor. Nazik gülüşünü, sabrını ve sevgini her hissettiğimde kalbim yeniden çiçek açıyor. İyi ki varsın, iyi ki kalbimin ortağısın.',
  classicLetterSignature: 'Sonsuz sevgiyle 💌',
};

const PETALS = Array.from({ length: 14 }).map((_, index) => ({
  id: index,
  left: Math.random() * 100,
  delay: index * 0.75,
  duration: 8 + Math.random() * 6,
  size: 14 + Math.random() * 10,
}));

export default function LetterRoseThanks({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: LetterRoseThanksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const photoEditorRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      classicTitle: textFields?.classicTitle || CLASSIC_DEFAULTS.classicTitle,
      classicSubtitle:
        textFields?.classicSubtitle ||
        (recipientName ? `${recipientName} için zarif bir teşekkür mektubu.` : CLASSIC_DEFAULTS.classicSubtitle),
      classicButtonLabel: textFields?.classicButtonLabel || CLASSIC_DEFAULTS.classicButtonLabel,
      classicLetterMessage: textFields?.classicLetterMessage || message || CLASSIC_DEFAULTS.classicLetterMessage,
      classicLetterSignature: textFields?.classicLetterSignature || CLASSIC_DEFAULTS.classicLetterSignature,
      classicPhotoUrl: textFields?.classicPhotoUrl || '',
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
      const value = displayValue('classicPhotoUrl');
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f4efe5] text-[#4b2b25]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8), rgba(244,239,229,0.95) 45%, rgba(235,220,205,0.85)), repeating-linear-gradient(135deg, rgba(221,200,184,0.18) 0px, rgba(221,200,184,0.18) 1px, transparent 1px, transparent 8px)',
        }}
      />

      {PETALS.map((petal) => (
        <div
          key={petal.id}
          className="pointer-events-none absolute top-[-10%] text-rose-300"
          style={{
            left: `${petal.left}%`,
            animation: `petal-fall ${petal.duration}s linear ${petal.delay}s infinite`,
            fontSize: petal.size,
          }}
        >
          🌹
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl rounded-3xl border border-[#d7c3ad] bg-gradient-to-br from-[#fffaf4] via-[#f8f0e4] to-[#f0e0cd] p-10 shadow-xl">
          <div className="mb-12 text-center relative z-20">
            <h1
              className={`font-['Parisienne',cursive] text-4xl text-[#5c342a] sm:text-5xl md:text-6xl ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f5ece1]' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('classicTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('classicTitle')}
            </h1>
            <p
              className={`mt-4 font-serif text-base text-[#6e4438] sm:text-lg ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f5ece1]' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('classicSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('classicSubtitle')}
            </p>
          </div>

          <div className="relative mx-auto mb-10 mt-14 w-full max-w-2xl">
            <div
              className={`relative rounded-3xl border border-[#deb9a9] bg-gradient-to-b from-[#fef7ee] via-[#f7ebdc] to-[#f4e3d1] p-6 shadow-[0_30px_60px_rgba(141,102,81,0.18)] transition-transform duration-700 ${
                isOpen ? 'translate-y-3' : ''
              }`}
            >
              <div
                className={`envelope-flap absolute inset-x-6 top-[-120px] h-36 rounded-t-3xl border border-b-0 border-[#deb9a9] bg-gradient-to-b from-[#f8ede0] to-[#f3e0cf] shadow-[0_25px_40px_rgba(125,89,65,0.15)] ${
                  isOpen ? 'envelope-flap--open' : ''
                }`}
              >
                <div
                  className="absolute inset-0 rounded-t-3xl"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHZpZXdCb3g9JzAgMCAxNiAxNicgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48Y2lyY2xlIGN4PSc4JyBjeT0nOCcgcj0nMC40JyBmaWxsPScjZWRjN2JhJy8+PC9zdmc+')",
                    backgroundSize: '8px 8px',
                    opacity: 0.6,
                  }}
                />
              </div>

              <div className={`transition-opacity duration-500 ${isOpen ? 'opacity-100 delay-200' : 'opacity-0'}`}>
                {(() => {
                  const classicPhotoUrl = displayValue('classicPhotoUrl');
                  const classicPhotoStatus = classicPhotoUrl.trim()
                    ? 'Fotoğraf URL kaydedildi ✓'
                    : 'Fotoğraf için URL girin';

                  if (classicPhotoUrl.trim()) {
                    return (
                      <div className="relative" onClick={() => isEditable && setShowPhotoEditor(true)}>
                        <img
                          src={classicPhotoUrl}
                          alt="Sevgi fotoğrafı"
                          className="mx-auto mb-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-[0_15px_35px_rgba(131,90,74,0.35)]"
                        />
                        {isEditable && showPhotoEditor && (
                          <div
                            ref={photoEditorRef}
                            className="absolute inset-x-0 bottom-[-2.5rem] mx-auto w-full max-w-[11rem] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[#d7c3ad] bg-[#f5ece1]/90 px-3 py-1 text-[0.7rem] text-[#6e4438] shadow-sm"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(event) => {
                              const value = event.currentTarget.textContent?.trim() || '';
                              handleContentChange('classicPhotoUrl', value);
                              setShowPhotoEditor(false);
                            }}
                          >
                            {classicPhotoUrl}
                          </div>
                        )}
                        {isEditable && !showPhotoEditor && classicPhotoStatus && (
                          <span className="sr-only">{classicPhotoStatus}</span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      className={`mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-[#c4a28d] bg-[#f9efe3] text-xs text-[#9c7b66] ${
                        isEditable ? 'cursor-text px-4 text-center' : ''
                      }`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) => handleContentChange('classicPhotoUrl', event.currentTarget.textContent?.trim() || '')}
                    >
                      {isEditable ? 'Fotoğraf için URL girin' : 'Fotoğraf için URL girilebilir'}
                    </div>
                  );
                })()}

                <p
                  className={`whitespace-pre-line font-serif text-base leading-relaxed text-[#5b382d] sm:text-lg ${
                    isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f9efe3]' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('classicLetterMessage', event.currentTarget.textContent || '')}
                >
                  {displayValue('classicLetterMessage')}
                </p>

                <p
                  className={`mt-6 font-['Cormorant_Garamond',serif] text-right text-lg italic text-[#715045] ${
                    isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-[#f9efe3]' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('classicLetterSignature', event.currentTarget.textContent || '')}
                >
                  {displayValue('classicLetterSignature')}
                </p>
              </div>

              <Button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative mt-6 w-full rounded-full border border-[#d6b9a6] bg-gradient-to-r from-[#f8ede0] to-[#f3dbc5] py-4 text-base font-semibold text-[#6f4538] shadow-[0_12px_30px_rgba(169,126,103,0.25)] transition-all duration-300 hover:shadow-[0_18px_45px_rgba(169,126,103,0.35)] sm:text-lg"
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
                          handleContentChange('classicButtonLabel', event.currentTarget.textContent || ''),
                      }
                    : {})}
                >
                  {displayValue('classicButtonLabel')}
                </span>
              </Button>
            </div>
          </div>

          {creatorName && (
            <p className="text-center text-xs uppercase tracking-[0.35em] text-[#9c7a66]">Hazırlayan: {creatorName}</p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes petal-fall {
          0% {
            transform: translate3d(0, -10%, 0) rotateZ(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          50% {
            transform: translate3d(-10px, 250px, 0) rotateZ(120deg);
            opacity: 0.9;
          }
          80% {
            transform: translate3d(12px, 500px, 0) rotateZ(260deg);
            opacity: 0.5;
          }
          100% {
            transform: translate3d(-8px, 640px, 0) rotateZ(360deg);
            opacity: 0;
          }
        }

        .envelope-flap {
          transform-origin: top;
          transition: transform 0.7s ease-out, translateY 0.7s ease-out;
        }

        .envelope-flap--open {
          transform: translateY(-110px);
        }
      `}</style>
    </div>
  );
}

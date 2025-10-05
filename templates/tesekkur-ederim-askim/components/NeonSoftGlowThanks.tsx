'use client';

import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface NeonSoftGlowThanksProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  modernTitle: 'Teşekkür Ederim Aşkım 💜',
  modernSubtitle: 'Neon ışıklar kadar büyülü bir minnet.',
  modernButtonLabel: 'Söylemek İstediklerim 💬',
  modernDrawerMessage:
    'Seninle paylaştığım her an, mor neon ışıklar gibi kalbimde yumuşacık bir iz bırakıyor. Her gülüşün geceyi aydınlatan bir parıltı gibi. İyi ki varsın.',
  modernSecondaryLine: 'Birlikte parlamaya devam edelim 💫',
};

const BOKEH_ITEMS = Array.from({ length: 12 }).map((_, index) => ({
  id: index,
  size: 140 + Math.random() * 120,
  left: Math.random() * 100,
  top: Math.random() * 100,
  opacity: 0.12 + Math.random() * 0.18,
  blur: 24 + Math.random() * 22,
  delay: index * 0.35,
}));

export default function NeonSoftGlowThanks({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: NeonSoftGlowThanksProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const photoEditorRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      modernTitle: textFields?.modernTitle || DEFAULTS.modernTitle,
      modernSubtitle: textFields?.modernSubtitle || `${recipientName ? `${recipientName}, ` : ''}${DEFAULTS.modernSubtitle}`.trim(),
      modernButtonLabel: textFields?.modernButtonLabel || DEFAULTS.modernButtonLabel,
      modernDrawerMessage: textFields?.modernDrawerMessage || message || DEFAULTS.modernDrawerMessage,
      modernSecondaryLine: textFields?.modernSecondaryLine || DEFAULTS.modernSecondaryLine,
      modernPhotoUrl: textFields?.modernPhotoUrl || '',
    }),
    [textFields, recipientName, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isEditable) {
      setShowPhotoEditor(false);
    }
  }, [isEditable]);

  useEffect(() => {
    if (showPhotoEditor && isEditable && photoEditorRef.current) {
      const node = photoEditorRef.current;
      const value = displayValue('modernPhotoUrl');
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#120020] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D0B52] via-[#1A0330] to-[#06000F]" />
      <div className="absolute inset-0 mix-blend-screen" style={{ background: 'radial-gradient(circle at center, rgba(198,118,255,0.35) 0%, rgba(6,0,15,0.85) 60%)' }} />

      {BOKEH_ITEMS.map((item) => (
        <div
          key={item.id}
          className="absolute rounded-full bg-gradient-to-br from-[#d8b4fe] to-[#4c1d95] opacity-30"
          style={{
            width: item.size,
            height: item.size,
            left: `${item.left}%`,
            top: `${item.top}%`,
            filter: `blur(${item.blur}px)`,
            opacity: item.opacity,
            animation: `float-glow 10s ease-in-out ${item.delay}s infinite` as const,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div
          className={`relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_rgba(110,64,182,0.35)] backdrop-blur-2xl transition-all duration-700 ${
            isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/05 to-transparent" />
          <div className="relative flex flex-col items-center space-y-6 text-center">
            <div
              className={`text-4xl font-semibold tracking-wide text-white drop-shadow-[0_0_18px_rgba(178,129,255,0.65)] sm:text-5xl md:text-6xl ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernTitle', event.currentTarget.textContent || '')}
            >
              {displayValue('modernTitle')}
            </div>

            <p
              className={`max-w-xl text-base text-white/80 sm:text-lg ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernSubtitle', event.currentTarget.textContent || '')}
            >
              {displayValue('modernSubtitle')}
            </p>

            {(() => {
              const modernPhotoUrl = displayValue('modernPhotoUrl');
              const modernPhotoStatus = modernPhotoUrl.trim()
                ? 'Fotoğraf URL kaydedildi ✓'
                : 'Fotoğraf için URL girin';

              if (modernPhotoUrl.trim()) {
                return (
                  <div className="relative" onClick={() => isEditable && setShowPhotoEditor(true)}>
                    <img
                      src={modernPhotoUrl}
                      alt={displayValue('modernTitle') || 'Profil fotoğrafı'}
                      className="h-32 w-32 rounded-full border-4 border-white/30 object-cover shadow-[0_20px_60px_rgba(168,113,255,0.4)]"
                    />
                    {isEditable && showPhotoEditor && (
                      <div
                        ref={photoEditorRef}
                        className="absolute inset-x-0 bottom-[-2.75rem] mx-auto w-full max-w-[11rem] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[0.7rem] text-white/70 backdrop-blur-sm"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(event) => {
                          const value = event.currentTarget.textContent?.trim() || '';
                          handleContentChange('modernPhotoUrl', value);
                          setShowPhotoEditor(false);
                        }}
                        onInput={(event) => {
                          const value = event.currentTarget.textContent?.trim() || '';
                          handleContentChange('modernPhotoUrl', value);
                        }}
                      >
                        {modernPhotoUrl}
                      </div>
                    )}
                    {isEditable && !showPhotoEditor && modernPhotoStatus && (
                      <span className="sr-only">{modernPhotoStatus}</span>
                    )}
                  </div>
                );
              }

              return (
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-xs text-white/60 ${
                    isEditable ? 'cursor-text px-4 text-center' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')}
                  onInput={(event) => handleContentChange('modernPhotoUrl', event.currentTarget.textContent?.trim() || '')}
                >
                  {isEditable ? 'Fotoğraf için URL girin' : 'Profil fotoğrafı eklemek için URL girin'}
                </div>
              );
            })()}

            <p
              className={`max-w-2xl text-sm uppercase tracking-[0.35em] text-white/40 sm:text-base ${
                isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('modernSecondaryLine', event.currentTarget.textContent || '')}
            >
              {displayValue('modernSecondaryLine')}
            </p>

            <Button
              type="button"
              onClick={() => setShowDrawer((prev) => !prev)}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#a855f7] via-[#7c3aed] to-[#4338ca] px-10 py-4 text-base font-semibold text-white shadow-[0_20px_60px_rgba(124,58,237,0.45)] transition-all duration-300 sm:text-lg"
            >
              <span
                className={`${
                  isEditable ? 'cursor-text' : 'pointer-events-none'
                } relative z-10`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (event: FocusEvent<HTMLSpanElement>) =>
                        handleContentChange('modernButtonLabel', event.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('modernButtonLabel')}
              </span>
              <div className="absolute inset-0 animate-[neon-sheen_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-20 flex justify-center px-6 transition-transform duration-600 ease-out ${
          showDrawer ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="relative mb-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-[#160024]/95 p-8 shadow-[0_-30px_80px_rgba(110,64,182,0.32)] backdrop-blur-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/25 via-transparent to-transparent" />
          <p
            className={`relative text-base leading-relaxed text-white/85 sm:text-lg md:text-xl ${
              isEditable ? 'cursor-text rounded-xl px-4 py-2 hover:bg-white/10' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('modernDrawerMessage', event.currentTarget.textContent || '')}
          >
            {displayValue('modernDrawerMessage')}
          </p>
        </div>
      </div>

      {creatorName && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-white/30">
          Hazırlayan: {creatorName}
        </div>
      )}

      <style jsx>{`
        @keyframes neon-sheen {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }

        @keyframes float-glow {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, -20px, 0) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState, type FocusEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';

type DesignStyle = 'modern' | 'classic' | 'minimalist' | 'eglenceli';

const FIELD_KEYS = [
  'title',
  'subtitle',
  'button_text',
  'afterClick_text',
  'image_url',
  'image_alt',
  'hint_text',
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];

const COMMON_DEFAULTS: Record<FieldKey, string> = {
  title: 'Şaka Yaptım!',
  subtitle: 'Korktun mu yoksa? 😅',
  button_text: 'Gerçekten mi? 😳',
  afterClick_text: 'Tabii ki değil, gül biraz!',
  image_url: '',
  image_alt: 'Komik tepki fotoğrafı',
  hint_text: 'Sadece şakalaşıyoruz, gülümse! 😄',
};

const STYLE_DEFAULTS: Record<DesignStyle, Partial<Record<FieldKey, string>>> = {
  minimalist: {
    title: 'Şaka Yaptım!',
    subtitle: 'Korktun mu yoksa? 😅',
    button_text: 'Gerçekten mi? 😳',
    afterClick_text: 'Tabii ki değil, gül biraz!',
  },
  modern: {
    title: 'Şaka Yaptım 😂',
    subtitle: 'Bu yüz ifadesi her şeyi anlatıyor!',
    button_text: 'Devamını göster',
    afterClick_text: 'Tabii ki şakaydı, rahatla! 😌',
  },
  classic: {
    title: 'ŞAKA YAPTIM 😎',
    subtitle: 'Ama seni bir an yakaladım!',
    button_text: 'Ne Oldu?',
    afterClick_text: 'Yüz ifaden paha biçilemezdi 😂',
    hint_text: 'Neon mod aktif, kahkahalar başlasın!',
  },
  eglenceli: {
    title: 'Bir şey söyleyeceğim...',
    subtitle: 'Hazır mısın? 😏',
    button_text: 'Tıkla!',
    afterClick_text: 'Şaka Yaptım 😂',
  },
};

interface SakaYaptimTemplateProps {
  recipientName: string;
  message: string;
  designStyle: DesignStyle;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
  shortId?: string;
}

export default function SakaYaptimTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: SakaYaptimTemplateProps) {
  const effectiveDefaults = useMemo(() => {
    const styleDefaults = STYLE_DEFAULTS[designStyle] ?? {};
    const base: Record<FieldKey, string> = { ...COMMON_DEFAULTS };

    FIELD_KEYS.forEach((key) => {
      if (styleDefaults[key]) {
        base[key] = styleDefaults[key] as string;
      }
    });

    if (recipientName) {
      if (designStyle === 'modern') {
        base.subtitle = `${recipientName}, ${styleDefaults.subtitle || COMMON_DEFAULTS.subtitle}`;
      }
      if (designStyle === 'eglenceli') {
        base.subtitle = `${styleDefaults.subtitle || COMMON_DEFAULTS.subtitle}`;
      }
    }

    if (message) {
      base.afterClick_text = message;
    }

    return base;
  }, [designStyle, recipientName, message]);

  const computeInitialValues = () => {
    const initial: Record<FieldKey, string> = { ...effectiveDefaults };
    FIELD_KEYS.forEach((key) => {
      if (typeof textFields?.[key] === 'string') {
        initial[key] = textFields[key] as string;
      }
    });
    return initial;
  };

  const [localFields, setLocalFields] = useState<Record<FieldKey, string>>(computeInitialValues);

  useEffect(() => {
    setLocalFields(computeInitialValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveDefaults, textFields]);

  const handleFieldChange = (key: FieldKey, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const displayField = (key: FieldKey) => {
    const editedValue = isEditable ? localFields[key] : (textFields?.[key] as string | undefined) ?? localFields[key];
    if (typeof editedValue === 'string' && editedValue.trim() !== '') {
      return editedValue;
    }
    if (key === 'afterClick_text' && message.trim()) {
      return message;
    }
    return effectiveDefaults[key] || '';
  };

  const sharedProps: SharedStyleProps = {
    recipientName,
    creatorName,
    isEditable,
    getField: displayField,
    onFieldChange: handleFieldChange,
  };

  switch (designStyle) {
    case 'modern':
      return <MemeReactionStyle {...sharedProps} />;
    case 'classic':
      return <PrankModeStyle {...sharedProps} />;
    case 'eglenceli':
      return <ReverseSurpriseStyle {...sharedProps} />;
    case 'minimalist':
    default:
      return <GotchaPopStyle {...sharedProps} />;
  }
}

interface SharedStyleProps {
  recipientName: string;
  creatorName?: string;
  isEditable: boolean;
  getField: (key: FieldKey) => string;
  onFieldChange: (key: FieldKey, value: string) => void;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

function GotchaPopStyle({ recipientName, creatorName, isEditable, getField, onFieldChange }: SharedStyleProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const emojiClouds = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, index) => ({
        id: index,
        emoji: ['🙂', '😜', '😂', '🤪', '😎'][index % 5],
        top: Math.random() * 90,
        left: Math.random() * 90,
        scale: 0.6 + Math.random() * 0.9,
        rotate: Math.random() * 30 - 15,
      })),
    []
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  const triggerConfetti = () => {
    const palette = ['#F97316', '#FACC15', '#38BDF8', '#F97316', '#A855F7', '#0EA5E9'];
    const pieces = Array.from({ length: 36 }).map((_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 1.5,
      color: palette[index % palette.length],
    }));
    setConfettiPieces(pieces);
    window.setTimeout(() => setConfettiPieces([]), 2200);
  };

  const handleButtonClick = () => {
    if (isEditable) return;
    setShowPunchline(true);
    triggerConfetti();
  };

  const editableSpanProps = (key: FieldKey) =>
    isEditable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (event: FocusEvent<HTMLElement>) =>
            onFieldChange(key, event.currentTarget.textContent || ''),
        }
      : {};

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fef3c7]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff7dc] via-[#fef3c7] to-[#fde68a]" />
      <div className="absolute inset-0 opacity-70">
        {emojiClouds.map((cloud) => (
          <span
            key={cloud.id}
            className="absolute animate-emoji-float text-4xl sm:text-5xl"
            style={{
              top: `${cloud.top}%`,
              left: `${cloud.left}%`,
              transform: `scale(${cloud.scale}) rotate(${cloud.rotate}deg)`,
              animationDelay: `${cloud.id * 0.12}s`,
            }}
          >
            {cloud.emoji}
          </span>
        ))}
      </div>

      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="pointer-events-none absolute top-[-10%] h-3 w-1 rounded-full"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animation: `gotcha-confetti ${piece.duration}s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-[36px] border-4 border-white/70 bg-white/80 p-8 text-center shadow-[0_24px_60px_rgba(249,115,22,0.25)] backdrop-blur-md">
          {creatorName && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#f97316]">
              {creatorName} Tarafından
            </p>
          )}

          {recipientName && (
            <p className="mb-3 text-base font-medium text-[#0f172a] opacity-80">
              {recipientName} için özel bir sürpriz
            </p>
          )}

          <h1
            className={`text-4xl font-black uppercase tracking-tight text-[#0f172a] sm:text-5xl ${
              isMounted ? 'animate-[pop-bounce_600ms_ease]' : ''
            } ${isEditable ? 'cursor-text rounded-2xl px-3 py-1 hover:bg-yellow-100/60' : ''}`}
            {...editableSpanProps('title')}
          >
            {getField('title')}
          </h1>

          <p
            className={`mt-4 text-lg font-medium text-[#1f2937] sm:text-xl ${
              isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-yellow-100/60' : ''
            }`}
            {...editableSpanProps('subtitle')}
          >
            {getField('subtitle')}
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              onClick={handleButtonClick}
              className="relative flex items-center justify-center gap-2 rounded-full bg-[#0ea5e9] px-8 py-4 text-lg font-semibold text-white shadow-[0_16px_30px_rgba(14,165,233,0.35)] transition-transform hover:scale-[1.03]"
            >
              <span
                className={`${isEditable ? 'cursor-text rounded-full px-2 py-1 hover:bg-sky-500/40' : 'pointer-events-none select-none'}`}
                {...editableSpanProps('button_text')}
              >
                {getField('button_text')}
              </span>
              <span className="text-2xl">🎯</span>
            </Button>
          </div>

          {(showPunchline || isEditable) && (
            <p
              className={`mt-6 text-lg font-semibold text-[#f97316] transition-all duration-500 ${
                showPunchline ? 'opacity-100 translate-y-0' : 'translate-y-2 opacity-0'
              } ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-orange-100/60' : ''}`}
              {...editableSpanProps('afterClick_text')}
            >
              {getField('afterClick_text')}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pop-bounce {
          0% {
            transform: scale(0.6) translateY(20px);
            opacity: 0;
          }
          60% {
            transform: scale(1.05) translateY(-6px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes emoji-float {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 12px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-emoji-float {
          animation: emoji-float 4.5s ease-in-out infinite;
        }

        @keyframes gotcha-confetti {
          0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(6px, 120vh, 0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function MemeReactionStyle({ recipientName, creatorName, isEditable, getField, onFieldChange }: SharedStyleProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);

  const editableProps = (key: FieldKey) =>
    isEditable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (event: FocusEvent<HTMLElement>) =>
            onFieldChange(key, event.currentTarget.textContent || ''),
        }
      : {};

  const photoUrl = getField('image_url').trim();

  const handleButtonClick = () => {
    if (isEditable) return;
    setShowPunchline((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-white to-[#dbeafe]" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.1)] backdrop-blur">
          {creatorName && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {creatorName} tarafından paylaşıldı
            </p>
          )}

          {isEditable ? (
            <div className="mb-6 flex flex-col gap-3">
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Fotoğraf URL'sini girin"
                value={photoUrl}
                onChange={(event) => onFieldChange('image_url', event.currentTarget.value)}
              />
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={getField('image_alt') || 'Mizah fotoğrafı'}
                  className="h-64 w-full rounded-2xl object-cover shadow-inner"
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                  Fotoğraf URL&#39;si girildiğinde önizleme görünür
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={getField('image_alt') || 'Mizah fotoğrafı'}
                  className={`h-64 w-full object-cover transition-transform duration-700 ${
                    imageLoaded ? 'scale-100' : 'scale-105 opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-gradient-to-r from-slate-200 to-slate-100 text-sm text-slate-500">
                  Sosyal medya esintili görseli buraya ekle
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 text-center">
            <h2
              className={`text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl ${
                isEditable ? 'cursor-text rounded-xl px-3 py-2 hover:bg-slate-100' : ''
              }`}
              {...editableProps('title')}
            >
              {getField('title')}
            </h2>

            <p
              className={`text-base text-slate-600 sm:text-lg ${
                isEditable ? 'cursor-text rounded-xl px-3 py-2 hover:bg-slate-100' : ''
              }`}
              {...editableProps('subtitle')}
            >
              {getField('subtitle')}
            </p>

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleButtonClick}
                className="group relative overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <span
                  className={`${isEditable ? 'cursor-text rounded-full px-2 py-1 hover:bg-white/20' : 'pointer-events-none select-none'} relative z-10`}
                  {...editableProps('button_text')}
                >
                  {getField('button_text')}
                </span>
                <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-sky-400 to-indigo-500 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
              </Button>
            </div>

            {(showPunchline || isEditable) && (
              <div
                className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-700 transition-all duration-300 ${
                  showPunchline ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                } ${isEditable ? 'cursor-text hover:bg-slate-100' : ''}`}
                {...editableProps('afterClick_text')}
              >
                {getField('afterClick_text')}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        img {
          transition: transform 0.6s ease, opacity 0.4s ease;
        }
      `}</style>
    </div>
  );
}

function PrankModeStyle({ creatorName, isEditable, getField, onFieldChange }: SharedStyleProps) {
  const [showPunchline, setShowPunchline] = useState(false);
  const [flicker, setFlicker] = useState(false);

  const editableProps = (key: FieldKey) =>
    isEditable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (event: FocusEvent<HTMLElement>) =>
            onFieldChange(key, event.currentTarget.textContent || ''),
        }
      : {};

  const handleNeonClick = () => {
    if (isEditable) return;
    setShowPunchline(true);
    setFlicker(true);
    window.setTimeout(() => setFlicker(false), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f172a] to-[#020617]" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-x-0 top-1/4 h-px bg-gradient-to-r from-transparent via-[#f472b6] to-transparent" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#38bdf8] to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-black/60 p-10 text-center shadow-[0_35px_120px_rgba(56,189,248,0.3)] backdrop-blur-xl">
          {creatorName && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.45em] text-[#38bdf8]">
              {creatorName} Neon Modda
            </p>
          )}

          <h2
            className={`text-4xl font-bold uppercase tracking-[0.15em] text-transparent sm:text-5xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/5' : ''
            } neon-title`}
            {...editableProps('title')}
          >
            {getField('title')}
          </h2>

          <p
            className={`mt-5 text-base text-[#e0f2fe] sm:text-lg ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/5' : ''
            }`}
            {...editableProps('subtitle')}
          >
            {getField('subtitle')}
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              onClick={handleNeonClick}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#f472b6] via-[#38bdf8] to-[#a855f7] px-8 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(248,113,113,0.35)] transition hover:scale-[1.05]"
            >
              <span
                className={`${isEditable ? 'cursor-text rounded-full px-2 py-1 hover:bg-white/20' : 'pointer-events-none select-none'}`}
                {...editableProps('button_text')}
              >
                {getField('button_text')}
              </span>
            </Button>
          </div>

          {(showPunchline || isEditable) && (
            <div
              className={`mt-6 text-lg font-semibold text-[#f472b6] ${
                flicker ? 'animate-electric' : ''
              } ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/5' : ''}`}
              {...editableProps('afterClick_text')}
            >
              {getField('afterClick_text')}
            </div>
          )}

          <p className="mt-8 text-xs uppercase tracking-[0.45em] text-[#38bdf8]/70">
            {getField('hint_text')}
          </p>
        </div>
      </div>

      <style jsx>{`
        .neon-title {
          background-image: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.65),
            rgba(244, 114, 182, 0.95),
            rgba(16, 185, 129, 0.85)
          );
          background-clip: text;
        }

        @keyframes electric {
          0%,
          19%,
          21%,
          23%,
          25%,
          54%,
          56%,
          73%,
          75%,
          77%,
          100% {
            opacity: 1;
            text-shadow: 0 0 12px rgba(244, 114, 182, 0.8), 0 0 32px rgba(56, 189, 248, 0.6);
          }
          20%,
          24%,
          55%,
          74%,
          76% {
            opacity: 0.35;
            text-shadow: none;
          }
        }

        .animate-electric {
          animation: electric 1.2s linear;
        }
      `}</style>
    </div>
  );
}

function ReverseSurpriseStyle({ recipientName, creatorName, isEditable, getField, onFieldChange }: SharedStyleProps) {
  const [revealed, setRevealed] = useState(false);
  const [pulse, setPulse] = useState(false);

  const editableProps = (key: FieldKey) =>
    isEditable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (event: FocusEvent<HTMLElement>) =>
            onFieldChange(key, event.currentTarget.textContent || ''),
        }
      : {};

  const handleReveal = () => {
    if (isEditable) return;
    setRevealed(true);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 1200);
  };

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${revealed ? 'bg-[#fde4ff]' : 'bg-[#f5efff]'}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${revealed ? 'from-[#f97316] via-[#ec4899] to-[#8b5cf6]' : 'from-[#8b5cf6] via-[#ec4899] to-[#f97316]'}`}
      />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_55%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-[34px] border border-white/30 bg-white/75 p-8 text-center shadow-[0_32px_80px_rgba(168,85,247,0.35)] backdrop-blur-md">
          {creatorName && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#a855f7]">
              {creatorName} özel bir şey söylüyor
            </p>
          )}

          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-dashed border-white/70 bg-white/40 text-3xl text-[#f97316] transition ${
              pulse ? 'scale-105' : 'scale-100'
            }`}
          >
            🎉
          </div>

          <h3
            className={`mt-6 text-3xl font-bold text-[#1f2937] sm:text-4xl ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/60' : ''
            } ${pulse ? 'animate-[reveal-pop_600ms_ease]' : ''}`}
            {...editableProps('title')}
          >
            {getField('title')}
          </h3>

          <p
            className={`mt-4 text-base text-[#374151] sm:text-lg ${
              isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/60' : ''
            }`}
            {...editableProps('subtitle')}
          >
            {getField('subtitle') || (recipientName ? `${recipientName}, küçük bir sürprizim var.` : 'Mini bir sürprize hazır mısın?')}
          </p>

          <div className="mt-8 flex flex-col gap-6">
            <Button
              type="button"
              onClick={handleReveal}
              className={`relative overflow-hidden rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(236,72,153,0.35)] transition hover:scale-[1.05] ${
                pulse ? 'animate-[button-pulse_1.1s_ease]' : ''
              }`}
            >
              <span
                className={`${isEditable ? 'cursor-text rounded-full px-3 py-1 hover:bg-white/20' : 'pointer-events-none select-none'}`}
                {...editableProps('button_text')}
              >
                {getField('button_text')}
              </span>
            </Button>

            {(revealed || isEditable) && (
              <div
                className={`rounded-3xl border border-white/60 bg-white/80 p-6 text-lg font-semibold text-[#a855f7] shadow-inner transition-all duration-500 ${
                  revealed ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                } ${isEditable ? 'cursor-text hover:bg-white/90' : ''}`}
                {...editableProps('afterClick_text')}
              >
                {getField('afterClick_text')}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes reveal-pop {
          0% {
            transform: scale(0.92);
            opacity: 0;
          }
          60% {
            transform: scale(1.06);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes button-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 18px 45px rgba(236, 72, 153, 0.35);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 22px 60px rgba(236, 72, 153, 0.4);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent, HTMLAttributes } from 'react';
import { Heart, PenLine, Sparkles } from 'lucide-react';
import type { TemplateTextFields } from '../../shared/types';

type AffetBeniDesignStyle = 'modern' | 'classic' | 'minimalist' | 'eglenceli';

interface AffetBeniSignatureTemplateProps {
  recipientName: string;
  message: string;
  designStyle: AffetBeniDesignStyle;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

type EditableMap = Record<string, string>;

export default function AffetBeniSignatureTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields = {},
  isEditable = false,
  onTextFieldChange,
}: AffetBeniSignatureTemplateProps) {
  const [editableValues, setEditableValues] = useState<EditableMap>({});
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [showBurst, setShowBurst] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const burstTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  const computedDefaults = useMemo(() => {
    return {
      greetingPrefix: textFields.greetingPrefix ?? 'Sevgili',
      recipientName: textFields.recipientName ?? recipientName ?? '',
      mainTitle: textFields.mainTitle ?? 'Affet Beni',
      subtitle:
        textFields.subtitle ??
        'Kalbimdeki ağırlık, senden bir özür dilemeden hafiflemiyor.',
      mainMessage:
        textFields.mainMessage ??
        message ??
        'Seni kırdığımın farkındayım ve bu düşünce içimi sızlatıyor. Gözlerine tekrar güvenle bakabilmek için içtenlikle senden af diliyorum.',
      secondaryMessage:
        textFields.secondaryMessage ??
        'Bir şans daha verirsen kalbini yeniden gülümsetmek için elimden geleni yapacağım.',
      quoteMessage:
        textFields.quoteMessage ??
        'Gerçek bağlar, affedildiğimiz anlarda daha da güçlenir.',
      footerMessage:
        textFields.footerMessage ??
        'Sevgiyle bekliyorum... 💗',
      buttonPrompt:
        textFields.buttonPrompt ??
        'Kalbini yeniden kazanabilmek için bir fırsat verir misin?',
      buttonAcceptLabel: textFields.buttonAcceptLabel ?? 'Kabul Et',
      buttonRejectLabel: textFields.buttonRejectLabel ?? 'Henüz Hazır Değilim',
      letterPSS:
        textFields.letterPSS ??
        'P.S. Bu sayfayı hazırlarken her satırda seni düşündüm.',
    } satisfies EditableMap;
  }, [message, recipientName, textFields]);

  useEffect(() => {
    setEditableValues(computedDefaults);
  }, [computedDefaults]);

  const updateField = (key: string, value: string) => {
    if (isEditable) {
      setEditableValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    }

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const valueFor = (key: keyof EditableMap) => {
    if (isEditable) {
      return editableValues[key] ?? computedDefaults[key] ?? '';
    }
    return computedDefaults[key] ?? '';
  };

  const editableProps = (key: keyof EditableMap): Partial<HTMLAttributes<HTMLElement>> =>
    isEditable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (event: FocusEvent<HTMLElement>) =>
            updateField(key, event.currentTarget.textContent ?? ''),
          tabIndex: 0,
          'data-editable': 'true',
        }
      : {};

  const editableClass = (base: string) =>
    `${base} ${isEditable ? 'cursor-text rounded-md px-1 transition-colors duration-200 hover:bg-white/10 focus:outline-none editable-focus' : ''}`;

  const handleRejectHover = () => {
    const randomX = (Math.random() - 0.5) * 400;
    const randomY = (Math.random() - 0.5) * 300;
    setNoButtonOffset({ x: randomX, y: randomY });
  };

  const handleAcceptClick = () => {
    setShowBurst(true);
    if (burstTimeoutRef.current) {
      clearTimeout(burstTimeoutRef.current);
    }
    burstTimeoutRef.current = setTimeout(() => {
      setShowBurst(false);
    }, 1200);
  };

  const sharedAnimationStyles = (
    <style>{`
      @keyframes floatSlow {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
        100% { transform: translateY(0px); }
      }
      @keyframes burstPop {
        0% { opacity: 0; transform: scale(0.5); }
        40% { opacity: 1; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(0.4); }
      }
      .editable-focus[contenteditable="true"] {
        transition: box-shadow 0.2s ease, background-color 0.2s ease;
        outline: none;
      }
      .editable-focus[contenteditable="true"]:focus {
        box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.4), 0 18px 40px rgba(241, 126, 184, 0.18);
        background-color: rgba(255, 255, 255, 0.16);
      }
    `}</style>
  );

  const renderBurstOverlay = () => {
    if (!showBurst) return null;
    return (
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative">
          {[...Array(14)].map((_, index) => (
            <span
              key={`burst-${index}`}
              className="absolute text-4xl"
              style={{
                left: `${50 + Math.cos((index / 14) * 2 * Math.PI) * 120}%`,
                top: `${50 + Math.sin((index / 14) * 2 * Math.PI) * 120}%`,
                animation: `burstPop 1s ease-out ${index * 0.05}s both`,
              }}
            >
              💖
            </span>
          ))}
        </div>
      </div>
    );
  };

  const modernBackground = (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fde2df] via-[#fff5ef] to-[#ffe9f0]" />
      {isMounted && [...Array(18)].map((_, index) => (
        <span
          key={index}
          className="absolute h-32 w-32 rounded-full bg-white/30 blur-3xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.35}s`,
          }}
        />
      ))}
      {isMounted && [...Array(12)].map((_, index) => (
        <span
          key={`heart-${index}`}
          className="absolute text-3xl text-rose-200/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatSlow ${8 + Math.random() * 4}s ease-in-out ${index * 0.45}s infinite`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );

  const classicBackground = (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[#fef4ec]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_70%)]" />
      {isMounted && [...Array(10)].map((_, index) => (
        <span
          key={`ink-${index}`}
          className="absolute rounded-full bg-amber-900/5"
          style={{
            width: `${40 + Math.random() * 80}px`,
            height: `${40 + Math.random() * 80}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );

  const minimalistBackground = (
    <div className="absolute inset-0 bg-white" />
  );

  const playfulBackground = (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffe4f1] via-[#ffd6d6] to-[#c8f7ff]" />
      {isMounted && [...Array(20)].map((_, index) => (
        <span
          key={`float-heart-${index}`}
          className="absolute text-4xl animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.1}s`,
          }}
        >
          💘
        </span>
      ))}
      {isMounted && [...Array(15)].map((_, index) => (
        <span
          key={`cloud-${index}`}
          className="absolute rounded-full bg-white/35 blur-3xl"
          style={{
            width: `${120 + Math.random() * 160}px`,
            height: `${80 + Math.random() * 120}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatSlow ${10 + Math.random() * 6}s ease-in-out ${index * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );

  const renderModern = () => (
    <div className="relative min-h-screen w-full overflow-hidden">
      {renderBurstOverlay()}
      {modernBackground}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-12 sm:px-8">
        <div className="w-full rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-xl sm:p-12">
          {creatorName && (
            <div className="mb-6 text-center text-sm text-neutral-600">
              Hazırlayan: {creatorName}
            </div>
          )}

          <div className="mb-8 text-center">
            <p
              className={editableClass('text-xs uppercase tracking-[0.5em] text-rose-500/80')}
              {...editableProps('greetingPrefix')}
            >
              {valueFor('greetingPrefix')}
            </p>
            <h1
              className={editableClass('mt-4 text-3xl font-semibold text-neutral-900 sm:text-4xl')}
              {...editableProps('recipientName')}
            >
              {valueFor('recipientName') || 'Kalbimin Sahibi'}
            </h1>
            <h2
              className={editableClass('mt-6 text-4xl font-bold text-rose-600 sm:text-5xl md:text-6xl')}
              {...editableProps('mainTitle')}
            >
              {valueFor('mainTitle')}
            </h2>
            <p
              className={editableClass('mt-6 text-base text-neutral-600 sm:text-lg')}
              {...editableProps('subtitle')}
            >
              {valueFor('subtitle')}
            </p>
          </div>

          <div className="relative mx-auto max-w-2xl rounded-2xl border border-rose-200/50 bg-white/70 p-6 shadow-inner">
            <Sparkles className="absolute -top-6 left-4 h-10 w-10 text-rose-300" />
            <Sparkles className="absolute -bottom-6 right-4 h-10 w-10 text-rose-300" />
            <p
              className={editableClass('text-base leading-relaxed text-neutral-700 sm:text-lg')}
              {...editableProps('mainMessage')}
            >
              {valueFor('mainMessage')}
            </p>
            <div className="mt-4 border-t border-rose-200/50 pt-4">
              <p
                className={editableClass('text-sm text-neutral-600 sm:text-base')}
                {...editableProps('secondaryMessage')}
              >
                {valueFor('secondaryMessage')}
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p
              className={editableClass('mx-auto max-w-xl text-sm italic text-neutral-500 sm:text-base')}
              {...editableProps('quoteMessage')}
            >
              {valueFor('quoteMessage')}
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <p
              className={editableClass('text-sm text-neutral-600 sm:text-base')}
              {...editableProps('buttonPrompt')}
            >
              {valueFor('buttonPrompt')}
            </p>
            <button
              onClick={handleAcceptClick}
              className="group flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span
                className={editableClass('text-sm font-semibold uppercase tracking-wide')}
                {...editableProps('buttonAcceptLabel')}
              >
                {valueFor('buttonAcceptLabel')}
              </span>
            </button>
          </div>

          <div className="mt-10 border-t border-white/50 pt-6 text-center">
            <p
              className={editableClass('text-sm text-neutral-500 sm:text-base')}
              {...editableProps('footerMessage')}
            >
              {valueFor('footerMessage')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="relative min-h-screen w-full overflow-hidden">
      {renderBurstOverlay()}
      {classicBackground}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-12 sm:px-8">
        <div className="relative w-full rounded-[40px] border border-amber-200/80 bg-gradient-to-b from-[#fff9f2]/95 via-[#fff3e4]/95 to-[#fbe4d1]/95 p-6 shadow-2xl backdrop-blur">
          <div className="absolute inset-x-10 -top-10 mx-auto flex h-20 w-[85%] items-center justify-center rounded-3xl border border-amber-200 bg-[#f8e7d3]/90 shadow-md">
            <PenLine className="mr-2 h-6 w-6 text-amber-700" />
            <p
              className={editableClass('text-sm font-semibold tracking-[0.4em] text-amber-700')}
              {...editableProps('mainTitle')}
            >
              {valueFor('mainTitle')}
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-[1.2fr_1fr]">
            <div className="relative rounded-3xl border border-amber-200 bg-[#fff8f1]/95 p-6 shadow-inner">
              <div className="absolute inset-x-6 -top-10 h-10 rounded-t-3xl bg-gradient-to-b from-[#f0d6b9] to-transparent" />
              <div className="relative">
                <p
                  className={editableClass('text-sm uppercase tracking-[0.3em] text-amber-600')}
                  {...editableProps('greetingPrefix')}
                >
                  {valueFor('greetingPrefix')}
                </p>
                <h2
                  className={editableClass('mt-3 text-3xl font-semibold text-amber-900 sm:text-4xl')}
                  {...editableProps('recipientName')}
                >
                  {valueFor('recipientName') || 'Değerlim'}
                </h2>
                <p
                  className={editableClass('mt-6 text-base leading-relaxed text-amber-900/90 sm:text-lg')}
                  {...editableProps('mainMessage')}
                >
                  {valueFor('mainMessage')}
                </p>
                <p
                  className={editableClass('mt-6 text-base italic text-amber-700/90')}
                  {...editableProps('secondaryMessage')}
                >
                  {valueFor('secondaryMessage')}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div className="rounded-3xl border border-amber-300 bg-white/90 p-6 shadow-inner">
                <p
                  className={editableClass('text-sm text-amber-700/80')}
                  {...editableProps('subtitle')}
                >
                  {valueFor('subtitle')}
                </p>
                <div className="mt-6 rounded-2xl border border-amber-200 bg-[#fff5ea]/90 p-5 shadow-sm">
                  <p
                    className={editableClass('text-sm text-amber-900/80')}
                    {...editableProps('quoteMessage')}
                  >
                    {valueFor('quoteMessage')}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-[#fff5ea]/90 p-6 shadow-md">
                <p
                  className={editableClass('text-sm text-amber-700/90')}
                  {...editableProps('buttonPrompt')}
                >
                  {valueFor('buttonPrompt')}
                </p>
                <button
                  onClick={handleAcceptClick}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-amber-400 bg-gradient-to-r from-amber-500 to-rose-400 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span
                    className={editableClass('tracking-wide')}
                    {...editableProps('buttonAcceptLabel')}
                  >
                    {valueFor('buttonAcceptLabel')}
                  </span>
                </button>
              </div>

              <p
                className={editableClass('text-sm text-amber-700/80')}
                {...editableProps('footerMessage')}
              >
                {valueFor('footerMessage')}
              </p>
              <p
                className={editableClass('text-xs text-amber-600/70')}
                {...editableProps('letterPSS')}
              >
                {valueFor('letterPSS')}
              </p>
            </div>
          </div>

          {creatorName && (
            <div className="mt-10 text-center text-xs text-amber-600/70">
              {creatorName} tarafından sevgiyle gönderildi.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMinimalist = () => (
    <div className="relative min-h-screen w-full overflow-hidden">
      {renderBurstOverlay()}
      {minimalistBackground}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p
              className={editableClass('text-xs uppercase tracking-[0.6em] text-neutral-400')}
              {...editableProps('greetingPrefix')}
            >
              {valueFor('greetingPrefix')}
            </p>
            <h1
              className={editableClass('text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl')}
              {...editableProps('mainTitle')}
            >
              {valueFor('mainTitle')}
            </h1>
            <div className="flex items-center justify-center gap-3 text-neutral-400">
              <span className="inline-flex h-0.5 w-10 bg-neutral-200" />
              <Heart className="h-5 w-5 text-rose-400 animate-pulse" />
              <span className="inline-flex h-0.5 w-10 bg-neutral-200" />
            </div>
          </div>

          <div className="space-y-6">
            <p
              className={editableClass('text-base text-neutral-500 sm:text-lg')}
              {...editableProps('subtitle')}
            >
              {valueFor('subtitle')}
            </p>
            <p
              className={editableClass('text-lg leading-relaxed text-neutral-700 sm:text-xl')}
              {...editableProps('mainMessage')}
            >
              {valueFor('mainMessage')}
            </p>
            <p
              className={editableClass('text-sm text-neutral-500')}
              {...editableProps('secondaryMessage')}
            >
              {valueFor('secondaryMessage')}
            </p>
          </div>

          <div className="space-y-4">
            <p
              className={editableClass('text-sm uppercase tracking-[0.3em] text-neutral-400')}
              {...editableProps('buttonPrompt')}
            >
              {valueFor('buttonPrompt')}
            </p>
            <button
              onClick={handleAcceptClick}
              className="rounded-full border border-neutral-800 px-8 py-3 text-sm font-medium tracking-wide text-neutral-800 transition hover:bg-neutral-900 hover:text-white"
            >
              <span
                className={editableClass('')}
                {...editableProps('buttonAcceptLabel')}
              >
                {valueFor('buttonAcceptLabel')}
              </span>
            </button>
          </div>

          <p
            className={editableClass('text-sm text-neutral-400')}
            {...editableProps('footerMessage')}
          >
            {valueFor('footerMessage')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPlayful = () => (
    <div className="relative min-h-screen w-full overflow-hidden">
      {renderBurstOverlay()}
      {playfulBackground}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative w-full rounded-[32px] border border-pink-200/80 bg-white/80 p-8 shadow-2xl backdrop-blur-lg sm:p-12">
          {creatorName && (
            <p className="mb-4 text-sm text-rose-600/80">Hazırlayan: {creatorName}</p>
          )}

          <div className="space-y-4">
            <p
              className={editableClass('text-xs uppercase tracking-[0.5em] text-rose-500')}
              {...editableProps('greetingPrefix')}
            >
              {valueFor('greetingPrefix')}
            </p>
            <h1
              className={editableClass('text-4xl font-black text-rose-600 drop-shadow-sm sm:text-5xl')}
              {...editableProps('mainTitle')}
            >
              {valueFor('mainTitle')}
            </h1>
            <p
              className={editableClass('text-lg text-rose-500 sm:text-xl')}
              {...editableProps('subtitle')}
            >
              {valueFor('subtitle')}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <p
              className={editableClass('text-base leading-relaxed text-neutral-700 sm:text-lg')}
              {...editableProps('mainMessage')}
            >
              {valueFor('mainMessage')}
            </p>
            <p
              className={editableClass('text-base text-rose-500/90')}
              {...editableProps('secondaryMessage')}
            >
              {valueFor('secondaryMessage')}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <p
              className={editableClass('text-sm text-neutral-600')}
              {...editableProps('buttonPrompt')}
            >
              {valueFor('buttonPrompt')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={handleAcceptClick}
                className="group flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-white shadow-lg transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
              >
                <Heart className="h-5 w-5 animate-pulse" />
                <span
                  className={editableClass('text-sm font-semibold uppercase tracking-wide')}
                  {...editableProps('buttonAcceptLabel')}
                >
                  {valueFor('buttonAcceptLabel')}
                </span>
              </button>
              <button
                onMouseEnter={handleRejectHover}
                onFocus={handleRejectHover}
                style={{ transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)` }}
                className="rounded-full border border-rose-400 bg-white px-6 py-3 text-sm font-semibold text-rose-500 shadow-md transition-all hover:bg-rose-50"
              >
                <span
                  className={editableClass('')}
                  {...editableProps('buttonRejectLabel')}
                >
                  {valueFor('buttonRejectLabel')}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-rose-200/60 pt-6">
            <p
              className={editableClass('text-sm text-neutral-500')}
              {...editableProps('footerMessage')}
            >
              {valueFor('footerMessage')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWithAnimations = (content: JSX.Element) => (
    <>
      {sharedAnimationStyles}
      {content}
    </>
  );

  switch (designStyle) {
    case 'classic':
      return renderWithAnimations(renderClassic());
    case 'minimalist':
      return renderWithAnimations(renderMinimalist());
    case 'eglenceli':
      return renderWithAnimations(renderPlayful());
    case 'modern':
    default:
      return renderWithAnimations(renderModern());
  }
}

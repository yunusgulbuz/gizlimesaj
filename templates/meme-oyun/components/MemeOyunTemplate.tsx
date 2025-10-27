'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface MemeOyunTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULT_FIELDS = {
  recipientName: 'Arkadaşım',
  mainMessage: 'Şaka tam gaz, finalde kahkaha garantili! 😄',
  musicUrl: '',
  swipeTitle: 'Kaydır ve Şakayı Aç ➡️',
  swipeSubtitle: 'Kartları kaydır, finali yakala.',
  swipeBadgeText: '',
  swipeHint1: 'İpucu 1',
  swipeHint2: 'İpucu 2',
  swipeFinalMessage: 'Punchline burada!',
  captionTitle: 'Başlığı Yerine Koy ✍️',
  captionSubtitle: 'Etiketleri sürükle, komik finali oku.',
  captionBadgeText: '',
  captionPhotoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
  captionCaptions: 'Caption A\nCaption B\nCaption C',
  captionFinalMessage: 'Tamamlandı! Punchline burada.',
  meterTitle: 'Kahkaha Ölçer\'i Doldur 😂',
  meterSubtitle: 'Dokundukça yükselsin, finali aç.',
  meterBadgeText: '',
  meterGoalPercent: '100',
  meterTapLabel: 'Dokun',
  meterFinalMessage: 'Maksimum kahkaha! Punchline açıldı.',
  stripTitle: 'Mini Komik 3 Panel 🎞️',
  stripSubtitle: 'Dokun ve sahneyi ilerlet.',
  stripBadgeText: '',
  stripPanel1: 'Panel 1 — İpucu',
  stripPanel2: 'Panel 2 — Kurulum',
  stripPanel3: 'Panel 3 — Punchline',
  stripFinalMessage: 'Şaka tamamlandı!'
} as const;

type FieldKey = keyof typeof DEFAULT_FIELDS;

interface SharedProps {
  fields: Record<FieldKey, string>;
  isEditable: boolean;
  onFieldChange: (key: FieldKey, value: string) => void;
  creatorName?: string;
  mainMessage: string;
  recipientName: string;
}

const parseList = (value: string | undefined, fallback: string[] = []) => {
  if (!value) return fallback;
  const parsed = value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return parsed.length ? parsed : fallback;
};

export default function MemeOyunTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: MemeOyunTemplateProps) {
  const defaults = useMemo<Record<FieldKey, string>>(() => {
    const base = { ...(DEFAULT_FIELDS as Record<FieldKey, string>) };
    base.recipientName = recipientName || DEFAULT_FIELDS.recipientName;
    base.mainMessage = message || DEFAULT_FIELDS.mainMessage;
    return base;
  }, [recipientName, message]);

  const resolvedFields = useMemo<Record<FieldKey, string>>(() => {
    const merged = { ...defaults };
    if (textFields) {
      Object.entries(textFields).forEach(([key, value]) => {
        if (value !== undefined && (key as FieldKey) in DEFAULT_FIELDS) {
          merged[key as FieldKey] = value;
        }
      });
    }
    return merged;
  }, [defaults, textFields]);

  const [localFields, setLocalFields] = useState<Record<FieldKey, string>>(resolvedFields);

  useEffect(() => {
    setLocalFields(resolvedFields);
  }, [resolvedFields]);

  const handleFieldChange = useCallback(
    (key: FieldKey, value: string) => {
      setLocalFields((prev) => ({ ...prev, [key]: value }));
      onTextFieldChange?.(key, value);
    },
    [onTextFieldChange]
  );

  const fieldValues = isEditable ? localFields : resolvedFields;

  const sharedProps: SharedProps = {
    fields: fieldValues,
    isEditable,
    onFieldChange: handleFieldChange,
    creatorName,
    mainMessage: fieldValues.mainMessage,
    recipientName: fieldValues.recipientName || recipientName || DEFAULT_FIELDS.recipientName,
  };

  switch (designStyle) {
    case 'classic':
      return <CaptionBuilderGame {...sharedProps} />;
    case 'minimalist':
      return <ReactionMeterGame {...sharedProps} />;
    case 'eglenceli':
      return <MinimalStripGame {...sharedProps} />;
    case 'modern':
    default:
      return <SwipeRevealGame {...sharedProps} />;
  }
}

function SwipeRevealGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedProps) {
  const cards = useMemo(
    () => [
      { key: 'swipeHint1', label: fields.swipeHint1 || DEFAULT_FIELDS.swipeHint1 },
      { key: 'swipeHint2', label: fields.swipeHint2 || DEFAULT_FIELDS.swipeHint2 },
      { key: 'swipeFinalMessage', label: fields.swipeFinalMessage || DEFAULT_FIELDS.swipeFinalMessage, isFinal: true },
    ],
    [fields.swipeHint1, fields.swipeHint2, fields.swipeFinalMessage]
  );

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [fields.swipeHint1, fields.swipeHint2, fields.swipeFinalMessage]);

  const handlePointerDown = useCallback(() => {
    if (isEditable) return;
    setIsDragging(true);
  }, [isEditable]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || isEditable) return;
      setDragX((prev) => {
        const next = prev + event.movementX;
        return Math.max(Math.min(next, 180), -180);
      });
    },
    [isDragging, isEditable]
  );

  const handlePointerUp = useCallback(() => {
    if (isEditable) return;
    if (Math.abs(dragX) > 90) {
      setIndex((prev) => Math.min(prev + 1, cards.length - 1));
    }
    setDragX(0);
    setIsDragging(false);
  }, [dragX, cards.length, isEditable]);

  useEffect(() => {
    setDragX(0);
    setIsDragging(false);
  }, [index]);

  const currentCard = cards[index];
  const progress = Math.round(((index + 1) / cards.length) * 100);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e3a8a] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.2),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_90%_20%,_rgba(59,130,246,0.18),_transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full text-center">
          <p
            className={`text-xs uppercase tracking-[0.35em] text-white/60 ${isEditable ? 'cursor-text rounded-full px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('swipeBadgeText', event.currentTarget.textContent || '')}
          >
            {fields.swipeBadgeText || (recipientName ? `${recipientName} ile swipe şakası` : 'Swipe şakası')}
          </p>
          <h1
            className={`mt-4 text-3xl font-semibold sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('swipeTitle', event.currentTarget.textContent || '')}
          >
            {fields.swipeTitle || DEFAULT_FIELDS.swipeTitle}
          </h1>
          <p
            className={`mt-3 text-base text-white/70 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('swipeSubtitle', event.currentTarget.textContent || '')}
          >
            {fields.swipeSubtitle || DEFAULT_FIELDS.swipeSubtitle}
          </p>
        </div>

        <div className="mt-10 w-full">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/60">
            <span>İlerleme</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#93c5fd] transition-all duration-500"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>
        </div>

        <div className="relative mt-10 w-full">
          <div
            className={`relative h-[380px] w-full touch-none select-none overflow-hidden rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_35px_80px_rgba(37,99,235,0.25)] transition-transform duration-500 ${
              isDragging ? 'scale-[1.01]' : ''
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className={`absolute inset-0 flex flex-col justify-center px-8 text-center transition-all duration-500 ${
                currentCard.isFinal ? 'bg-gradient-to-br from-white/85 to-white/65 text-slate-900' : 'bg-transparent'
              }`}
              style={{
                transform: `translateX(${dragX}px) rotate(${dragX / 30}deg)`,
              }}
            >
              {currentCard.isFinal && <span className="mb-3 text-4xl">🎉</span>}
              <p
                className={`text-xl font-semibold sm:text-2xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/25' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange(currentCard.key as FieldKey, event.currentTarget.textContent || '')}
              >
                {currentCard.label}
              </p>
            </div>
            {!currentCard.isFinal && !isEditable && (
              <>
                <div className="pointer-events-none absolute inset-y-10 left-6 hidden w-12 rounded-lg border border-white/15 bg-white/10 sm:flex sm:flex-col sm:items-center sm:justify-center">
                  <span className="text-xs">⬅️</span>
                  <span className="mt-1 text-[0.6rem] uppercase tracking-[0.3em]">Kaydır</span>
                </div>
                <div className="pointer-events-none absolute inset-y-10 right-6 hidden w-12 rounded-lg border border-white/15 bg-white/10 sm:flex sm:flex-col sm:items-center sm:justify-center">
                  <span className="text-xs">➡️</span>
                  <span className="mt-1 text-[0.6rem] uppercase tracking-[0.3em]">Kaydır</span>
                </div>
              </>
            )}
          </div>
        </div>

        {isEditable && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs">
            {cards.map((cardItem, cardIndex) => (
              <button
                key={`${cardItem.key}-${cardIndex}`}
                type="button"
                onClick={() => setIndex(cardIndex)}
                className={`rounded-full px-4 py-2 font-semibold transition-all duration-200 ${
                  index === cardIndex
                    ? 'bg-white/80 text-slate-900 shadow-[0_12px_25px_rgba(59,130,246,0.25)]'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                Kart {cardIndex + 1}
              </button>
            ))}
          </div>
        )}

        <div
          className={`mt-10 w-full rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl transition-all duration-500 ${
            index === cards.length - 1 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">Final</p>
          <p
            className={`mt-3 text-base text-white/80 ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
          >
            {mainMessage}
          </p>
        </div>

        {creatorName && (
          <p className="mt-8 text-sm text-white/60">Hazırlayan: {creatorName}</p>
        )}
      </div>
    </div>
  );
}

function CaptionBuilderGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedProps) {
  const captions = useMemo(
    () => parseList(fields.captionCaptions, parseList(DEFAULT_FIELDS.captionCaptions)),
    [fields.captionCaptions]
  );

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected([]);
  }, [fields.captionCaptions]);

  const handleCaptionClick = useCallback(
    (caption: string) => {
      if (isEditable) return;
      setSelected((prev) => {
        if (prev.includes(caption)) {
          return prev.filter((item) => item !== caption);
        }
        if (prev.length === captions.length) {
          return prev;
        }
        return [...prev, caption];
      });
    },
    [captions.length, isEditable]
  );

  const slots = useMemo(() => {
    const arr = Array.from({ length: captions.length }, (_, index) => selected[index] ?? '');
    return arr;
  }, [captions.length, selected]);

  const isComplete = slots.every(Boolean) && slots.length === captions.length;
  const showFinal = isComplete || isEditable;

  const backgroundUrl = fields.captionPhotoUrl || DEFAULT_FIELDS.captionPhotoUrl;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#111827] via-[#000000] to-[#1f2937] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.2),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_80deg_at_20%_20%,_rgba(249,115,22,0.2),_transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full text-center">
          <p
            className={`text-xs uppercase tracking-[0.35em] text-white/60 ${isEditable ? 'cursor-text rounded-full px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('captionBadgeText', event.currentTarget.textContent || '')}
          >
            {fields.captionBadgeText || (recipientName ? `${recipientName} ile caption oyunu` : 'Caption oyunu')}
          </p>
          <h2
            className={`mt-4 text-3xl font-semibold sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('captionTitle', event.currentTarget.textContent || '')}
          >
            {fields.captionTitle || DEFAULT_FIELDS.captionTitle}
          </h2>
          <p
            className={`mt-3 max-w-3xl text-base text-white/70 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('captionSubtitle', event.currentTarget.textContent || '')}
          >
            {fields.captionSubtitle || DEFAULT_FIELDS.captionSubtitle}
          </p>
        </div>

        <div className="mt-10 grid w-full gap-8 sm:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(249,115,22,0.25)]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 blur-sm"
              style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            <div className="relative z-10 h-full w-full bg-gradient-to-b from-black/40 via-black/30 to-black/60 px-6 py-8 sm:px-10">
              <div className="flex flex-col gap-4">
                {slots.map((slot, index) => (
                  <div
                    key={`slot-${index}`}
                    className={`min-h-[60px] rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-left text-sm text-white transition-all duration-300 ${
                      slot ? 'border-[#f97316] bg-[#f97316]/20 shadow-[0_12px_30px_rgba(249,115,22,0.35)]' : ''
                    }`}
                  >
                    <span
                      className={`${isEditable ? 'cursor-text rounded-xl px-2 py-1 hover:bg-black/20' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) => {
                        if (!isEditable) return;
                        const editedCaptions = [...captions];
                        editedCaptions[index] = event.currentTarget.textContent || '';
                        onFieldChange('captionCaptions', editedCaptions.join('\n'));
                      }}
                    >
                      {slot || captions[index] || `Başlık ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>

              {isEditable && (
                <div className="mt-6 text-xs text-white/70">
                  <span className="block text-[0.65rem] uppercase tracking-[0.35em] text-white/50">Fotoğraf URL</span>
                  <span
                    className="mt-2 inline-block w-full cursor-text rounded-2xl bg-white/10 px-3 py-2 text-left hover:bg-white/15"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) => onFieldChange('captionPhotoUrl', event.currentTarget.textContent?.trim() || '')}
                  >
                    {backgroundUrl}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="space-y-3">
              {captions.map((caption, index) => {
                const isActive = selected.includes(caption);
                return (
                  <button
                    key={`${caption}-${index}`}
                    type="button"
                    onClick={() => handleCaptionClick(caption)}
                    className={`w-full rounded-full border border-white/15 px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isEditable
                        ? 'cursor-default bg-white/10 text-white/80'
                        : isActive
                        ? 'bg-[#f97316] text-white shadow-[0_12px_24px_rgba(249,115,22,0.35)]'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <span
                      className={`${isEditable ? 'cursor-text rounded-full px-3 py-1 hover:bg-white/10' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) => {
                        if (!isEditable) return;
                        const edited = [...captions];
                        edited[index] = event.currentTarget.textContent || '';
                        onFieldChange('captionCaptions', edited.join('\n'));
                      }}
                    >
                      {caption}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-8 rounded-3xl border border-white/10 bg-white/10 p-5 text-center transition-all duration-500 ${
                showFinal ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Final</p>
              <p
                className={`mt-3 text-base text-white ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('captionFinalMessage', event.currentTarget.textContent || '')}
              >
                {fields.captionFinalMessage || DEFAULT_FIELDS.captionFinalMessage}
              </p>
              <p
                className={`mt-4 text-sm text-white/70 ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
              >
                {mainMessage}
              </p>
            </div>
          </div>
        </div>

        {creatorName && (
          <p className="mt-10 text-sm text-white/60">Hazırlayan: {creatorName}</p>
        )}
      </div>
    </div>
  );
}

function ReactionMeterGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedProps) {
  const goal = useMemo(() => {
    const parsed = parseInt(fields.meterGoalPercent || DEFAULT_FIELDS.meterGoalPercent, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 100;
    }
    return Math.min(Math.max(parsed, 10), 300);
  }, [fields.meterGoalPercent]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [goal]);

  const handleTap = useCallback(() => {
    if (isEditable) return;
    setProgress((prev) => {
      const increment = Math.max(Math.round(goal / 6), 10);
      return Math.min(prev + increment, goal);
    });
  }, [goal, isEditable]);

  const percent = Math.round((progress / goal) * 100);
  const completed = percent >= 100;
  const showFinal = completed || isEditable;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(132,204,22,0.25),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_160deg_at_10%_10%,_rgba(34,197,94,0.25),_transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 pb-20 pt-20 text-center">
        <p
          className={`text-xs uppercase tracking-[0.35em] text-white/60 ${isEditable ? 'cursor-text rounded-full px-4 py-2 hover:bg-white/10' : ''}`}
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(event) => onFieldChange('meterBadgeText', event.currentTarget.textContent || '')}
        >
          {fields.meterBadgeText || (recipientName ? `${recipientName} ile kahkaha ölçer` : 'Kahkaha ölçer oyunu')}
        </p>
        <h2
          className={`mt-4 text-3xl font-semibold sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(event) => onFieldChange('meterTitle', event.currentTarget.textContent || '')}
        >
          {fields.meterTitle || DEFAULT_FIELDS.meterTitle}
        </h2>
        <p
          className={`mt-3 text-base text-white/70 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(event) => onFieldChange('meterSubtitle', event.currentTarget.textContent || '')}
        >
          {fields.meterSubtitle || DEFAULT_FIELDS.meterSubtitle}
        </p>

        <div className="mt-12 flex w-full flex-col items-center gap-6">
          <div className="relative h-64 w-16 rounded-full border border-white/10 bg-white/10 p-3 shadow-[0_25px_60px_rgba(132,204,22,0.25)]">
            <div className="absolute inset-3 rounded-full bg-[#1f2937]" />
            <div
              className="absolute bottom-3 left-3 right-3 overflow-hidden rounded-full bg-gradient-to-t from-[#22c55e] via-[#4ade80] to-[#bbf7d0] transition-all duration-500"
              style={{ height: `${Math.max(percent, 6)}%` }}
            />
            <div className="absolute inset-3 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute inset-x-3 top-6 flex flex-col items-center gap-16 text-[0.6rem] uppercase tracking-[0.35em] text-white/40">
              <span>😂</span>
              <span>😄</span>
              <span>🙂</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTap}
            className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
              isEditable
                ? 'cursor-default border border-white/10 bg-white/10 text-white/80'
                : 'bg-[#84CC16] text-[#0f172a] shadow-[0_18px_35px_rgba(132,204,22,0.45)] hover:bg-[#a3e635]'
            }`}
          >
            <span
              className={`${isEditable ? 'cursor-text rounded-full px-3 py-1 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('meterTapLabel', event.currentTarget.textContent || '')}
            >
              {fields.meterTapLabel || DEFAULT_FIELDS.meterTapLabel}
            </span>
          </button>

          <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Seviye</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {Math.min(percent, 100)}%
              <span className="ml-2 text-sm text-white/60">/{goal}</span>
            </p>
          </div>
        </div>

        <div
          className={`mt-12 w-full rounded-3xl border border-white/10 bg-white/10 p-6 transition-all duration-500 ${
            showFinal ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Final</p>
          <p
            className={`mt-3 text-base text-white ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('meterFinalMessage', event.currentTarget.textContent || '')}
          >
            {fields.meterFinalMessage || DEFAULT_FIELDS.meterFinalMessage}
          </p>
          <p
            className={`mt-4 text-sm text-white/70 ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
          >
            {mainMessage}
          </p>
        </div>

        {creatorName && (
          <p className="mt-8 text-sm text-white/60">Hazırlayan: {creatorName}</p>
        )}
      </div>
    </div>
  );
}

function MinimalStripGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedProps) {
  const panels = useMemo(
    () => [
      fields.stripPanel1 || DEFAULT_FIELDS.stripPanel1,
      fields.stripPanel2 || DEFAULT_FIELDS.stripPanel2,
      fields.stripPanel3 || DEFAULT_FIELDS.stripPanel3,
    ],
    [fields.stripPanel1, fields.stripPanel2, fields.stripPanel3]
  );

  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [fields.stripPanel1, fields.stripPanel2, fields.stripPanel3]);

  const handleAdvance = useCallback(() => {
    if (isEditable) return;
    setStep((prev) => Math.min(prev + 1, panels.length));
  }, [panels.length, isEditable]);

  const showFinal = step >= panels.length || isEditable;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#000000] via-[#111827] to-[#25184a] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_200deg_at_80%_20%,_rgba(59,130,246,0.2),_transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full text-center">
          <p
            className={`text-xs uppercase tracking-[0.35em] text-white/60 ${isEditable ? 'cursor-text rounded-full px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('stripBadgeText', event.currentTarget.textContent || '')}
          >
            {fields.stripBadgeText || (recipientName ? `${recipientName} ile 3 panel şaka` : '3 panel şaka')}
          </p>
          <h2
            className={`mt-4 text-3xl font-semibold sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('stripTitle', event.currentTarget.textContent || '')}
          >
            {fields.stripTitle || DEFAULT_FIELDS.stripTitle}
          </h2>
          <p
            className={`mt-3 max-w-2xl text-base text-white/70 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('stripSubtitle', event.currentTarget.textContent || '')}
          >
            {fields.stripSubtitle || DEFAULT_FIELDS.stripSubtitle}
          </p>
        </div>

        <div className="mt-12 flex w-full flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {panels.map((panel, index) => {
              const isActive = step >= index;
              return (
                <div
                  key={`panel-${index}`}
                  className={`group relative flex min-h-[180px] flex-col justify-center rounded-[24px] border border-white/10 bg-white/5 px-4 py-6 text-center transition-all duration-500 ${
                    isActive
                      ? 'border-white/30 bg-white/20 text-white shadow-[0_22px_50px_rgba(139,92,246,0.3)]'
                      : 'text-white/50'
                  }`}
                >
                  <span className="text-xs uppercase tracking-[0.4em] text-white/40">Panel {index + 1}</span>
                  <p
                    className={`mt-3 text-base font-semibold ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) => onFieldChange((`stripPanel${index + 1}` as FieldKey), event.currentTarget.textContent || '')}
                  >
                    {panel}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAdvance}
            className={`mx-auto rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
              isEditable
                ? 'cursor-default border border-white/10 bg-white/10 text-white/80'
                : 'bg-white text-[#1f2937] shadow-[0_18px_40px_rgba(139,92,246,0.35)] hover:bg-[#ede9fe]'
            }`}
          >
            {step >= panels.length ? '🎉' : 'Devam'}
          </button>
        </div>

        <div
          className={`mt-12 w-full rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl transition-all duration-500 ${
            showFinal ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Final</p>
          <p
            className={`mt-3 text-base text-white ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('stripFinalMessage', event.currentTarget.textContent || '')}
          >
            {fields.stripFinalMessage || DEFAULT_FIELDS.stripFinalMessage}
          </p>
          <p
            className={`mt-4 text-sm text-white/70 ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
          >
            {mainMessage}
          </p>
        </div>

        {creatorName && (
          <p className="mt-10 text-sm text-white/60">Hazırlayan: {creatorName}</p>
        )}
      </div>
    </div>
  );
}

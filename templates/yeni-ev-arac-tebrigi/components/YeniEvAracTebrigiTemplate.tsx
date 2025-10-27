'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface YeniEvAracTebrigiTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULT_FIELDS = {
  recipientName: 'Sevgili Dostum',
  mainMessage: 'Bu yeni başlangıcın her anahtarı mutluluk getirsin; evin de aracın da hep hikayelerle dolsun. 🏡🚗',
  musicUrl: '',
  keyHeadline: 'Anahtarı Yakala! 🗝️',
  keySubtitle: 'Anahtarlara dokun, tebrik mesajını aç!',
  keyWords: 'Yeni\nBaşlangıç\nMutluluk\nKilidi\nSende\n🏡🚗',
  keyCompletionTitle: 'Tüm Anahtarlar Senin! 🔑',
  keyCompletionMessage: 'Artık her kapı sana açılıyor. Yeni evinde ve aracında güzel anılar biriktir.',
  keyHint: 'Ekranda kayan anahtarlara dokun; renk değiştirip gizli kelimeleri ortaya çıkarıyor.',
  garageHeadline: 'Yeni Aracın Hayırlı Olsun! 🚗',
  garageSubtitle: 'Parmağınla kazı, garaj kapısı açıldığında sürpriz mesajı gör.',
  garageHiddenMessage: 'Uzun yollar, güvenli sürüşler ve kahkaha dolu anılar seninle olsun. 🚘✨',
  garageCompletionTitle: 'Garaj Kapısı Açıldı! 🎉',
  garageCompletionText: 'Kutlamaya hazır mısın? İlk yolculuk nereye olsun, birlikte seçelim.',
  garageConfettiMessage: 'Takvime not düş: anahtar teslim kutlamasında kahveler benden! ☕️',
  garageHint: 'Gri katmanı hafifçe kazı; %70\'i açılınca konfeti patlayacak.',
  garageResetLabel: 'Yeniden Kazı',
  parkingHeadline: 'Doğru Yere Park Et! 🅿️',
  parkingSubtitle: 'Aracı sürükle, hedefe yerleştir ve tebrik mesajını aç.',
  parkingSuccessTitle: 'Park Başarılı! 🎯',
  parkingSuccessMessage: 'Tam çizgi üstünde! Yeni aracınla her park bir başarı hikayesi olsun.',
  parkingHint: 'Aracı tutup sürükle; sarı çizgilerin içine denk gelince otomatik olarak yerleşir.',
  parkingResetLabel: 'Tekrar Park Et',
  panoHeadline: 'Evi Birleştir! 🧩',
  panoSubtitle: 'Parçaları doğru yere yerleştir, yeni evin panorama sürprizini keşfet.',
  panoPhotoUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1080&q=80',
  panoCompletionTitle: 'Yeni Ev Tamamlandı! 🏡',
  panoCompletionMessage: 'Her köşesi sevgiyle dolsun; kapın herkese mutluluk açsın.',
  panoHint: 'Parçayı seç ve başka bir parçayla yer değiştir. Her hamle panorama planını tamamlar.',
  panoResetLabel: 'Parçaları Karıştır'
} as const;

type FieldKey = keyof typeof DEFAULT_FIELDS;

interface SharedTemplateProps {
  fields: Record<FieldKey, string>;
  isEditable: boolean;
  onFieldChange: (key: FieldKey, value: string) => void;
  creatorName?: string;
  mainMessage: string;
  recipientName: string;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
}

const GRID_SIZE = 3;
const CONFETTI_COLORS = ['#22d3ee', '#2563eb', '#f97316', '#facc15', '#f59e0b', '#fde68a'];

const parseList = (value: string | undefined, fallback: string[] = []) => {
  if (!value) {
    return fallback;
  }

  const parsed = value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!parsed.length) {
    return fallback;
  }

  return parsed;
};

const createShuffledIndices = (size: number) => {
  const total = size * size;
  const indices = Array.from({ length: total }, (_, index) => index);
  for (let i = total - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  if (indices.every((value, index) => value === index)) {
    return createShuffledIndices(size);
  }
  return indices;
};

const buildConfetti = (count: number) =>
  Array.from({ length: count }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 1,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  }));

export default function YeniEvAracTebrigiTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: YeniEvAracTebrigiTemplateProps) {
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

  const sharedProps: SharedTemplateProps = {
    fields: fieldValues,
    isEditable,
    onFieldChange: handleFieldChange,
    creatorName,
    mainMessage: fieldValues.mainMessage,
    recipientName: fieldValues.recipientName || recipientName || DEFAULT_FIELDS.recipientName,
  };

  switch (designStyle) {
    case 'classic':
      return <GarageScratchCard {...sharedProps} />;
    case 'minimalist':
      return <ParkingMiniGame {...sharedProps} />;
    case 'eglenceli':
      return <PanoramaPuzzle {...sharedProps} />;
    case 'modern':
    default:
      return <KeyCatchGame {...sharedProps} />;
  }
}

function KeyCatchGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const keyWords = useMemo(
    () => parseList(fields.keyWords, parseList(DEFAULT_FIELDS.keyWords)),
    [fields.keyWords]
  );
  const [caughtKeys, setCaughtKeys] = useState<number[]>([]);

  useEffect(() => {
    setCaughtKeys([]);
  }, [fields.keyWords]);

  const handleWordChange = useCallback(
    (index: number, value: string) => {
      const next = [...keyWords];
      next[index] = value.trim();
      onFieldChange('keyWords', next.join('\n'));
    },
    [keyWords, onFieldChange]
  );

  const progress = keyWords.length ? Math.round((caughtKeys.length / keyWords.length) * 100) : 0;
  const allCaught = keyWords.length > 0 && caughtKeys.length === keyWords.length;

  const keyPositions = useMemo(() => {
    const presets = [
      { top: '8%', left: '15%' },
      { top: '18%', left: '68%' },
      { top: '38%', left: '28%' },
      { top: '52%', left: '72%' },
      { top: '70%', left: '20%' },
      { top: '62%', left: '55%' },
      { top: '26%', left: '82%' },
    ];

    return keyWords.map((_word, index) => {
      const preset = presets[index % presets.length];
      const offsetX = (index % 2 === 0 ? 1 : -1) * (index + 1) * 3;
      const offsetY = (index % 3) * 8;
      return {
        top: `calc(${preset.top} + ${offsetY}px)`,
        left: `calc(${preset.left} + ${offsetX}px)`,
      };
    });
  }, [keyWords]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#04131c] via-[#0f172a] to-[#12344d] text-white">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.28),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_200deg_at_80%_10%,_rgba(15,23,42,0.65),_transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-[-35%] h-[65%] rounded-[50%] bg-[rgba(241,228,209,0.16)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-200/70">
            {recipientName ? `${recipientName} için anahtar oyunu` : 'Yeni başlangıç için oyunlu mesaj'}
          </p>
          <h1
            className={`mt-4 text-4xl font-semibold text-white sm:text-5xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('keyHeadline', event.currentTarget.textContent || '')}
          >
            {fields.keyHeadline || DEFAULT_FIELDS.keyHeadline}
          </h1>
          <p
            className={`mt-4 text-base text-white/80 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('keySubtitle', event.currentTarget.textContent || '')}
          >
            {fields.keySubtitle || DEFAULT_FIELDS.keySubtitle}
          </p>
        </div>

        <div className="mt-10 w-full max-w-xl space-y-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/60">
            <span>İlerleme</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#facc15] transition-all duration-500"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>
        </div>

        <div className="relative mt-8 w-full max-w-xl">
          <div className="relative h-[420px] w-full sm:h-[460px]">
            {keyWords.map((word, index) => {
              const isCaught = caughtKeys.includes(index);
              const showWord = isEditable || isCaught;
              return (
                <div
                  key={`${word}-${index}`}
                  className="key-wrapper absolute"
                  style={{
                    top: keyPositions[index]?.top ?? `${12 + index * 8}%`,
                    left: keyPositions[index]?.left ?? `${18 + (index % 3) * 26}%`,
                    animationDelay: `${index * 0.4}s`,
                  }}
                >
                  <button
                    type="button"
                    className={`flex h-20 w-20 flex-col items-center justify-center rounded-[28px] border border-white/15 bg-white/5 text-center text-sm font-semibold text-white/90 shadow-[0_20px_40px_rgba(34,211,238,0.28)] backdrop-blur-md transition-all duration-300 sm:h-24 sm:w-24 sm:text-base ${
                      showWord
                        ? 'scale-110 bg-white text-slate-900 shadow-[0_30px_60px_rgba(14,165,233,0.35)]'
                        : 'hover:scale-105'
                    }`}
                    onClick={() => {
                      if (isEditable) return;
                      setCaughtKeys((prev) => (prev.includes(index) ? prev : [...prev, index]));
                    }}
                  >
                    <span className="text-2xl">🗝️</span>
                    <span
                      className={`mt-1 select-none transition-all duration-300 ${showWord ? 'text-base text-slate-900' : 'text-lg text-cyan-200'}`}
                      contentEditable={showWord && isEditable}
                      suppressContentEditableWarning
                      onMouseDown={
                        showWord && isEditable
                          ? (event) => {
                              event.stopPropagation();
                            }
                          : undefined
                      }
                      onBlur={(event) => {
                        if (!isEditable) return;
                        handleWordChange(index, event.currentTarget.textContent || '');
                      }}
                    >
                      {showWord ? word : '??'}
                    </span>
                  </button>
                </div>
              );
            })}
            <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/10" />
          </div>
        </div>

        <p className="mt-8 text-sm text-white/75">
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => {
              if (!isEditable) return;
              onFieldChange('keyHint', event.currentTarget.textContent || '');
            }}
          >
            {fields.keyHint || DEFAULT_FIELDS.keyHint}
          </span>
        </p>

        <div
          className={`mt-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl transition-all duration-500 ${
            allCaught ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h3
            className={`text-lg font-semibold text-white sm:text-xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('keyCompletionTitle', event.currentTarget.textContent || '')}
          >
            {fields.keyCompletionTitle || DEFAULT_FIELDS.keyCompletionTitle}
          </h3>
          <p
            className={`mt-3 text-base text-white/85 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('keyCompletionMessage', event.currentTarget.textContent || '')}
          >
            {fields.keyCompletionMessage || DEFAULT_FIELDS.keyCompletionMessage}
          </p>
          <p
            className={`mt-4 whitespace-pre-line text-sm text-white/70 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
          >
            {mainMessage}
          </p>
        </div>

        {creatorName && (
          <p className="mt-10 text-sm text-white/60">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>

      <style jsx>{`
        .key-wrapper {
          animation: key-float 12s ease-in-out infinite;
        }

        .key-wrapper:nth-child(2n) {
          animation-duration: 14s;
        }

        .key-wrapper:nth-child(3n) {
          animation-duration: 11s;
        }

        @keyframes key-float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}

function GarageScratchCard({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const scratchCounter = useRef(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [pointerId, setPointerId] = useState<number | null>(null);
  const showCompletionCard = isEditable || isCompleted;

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return;
    }

    ctxRef.current = ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#facc15');
    gradient.addColorStop(1, '#f97316');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#111827';
    for (let i = 0; i < (width * height) / 900; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 5 + 1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'destination-out';
    scratchCounter.current = 0;
    setProgress(0);
    setIsCompleted(false);
    setConfettiPieces([]);
  }, []);

  useEffect(() => {
    initializeCanvas();
    const handleResize = () => initializeCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeCanvas]);

  useEffect(() => {
    if (isCompleted) {
      setConfettiPieces(buildConfetti(40));
    }
  }, [isCompleted]);

  const updateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    const totalSamples = imageData.data.length / (4 * 20);

    for (let i = 3; i < imageData.data.length; i += 4 * 20) {
      if (imageData.data[i] === 0) {
        transparent += 1;
      }
    }

    const percent = Math.min(100, Math.round((transparent / Math.max(totalSamples, 1)) * 100));
    setProgress(percent);

    if (percent > 65 && !isCompleted) {
      setIsCompleted(true);
      setProgress(100);
    }
  }, [isCompleted]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || isCompleted) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      scratchCounter.current += 1;
      if (scratchCounter.current % 6 === 0) {
        updateProgress();
      }
    },
    [isCompleted, updateProgress]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (isCompleted) {
        return;
      }
      setIsDrawing(true);
      setPointerId(event.pointerId);
      scratchAt(event.clientX, event.clientY);
    },
    [isCompleted, scratchAt]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing || isCompleted) {
        return;
      }
      scratchAt(event.clientX, event.clientY);
    },
    [isDrawing, isCompleted, scratchAt]
  );

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    setPointerId(null);
  }, []);

  useEffect(() => {
    if (!isDrawing || pointerId === null) {
      return;
    }

    const handlePointerUp = () => endDrawing();
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDrawing, pointerId, endDrawing]);

  const handleReset = useCallback(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  useEffect(() => {
    handleReset();
  }, [fields.garageHiddenMessage, handleReset]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0b0c10] via-[#111827] to-[#1f2937] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.25),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_15%_15%,_rgba(249,115,22,0.28),_transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-[-32%] h-[60%] rounded-[50%] bg-[rgba(56,189,248,0.15)] blur-3xl" />
      </div>

      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="pointer-events-none absolute top-0 h-3 w-1 rounded-full opacity-0"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animation: `garage-confetti 1.8s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {recipientName ? `${recipientName} için kazı kazan garajı` : 'Garaj kazı kazan deneyimi'}
            </p>
            <h2
              className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('garageHeadline', event.currentTarget.textContent || '')}
            >
              {fields.garageHeadline || DEFAULT_FIELDS.garageHeadline}
            </h2>
            <p
              className={`mt-3 text-base text-white/75 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('garageSubtitle', event.currentTarget.textContent || '')}
            >
              {fields.garageSubtitle || DEFAULT_FIELDS.garageSubtitle}
            </p>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto]">
            <div className="relative flex flex-col items-center">
              <div className="flex w-full items-center justify-between text-xs uppercase tracking-[0.35em] text-white/60">
                <span>Garaj Açılıyor</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#facc15] transition-all duration-500"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                />
              </div>

              <div
                ref={containerRef}
                className="relative mt-8 w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-1 shadow-[0_30px_70px_rgba(249,115,22,0.28)]"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                    <span className="text-5xl">🚗</span>
                    <p
                      className={`mt-4 text-lg font-semibold text-white/90 ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) => onFieldChange('garageHiddenMessage', event.currentTarget.textContent || '')}
                    >
                      {fields.garageHiddenMessage || DEFAULT_FIELDS.garageHiddenMessage}
                    </p>
                  </div>
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 h-full w-full touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endDrawing}
                    onPointerCancel={endDrawing}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/10 p-6 text-white/80 backdrop-blur-lg">
              <p
                className={`text-sm leading-relaxed ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('garageHint', event.currentTarget.textContent || '')}
              >
                {fields.garageHint || DEFAULT_FIELDS.garageHint}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 rounded-full bg-white/20 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/30"
              >
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => {
                    if (!isEditable) return;
                    onFieldChange('garageResetLabel', event.currentTarget.textContent || '');
                  }}
                >
                  {fields.garageResetLabel || DEFAULT_FIELDS.garageResetLabel}
                </span>
              </button>
            </div>
          </div>

          {showCompletionCard && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl">
              <h3
                className={`text-lg font-semibold text-white sm:text-xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('garageCompletionTitle', event.currentTarget.textContent || '')}
              >
                {fields.garageCompletionTitle || DEFAULT_FIELDS.garageCompletionTitle}
              </h3>
              <p
                className={`mt-3 text-base text-white/85 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('garageCompletionText', event.currentTarget.textContent || '')}
              >
                {fields.garageCompletionText || DEFAULT_FIELDS.garageCompletionText}
              </p>
              <p
                className={`mt-3 text-sm text-white/75 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('garageConfettiMessage', event.currentTarget.textContent || '')}
              >
                {fields.garageConfettiMessage || DEFAULT_FIELDS.garageConfettiMessage}
              </p>
              <p
                className={`mt-4 whitespace-pre-line text-sm text-white/70 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
              >
                {mainMessage}
              </p>
            </div>
          )}
        </div>

        {creatorName && (
          <p className="mt-10 text-sm text-white/70">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes garage-confetti {
          0% {
            opacity: 0;
            transform: translateY(-10px) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(220px) rotate(120deg);
          }
        }
      `}</style>
    </div>
  );
}

function ParkingMiniGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carRef = useRef<HTMLDivElement | null>(null);
  const [carPosition, setCarPosition] = useState({ x: 20, y: 260 });
  const [isDragging, setIsDragging] = useState(false);
  const [pointerId, setPointerId] = useState<number | null>(null);
  const [isParked, setIsParked] = useState(false);

  const targetArea = useMemo(() => ({ x: 60, y: 40, width: 140, height: 220 }), []);

  const resetGame = useCallback(() => {
    setCarPosition({ x: 20, y: 260 });
    setIsDragging(false);
    setPointerId(null);
    setIsParked(false);
  }, []);

  const clampPosition = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    const car = carRef.current;
    if (!container || !car) {
      return { x, y };
    }
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const maxX = containerRect.width - carRect.width;
    const maxY = containerRect.height - carRect.height;
    return {
      x: Math.min(Math.max(0, x), Math.max(maxX, 0)),
      y: Math.min(Math.max(0, y), Math.max(maxY, 0)),
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isParked) {
        return;
      }
      setIsDragging(true);
      setPointerId(event.pointerId);
      const car = carRef.current;
      if (!car) {
        return;
      }
      car.setPointerCapture(event.pointerId);
      car.dataset.offsetX = `${event.clientX - car.getBoundingClientRect().left}`;
      car.dataset.offsetY = `${event.clientY - car.getBoundingClientRect().top}`;
    },
    [isParked]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || isParked) {
        return;
      }
      const car = carRef.current;
      if (!car || event.pointerId !== pointerId) {
        return;
      }
      const offsetX = Number(car.dataset.offsetX ?? 0);
      const offsetY = Number(car.dataset.offsetY ?? 0);
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const x = event.clientX - containerRect.left - offsetX;
      const y = event.clientY - containerRect.top - offsetY;
      setCarPosition(clampPosition(x, y));
    },
    [isDragging, pointerId, clampPosition, isParked]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const car = carRef.current;
      if (car && event.pointerId === pointerId) {
        car.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
      setPointerId(null);

      const carBox = car?.getBoundingClientRect();
      const containerBox = containerRef.current?.getBoundingClientRect();
      if (!carBox || !containerBox) {
        return;
      }
      const carCenter = {
        x: carBox.left - containerBox.left + carBox.width / 2,
        y: carBox.top - containerBox.top + carBox.height / 2,
      };

      if (
        carCenter.x > targetArea.x &&
        carCenter.x < targetArea.x + targetArea.width &&
        carCenter.y > targetArea.y &&
        carCenter.y < targetArea.y + targetArea.height
      ) {
        setCarPosition({ x: targetArea.x + targetArea.width / 2 - carBox.width / 2, y: targetArea.y + targetArea.height / 2 - carBox.height / 2 });
        setIsParked(true);
      }
    },
    [pointerId, targetArea]
  );

  useEffect(() => {
    const handlePointerCancel = () => {
      setIsDragging(false);
      setPointerId(null);
    };
    window.addEventListener('pointerup', handlePointerCancel);
    window.addEventListener('pointercancel', handlePointerCancel);
    return () => {
      window.removeEventListener('pointerup', handlePointerCancel);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#111827] text-white">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_80deg_at_20%_20%,_rgba(251,191,36,0.2),_transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-[-30%] h-[55%] rounded-[50%] bg-[rgba(16,185,129,0.16)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            {recipientName ? `${recipientName} ile park oyunu` : 'Park et mini oyunu'}
          </p>
          <h2
            className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('parkingHeadline', event.currentTarget.textContent || '')}
          >
            {fields.parkingHeadline || DEFAULT_FIELDS.parkingHeadline}
          </h2>
          <p
            className={`mt-3 max-w-2xl text-base text-white/75 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('parkingSubtitle', event.currentTarget.textContent || '')}
          >
            {fields.parkingSubtitle || DEFAULT_FIELDS.parkingSubtitle}
          </p>
        </div>

        <div className="mt-10 grid w-full gap-10 sm:grid-cols-[2fr_1fr]">
          <div className="flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0f19]/60 p-6 shadow-[0_35px_80px_rgba(56,189,248,0.24)] backdrop-blur-xl"
            >
              <div className="relative h-[360px] w-full rounded-[24px] border border-white/5 bg-[repeating-linear-gradient(180deg,rgba(31,41,55,0.9)_0,rgba(31,41,55,0.9)_32px,rgba(15,23,42,0.95)_32px,rgba(15,23,42,0.95)_64px)]">
                <div
                  className="absolute rounded-[22px] border border-dashed border-[#facc15]/70 bg-[#fde68a]/10 transition-all duration-500"
                  style={{
                    left: `${targetArea.x}px`,
                    top: `${targetArea.y}px`,
                    width: `${targetArea.width}px`,
                    height: `${targetArea.height}px`,
                    boxShadow: isParked ? '0 0 0 4px rgba(250, 204, 21, 0.35)' : '0 0 0 2px rgba(250, 204, 21, 0.18)',
                  }}
                />
                <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/10" />
                <div className="absolute inset-x-0 top-16 h-[2px] bg-white/5" />
                <div className="absolute inset-x-0 bottom-16 h-[2px] bg-white/5" />

                <div
                  ref={carRef}
                  className={`absolute h-20 w-28 touch-none rounded-[18px] border border-white/10 bg-gradient-to-br from-[#22d3ee] via-[#38bdf8] to-[#1e3a8a] shadow-[0_20px_45px_rgba(56,189,248,0.3)] transition-all duration-300 ${
                    isParked ? 'scale-105' : ''
                  }`}
                  style={{
                    transform: `translate(${carPosition.x}px, ${carPosition.y}px)`,
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  <div className="absolute inset-2 rounded-[14px] border border-white/30 bg-white/15" />
                  <div className="absolute left-2 top-1 h-3 w-8 rounded-full bg-[#0f172a]" />
                  <div className="absolute right-2 top-1 h-3 w-8 rounded-full bg-[#0f172a]" />
                  <div className="absolute bottom-2 left-2 h-2 w-8 rounded-full bg-[#0f172a]" />
                  <div className="absolute bottom-2 right-2 h-2 w-8 rounded-full bg-[#0f172a]" />
                </div>
              </div>
            </div>
            <p
              className={`mt-6 text-sm text-white/70 ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('parkingHint', event.currentTarget.textContent || '')}
            >
              {fields.parkingHint || DEFAULT_FIELDS.parkingHint}
            </p>
          </div>

          <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-lg">
            <div>
              <h3
                className={`text-lg font-semibold text-white ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('parkingSuccessTitle', event.currentTarget.textContent || '')}
              >
                {fields.parkingSuccessTitle || DEFAULT_FIELDS.parkingSuccessTitle}
              </h3>
              <p
                className={`mt-3 text-sm text-white/80 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('parkingSuccessMessage', event.currentTarget.textContent || '')}
              >
                {fields.parkingSuccessMessage || DEFAULT_FIELDS.parkingSuccessMessage}
              </p>
              <p
                className={`mt-4 whitespace-pre-line text-sm text-white/70 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
              >
                {mainMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="mt-8 rounded-full bg-white/20 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/30"
            >
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => {
                  if (!isEditable) return;
                  onFieldChange('parkingResetLabel', event.currentTarget.textContent || '');
                }}
              >
                {fields.parkingResetLabel || DEFAULT_FIELDS.parkingResetLabel}
              </span>
            </button>
          </div>
        </div>

        {creatorName && (
          <p className="mt-10 text-sm text-white/70">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>
    </div>
  );
}

function PanoramaPuzzle({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const [tiles, setTiles] = useState<number[]>(() => createShuffledIndices(GRID_SIZE));
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const photoUrl = fields.panoPhotoUrl || DEFAULT_FIELDS.panoPhotoUrl;
  const showOverlay = isEditable || isSolved;

  useEffect(() => {
    setTiles(createShuffledIndices(GRID_SIZE));
    setSelectedTile(null);
    setIsSolved(false);
  }, [photoUrl]);

  useEffect(() => {
    if (tiles.every((value, index) => value === index)) {
      setIsSolved(true);
    }
  }, [tiles]);

  const handleTileSelect = useCallback(
    (index: number) => {
      if (isSolved) {
        return;
      }

      if (selectedTile === null) {
        setSelectedTile(index);
        return;
      }

      if (selectedTile === index) {
        setSelectedTile(null);
        return;
      }

      setTiles((prev) => {
        const next = [...prev];
        [next[selectedTile], next[index]] = [next[index], next[selectedTile]];
        return next;
      });
      setSelectedTile(null);
    },
    [selectedTile, isSolved]
  );

  const handleShuffle = useCallback(() => {
    setTiles(createShuffledIndices(GRID_SIZE));
    setSelectedTile(null);
    setIsSolved(false);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#101323] via-[#111b2f] to-[#2d1b69] text-white">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_100deg_at_12%_35%,_rgba(56,189,248,0.28),_transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-[-28%] h-[52%] rounded-[50%] bg-[rgba(168,85,247,0.26)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {recipientName ? `${recipientName} ile panorama puzzle` : 'Panorama puzzle deneyimi'}
            </p>
            <h2
              className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('panoHeadline', event.currentTarget.textContent || '')}
            >
              {fields.panoHeadline || DEFAULT_FIELDS.panoHeadline}
            </h2>
            <p
              className={`mt-3 max-w-2xl text-base text-white/75 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('panoSubtitle', event.currentTarget.textContent || '')}
            >
              {fields.panoSubtitle || DEFAULT_FIELDS.panoSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-[2fr_1fr]">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-1 shadow-[0_35px_90px_rgba(147,51,234,0.35)]">
                <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-black/20">
                  <div
                    className="absolute inset-0 rounded-[28px] bg-cover bg-center opacity-15"
                    style={{ backgroundImage: `url(${photoUrl})` }}
                  />
                  <div className="relative grid h-full w-full grid-cols-3 grid-rows-3">
                    {tiles.map((tileIndex, index) => {
                      const row = Math.floor(tileIndex / GRID_SIZE);
                      const col = tileIndex % GRID_SIZE;
                      const positionX = (col / (GRID_SIZE - 1)) * 100;
                      const positionY = (row / (GRID_SIZE - 1)) * 100;
                      const isSelected = selectedTile === index;

                      return (
                        <button
                          key={`tile-${tileIndex}`}
                          type="button"
                          className={`puzzle-piece relative border border-white/12 transition-all duration-300 ${
                            isSelected ? 'z-10 ring-4 ring-sky-300/70 ring-offset-2 ring-offset-black/30' : ''
                          }`}
                          onClick={() => handleTileSelect(index)}
                          style={{
                            backgroundImage: `url(${photoUrl})`,
                            backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                            backgroundPosition: `${positionX}% ${positionY}%`,
                          }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300" />
                        </button>
                      );
                    })}
                  </div>
                  {showOverlay && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[28px] bg-black/60 text-center">
                      <h3
                        className={`text-xl font-semibold text-white sm:text-2xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onFieldChange('panoCompletionTitle', event.currentTarget.textContent || '')}
                      >
                        {fields.panoCompletionTitle || DEFAULT_FIELDS.panoCompletionTitle}
                      </h3>
                      <p
                        className={`mt-3 max-w-xl text-sm text-white/75 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onFieldChange('panoCompletionMessage', event.currentTarget.textContent || '')}
                      >
                        {fields.panoCompletionMessage || DEFAULT_FIELDS.panoCompletionMessage}
                      </p>
                      <p
                        className={`mt-4 whitespace-pre-line text-sm text-white/70 sm:text-base ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
                      >
                        {mainMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/10 p-6 text-white/80 backdrop-blur-lg">
              <div>
                <p
                  className={`text-sm leading-relaxed ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => onFieldChange('panoHint', event.currentTarget.textContent || '')}
                >
                  {fields.panoHint || DEFAULT_FIELDS.panoHint}
                </p>
                {isEditable && (
                  <div className="mt-4 text-xs text-white/70">
                    <span className="block text-[0.65rem] uppercase tracking-[0.35em] text-white/60">Fotoğraf URL</span>
                    <span
                      className="mt-2 inline-block w-full cursor-text rounded-2xl bg-white/10 px-3 py-2 text-left hover:bg-white/15"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => onFieldChange('panoPhotoUrl', event.currentTarget.textContent?.trim() || '')}
                    >
                      {photoUrl}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleShuffle}
                className="mt-6 rounded-full bg-white/20 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/30"
              >
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => {
                    if (!isEditable) return;
                    onFieldChange('panoResetLabel', event.currentTarget.textContent || '');
                  }}
                >
                  {fields.panoResetLabel || DEFAULT_FIELDS.panoResetLabel}
                </span>
              </button>
            </div>
          </div>
        </div>

        {creatorName && (
          <p className="mt-10 text-sm text-white/70">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>

      <style jsx>{`
        .puzzle-piece {
          position: relative;
          overflow: hidden;
        }

        .puzzle-piece::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, rgba(147, 51, 234, 0.2), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .puzzle-piece:hover::before {
          opacity: 1;
        }

        .puzzle-piece:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 18px 35px rgba(56, 189, 248, 0.25);
        }
      `}</style>
    </div>
  );
}

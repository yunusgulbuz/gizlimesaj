'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface EglenceliOyunluMesajlarTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULT_FIELDS = {
  recipientName: 'Aşkım',
  mainMessage: 'Bu mini oyun tamamen sana özel. Her adımda seni mutlu edecek yeni bir sürpriz saklı. 💌',
  musicUrl: '',
  bubbleHeadline: 'Mesajı Yakala! 🎈',
  bubbleSubtitle: 'Baloncuklara dokun, mesajı keşfet ve kelimeleri birleştir!',
  bubbleWords: 'Sen\nbenim\noyun\narkadaşımsın\nher\nan\n🎮',
  bubbleCompletionText: 'Gizli cümle ortaya çıktı! Bu kelimeler sadece sana ait. ✨',
  bubbleHint: 'Her baloncukta bir kelime saklı. Tümünü açmayı dene!',
  scratchHeadline: 'Sürpriz Mesajı Kazı 🎁',
  scratchSubtitle: 'Gri katmanı parmağınla kazı ve alttaki mesajı ortaya çıkar.',
  scratchHiddenMessage: 'Hazırsan bu akşam mini oyun maratonu ve sıcak çikolata seni bekliyor! ☕️🎮',
  scratchCompletionText: 'Kazınan her piksel bizi eğlenceli sürprize yaklaştırdı!',
  scratchConfettiNote: 'Şimdi mesajı oku ve buluştuğumuzda kutlamaya devam edelim. 🎉',
  scratchHint: 'Ekranın her yerini hafifçe kazı; tamamlandığında konfeti yağacak.',
  scratchResetLabel: 'Yeniden Kazı',
  quizHeadline: 'Bakalım Beni Ne Kadar Tanıyorsun? 💭',
  quizSubtitle: 'Soruları cevapla, puan topla ve final sürprizini keşfet.',
  quizQuestion1: 'Favori gece aktivitem nedir?',
  quizOptions1: 'Cozy film gecesi\nGece yürüyüşü\nMini oyun turnuvası\nSonsuz sohbet',
  quizAnswer1: '3',
  quizQuestion2: 'En çok hangi emojiyi sana gönderiyorum?',
  quizOptions2: '💕\n🎮\n🌙\n🔥',
  quizAnswer2: '1',
  quizQuestion3: 'Sürpriz planım nerede?',
  quizOptions3: 'Evde\nŞehir ışıklarında\nArkadaşlarımızla\nRastgele seç',
  quizAnswer3: '2',
  quizCompletionTitle: 'Tebrikler! 💫',
  quizSuccessMessage: 'Sen beni çok iyi tanıyorsun 💕',
  quizTryAgainMessage: 'Olmadı mı? Tekrar dene, birlikte eğleniyoruz! 😄',
  quizRetryButtonLabel: 'Yeniden Başla',
  quizScoreLabel: 'Toplam Puan',
  puzzleHeadline: 'Beni Birleştir 💞',
  puzzleSubtitle: 'Parçaları doğru yerleştir, kalpten gelen mesajı açığa çıkar.',
  puzzlePhotoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
  puzzleCompletionTitle: 'Puzzle Tamamlandı! 💞',
  puzzleCompletionMessage: 'İşte sakladığım mesaj: Kalbim seninle tamamlanıyor. 💖',
  puzzleHint: 'Parçayı seç ve başka bir parça ile yer değiştir. Her hamle seni finale götürüyor!',
  puzzleResetLabel: 'Karıştır ve Yeniden Başla'
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

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
}

const GRID_SIZE = 3;
const CONFETTI_COLORS = ['#f472b6', '#60a5fa', '#c084fc', '#34d399', '#facc15', '#fb7185'];
const QUIZ_QUESTION_KEYS: FieldKey[] = ['quizQuestion1', 'quizQuestion2', 'quizQuestion3'];
const QUIZ_OPTIONS_KEYS: FieldKey[] = ['quizOptions1', 'quizOptions2', 'quizOptions3'];
const QUIZ_ANSWER_KEYS: FieldKey[] = ['quizAnswer1', 'quizAnswer2', 'quizAnswer3'];
const DEFAULT_OPTION_PLACEHOLDER = ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4'];

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

const clampAnswerIndex = (value: string, optionCount: number) => {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  const bounded = Math.max(1, Math.min(optionCount, parsed));
  return bounded - 1;
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

export default function EglenceliOyunluMesajlarTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: EglenceliOyunluMesajlarTemplateProps) {
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
      return <ScratchCardMessage {...sharedProps} />;
    case 'minimalist':
      return <QuizStyleMessage {...sharedProps} />;
    case 'eglenceli':
      return <PuzzleLoveMessage {...sharedProps} />;
    case 'modern':
    default:
      return <BubbleMessageGame {...sharedProps} />;
  }
}

function BubbleMessageGame({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const bubbleWords = useMemo(
    () => parseList(fields.bubbleWords, parseList(DEFAULT_FIELDS.bubbleWords)),
    [fields.bubbleWords]
  );

  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    setRevealed([]);
  }, [fields.bubbleWords]);

  const handleBubbleWordChange = useCallback(
    (bubbleIndex: number, value: string) => {
      const next = [...bubbleWords];
      next[bubbleIndex] = value.trim();
      onFieldChange('bubbleWords', next.join('\n'));
    },
    [bubbleWords, onFieldChange]
  );

  const progress = bubbleWords.length ? Math.round((revealed.length / bubbleWords.length) * 100) : 0;
  const allRevealed = bubbleWords.length > 0 && revealed.length === bubbleWords.length;

  const bubblePositions = useMemo(() => {
    const presets = [
      { top: '6%', left: '12%' },
      { top: '22%', left: '64%' },
      { top: '42%', left: '28%' },
      { top: '58%', left: '70%' },
      { top: '74%', left: '16%' },
      { top: '66%', left: '50%' },
      { top: '30%', left: '82%' },
      { top: '14%', left: '78%' },
    ];

    return bubbleWords.map((_word, index) => {
      const preset = presets[index % presets.length];
      const offsetX = ((index % 2 === 0 ? 1 : -1) * (index + 1) * 3);
      const offsetY = (index % 3) * 6;
      return {
        top: `calc(${preset.top} + ${offsetY}px)`,
        left: `calc(${preset.left} + ${offsetX}px)`,
      };
    });
  }, [bubbleWords]);

  const gradients = ['from-[#60a5fa] to-[#a855f7]', 'from-[#f472b6] to-[#fb7185]', 'from-[#34d399] to-[#22d3ee]', 'from-[#facc15] to-[#fb7185]'];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4c1d95] text-white">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_10%_10%,_rgba(244,114,182,0.35),_transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-[-30%] h-[60%] rounded-[50%] bg-[rgba(255,255,255,0.04)] blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pb-16 pt-20">
        <div className="w-full max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200/70">
            {recipientName ? `${recipientName} için interaktif mesaj` : 'Eğlenceli Mesaj Deneyimi'}
          </p>
          <h1
            className={`mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('bubbleHeadline', event.currentTarget.textContent || '')}
          >
            {fields.bubbleHeadline || DEFAULT_FIELDS.bubbleHeadline}
          </h1>
          <p
            className={`mt-4 text-base text-white/80 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('bubbleSubtitle', event.currentTarget.textContent || '')}
          >
            {fields.bubbleSubtitle || DEFAULT_FIELDS.bubbleSubtitle}
          </p>
        </div>

        <div className="mt-10 w-full max-w-xl space-y-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/60">
            <span>İlerleme</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
        </div>

        <div className="relative mt-8 w-full max-w-xl">
          <div className="relative h-[420px] w-full sm:h-[460px]">
            {bubbleWords.map((word, index) => {
              const isRevealed = revealed.includes(index);
              const gradient = gradients[index % gradients.length];
              const showWord = isEditable || isRevealed;
              const canEditWord = showWord;

              return (
                <div
                  key={`${word}-${index}`}
                  className="bubble-wrapper absolute"
                  style={{
                    top: bubblePositions[index]?.top ?? `${12 + index * 8}%`,
                    left: bubblePositions[index]?.left ?? `${16 + (index % 3) * 26}%`,
                    animationDelay: `${index * 0.35}s`,
                  }}
                >
                  <button
                    type="button"
                    className={`flex h-20 w-20 items-center justify-center rounded-full border border-white/25 text-center text-sm font-semibold text-white/90 shadow-[0_18px_44px_rgba(99,102,241,0.35)] backdrop-blur-md transition-all duration-300 sm:h-24 sm:w-24 sm:text-base ${
                      showWord
                        ? 'scale-110 bg-white/90 text-indigo-800 shadow-[0_30px_50px_rgba(129,140,248,0.45)]'
                        : `bg-gradient-to-br ${gradient} hover:scale-105`
                    }`}
                    onClick={() => {
                      if (isEditable) return;
                      setRevealed((prev) => (prev.includes(index) ? prev : [...prev, index]));
                    }}
                  >
                    <span
                      className={`select-none transition-transform duration-300 ${showWord ? 'scale-110 text-lg' : 'scale-95 text-xl'}`}
                      contentEditable={canEditWord}
                      suppressContentEditableWarning
                      onMouseDown={
                        canEditWord
                          ? (event) => {
                              event.stopPropagation();
                            }
                          : undefined
                      }
                      onBlur={(event) => {
                        if (!canEditWord) return;
                        handleBubbleWordChange(index, event.currentTarget.textContent || '');
                      }}
                    >
                      {showWord ? word : '✨'}
                    </span>
                  </button>
                </div>
              );
            })}
            <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/10" />
          </div>
        </div>

        <p className="mt-8 text-sm text-white/70">
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => {
              if (!isEditable) return;
              onFieldChange('bubbleHint', event.currentTarget.textContent || '');
            }}
          >
            {fields.bubbleHint || DEFAULT_FIELDS.bubbleHint}
          </span>
        </p>

        <div
          className={`mt-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl transition-all duration-500 ${
            allRevealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <p
            className={`text-lg font-semibold text-white/90 sm:text-xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('bubbleCompletionText', event.currentTarget.textContent || '')}
          >
            {fields.bubbleCompletionText || DEFAULT_FIELDS.bubbleCompletionText}
          </p>
          <p
            className={`mt-4 whitespace-pre-line text-base text-white/80 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
          >
            {mainMessage}
          </p>
        </div>

        {creatorName && (
          <p className="mt-8 text-sm text-white/60">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>

      <style jsx>{`
        .bubble-wrapper {
          animation: eom-bubble-float 11s ease-in-out infinite;
        }

        .bubble-wrapper:nth-child(2n) {
          animation-duration: 13s;
        }

        .bubble-wrapper:nth-child(3n) {
          animation-duration: 12s;
        }

        @keyframes eom-bubble-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
        }
      `}</style>
    </div>
  );
}

function ScratchCardMessage({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
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
    gradient.addColorStop(0, '#dbeafe');
    gradient.addColorStop(1, '#c7d2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#a5b4fc';
    for (let i = 0; i < width * height / 900; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 4 + 1;
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
      setConfettiPieces(buildConfetti(42));
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
      ctx.arc(x, y, 30, 0, Math.PI * 2);
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
  }, [fields.scratchHiddenMessage, handleReset]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1d1b3a] to-[#312e81] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.35),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_260deg_at_80%_20%,_rgba(59,130,246,0.25),_transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-[-30%] h-[55%] rounded-[50%] bg-[rgba(14,116,144,0.18)] blur-3xl" />
      </div>

      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="pointer-events-none absolute top-0 h-3 w-1 rounded-full opacity-0"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animation: `eom-confetti-fall 1.8s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/70">
              {recipientName ? `${recipientName} için kazı kazan mesajı` : 'Eğlenceli kazı kazan deneyimi'}
            </p>
            <h2
              className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('scratchHeadline', event.currentTarget.textContent || '')}
            >
              {fields.scratchHeadline || DEFAULT_FIELDS.scratchHeadline}
            </h2>
            <p
              className={`mt-3 text-base text-white/75 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('scratchSubtitle', event.currentTarget.textContent || '')}
            >
              {fields.scratchSubtitle || DEFAULT_FIELDS.scratchSubtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="w-full sm:w-2/3">
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-white/15 via-white/5 to-white/15 p-1 shadow-[0_30px_80px_rgba(59,130,246,0.25)]"
              >
                <div className={`${isEditable ? '' : 'pointer-events-none'} absolute inset-0 flex items-center justify-center px-6`}>
                  <p
                    className={`whitespace-pre-line text-center text-lg font-semibold text-white/90 sm:text-xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-3 hover:bg-white/10' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) => onFieldChange('scratchHiddenMessage', event.currentTarget.textContent || '')}
                  >
                    {fields.scratchHiddenMessage || DEFAULT_FIELDS.scratchHiddenMessage}
                  </p>
                </div>
                <canvas
                  ref={canvasRef}
                  className={`relative z-10 w-full cursor-pointer touch-none rounded-[26px] ${isCompleted ? 'pointer-events-none opacity-0 transition-opacity duration-500 delay-150' : 'opacity-100 transition-opacity duration-300'}`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endDrawing}
                  onPointerLeave={endDrawing}
                />
              </div>
              <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/65">
                <span>Kazıma</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.max(progress, 6)}%` }}
                />
              </div>
            </div>

            <div className="w-full space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6 text-white/80 backdrop-blur-lg sm:w-1/3">
              <p
                className={`text-sm leading-relaxed ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('scratchConfettiNote', event.currentTarget.textContent || '')}
              >
                {fields.scratchConfettiNote || DEFAULT_FIELDS.scratchConfettiNote}
              </p>
              <p
                className={`text-xs text-white/60 ${isEditable ? 'cursor-text rounded-2xl px-3 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('scratchHint', event.currentTarget.textContent || '')}
              >
                {fields.scratchHint || DEFAULT_FIELDS.scratchHint}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/30"
              >
                {fields.scratchResetLabel || DEFAULT_FIELDS.scratchResetLabel}
              </button>
            </div>
          </div>

          {showCompletionCard && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-white/90 backdrop-blur-xl">
              <p
                className={`text-lg font-semibold sm:text-xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('scratchCompletionText', event.currentTarget.textContent || '')}
              >
                {fields.scratchCompletionText || DEFAULT_FIELDS.scratchCompletionText}
              </p>
              <p
                className={`mt-4 whitespace-pre-line text-base text-white/80 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
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
          <p className="mt-8 text-sm text-white/60">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes eom-confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(360px) rotate(200deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function QuizStyleMessage({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const handleQuizQuestionChange = useCallback(
    (questionIndex: number, value: string) => {
      onFieldChange(QUIZ_QUESTION_KEYS[questionIndex], value.trim());
    },
    [onFieldChange]
  );

  const handleQuizOptionChange = useCallback(
    (questionIndex: number, optionIndex: number, value: string) => {
      const key = QUIZ_OPTIONS_KEYS[questionIndex];
      const defaultOptions = parseList(
        (DEFAULT_FIELDS as Record<string, string>)[key],
        DEFAULT_OPTION_PLACEHOLDER
      );
      const currentOptions = parseList(fields[key], defaultOptions.length ? defaultOptions : ['']);
      const next = [...currentOptions];
      while (next.length <= optionIndex) {
        next.push('');
      }
      next[optionIndex] = value.trim();
      onFieldChange(key, next.join('\n'));
    },
    [fields, onFieldChange]
  );

  const handleQuizAnswerChange = useCallback(
    (questionIndex: number, optionIndex: number) => {
      onFieldChange(QUIZ_ANSWER_KEYS[questionIndex], String(optionIndex + 1));
    },
    [onFieldChange]
  );

  const questions = useMemo<QuizQuestion[]>(() => {
    const base: Array<{ question: string; options: string; answer: string }> = [
      { question: fields.quizQuestion1, options: fields.quizOptions1, answer: fields.quizAnswer1 },
      { question: fields.quizQuestion2, options: fields.quizOptions2, answer: fields.quizAnswer2 },
      { question: fields.quizQuestion3, options: fields.quizOptions3, answer: fields.quizAnswer3 },
    ];

    return base
      .map((item, index) => {
        const options = parseList(
          item.options,
          parseList(
            index === 0
              ? DEFAULT_FIELDS.quizOptions1
              : index === 1
                ? DEFAULT_FIELDS.quizOptions2
                : DEFAULT_FIELDS.quizOptions3
          )
        );
        if (!options.length) {
          return null;
        }

        const questionText =
          item.question ||
          (index === 0
            ? DEFAULT_FIELDS.quizQuestion1
            : index === 1
              ? DEFAULT_FIELDS.quizQuestion2
              : DEFAULT_FIELDS.quizQuestion3);

        const answerIndex = clampAnswerIndex(
          item.answer ||
            (index === 0
              ? DEFAULT_FIELDS.quizAnswer1
              : index === 1
                ? DEFAULT_FIELDS.quizAnswer2
                : DEFAULT_FIELDS.quizAnswer3),
          options.length
        );

        return {
          id: `quiz-q-${index}`,
          question: questionText,
          options,
          answerIndex,
        };
      })
      .filter((question): question is QuizQuestion => Boolean(question));
  }, [
    fields.quizAnswer1,
    fields.quizAnswer2,
    fields.quizAnswer3,
    fields.quizOptions1,
    fields.quizOptions2,
    fields.quizOptions3,
    fields.quizQuestion1,
    fields.quizQuestion2,
    fields.quizQuestion3,
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const autoAdvanceTimeout = useRef<number | null>(null);

  useEffect(() => {
    setSelectedOptions((prev) =>
      Array.from({ length: questions.length }, (_value, index) => prev[index] ?? -1)
    );
    setCurrentQuestion((prev) => {
      const maxIndex = Math.max(questions.length - 1, 0);
      return isEditable ? Math.min(prev, maxIndex) : 0;
    });
    setCompleted(false);
    if (autoAdvanceTimeout.current) {
      window.clearTimeout(autoAdvanceTimeout.current);
    }
  }, [questions, isEditable]);

  const answeredCount = useMemo(
    () => selectedOptions.filter((option) => option !== -1).length,
    [selectedOptions]
  );

  useEffect(() => {
    if (questions.length && answeredCount === questions.length) {
      const timeout = window.setTimeout(() => setCompleted(true), 500);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [answeredCount, questions.length]);

  useEffect(
    () => () => {
      if (autoAdvanceTimeout.current) {
        window.clearTimeout(autoAdvanceTimeout.current);
      }
    },
    []
  );

  const score = useMemo(() => {
    return selectedOptions.reduce((total, option, index) => {
      const question = questions[index];
      if (!question) {
        return total;
      }
      return option === question.answerIndex ? total + 1 : total;
    }, 0);
  }, [questions, selectedOptions]);
  const shouldShowQuestion = !completed || isEditable;
  const shouldShowCompletion = completed || isEditable;

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (isEditable) {
        return;
      }
      const question = questions[currentQuestion];
      if (!question) {
        return;
      }

      setSelectedOptions((prev) => {
        const next = [...prev];
        next[currentQuestion] = optionIndex;
        return next;
      });

      if (autoAdvanceTimeout.current) {
        window.clearTimeout(autoAdvanceTimeout.current);
      }

      if (currentQuestion < questions.length - 1) {
        autoAdvanceTimeout.current = window.setTimeout(() => {
          setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
        }, 650);
      } else {
        autoAdvanceTimeout.current = window.setTimeout(() => setCompleted(true), 650);
      }
    },
    [currentQuestion, isEditable, questions]
  );

  const handleRetry = useCallback(() => {
    setSelectedOptions(Array.from({ length: questions.length }, () => -1));
    setCurrentQuestion(0);
    setCompleted(false);
    if (autoAdvanceTimeout.current) {
      window.clearTimeout(autoAdvanceTimeout.current);
    }
  }, [questions.length]);

  const handleOptionClick = useCallback(
    (optionIndex: number) => {
      if (isEditable) {
        handleQuizAnswerChange(currentQuestion, optionIndex);
        return;
      }
      handleOptionSelect(optionIndex);
    },
    [currentQuestion, handleOptionSelect, handleQuizAnswerChange, isEditable]
  );

  const handleManualQuestionChange = useCallback(
    (targetIndex: number) => {
      if (!questions.length) return;
      const bounded = Math.max(0, Math.min(targetIndex, questions.length - 1));
      setCurrentQuestion(bounded);
    },
    [questions.length]
  );

  const activeQuestion = questions[currentQuestion];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0ea5e9] via-[#312e81] to-[#ec4899] text-white">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_40deg_at_80%_20%,_rgba(236,72,153,0.25),_transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-[-25%] h-[50%] rounded-[50%] bg-[rgba(236,72,153,0.22)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full rounded-[36px] border border-white/15 bg-white/10 p-8 backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {recipientName ? `${recipientName} için quiz` : 'Eğlenceli Quiz'}
            </p>
            <h2
              className={`mt-4 text-3xl font-semibold sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('quizHeadline', event.currentTarget.textContent || '')}
            >
              {fields.quizHeadline || DEFAULT_FIELDS.quizHeadline}
            </h2>
            <p
              className={`mt-3 text-base text-white/75 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('quizSubtitle', event.currentTarget.textContent || '')}
            >
              {fields.quizSubtitle || DEFAULT_FIELDS.quizSubtitle}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs uppercase tracking-[0.35em] text-white/70 sm:px-6">
            <span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                className={isEditable ? 'cursor-text rounded px-2 py-1 hover:bg-white/10' : undefined}
                onBlur={(event) => {
                  if (!isEditable) return;
                  onFieldChange('quizScoreLabel', event.currentTarget.textContent || '');
                }}
              >
                {fields.quizScoreLabel || DEFAULT_FIELDS.quizScoreLabel}
              </span>
              : {score}/{questions.length || 1}
            </span>
            <span>{answeredCount}/{questions.length} Soru</span>
          </div>

          {shouldShowQuestion && activeQuestion && (
            <div key={activeQuestion.id} className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/60">
                <span>Soru {currentQuestion + 1}</span>
                <span>
                  {currentQuestion + 1}/{questions.length}
                </span>
              </div>

              {isEditable && questions.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-[0.75rem] font-medium text-white/70">
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10 disabled:opacity-40"
                    onClick={() => handleManualQuestionChange(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                  >
                    ‹ Önceki
                  </button>
                  <div className="flex items-center gap-1">
                    {questions.map((_question, index) => (
                      <button
                        key={`quiz-nav-${index}`}
                        type="button"
                        onClick={() => handleManualQuestionChange(index)}
                        className={`h-6 w-6 rounded-full border text-[0.7rem] transition-colors ${
                          currentQuestion === index
                            ? 'border-white/80 bg-white/20 text-white'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/12'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10 disabled:opacity-40"
                    onClick={() => handleManualQuestionChange(currentQuestion + 1)}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Sonraki ›
                  </button>
                </div>
              )}

              <h3
                className={`mt-4 text-xl font-semibold text-white sm:text-2xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => handleQuizQuestionChange(currentQuestion, event.currentTarget.textContent || '')}
              >
                {activeQuestion.question}
              </h3>

              <div className="mt-6 space-y-3">
                {activeQuestion.options.map((option, index) => {
                  const selectedOption = selectedOptions[currentQuestion];
                  const isSelected = selectedOption === index;
                  const isCorrect = index === activeQuestion.answerIndex;
                  const showState = !isEditable && selectedOption !== -1;
                  const visualClass = isEditable
                    ? isCorrect
                      ? 'border-green-400/60 bg-green-400/15 text-green-100'
                      : 'border-white/15 bg-white/5 text-white/85 hover:border-white/25 hover:bg-white/12'
                    : showState
                      ? isCorrect
                        ? 'border-green-300/60 bg-green-400/15 text-green-100 quiz-choice-selected'
                        : isSelected
                          ? 'border-rose-400/60 bg-rose-400/15 text-rose-100 quiz-choice-selected'
                          : 'border-white/10 bg-white/5 text-white/70'
                      : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10';

                  return (
                    <button
                      key={`${activeQuestion.id}-option-${index}`}
                      type="button"
                      onClick={() => handleOptionClick(index)}
                      disabled={isEditable ? false : selectedOption !== -1}
                      className={`w-full rounded-2xl border px-4 py-4 text-left text-base font-medium transition-all sm:px-5 sm:py-5 ${visualClass}`}
                    >
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onMouseDown={isEditable ? (event) => event.stopPropagation() : undefined}
                        onBlur={(event) => {
                          if (!isEditable) return;
                          handleQuizOptionChange(currentQuestion, index, event.currentTarget.textContent || '');
                        }}
                      >
                        {option}
                      </span>
                      {showState && isCorrect && (
                        <span className="ml-2 inline-flex items-center text-xs font-semibold text-green-200">+1</span>
                      )}
                      {isEditable && (
                        <span className={`ml-2 inline-flex items-center rounded-full px-2 text-[0.65rem] font-semibold ${isCorrect ? 'bg-green-400/25 text-green-50' : 'bg-white/15 text-white/80'}`}>
                          {isCorrect ? 'Doğru' : 'Seç'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-white/70">
                <span>
                  {isEditable
                    ? 'Doğru cevabı işaretlemek veya seçeneği düzenlemek için dokunun'
                    : selectedOptions[currentQuestion] !== -1
                      ? currentQuestion < questions.length - 1
                        ? 'Birazdan sonraki soru'
                        : 'Final mesajı yükleniyor'
                      : 'Cevabı seçmek için dokunun'}
                </span>
              </div>
            </div>
          )}

          {shouldShowCompletion && (
            <div className="mt-10 rounded-[32px] border border-white/15 bg-white/10 p-8 text-center backdrop-blur-xl sm:p-10">
              <h3
                className={`text-2xl font-semibold text-white sm:text-3xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('quizCompletionTitle', event.currentTarget.textContent || '')}
              >
                {fields.quizCompletionTitle || DEFAULT_FIELDS.quizCompletionTitle}
              </h3>
              {isEditable ? (
                <div className="mt-5 space-y-4 text-left text-sm text-white/75 sm:text-base">
                  <div>
                    <span className="block text-xs uppercase tracking-[0.35em] text-white/60">Mükemmel Skor Mesajı</span>
                    <p
                      className="mt-2 w-full cursor-text rounded-2xl bg-white/10 px-4 py-3 hover:bg-white/15"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => onFieldChange('quizSuccessMessage', event.currentTarget.textContent || '')}
                    >
                      {fields.quizSuccessMessage || DEFAULT_FIELDS.quizSuccessMessage}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-[0.35em] text-white/60">Tekrar Dene Mesajı</span>
                    <p
                      className="mt-2 w-full cursor-text rounded-2xl bg-white/10 px-4 py-3 hover:bg-white/15"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => onFieldChange('quizTryAgainMessage', event.currentTarget.textContent || '')}
                    >
                      {fields.quizTryAgainMessage || DEFAULT_FIELDS.quizTryAgainMessage}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-base text-white/80 sm:text-lg">
                  {score === questions.length
                    ? fields.quizSuccessMessage || DEFAULT_FIELDS.quizSuccessMessage
                    : fields.quizTryAgainMessage || DEFAULT_FIELDS.quizTryAgainMessage}
                </p>
              )}
              <p
                className={`mt-4 whitespace-pre-line text-base text-white/70 ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) => onFieldChange('mainMessage', event.currentTarget.textContent || '')}
              >
                {mainMessage}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 rounded-full bg-white/20 px-6 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/30"
              >
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => {
                    if (!isEditable) return;
                    onFieldChange('quizRetryButtonLabel', event.currentTarget.textContent || '');
                  }}
                >
                  {fields.quizRetryButtonLabel || DEFAULT_FIELDS.quizRetryButtonLabel}
                </span>
              </button>
            </div>
          )}
        </div>

        {creatorName && (
          <p className="mt-8 text-sm text-white/70">
            Hazırlayan: {creatorName}
          </p>
        )}
      </div>

      <style jsx>{`
        .quiz-choice-selected {
          animation: eom-quiz-bounce 0.6s ease, eom-quiz-flash 0.6s ease;
        }

        @keyframes eom-quiz-bounce {
          0% {
            transform: scale(1);
          }
          35% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes eom-quiz-flash {
          0% {
            box-shadow: 0 0 0 rgba(255, 255, 255, 0);
          }
          50% {
            box-shadow: 0 0 32px rgba(255, 255, 255, 0.25);
          }
          100% {
            box-shadow: 0 0 0 rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
  );
}

function PuzzleLoveMessage({ fields, isEditable, onFieldChange, creatorName, mainMessage, recipientName }: SharedTemplateProps) {
  const [tiles, setTiles] = useState<number[]>(() => createShuffledIndices(GRID_SIZE));
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const photoUrl = fields.puzzlePhotoUrl || DEFAULT_FIELDS.puzzlePhotoUrl;
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#4c1d95] text-white">
      <div className="absolute inset-0 opacity-65">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.22),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_100deg_at_10%_40%,_rgba(79,70,229,0.34),_transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-[-28%] h-[52%] rounded-[50%] bg-[rgba(79,70,229,0.28)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 pb-20 pt-20">
        <div className="w-full rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {recipientName ? `${recipientName} ile Puzzle Love` : 'Puzzle Love Deneyimi'}
            </p>
            <h2
              className={`mt-4 text-3xl font-semibold text-white sm:text-4xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('puzzleHeadline', event.currentTarget.textContent || '')}
            >
              {fields.puzzleHeadline || DEFAULT_FIELDS.puzzleHeadline}
            </h2>
            <p
              className={`mt-3 max-w-2xl text-base text-white/75 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => onFieldChange('puzzleSubtitle', event.currentTarget.textContent || '')}
            >
              {fields.puzzleSubtitle || DEFAULT_FIELDS.puzzleSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-[2fr_1fr]">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-1 shadow-[0_35px_90px_rgba(168,85,247,0.35)]">
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
                            isSelected ? 'z-10 ring-4 ring-pink-400/70 ring-offset-2 ring-offset-black/30' : ''
                          }`}
                          onClick={() => handleTileSelect(index)}
                          style={{
                            backgroundImage: `url(${photoUrl})`,
                            backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                            backgroundPosition: `${positionX}% ${positionY}%`,
                          }}
                        >
                          <span className="pointer-events-none absolute inset-0 bg-black/10" />
                        </button>
                      );
                    })}
                  </div>

                  {showOverlay && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[28px] bg-black/60 px-6 text-center backdrop-blur-sm">
                      <h3
                        className={`text-2xl font-semibold text-white sm:text-3xl ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onFieldChange('puzzleCompletionTitle', event.currentTarget.textContent || '')}
                      >
                        {fields.puzzleCompletionTitle || DEFAULT_FIELDS.puzzleCompletionTitle}
                      </h3>
                      <p
                        className={`mt-4 max-w-xl text-base text-white/80 sm:text-lg ${isEditable ? 'cursor-text rounded-2xl px-4 py-2 hover:bg-white/10' : ''}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => onFieldChange('puzzleCompletionMessage', event.currentTarget.textContent || '')}
                      >
                        {fields.puzzleCompletionMessage || DEFAULT_FIELDS.puzzleCompletionMessage}
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
                  onBlur={(event) => onFieldChange('puzzleHint', event.currentTarget.textContent || '')}
                >
                  {fields.puzzleHint || DEFAULT_FIELDS.puzzleHint}
                </p>
                {isEditable && (
                  <div className="mt-4 text-xs text-white/70">
                    <span className="block text-[0.65rem] uppercase tracking-[0.35em] text-white/60">Fotoğraf URL</span>
                    <span
                      className="mt-2 inline-block w-full cursor-text rounded-2xl bg-white/10 px-3 py-2 text-left hover:bg-white/15"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => onFieldChange('puzzlePhotoUrl', event.currentTarget.textContent?.trim() || '')}
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
                    onFieldChange('puzzleResetLabel', event.currentTarget.textContent || '');
                  }}
                >
                  {fields.puzzleResetLabel || DEFAULT_FIELDS.puzzleResetLabel}
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
          background: linear-gradient(145deg, rgba(236, 72, 153, 0.18), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .puzzle-piece:hover::before {
          opacity: 1;
        }

        .puzzle-piece:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 18px 35px rgba(236, 72, 153, 0.28);
        }
      `}</style>
    </div>
  );
}

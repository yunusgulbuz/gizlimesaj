'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Button } from '@/components/ui/button';

interface NeonGlowLoveProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULT_HEADLINE = 'Seninle her şey daha anlamlı ❤️';
const DEFAULT_CTA = 'Birlikte Parlıyoruz ✨';
const DEFAULT_SUBTEXT = 'Şehrin ışıkları arasında bile senin gülüşün en parlak olanı.';
const DEFAULT_RECIPIENT = 'Kalbimin Sahibi';
const CTA_FEEDBACK_TIMEOUT = 1200;
const SPARK_LIFETIME = 700;

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface BokehCircle {
  id: number;
  size: number;
  blur: number;
  left: number;
  top: number;
  opacity: number;
  hue: number;
  delay: number;
}

const BOKEH_CIRCLES: BokehCircle[] = [
  { id: 0, size: 260, blur: 28, left: 12, top: 18, opacity: 0.32, hue: 305, delay: 0 },
  { id: 1, size: 190, blur: 36, left: 64, top: 26, opacity: 0.26, hue: 332, delay: 0.6 },
  { id: 2, size: 220, blur: 18, left: 82, top: 44, opacity: 0.38, hue: 280, delay: 1.2 },
  { id: 3, size: 300, blur: 34, left: 51, top: 72, opacity: 0.22, hue: 318, delay: 1.8 },
  { id: 4, size: 180, blur: 26, left: 34, top: 58, opacity: 0.29, hue: 290, delay: 2.4 },
  { id: 5, size: 150, blur: 20, left: 78, top: 16, opacity: 0.24, hue: 350, delay: 3.0 },
  { id: 6, size: 240, blur: 30, left: 20, top: 78, opacity: 0.27, hue: 270, delay: 3.6 },
  { id: 7, size: 170, blur: 22, left: 7, top: 44, opacity: 0.21, hue: 288, delay: 4.2 },
  { id: 8, size: 210, blur: 26, left: 88, top: 68, opacity: 0.25, hue: 336, delay: 4.8 },
  { id: 9, size: 150, blur: 18, left: 55, top: 10, opacity: 0.24, hue: 262, delay: 5.4 },
  { id: 10, size: 280, blur: 32, left: 42, top: 34, opacity: 0.2, hue: 312, delay: 6.0 },
  { id: 11, size: 160, blur: 24, left: 68, top: 84, opacity: 0.3, hue: 340, delay: 6.6 },
];

export default function NeonGlowLove({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: NeonGlowLoveProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [typedHeadline, setTypedHeadline] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  const [localRecipient, setLocalRecipient] = useState(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
  const [localHeadline, setLocalHeadline] = useState(textFields?.headline || DEFAULT_HEADLINE);
  const [localMessage, setLocalMessage] = useState(textFields?.mainMessage || message);
  const [localSubtext, setLocalSubtext] = useState(textFields?.subtext || DEFAULT_SUBTEXT);
  const [localCta, setLocalCta] = useState(textFields?.ctaText || DEFAULT_CTA);
  const [ctaPulse, setCtaPulse] = useState(false);
  const [ctaMessageVisible, setCtaMessageVisible] = useState(false);

  const pulseTimeoutRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const sparkIdRef = useRef(0);

  const getNextSparkId = () => {
    sparkIdRef.current += 1;
    return sparkIdRef.current;
  };

  useEffect(() => {
    setLocalRecipient(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
    setLocalHeadline(textFields?.headline || DEFAULT_HEADLINE);
    setLocalMessage(textFields?.mainMessage || message);
    setLocalSubtext(textFields?.subtext || DEFAULT_SUBTEXT);
    setLocalCta(textFields?.ctaText || DEFAULT_CTA);
  }, [recipientName, message, textFields]);

  const displayRecipient = isEditable
    ? localRecipient
    : textFields?.recipientName || localRecipient || recipientName || DEFAULT_RECIPIENT;
  const displayHeadline = isEditable ? localHeadline : (textFields?.headline || localHeadline);
  const displayMessage = isEditable ? localMessage : (textFields?.mainMessage || localMessage);
  const displaySubtext = isEditable ? localSubtext : (textFields?.subtext || localSubtext);
  const displayCta = isEditable ? localCta : (textFields?.ctaText || localCta);
  const displayCreator = (creatorName && creatorName.trim()) ? creatorName : 'Gizli Mesaj';

  useEffect(() => {
    if (isEditable) {
      setTypedHeadline(displayHeadline);
      return;
    }

    setTypedHeadline('');
    setTypingIndex(0);
    const text = displayHeadline;
    if (!text) return;

    const interval = window.setInterval(() => {
      setTypingIndex((prev) => {
        if (prev >= text.length) {
          window.clearInterval(interval);
          return prev;
        }
        setTypedHeadline(text.slice(0, prev + 1));
        return prev + 1;
      });
    }, 80);

    return () => window.clearInterval(interval);
  }, [displayHeadline, isEditable]);

  const handleSpark = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const id = getNextSparkId();

    setSparks((prev) => {
      const next = [...prev, { id, x, y }];
      return next.slice(-10);
    });

    window.setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => spark.id !== id));
    }, SPARK_LIFETIME);
  };

  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipient(value);
    if (key === 'headline') setLocalHeadline(value);
    if (key === 'mainMessage') setLocalMessage(value);
    if (key === 'subtext') setLocalSubtext(value);
    if (key === 'ctaText') setLocalCta(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const handleCtaClick = () => {
    if (isEditable) return;

    if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);

    setCtaPulse(true);
    setCtaMessageVisible(true);

    const id = getNextSparkId();
    setSparks((prev) => [...prev, { id, x: 50, y: 50 }]);
    window.setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => spark.id !== id));
    }, SPARK_LIFETIME);

    pulseTimeoutRef.current = window.setTimeout(() => {
      setCtaPulse(false);
      pulseTimeoutRef.current = null;
    }, SPARK_LIFETIME);

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setCtaMessageVisible(false);
      feedbackTimeoutRef.current = null;
    }, CTA_FEEDBACK_TIMEOUT);
  };

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
      if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-[#060014] text-white"
      onMouseMove={handleSpark}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b001f] via-[#180032] to-[#40004d]" />
      <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(255,0,155,0.2) 0%, rgba(6,0,20,0.6) 60%)' }} />

      {BOKEH_CIRCLES.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full"
          style={{
            width: circle.size,
            height: circle.size,
            left: `${circle.left}%`,
            top: `${circle.top}%`,
            opacity: circle.opacity,
            filter: `blur(${circle.blur}px)`,
            background: `radial-gradient(circle, hsla(${circle.hue}, 85%, 60%, 0.5) 0%, hsla(${circle.hue}, 85%, 45%, 0) 70%)`,
            animation: 'pulseGlow 8s ease-in-out infinite',
            animationDelay: `${circle.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-16 text-center space-y-10 sm:space-y-12 md:space-y-16">
        <div className="relative">
          <div className="flex flex-col items-center space-y-6">
            <div
              className={`uppercase tracking-[0.5em] text-xs sm:text-sm text-pink-200/80 ${
                isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-4 py-1 transition-colors' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent?.trim() || '')}
            >
              {displayRecipient}
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-light tracking-wide ${
                isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-4 transition-colors' : 'text-fuchsia-100'
              }`}
              style={{
                textShadow: isEditable ? undefined : '0 0 32px rgba(255, 0, 180, 0.45)',
                fontFamily: '"Poppins", "Segoe UI", sans-serif',
              }}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('headline', event.currentTarget.textContent || '')}
            >
              {isEditable ? displayHeadline : typedHeadline}
            </h1>

            <div
              className={`max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-pink-100/90 ${
                isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-4 py-2 transition-colors' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('mainMessage', event.currentTarget.textContent || '')}
            >
              {displayMessage}
            </div>

            <div
              className={`text-sm sm:text-base md:text-lg text-fuchsia-200/80 ${
                isEditable ? 'hover:bg-white/10 cursor-text rounded-lg px-3 py-1 transition-colors' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('subtext', event.currentTarget.textContent || '')}
            >
              {displaySubtext}
            </div>
          </div>
        </div>

        <div className="relative">
          <svg
            width="400"
            height="200"
            viewBox="0 0 400 200"
            className="w-56 sm:w-72 md:w-96 mx-auto"
          >
            <path
              d="M20 120 C 80 40, 150 40, 200 120 C 250 40, 320 40, 380 120"
              fill="transparent"
              stroke="url(#neonStroke)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: isEditable ? 0 : Math.max(0, 1000 - typingIndex * 12),
                filter: 'drop-shadow(0 0 16px rgba(255, 0, 195, 0.6)) drop-shadow(0 0 30px rgba(255, 0, 195, 0.4))',
                transition: 'stroke-dashoffset 0.6s ease-out',
              }}
            />
            <defs>
              <linearGradient id="neonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff00c3" />
                <stop offset="50%" stopColor="#ff66e5" />
                <stop offset="100%" stopColor="#ff007a" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-x-0 -bottom-12 mx-auto w-max text-sm text-fuchsia-100/80 tracking-[0.35em] uppercase">
            Hazırlayan: {displayCreator}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={handleCtaClick}
            className={`relative px-10 py-4 text-base sm:text-lg font-medium rounded-full border-0 transition transform hover:scale-105 ${
              isEditable ? 'pointer-events-none opacity-70' : ''
            } ${ctaPulse ? 'ring-2 ring-pink-300/70 ring-offset-2 ring-offset-transparent scale-[1.03]' : ''}`}
            style={{
              background: 'linear-gradient(90deg, #ff00c3, #ff4de1, #ff007a)',
              boxShadow: '0 0 25px rgba(255,0,180,0.5), 0 0 55px rgba(255,0,120,0.4)',
            }}
          >
            <span
              className={isEditable ? 'hover:bg-white/10 cursor-text rounded px-2' : ''}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleContentChange('ctaText', event.currentTarget.textContent || '')}
            >
              {displayCta}
            </span>
            {ctaPulse && <span className="pointer-events-none absolute inset-0 rounded-full border border-pink-200/70 animate-ctaPulse" />}
          </Button>

          {ctaMessageVisible && (
            <p className="text-xs uppercase tracking-[0.3em] text-pink-100/80">Kalbimiz ışıkla doldu ✨</p>
          )}
        </div>
      </div>

      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(255,0,200,0.4) 0%, rgba(255,0,200,0) 60%)',
            transform: 'translate(-50%, -50%)',
            animation: 'sparkle 0.6s ease-out forwards',
          }}
        />
      ))}

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1) translateY(0); }
          50% { opacity: 0.5; transform: scale(1.1) translateY(-10px); }
        }
        @keyframes sparkle {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
        }
        @keyframes ctaPulse {
          0% { opacity: 0.6; transform: scale(1); }
          70% { opacity: 0; transform: scale(1.25); }
          100% { opacity: 0; transform: scale(1.35); }
        }

        .animate-ctaPulse {
          animation: ctaPulse 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

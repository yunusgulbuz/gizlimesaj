'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';

interface ModernCorporateCongratsProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const CONFETTI_COLORS = ['#22d3ee', '#0ea5e9', '#2563eb', '#1e40af', '#f8fafc'];

export default function ModernCorporateCongrats({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ModernCorporateCongratsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState('');
  const [localNewPosition, setLocalNewPosition] = useState('');
  const [localCompanyName, setLocalCompanyName] = useState('');
  const [localHighlightMessage, setLocalHighlightMessage] = useState('');
  const [localMainMessage, setLocalMainMessage] = useState('');
  const [localCtaLabel, setLocalCtaLabel] = useState('');
  const [localCtaUrl, setLocalCtaUrl] = useState('');
  const [localNewStartLabel, setLocalNewStartLabel] = useState('');
  const [localLeadershipLabel, setLocalLeadershipLabel] = useState('');
  const [localLeadershipDesc, setLocalLeadershipDesc] = useState('');
  const [localStrategyLabel, setLocalStrategyLabel] = useState('');
  const [localStrategyDesc, setLocalStrategyDesc] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName || textFields?.recipientName || 'Başarılı Profesyonel');
    setLocalNewPosition(textFields?.newPosition || 'Yeni Operasyon Direktörü');
    setLocalCompanyName(textFields?.companyName || 'Atlas Teknoloji');
    setLocalHighlightMessage(textFields?.highlightMessage || 'Yeni görevinizde parlamaya hazırsınız.');
    setLocalMainMessage(textFields?.mainMessage || message || 'Yeni pozisyonunda başarılarının katlanarak artmasını diliyoruz. Liderlik vizyonunla ekibini ileri taşıyacağına eminiz!');
    setLocalCtaLabel(textFields?.ctaLabel || 'Teşekkürler');
    setLocalCtaUrl(textFields?.ctaUrl || '');
    setLocalNewStartLabel(textFields?.newStartLabel || 'Yeni Başlangıç');
    setLocalLeadershipLabel(textFields?.leadershipLabel || 'Takım Liderliği');
    setLocalLeadershipDesc(textFields?.leadershipDesc || 'Yüksek performans');
    setLocalStrategyLabel(textFields?.strategyLabel || 'Strateji');
    setLocalStrategyDesc(textFields?.strategyDesc || 'Güçlü vizyon');
  }, [recipientName, message, textFields]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    // Update local state immediately
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'newPosition') setLocalNewPosition(value);
    else if (key === 'companyName') setLocalCompanyName(value);
    else if (key === 'highlightMessage') setLocalHighlightMessage(value);
    else if (key === 'mainMessage') setLocalMainMessage(value);
    else if (key === 'ctaLabel') setLocalCtaLabel(value);
    else if (key === 'ctaUrl') setLocalCtaUrl(value);
    else if (key === 'newStartLabel') setLocalNewStartLabel(value);
    else if (key === 'leadershipLabel') setLocalLeadershipLabel(value);
    else if (key === 'leadershipDesc') setLocalLeadershipDesc(value);
    else if (key === 'strategyLabel') setLocalStrategyLabel(value);
    else if (key === 'strategyDesc') setLocalStrategyDesc(value);

    // Notify parent component
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.6 + Math.random() * 1.2,
        color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      })),
    []
  );

  // Get text values - use local state if editable, otherwise use props
  const name = isEditable ? localRecipientName : (recipientName || textFields?.recipientName || 'Başarılı Profesyonel');
  const position = isEditable ? localNewPosition : (textFields?.newPosition || 'Yeni Operasyon Direktörü');
  const company = isEditable ? localCompanyName : (textFields?.companyName || 'Atlas Teknoloji');
  const headline = `Tebrikler ${name}!`;
  const highlightMessage = isEditable ? localHighlightMessage : (textFields?.highlightMessage || 'Yeni görevinizde parlamaya hazırsınız.');
  const mainMessage = isEditable ? localMainMessage : (textFields?.mainMessage || message || 'Yeni pozisyonunda başarılarının katlanarak artmasını diliyoruz. Liderlik vizyonunla ekibini ileri taşıyacağına eminiz!');
  const ctaLabel = isEditable ? localCtaLabel : (textFields?.ctaLabel || 'Teşekkürler');
  const ctaUrl = isEditable ? localCtaUrl : (textFields?.ctaUrl || '');
  const newStartLabel = isEditable ? localNewStartLabel : (textFields?.newStartLabel || 'Yeni Başlangıç');
  const leadershipLabel = isEditable ? localLeadershipLabel : (textFields?.leadershipLabel || 'Takım Liderliği');
  const leadershipDesc = isEditable ? localLeadershipDesc : (textFields?.leadershipDesc || 'Yüksek performans');
  const strategyLabel = isEditable ? localStrategyLabel : (textFields?.strategyLabel || 'Strateji');
  const strategyDesc = isEditable ? localStrategyDesc : (textFields?.strategyDesc || 'Güçlü vizyon');

  const handleShare = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2200);

    if (ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0b1f3a] to-white text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 top-16 h-32 w-32 rotate-12 rounded-3xl border border-cyan-400/40" />
        <div className="absolute right-24 top-52 h-16 w-16 rotate-45 border border-white/20" />
        <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-16 top-24 h-24 w-24 rounded-3xl border border-cyan-400/30" />
      </div>

      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          {confettiPieces.map(piece => (
            <span
              key={piece.id}
              className="absolute block h-2 w-2 animate-confetti rounded-full"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotate}deg)`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 sm:gap-12 px-4 sm:px-6 py-12 sm:py-16 lg:flex-row lg:items-center lg:py-24">
        <div
          className={`relative flex h-[360px] sm:h-[420px] w-full max-w-md items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-2xl lg:h-[520px] ${
            isMounted ? 'animate-slide-in-left' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-6 sm:inset-8 rounded-3xl border border-white/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#38bdf81a,_transparent_60%)]" />
          <div className="absolute -right-12 top-24 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="relative flex flex-col items-center text-center text-white px-4">
            <div className="mb-6 sm:mb-8 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/30">
              <span className="text-3xl sm:text-4xl font-semibold">{name.charAt(0)}</span>
            </div>
            <h2
              className={`text-base sm:text-lg font-medium uppercase tracking-[0.3em] text-cyan-300 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('newStartLabel', e.currentTarget.textContent || '')}
            >
              {newStartLabel}
            </h2>
            <p
              className={`mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('newPosition', e.currentTarget.textContent || '')}
            >
              {position}
            </p>
            <p
              className={`mt-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-300 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('companyName', e.currentTarget.textContent || '')}
            >
              {company}
            </p>
            <div className="mt-10 flex items-center gap-x-8 text-sm text-slate-300">
              <div>
                <p
                  className={`font-semibold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('leadershipLabel', e.currentTarget.textContent || '')}
                >
                  {leadershipLabel}
                </p>
                <p
                  className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('leadershipDesc', e.currentTarget.textContent || '')}
                >
                  {leadershipDesc}
                </p>
              </div>
              <div className="h-12 w-px bg-slate-700" />
              <div>
                <p
                  className={`font-semibold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('strategyLabel', e.currentTarget.textContent || '')}
                >
                  {strategyLabel}
                </p>
                <p
                  className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('strategyDesc', e.currentTarget.textContent || '')}
                >
                  {strategyDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex-1 space-y-4 sm:space-y-6 md:space-y-8 ${isMounted ? 'animate-slide-in-right' : 'opacity-0'}`}>
          {creatorName && (
            <div className="inline-flex items-center gap-x-1 sm:gap-x-2 rounded-full border border-slate-200/60 bg-white/70 px-3 sm:px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500 backdrop-blur">
              Hazırlayan: <span className="text-slate-800">{creatorName}</span>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.replace('Tebrikler ', '').replace('!', '') || '')}
            >
              {headline}
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl font-medium text-cyan-700 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('highlightMessage', e.currentTarget.textContent || '')}
            >
              {highlightMessage}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-xl backdrop-blur">
            <p
              className={`text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
            >
              {mainMessage}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-700">
                <span
                  className={`${isEditable ? 'hover:bg-cyan-200 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('newPosition', e.currentTarget.textContent || '')}
                >
                  {position}
                </span>
                {' @ '}
                <span
                  className={`${isEditable ? 'hover:bg-cyan-200 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('companyName', e.currentTarget.textContent || '')}
                >
                  {company}
                </span>
              </span>
              {(textFields?.highlightOne || textFields?.highlightTwo) && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                  {textFields?.highlightOne || 'İlham Veren Liderlik'} {textFields?.highlightTwo ? `· ${textFields.highlightTwo}` : ''}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative">
            {isEditable && showUrlInput && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-3 w-full max-w-md">
                <label className="block text-xs font-medium text-slate-700 mb-1">Buton Tıklandığında Yönlendirilecek URL (opsiyonel):</label>
                <input
                  type="url"
                  value={localCtaUrl}
                  onChange={(e) => handleContentChange('ctaUrl', e.target.value)}
                  onBlur={() => setShowUrlInput(false)}
                  autoFocus
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
            <Button
              onClick={isEditable ? () => setShowUrlInput(!showUrlInput) : handleShare}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transition hover:shadow-blue-500/40 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                  <path d="m16 6-4-4-4 4" />
                  <path d="M12 2v14" />
                </svg>
                <span
                  className={`${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('ctaLabel', e.currentTarget.textContent || '')}
                >
                  {ctaLabel}
                </span>
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 transition group-hover:opacity-100" />
            </Button>
            {textFields?.secondaryCtaLabel && (
              <Button variant="outline" className="border-slate-300 text-slate-600">
                {textFields.secondaryCtaLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-120%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation-name: confettiFall;
          animation-timing-function: ease-in;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}

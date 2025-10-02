'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createAnalyticsTracker } from '@/lib/analytics';
import type { TemplateTextFields } from '../../shared/types';

interface PremiumDynamicCelebrationProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  shortId?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const CONFETTI_SHADES = ['#fb923c', '#f97316', '#38bdf8', '#0ea5e9', '#facc15'];

export default function PremiumDynamicCelebration({
  recipientName,
  message,
  creatorName,
  textFields,
  shortId,
  isEditable = false,
  onTextFieldChange,
}: PremiumDynamicCelebrationProps) {
  const [sceneActive, setSceneActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chartRise, setChartRise] = useState(false);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState('');
  const [localHeadline, setLocalHeadline] = useState('');
  const [localSubHeadline, setLocalSubHeadline] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [localButtonText, setLocalButtonText] = useState('');
  const [localNewPosition, setLocalNewPosition] = useState('');
  const [localTeamName, setLocalTeamName] = useState('');
  const [localCompanyName, setLocalCompanyName] = useState('');
  const [localSecondaryMessage, setLocalSecondaryMessage] = useState('');
  const [localButtonUrl, setLocalButtonUrl] = useState('');
  const [localNewStartLabel, setLocalNewStartLabel] = useState('');
  const [localPositionLabel, setLocalPositionLabel] = useState('');
  const [localTeamLabel, setLocalTeamLabel] = useState('');
  const [localPreparerLabel, setLocalPreparerLabel] = useState('');
  const [localOfficeSceneLabel, setLocalOfficeSceneLabel] = useState('');
  const [localTeamGuruLabel, setLocalTeamGuruLabel] = useState('');
  const [localInspiringMomentLabel, setLocalInspiringMomentLabel] = useState('');
  const [localSuccessChartLabel, setLocalSuccessChartLabel] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Initialize analytics tracker if shortId is provided
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;

  useEffect(() => {
    const timeout = setTimeout(() => setSceneActive(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  // Initialize local state with text fields
  useEffect(() => {
    const name = recipientName || textFields?.recipientName || 'Sevgili Liderimiz';
    setLocalRecipientName(name);
    setLocalHeadline(textFields?.headline || `Tebrikler ${name}!`);
    setLocalSubHeadline(textFields?.subHeadline || 'Yeni görevinde başarılar diliyoruz');
    setLocalDescription(textFields?.mainMessage || message || 'Takımın ve tüm şirketin ilham kaynağı olmaya devam edeceğine inanıyoruz. Enerjin ve vizyonunla yeni döneme güçlü bir başlangıç yapıyorsun!');
    setLocalButtonText(textFields?.celebrationButtonLabel || 'Teşekkürler');
    setLocalNewPosition(textFields?.newPosition || 'Growth Direktörü');
    setLocalTeamName(textFields?.teamName || 'Strateji ve Analiz');
    setLocalCompanyName(textFields?.companyName || 'Atlas Teknoloji');
    setLocalSecondaryMessage(textFields?.secondaryMessage || 'Yeni takım ruhu: İnovasyon, işbirliği ve yüksek enerji!');
    setLocalButtonUrl(textFields?.celebrationButtonUrl || '');
    setLocalNewStartLabel(textFields?.newStartLabel || 'Yeni Başlangıç ·');
    setLocalPositionLabel(textFields?.positionLabel || 'Pozisyon');
    setLocalTeamLabel(textFields?.teamLabel || 'Takım');
    setLocalPreparerLabel(textFields?.preparerLabel || 'Hazırlayan');
    setLocalOfficeSceneLabel(textFields?.officeSceneLabel || 'Ofis Sahnesi');
    setLocalTeamGuruLabel(textFields?.teamGuruLabel || 'Takım Guru');
    setLocalInspiringMomentLabel(textFields?.inspiringMomentLabel || 'İlham Veren An');
    setLocalSuccessChartLabel(textFields?.successChartLabel || 'Başarı Grafiği');
  }, [recipientName, message, textFields]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    // Update local state immediately
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'headline') setLocalHeadline(value);
    else if (key === 'subHeadline') setLocalSubHeadline(value);
    else if (key === 'mainMessage') setLocalDescription(value);
    else if (key === 'celebrationButtonLabel') setLocalButtonText(value);
    else if (key === 'newPosition') setLocalNewPosition(value);
    else if (key === 'teamName') setLocalTeamName(value);
    else if (key === 'companyName') setLocalCompanyName(value);
    else if (key === 'secondaryMessage') setLocalSecondaryMessage(value);
    else if (key === 'celebrationButtonUrl') setLocalButtonUrl(value);
    else if (key === 'newStartLabel') setLocalNewStartLabel(value);
    else if (key === 'positionLabel') setLocalPositionLabel(value);
    else if (key === 'teamLabel') setLocalTeamLabel(value);
    else if (key === 'preparerLabel') setLocalPreparerLabel(value);
    else if (key === 'officeSceneLabel') setLocalOfficeSceneLabel(value);
    else if (key === 'teamGuruLabel') setLocalTeamGuruLabel(value);
    else if (key === 'inspiringMomentLabel') setLocalInspiringMomentLabel(value);
    else if (key === 'successChartLabel') setLocalSuccessChartLabel(value);

    // Notify parent component
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const confetti = useMemo(
    () =>
      Array.from({ length: 42 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        color: CONFETTI_SHADES[id % CONFETTI_SHADES.length],
        spin: Math.random() * 360,
      })),
    []
  );

  // Get text values - use local state if editable, otherwise use props
  const name = isEditable ? localRecipientName : (recipientName || textFields?.recipientName || 'Sevgili Liderimiz');
  const headline = isEditable ? localHeadline : (textFields?.headline || `Tebrikler ${name}!`);
  const subHeadline = isEditable ? localSubHeadline : (textFields?.subHeadline || 'Yeni görevinde başarılar diliyoruz');
  const description = isEditable ? localDescription : (textFields?.mainMessage || message || 'Takımın ve tüm şirketin ilham kaynağı olmaya devam edeceğine inanıyoruz. Enerjin ve vizyonunla yeni döneme güçlü bir başlangıç yapıyorsun!');
  const buttonText = isEditable ? localButtonText : (textFields?.celebrationButtonLabel || 'Teşekkürler');
  const newPosition = isEditable ? localNewPosition : (textFields?.newPosition || 'Growth Direktörü');
  const teamName = isEditable ? localTeamName : (textFields?.teamName || 'Strateji ve Analiz');
  const companyName = isEditable ? localCompanyName : (textFields?.companyName || 'Atlas Teknoloji');
  const secondaryMessage = isEditable ? localSecondaryMessage : (textFields?.secondaryMessage || 'Yeni takım ruhu: İnovasyon, işbirliği ve yüksek enerji!');
  const buttonUrl = isEditable ? localButtonUrl : (textFields?.celebrationButtonUrl || '');
  const newStartLabel = isEditable ? localNewStartLabel : (textFields?.newStartLabel || 'Yeni Başlangıç ·');
  const positionLabel = isEditable ? localPositionLabel : (textFields?.positionLabel || 'Pozisyon');
  const teamLabel = isEditable ? localTeamLabel : (textFields?.teamLabel || 'Takım');
  const preparerLabel = isEditable ? localPreparerLabel : (textFields?.preparerLabel || 'Hazırlayan');
  const officeSceneLabel = isEditable ? localOfficeSceneLabel : (textFields?.officeSceneLabel || 'Ofis Sahnesi');
  const teamGuruLabel = isEditable ? localTeamGuruLabel : (textFields?.teamGuruLabel || 'Takım Guru');
  const inspiringMomentLabel = isEditable ? localInspiringMomentLabel : (textFields?.inspiringMomentLabel || 'İlham Veren An');
  const successChartLabel = isEditable ? localSuccessChartLabel : (textFields?.successChartLabel || 'Başarı Grafiği');

  const handleCelebrate = async () => {
    setShowConfetti(true);
    setChartRise(false);
    requestAnimationFrame(() => {
      setChartRise(true);
    });
    setTimeout(() => setShowConfetti(false), 2400);

    // Track button click
    if (analytics) {
      await analytics.trackButtonClick('celebration_button', {
        buttonText,
        confettiTriggered: true,
      });
    }

    if (buttonUrl) {
      const url = buttonUrl.startsWith('http://') || buttonUrl.startsWith('https://')
        ? buttonUrl
        : `https://${buttonUrl}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#101114] text-white">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 10%, rgba(8,145,178,0.35), transparent 55%)' }} />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(135deg, rgba(15,118,110,0.4) 0%, transparent 40%, rgba(236,72,153,0.3) 100%)' }} />

      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-40">
          {confetti.map(piece => (
            <span
              key={piece.id}
              className="absolute h-3 w-1 animate-premium-confetti rounded-full"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.spin}deg)`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 sm:gap-12 px-4 sm:px-6 py-12 sm:py-20 lg:flex-row lg:items-center">
        <div className={`flex-1 space-y-4 sm:space-y-6 ${sceneActive ? 'animate-rise-in' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 sm:px-4 py-2 text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-sky-200">
            <span
              className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('newStartLabel', e.currentTarget.textContent || '')}
            >
              {newStartLabel}
            </span> <span
              className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('companyName', e.currentTarget.textContent || '')}
            >
              {companyName}
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('headline', e.currentTarget.textContent || '')}
            >
              {headline}
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl text-sky-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('subHeadline', e.currentTarget.textContent || '')}
            >
              {subHeadline}
            </p>
          </div>

          <p
            className={`text-sm sm:text-base md:text-lg leading-relaxed text-slate-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
          >
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300">
            <div className="rounded-xl sm:rounded-2xl bg-white/10 px-3 sm:px-4 py-2 sm:py-3">
              <p
                className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-sky-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('positionLabel', e.currentTarget.textContent || '')}
              >
                {positionLabel}
              </p>
              <p
                className={`font-semibold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('newPosition', e.currentTarget.textContent || '')}
              >
                {newPosition}
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl bg-white/10 px-3 sm:px-4 py-2 sm:py-3">
              <p
                className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-sky-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('teamLabel', e.currentTarget.textContent || '')}
              >
                {teamLabel}
              </p>
              <p
                className={`font-semibold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('teamName', e.currentTarget.textContent || '')}
              >
                {teamName}
              </p>
            </div>
            {creatorName && (
              <div className="rounded-xl sm:rounded-2xl bg-white/10 px-3 sm:px-4 py-2 sm:py-3">
                <p
                  className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-sky-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('preparerLabel', e.currentTarget.textContent || '')}
                >
                  {preparerLabel}
                </p>
                <p className="font-semibold text-white break-words">{creatorName}</p>
              </div>
            )}
          </div>

          <div className="relative">
            {isEditable && showUrlInput && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-3 w-full max-w-md">
                <label className="block text-xs font-medium text-slate-700 mb-1">Buton Tıklandığında Yönlendirilecek URL (opsiyonel):</label>
                <input
                  type="url"
                  value={localButtonUrl}
                  onChange={(e) => handleContentChange('celebrationButtonUrl', e.target.value)}
                  onBlur={() => setShowUrlInput(false)}
                  autoFocus
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
            <Button
              onClick={isEditable ? () => setShowUrlInput(!showUrlInput) : handleCelebrate}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-400 to-sky-400 text-slate-900 shadow-lg shadow-orange-500/40 transition hover:shadow-orange-500/60 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base"
            >
            <span className="relative z-10 flex items-center gap-1 sm:gap-2 font-semibold">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 21 4 14 10 12 8 20Z" />
                <path d="m14 3 7 7" />
                <path d="M14 10h7v7" />
                <path d="m9 13 6 6" />
              </svg>
              <span
                className={`${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('celebrationButtonLabel', e.currentTarget.textContent || '')}
              >
                {buttonText}
              </span>
            </span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-300 opacity-0 transition group-hover:opacity-100" />
          </Button>
          </div>
        </div>

        <div className="relative flex-1">
          <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 backdrop-blur-lg shadow-[0_30px_60px_rgba(8,145,178,0.25)] ${
            sceneActive ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="col-span-1 rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/20 to-transparent p-6 shadow-inner">
                <p
                  className={`text-xs uppercase tracking-[0.4em] text-sky-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('officeSceneLabel', e.currentTarget.textContent || '')}
                >
                  {officeSceneLabel}
                </p>
                <div className="mt-6 flex items-end justify-between">
                  <div className={`flex flex-col items-center transition duration-700 ${sceneActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg" />
                    <div className="mt-3 h-12 w-16 rounded-lg bg-white/20" />
                    <div className="mt-2 h-6 w-24 rounded-lg bg-white/10" />
                  </div>
                  <div className={`flex flex-col items-center transition duration-700 delay-150 ${sceneActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <div className="h-16 w-16 -translate-y-4 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg" />
                    <div className="h-10 w-14 rounded-lg bg-white/20" />
                    <div className="mt-2 h-6 w-20 rounded-lg bg-white/10" />
                  </div>
                  <div className={`flex flex-col items-center transition duration-700 delay-300 ${sceneActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg" />
                    <div className="mt-3 h-12 w-16 rounded-lg bg-white/20" />
                    <div className="mt-2 h-6 w-24 rounded-lg bg-white/10" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-300">
                  <span
                    className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('teamGuruLabel', e.currentTarget.textContent || '')}
                  >
                    {teamGuruLabel}
                  </span>
                  <span
                    className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('inspiringMomentLabel', e.currentTarget.textContent || '')}
                  >
                    {inspiringMomentLabel}
                  </span>
                </div>
              </div>

              <div className="col-span-1 flex flex-col justify-between gap-4 sm:gap-6">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5">
                  <p
                    className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-sky-200 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('successChartLabel', e.currentTarget.textContent || '')}
                  >
                    {successChartLabel}
                  </p>
                  <div className="mt-4 sm:mt-6 h-32 sm:h-40 w-full overflow-hidden">
                    <div className="relative h-full w-full">
                      <svg viewBox="0 0 200 120" className="h-full w-full">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        <polyline
                          points="10,110 50,90 90,80 130,60 170,30"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="6"
                          strokeLinecap="round"
                          className={`origin-bottom transition-all duration-1000 ${chartRise ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                        />
                        <polygon
                          points="10,110 50,90 90,80 130,60 170,30 170,110"
                          fill="url(#chartGradient)"
                          className={`origin-bottom transition-all duration-1000 ${chartRise ? 'scale-y-100 opacity-80' : 'scale-y-0 opacity-0'}`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-xs sm:text-sm text-slate-200">
                  <p
                    className={`break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('secondaryMessage', e.currentTarget.textContent || '')}
                  >
                    {secondaryMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes premiumConfetti {
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
        .animate-premium-confetti {
          animation-name: premiumConfetti;
          animation-timing-function: ease-in;
        }
        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-rise-in {
          animation: riseIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}

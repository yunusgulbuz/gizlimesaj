'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';

interface ClassicPrestigeCertificateProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const STAR_COLORS = ['#facc15', '#fbbf24', '#f59e0b'];

export default function ClassicPrestigeCertificate({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: ClassicPrestigeCertificateProps) {
  const [animateFrame, setAnimateFrame] = useState(false);
  const [showStars, setShowStars] = useState(false);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState('');
  const [localCertificateTitle, setLocalCertificateTitle] = useState('');
  const [localCertificateSubtitle, setLocalCertificateSubtitle] = useState('');
  const [localDedication, setLocalDedication] = useState('');
  const [localFooterNote, setLocalFooterNote] = useState('');
  const [localButtonText, setLocalButtonText] = useState('');
  const [localButtonUrl, setLocalButtonUrl] = useState('');
  const [localCertLabel, setLocalCertLabel] = useState('');
  const [localVisionLabel, setLocalVisionLabel] = useState('');
  const [localVisionDesc, setLocalVisionDesc] = useState('');
  const [localLeadershipLabel, setLocalLeadershipLabel] = useState('');
  const [localLeadershipDesc, setLocalLeadershipDesc] = useState('');
  const [localSuccessLabel, setLocalSuccessLabel] = useState('');
  const [localSuccessDesc, setLocalSuccessDesc] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateFrame(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName || textFields?.recipientName || 'Sayın Profesyonel');
    setLocalCertificateTitle(textFields?.certificateTitle || 'Tebrikler! Yeni Görevinizde Başarılar');
    setLocalCertificateSubtitle(textFields?.certificateSubtitle || `${textFields?.newPosition || 'Bölüm Direktörü'} - ${textFields?.companyName || 'Atlas Teknoloji'}`);
    setLocalDedication(textFields?.mainMessage || message || 'Yeni görevinizdeki liderliğiniz ve vizyonunuzla ilham vermeye devam edeceğinize inanıyoruz. Başarılarınız daim olsun!');
    setLocalFooterNote(textFields?.footerMessage || 'Takımınız ve yol arkadaşlarınız adına...');
    setLocalButtonText(textFields?.downloadLabel || 'Tebrik Kartını İndir');
    setLocalButtonUrl(textFields?.downloadUrl || '');
    setLocalCertLabel(textFields?.certificateLabel || 'Resmi Tebrik Sertifikası');
    setLocalVisionLabel(textFields?.visionLabel || 'Vizyon');
    setLocalVisionDesc(textFields?.visionDesc || 'Yeni ufuklar');
    setLocalLeadershipLabel(textFields?.leadershipLabel || 'Liderlik');
    setLocalLeadershipDesc(textFields?.leadershipDesc || 'İlham dolu');
    setLocalSuccessLabel(textFields?.successLabel || 'Başarı');
    setLocalSuccessDesc(textFields?.successDesc || 'Sürdürülebilir');
  }, [recipientName, message, textFields]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    // Update local state immediately
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'certificateTitle') setLocalCertificateTitle(value);
    else if (key === 'certificateSubtitle') setLocalCertificateSubtitle(value);
    else if (key === 'mainMessage') setLocalDedication(value);
    else if (key === 'footerMessage') setLocalFooterNote(value);
    else if (key === 'downloadLabel') setLocalButtonText(value);
    else if (key === 'downloadUrl') setLocalButtonUrl(value);
    else if (key === 'certificateLabel') setLocalCertLabel(value);
    else if (key === 'visionLabel') setLocalVisionLabel(value);
    else if (key === 'visionDesc') setLocalVisionDesc(value);
    else if (key === 'leadershipLabel') setLocalLeadershipLabel(value);
    else if (key === 'leadershipDesc') setLocalLeadershipDesc(value);
    else if (key === 'successLabel') setLocalSuccessLabel(value);
    else if (key === 'successDesc') setLocalSuccessDesc(value);

    // Notify parent component
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const stars = useMemo(
    () =>
      Array.from({ length: 24 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.8 + Math.random() * 1.2,
        color: STAR_COLORS[id % STAR_COLORS.length],
      })),
    []
  );

  // Get text values - use local state if editable, otherwise use props
  const name = isEditable ? localRecipientName : (recipientName || textFields?.recipientName || 'Sayın Profesyonel');
  const certificateTitle = isEditable ? localCertificateTitle : (textFields?.certificateTitle || 'Tebrikler! Yeni Görevinizde Başarılar');
  const certificateSubtitle = isEditable ? localCertificateSubtitle : (textFields?.certificateSubtitle || `${textFields?.newPosition || 'Bölüm Direktörü'} - ${textFields?.companyName || 'Atlas Teknoloji'}`);
  const dedication = isEditable ? localDedication : (textFields?.mainMessage || message || 'Yeni görevinizdeki liderliğiniz ve vizyonunuzla ilham vermeye devam edeceğinize inanıyoruz. Başarılarınız daim olsun!');
  const footerNote = isEditable ? localFooterNote : (textFields?.footerMessage || 'Takımınız ve yol arkadaşlarınız adına...');
  const buttonText = isEditable ? localButtonText : (textFields?.downloadLabel || 'Tebrik Kartını İndir');
  const buttonUrl = isEditable ? localButtonUrl : (textFields?.downloadUrl || '');
  const certLabel = isEditable ? localCertLabel : (textFields?.certificateLabel || 'Resmi Tebrik Sertifikası');
  const visionLabel = isEditable ? localVisionLabel : (textFields?.visionLabel || 'Vizyon');
  const visionDesc = isEditable ? localVisionDesc : (textFields?.visionDesc || 'Yeni ufuklar');
  const leadershipLabel = isEditable ? localLeadershipLabel : (textFields?.leadershipLabel || 'Liderlik');
  const leadershipDesc = isEditable ? localLeadershipDesc : (textFields?.leadershipDesc || 'İlham dolu');
  const successLabel = isEditable ? localSuccessLabel : (textFields?.successLabel || 'Başarı');
  const successDesc = isEditable ? localSuccessDesc : (textFields?.successDesc || 'Sürdürülebilir');

  const handleDownload = () => {
    setShowStars(true);
    setTimeout(() => setShowStars(false), 2600);

    if (buttonUrl) {
      const url = buttonUrl.startsWith('http://') || buttonUrl.startsWith('https://')
        ? buttonUrl
        : `https://${buttonUrl}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f1e5] px-4 sm:px-6 py-8 sm:py-12 text-slate-900">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#d6cec2 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {showStars && (
        <div className="pointer-events-none absolute inset-0 z-30">
          {stars.map(star => (
            <span
              key={star.id}
              className="absolute h-2 w-2 animate-star-fall rounded-full"
              style={{
                left: `${star.left}%`,
                backgroundColor: star.color,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className={`relative z-20 w-full max-w-3xl rounded-[1.5rem] sm:rounded-[2.5rem] border-4 sm:border-8 border-[#ccb067] bg-gradient-to-b from-[#0f172a] via-[#111c34] to-[#152443] p-1.5 sm:p-2 shadow-[0_25px_40px_rgba(17,28,52,0.25)] ${
        animateFrame ? 'animate-frame-glow' : 'opacity-0'
      }`}>
        <div className="rounded-[1.25rem] sm:rounded-[2rem] border-2 sm:border-4 border-[#f1e4c8] bg-[#faf6ee] p-6 sm:p-10 md:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-[#c19a3f]">
              <span className="h-px w-6 sm:w-8 bg-[#c19a3f]" />
              <span
                className={`text-[0.6rem] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] uppercase break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('certificateLabel', e.currentTarget.textContent || '')}
              >
                {certLabel}
              </span>
              <span className="h-px w-6 sm:w-8 bg-[#c19a3f]" />
            </div>

            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-[#14203b] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('certificateTitle', e.currentTarget.textContent || '')}
            >
              {certificateTitle}
            </h1>
            <p
              className={`mt-2 sm:mt-3 text-base sm:text-lg italic text-[#c19a3f] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
            >
              {name}
            </p>
            <p
              className={`mt-2 text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#8b6f2f] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('certificateSubtitle', e.currentTarget.textContent || '')}
            >
              {certificateSubtitle}
            </p>

            <div className="mt-6 sm:mt-10 w-full max-w-2xl rounded-[1rem] sm:rounded-[1.5rem] border border-[#e4d9bf] bg-white/80 p-6 sm:p-8 text-left shadow-inner">
              <p
                className={`text-sm sm:text-base md:text-lg leading-relaxed text-[#4b5563] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
              >
                {dedication}
              </p>
              <div className="mt-8 grid gap-2 text-sm text-[#8b6f2f] sm:grid-cols-3">
                <div className="rounded-xl border border-[#e6dcc5] bg-[#fdf8ec] px-4 py-3 text-center">
                  <p
                    className={`font-semibold text-[#c19a3f] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('visionLabel', e.currentTarget.textContent || '')}
                  >
                    {visionLabel}
                  </p>
                  <p
                    className={`text-xs text-[#7f6a3b] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('visionDesc', e.currentTarget.textContent || '')}
                  >
                    {visionDesc}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e6dcc5] bg-[#fdf8ec] px-4 py-3 text-center">
                  <p
                    className={`font-semibold text-[#c19a3f] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('leadershipLabel', e.currentTarget.textContent || '')}
                  >
                    {leadershipLabel}
                  </p>
                  <p
                    className={`text-xs text-[#7f6a3b] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('leadershipDesc', e.currentTarget.textContent || '')}
                  >
                    {leadershipDesc}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e6dcc5] bg-[#fdf8ec] px-4 py-3 text-center">
                  <p
                    className={`font-semibold text-[#c19a3f] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('successLabel', e.currentTarget.textContent || '')}
                  >
                    {successLabel}
                  </p>
                  <p
                    className={`text-xs text-[#7f6a3b] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded px-1 transition-colors' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('successDesc', e.currentTarget.textContent || '')}
                  >
                    {successDesc}
                  </p>
                </div>
              </div>
            </div>

            <p
              className={`mt-6 sm:mt-8 text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#8b6f2f] break-words ${isEditable ? 'hover:bg-[#c19a3f]/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('footerMessage', e.currentTarget.textContent || '')}
            >
              {footerNote}
            </p>

            {creatorName && (
              <div className="mt-4 sm:mt-6 text-[0.6rem] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#c19a3f]">
                Hazırlayan: {creatorName}
              </div>
            )}

            <div className="mt-6 sm:mt-10 relative">
              {isEditable && showUrlInput && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border border-[#c19a3f] p-3 w-full max-w-md">
                  <label className="block text-xs font-medium text-[#8b6f2f] mb-1">Buton Tıklandığında Yönlendirilecek URL (opsiyonel):</label>
                  <input
                    type="url"
                    value={localButtonUrl}
                    onChange={(e) => handleContentChange('downloadUrl', e.target.value)}
                    onBlur={() => setShowUrlInput(false)}
                    autoFocus
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-sm border border-[#c19a3f] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c19a3f]"
                  />
                </div>
              )}
              <Button
                onClick={isEditable ? () => setShowUrlInput(!showUrlInput) : handleDownload}
                className="group relative overflow-hidden rounded-full border-2 border-[#c19a3f] bg-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#8b6f2f] transition"
              >
                <span
                  className={`relative z-10 ${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('downloadLabel', e.currentTarget.textContent || '')}
                >
                  {buttonText}
                </span>
                <span className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-[#facc15] via-[#fbbf24] to-[#c19a3f] transition group-hover:translate-y-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes frameGlow {
          0% {
            box-shadow: 0 0 0 rgba(193, 154, 63, 0.6);
            opacity: 0;
            transform: scale(0.96);
          }
          100% {
            box-shadow: 0 25px 40px rgba(17, 28, 52, 0.25), 0 0 35px rgba(193, 154, 63, 0.35);
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-frame-glow {
          animation: frameGlow 1s ease-out forwards;
        }
        @keyframes starFall {
          0% {
            transform: translateY(-120%) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) scale(1.1);
            opacity: 0;
          }
        }
        .animate-star-fall {
          animation-name: starFall;
          animation-timing-function: ease-in;
        }
      `}</style>
    </div>
  );
}

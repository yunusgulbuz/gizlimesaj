'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createAnalyticsTracker } from '@/lib/analytics';
import type { TemplateTextFields } from '../../shared/types';

interface MinimalistProfessionalCardProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  shortId?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

export default function MinimalistProfessionalCard({
  recipientName,
  message,
  creatorName,
  textFields,
  shortId,
  isEditable = false,
  onTextFieldChange,
}: MinimalistProfessionalCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState('');
  const [localTitle, setLocalTitle] = useState('');
  const [localNote, setLocalNote] = useState('');
  const [localSmallNote, setLocalSmallNote] = useState('');
  const [localButtonLabel, setLocalButtonLabel] = useState('');
  const [localNewPosition, setLocalNewPosition] = useState('');
  const [localStartDate, setLocalStartDate] = useState('');
  const [localCompanyName, setLocalCompanyName] = useState('');
  const [localButtonUrl, setLocalButtonUrl] = useState('');
  const [localNewRoleLabel, setLocalNewRoleLabel] = useState('');
  const [localStartLabel, setLocalStartLabel] = useState('');
  const [localProfessionalNote, setLocalProfessionalNote] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Initialize analytics tracker if shortId is provided
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName || textFields?.recipientName || 'Sevgili İş Ortağımız');
    setLocalTitle(textFields?.minimalTitle || 'Yeni Göreviniz Hayırlı Olsun');
    setLocalNote(textFields?.mainMessage || message || 'Profesyonel yolculuğunuzun bu yeni adımında başarılarınızın devamını diliyoruz.');
    setLocalSmallNote(textFields?.supplementMessage || 'Takım arkadaşlarınız sizinle gurur duyuyor.');
    setLocalButtonLabel(textFields?.messageButtonLabel || 'Teşekkürler');
    setLocalNewPosition(textFields?.newPosition || 'Operasyon Direktörü');
    setLocalStartDate(textFields?.startDate || 'Hemen');
    setLocalCompanyName(textFields?.companyName || 'Atlas Teknoloji');
    setLocalButtonUrl(textFields?.messageButtonUrl || '');
    setLocalNewRoleLabel(textFields?.newRoleLabel || 'Yeni rol');
    setLocalStartLabel(textFields?.startLabel || 'Başlangıç');
    setLocalProfessionalNote(textFields?.professionalNote || 'Profesyonel dayanışma');
  }, [recipientName, message, textFields]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    // Update local state immediately
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'minimalTitle') setLocalTitle(value);
    else if (key === 'mainMessage') setLocalNote(value);
    else if (key === 'supplementMessage') setLocalSmallNote(value);
    else if (key === 'messageButtonLabel') setLocalButtonLabel(value);
    else if (key === 'newPosition') setLocalNewPosition(value);
    else if (key === 'startDate') setLocalStartDate(value);
    else if (key === 'companyName') setLocalCompanyName(value);
    else if (key === 'messageButtonUrl') setLocalButtonUrl(value);
    else if (key === 'newRoleLabel') setLocalNewRoleLabel(value);
    else if (key === 'startLabel') setLocalStartLabel(value);
    else if (key === 'professionalNote') setLocalProfessionalNote(value);

    // Notify parent component
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get text values - use local state if editable, otherwise use props
  const name = isEditable ? localRecipientName : (recipientName || textFields?.recipientName || 'Sevgili İş Ortağımız');
  const title = isEditable ? localTitle : (textFields?.minimalTitle || 'Yeni Göreviniz Hayırlı Olsun');
  const note = isEditable ? localNote : (textFields?.mainMessage || message || 'Profesyonel yolculuğunuzun bu yeni adımında başarılarınızın devamını diliyoruz.');
  const smallNote = isEditable ? localSmallNote : (textFields?.supplementMessage || 'Takım arkadaşlarınız sizinle gurur duyuyor.');
  const buttonLabel = isEditable ? localButtonLabel : (textFields?.messageButtonLabel || 'Teşekkürler');
  const buttonUrl = isEditable ? localButtonUrl : (textFields?.messageButtonUrl || '');
  const newPosition = isEditable ? localNewPosition : (textFields?.newPosition || 'Operasyon Direktörü');
  const startDate = isEditable ? localStartDate : (textFields?.startDate || 'Hemen');
  const companyName = isEditable ? localCompanyName : (textFields?.companyName || 'Atlas Teknoloji');
  const newRoleLabel = isEditable ? localNewRoleLabel : (textFields?.newRoleLabel || 'Yeni rol');
  const startLabel = isEditable ? localStartLabel : (textFields?.startLabel || 'Başlangıç');
  const professionalNote = isEditable ? localProfessionalNote : (textFields?.professionalNote || 'Profesyonel dayanışma');

  const handleMessage = async () => {
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);

    // Track button click
    if (analytics) {
      await analytics.trackButtonClick('professional_thanks', {
        buttonLabel,
        hasUrl: !!buttonUrl,
      });
    }

    if (buttonUrl) {
      window.open(buttonUrl, '_blank');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-8 sm:py-10">
      <div
        className={`relative w-full max-w-xl rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 md:p-10 shadow-lg backdrop-blur transition duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">
            <span
              className={`break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded px-1 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('companyName', e.currentTarget.textContent || '')}
            >
              {companyName}
            </span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div>
            <p
              className={`text-xs sm:text-sm font-medium text-slate-400 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
            >
              {name}
            </p>
            <h1
              className={`mt-1 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('minimalTitle', e.currentTarget.textContent || '')}
            >
              {title}
            </h1>
            <p
              className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
            >
              {note}
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-6 text-xs sm:text-sm text-slate-500">
            <p
              className={`break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('supplementMessage', e.currentTarget.textContent || '')}
            >
              {smallNote}
            </p>
            {creatorName && <p className="mt-3 sm:mt-4 text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">Gönderen: {creatorName}</p>}
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-xl sm:rounded-2xl border border-slate-100 bg-white px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-500">
            <div>
              <p
                className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('newRoleLabel', e.currentTarget.textContent || '')}
              >
                {newRoleLabel}
              </p>
              <p
                className={`font-medium text-slate-900 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('newPosition', e.currentTarget.textContent || '')}
              >
                {newPosition}
              </p>
            </div>
            <div className="sm:text-right">
              <p
                className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('startLabel', e.currentTarget.textContent || '')}
              >
                {startLabel}
              </p>
              <p
                className={`font-medium text-slate-900 break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded px-1 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('startDate', e.currentTarget.textContent || '')}
              >
                {startDate}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between relative">
            {isEditable && showUrlInput && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-300 p-3 w-full max-w-md">
                <label className="block text-xs font-medium text-slate-700 mb-1">Buton Tıklandığında Yönlendirilecek URL (opsiyonel):</label>
                <input
                  type="url"
                  value={localButtonUrl}
                  onChange={(e) => handleContentChange('messageButtonUrl', e.target.value)}
                  onBlur={() => setShowUrlInput(false)}
                  autoFocus
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            )}
            <Button
              onClick={isEditable ? () => setShowUrlInput(!showUrlInput) : handleMessage}
              className="group relative flex-1 overflow-hidden bg-slate-900 text-white shadow-sm transition hover:bg-slate-800 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v13H5.17L4 18.17V4Z" />
                  <path d="m10 11 2 2 4-4" />
                </svg>
                <span
                  className={`${isEditable ? 'hover:bg-white/10 cursor-text rounded px-1 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('messageButtonLabel', e.currentTarget.textContent || '')}
                >
                  {buttonLabel}
                </span>
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 transition group-hover:opacity-100" />
            </Button>

            <span
              className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 text-center sm:text-left break-words ${isEditable ? 'hover:bg-slate-100 cursor-text rounded px-1 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('professionalNote', e.currentTarget.textContent || '')}
            >
              {professionalNote}
            </span>
          </div>
        </div>

        {showCheck && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400 bg-white text-emerald-500 shadow-lg">
              <svg className="h-10 w-10 animate-scale-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-scale-bounce {
          animation: scaleBounce 0.6s ease;
        }
        @keyframes scaleBounce {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PureLoveMinimalProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface AccentDot {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
}

const DEFAULT_RECIPIENT = 'Kalbimin Sahibi';
const DEFAULT_PRIMARY = 'Sen olunca her şey tamam.';
const DEFAULT_SECONDARY = 'Seni Seviyorum';
const DEFAULT_SIGNATURE = 'Kalbimin en saf köşesi seninle.';
const DEFAULT_TAGLINE = 'Pure Love';
const DEFAULT_NOTE = 'Sessiz bir mutluluk ve kalbimden düşen sade bir ışık... her şey seninle tamamlanıyor.';
const DEFAULT_TOGGLE_ICON = '❤️';

const ACCENT_DOTS: AccentDot[] = [
  { id: 0, left: 14, top: 18, size: 180, opacity: 0.08 },
  { id: 1, left: 66, top: 12, size: 140, opacity: 0.06 },
  { id: 2, left: 8, top: 64, size: 160, opacity: 0.07 },
  { id: 3, left: 52, top: 72, size: 200, opacity: 0.09 },
  { id: 4, left: 78, top: 48, size: 150, opacity: 0.05 },
  { id: 5, left: 32, top: 36, size: 220, opacity: 0.06 },
];

export default function PureLoveMinimal({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: PureLoveMinimalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAltMessage, setShowAltMessage] = useState(false);
  const [localRecipient, setLocalRecipient] = useState(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
  const [localPrimary, setLocalPrimary] = useState(textFields?.minimalMessage || message || DEFAULT_PRIMARY);
  const [localAlt, setLocalAlt] = useState(textFields?.minimalAlternate || DEFAULT_SECONDARY);
  const [localSignature, setLocalSignature] = useState(textFields?.minimalSignature || DEFAULT_SIGNATURE);
  const [localTagline, setLocalTagline] = useState(textFields?.minimalTagline || DEFAULT_TAGLINE);
  const [localNote, setLocalNote] = useState(textFields?.minimalNote || DEFAULT_NOTE);
  const [localToggleIcon, setLocalToggleIcon] = useState(textFields?.minimalToggleIcon || DEFAULT_TOGGLE_ICON);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setLocalRecipient(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
    setLocalPrimary(textFields?.minimalMessage || message || DEFAULT_PRIMARY);
    setLocalAlt(textFields?.minimalAlternate || DEFAULT_SECONDARY);
    setLocalSignature(textFields?.minimalSignature || DEFAULT_SIGNATURE);
    setLocalTagline(textFields?.minimalTagline || DEFAULT_TAGLINE);
    setLocalNote(textFields?.minimalNote || DEFAULT_NOTE);
    setLocalToggleIcon(textFields?.minimalToggleIcon || DEFAULT_TOGGLE_ICON);
  }, [recipientName, message, textFields]);

  useEffect(() => {
    if (isEditable) {
      setShowAltMessage(false);
    }
  }, [isEditable]);

  const displayRecipient = isEditable
    ? localRecipient
    : textFields?.recipientName || localRecipient || recipientName || DEFAULT_RECIPIENT;
  const displayPrimary = isEditable ? localPrimary : (textFields?.minimalMessage || localPrimary);
  const displayAlt = isEditable ? localAlt : (textFields?.minimalAlternate || localAlt);
  const displaySignature = isEditable ? localSignature : (textFields?.minimalSignature || localSignature);
  const displayTagline = isEditable ? localTagline : (textFields?.minimalTagline || localTagline);
  const displayNote = isEditable ? localNote : (textFields?.minimalNote || localNote);
  const displayToggleIcon = isEditable ? localToggleIcon : (textFields?.minimalToggleIcon || localToggleIcon);
  const displayCreator = (creatorName && creatorName.trim()) ? creatorName : 'Gizli Mesaj';

  const handleChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipient(value);
    if (key === 'minimalMessage') setLocalPrimary(value);
    if (key === 'minimalAlternate') setLocalAlt(value);
    if (key === 'minimalSignature') setLocalSignature(value);
    if (key === 'minimalTagline') setLocalTagline(value);
    if (key === 'minimalNote') setLocalNote(value);
    if (key === 'minimalToggleIcon') setLocalToggleIcon(value || DEFAULT_TOGGLE_ICON);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const handleHeartClick = () => {
    if (isEditable) return;
    setShowAltMessage((prev) => !prev);
  };

  const currentMessage = showAltMessage ? displayAlt : displayPrimary;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.12),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(190,24,93,0.08),_transparent_45%)]" />
      {ACCENT_DOTS.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-rose-200"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            filter: 'blur(30px)',
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[0.65rem] uppercase tracking-[0.35em] text-rose-400/80 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } transition-all duration-700 ease-out`}
        >
          <span
            className={`${isEditable ? 'hover:bg-rose-100/60 cursor-text rounded-lg px-3 py-1 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleChange('recipientName', event.currentTarget.textContent?.trim() || '')}
          >
            {displayRecipient}
          </span>
          <span className="text-rose-300/80">Hazırlayan: {displayCreator}</span>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[260px_1fr] items-start">
          <aside
            className={`space-y-6 md:space-y-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2
              className={`text-4xl md:text-5xl font-light tracking-tight text-rose-500 ${
                isEditable ? 'hover:bg-rose-100/60 cursor-text rounded-xl px-3 py-2 transition-colors' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleChange('minimalTagline', event.currentTarget.textContent || '')}
            >
              {displayTagline}
            </h2>

            <p
              className={`text-sm md:text-base leading-relaxed text-rose-500/80 ${
                isEditable ? 'hover:bg-rose-100/60 cursor-text rounded-xl px-3 py-2 transition-colors' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleChange('minimalNote', event.currentTarget.textContent || '')}
            >
              {displayNote}
            </p>

            <div className="h-px w-full bg-gradient-to-r from-rose-200 via-rose-100 to-transparent" />

            {isEditable && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.4em] text-rose-300/80">Kalp Mesajı</p>
                <div
                  className="rounded-2xl border border-rose-100 bg-white/60 p-4 text-sm text-rose-500/90 shadow-sm"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(event) => handleChange('minimalAlternate', event.currentTarget.textContent || '')}
                >
                  {displayAlt}
                </div>
              </div>
            )}
          </aside>

          <section
            className={`relative overflow-hidden rounded-[32px] border border-rose-100/80 bg-white/80 p-8 md:p-10 shadow-[0_35px_60px_-30px_rgba(190,24,93,0.35)] backdrop-blur ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            } transition-all duration-700`}
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-rose-300 via-rose-200 to-transparent" />

            <div
              className={`relative text-2xl md:text-3xl font-light leading-snug text-gray-800 transition-all duration-700 ${
                showAltMessage ? 'text-rose-500' : ''
              } ${isEditable ? 'hover:bg-rose-50/70 cursor-text rounded-2xl px-4 py-3 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => handleChange('minimalMessage', event.currentTarget.textContent || '')}
            >
              {currentMessage}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <Button
                variant="ghost"
                onClick={handleHeartClick}
                className={`relative h-18 w-18 sm:h-20 sm:w-20 rounded-full border border-rose-200 text-3xl transition-all duration-500 ease-out ${
                  showAltMessage ? 'scale-110 bg-rose-50 text-rose-500 shadow-lg shadow-rose-200/70' : 'hover:scale-105'
                } ${isEditable ? 'pointer-events-none opacity-70' : ''}`}
              >
                <span
                  className={isEditable ? 'hover:bg-rose-100/70 cursor-text rounded-full px-3 py-2 transition-colors' : ''}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(event) => handleChange('minimalToggleIcon', event.currentTarget.textContent || DEFAULT_TOGGLE_ICON)}
                >
                  {displayToggleIcon || DEFAULT_TOGGLE_ICON}
                </span>
              </Button>

              <div className="flex-1 space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-rose-300/90">
                  {showAltMessage ? 'Kalp mesajı yayında' : 'Ana mesaj aktif'}
                </p>
                {displaySignature && (
                  <p
                    className={`text-sm text-rose-400/90 ${
                      isEditable ? 'hover:bg-rose-100/60 cursor-text rounded-xl px-3 py-2 transition-colors inline-block' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) => handleChange('minimalSignature', event.currentTarget.textContent || '')}
                  >
                    {displaySignature}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .h-18 {
          height: 4.5rem;
        }
        .w-18 {
          width: 4.5rem;
        }
      `}</style>
    </div>
  );
}

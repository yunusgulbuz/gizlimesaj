'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface RomanticLetterSceneProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface PetalPreset {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  scale: number;
}

const DEFAULT_RECIPIENT = 'Kalbimin Sahibi';
const DEFAULT_LETTER_TITLE = 'Seni Seviyorum';
const DEFAULT_SIGNATURE = 'Sevgiyle';
const DEFAULT_BUTTON_LABEL = 'Mektubu Kapat';

const PETAL_PRESETS: PetalPreset[] = [
  { id: 0, left: 5, delay: 0, duration: 9, rotate: 12, scale: 1.1 },
  { id: 1, left: 16, delay: 1.2, duration: 10, rotate: -24, scale: 0.9 },
  { id: 2, left: 28, delay: 0.6, duration: 8.5, rotate: 36, scale: 1.05 },
  { id: 3, left: 38, delay: 2.4, duration: 9.4, rotate: -42, scale: 0.92 },
  { id: 4, left: 46, delay: 1.8, duration: 11, rotate: 18, scale: 1.2 },
  { id: 5, left: 58, delay: 0.9, duration: 8.8, rotate: -30, scale: 0.85 },
  { id: 6, left: 65, delay: 2.1, duration: 9.6, rotate: 48, scale: 1.15 },
  { id: 7, left: 74, delay: 0.3, duration: 10.2, rotate: -18, scale: 0.88 },
  { id: 8, left: 83, delay: 1.5, duration: 11.4, rotate: 30, scale: 1.05 },
  { id: 9, left: 92, delay: 2.7, duration: 9.8, rotate: -36, scale: 0.9 },
  { id: 10, left: 12, delay: 3.3, duration: 10.5, rotate: 42, scale: 1.08 },
  { id: 11, left: 24, delay: 4.1, duration: 9.3, rotate: -15, scale: 0.86 },
  { id: 12, left: 36, delay: 3.8, duration: 11.8, rotate: 24, scale: 1.12 },
  { id: 13, left: 48, delay: 5.0, duration: 10.6, rotate: -28, scale: 0.95 },
  { id: 14, left: 70, delay: 4.4, duration: 9.9, rotate: 16, scale: 1.05 },
  { id: 15, left: 88, delay: 5.4, duration: 11.2, rotate: -34, scale: 0.9 },
];

export default function RomanticLetterScene({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: RomanticLetterSceneProps) {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [localRecipient, setLocalRecipient] = useState(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
  const [localTitle, setLocalTitle] = useState(textFields?.letterTitle || DEFAULT_LETTER_TITLE);
  const [localMessage, setLocalMessage] = useState(textFields?.letterBody || message);
  const [localSignature, setLocalSignature] = useState(textFields?.letterSignature || creatorName || DEFAULT_SIGNATURE);
  const [localButtonLabel, setLocalButtonLabel] = useState(textFields?.letterButtonLabel || DEFAULT_BUTTON_LABEL);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLetterOpen(true), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setLocalRecipient(textFields?.recipientName || recipientName || DEFAULT_RECIPIENT);
    setLocalTitle(textFields?.letterTitle || DEFAULT_LETTER_TITLE);
    setLocalMessage(textFields?.letterBody || message);
    setLocalSignature(textFields?.letterSignature || creatorName || DEFAULT_SIGNATURE);
    setLocalButtonLabel(textFields?.letterButtonLabel || DEFAULT_BUTTON_LABEL);
  }, [recipientName, message, creatorName, textFields]);

  const displayRecipient = isEditable
    ? localRecipient
    : textFields?.recipientName || localRecipient || recipientName || DEFAULT_RECIPIENT;
  const displayTitle = isEditable ? localTitle : (textFields?.letterTitle || localTitle);
  const displayBody = isEditable ? localMessage : (textFields?.letterBody || localMessage);
  const displaySignature = isEditable ? localSignature : (textFields?.letterSignature || localSignature);
  const displayButtonLabel = isEditable ? localButtonLabel : (textFields?.letterButtonLabel || localButtonLabel);
  const displayCreator = (creatorName && creatorName.trim()) ? creatorName : 'Gizli Mesaj';

  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipient(value);
    if (key === 'letterTitle') setLocalTitle(value);
    if (key === 'letterBody') setLocalMessage(value);
    if (key === 'letterSignature') setLocalSignature(value);
    if (key === 'letterButtonLabel') setLocalButtonLabel(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const handleToggleLetter = () => {
    if (isEditable) return;
    setIsLetterOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f6f0e7] text-[#53392b]">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(246,240,231,0.95) 60%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Cpath fill=\'%23d8c8b5\' fill-opacity=\'0.25\' d=\'M0 40L40 0h120l40 40v120l-40 40H40L0 160z\'/%3E%3C/svg%3E")',
          backgroundSize: 'cover, 200px 200px',
          backgroundBlendMode: 'multiply',
        }}
      />

      <div className="absolute inset-10 border-4 border-[#e8d9c7] rounded-[2rem] pointer-events-none" style={{ boxShadow: '0 20px 60px rgba(83,57,43,0.15)' }} />

      <div className="absolute inset-0">
        {PETAL_PRESETS.map((petal) => (
          <div
            key={petal.id}
            className="absolute top-[-10%] h-16 w-12"
            style={{
              left: `${petal.left}%`,
              animation: `petalFall ${petal.duration}s linear infinite`,
              animationDelay: `${petal.delay}s`,
              transform: `scale(${petal.scale}) rotate(${petal.rotate}deg)`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,180,200,0.9), rgba(214,120,152,0.8))',
                filter: 'blur(0.6px)',
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div
            className={`text-center uppercase tracking-[0.55em] text-xs text-[#8c6b58] ${
              isEditable ? 'hover:bg-[#f7efe5] cursor-text rounded-lg px-3 py-1 transition-colors' : ''
            }`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('recipientName', event.currentTarget.textContent?.trim() || '')}
          >
            {displayRecipient}
          </div>
          <div className="text-[0.65rem] uppercase tracking-[0.4em] text-[#b28c78]">
            Hazırlayan: {displayCreator}
          </div>
        </div>

        <div className="relative w-full max-w-3xl">
          <div className="relative mx-auto h-[460px] w-full max-w-2xl">
            <div
              className="absolute inset-x-12 top-8 h-40 rounded-2xl bg-[#e5d4c4]"
              style={{
                boxShadow: '0 10px 30px rgba(83,57,43,0.15)',
                transform: isLetterOpen ? 'rotateX(0deg)' : 'rotateX(75deg)',
                transformOrigin: 'top',
                transition: 'transform 1s ease',
              }}
            />
            <div
              className="absolute inset-x-8 top-28 h-56 rounded-2xl bg-[#fdf8f1] border border-[#e2d3c2]"
              style={{
                transform: isLetterOpen ? 'translateY(-70px)' : 'translateY(40px)',
                transition: 'transform 1.2s ease',
                boxShadow: '0 18px 45px rgba(83,57,43,0.18)',
              }}
            >
              <div className="h-full w-full rounded-[2rem] border-[20px] border-double border-[#e8d9c7] bg-[#fcf7f1]/70" />
            </div>
            <div className="absolute inset-x-12 bottom-8 h-24 rounded-2xl bg-[#dcbfaa]" style={{ boxShadow: '0 20px 40px rgba(83,57,43,0.18)' }} />

            <div
              className="absolute inset-x-16 top-0 h-[380px] rounded-[26px] bg-[#fffdf9] px-8 py-10 border border-[#e6d7c7]"
              style={{
                transform: isLetterOpen ? 'translateY(-110px)' : 'translateY(120px)',
                transition: 'transform 1.2s ease',
                boxShadow: '0 24px 60px rgba(83,57,43,0.18)',
                overflow: 'hidden',
              }}
            >
              <div className="h-full w-full bg-repeat" style={{ backgroundImage: 'linear-gradient(transparent 95%, rgba(210,180,140,0.35) 95%)', backgroundSize: '100% 32px' }}>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div
                      className={`text-3xl md:text-4xl font-light text-[#8c6b58] mb-6 ${
                        isEditable ? 'hover:bg-[#f7efe5] cursor-text rounded-lg px-3 py-1 transition-colors' : ''
                      }`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) => handleContentChange('letterTitle', event.currentTarget.textContent || '')}
                    >
                      {displayTitle}
                    </div>

                    <div className="space-y-4 text-lg leading-relaxed text-[#5c4035]">
                      <p
                        className={isEditable ? 'hover:bg-[#f7efe5] cursor-text rounded-lg px-3 py-2 transition-colors' : ''}
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) => handleContentChange('letterBody', event.currentTarget.textContent || '')}
                      >
                        {displayBody}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`text-right text-xl italic text-[#856857] ${
                      isEditable ? 'hover:bg-[#f7efe5] cursor-text rounded-lg px-3 py-2 transition-colors' : ''
                    }`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(event) => handleContentChange('letterSignature', event.currentTarget.textContent || '')}
                  >
                    {displaySignature}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleToggleLetter}
          className={`mt-12 rounded-full border-2 border-[#c6a98c] px-10 py-4 text-base font-medium text-[#6a4c3b] transition ${
            isEditable ? 'pointer-events-none opacity-80' : 'hover:text-[#4a2f20]'
          } ${isLetterOpen ? 'bg-[#f9f1e8]/60' : 'bg-[#e8dccc]/60'}`}
        >
          <span
            className={`relative inline-block ${isEditable ? 'hover:bg-[#f7efe5] cursor-text rounded px-3 py-1 transition-colors' : ''}`}
            style={{
              paddingBottom: '2px',
              backgroundImage: 'linear-gradient(currentColor, currentColor)',
              backgroundSize: '0% 2px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 100%',
              transition: 'background-size 0.4s ease',
            }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) => handleContentChange('letterButtonLabel', event.currentTarget.textContent || '')}
          >
            {displayButtonLabel}
          </span>
        </Button>

        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#a4836a]">
          {isLetterOpen ? 'Mektup açık' : 'Mektup kapalı'}
        </p>
      </div>

      <style jsx>{`
        @keyframes petalFall {
          0% { transform: translate3d(0, -10%, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          60% { opacity: 0.8; }
          100% { transform: translate3d(30px, 110vh, 0) rotate(260deg); opacity: 0; }
        }
        button:hover span {
          background-size: 100% 2px;
        }
      `}</style>
    </div>
  );
}

'use client';

import { useMemo, useState, useEffect } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface MinimalistSecretMessageProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

export default function MinimalistSecretMessage({
  recipientName,
  creatorName,
  textFields,
  primaryMessage,
  isEditable = false,
  onTextFieldChange
}: MinimalistSecretMessageProps) {
  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localTitle, setLocalTitle] = useState('');
  const [localSubtitle, setLocalSubtitle] = useState('');
  const [localLockedMessage, setLocalLockedMessage] = useState('');
  const [localRevealedMessage, setLocalRevealedMessage] = useState('');
  const [localFooter, setLocalFooter] = useState('');

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalTitle(textFields?.minimalistTitle || 'Mutlu Yıl Dönümü');
    setLocalSubtitle(textFields?.minimalistSubtitle || 'Şifreli Hatıra');
    setLocalLockedMessage(textFields?.minimalistLockMessage || 'Sırlarımızı hatırlıyor musun? Kilidi aç ve birlikte yazdığımız hikayeyi tekrar yaşa.');
    setLocalRevealedMessage(textFields?.minimalistRevealMessage || textFields?.mainMessage || primaryMessage || 'İlk gülüşünden beri kalbime çizdiğin kavis, bugün hâlâ aynı sıcaklıkta. Birlikte geçen her yıl, özenle saklanmış bir sır gibi kıymetli.');
    setLocalFooter(textFields?.minimalistFooter || 'Açığa çıkan her sır, birlikte büyüttüğümüz sevgiye ait.');
  }, [recipientName, textFields, primaryMessage]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'minimalistTitle') setLocalTitle(value);
    else if (key === 'minimalistSubtitle') setLocalSubtitle(value);
    else if (key === 'minimalistLockMessage') setLocalLockedMessage(value);
    else if (key === 'minimalistRevealMessage') setLocalRevealedMessage(value);
    else if (key === 'minimalistFooter') setLocalFooter(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get display values
  const title = isEditable ? localTitle : (textFields?.minimalistTitle || 'Mutlu Yıl Dönümü');
  const subtitle = isEditable ? localSubtitle : (textFields?.minimalistSubtitle || 'Şifreli Hatıra');
  const lockedMessage = isEditable ? localLockedMessage : (textFields?.minimalistLockMessage || 'Sırlarımızı hatırlıyor musun? Kilidi aç ve birlikte yazdığımız hikayeyi tekrar yaşa.');
  const revealedMessage = isEditable ? localRevealedMessage : (textFields?.minimalistRevealMessage || textFields?.mainMessage || primaryMessage || 'İlk gülüşünden beri kalbime çizdiğin kavis, bugün hâlâ aynı sıcaklıkta. Birlikte geçen her yıl, özenle saklanmış bir sır gibi kıymetli.');
  const footerMessage = isEditable ? localFooter : (textFields?.minimalistFooter || 'Açığa çıkan her sır, birlikte büyüttüğümüz sevgiye ait.');
  const displayRecipientName = isEditable ? localRecipientName : recipientName;

  const highlights = useMemo(() => {
    const raw = (textFields?.minimalistHighlights && textFields.minimalistHighlights.trim().length > 0)
      ? textFields.minimalistHighlights
      : 'İlk buluşmamız|Şehrin ışıkları altında kaybolmuştuk.\\nPaylaşılan sırlar|Göz göze geldiğimiz anda her şeyi anladık.\\nSonsuz sözler|Her yıl, kalbimize yeni bir söz ekledik.';

    return raw
      .split('\n')
      .map(line => {
        const [label, description] = line.split('|').map(part => part?.trim() || '');
        if (!label) return null;
        return { label, description: description || '' };
      })
      .filter(Boolean) as Array<{ label: string; description: string }>;
  }, [textFields?.minimalistHighlights]);

  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="relative min-h-screen bg-white p-4 sm:p-6 md:p-8 py-16 sm:py-20 text-black">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:gap-10 text-center">
        <div className="space-y-2 sm:space-y-3">
          {creatorName && (
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Hazırlayan: {creatorName}</p>
          )}
          <p
            className={`text-xs uppercase tracking-[0.4em] text-neutral-400 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text rounded-lg p-2 transition-colors inline-block' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('minimalistSubtitle', e.currentTarget.textContent || '')}
          >
            {subtitle}
          </p>
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-light tracking-tight break-words ${isEditable ? 'hover:bg-gray-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('minimalistTitle', e.currentTarget.textContent || '')}
          >
            {title}
          </h1>
          <p
            className={`max-w-xl text-sm sm:text-base leading-relaxed text-neutral-500 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('minimalistLockMessage', e.currentTarget.textContent || '')}
          >
            {lockedMessage}
          </p>
        </div>

        <button
          onClick={() => setUnlocked(true)}
          className={`relative flex items-center gap-2 sm:gap-3 rounded-full border border-neutral-200 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm uppercase tracking-[0.35em] transition ${
            unlocked ? 'cursor-default border-black bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
          }`}
          style={
            unlocked
              ? undefined
              : {
                  backgroundImage: 'linear-gradient(120deg, transparent, rgba(0,0,0,0.06), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite'
                }
          }
          disabled={unlocked}
        >
          <span className="text-base sm:text-lg">{unlocked ? '🔓' : '🔒'}</span>
          {unlocked ? 'Kilidi Açtın' : 'Kilidi Aç'}
        </button>

        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
          <div className={`relative p-4 sm:p-6 md:px-14 py-8 sm:py-12 transition-all duration-700 ${unlocked ? 'opacity-100 translate-y-0' : 'translate-y-6 opacity-0'}`}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <p
                className={`text-sm uppercase tracking-[0.4em] text-neutral-400 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text rounded-lg p-2 transition-colors inline-block' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
              >
                {displayRecipientName || 'Sevgili Sen'}
              </p>
              <p
                className={`text-base sm:text-lg md:text-xl leading-relaxed text-neutral-800 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('minimalistRevealMessage', e.currentTarget.textContent || '')}
              >
                {revealedMessage}
              </p>
              <div className="mt-3 sm:mt-4 grid gap-4 sm:gap-5 md:grid-cols-3">
                {highlights.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="flex flex-col gap-2 border-t border-neutral-200 pt-3 text-left">
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 break-words">{item.label}</span>
                    <p className="text-sm leading-relaxed text-neutral-600 break-words">{item.description}</p>
                  </div>
                ))}
              </div>
              <div
                className={`mt-6 sm:mt-8 text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-500 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('minimalistFooter', e.currentTarget.textContent || '')}
              >
                {footerMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

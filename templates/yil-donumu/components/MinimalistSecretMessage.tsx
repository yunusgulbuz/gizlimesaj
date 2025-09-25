'use client';

import { useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface MinimalistSecretMessageProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
}

export default function MinimalistSecretMessage({
  recipientName,
  creatorName,
  textFields,
  primaryMessage
}: MinimalistSecretMessageProps) {
  const title = textFields?.minimalistTitle || 'Mutlu Yıl Dönümü';
  const subtitle = textFields?.minimalistSubtitle || 'Şifreli Hatıra';
  const lockedMessage = textFields?.minimalistLockMessage || 'Sırlarımızı hatırlıyor musun? Kilidi aç ve birlikte yazdığımız hikayeyi tekrar yaşa.';
  const revealedMessage = textFields?.minimalistRevealMessage || textFields?.mainMessage || primaryMessage || 'İlk gülüşünden beri kalbime çizdiğin kavis, bugün hâlâ aynı sıcaklıkta. Birlikte geçen her yıl, özenle saklanmış bir sır gibi kıymetli.';
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
    <div className="relative min-h-screen bg-white px-4 py-20 text-black">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <div className="space-y-3">
          {creatorName && (
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Hazırlayan: {creatorName}</p>
          )}
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">{subtitle}</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">{title}</h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
            {lockedMessage}
          </p>
        </div>

        <button
          onClick={() => setUnlocked(true)}
          className={`relative flex items-center gap-3 rounded-full border border-neutral-200 px-8 py-3 text-sm uppercase tracking-[0.35em] transition ${
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
          <span className="text-lg">{unlocked ? '🔓' : '🔒'}</span>
          {unlocked ? 'Kilidi Açtın' : 'Kilidi Aç'}
        </button>

        <div className="relative w-full overflow-hidden rounded-3xl border border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
          <div className={`relative px-6 py-12 transition-all duration-700 md:px-14 ${unlocked ? 'opacity-100 translate-y-0' : 'translate-y-6 opacity-0'}`}>
            <div className="flex flex-col gap-6">
              <p className="text-sm uppercase tracking-[0.4em] text-neutral-400">{recipientName || 'Sevgili Sen'}</p>
              <p className="text-base leading-relaxed text-neutral-800 md:text-lg">
                {revealedMessage}
              </p>
              <div className="mt-4 grid gap-5 md:grid-cols-3">
                {highlights.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="flex flex-col gap-2 border-t border-neutral-200 pt-3 text-left">
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">{item.label}</span>
                    <p className="text-sm leading-relaxed text-neutral-600">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-sm uppercase tracking-[0.3em] text-neutral-500">
                {textFields?.minimalistFooter || 'Açığa çıkan her sır, birlikte büyüttüğümüz sevgiye ait.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

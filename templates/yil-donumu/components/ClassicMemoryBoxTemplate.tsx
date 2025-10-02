'use client';

import { useMemo, useState, useEffect } from 'react';
import type { TemplateTextFields } from '../../shared/types';
import { createAnalyticsTracker } from '@/lib/analytics';

interface ClassicMemoryBoxTemplateProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
  shortId?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface MemoryItem {
  title: string;
  description: string;
  year?: string;
}

const FALLBACK_MEMORIES = `Polaroid Fotoğraf|Gülen yüzünün arkasında saklanan heyecanın ilk anı.|2016
Sinema Bileti|İlk film gecemiz; popcorn, kahkahalar ve kalp çarpıntıları.|2018
El Yazısı Not|"Sonsuza dek" dediğin o satırlar, kalbime mühür oldu.|2020
Minik Deniz Kabuğu|Birlikte topladığımız o gün, güneş kadar parlaktın.|2022`;

export default function ClassicMemoryBoxTemplate({
  recipientName,
  creatorName,
  textFields,
  primaryMessage,
  shortId,
  isEditable = false,
  onTextFieldChange
}: ClassicMemoryBoxTemplateProps) {
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localLetter, setLocalLetter] = useState('');
  const [localButtonLabel, setLocalButtonLabel] = useState('');
  const [localHeaderTitle, setLocalHeaderTitle] = useState('');
  const [localSubtitle, setLocalSubtitle] = useState('');

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalLetter(textFields?.hatiraLetter || textFields?.mainMessage || primaryMessage || 'Sevgili aşkım, her hatıranın bir köşesinde senin ışığın var. Bu kutunun içindeki her küçük detay, paylaştığımız büyük anıların bir yansıması. Birlikte attığımız her adım için minnettarım.');
    setLocalButtonLabel(textFields?.hatiraButtonLabel || 'Hatıraları Gör');
    setLocalHeaderTitle(textFields?.hatiraHeadline || 'Klasik Hatıra Kutusu');
    setLocalSubtitle(textFields?.hatiraSubtitle || 'Mutlu Yıl Dönümü');
  }, [recipientName, textFields, primaryMessage]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'hatiraLetter') setLocalLetter(value);
    else if (key === 'hatiraButtonLabel') setLocalButtonLabel(value);
    else if (key === 'hatiraHeadline') setLocalHeaderTitle(value);
    else if (key === 'hatiraSubtitle') setLocalSubtitle(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get display values
  const letter = isEditable ? localLetter : (textFields?.hatiraLetter || textFields?.mainMessage || primaryMessage || 'Sevgili aşkım, her hatıranın bir köşesinde senin ışığın var. Bu kutunun içindeki her küçük detay, paylaştığımız büyük anıların bir yansıması. Birlikte attığımız her adım için minnettarım.');
  const buttonLabel = isEditable ? localButtonLabel : (textFields?.hatiraButtonLabel || 'Hatıraları Gör');
  const headerTitle = isEditable ? localHeaderTitle : (textFields?.hatiraHeadline || 'Klasik Hatıra Kutusu');
  const subtitle = isEditable ? localSubtitle : (textFields?.hatiraSubtitle || 'Mutlu Yıl Dönümü');
  const displayRecipientName = isEditable ? localRecipientName : recipientName;
  const albumBackground = textFields?.hatiraBackgroundUrl || 'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?w=1280&q=80&auto=format&fit=crop';

  const memories = useMemo<MemoryItem[]>(() => {
    const raw = (textFields?.hatiraMemories && textFields.hatiraMemories.trim().length > 0)
      ? textFields.hatiraMemories
      : FALLBACK_MEMORIES;

    return raw
      .split('\n')
      .map(line => {
        const [title, description, year] = line.split('|').map(part => part?.trim() || '');
        if (!title) return null;
        return {
          title,
          description: description || 'Bu hatırayı anlatan küçük bir not ekleyebilirsiniz.',
          year
        };
      })
      .filter(Boolean) as MemoryItem[];
  }, [textFields?.hatiraMemories]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showPetals, setShowPetals] = useState(false);

  const petals = useMemo(
    () => Array.from({ length: 18 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 5 + 7,
      size: Math.random() * 20 + 20
    })),
    []
  );

  const handleToggleMemories = () => {
    analytics?.trackButtonClick('toggle_memories', {
      templateType: 'ClassicMemoryBoxTemplate',
      designStyle: 'classic',
      buttonLabel: buttonLabel
    });
    setShowPetals(true);
    setTimeout(() => setShowPetals(false), 6000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 py-12 sm:py-14 p-4 sm:p-6 md:p-8 text-rose-900">
      <style>{`
        @keyframes petal-fall {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(180deg); opacity: 0; }
        }
      `}</style>

      {showPetals && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {petals.map(petal => (
            <span
              key={petal.id}
              className="absolute text-rose-300"
              style={{
                left: `${petal.left}%`,
                fontSize: `${petal.size}px`,
                animation: `petal-fall ${petal.duration}s cubic-bezier(0.45, 0, 0.55, 1) ${petal.delay}s`
              }}
            >
              ❀
            </span>
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 sm:gap-8 md:gap-10">
        <div className="text-center">
          {creatorName && (
            <p className="mb-2 sm:mb-3 text-xs uppercase tracking-[0.3em] text-rose-400">
              Hazırlayan: {creatorName}
            </p>
          )}
          <p
            className={`text-sm uppercase tracking-[0.4em] text-rose-400 break-words ${isEditable ? 'hover:bg-rose-100 cursor-text rounded-lg p-2 transition-colors inline-block' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('hatiraSubtitle', e.currentTarget.textContent || '')}
          >
            {subtitle}
          </p>
          <h1
            className={`mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-rose-700 break-words ${isEditable ? 'hover:bg-rose-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('hatiraHeadline', e.currentTarget.textContent || '')}
          >
            {headerTitle}
          </h1>
          <p
            className={`mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base md:text-lg text-rose-500 break-words ${isEditable ? 'hover:bg-rose-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.replace(' için saklanan en özel hatıralar.', '') || '')}
          >
            {displayRecipientName ? `${displayRecipientName} için saklanan en özel hatıralar.` : 'Kalplerde saklanan en güzel anların kutusu.'}
          </p>
        </div>

        <div className="w-full rounded-2xl sm:rounded-[3rem] border border-rose-200/60 bg-white/80 p-4 sm:p-6 shadow-2xl shadow-rose-200/60">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-[1.1fr_0.9fr]">
            {/* Letter Section */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-white p-4 sm:p-6">
              <div className="absolute -left-12 top-[-40px] hidden h-32 w-32 rotate-[-20deg] border-2 border-dashed border-rose-200/40 md:block"></div>
              <div className="absolute -right-10 bottom-[-30px] hidden h-24 w-24 rotate-12 border border-rose-200/50 md:block"></div>

              <div className="relative flex flex-col gap-3 sm:gap-4 text-rose-700">
                <h2
                  className={`font-serif text-xl sm:text-2xl text-rose-600 break-words ${isEditable ? 'hover:bg-rose-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const text = e.currentTarget.textContent || '';
                    const name = text.replace('Sevgili ', '').replace(',', '');
                    handleContentChange('recipientName', name);
                  }}
                >
                  Sevgili {displayRecipientName || 'Kalbim'},
                </h2>
                <p
                  className={`text-sm sm:text-base md:text-lg leading-relaxed text-rose-500 break-words ${isEditable ? 'hover:bg-rose-100 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('hatiraLetter', e.currentTarget.textContent || '')}
                >
                  {letter}
                </p>
                <div className="mt-4 sm:mt-6 flex flex-col gap-1 text-right text-xs sm:text-sm text-rose-400">
                  <span>Her detayınla,</span>
                  <span>{creatorName || 'Sonsuz Sevgilin'}</span>
                </div>
              </div>
            </div>

            {/* Memory Slider */}
            <div className="flex h-full flex-col gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-rose-200 bg-white/90 p-4 sm:p-6 shadow-inner shadow-rose-200/40">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl text-rose-600">Hatıra Albümü</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-rose-300">{activeIndex + 1} / {memories.length}</span>
              </div>

              <div
                className="relative flex-1 overflow-hidden rounded-xl sm:rounded-2xl border border-rose-100 bg-rose-50/90 p-4 sm:p-5"
                style={albumBackground ? {
                  backgroundImage: `linear-gradient(135deg, rgba(255, 192, 203, 0.45), rgba(255,255,255,0.55)), url(${albumBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : undefined}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/20 via-white/10 to-transparent" />
                <div className="relative h-full">
                  <div className="flex h-full flex-col gap-2 sm:gap-3">
                    <div className="text-4xl sm:text-5xl md:text-6xl">📷</div>
                    <p className="text-xs uppercase tracking-[0.3em] text-rose-400 break-words">{memories[activeIndex]?.year || 'anı'}</p>
                    <h4 className="font-serif text-xl sm:text-2xl text-rose-700 break-words">
                      {memories[activeIndex]?.title}
                    </h4>
                    <p className="text-sm sm:text-base leading-relaxed text-rose-500 break-words">
                      {memories[activeIndex]?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-3 text-sm text-rose-400">
                <button
                  onClick={() => {
                    analytics?.trackButtonClick('memory_navigation', {
                      templateType: 'ClassicMemoryBoxTemplate',
                      designStyle: 'classic',
                      direction: 'previous',
                      currentIndex: activeIndex
                    });
                    setActiveIndex(prev => (prev - 1 + memories.length) % memories.length);
                  }}
                  className="rounded-full border border-rose-200 bg-white/70 px-3 sm:px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:bg-rose-100"
                >
                  Önceki
                </button>
                <button
                  onClick={() => {
                    analytics?.trackButtonClick('memory_navigation', {
                      templateType: 'ClassicMemoryBoxTemplate',
                      designStyle: 'classic',
                      direction: 'next',
                      currentIndex: activeIndex
                    });
                    setActiveIndex(prev => (prev + 1) % memories.length);
                  }}
                  className="rounded-full border border-rose-200 bg-white/70 px-3 sm:px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:bg-rose-100"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleMemories}
              className={`rounded-full border border-rose-200 bg-rose-100/80 px-6 sm:px-8 py-2.5 sm:py-3 text-xs uppercase tracking-[0.4em] text-rose-500 transition hover:bg-rose-200/60 break-words ${isEditable ? 'hover:bg-rose-200 cursor-text' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('hatiraButtonLabel', e.currentTarget.textContent || '')}
            >
              {buttonLabel}
            </button>
            <p className="text-xs sm:text-sm text-rose-400 text-center break-words">
              Kutuyu her açtığımızda yeni bir anıya sarılıyoruz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

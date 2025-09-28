'use client';

import { useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';
import { createAnalyticsTracker } from '@/lib/analytics';

interface ClassicMemoryBoxTemplateProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
  shortId?: string;
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
  shortId
}: ClassicMemoryBoxTemplateProps) {
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;
  const letter = textFields?.hatiraLetter || textFields?.mainMessage || primaryMessage || 'Sevgili aşkım, her hatıranın bir köşesinde senin ışığın var. Bu kutunun içindeki her küçük detay, paylaştığımız büyük anıların bir yansıması. Birlikte attığımız her adım için minnettarım.';
  const buttonLabel = textFields?.hatiraButtonLabel || 'Hatıraları Gör';
  const headerTitle = textFields?.hatiraHeadline || 'Klasik Hatıra Kutusu';
  const subtitle = textFields?.hatiraSubtitle || 'Mutlu Yıl Dönümü';
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 py-14 px-4 text-rose-900">
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

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10">
        <div className="text-center">
          {creatorName && (
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-rose-400">
              Hazırlayan: {creatorName}
            </p>
          )}
          <p className="text-sm uppercase tracking-[0.4em] text-rose-400">{subtitle}</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-serif text-rose-700">{headerTitle}</h1>
          <p className="mt-3 max-w-2xl text-base text-rose-500">
            {recipientName ? `${recipientName} için saklanan en özel hatıralar.` : 'Kalplerde saklanan en güzel anların kutusu.'}
          </p>
        </div>

        <div className="w-full rounded-[3rem] border border-rose-200/60 bg-white/80 p-6 shadow-2xl shadow-rose-200/60">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            {/* Letter Section */}
            <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-white p-6">
              <div className="absolute -left-12 top-[-40px] hidden h-32 w-32 rotate-[-20deg] border-2 border-dashed border-rose-200/40 md:block"></div>
              <div className="absolute -right-10 bottom-[-30px] hidden h-24 w-24 rotate-12 border border-rose-200/50 md:block"></div>

              <div className="relative flex flex-col gap-4 text-rose-700">
                <h2 className="font-serif text-2xl text-rose-600">Sevgili {recipientName || 'Kalbim'},</h2>
                <p className="text-sm leading-relaxed text-rose-500 md:text-base">
                  {letter}
                </p>
                <div className="mt-6 flex flex-col gap-1 text-right text-sm text-rose-400">
                  <span>Her detayınla,</span>
                  <span>{creatorName || 'Sonsuz Sevgilin'}</span>
                </div>
              </div>
            </div>

            {/* Memory Slider */}
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-rose-200 bg-white/90 p-6 shadow-inner shadow-rose-200/40">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-rose-600">Hatıra Albümü</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-rose-300">{activeIndex + 1} / {memories.length}</span>
              </div>

              <div
                className="relative flex-1 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/90 p-5"
                style={albumBackground ? {
                  backgroundImage: `linear-gradient(135deg, rgba(255, 192, 203, 0.45), rgba(255,255,255,0.55)), url(${albumBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : undefined}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/20 via-white/10 to-transparent" />
                <div className="relative h-full">
                  <div className="flex h-full flex-col gap-3">
                    <div className="text-5xl md:text-6xl">📷</div>
                    <p className="text-xs uppercase tracking-[0.3em] text-rose-400">{memories[activeIndex]?.year || 'anı'}</p>
                    <h4 className="font-serif text-2xl text-rose-700">
                      {memories[activeIndex]?.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-rose-500">
                      {memories[activeIndex]?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-rose-400">
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
                  className="rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:bg-rose-100"
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
                  className="rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:bg-rose-100"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={handleToggleMemories}
              className="rounded-full border border-rose-200 bg-rose-100/80 px-8 py-3 text-xs uppercase tracking-[0.4em] text-rose-500 transition hover:bg-rose-200/60"
            >
              {buttonLabel}
            </button>
            <p className="text-xs text-rose-400">
              Kutuyu her açtığımızda yeni bir anıya sarılıyoruz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

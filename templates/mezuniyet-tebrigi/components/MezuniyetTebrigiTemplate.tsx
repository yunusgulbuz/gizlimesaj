'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { TemplateTextFields } from '../../shared/types';

type DesignStyle = 'modern' | 'classic' | 'minimalist' | 'eglenceli';

const FIELD_KEYS = [
  'recipientName',
  'modernHeadline',
  'modernSubtitle',
  'modernBody',
  'modernPhotoUrl',
  'minimalistHeadline',
  'minimalistSubtitle',
  'minimalistMessage',
  'minimalistPhoto1Url',
  'minimalistPhoto2Url',
  'minimalistPhoto3Url',
  'minimalistPhoto4Url',
  'minimalistPhoto5Url',
  'minimalistPhoto6Url',
  'artHeadline',
  'artSubtitle',
  'artBody',
  'artPhoto1Url',
  'artPhoto2Url',
  'artPhoto3Url',
  'premiumHeadline',
  'premiumSubtitle',
  'premiumMessage',
  'premiumPhotoUrl',
  'musicUrl'
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];
type FieldValueMap = Record<FieldKey, string>;

interface MezuniyetTebrigiTemplateProps {
  recipientName: string;
  message: string;
  designStyle: DesignStyle;
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

export default function MezuniyetTebrigiTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange
}: MezuniyetTebrigiTemplateProps) {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const defaultValues = useMemo<FieldValueMap>(() => ({
    recipientName: recipientName || 'Sevgili Mezun',
    modernHeadline: 'Tebrikler Mezun! 🎓',
    modernSubtitle: 'Yeni bir sayfa seni bekliyor.',
    modernBody: message || 'Bugün emeklerinin taçlandığı büyük gün. Yarınlar seni bekliyor!',
    modernPhotoUrl: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1400&q=80',
    minimalistHeadline: 'Gurur Duyuyoruz 👏',
    minimalistSubtitle: 'Başarıların daim olsun.',
    minimalistMessage: 'Bu an, hayallerine giden yolda attığın adımların en parlak kanıtı. Yıldızın her zaman parlasın.',
    minimalistPhoto1Url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
    minimalistPhoto2Url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    minimalistPhoto3Url: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80',
    minimalistPhoto4Url: 'https://images.unsplash.com/photo-1455732063391-5f50f0c031c0?auto=format&fit=crop&w=800&q=80',
    minimalistPhoto5Url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    minimalistPhoto6Url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    artHeadline: 'Mezun Oldun! 🌟',
    artSubtitle: 'Yeni yolculuğunda başarılar.',
    artBody: 'Birlikte gülüp hayal kurduğumuz tüm anılar şimdi yeni bir başlangıca dönüşüyor. Yolun açık olsun!',
    artPhoto1Url: 'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?auto=format&fit=crop&w=900&q=80',
    artPhoto2Url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    artPhoto3Url: 'https://images.unsplash.com/photo-1455732063391-5f50f0c031c0?auto=format&fit=crop&w=900&q=80',
    premiumHeadline: 'Gelecek Senin Ellerinde 🎓',
    premiumSubtitle: 'Işığın hiç sönmesin.',
    premiumMessage: 'Bugün, yılların emeğinin sahne aldığı büyük final. Işığınla dünyayı aydınlatmaya devam et!',
    premiumPhotoUrl: 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?auto=format&fit=crop&w=1400&q=80',
    musicUrl: ''
  }), [recipientName, message]);

  const [localFields, setLocalFields] = useState<FieldValueMap>(defaultValues);

  useEffect(() => {
    setLocalFields(() => {
      const next: FieldValueMap = { ...defaultValues };
      if (textFields) {
        FIELD_KEYS.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(textFields, key)) {
            next[key] = textFields[key] ?? '';
          }
        });
      }
      return next;
    });
  }, [textFields, defaultValues]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const relativeX = (event.clientX / window.innerWidth - 0.5) * 12;
      const relativeY = (event.clientY / window.innerHeight - 0.5) * 12;
      setParallaxOffset({ x: relativeX, y: relativeY });
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0; // x-axis
      const gamma = event.gamma ?? 0; // y-axis
      setParallaxOffset({
        x: (gamma / 45) * 14,
        y: (beta / 45) * 10
      });
    };

    window.addEventListener('mousemove', handleMove);
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrollOffset(y);
      const progress = Math.min(y / (window.innerHeight * 0.8), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const getValue = (key: FieldKey) => {
    const fallback = defaultValues[key];
    if (isEditable) {
      return localFields[key] ?? fallback;
    }
    if (textFields && Object.prototype.hasOwnProperty.call(textFields, key)) {
      return textFields[key] ?? '';
    }
    return fallback;
  };

  const handleContentChange = (key: FieldKey, value: string) => {
    setLocalFields((prev) => ({
      ...prev,
      [key]: value
    }));
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const displayCreator = creatorName || '';
  const handleImagePrompt = (key: FieldKey) => {
    if (!isEditable) return;
    const current = getValue(key);
    const next = window.prompt('Fotoğraf URL\'si', current);
    if (next !== null) {
      handleContentChange(key, next.trim());
    }
  };
  const sharedStyles = (
    <style jsx>{`
      .editable-surface {
        border-radius: 0.75rem;
        transition: background-color 220ms ease, box-shadow 220ms ease;
      }
      .editable-surface[contenteditable='true']:hover,
      .editable-surface[contenteditable='true']:focus {
        background-color: rgba(255, 255, 255, 0.08);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        outline: none;
      }
      .portrait-frame {
        transition: transform 320ms ease, box-shadow 320ms ease;
        will-change: transform;
      }
      .portrait-frame:hover {
        box-shadow: 0 30px 80px rgba(18, 25, 58, 0.55);
      }
      .soft-flare {
        background: conic-gradient(
          from 90deg,
          rgba(255, 221, 128, 0.05),
          rgba(255, 237, 188, 0.2),
          rgba(44, 122, 255, 0.12),
          rgba(255, 221, 128, 0.05)
        );
        filter: blur(120px);
        animation: flareFloat 18s ease-in-out infinite;
      }
      @keyframes flareFloat {
        0% {
          transform: translate3d(-30%, -10%, 0) scale(1);
        }
        50% {
          transform: translate3d(30%, 15%, 0) scale(1.1);
        }
        100% {
          transform: translate3d(-30%, -10%, 0) scale(1);
        }
      }
      .mosaic-tile {
        opacity: 0;
        animation: mosaicFade 0.8s ease forwards, mosaicZoom 9s ease-in-out infinite alternate;
      }
      @keyframes mosaicFade {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes mosaicZoom {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.06);
        }
      }
      .pastel-orb {
        animation: floatSoft 18s ease-in-out infinite;
        filter: blur(48px);
      }
      .pastel-orb:nth-child(2) {
        animation-delay: -6s;
      }
      .pastel-orb:nth-child(3) {
        animation-delay: -12s;
      }
      @keyframes floatSoft {
        0% {
          transform: translate3d(-50px, 0, 0) scale(1);
        }
        50% {
          transform: translate3d(40px, 30px, 0) scale(1.08);
        }
        100% {
          transform: translate3d(-50px, 0, 0) scale(1);
        }
      }
      .collage-photo {
        box-shadow: 0 18px 36px rgba(32, 25, 58, 0.18);
        animation: collageReveal 0.9s ease forwards;
        opacity: 0;
      }
      .collage-photo:nth-child(1) {
        animation-delay: 0.1s;
      }
      .collage-photo:nth-child(2) {
        animation-delay: 0.25s;
      }
      .collage-photo:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes collageReveal {
        from {
          opacity: 0;
          transform: translateY(24px) rotate(-6deg);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotate(var(--rotate, 0deg));
        }
      }
      .pattern-overlay {
        background-size: 220px 220px;
        background-image: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15), transparent 45%),
          radial-gradient(circle at 80% 0%, rgba(255, 200, 255, 0.15), transparent 50%),
          radial-gradient(circle at 10% 80%, rgba(121, 105, 255, 0.12), transparent 55%);
        animation: patternDrift 24s linear infinite;
      }
      @keyframes patternDrift {
        0% {
          background-position: 0 0, 0 0, 0 0;
        }
        50% {
          background-position: 80px -60px, -120px 60px, 60px 40px;
        }
        100% {
          background-position: 0 0, 0 0, 0 0;
        }
      }
      .lens-flare {
        background: linear-gradient(115deg, rgba(255, 255, 255, 0) 0%, rgba(255, 221, 128, 0.34) 45%, rgba(255, 68, 0, 0) 100%);
        mix-blend-mode: screen;
        filter: blur(18px);
        opacity: 0.65;
        animation: lensMove 18s ease-in-out infinite;
      }
      .lens-flare--secondary {
        animation-delay: -6s;
        opacity: 0.35;
        transform: rotate(14deg);
      }
      @keyframes lensMove {
        0% {
          transform: translateX(-45%) translateY(-20%) skewX(-6deg);
        }
        50% {
          transform: translateX(30%) translateY(10%) skewX(6deg);
        }
        100% {
          transform: translateX(-45%) translateY(-20%) skewX(-6deg);
        }
      }
      .grain-overlay {
        background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 2px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.04) 1px,
            transparent 1px,
            transparent 3px
          );
        opacity: 0.18;
        animation: grainShift 1.8s steps(4) infinite;
        mix-blend-mode: overlay;
      }
      @keyframes grainShift {
        0% {
          transform: translate3d(0, 0, 0);
        }
        50% {
          transform: translate3d(-10px, 10px, 0);
        }
        100% {
          transform: translate3d(0, 0, 0);
        }
      }
    `}</style>
  );

  if (designStyle === 'modern') {
    const modernHeadline = getValue('modernHeadline');
    const modernSubtitle = getValue('modernSubtitle');
    const modernBody = getValue('modernBody');
    const portraitUrl = getValue('modernPhotoUrl') || defaultValues.modernPhotoUrl;
    const name = getValue('recipientName') || defaultValues.recipientName;

    return (
      <>
        <div className="relative min-h-screen overflow-hidden bg-[#050914] text-white">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 scale-[1.08] opacity-80 blur-3xl"
              style={{
                backgroundImage: `url(${portraitUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#050914]/95 via-[#070c1b]/70 to-[#060a18]/96" />
            <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-[#2f66ff]/15 blur-3xl" />
            <div className="absolute right-[-10%] top-40 h-64 w-64 rounded-full bg-[#f5b14a]/15 blur-[120px]" />
          </div>

          <div className="soft-flare pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          <div
            className="portrait-frame relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl transition-all duration-500"
            style={{
              transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(1.02)`
            }}
          >
            {isEditable && (
              <button
                type="button"
                onClick={() => handleImagePrompt('modernPhotoUrl')}
                className="absolute right-4 top-4 z-20 rounded-full bg-black/65 px-4 py-1.5 text-xs font-medium tracking-wide text-white shadow-lg transition hover:bg-black/80"
              >
                Fotoğraf URL&apos;si
              </button>
            )}
            <div
              className="aspect-[3/4] w-full"
              style={{
                backgroundImage: `url(${portraitUrl})`,
                backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060914]/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-center text-sm uppercase tracking-[0.48em] text-white/70 backdrop-blur">
                {name}
              </div>
            </div>

            <div
              className={`mt-12 w-full max-w-xl rounded-[2.25rem] border border-white/10 bg-white/10 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl transition-all duration-700 ${
                isMounted ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
            >
              {displayCreator && (
                <p className="mb-4 text-xs uppercase tracking-[0.45em] text-white/50">Hazırlayan: {displayCreator}</p>
              )}
              <p className="text-xs uppercase tracking-[0.52em] text-white/40">Sevgili</p>
              <div
                className={`editable-surface mb-5 inline-block px-4 py-2 text-sm uppercase tracking-[0.42em] text-white/80`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.trim() ?? '')}
              >
                {name}
              </div>
              <h1
                className={`editable-surface mx-auto mb-4 max-w-lg bg-gradient-to-r from-white via-[#f7edd9] to-white bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl lg:text-5xl`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('modernHeadline', e.currentTarget.textContent?.trim() ?? '')}
              >
                {modernHeadline}
              </h1>
              <p
                className="editable-surface mx-auto mb-6 max-w-md text-base text-white/75 sm:text-lg"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('modernSubtitle', e.currentTarget.textContent?.trim() ?? '')}
              >
                {modernSubtitle}
              </p>
              <p
                className="editable-surface mx-auto max-w-xl text-sm text-white/70 sm:text-base"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('modernBody', e.currentTarget.textContent?.trim() ?? '')}
              >
                {modernBody}
              </p>
            </div>
          </div>
        </div>
        {sharedStyles}
      </>
    );
  }

  if (designStyle === 'minimalist') {
    const headline = getValue('minimalistHeadline');
    const subtitle = getValue('minimalistSubtitle');
    const messageBlock = getValue('minimalistMessage');
    const photos = [
      getValue('minimalistPhoto1Url'),
      getValue('minimalistPhoto2Url'),
      getValue('minimalistPhoto3Url'),
      getValue('minimalistPhoto4Url'),
      getValue('minimalistPhoto5Url'),
      getValue('minimalistPhoto6Url')
    ];
    const mosaicKeys: FieldKey[] = [
      'minimalistPhoto1Url',
      'minimalistPhoto2Url',
      'minimalistPhoto3Url',
      'minimalistPhoto4Url',
      'minimalistPhoto5Url',
      'minimalistPhoto6Url'
    ];

    return (
      <>
        <div className="relative min-h-screen bg-gradient-to-b from-white via-[#f5f8ff] to-white text-[#1a253a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(105,136,255,0.14),_transparent_60%)]" />

          <div
            className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between px-5 py-14 sm:px-6"
            style={{
              paddingTop: '4.5rem',
              paddingBottom: '4.5rem'
            }}
          >
            <header className="mx-auto w-[94%] max-w-xl text-center">
              {displayCreator && (
                <p className="mb-2 text-[11px] uppercase tracking-[0.38em] text-slate-500">Hazırlayan: {displayCreator}</p>
              )}
              <h1
                className="editable-surface mx-auto mb-3 inline-block px-4 py-2 text-xl font-semibold text-slate-800 sm:text-2xl"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('minimalistHeadline', e.currentTarget.textContent?.trim() ?? '')}
              >
                {headline}
              </h1>
              <p
                className="editable-surface mx-auto text-sm text-slate-500 sm:text-base"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('minimalistSubtitle', e.currentTarget.textContent?.trim() ?? '')}
              >
                {subtitle}
              </p>
            </header>

            <div
              className="relative mx-auto mt-10 w-[95%] max-w-4xl rounded-[2.5rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_22px_60px_rgba(15,36,84,0.08)] backdrop-blur"
              style={{ marginTop: '3.5rem' }}
            >
              <div
                className="pattern-overlay absolute inset-0 rounded-[2rem] opacity-60"
                style={{ transform: `translateY(${scrollOffset * -0.04}px)` }}
              />
              <div className="relative rounded-[2rem] border border-slate-100/70 bg-white/80 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {photos.map((url, index) => {
                    const key = mosaicKeys[index];
                    return (
                      <div
                        key={`mosaic-${index}`}
                        className="mosaic-tile relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100/80"
                        style={{
                          animationDelay: `${0.15 * index}s`,
                          transform: `translateY(${scrollOffset * 0.03 * (index % 2 === 0 ? 1 : -1)}px)`
                        }}
                      >
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => handleImagePrompt(key)}
                            className="absolute right-3 top-3 z-20 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white shadow hover:bg-slate-900/85"
                          >
                            Fotoğraf
                          </button>
                        )}
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: url ? `url(${url})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f235a]/10 via-transparent to-white/20" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-3xl border border-slate-100 bg-[#f5f7ff]/90 p-5 text-center shadow-inner">
                  <p
                    className="editable-surface text-sm text-slate-600 sm:text-base"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('minimalistMessage', e.currentTarget.textContent?.trim() ?? '')}
                  >
                    {messageBlock}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {sharedStyles}
      </>
    );
  }

  if (designStyle === 'eglenceli') {
    const headline = getValue('artHeadline');
    const subtitle = getValue('artSubtitle');
    const artBody = getValue('artBody');
    const artPhotos = [getValue('artPhoto1Url'), getValue('artPhoto2Url'), getValue('artPhoto3Url')];
    const collageKeys: FieldKey[] = ['artPhoto1Url', 'artPhoto2Url', 'artPhoto3Url'];
    const name = getValue('recipientName') || defaultValues.recipientName;

    return (
      <>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf2f8] via-[#f6f7ff] to-[#e9f7ff] text-[#3c2f58]">
          <div className="pointer-events-none absolute inset-0">
            <div className="pastel-orb absolute left-[-10%] top-[15%] h-80 w-80 rounded-full bg-[#ffd6e0]/70" />
            <div className="pastel-orb absolute right-[-6%] top-[45%] h-72 w-72 rounded-full bg-[#d7e4ff]/75" />
            <div className="pastel-orb absolute left-[30%] bottom-[-8%] h-72 w-72 rounded-full bg-[#d9ffe5]/70" />
          </div>

          <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 md:flex-row md:items-center md:gap-12">
            <div className="relative order-2 mt-10 flex w-full max-w-2xl flex-col items-center gap-6 md:order-1 md:flex-row md:items-start md:justify-center">
              {artPhotos.map((photoUrl, idx) => {
                const key = collageKeys[idx];
                return (
                  <div
                    key={`collage-${idx}`}
                    className="collage-photo relative aspect-[3/4] w-[70%] max-w-xs overflow-hidden rounded-[2.25rem] border-2 border-white/70 bg-white shadow-lg transition-transform duration-700 md:w-56"
                    style={{
                      '--rotate': idx === 0 ? '-6deg' : idx === 1 ? '4deg' : '-2deg',
                      transform: `rotate(${idx === 0 ? '-6deg' : idx === 1 ? '4deg' : '-2deg'}) translateY(${idx % 2 === 0 ? -8 : 6}px)`
                    } as CSSProperties}
                  >
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => handleImagePrompt(key)}
                        className="absolute right-3 top-3 z-20 rounded-full bg-[#6d5b91]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow hover:bg-[#56457a]/85"
                      >
                        Fotoğraf
                      </button>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-transparent to-transparent" />
                  </div>
                );
              })}
            </div>

            <div className="relative order-1 w-full max-w-xl rounded-[2.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_26px_70px_rgba(112,92,173,0.22)] backdrop-blur md:order-2 md:p-10">
              <div className="pointer-events-none absolute -top-10 right-10 h-20 w-20 rounded-full bg-[#ffb7d5]/80 blur-xl" />
              <div className="pointer-events-none absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-[#b9c2ff]/85 blur-xl" />

              {displayCreator && (
                <p className="mb-3 text-[11px] uppercase tracking-[0.42em] text-[#7260a8]">Hazırlayan: {displayCreator}</p>
              )}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f7f2ff] px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#7760a6] shadow-inner">
                {name}
              </div>

              <h2
                className="editable-surface mb-4 text-3xl font-semibold text-[#403065] sm:text-4xl"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('artHeadline', e.currentTarget.textContent?.trim() ?? '')}
              >
                {headline}
              </h2>
              <p
                className="editable-surface mb-5 text-base text-[#6f5f96]"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('artSubtitle', e.currentTarget.textContent?.trim() ?? '')}
              >
                {subtitle}
              </p>
              <p
                className="editable-surface text-sm text-[#6d5b91] sm:text-base"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('artBody', e.currentTarget.textContent?.trim() ?? '')}
              >
                {artBody}
              </p>
            </div>
          </div>
        </div>
        {sharedStyles}
      </>
    );
  }

  // Classic style maps to premium cinematic experience
  const headline = getValue('premiumHeadline');
  const subtitle = getValue('premiumSubtitle');
  const premiumMessage = getValue('premiumMessage');
  const backdropUrl = getValue('premiumPhotoUrl') || defaultValues.premiumPhotoUrl;
  const name = getValue('recipientName') || defaultValues.recipientName;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 scale-[1.1] brightness-[0.65]"
            style={{
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,200,120,0.25),_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/92" />
        </div>

        {isEditable && (
          <button
            type="button"
            onClick={() => handleImagePrompt('premiumPhotoUrl')}
            className="absolute right-6 top-6 z-30 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/20"
          >
            Arka Plan URL&apos;si
          </button>
        )}

        <div className="grain-overlay pointer-events-none absolute inset-0" />
        <div className="lens-flare absolute -left-32 top-1/3 h-[420px] w-[520px]" />
        <div className="lens-flare lens-flare--secondary absolute right-[-20%] top-[18%] h-[360px] w-[440px]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
          {displayCreator && (
            <p className="mb-4 text-xs uppercase tracking-[0.42em] text-white/50">Hazırlayan: {displayCreator}</p>
          )}
          <div
            className="editable-surface mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white/80 backdrop-blur"
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.trim() ?? '')}
          >
            {name}
          </div>
          <h1
            className="editable-surface mb-4 max-w-3xl bg-gradient-to-r from-white via-[#fce5c2] to-white bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl"
            contentEditable={isEditable}
            suppressContentEditableWarning
            style={{
              filter: `blur(${(1 - scrollProgress) * 3}px)`,
              opacity: 0.55 + scrollProgress * 0.45
            }}
            onBlur={(e) => handleContentChange('premiumHeadline', e.currentTarget.textContent?.trim() ?? '')}
          >
            {headline}
          </h1>
          <p
            className="editable-surface mb-6 max-w-2xl text-base text-white/75 sm:text-lg"
            contentEditable={isEditable}
            suppressContentEditableWarning
            style={{
              filter: `blur(${(1 - scrollProgress) * 2}px)`,
              opacity: 0.55 + scrollProgress * 0.45
            }}
            onBlur={(e) => handleContentChange('premiumSubtitle', e.currentTarget.textContent?.trim() ?? '')}
          >
            {subtitle}
          </p>
          <p
            className="editable-surface max-w-3xl text-sm text-white/70 sm:text-base"
            contentEditable={isEditable}
            suppressContentEditableWarning
            style={{
              transform: `translateY(${(1 - scrollProgress) * 20}px)`,
              opacity: 0.4 + scrollProgress * 0.6
            }}
            onBlur={(e) => handleContentChange('premiumMessage', e.currentTarget.textContent?.trim() ?? '')}
          >
            {premiumMessage}
          </p>
        </div>
      </div>
      {sharedStyles}
    </>
  );
}

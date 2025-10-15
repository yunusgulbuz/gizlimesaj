'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Image as ImageIcon, Loader2, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ShareFormat = 'story' | 'landscape' | 'square';
type VisualTheme = 'romance' | 'vibrant' | 'midnight';

interface ShareVisualGeneratorProps {
  shortId: string;
  recipientName: string;
  senderName: string;
  templateTitle: string;
  message: string;
  pageUrl: string;
  qrDataUrl?: string;
  templateAudience?: string | string[];
}

const formatConfig: Record<
  ShareFormat,
  { width: number; height: number; label: string; hint: string }
> = {
  story: {
    width: 1080,
    height: 1920,
    label: 'Dikey Hikaye',
    hint: 'Instagram Story, Reels, Snapchat',
  },
  landscape: {
    width: 1920,
    height: 1080,
    label: 'Yatay Paylaşım',
    hint: 'WhatsApp, Web Banner, E-posta',
  },
  square: {
    width: 1080,
    height: 1080,
    label: 'Kare Gönderi',
    hint: 'Instagram Akışı, Facebook, Pinterest',
  },
};

const themeConfig: Record<
  VisualTheme,
  {
    label: string;
    description: string;
    gradient: string;
    glowColors: [string, string, string];
  }
> = {
  romance: {
    label: 'Romantik Parıltı',
    description: 'Leylak & pembe tonlarında yumuşak geçiş',
    gradient: 'linear-gradient(135deg, #D946EF 0%, #F06190 45%, #FBCFE8 100%)',
    glowColors: ['rgba(255,210,245,0.28)', 'rgba(255,164,212,0.26)', 'rgba(255,237,213,0.25)'],
  },
  vibrant: {
    label: 'Enerjik Işık',
    description: 'Mor ve fuşya geçişli parlak görünüm',
    gradient: 'linear-gradient(135deg, #352C8A 0%, #7C56ED 55%, #F970B5 100%)',
    glowColors: ['rgba(190,167,255,0.25)', 'rgba(255,205,245,0.28)', 'rgba(255,221,179,0.24)'],
  },
  midnight: {
    label: 'Gece Işıltısı',
    description: 'Lacivert ve mor tonlarında sahne etkisi',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #312E81 45%, #7C3AED 100%)',
    glowColors: ['rgba(79,70,229,0.24)', 'rgba(99,102,241,0.22)', 'rgba(129,140,248,0.2)'],
  },
};

type AudienceCopy = {
  headline: string;
  subheadline: string;
  highlight?: string;
  messageIntro: string;
  ctaLine: string;
};

const audienceCopyMap: Record<string, AudienceCopy> = {
  romantic: {
    headline: 'Kalpten Gelen Sürpriz',
    subheadline: '{{sender}} → {{recipient}} için kalpler çarpıyor',
    highlight: 'Aşk Dokunuşu',
    messageIntro: 'Kalbini ısıtacak satırlar:',
    ctaLine: 'Mutluluğu paylaş, aşkı çoğalt 💞',
  },
  friendship: {
    headline: 'En Yakın Arkadaşına Sürpriz',
    subheadline: '{{sender}} ve {{recipient}} arasında kahkaha garantili not',
    highlight: 'Dostluk Parıltısı',
    messageIntro: 'Beraber gülmeye hazır mısınız?',
    ctaLine: 'Anınızı paylaş, dostluğu taçlandır 🌟',
  },
  family: {
    headline: 'Ailenden Gelen Sıcaklık',
    subheadline: '{{recipient}} için aile sıcaklığı taşıyan dijital sürpriz',
    highlight: 'Aile Bağı',
    messageIntro: 'Sıcacık bir mesaj seni bekliyor:',
    ctaLine: 'Mutluluğu paylaş, aile bağını güçlendir 🏡',
  },
  professional: {
    headline: 'Ekip Arkadaşına Teşekkür',
    subheadline: '{{sender}} → {{recipient}} için ilham veren geri bildirim',
    highlight: 'Takdir Notu',
    messageIntro: 'Motivasyon dolu satırlar:',
    ctaLine: 'Başarıyı paylaş, ekibi motive et 💼',
  },
  birthday: {
    headline: 'Doğum Gününe Özel Sürpriz',
    subheadline: '{{recipient}} için kutlama enerjisiyle dolu not',
    highlight: 'Birthday Vibes',
    messageIntro: 'Dilek mumlarını hazırla:',
    ctaLine: 'Kutlamayı paylaş, mutluluğu yay 🎂',
  },
  celebration: {
    headline: 'Kutlamayı Parlatan Not',
    subheadline: '{{recipient}} için mutlulukla parlayan sürpriz',
    highlight: 'Kutlama Anı',
    messageIntro: 'Bu satırlar yüz güldürüyor:',
    ctaLine: 'Kutlamayı paylaş, enerjiyi çoğalt 🎉',
  },
  fun: {
    headline: 'Enerjisi Tavan Bir Sürpriz',
    subheadline: '{{sender}} → {{recipient}} için eğlence garantili mesaj',
    highlight: 'Fun Mode On',
    messageIntro: 'Hazır mısın, eğlence başlıyor:',
    ctaLine: 'Gülüşleri paylaş, enerjiyi yükselt ⚡️',
  },
  teen: {
    headline: 'Genç Ruhun Sürprizi',
    subheadline: '{{recipient}} için trend dolu bir dijital hediye',
    highlight: 'Trend Alert',
    messageIntro: 'Kalp atışını hızlandıracak satırlar:',
    ctaLine: 'Story\'de paylaş, tüm ekibi haberdar et 💬',
  },
  adult: {
    headline: 'Zarif ve Özenli Bir Jest',
    subheadline: '{{sender}} → {{recipient}} için unutulmaz sürpriz',
    highlight: 'Elegant Touch',
    messageIntro: 'İçten duygularla dolu cümle:',
    ctaLine: 'Mutluluğu paylaş, anı ölümsüzleştir ✨',
  },
  classic: {
    headline: 'Klasik Şıklıkta Bir Mesaj',
    subheadline: '{{recipient}} için zarafet taşıyan satırlar',
    highlight: 'Zarafet Notu',
    messageIntro: 'Her satırı özenle seçildi:',
    ctaLine: 'Zarafeti paylaş, romantizmi çoğalt 🌹',
  },
  elegant: {
    headline: 'Şık Bir Dijital Sürpriz',
    subheadline: '{{sender}} → {{recipient}} için sofistike dokunuş',
    highlight: 'Elegant Vibes',
    messageIntro: 'İncelikle yazılmış satırlar:',
    ctaLine: 'Şıklığı paylaş, iz bırak ✨',
  },
  default: {
    headline: 'Unutulmaz Bir Sürpriz',
    subheadline: '{{sender}} → {{recipient}} için dijital mutluluk',
    highlight: 'Mutluluk Anı',
    messageIntro: 'Seni gülümsetecek satırlar:',
    ctaLine: 'Mutluluğu paylaş, anıları çoğalt ✨',
  },
};

export function ShareVisualGenerator({
  shortId,
  recipientName,
  senderName,
  templateTitle,
  message,
  pageUrl,
  qrDataUrl,
  templateAudience,
}: ShareVisualGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat>('story');
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>(() => {
    const primaryAudience = extractPrimaryAudience(templateAudience);
    return audienceToTheme(primaryAudience);
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [hasManualThemeSelection, setHasManualThemeSelection] = useState(false);

  const storyRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  const formatRefs: Record<ShareFormat, React.RefObject<HTMLDivElement>> = {
    story: storyRef,
    landscape: landscapeRef,
    square: squareRef,
  };

  const formattedUrl = useMemo(() => {
    try {
      const url = new URL(pageUrl);
      return url.hostname.replace('www.', '') + url.pathname;
    } catch {
      return pageUrl.replace(/^https?:\/\//, '');
    }
  }, [pageUrl]);

  const primaryAudience = extractPrimaryAudience(templateAudience);
  const copyTemplate = audienceCopyMap[primaryAudience] ?? audienceCopyMap.default;

  useEffect(() => {
    if (!hasManualThemeSelection) {
      setSelectedTheme(audienceToTheme(primaryAudience));
    }
  }, [primaryAudience, hasManualThemeSelection]);

  useEffect(() => {
    setHasManualThemeSelection(false);
  }, [shortId]);

  const handleThemeSelection = (themeKey: VisualTheme) => {
    setHasManualThemeSelection(true);
    setSelectedTheme(themeKey);
  };

  const applyCopyTemplate = (text: string) =>
    text
      .replace(/{{recipient}}/gi, recipientName)
      .replace(/{{sender}}/gi, senderName)
      .replace(/{{templateTitle}}/gi, templateTitle);

  const copy = {
    headline: applyCopyTemplate(copyTemplate.headline),
    subheadline: applyCopyTemplate(copyTemplate.subheadline),
    highlight: applyCopyTemplate(copyTemplate.highlight ?? templateTitle),
    messageIntro: applyCopyTemplate(copyTemplate.messageIntro),
    ctaLine: applyCopyTemplate(copyTemplate.ctaLine),
  };

  const getTruncatedMessage = (text: string, format: ShareFormat) => {
    const limit = format === 'story' ? 220 : 180;
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}…`;
  };

  const renderVisualContent = (format: ShareFormat, theme: VisualTheme) => {
    const { width, height } = formatConfig[format];
    const isStory = format === 'story';
    const truncatedMessage = getTruncatedMessage(message, format);

    const headingStyle = { fontSize: isStory ? '52px' : '48px' };
    const messageStyle = { fontSize: isStory ? '42px' : '36px' };
    const signatureStyle = { fontSize: isStory ? '28px' : '24px' };
    const padding = isStory ? '88px' : '72px';
    const themeStyles = themeConfig[theme];

    const gradientStyle: CSSProperties = {
      background: themeStyles.gradient,
      color: '#FFFFFF',
      borderRadius: '54px',
      padding,
      width,
      height,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
    };

    const translucent = (opacity: number) => `rgba(255,255,255,${opacity})`;

    return (
      <div style={gradientStyle}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div
            style={{
              position: 'absolute',
              left: '-24%',
              top: '-20%',
              width: '24%',
              height: '24%',
              backgroundColor: themeStyles.glowColors[0],
              borderRadius: '9999px',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-12%',
              top: '32%',
              width: '26%',
              height: '26%',
              backgroundColor: themeStyles.glowColors[1],
              borderRadius: '9999px',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '28%',
              bottom: '-12%',
              width: '35%',
              height: '35%',
              backgroundColor: themeStyles.glowColors[2],
              borderRadius: '9999px',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '28px',
                  backgroundColor: translucent(0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Sparkles style={{ width: '40px', height: '40px', color: translucent(0.9) }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5em',
                    color: translucent(0.6),
                  }}
                >
                  birmesajmutluluk.com
                </p>
                <p style={{ ...headingStyle, fontWeight: 600, marginTop: '8px', lineHeight: 1.1 }}>
                  {copy.headline}
                </p>
                <p
                  style={{
                    marginTop: '12px',
                    fontSize: isStory ? '26px' : '22px',
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: translucent(0.75),
                  }}
                >
                  {copy.subheadline}
                </p>
              </div>
            </div>
            <div
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                backgroundColor: translucent(0.1),
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                color: translucent(0.7),
                backdropFilter: 'blur(12px)',
              }}
            >
              {copy.highlight || templateTitle}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '40px',
              border: `1px solid ${translucent(0.2)}`,
              backgroundColor: translucent(0.12),
              padding: '48px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              style={{
                fontSize: isStory ? '24px' : '20px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: translucent(0.75),
                textTransform: 'none',
                marginBottom: '16px',
              }}
            >
              {copy.messageIntro}
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.6em',
                color: translucent(0.6),
              }}
            >
              {recipientName} için
            </p>
            <p style={{ ...messageStyle, marginTop: '32px', lineHeight: 1.2, color: translucent(0.95) }}>
              “{truncatedMessage}”
            </p>
            <p style={{ ...signatureStyle, marginTop: '48px', textAlign: 'right', fontWeight: 500, color: translucent(0.7) }}>
              — {senderName}
            </p>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            marginTop: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '40px',
            border: `1px solid ${translucent(0.15)}`,
            backgroundColor: translucent(0.1),
            padding: '40px 56px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5em',
                color: translucent(0.6),
              }}
            >
              Hemen tara
            </p>
            <p
              style={{
                marginTop: '12px',
                fontSize: '20px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                color: translucent(0.8),
              }}
            >
              {formattedUrl}
            </p>
            <p style={{ marginTop: '8px', fontSize: '16px', color: translucent(0.7) }}>
              Kodu: {shortId.toUpperCase()}
            </p>
            <p
              style={{
                marginTop: '18px',
                fontSize: '20px',
                fontWeight: 600,
                color: translucent(0.88),
              }}
            >
              {copy.ctaLine}
            </p>
          </div>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Gizli mesaj QR kodu"
              crossOrigin="anonymous"
              style={{
                width: '208px',
                height: '208px',
                borderRadius: '34px',
                border: `1px solid ${translucent(0.4)}`,
                backgroundColor: 'rgba(255,255,255,0.95)',
                padding: '24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              }}
            />
          ) : (
            <div
              style={{
                width: '208px',
                height: '208px',
                borderRadius: '34px',
                border: `1px solid ${translucent(0.3)}`,
                backgroundColor: translucent(0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: translucent(0.7),
              }}
            >
              QR hazırlanıyor
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = (format: ShareFormat, theme: VisualTheme) => {
    const { width, height } = formatConfig[format];
    const previewScale = format === 'story' ? 0.22 : format === 'square' ? 0.24 : 0.2;
    const previewWidth = width * previewScale;
    const previewHeight = height * previewScale;

    return (
      <div
        className="relative overflow-hidden rounded-[36px] shadow-2xl shadow-purple-200/60"
        style={{ width: previewWidth, height: previewHeight }}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `scale(${previewScale})`,
            width,
            height,
          }}
        >
          {renderVisualContent(format, theme)}
        </div>
      </div>
    );
  };

  const generateImage = async (format: ShareFormat) => {
    const ref = formatRefs[format].current;
    if (!ref) return;

    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(ref, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png', 1);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `gizlimesaj-${shortId}-${format}-${selectedTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Share image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const { label, hint, width, height } = formatConfig[selectedFormat];
  const theme = themeConfig[selectedTheme];

  const handleShareImage = async (format: ShareFormat) => {
    const ref = formatRefs[format].current;
    if (!ref || typeof navigator === 'undefined' || !('share' in navigator)) return generateImage(format);

    setIsSharing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(ref, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `gizlimesaj-${shortId}-${selectedFormat}-${selectedTheme}.png`, {
        type: 'image/png',
        lastModified: Date.now(),
      });

      if ('share' in navigator && typeof navigator.share === 'function') {
        await navigator.share({
          files: [file],
          title: copy.headline,
          text: `${copy.subheadline} • ${formattedUrl}`,
        });
      }
    } catch (error) {
      console.error('Share image failed:', error);
      await generateImage(format);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-800">Görsel olarak paylaş</p>
        <p className="text-xs text-gray-500">
          Kare, dikey ve yatay PNG şablonları ile mesajınızı farklı sosyal ağ formatlarında öne çıkarın.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(formatConfig) as ShareFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => setSelectedFormat(format)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              format === selectedFormat
                ? 'border-purple-300 bg-purple-100/80 text-purple-700 shadow-sm'
                : 'border-gray-200 bg-white/80 text-gray-600 hover:border-purple-200 hover:text-purple-600'
            )}
          >
            <ImageIcon className="h-4 w-4" />
            {formatConfig[format].label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Stil Seçimi
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(themeConfig) as [VisualTheme, typeof themeConfig[keyof typeof themeConfig]][]).map(
            ([themeKey, themeValue]) => (
              <button
                key={themeKey}
                type="button"
                onClick={() => handleThemeSelection(themeKey)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors backdrop-blur-sm',
                  selectedTheme === themeKey
                    ? 'border-purple-300 bg-purple-100/80 text-purple-700 shadow-sm'
                    : 'border-gray-200 bg-white/80 text-gray-600 hover:border-purple-200 hover:text-purple-600'
                )}
              >
                <span
                  className="h-4 w-4 rounded-full border border-white/50 shadow-sm"
                  style={{ background: themeValue.gradient }}
                />
                <span className="font-medium">{themeValue.label}</span>
              </button>
            )
          )}
        </div>
        <p className="text-xs text-gray-500">{theme.description}</p>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 backdrop-blur-sm shadow-xl shadow-purple-200/60">
        <div className="flex flex-col items-center gap-6">
          {renderPreview(selectedFormat, selectedTheme)}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">
              {hint} • {width} × {height}px
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => generateImage(selectedFormat)}
              disabled={isGenerating}
              className="flex flex-1 items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200/50 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating ? 'Görsel hazırlanıyor...' : `${label} PNG indir`}
            </Button>
            <Button
              onClick={() => handleShareImage(selectedFormat)}
              variant="outline"
              disabled={isGenerating || isSharing}
              className="flex flex-1 items-center justify-center gap-2 border-purple-200 bg-white/80 text-purple-600 hover:border-purple-300 hover:text-purple-700"
            >
              {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
              {isSharing ? 'Paylaşıma hazırlanıyor...' : 'Cihazdan paylaş'}
            </Button>
          </div>
        </div>
      </div>

      {/* Off-screen full resolution canvases */}
      <div className="pointer-events-none absolute -left-[9999px] top-0 flex gap-8">
        <div
          ref={storyRef}
          style={{
            width: formatConfig.story.width,
            height: formatConfig.story.height,
          }}
        >
          {renderVisualContent('story', selectedTheme)}
        </div>
        <div
          ref={landscapeRef}
          style={{
            width: formatConfig.landscape.width,
            height: formatConfig.landscape.height,
          }}
        >
          {renderVisualContent('landscape', selectedTheme)}
        </div>
        <div
          ref={squareRef}
          style={{
            width: formatConfig.square.width,
            height: formatConfig.square.height,
          }}
        >
          {renderVisualContent('square', selectedTheme)}
        </div>
      </div>
    </div>
  );
}

function extractPrimaryAudience(audience?: string | string[] | null): string {
  if (!audience) return 'default';
  if (Array.isArray(audience)) {
    return audience[0]?.toLowerCase() || 'default';
  }
  return audience.toLowerCase();
}

function audienceToTheme(audience?: string): VisualTheme {
  switch (audience) {
    case 'romantic':
    case 'family':
    case 'elegant':
    case 'classic':
    case 'engagement':
    case 'proposal':
    case 'anniversary':
      return 'romance';
    case 'professional':
    case 'gratitude':
      return 'midnight';
    case 'fun':
    case 'teen':
    case 'birthday':
    case 'celebration':
    case 'friendship':
      return 'vibrant';
    default:
      return 'vibrant';
  }
}

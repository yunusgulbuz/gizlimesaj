'use client';

import type { CSSProperties } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Download, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ShareFormat = 'story' | 'landscape';

interface ShareVisualGeneratorProps {
  shortId: string;
  recipientName: string;
  senderName: string;
  templateTitle: string;
  message: string;
  pageUrl: string;
  qrDataUrl?: string;
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
};

export function ShareVisualGenerator({
  shortId,
  recipientName,
  senderName,
  templateTitle,
  message,
  pageUrl,
  qrDataUrl,
}: ShareVisualGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat>('story');
  const [isGenerating, setIsGenerating] = useState(false);

  const storyRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);

  const formatRefs: Record<ShareFormat, React.RefObject<HTMLDivElement>> = {
    story: storyRef,
    landscape: landscapeRef,
  };

  const formattedUrl = useMemo(() => {
    try {
      const url = new URL(pageUrl);
      return url.hostname.replace('www.', '') + url.pathname;
    } catch {
      return pageUrl.replace(/^https?:\/\//, '');
    }
  }, [pageUrl]);

  const getTruncatedMessage = (text: string, format: ShareFormat) => {
    const limit = format === 'story' ? 220 : 180;
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}…`;
  };

  const renderVisualContent = (format: ShareFormat) => {
    const { width, height } = formatConfig[format];
    const isStory = format === 'story';
    const truncatedMessage = getTruncatedMessage(message, format);

    const headingStyle = { fontSize: isStory ? '52px' : '48px' };
    const messageStyle = { fontSize: isStory ? '42px' : '36px' };
    const signatureStyle = { fontSize: isStory ? '28px' : '24px' };
    const padding = isStory ? '88px' : '72px';

    const gradientStyle: CSSProperties = {
      background: 'linear-gradient(135deg, #352C8A 0%, #7C56ED 55%, #F970B5 100%)',
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
              width: '25%',
              height: '25%',
              backgroundColor: translucent(0.15),
              borderRadius: '9999px',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-12%',
              top: '35%',
              width: '28%',
              height: '28%',
              backgroundColor: 'rgba(250,205,255,0.2)',
              borderRadius: '9999px',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '25%',
              bottom: '-12%',
              width: '35%',
              height: '35%',
              backgroundColor: 'rgba(255,215,163,0.2)',
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
                  gizlimesaj.com
                </p>
                <p style={{ ...headingStyle, fontWeight: 600, marginTop: '8px' }}>Sürpriz Mesaj</p>
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
              {templateTitle}
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

  const renderPreview = (format: ShareFormat) => {
    const { width, height } = formatConfig[format];
    const previewScale = format === 'story' ? 0.22 : 0.2;
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
          {renderVisualContent(format)}
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
      link.download = `gizlimesaj-${shortId}-${format}.png`;
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

  return (
    <div className="relative space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-800">Görsel olarak paylaş</p>
        <p className="text-xs text-gray-500">
          Dikey ve yatay PNG şablonlarıyla mesajınızı daha etkileyici paylaşın.
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

      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 backdrop-blur-sm shadow-xl shadow-purple-200/60">
        <div className="flex flex-col items-center gap-6">
          {renderPreview(selectedFormat)}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">
              {hint} • {width} × {height}px
            </p>
          </div>
          <Button
            onClick={() => generateImage(selectedFormat)}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200/50 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGenerating ? 'Görsel hazırlanıyor...' : `${label} PNG indir`}
          </Button>
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
          {renderVisualContent('story')}
        </div>
        <div
          ref={landscapeRef}
          style={{
            width: formatConfig.landscape.width,
            height: formatConfig.landscape.height,
          }}
        >
          {renderVisualContent('landscape')}
        </div>
      </div>
    </div>
  );
}

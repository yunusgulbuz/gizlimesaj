'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, Clock } from 'lucide-react';
import { FloatingHearts } from '@/components/ui/floating-hearts';
import { AudioPlayer } from '@/components/ui/audio-player';
import { YouTubePlayer, extractVideoId } from '@/components/ui/youtube-player';
import { Button } from '@/components/ui/button';
import { createAnalyticsTracker } from '@/lib/analytics';
import TemplateRenderer from '@/templates/shared/template-renderer';
import AITemplateRenderer from '@/components/ai-template-renderer';
import { getDefaultTextFields } from '@/templates/shared/types';
import { ShareButton } from '@/components/share-button';
import { ShareVisualGenerator } from '@/components/share/share-visual-generator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PersonalPageData } from './types';

interface PersonalMessagePageClientProps {
  shortId: string;
  initialPage: PersonalPageData;
}

export function PersonalMessagePageClient({
  shortId,
  initialPage,
}: PersonalMessagePageClientProps) {
  const [personalPage] = useState<PersonalPageData | null>(initialPage);
  const [isExpired, setIsExpired] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showAutoplayNotice, setShowAutoplayNotice] = useState(false);

  const analytics = useMemo(() => createAnalyticsTracker(shortId), [shortId]);

  useEffect(() => {
    analytics.trackPageView().catch((error) => {
      console.error('Analytics page view error:', error);
    });
  }, [analytics]);

  useEffect(() => {
    if (!shortId) return;
    if (typeof window === 'undefined') return;

    const url = `${window.location.origin}/m/${shortId}`;
    setShareUrl(url);
    const encodedUrl = encodeURIComponent(url);
    const remoteQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&data=${encodedUrl}&margin=1`;

    setQrDataUrl('');

    let isCancelled = false;

    const loadQrDataUrl = async () => {
      try {
        const response = await fetch(remoteQrUrl);
        if (!response.ok) {
          throw new Error('QR kod alınamadı');
        }
        const blob = await response.blob();
        if (isCancelled) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          if (!isCancelled && typeof reader.result === 'string') {
            setQrDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('QR data URL error:', error);
      }
    };

    loadQrDataUrl();

    return () => {
      isCancelled = true;
    };
  }, [shortId]);

  useEffect(() => {
    if (!personalPage) return;

    const checkExpiry = () => {
      const now = new Date().getTime();
      const expiry = new Date(personalPage.expires_at).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
      }
    };

    const timer = setInterval(checkExpiry, 1000);
    checkExpiry();

    return () => clearInterval(timer);
  }, [personalPage]);

  useEffect(() => {
    if (!personalPage) return;

    const audioUrl =
      personalPage.text_fields?.musicUrl || personalPage.bg_audio_url;
    if (!audioUrl) return;

    let cancelled = false;

    const attemptAutoPlay = () => {
      const videoElement = document.querySelector('video');
      const audioElement = document.querySelector('audio');
      const mediaElement =
        (videoElement as HTMLMediaElement | null) ||
        (audioElement as HTMLMediaElement | null);

      if (!mediaElement) return;

      mediaElement
        .play()
        .then(() => {
          if (!cancelled) {
            setIsPlaying(true);
            setHasUserInteracted(true);
            setShowAutoplayNotice(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setShowAutoplayNotice(true);
          }
        });
    };

    const timeoutId = window.setTimeout(attemptAutoPlay, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [personalPage]);

  useEffect(() => {
    if (isPlaying) {
      setShowAutoplayNotice(false);
    }
  }, [isPlaying]);

  if (!personalPage || !personalPage.is_active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-3xl bg-white/85 px-8 py-12 text-center shadow-2xl shadow-purple-200/60 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bu sürpriz artık görünür değil
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Özenle hazırlanmış bu mesajın süresi dolmuş ya da göndericisi
            tarafından gizlenmiş olabilir. Yeni bir mutluluk hazırlamak istersen
            birkaç dakikada yeni bir sayfa oluşturabilirsin.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300/40">
              <a href="https://birmesajmutluluk.com">Yeni mesaj hazırla</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-purple-200 bg-white/80 text-purple-600 hover:border-purple-300 hover:text-purple-700"
            >
              <a href="https://birmesajmutluluk.com/contact">
                Destek ekibiyle iletişime geç
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mesajın Süresi Doldu
          </h1>
          <p className="text-gray-600 mb-6">
            Bu özel mesajın görüntülenme süresi sona erdi. Ama endişelenme, yeni
            mesajlar oluşturmaya devam edebilirsin!
          </p>
          <Button asChild>
            <a href="https://birmesajmutluluk.com">Yeni Mesaj Oluştur</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleUserInteraction = () => {
    if (!hasUserInteracted || !isPlaying) {
      setHasUserInteracted(true);
      setShowAutoplayNotice(false);

      const audioUrl =
        personalPage.text_fields?.musicUrl || personalPage.bg_audio_url;
      if (audioUrl) {
        setTimeout(() => {
          const videoElement = document.querySelector('video');
          const audioElement = document.querySelector('audio');

          if (videoElement) {
            videoElement.play().catch(() => {
              setShowAutoplayNotice(true);
            });
          } else if (audioElement) {
            audioElement.play().catch(() => {
              setShowAutoplayNotice(true);
            });
          }
        }, 100);
      }
    }
  };

  return (
    <div
      className="min-h-[100dvh] relative overflow-x-hidden"
      onClick={handleUserInteraction}
    >
      <div className="fixed top-4 left-4 z-50">
        <ShareButton
          shortId={personalPage.short_id}
          recipientName={personalPage.recipient_name}
          className="bg-gray-900/95 text-white border-gray-700/50 hover:bg-gray-900 shadow-lg"
          onVisualShare={() => setIsShareDialogOpen(true)}
        />
      </div>

      {showAutoplayNotice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white shadow-lg sm:text-sm">
          Müziğin başlaması için ekrana dokunun
        </div>
      )}

      {(personalPage.bg_audio_url || personalPage.text_fields?.musicUrl) && (
        <div className="fixed top-4 right-4 z-50">
          {(() => {
            const audioUrl =
              personalPage.text_fields?.musicUrl || personalPage.bg_audio_url;

            if (
              audioUrl &&
              (audioUrl.includes('youtube.com') ||
                audioUrl.includes('youtu.be'))
            ) {
              return (
                <YouTubePlayer
                  videoId={extractVideoId(audioUrl) || undefined}
                  autoPlay
                  loop
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                />
              );
            } else if (audioUrl) {
              return (
                <AudioPlayer
                  src={audioUrl}
                  autoPlay
                  loop
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                />
              );
            }
            return null;
          })()}
        </div>
      )}

      <div className="w-full min-h-[100dvh]">
        {personalPage.ai_template_code ? (
          // AI-generated template
          <AITemplateRenderer
            templateCode={personalPage.ai_template_code}
            metadata={personalPage.text_fields}
            creatorName={personalPage.sender_name}
            bgAudioUrl={personalPage.bg_audio_url}
            isEditable={false}
          />
        ) : (
          // Regular template
          <TemplateRenderer
            template={{
              id: personalPage.id,
              slug: personalPage.template_slug,
              title: personalPage.template_title,
              audience: Array.isArray(personalPage.template_audience)
                ? personalPage.template_audience
                : [personalPage.template_audience],
              bg_audio_url: personalPage.template_bg_audio_url,
            }}
            recipientName={personalPage.recipient_name}
            message={personalPage.message}
            designStyle={personalPage.design_style}
            creatorName={personalPage.sender_name}
            isPreview={false}
            textFields={{
              ...getDefaultTextFields(personalPage.template_slug),
              ...personalPage.text_fields,
              recipient_name: personalPage.recipient_name,
              sender_name: personalPage.sender_name,
              message: personalPage.message,
              ...(personalPage.special_date && {
                special_date: personalPage.special_date,
              }),
            }}
          />
        )}
      </div>

      <FloatingHearts isActive />

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <a href="https://birmesajmutluluk.com" className="block">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg cursor-pointer hover:bg-gray-800/95 transition-colors">
            <p className="text-xs text-white font-medium">
              ❤️ birmesajmutluluk ile yapılmıştır
            </p>
          </div>
        </a>
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="w-full h-[100dvh] sm:h-auto sm:w-[95vw] max-w-none sm:max-w-7xl max-h-[95vh] overflow-y-auto px-3 pt-3 pb-3 sm:px-6 sm:pt-6 sm:pb-6 m-0 sm:m-4 rounded-none sm:rounded-lg">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900">
              Görsel Olarak Paylaş
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ShareVisualGenerator
              shortId={shortId}
              recipientName={personalPage.recipient_name}
              senderName={personalPage.sender_name}
              templateTitle={personalPage.template_title}
              templateAudience={personalPage.template_audience}
              message={personalPage.message}
              pageUrl={
                shareUrl || `https://birmesajmutluluk.com/m/${shortId}`
              }
              qrDataUrl={qrDataUrl || undefined}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

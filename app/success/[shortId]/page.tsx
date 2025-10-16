'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  ExternalLink,
  Clock,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Share2,
  Download,
  Loader2,
  XCircle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SocialShare } from '@/components/ui/social-share';
import { ShareVisualGenerator } from '@/components/share/share-visual-generator';
import { Image as ImageIcon } from 'lucide-react';

interface PersonalPageData {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  template_title: string;
  template_slug: string;
  template_audience: string | string[];
  expires_at: string;
  is_active: boolean;
}

export default function SuccessPage() {
  const params = useParams();
  const shortId = params.shortId as string;
  const [pageData, setPageData] = useState<PersonalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisualDialogOpen, setIsVisualDialogOpen] = useState(false);

  // Get personal page URL safely (only on client side)
  const [personalPageUrl, setPersonalPageUrl] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isDownloadingQR, setIsDownloadingQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = `${window.location.origin}/m/${shortId}`;
    setPersonalPageUrl(url);
    const encodedUrl = encodeURIComponent(url);
    const remoteQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&data=${encodedUrl}&margin=1`;

    setQrImageUrl(remoteQrUrl);
    setQrDataUrl('');

    let isCancelled = false;

    const loadQrDataUrl = async () => {
      try {
        const response = await fetch(remoteQrUrl);
        if (!response.ok) {
          throw new Error('QR kodu alınamadı');
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
      } catch (qrError) {
        console.error('QR data URL error:', qrError);
      }
    };

    loadQrDataUrl();

    return () => {
      isCancelled = true;
    };
  }, [shortId]);

  useEffect(() => {
    let currentRetryCount = 0;
    const maxRetries = 10; // Maximum 10 attempts
    const retryDelay = 2000; // 2 seconds between retries

    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/personal-pages/${shortId}?checkOwner=true`);
        if (!response.ok) {
          if (response.status === 404 && currentRetryCount < maxRetries) {
            // Page might not be created yet, retry after delay
            currentRetryCount++;
            setRetryCount(currentRetryCount);
            setTimeout(fetchPageData, retryDelay);
            return;
          }
          if (response.status === 401) {
            throw new Error('Bu sayfayı görüntülemek için giriş yapmalısınız');
          }
          if (response.status === 403) {
            throw new Error('Bu sayfayı görüntüleme yetkiniz yok');
          }
          throw new Error('Sayfa bulunamadı');
        }
        const data = await response.json();
        setPageData(data);
        setLoading(false);
      } catch (err) {
        if (currentRetryCount < maxRetries && !(err instanceof Error && (err.message.includes('yetkiniz') || err.message.includes('giriş')))) {
          // Retry on error (network issues, etc.) but not on auth errors
          currentRetryCount++;
          setRetryCount(currentRetryCount);
          setTimeout(fetchPageData, retryDelay);
        } else {
          setError(err instanceof Error ? err.message : 'Bir hata oluştu');
          setLoading(false);
        }
      }
    };

    if (shortId) {
      fetchPageData();
    }
  }, [shortId]);

  const handleCopyUrl = async () => {
    const urlToCopy = personalPageUrl || `https://birmesajmutluluk.com/m/${shortId}`;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleShare = (platform: string) => {
    // Track sharing analytics
    console.log(`Shared via ${platform}`);
  };

  const handleNativeShare = async () => {
    const urlToShare = personalPageUrl || `https://birmesajmutluluk.com/m/${shortId}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${pageData?.sender_name || 'Gizli Mesaj'} sana özel bir sürpriz hazırladı`,
          text: `${pageData?.recipient_name || 'Sevdiğin'} için hazırlanan mesajı hemen keşfet`,
          url: urlToShare,
        });
      } catch (shareError) {
        console.warn('Native share cancelled or failed:', shareError);
      }
    } else {
      const urlToCopy = urlToShare;
      try {
        await navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (copyError) {
        console.error('Clipboard copy failed:', copyError);
      }
    }
  };

  const handleDownloadQR = async () => {
    if (!qrImageUrl && !qrDataUrl) return;

    try {
      setIsDownloadingQR(true);
      let dataUrl = qrDataUrl;

      if (!dataUrl && qrImageUrl) {
        const response = await fetch(qrImageUrl);

        if (!response.ok) {
          throw new Error('QR kod indirilemedi');
        }

        const blob = await response.blob();
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('QR kod data URL oluşturulamadı'));
            }
          };
          reader.onerror = () => reject(new Error('QR kod data URL okunamadı'));
          reader.readAsDataURL(blob);
        });

        setQrDataUrl(dataUrl);
      }

      if (!dataUrl) {
        throw new Error('QR kod hazır değil');
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `gizlimesaj-${shortId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (downloadError) {
      console.error('QR download error:', downloadError);
    } finally {
      setIsDownloadingQR(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50/60 to-indigo-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-purple-300/30 blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-10%] h-72 w-72 rounded-full bg-pink-300/25 blur-3xl" />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border-white/70 bg-white/80 backdrop-blur-xl shadow-2xl shadow-purple-200/60">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Mesajınız hazırlanıyor
              </h3>
              <p className="max-w-sm text-sm text-gray-500">
                Ödeme işleminiz tamamlandı. Sürpriz sayfanızı son dokunuşlarla hazırlıyoruz.
              </p>
              {retryCount > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-medium text-purple-600">
                  <Clock className="h-4 w-4" />
                  <span>Kontrol {retryCount}/10</span>
                </div>
              )}
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Bu işlem yalnızca birkaç saniye sürer
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    const isAuthError = error?.includes('yetkiniz') || error?.includes('giriş');
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-purple-100/50 to-indigo-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-15%] top-[-10%] h-64 w-64 rounded-full bg-red-200/30 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-5%] h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <Card className="w-full max-w-lg border-white/70 bg-white/90 backdrop-blur-xl shadow-2xl shadow-purple-200/60">
            <CardContent className="space-y-6 py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isAuthError ? 'Erişim Engellendi' : 'Sayfa bulunamadı'}
                </h3>
                <p className="text-sm text-gray-600">
                  {error || 'Aradığınız sayfa bulunamadı veya erişim süresi dolmuş olabilir.'}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {isAuthError ? (
                  <Link href="/login" className="inline-flex">
                    <Button className="gap-2">
                      Giriş Yap
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/" className="inline-flex">
                    <Button className="gap-2">
                      Ana sayfaya dön
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/contact" className="inline-flex">
                  <Button variant="outline" className="border-gray-200 bg-white/70 text-gray-700 backdrop-blur-sm hover:bg-white">
                    Destek ekibiyle iletişime geç
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const expiresAt = new Date(pageData.expires_at);
  const timeRemainingMs = expiresAt.getTime() - Date.now();
  const remainingDays = Math.max(0, Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24)));
  const formattedExpiry = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(expiresAt);
  const shareTitle = `${pageData.sender_name} sana özel bir mesaj gönderdi!`;
  const shareDescription = `${pageData.recipient_name} için hazırlanan sürprizi görüntüle.`;
  const shareUrl = personalPageUrl || `https://birmesajmutluluk.com/m/${shortId}`;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50/60 to-indigo-50 px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-[-10%] h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
          <div className="absolute right-[-15%] top-[-20%] h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="absolute bottom-[-25%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/80 shadow-xl shadow-purple-200/60">
            <CheckCircle className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Mesajınız hazır! 🎉
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            {pageData.recipient_name} için hazırladığınız sürpriz sayfa yayında.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-700">
            <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm shadow-purple-200/60">
              <Sparkles className="h-4 w-4 text-purple-500" />
              {pageData.template_title}
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm shadow-purple-200/60">
              <Clock className="h-4 w-4 text-rose-500" />
              {timeRemainingMs > 0 ? `${remainingDays} gün kaldı` : 'Süre dolmak üzere'}
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm shadow-purple-200/60">
              <QrCode className="h-4 w-4 text-indigo-500" />
              {shortId.toUpperCase()}
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="flex justify-center">
            <Link href={`/m/${shortId}`} target="_blank">
              <Button
                variant="outline"
                className="gap-2 border-gray-300 bg-white/90 text-gray-700 hover:bg-white hover:border-gray-400"
              >
                <Eye className="h-4 w-4" />
                Sürprizi Gör
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/85 backdrop-blur-sm shadow-xl shadow-purple-200/60 overflow-hidden">
            <SocialShare
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
              recipientName={pageData.recipient_name}
              onShare={handleShare}
            />

            <div className="border-t border-gray-100 p-4">
              <Button
                onClick={() => setIsVisualDialogOpen(true)}
                className="w-full justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-xl shadow-purple-300/50 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 py-6 text-base font-semibold animate-pulse hover:animate-none transition-all"
              >
                <ImageIcon className="h-5 w-5" />
                Görsel Olarak Paylaş
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Card className="border-white/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-purple-200/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
                <QrCode className="h-5 w-5 text-purple-600" />
                Paylaşılabilir QR kod
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500">
                Telefon kameraları ile anında açılabilen kare kod.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 sm:space-y-5 sm:pt-5">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-3xl border border-purple-100 bg-white/90 p-3 sm:p-4 shadow-inner shadow-purple-100/50">
                    {qrImageUrl ? (
                      <img
                        src={qrImageUrl}
                        alt="Gizli mesaj için QR kod"
                        className="h-48 w-48 sm:h-56 sm:w-56 rounded-2xl bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center rounded-2xl bg-purple-50 text-sm text-purple-500">
                        QR kod hazırlanıyor...
                      </div>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Kamerayı yönlendir
                  </span>
                </div>

                <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                  <Button
                    onClick={handleDownloadQR}
                    disabled={!qrImageUrl || isDownloadingQR}
                    className="w-full justify-center gap-2 bg-purple-600 text-white shadow-lg shadow-purple-300/50 hover:bg-purple-700 text-sm sm:text-base py-2 sm:py-3"
                  >
                    {isDownloadingQR ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {isDownloadingQR ? 'İndiriliyor...' : 'PNG indir'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-purple-200 bg-white/90 text-purple-600 hover:border-purple-300 hover:text-purple-700 text-sm sm:text-base py-2 sm:py-3"
                    onClick={handleNativeShare}
                    disabled={!shareUrl}
                  >
                    <Share2 className="h-4 w-4" />
                    Telefondan paylaş
                  </Button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-gray-500">
                  QR kodu baskıya göndererek hediyelerinize ekleyin. Okutulduğunda {pageData.recipient_name} doğrudan
                  mesaj sayfasına yönlendirilir.
                </p>
              </CardContent>
            </Card>

          </div>

        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/templates" className="inline-flex">
            <Button
              variant="outline"
              className="gap-2 border-purple-200 bg-white/90 text-purple-600 hover:border-purple-300 hover:text-purple-700"
            >
              <Sparkles className="h-4 w-4" />
              Diğer şablonları keşfet
            </Button>
          </Link>
          <Link href="/" className="inline-flex">
            <Button variant="ghost" className="text-gray-600 hover:text-purple-600">
              Yeni bir mesaj oluştur
            </Button>
          </Link>
        </div>
      </div>

      <Dialog open={isVisualDialogOpen} onOpenChange={setIsVisualDialogOpen}>
        <DialogContent className="w-full h-[100dvh] sm:h-auto sm:w-[95vw] max-w-none sm:max-w-7xl max-h-[95vh] overflow-y-auto px-3 pt-3 pb-3 sm:px-6 sm:pt-6 sm:pb-6 m-0 sm:m-4 rounded-none sm:rounded-lg">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900">Görsel Olarak Paylaş</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ShareVisualGenerator
              shortId={shortId}
              recipientName={pageData.recipient_name}
              senderName={pageData.sender_name}
              templateTitle={pageData.template_title}
              templateAudience={pageData.template_audience}
              message={pageData.message}
              pageUrl={shareUrl}
              qrDataUrl={qrDataUrl || undefined}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

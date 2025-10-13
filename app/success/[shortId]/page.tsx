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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SocialShare } from '@/components/ui/social-share';
import { ShareVisualGenerator } from '@/components/share/share-visual-generator';

interface PersonalPageData {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  template_title: string;
  template_slug: string;
  template_audience: string;
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
        const response = await fetch(`/api/personal-pages/${shortId}`);
        if (!response.ok) {
          if (response.status === 404 && currentRetryCount < maxRetries) {
            // Page might not be created yet, retry after delay
            currentRetryCount++;
            setRetryCount(currentRetryCount);
            setTimeout(fetchPageData, retryDelay);
            return;
          }
          throw new Error('Sayfa bulunamadı');
        }
        const data = await response.json();
        setPageData(data);
        setLoading(false);
      } catch (err) {
        if (currentRetryCount < maxRetries) {
          // Retry on error (network issues, etc.)
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
    const urlToCopy = personalPageUrl || `https://gizlimesaj.com/m/${shortId}`;
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
    const urlToShare = personalPageUrl || `https://gizlimesaj.com/m/${shortId}`;

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
                <h3 className="text-2xl font-semibold text-gray-900">Sayfa bulunamadı</h3>
                <p className="text-sm text-gray-600">
                  {error || 'Aradığınız sayfa bulunamadı veya erişim süresi dolmuş olabilir.'}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/" className="inline-flex">
                  <Button className="gap-2">
                    Ana sayfaya dön
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
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
  const shareUrl = personalPageUrl || `https://gizlimesaj.com/m/${shortId}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50/60 to-indigo-50 px-4 pb-20 pt-16">
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
          <h1 className="mt-6 text-4xl font-bold text-gray-900 sm:text-5xl">
            Mesajınız hazır! 🎉
          </h1>
          <p className="mt-3 text-lg text-gray-600">
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

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <div className="space-y-6">
            <Card className="border-white/70 bg-white/85 backdrop-blur-sm shadow-xl shadow-purple-200/60">
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl text-gray-900">Mesaj özeti</CardTitle>
                <CardDescription className="text-gray-500">
                  Paylaşmadan önce bilgileri son kez kontrol edin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                    <dt className="text-xs uppercase tracking-[0.25em] text-purple-500">
                      Gönderen
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-gray-900">
                      {pageData.sender_name}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                    <dt className="text-xs uppercase tracking-[0.25em] text-rose-500">
                      Alıcı
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-gray-900">
                      {pageData.recipient_name}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <dt className="text-xs uppercase tracking-[0.25em] text-indigo-500">
                      Şablon
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-gray-900">
                      {pageData.template_title}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
                    <dt className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      Kısa bağlantı kodu
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-gray-900">
                      {shortId.toUpperCase()}
                    </dd>
                  </div>
                </dl>

                <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-inner shadow-purple-100/40">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                    Mesajdan bir parça
                  </p>
                  <p className="mt-3 max-h-40 overflow-y-auto text-base leading-relaxed text-gray-700">
                    {pageData.message}
                  </p>
                  <p className="mt-4 text-right text-sm font-medium text-gray-500">
                    — {pageData.sender_name}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/85 backdrop-blur-sm shadow-xl shadow-purple-200/60">
              <CardHeader className="pb-0">
                <CardTitle className="text-gray-900">Mesaj bağlantısı</CardTitle>
                <CardDescription className="text-gray-500">
                  Linki kopyalayın veya doğrudan paylaşın.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-700 shadow-inner shadow-purple-100/50">
                    <span className="truncate">{shareUrl}</span>
                    <span className="text-xs text-gray-400">Süre: {formattedExpiry}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="flex w-full items-center justify-center gap-2 border-purple-200 bg-white/90 text-purple-600 hover:border-purple-300 hover:text-purple-700 sm:w-auto"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? 'Kopyalandı' : 'Linki kopyala'}
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href={`/m/${shortId}`} className="inline-flex">
                    <Button className="w-full justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300/40">
                      <ExternalLink className="h-4 w-4" />
                      Sürprizi aç
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-purple-200 bg-white/90 text-purple-600 hover:border-purple-300 hover:text-purple-700"
                    onClick={handleNativeShare}
                    disabled={!shareUrl}
                  >
                    <Share2 className="h-4 w-4" />
                    Telefona gönder
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-white/70 bg-white/85 p-1 backdrop-blur-sm shadow-xl shadow-purple-200/60">
              <SocialShare
                url={shareUrl}
                title={shareTitle}
                description={shareDescription}
                recipientName={pageData.recipient_name}
                onShare={handleShare}
              />
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/85 p-6 backdrop-blur-sm shadow-xl shadow-purple-200/60">
              <ShareVisualGenerator
                shortId={shortId}
                recipientName={pageData.recipient_name}
                senderName={pageData.sender_name}
                templateTitle={pageData.template_title}
                message={pageData.message}
                pageUrl={shareUrl}
                qrDataUrl={qrDataUrl || undefined}
              />
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-white/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-purple-200/60">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  Paylaşılabilir QR kod
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Telefon kameraları ile anında açılabilen kare kod.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-3xl border border-purple-100 bg-white/90 p-4 shadow-inner shadow-purple-100/50">
                    {qrImageUrl ? (
                      <img
                        src={qrImageUrl}
                        alt="Gizli mesaj için QR kod"
                        className="h-56 w-56 rounded-2xl bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-purple-50 text-sm text-purple-500">
                        QR kod hazırlanıyor...
                      </div>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Kamerayı yönlendir
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={handleDownloadQR}
                    disabled={!qrImageUrl || isDownloadingQR}
                    className="w-full justify-center gap-2 bg-purple-600 text-white shadow-lg shadow-purple-300/50 hover:bg-purple-700"
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
                    className="w-full justify-center gap-2 border-purple-200 bg-white/90 text-purple-600 hover:border-purple-300 hover:text-purple-700"
                    onClick={handleNativeShare}
                    disabled={!shareUrl}
                  >
                    <Share2 className="h-4 w-4" />
                    Telefondan paylaş
                  </Button>
                </div>

                <p className="text-sm leading-relaxed text-gray-500">
                  QR kodu baskıya göndererek hediyelerinize ekleyin. Okutulduğunda {pageData.recipient_name} doğrudan
                  mesaj sayfasına yönlendirilir.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-purple-200/60">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-4">
                  <Clock className="h-10 w-10 text-purple-500" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-purple-600">
                      {timeRemainingMs > 0 ? 'Sürpriziniz yayında' : 'Süre dolmak üzere'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {timeRemainingMs > 0
                        ? `${formattedExpiry} tarihine kadar erişilebilir`
                        : 'Bu sayfayı mümkün olan en kısa sürede paylaşın'}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-inner shadow-purple-100/40">
                    • Bağlantıyı WhatsApp, SMS veya e-posta ile paylaşabilirsiniz.
                  </li>
                  <li className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-inner shadow-purple-100/40">
                    • QR kodu fiziksel kartlara ekleyerek deneyimi zenginleştirin.
                  </li>
                  <li className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-inner shadow-purple-100/40">
                    • Hesabınızdaki <strong className="font-semibold text-purple-600">Siparişlerim</strong> sekmesinden bu sayfaya her zaman ulaşabilirsiniz.
                  </li>
                </ul>
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
    </div>
  );
}

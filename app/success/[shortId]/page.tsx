'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ExternalLink, Clock, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SocialShare } from '@/components/ui/social-share';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPersonalPageUrl(`${window.location.origin}/m/${shortId}`);
    }
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
    try {
      await navigator.clipboard.writeText(personalPageUrl);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="text-center pt-8 pb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gizli mesajınız hazırlanıyor...
            </h3>
            <p className="text-gray-600 mb-4">
              Ödeme işleminiz tamamlandı. Sayfanız oluşturuluyor.
            </p>
            {retryCount > 0 && (
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Deneme {retryCount}/10</span>
              </div>
            )}
            <div className="mt-4 text-xs text-gray-400">
              Bu işlem birkaç saniye sürebilir...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="text-center pt-8 pb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Sayfa Bulunamadı</h3>
            <p className="text-gray-600 mb-6">
              {error || 'Aradığınız sayfa bulunamadı veya süresi dolmuş olabilir.'}
            </p>
            <Link href="/">
              <Button>Ana Sayfaya Dön</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const expiresAt = new Date(pageData.expires_at);
  const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-lg mx-auto pt-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Mesajınız Hazır! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Artık paylaşabilirsiniz
          </p>
        </div>

        {/* Main Info Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4">
              {/* Sender */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 font-medium">Gönderen</span>
                <span className="font-semibold text-gray-900">{pageData.sender_name}</span>
              </div>
              
              {/* Duration */}
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Süre</span>
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süresi dolmuş'}
                </span>
              </div>
              
              {/* URL */}
              <div className="border-t border-gray-100 pt-4">
                <span className="text-gray-500 font-medium block mb-3">Mesaj Linki</span>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 flex-1 truncate">{personalPageUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Section */}
        <div className="mb-6">
          <SocialShare
            url={personalPageUrl}
            title={`${pageData.sender_name} sana özel bir mesaj gönderdi!`}
            description={`${pageData.recipient_name} için hazırlanan özel mesajı görüntüle`}
            recipientName={pageData.recipient_name}
            onShare={handleShare}
          />
        </div>

        {/* Preview Button */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <Link href={`/m/${shortId}`}>
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Mesajı Görüntüle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <Link href="/" className="text-purple-600 hover:underline">
            Yeni bir mesaj oluştur →
          </Link>
        </div>
      </div>
    </div>
  );
}
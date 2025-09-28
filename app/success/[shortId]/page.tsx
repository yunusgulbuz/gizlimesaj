'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ExternalLink, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  const handleShare = (platform: string) => {
    // Track sharing analytics
    console.log(`Shared via ${platform}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center pt-6">
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
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Sayfa Bulunamadı</CardTitle>
            <CardDescription>
              {error || 'Aradığınız sayfa bulunamadı veya süresi dolmuş olabilir.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
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
      <div className="max-w-2xl mx-auto pt-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ödeme Başarılı! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Gizli mesajınız hazır ve paylaşıma açık
          </p>
        </div>

        {/* Page Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Mesaj Detayları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Şablon:</span>
                <p className="font-semibold">{pageData.template_title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Alıcı:</span>
                <p className="font-semibold">{pageData.recipient_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Gönderen:</span>
                <p className="font-semibold">{pageData.sender_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Süre:</span>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süresi dolmuş'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Section */}
        <SocialShare
          url={personalPageUrl}
          title={`${pageData.sender_name} sana özel bir mesaj gönderdi!`}
          description={`${pageData.recipient_name} için hazırlanan özel mesajı görüntüle`}
          recipientName={pageData.recipient_name}
          onShare={handleShare}
        />

        {/* Preview Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Mesajınızın nasıl göründüğünü merak ediyor musunuz?
              </p>
              <Link href={`/m/${shortId}`}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Mesajı Önizle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Mesajınız {expiresAt.toLocaleDateString('tr-TR')} tarihine kadar aktif kalacak.
          </p>
          <Link href="/" className="text-purple-600 hover:underline mt-2 inline-block">
            Yeni bir mesaj oluştur →
          </Link>
        </div>
      </div>
    </div>
  );
}
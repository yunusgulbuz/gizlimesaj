'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase-client';
import {
  Heart,
  ArrowLeft,
  Check,
  Sparkles,
  Star,
  Crown,
  Loader2,
  ShoppingCart,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

// UI config for icons and gradients
const UI_CONFIG: Record<string, { icon: any; gradient: string; features: string[] }> = {
  'credits-10': {
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'AI template oluşturma/düzenleme',
      'Sınırsız taslak saklama',
      'Generate + Refine aynı havuzdan',
      'Kredi asla bitmesin',
      'İstediğiniz zaman kullanın',
    ],
  },
  'credits-30': {
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'AI template oluşturma/düzenleme',
      'Sınırsız taslak saklama',
      'Generate + Refine aynı havuzdan',
      'Kredi asla bitmesin',
      'İstediğiniz zaman kullanın',
      '33% daha avantajlı!',
    ],
  },
  'credits-100': {
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    features: [
      'AI template oluşturma/düzenleme',
      'Sınırsız taslak saklama',
      'Generate + Refine aynı havuzdan',
      'Kredi asla bitmesin',
      'İstediğiniz zaman kullanın',
      '50% daha avantajlı!',
      'Öncelikli AI üretimi',
    ],
  },
};

export default function CreditsCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package');
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [packageInfo, setPackageInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/credits/checkout?package=${packageId}`);
        return;
      }

      setUser(user);

      // Fetch package info from database
      if (packageId) {
        const { data: pkg } = await supabase
          .from('ai_credit_packages')
          .select('*')
          .eq('id', packageId)
          .eq('is_active', true)
          .single();

        if (pkg) {
          const uiConfig = UI_CONFIG[packageId] || UI_CONFIG['credits-10'];
          const features = uiConfig.features.map(f =>
            f.replace(/\d+/, pkg.credits.toString())
          );

          setPackageInfo({
            name: pkg.name,
            subtitle: `${pkg.credits} AI Kullanım Hakkı`,
            credits: pkg.credits,
            price: parseFloat(pkg.price).toFixed(0),
            icon: uiConfig.icon,
            gradient: uiConfig.gradient,
            features,
          });
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, supabase, packageId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!packageId || !packageInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              Geçersiz Paket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Seçilen kredi paketi bulunamadı.</p>
            <Button asChild className="w-full">
              <Link href="/pricing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Paketlere Dön
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = packageInfo.icon;
  const priceNum = parseFloat(packageInfo.price);
  const tax = priceNum * 0.20; // 20% KDV
  const total = priceNum + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Generate unique short ID
      const shortId = `CRED${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      // Create order for credit purchase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          payment_provider: 'paytr',
          total_try: total,
          short_id: shortId,
          buyer_email: user.email || '',
          sender_name: user.email?.split('@')[0] || 'Kullanıcı',
          recipient_name: packageInfo.name,
          message: `${packageInfo.credits} AI Kredisi Satın Alımı`,
          text_fields: {
            package_id: packageId,
            package_name: packageInfo.name,
            credits: packageInfo.credits,
            base_price: priceNum,
            tax: tax,
            order_type: 'credit_purchase',
          },
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error('Order creation error:', orderError);
        throw new Error('Sipariş oluşturulamadı');
      }

      // Redirect to payment page
      router.push(`/payment/${order.id}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-rose-100/70 bg-white/90 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                birmesajmutluluk
              </span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pricing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Paketlere Dön
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <ShoppingCart className="h-4 w-4" />
            <span>Ödeme Adımı</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Kredi Paketi Satın Al
          </h1>
          <p className="text-gray-600">
            Seçtiğiniz paketi onaylayın ve güvenli ödemeye geçin
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Package Details */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${packageInfo.gradient} flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">{packageInfo.name}</CardTitle>
              <CardDescription className="text-base">
                {packageInfo.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ₺{packageInfo.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Tek seferlik ödeme • {packageInfo.credits} AI kredisi
                </p>
              </div>

              <ul className="space-y-3">
                {packageInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{packageInfo.name} Paketi</h4>
                      <p className="text-xs text-gray-600">
                        {packageInfo.credits} AI Kredisi
                      </p>
                    </div>
                    <p className="font-medium text-sm">₺{packageInfo.price}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ara Toplam</span>
                    <span>₺{priceNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>KDV (%20)</span>
                    <span>₺{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Toplam</span>
                    <span className="text-green-600">₺{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Ödemeye Geç
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Security Info */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Güvenli Ödeme
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✅ 256-bit SSL şifreleme</li>
                      <li>✅ Kredi kartı bilgileriniz saklanmaz</li>
                      <li>✅ Krediler asla bitmez</li>
                      <li>✅ Anında hesabınıza tanımlanır</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

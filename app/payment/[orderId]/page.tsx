import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import PaymentForm from './payment-form';

interface PaymentPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
}

async function getOrder(orderId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      templates (
        title,
        preview_url
      )
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    console.error('Order lookup error:', error);
    return null;
  }

  return order;
}

export async function generateMetadata({ params }: PaymentPageProps) {
  const { orderId } = await params;
  
  // Eğer orderId "fail" veya "success" ise, metadata oluşturmayı atla
  if (orderId === 'fail' || orderId === 'success') {
    return generateSEOMetadata({
      title: 'Ödeme İşlemi',
      description: 'Ödeme işlemi sonucu',
    });
  }

  const order = await getOrder(orderId);
  
  if (!order) {
    return generateSEOMetadata({
      title: 'Sipariş Bulunamadı',
      description: 'Aradığınız sipariş bulunamadı.',
    });
  }

  return generateSEOMetadata({
    title: `Ödeme - ${order.templates?.title || 'Gizli Mesaj'}`,
    description: `${order.templates?.title || 'Gizli Mesaj'} için ödeme sayfası`,
  });
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { orderId } = await params;
  const { status, error } = await searchParams;

  // Eğer orderId "fail" ise, fail sayfasına yönlendir
  if (orderId === 'fail') {
    return notFound(); // Bu durumda /payment/fail/page.tsx devreye girer
  }

  // Eğer orderId "success" ise, success sayfasına yönlendir  
  if (orderId === 'success') {
    return notFound(); // Bu durumda /payment/success/page.tsx devreye girer
  }
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  // Handle payment success status from URL
  if (status === 'success' && order.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h1>
          <p className="text-gray-600 mb-6">
            Ödemeniz başarıyla tamamlandı. Gizli mesajınız hazırlanıyor...
          </p>
          <a
            href={`/m/${order.short_id}`}
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Mesajı Görüntüle
          </a>
        </div>
      </div>
    );
  }

  // Handle payment failure status from URL
  if (status === 'failed' || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarısız</h1>
          <p className="text-gray-600 mb-6">
            {error ? `Ödeme hatası: ${decodeURIComponent(error)}` : 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.'}
          </p>
          <div className="space-y-3">
            <Link
              href={`/payment/${orderId}`}
              className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Tekrar Dene
            </Link>
            <Link
              href="/templates"
              className="block text-gray-600 hover:text-gray-800 transition-colors"
            >
              Şablonlara Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if order is already completed
  if (order.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Tamamlandı!</h1>
          <p className="text-gray-600 mb-6">
            Bu sipariş zaten ödenmiş durumda. Gizli mesajınız hazır!
          </p>
          <a
            href={`/m/${order.short_id}`}
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Mesajı Görüntüle
          </a>
        </div>
      </div>
    );
  }

  // Check if order is expired or failed
  if (order.status === 'failed' || order.status === 'cancelled') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {order.status === 'failed' ? 'Ödeme Başarısız' : 'Ödeme İptal Edildi'}
          </h1>
          <p className="text-gray-600 mb-6">
            {order.status === 'failed' 
              ? 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.'
              : 'Ödeme işlemi iptal edildi.'
            }
          </p>
          <Link
            href="/templates"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Şablonlara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ödeme Sayfası
            </h1>
            <p className="text-gray-600 text-lg">
              Gizli mesajınızı oluşturmak için ödemeyi tamamlayın
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Şablon:</span>
                  <span className="font-medium">{order.templates.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Alıcı:</span>
                  <span className="font-medium">{order.recipient_name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Gönderen:</span>
                  <span className="font-medium">{order.sender_name}</span>
                </div>
                
                {order.special_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Özel Tarih:</span>
                    <span className="font-medium">
                      {new Date(order.special_date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Geçerlilik:</span>
                  <span className="font-medium">
                    {new Date(order.expires_at).toLocaleDateString('tr-TR')} tarihine kadar
                  </span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Toplam:</span>
                  <span className="text-purple-600">₺{order.templates.price}</span>
                </div>
              </div>

              {/* Message Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Mesaj Önizleme:</h3>
                <p className="text-gray-700 text-sm italic">
                  &quot;{order.message.length > 100 ? order.message.substring(0, 100) + '...' : order.message}&quot;
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
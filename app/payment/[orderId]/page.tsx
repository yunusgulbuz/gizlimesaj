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
  const order = await getOrder(orderId);
  
  if (!order) {
    return generateSEOMetadata({
      title: 'Ödeme Bulunamadı',
      description: 'Aradığınız ödeme sayfası bulunamadı.'
    });
  }

  return generateSEOMetadata({
    title: `Ödeme - ${order.templates.title}`,
    description: `${order.recipient_name} için ${order.templates.title} şablonu ile gizli mesaj ödeme sayfası.`
  });
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { orderId } = await params;
  const { status, error } = await searchParams;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Hazırlanıyor</h1>
        <p className="text-gray-600 mb-6">
          Sadece ödeme sayfasına yönlendiriliyor...
        </p>
        <PaymentForm order={order} />
      </div>
    </div>
  );
}
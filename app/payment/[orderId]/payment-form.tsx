'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  order: {
    id: string;
    short_id: string;
    templates: {
      title: string;
      price: number;
    };
  };
}

interface PaynkolayFormData {
  sx: string;
  successUrl: string;
  failUrl: string;
  amount: string;
  clientRefCode: string;
  use3D: string;
  rnd: string;
  agentCode: string;
  transactionType: string;
  cardHolderIP: string;
  hashDataV2: string;
}

export default function PaymentForm({ order }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaynkolayFormData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call our API to create payment and get Paynkolay form data
        const response = await fetch('/api/payments/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            templateId: 'existing', // Since order already exists
            recipientName: 'existing',
            senderName: 'existing',
            message: 'existing',
            specialDate: null,
            duration: 30
          }),
        });

        if (!response.ok) {
          throw new Error('Ödeme başlatılamadı');
        }

        const result = await response.json();
        
        if (result.success && result.paymentData) {
          setPaymentData(result.paymentData);
          // Auto-submit form after a short delay to show loading state
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.submit();
            }
          }, 1500);
        } else {
          throw new Error(result.error || 'Ödeme verileri alınamadı');
        }

      } catch (error) {
        console.error('Payment initialization error:', error);
        setError(error instanceof Error ? error.message : 'Ödeme başlatılamadı');
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [order.id]);

  return (
    <Card className="bg-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Ödeme İşlemi</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Ödeme sayfası hazırlanıyor...</p>
          </div>
        )}

        {paymentData && (
          <>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-blue-800 font-medium">Paynkolay'a yönlendiriliyor...</span>
              </div>
              <p className="text-blue-700 text-sm">
                Güvenli ödeme sayfasına otomatik olarak yönlendirileceksiniz.
              </p>
            </div>

            {/* Hidden Paynkolay Form */}
            <form
              ref={formRef}
              method="post"
              action={process.env.NODE_ENV === 'production' 
                ? 'https://paynkolay.nkolayislem.com.tr/Vpos'
                : 'https://paynkolaytest.nkolayislem.com.tr/Vpos'
              }
              style={{ display: 'none' }}
            >
              <input type="hidden" name="sx" value={paymentData.sx} />
              <input type="hidden" name="successUrl" value={paymentData.successUrl} />
              <input type="hidden" name="failUrl" value={paymentData.failUrl} />
              <input type="hidden" name="amount" value={paymentData.amount} />
              <input type="hidden" name="clientRefCode" value={paymentData.clientRefCode} />
              <input type="hidden" name="use3D" value={paymentData.use3D} />
              <input type="hidden" name="rnd" value={paymentData.rnd} />
              <input type="hidden" name="agentCode" value={paymentData.agentCode} />
              <input type="hidden" name="transactionType" value={paymentData.transactionType} />
              <input type="hidden" name="cardHolderIP" value={paymentData.cardHolderIP} />
              <input type="hidden" name="hashDataV2" value={paymentData.hashDataV2} />
            </form>
          </>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
          <Lock className="h-4 w-4" />
          <span>Ödemeniz SSL ile güvence altındadır</span>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Test Kartı Bilgileri:</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Kart No:</strong> 4242 4242 4242 4242</p>
            <p><strong>Son Kullanma:</strong> 12/25</p>
            <p><strong>CVV:</strong> 123</p>
            <p className="text-xs mt-2 text-green-600">
              * Test ortamında bu kart bilgilerini kullanabilirsiniz.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
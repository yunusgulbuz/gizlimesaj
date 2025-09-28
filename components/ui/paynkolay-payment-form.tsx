'use client';

import { useEffect, useRef } from 'react';
import { PaynkolayFormData } from '@/lib/payments/paynkolay';

interface PaynkolayPaymentFormProps {
  formData: PaynkolayFormData;
  paymentUrl: string;
  onSubmit?: () => void;
  autoSubmit?: boolean;
}

export function PaynkolayPaymentForm({ 
  formData, 
  paymentUrl, 
  onSubmit,
  autoSubmit = true 
}: PaynkolayPaymentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoSubmit && formRef.current) {
      // Auto-submit the form after a short delay
      const timer = setTimeout(() => {
        if (onSubmit) {
          onSubmit();
        }
        formRef.current?.submit();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoSubmit, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    if (onSubmit) {
      onSubmit();
    }
    // Form will submit naturally to the payment provider
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ödeme Sayfasına Yönlendiriliyorsunuz
          </h2>
          <p className="text-gray-600 text-sm">
            Güvenli ödeme için Paynkolay sayfasına yönlendirileceksiniz...
          </p>
        </div>

        <form
          ref={formRef}
          method="POST"
          action={paymentUrl}
          onSubmit={handleSubmit}
          className="hidden"
        >
          {/* Required fields */}
          <input type="hidden" name="sx" value={formData.sx} />
          <input type="hidden" name="amount" value={formData.amount} />
          <input type="hidden" name="clientRefCode" value={formData.clientRefCode} />
          <input type="hidden" name="successUrl" value={formData.successUrl} />
          <input type="hidden" name="failUrl" value={formData.failUrl} />
          <input type="hidden" name="rnd" value={formData.rnd} />
          <input type="hidden" name="use3D" value={formData.use3D} />
          <input type="hidden" name="transactionType" value={formData.transactionType} />
          <input type="hidden" name="hashData" value={formData.hashData} />
          
          {/* Optional fields */}
          {formData.language && (
            <input type="hidden" name="language" value={formData.language} />
          )}
          {formData.second && (
            <input type="hidden" name="second" value={formData.second} />
          )}
          {formData.cardcampaign && (
            <input type="hidden" name="cardcampaign" value={formData.cardcampaign} />
          )}
          {formData.bin && (
            <input type="hidden" name="bin" value={formData.bin} />
          )}
          {formData.detail && (
            <input type="hidden" name="detail" value={formData.detail} />
          )}
          {formData.agentCode && (
            <input type="hidden" name="agentCode" value={formData.agentCode} />
          )}
          {formData.instalments && (
            <input type="hidden" name="instalments" value={formData.instalments} />
          )}
          {formData.MerchantCustomerNo && (
            <input type="hidden" name="MerchantCustomerNo" value={formData.MerchantCustomerNo} />
          )}
          {formData.customerKey && (
            <input type="hidden" name="customerKey" value={formData.customerKey} />
          )}
          {formData.ECOMM_PLATFORM && (
            <input type="hidden" name="ECOMM_PLATFORM" value={formData.ECOMM_PLATFORM} />
          )}
          {formData.pIsCommissionPaidByCustomer && (
            <input type="hidden" name="pIsCommissionPaidByCustomer" value={formData.pIsCommissionPaidByCustomer} />
          )}
          {formData.currencyCode && (
            <input type="hidden" name="currencyCode" value={formData.currencyCode} />
          )}
          {formData.cardHolderIP && (
            <input type="hidden" name="cardHolderIP" value={formData.cardHolderIP} />
          )}
        </form>

        {!autoSubmit && (
          <button
            type="button"
            onClick={() => formRef.current?.submit()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Ödeme Sayfasına Git
          </button>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>Bu işlem güvenli SSL bağlantısı ile korunmaktadır.</p>
        </div>
      </div>
    </div>
  );
}
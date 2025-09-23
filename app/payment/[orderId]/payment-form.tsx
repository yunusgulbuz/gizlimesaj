'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

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

export default function PaymentForm({ order }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      // In a real implementation, you would integrate with a payment provider
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate webhook call to complete the order
      const webhookResponse = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: order.id,
          status: 'success',
          payment_id: `pay_${Date.now()}`,
          amount: order.templates.price,
          currency: 'TRY',
          provider: 'stripe'
        }),
      });

      if (webhookResponse.ok) {
        // Redirect to success page
        window.location.href = `/m/${order.short_id}`;
      } else {
        throw new Error('Payment processing failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Ödeme Bilgileri</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-posta Adresi</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="cardHolder">Kart Sahibinin Adı</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              placeholder="Ad Soyad"
              required
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Kart Numarası</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  İşleniyor...
                </div>
              ) : (
                `₺${order.templates.price} Öde`
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
            <Lock className="h-4 w-4" />
            <span>Ödemeniz SSL ile güvence altındadır</span>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Test Kartı Bilgileri:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Kart No:</strong> 4242 4242 4242 4242</p>
            <p><strong>Son Kullanma:</strong> 12/25</p>
            <p><strong>CVV:</strong> 123</p>
            <p className="text-xs mt-2 text-blue-600">
              * Bu demo amaçlı test kartıdır. Gerçek ödeme yapılmaz.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
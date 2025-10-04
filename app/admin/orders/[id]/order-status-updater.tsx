'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatus } from './actions';
import { Loader2 } from 'lucide-react';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: 'pending' | 'completed' | 'failed' | 'canceled';
}

const statusOptions = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'failed', label: 'Başarısız' },
  { value: 'canceled', label: 'İptal Edildi' },
];

export default function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdateStatus = async () => {
    if (status === currentStatus) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateOrderStatus(orderId, status);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Durum güncellenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Sipariş Durumu</p>
        <div className="flex gap-2">
          <Select value={status} onValueChange={(value: any) => setStatus(value)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleUpdateStatus}
            disabled={isLoading || status === currentStatus}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Güncelle
          </Button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

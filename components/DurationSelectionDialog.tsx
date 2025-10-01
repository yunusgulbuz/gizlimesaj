'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Duration {
  id: number;
  label: string;
  days: number;
}

interface TemplatePricing {
  id: number;
  template_id: string;
  duration_id: number;
  price_try: string;
  is_active: boolean;
}

interface DurationSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  durations: Duration[];
  templatePricing: TemplatePricing[];
  onSelect: (durationId: number, price: string) => void;
}

export function DurationSelectionDialog({
  open,
  onOpenChange,
  durations,
  templatePricing,
  onSelect,
}: DurationSelectionDialogProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const getPriceForDuration = (durationId: number): string => {
    const pricing = templatePricing.find((p) => p.duration_id === durationId);
    return pricing ? pricing.price_try : '0';
  };

  const handleSelect = () => {
    if (selectedDuration) {
      const price = getPriceForDuration(selectedDuration);
      onSelect(selectedDuration, price);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Süre Seçimi</DialogTitle>
          <DialogDescription>
            Mesajınızın ne kadar süre aktif kalacağını seçin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {durations.map((duration) => {
            const price = getPriceForDuration(duration.id);
            const isSelected = selectedDuration === duration.id;

            return (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:border-pink-300 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-medium text-gray-900">
                    {duration.label}
                  </span>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  ₺{price}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedDuration}
            className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
          >
            Devam Et
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

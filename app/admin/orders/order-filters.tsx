'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  const updateFilters = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams();

    if (newSearch) {
      params.set('search', newSearch);
    }

    if (newStatus && newStatus !== 'all') {
      params.set('status', newStatus);
    }

    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`);
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilters(value, status);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    updateFilters(search, value);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="İsim ile ara..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            disabled={isPending}
          />
        </div>
      </div>
      <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Durum seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          <SelectItem value="pending">Bekliyor</SelectItem>
          <SelectItem value="completed">Tamamlandı</SelectItem>
          <SelectItem value="failed">Başarısız</SelectItem>
          <SelectItem value="canceled">İptal Edildi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

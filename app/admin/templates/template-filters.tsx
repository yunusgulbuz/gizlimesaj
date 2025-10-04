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
import { Search } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function TemplateFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [audience, setAudience] = useState(searchParams.get('audience') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  const updateFilters = (newSearch: string, newAudience: string, newStatus: string) => {
    const params = new URLSearchParams();

    if (newSearch) {
      params.set('search', newSearch);
    }

    if (newAudience && newAudience !== 'all') {
      params.set('audience', newAudience);
    }

    if (newStatus && newStatus !== 'all') {
      params.set('status', newStatus);
    }

    startTransition(() => {
      router.push(`/admin/templates?${params.toString()}`);
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilters(value, audience, status);
  };

  const handleAudienceChange = (value: string) => {
    setAudience(value);
    updateFilters(search, value, status);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    updateFilters(search, audience, value);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Şablon adı ile ara..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            disabled={isPending}
          />
        </div>
      </div>
      <Select value={audience} onValueChange={handleAudienceChange} disabled={isPending}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Hedef kitle seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Hedef Kitleler</SelectItem>
          <SelectItem value="teen">Genç</SelectItem>
          <SelectItem value="adult">Yetişkin</SelectItem>
          <SelectItem value="classic">Klasik</SelectItem>
          <SelectItem value="fun">Eğlenceli</SelectItem>
          <SelectItem value="elegant">Zarif</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Durum seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="inactive">Pasif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

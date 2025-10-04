import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileQuestion
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  preferred_style: string | null;
  budget_range: string | null;
  deadline: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
}

async function getCustomRequests(): Promise<CustomRequest[]> {
  const supabase = await createAuthSupabaseClient();

  const { data: requests, error } = await supabase
    .from('custom_template_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom requests:', error);
    return [];
  }

  return requests || [];
}

const statusConfig = {
  pending: { label: 'Bekliyor', className: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'İşlemde', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Tamamlandı', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Reddedildi', className: 'bg-red-100 text-red-800' }
};

function RequestsTable({ requests }: { requests: CustomRequest[] }) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Talep bulunamadı</h3>
          <p className="text-muted-foreground text-center">
            Henüz hiç özel şablon talebi alınmamış.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{request.name}</h3>
                    <Badge className={statusConfig[request.status].className}>
                      {statusConfig[request.status].label}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${request.email}`} className="hover:underline">
                        {request.email}
                      </a>
                    </div>
                    {request.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${request.phone}`} className="hover:underline">
                          {request.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(request.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{request.message}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                {request.preferred_style && (
                  <div>
                    <p className="text-muted-foreground">Tercih Edilen Stil</p>
                    <p className="font-medium">{request.preferred_style}</p>
                  </div>
                )}
                {request.budget_range && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Bütçe</p>
                      <p className="font-medium">{request.budget_range}</p>
                    </div>
                  </div>
                )}
                {request.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Son Tarih</p>
                      <p className="font-medium">
                        {new Date(request.deadline).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminRequestsPage() {
  const requests = await getCustomRequests();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Özel Talepler' }
  ];

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Özel Şablon Talepleri</h1>
            <p className="text-muted-foreground">
              {requests.length} talep ({pendingCount} bekliyor)
            </p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <RequestsTable requests={requests} />
      </Suspense>
    </div>
  );
}

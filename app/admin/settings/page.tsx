import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Mail,
  CreditCard,
  Globe
} from 'lucide-react';

export default function AdminSettingsPage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Ayarlar' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center gap-4 mt-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ayarlar</h1>
          <p className="text-muted-foreground">Site ve uygulama ayarları</p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* Site Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Ayarları
            </CardTitle>
            <CardDescription>Genel site ayarlarını yapılandırın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Adı</Label>
              <Input
                id="site_name"
                defaultValue="Gizli Mesaj"
                placeholder="Site adını girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_url">Site URL</Label>
              <Input
                id="site_url"
                type="url"
                defaultValue="https://gizlimesaj.com"
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_email">Destek Email</Label>
              <Input
                id="support_email"
                type="email"
                defaultValue="destek@gizlimesaj.com"
                placeholder="destek@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Ayarları
            </CardTitle>
            <CardDescription>Email bildirim ayarlarını yapılandırın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enable_email_notifications"
                defaultChecked
                className="rounded"
              />
              <Label htmlFor="enable_email_notifications">
                Email bildirimleri aktif
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input
                id="smtp_host"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_port">SMTP Port</Label>
              <Input
                id="smtp_port"
                type="number"
                placeholder="587"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Ödeme Ayarları
            </CardTitle>
            <CardDescription>Ödeme sağlayıcı ayarlarını yapılandırın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment_provider">Ödeme Sağlayıcı</Label>
              <select
                id="payment_provider"
                className="w-full border rounded-md p-2"
                defaultValue="iyzico"
              >
                <option value="iyzico">Iyzico</option>
                <option value="stripe">Stripe</option>
                <option value="paynkolay">Paynkolay</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                placeholder="API anahtarınızı girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret_key">Secret Key</Label>
              <Input
                id="secret_key"
                type="password"
                placeholder="Secret anahtarınızı girin"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Ayarları Kaydet
          </Button>
        </div>

        {/* Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>Not:</strong> Ayarlar fonksiyonu şu anda placeholder olarak gösterilmektedir.
              Gerçek ayar yönetimi için bir veritabanı tablosu ve server action implementasyonu gereklidir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

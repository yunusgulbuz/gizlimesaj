'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PasswordPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (formData.newPassword.length < 6) {
        toast.error('Şifre en az 6 karakter olmalıdır');
        setIsSaving(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Şifreler eşleşmiyor');
        setIsSaving(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      toast.success('Şifreniz başarıyla güncellendi');
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Şifre güncellenemedi');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Şifre Değiştir</h1>
        <p className="mt-2 text-gray-600">Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Yeni Şifre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="En az 6 karakter"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium">Güvenli şifre önerileri:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-blue-800">
                    <li>En az 8 karakter kullanın</li>
                    <li>Büyük ve küçük harf karışımı kullanın</li>
                    <li>Rakam ve özel karakterler ekleyin</li>
                    <li>Tahmin edilmesi kolay şifrelerden kaçının</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-rose-500 to-purple-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Şifreyi Güncelle
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generatePersonalPageMetadata } from '@/lib/seo';

interface PersonalPageData {
  id: string;
  short_id: string;
  recipient_name: string;
  template_title: string;
  template_preview_url: string | null;
  duration_days: number;
  is_active: boolean;
}

async function getPersonalPageData(shortId: string): Promise<PersonalPageData | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('personal_pages')
    .select(`
      id,
      short_id,
      recipient_name,
      duration_days,
      is_active,
      templates!inner (
        title,
        preview_url
      )
    `)
    .eq('short_id', shortId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    short_id: data.short_id,
    recipient_name: data.recipient_name,
    template_title: (data.templates as any)?.title || 'Özel Mesaj',
    template_preview_url: (data.templates as any)?.preview_url || null,
    duration_days: data.duration_days,
    is_active: data.is_active
  };
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ shortId: string }>
}): Promise<Metadata> {
  const { shortId } = await params;
  const personalPageData = await getPersonalPageData(shortId);

  if (!personalPageData || !personalPageData.is_active) {
    return {
      title: 'Mesaj Bulunamadı',
      description: 'Bu mesaj artık mevcut değil.',
    };
  }

  return generatePersonalPageMetadata(
    personalPageData.recipient_name,
    personalPageData.duration_days,
    personalPageData.template_title,
    personalPageData.template_preview_url || undefined
  );
}

export default function PersonalPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
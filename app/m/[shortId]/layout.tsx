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
  text_fields?: {
    sharePreviewTitle?: string;
    sharePreviewDescription?: string;
    sharePreviewSiteName?: string;
    sharePreviewImage?: string;
  };
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
      text_fields,
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
    is_active: data.is_active,
    text_fields: data.text_fields || {}
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
      title: 'birmesajmutluluk',
      description: 'Bu mesaj artık mevcut değil.',
    };
  }

  // Check if custom share preview is set
  const customTitle = personalPageData.text_fields?.sharePreviewTitle;
  const customDescription = personalPageData.text_fields?.sharePreviewDescription;
  const customSiteName = personalPageData.text_fields?.sharePreviewSiteName;
  const customImage = personalPageData.text_fields?.sharePreviewImage;

  // If custom preview data exists, use it
  if (customTitle && customDescription) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birmesajmutluluk.com';
    const fullUrl = `${siteUrl}/m/${shortId}`;
    const imageUrl = customImage || personalPageData.template_preview_url || `${siteUrl}/og-image.jpg`;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;

    return {
      title: customTitle,
      description: customDescription,
      openGraph: {
        title: customTitle,
        description: customDescription,
        url: fullUrl,
        siteName: customSiteName || 'birmesajmutluluk',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: customTitle,
          },
        ],
        locale: 'tr_TR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: customTitle,
        description: customDescription,
        images: [fullImageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: fullUrl,
      },
    };
  }

  // Otherwise, use default metadata
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
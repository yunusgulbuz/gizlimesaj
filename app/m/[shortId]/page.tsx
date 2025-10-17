import type { Metadata } from 'next';
import { unstable_noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { generatePersonalPageMetadata } from '@/lib/seo';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-service-role';
import { PersonalMessagePageClient } from './client-page';
import type { PersonalPageData } from './types';

interface SupabasePersonalPage {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  text_fields: Record<string, string> | null;
  bg_audio_url: string | null;
  design_style: PersonalPageData['design_style'] | null;
  expires_at: string;
  duration_days: number | null;
  special_date: string | null;
  is_active: boolean;
  share_preview_meta: PersonalPageData['share_preview_meta'];
  templates: {
    title: string | null;
    slug: string | null;
    audience: string | string[] | null;
    preview_url: string | null;
    bg_audio_url: string | null;
  } | null;
  orders: {
    text_fields: Record<string, string> | null;
    design_style: PersonalPageData['design_style'] | null;
    bg_audio_url: string | null;
  } | null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchPersonalPage(shortId: string): Promise<PersonalPageData | null> {
  const supabase = createServiceRoleSupabaseClient();

  const { data, error } = await supabase
    .from('personal_pages')
    .select(
      `
        id,
        short_id,
        recipient_name,
        sender_name,
        message,
        text_fields,
        bg_audio_url,
        design_style,
        expires_at,
        duration_days,
        special_date,
        is_active,
        share_preview_meta,
        templates (
          title,
          slug,
          audience,
          preview_url,
          bg_audio_url
        ),
        orders (
          text_fields,
          design_style,
          bg_audio_url
        )
      `
    )
    .eq('short_id', shortId)
    .single<SupabasePersonalPage>();

  if (error || !data) {
    console.error('Personal page fetch error', error);
    return null;
  }

  const template = data.templates;
  const order = data.orders;

  return {
    id: data.id,
    short_id: data.short_id,
    recipient_name: data.recipient_name,
    sender_name: data.sender_name,
    message: data.message,
    template_title: template?.title || 'Gizli Mesaj',
    template_slug: template?.slug || 'default',
    template_audience: template?.audience || [],
    template_preview_url: template?.preview_url || null,
    template_bg_audio_url:
      order?.bg_audio_url || data.bg_audio_url || template?.bg_audio_url || null,
    bg_audio_url: data.bg_audio_url,
    design_style: (order?.design_style || data.design_style || 'modern') as PersonalPageData['design_style'],
    text_fields: {
      ...(data.text_fields || {}),
      ...(order?.text_fields || {}),
    },
    expires_at: data.expires_at,
    special_date: data.special_date,
    is_active: data.is_active,
    duration_days: data.duration_days ?? undefined,
    share_preview_meta: data.share_preview_meta || null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { shortId: string };
}): Promise<Metadata> {
  unstable_noStore();
  const { shortId } = params;
  const personalPage = await fetchPersonalPage(shortId);

  if (!personalPage || !personalPage.is_active) {
    return {
      title: 'birmesajmutluluk',
      description: 'Bu mesaj artık mevcut değil.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birmesajmutluluk.com';
  const shareMeta = personalPage.share_preview_meta;

  if (shareMeta?.title && shareMeta.description) {
    const fullUrl = `${siteUrl}/m/${shortId}`;
    const imageUrl =
      shareMeta.image || personalPage.template_preview_url || `${siteUrl}/og-image.jpg`;
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${siteUrl}${imageUrl}`;

    return {
      title: shareMeta.title,
      description: shareMeta.description,
      metadataBase: new URL(siteUrl),
      openGraph: {
        title: shareMeta.title,
        description: shareMeta.description,
        url: fullUrl,
        siteName: shareMeta.siteName || 'birmesajmutluluk',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: shareMeta.title,
          },
        ],
        locale: 'tr_TR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: shareMeta.title,
        description: shareMeta.description,
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

  return generatePersonalPageMetadata(
    personalPage.recipient_name,
    personalPage.duration_days ?? 0,
    personalPage.template_title,
    personalPage.template_preview_url || undefined
  );
}

export default async function PersonalMessagePage({
  params,
}: {
  params: { shortId: string };
}) {
  unstable_noStore();
  const { shortId } = params;
  const personalPage = await fetchPersonalPage(shortId);

  if (!personalPage) {
    notFound();
  }

  return (
    <PersonalMessagePageClient
      shortId={shortId}
      initialPage={personalPage}
    />
  );
}

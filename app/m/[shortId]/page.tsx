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
  special_date: string | null;
  is_active: boolean;
  share_preview_meta: PersonalPageData['share_preview_meta'];
  ai_template_code: string | null;
  templates: {
    title: string | null;
    slug: string | null;
    audience: string | string[] | null;
    preview_url: string | null;
  } | null;
  orders: {
    text_fields: Record<string, string> | null;
    design_style: PersonalPageData['design_style'] | null;
    bg_audio_url: string | null;
    ai_template_id: string | null;
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
        special_date,
        is_active,
        share_preview_meta,
        ai_template_code,
        templates:template_id (
          title,
          slug,
          audience,
          preview_url
        ),
        orders:order_id (
          text_fields,
          design_style,
          bg_audio_url,
          ai_template_id
        )
      `
    )
    .eq('short_id', shortId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error('Personal page fetch error:', {
      error,
      errorMessage: error?.message,
      errorDetails: error?.details,
      errorHint: error?.hint,
      errorCode: error?.code,
      hasData: !!data,
      shortId
    });
    return null;
  }

  const typedData = data as unknown as SupabasePersonalPage;

  const template = typedData.templates;
  const order = typedData.orders;

  // If ai_template_code is missing but order has ai_template_id, fetch it
  let aiTemplateCode = typedData.ai_template_code;
  if (!aiTemplateCode && order?.ai_template_id) {
    const { data: aiTemplate } = await supabase
      .from('ai_generated_templates')
      .select('template_code')
      .eq('id', order.ai_template_id)
      .single();

    if (aiTemplate) {
      aiTemplateCode = aiTemplate.template_code;
    }
  }

  return {
    id: typedData.id,
    short_id: typedData.short_id,
    recipient_name: typedData.recipient_name,
    sender_name: typedData.sender_name,
    message: typedData.message,
    template_title: template?.title || 'Gizli Mesaj',
    template_slug: template?.slug || 'default',
    template_audience: template?.audience || [],
    template_preview_url: template?.preview_url || null,
    template_bg_audio_url:
      order?.bg_audio_url || typedData.bg_audio_url || null,
    bg_audio_url: typedData.bg_audio_url,
    design_style: (order?.design_style || typedData.design_style || 'modern') as PersonalPageData['design_style'],
    text_fields: {
      ...(typedData.text_fields || {}),
      ...(order?.text_fields || {}),
    },
    expires_at: typedData.expires_at,
    special_date: typedData.special_date,
    is_active: typedData.is_active,
    share_preview_meta: typedData.share_preview_meta || null,
    ai_template_code: aiTemplateCode,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shortId: string }>;
}): Promise<Metadata> {
  unstable_noStore();
  const { shortId } = await params;
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
    7,
    personalPage.template_title,
    personalPage.template_preview_url || undefined
  );
}

export default async function PersonalMessagePage({
  params,
}: {
  params: Promise<{ shortId: string }>;
}) {
  unstable_noStore();
  const { shortId } = await params;
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

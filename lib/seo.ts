import { Metadata } from 'next'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export function generateMetadata({
  title = 'Gizli Mesaj - Kişiselleştirilmiş Mesaj Sayfaları',
  description = 'Sevdiklerinize özel mesajlar oluşturun. Romantik, eğlenceli ve unutulmaz anlar için kişiselleştirilmiş sayfa deneyimi.',
  image = '/og-image.jpg',
  url,
  type = 'website'
}: SEOProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gizlimesaj.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Gizli Mesaj',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'tr_TR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  }
}

export function generatePersonalPageMetadata(
  recipientName: string,
  days: number,
  templateTitle: string
): Metadata {
  const title = `${recipientName} için özel mesaj`
  const description = `${days} gün boyunca erişilebilir özel mesaj sayfası. ${templateTitle} temasıyla hazırlandı.`
  
  return generateMetadata({
    title,
    description,
    type: 'article'
  })
}

export function generateTemplateMetadata(
  templateTitle: string,
  audience: string
): Metadata {
  const title = `${templateTitle} - Gizli Mesaj Şablonu`
  const description = `${templateTitle} temasıyla sevdiklerinize özel mesaj oluşturun. ${audience} kategorisinde romantik ve kişiselleştirilmiş deneyim.`
  
  return generateMetadata({
    title,
    description
  })
}
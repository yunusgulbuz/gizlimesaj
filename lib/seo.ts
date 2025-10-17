import { Metadata } from 'next'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export function generateMetadata({
  title = 'Gizli Mesaj - Sevdiklerinize Özel Sürpriz Mesajlar ve Hediyeler',
  description = 'Sevdiklerinize özel, kişiselleştirilmiş dijital mesajlar ve hediye sayfaları oluşturun. Romantik, eğlenceli ve unutulmaz anlar için zamanlı mesaj deneyimi.',
  image = '/og-image.jpg',
  url,
  type = 'website'
}: SEOProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birmesajmutluluk.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'birmesajmutluluk - Özel Dijital Hediyeler',
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
  templateTitle: string,
  image?: string
): Metadata {
  const title = `${recipientName} için özel hediye mesajı 💝`
  const description = `${recipientName} senin için özel bir dijital hediye hazırladı! ${templateTitle} temasıyla ${days} gün boyunca açabilirsin. ❤️`

  return generateMetadata({
    title,
    description,
    type: 'article',
    image
  })
}

export function generateTemplateMetadata(
  templateTitle: string,
  audience: string,
  image?: string
): Metadata {
  const title = `${templateTitle} - Özel Hediye Şablonu 🎁`
  const description = `${templateTitle} temasıyla sevdiklerinize unutulmaz bir dijital hediye hazırlayın. ${audience} kategorisinde romantik, eğlenceli ve kişiselleştirilmiş mesaj deneyimi.`

  return generateMetadata({
    title,
    description,
    image
  })
}
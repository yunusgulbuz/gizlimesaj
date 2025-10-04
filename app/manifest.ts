import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Heartnote - Özel Dijital Hediyeler',
    short_name: 'Heartnote',
    description: 'Sevdiklerinize özel, kişiselleştirilmiş dijital mesajlar ve hediye sayfaları oluşturun.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ec4899',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}

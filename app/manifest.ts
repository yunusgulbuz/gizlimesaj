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
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

export interface SharePreviewPreset {
  id: string;
  category: 'technology' | 'gift' | 'event' | 'special-day' | 'product-link';
  categoryLabel: string;
  icon: string;
  title: string;
  description: string;
  siteName: string;
  image?: string;
}

export const sharePreviewPresets: SharePreviewPreset[] = [
  // Teknoloji Çekilişleri
  {
    id: 'tech-iphone',
    category: 'technology',
    categoryLabel: 'Teknoloji Çekilişi',
    icon: '📱',
    title: 'iPhone 17 Pro Max Çekilişi - Hemen Katıl!',
    description: 'Yeni nesil iPhone 17 Pro Max kazanma şansını kaçırma! Şimdi katıl, şansını dene.',
    siteName: 'Çekiliş Kampanyası'
  },
  {
    id: 'tech-macbook',
    category: 'technology',
    categoryLabel: 'Teknoloji Çekilişi',
    icon: '💻',
    title: 'MacBook Pro Çekilişi - Sınırlı Süre!',
    description: 'MacBook Pro kazanmak için tek yapman gereken linke tıklamak. Hemen katıl!',
    siteName: 'Çekiliş Kampanyası'
  },
  {
    id: 'tech-airpods',
    category: 'technology',
    categoryLabel: 'Teknoloji Çekilişi',
    icon: '🎧',
    title: 'AirPods Pro Hediye Çekilişi',
    description: 'Ücretsiz AirPods Pro kazanma fırsatı! Katılım tamamen bedava.',
    siteName: 'Çekiliş Kampanyası'
  },

  // Hediye/Sürpriz Kampanyaları
  {
    id: 'gift-birthday',
    category: 'gift',
    categoryLabel: 'Hediye & Sürpriz',
    icon: '🎂',
    title: 'Doğum Günü Süprizi - Sana Özel Hediye!',
    description: 'Senin için hazırladığım özel doğum günü sürprizini görmek için hemen tıkla!',
    siteName: 'Özel Hediye',
  },
  {
    id: 'gift-romantic',
    category: 'gift',
    categoryLabel: 'Hediye & Sürpriz',
    icon: '💝',
    title: 'Sana Özel Romantik Sürpriz Var!',
    description: 'Senin için hazırladığım özel mesajı ve hediyeyi görmek için linke tıkla.',
    siteName: 'Romantik Sürpriz',
  },
  {
    id: 'gift-proposal',
    category: 'gift',
    categoryLabel: 'Hediye & Sürpriz',
    icon: '💍',
    title: 'Çok Özel Bir Sürprizim Var!',
    description: 'Hayatımızın en özel anına hazır mısın? Hemen linke tıkla!',
    siteName: 'Özel Anlar',
  },

  // Etkinlik Duyuruları
  {
    id: 'event-party',
    category: 'event',
    categoryLabel: 'Etkinlik Duyurusu',
    icon: '🎉',
    title: 'Özel Parti Davetiyesi - Mutlaka Gel!',
    description: 'Senin için düzenlediğimiz özel partiye davetlisin. Detaylar için tıkla!',
    siteName: 'Etkinlik Davetiyesi',
  },
  {
    id: 'event-concert',
    category: 'event',
    categoryLabel: 'Etkinlik Duyurusu',
    icon: '🎵',
    title: 'Konser Biletini Aldım - Birlikte Gidelim!',
    description: 'Senin için konser bileti aldım! Detayları öğrenmek için tıkla.',
    siteName: 'Konser Daveti',
  },
  {
    id: 'event-wedding',
    category: 'event',
    categoryLabel: 'Etkinlik Duyurusu',
    icon: '💒',
    title: 'Düğün Davetiyemiz - Mutluluğumuza Ortak Ol!',
    description: 'Hayatımızın en özel gününde yanımızda olmanı istiyoruz. Davetiye için tıkla!',
    siteName: 'Düğün Davetiyesi',
  },

  // Özel Günler
  {
    id: 'special-valentine',
    category: 'special-day',
    categoryLabel: 'Özel Gün',
    icon: '❤️',
    title: 'Sevgililer Günü Sürprizi - Sadece Senin İçin!',
    description: 'Bu Sevgililer Günü\'nde senin için hazırladığım özel mesajı gör!',
    siteName: 'Sevgililer Günü',
  },
  {
    id: 'special-anniversary',
    category: 'special-day',
    categoryLabel: 'Özel Gün',
    icon: '💕',
    title: 'Mutlu Yıldönümümüz Aşkım!',
    description: 'Birlikte geçirdiğimiz bu güzel yıl için hazırladığım özel mesajı gör.',
    siteName: 'Yıldönümü Kutlaması',
  },
  {
    id: 'special-mothers-day',
    category: 'special-day',
    categoryLabel: 'Özel Gün',
    icon: '🌸',
    title: 'Anneler Günü Kutlu Olsun Anneciğim!',
    description: 'Senin için hazırladığım özel Anneler Günü mesajını görmek için tıkla.',
    siteName: 'Anneler Günü',
  },

  // Ürün/Link Paylaşımı
  {
    id: 'product-discount',
    category: 'product-link',
    categoryLabel: 'Ürün Linki',
    icon: '🔗',
    title: '%50 İndirim Fırsatı - Kaçırma!',
    description: 'Sınırlı süreliğine özel indirim kodu! Hemen alışverişe başla.',
    siteName: 'Özel Kampanya',
  },
  {
    id: 'product-exclusive',
    category: 'product-link',
    categoryLabel: 'Ürün Linki',
    icon: '⭐',
    title: 'Özel Ürün İncelemesi - İzle!',
    description: 'Bu harika ürünü mutlaka incelemelisin. Detaylar içeride!',
    siteName: 'Ürün İncelemesi',
  },
  {
    id: 'product-gift-card',
    category: 'product-link',
    categoryLabel: 'Ürün Linki',
    icon: '🎁',
    title: 'Hediye Çeki Kazandın!',
    description: 'Tebrikler! Senin için özel hediye çeki hazırlandı. Hemen kullan!',
    siteName: 'Hediye Çeki',
  }
];

export const getPresetsByCategory = (category: SharePreviewPreset['category']) => {
  return sharePreviewPresets.filter(preset => preset.category === category);
};

export const getPresetById = (id: string) => {
  return sharePreviewPresets.find(preset => preset.id === id);
};

export const categories = [
  { value: 'technology', label: 'Teknoloji Çekilişleri', icon: '📱' },
  { value: 'gift', label: 'Hediye & Sürpriz', icon: '🎁' },
  { value: 'event', label: 'Etkinlik Duyuruları', icon: '🎉' },
  { value: 'special-day', label: 'Özel Günler', icon: '❤️' },
  { value: 'product-link', label: 'Ürün Linki', icon: '🔗' }
] as const;

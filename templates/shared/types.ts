export interface TemplateTextFields {
  [key: string]: string;
}

export interface TemplateFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  type: 'input' | 'textarea';
  required: boolean;
  maxLength?: number;
  defaultValue?: string;
}

export interface TemplateConfig {
  slug: string;
  fields: TemplateFieldConfig[];
}

// Template konfigürasyonları
export const templateConfigs: Record<string, TemplateConfig> = {
  'seni-seviyorum': {
    slug: 'seni-seviyorum',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Genel Mesaj',
        placeholder: 'Şablonun farklı bölümlerinde kullanılacak mesaj',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Birlikte yazdığımız hikaye, zaman çizelgesinin her noktasında yeniden parlıyor.'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Sevdiklerinize iletmek istediğiniz ana mesajı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Sen benim hayatımın en güzel parçasısın. Seninle geçirdiğim her an bir hayal gibi. Seni ne kadar sevdiğimi kelimelerle anlatmak mümkün değil. Her gün seni daha çok seviyorum. 💕'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında görünecek kısa mesaj',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Sen benim her şeyimsin! 💝'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'affet-beni': {
    slug: 'affet-beni',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'subtitle',
        label: 'Alt Başlık',
        placeholder: 'Başlığın altında görünecek metin',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: '🌹 Affet Beni 🌹'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Özür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Biliyorum ki seni üzdüm ve bunun için çok pişmanım. Yaptığım hatalar için senden özür diliyorum. Sen benim için çok değerlisin ve seni kaybetmek istemiyorum. Lütfen beni affet. 🙏💕'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında görünecek mesaj',
        type: 'input',
        required: false,
        maxLength: 150,
        defaultValue: 'Seni çok seviyorum ve özür diliyorum! 💝'
      },
      {
        key: 'quoteMessage',
        label: 'Alıntı Mesajı',
        placeholder: 'En altta görünecek alıntı mesajı',
        type: 'input',
        required: false,
        maxLength: 200,
        defaultValue: '"Gerçek aşk, hatalarımızı kabul etmek ve affedilmeyi umut etmektir."'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'seni-seviyorum-teen': {
    slug: 'seni-seviyorum-teen',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Sevdiklerinize iletmek istediğiniz ana mesajı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Hey! Sen gerçekten çok özelsin ve seni ne kadar sevdiğimi bilmeni istiyorum. Seninle geçirdiğim her an harika! Sen benim için çok değerlisin. 💕✨'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında görünecek kısa mesaj',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Sen harikasın! 🌟💝'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'seni-seviyorum-premium': {
    slug: 'seni-seviyorum-premium',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Kalplerinizi ısıtacak ana mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Kalbimin her kıvrımında sen varsın. Gözlerinin ışığıyla aydınlanan dünyamda, seninle her an yeniden aşık oluyorum.'
      },
      {
        key: 'mainTitle',
        label: 'Başlık',
        placeholder: 'Sayfanın ana başlığını yazın (örn. Seni Seviyorum)',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Seni Seviyorum'
      },
      {
        key: 'secondaryMessage',
        label: 'İkincil Mesaj / Motto',
        placeholder: 'Modern ve klasik tasarımlarda öne çıkan kısa cümleniz...',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Kalbimin her ritmindesin.'
      },
      {
        key: 'classicSignature',
        label: 'Klasik Stil İmza Metni',
        placeholder: 'Örn: Daima Aşk ile',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Daima Aşk ile'
      },
      {
        key: 'minimalistTagline',
        label: 'Minimalist Stil Alt Metni',
        placeholder: 'Örn: Sadece Sen ve Ben',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Sadece Sen ve Ben'
      },
      {
        key: 'buttonLabel',
        label: 'Modern Stil Buton Yazısı',
        placeholder: 'Örn: Seni Okuyorum ❤️',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Seni Okuyorum ❤️'
      },
      {
        key: 'playfulButtonLabel',
        label: 'Eğlenceli Stil Buton Yazısı',
        placeholder: 'Örn: Kalbimi Kabul Et 💘',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Kalbimi Kabul Et 💘'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'is-tebrigi': {
    slug: 'is-tebrigi',
    fields: [
      {
        key: 'recipientName',
        label: 'Tebrik Edilecek Kişi',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 60,
      },
      {
        key: 'newPosition',
        label: 'Yeni Pozisyonu',
        placeholder: 'Örn. Operasyon Direktörü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Operasyon Direktörü',
      },
      {
        key: 'companyName',
        label: 'Şirket veya Departman',
        placeholder: 'Örn. Atlas Teknoloji',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Atlas Teknoloji',
      },
      {
        key: 'mainMessage',
        label: 'Ana Tebrik Mesajı',
        placeholder: 'Bu yeni rol için paylaşmak istediğiniz ana mesajı yazın',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Takım olarak bu yeni başarını kutluyoruz. Enerjin ve vizyonunla hepimize ilham veriyorsun. Yeni pozisyonunda da olağanüstü işler başaracağına gönülden inanıyoruz!',
      },
      {
        key: 'highlightMessage',
        label: 'Modern Tasarım Vurgu Cümlesi',
        placeholder: 'Örn. Yeni görevinizde parlamaya hazırsınız.',
        type: 'input',
        required: false,
        maxLength: 140,
        defaultValue: 'Yeni görevinizde parlamaya hazırsınız.',
      },
      {
        key: 'highlightOne',
        label: 'Öne Çıkan Başarı #1',
        placeholder: 'Stratejik vizyon',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Stratejik vizyon',
      },
      {
        key: 'highlightTwo',
        label: 'Öne Çıkan Başarı #2',
        placeholder: 'İlham veren liderlik',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'İlham veren liderlik',
      },
      {
        key: 'ctaLabel',
        label: 'Modern Tasarım Birincil Buton Yazısı',
        placeholder: 'Örn. LinkedIn’de Paylaş',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Teşekkürler',
      },
      {
        key: 'ctaUrl',
        label: 'Modern Tasarım Buton Linki',
        placeholder: 'https://linkedin.com/in/...',
        type: 'input',
        required: false,
        maxLength: 200,
      },
      {
        key: 'secondaryCtaLabel',
        label: 'Modern Tasarım İkincil Buton Yazısı',
        placeholder: 'Örn. Takım Notu Gönder',
        type: 'input',
        required: false,
        maxLength: 80,
      },
      {
        key: 'downloadLabel',
        label: 'Klasik Tasarım Buton Yazısı',
        placeholder: 'Örn. Tebrik Kartını İndir',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Teşekkür Ederim',
      },
      {
        key: 'certificateTitle',
        label: 'Klasik Tasarım Başlığı',
        placeholder: 'Örn. Tebrikler! Yeni Görevinizde Başarılar',
        type: 'input',
        required: false,
        maxLength: 160,
        defaultValue: 'Tebrikler! Yeni Görevinizde Başarılar',
      },
      {
        key: 'certificateSubtitle',
        label: 'Klasik Tasarım Alt Başlığı',
        placeholder: 'Örn. Operasyon Direktörü - Atlas Teknoloji',
        type: 'input',
        required: false,
        maxLength: 160,
        defaultValue: 'Operasyon Direktörü - Atlas Teknoloji',
      },
      {
        key: 'footerMessage',
        label: 'Klasik Tasarım Alt Mesajı',
        placeholder: 'Örn. Takımınız adına...',
        type: 'input',
        required: false,
        maxLength: 140,
        defaultValue: 'Takımınız ve yol arkadaşlarınız adına...',
      },
      {
        key: 'minimalTitle',
        label: 'Minimal Tasarım Başlığı',
        placeholder: 'Örn. Yeni Göreviniz Hayırlı Olsun',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Yeni Göreviniz Hayırlı Olsun',
      },
      {
        key: 'supplementMessage',
        label: 'Minimal Tasarım Ek Notu',
        placeholder: 'Takım arkadaşlarınız sizinle gurur duyuyor.',
        type: 'textarea',
        required: false,
        maxLength: 280,
        defaultValue: 'Takım arkadaşlarınız sizinle gurur duyuyor.',
      },
      {
        key: 'messageButtonLabel',
        label: 'Minimal Tasarım Buton Yazısı',
        placeholder: 'Örn. Mesaj Gönder',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Teşekkür Ederim',
      },
      {
        key: 'messageButtonUrl',
        label: 'Minimal Tasarım Buton Linki',
        placeholder: 'https://...',
        type: 'input',
        required: false,
        maxLength: 200,
      },
      {
        key: 'startDate',
        label: 'Başlangıç Bilgisi',
        placeholder: 'Örn. 15 Mayıs',
        type: 'input',
        required: false,
        maxLength: 40,
        defaultValue: 'Hemen',
      },
      {
        key: 'celebrationButtonLabel',
        label: 'Dinamik Tasarım Buton Yazısı',
        placeholder: 'Örn. Kutlamayı Paylaş',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Kutlama',
      },
      {
        key: 'celebrationButtonUrl',
        label: 'Dinamik Tasarım Buton Linki',
        placeholder: 'https://...',
        type: 'input',
        required: false,
        maxLength: 200,
      },
      {
        key: 'newStartLabel',
        label: 'Modern Tasarım "Yeni Başlangıç" Etiketi',
        placeholder: 'Örn. Yeni Başlangıç',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Yeni Başlangıç',
      },
      {
        key: 'leadershipLabel',
        label: 'Modern Tasarım Liderlik Başlığı',
        placeholder: 'Örn. Takım Liderliği',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Takım Liderliği',
      },
      {
        key: 'leadershipDesc',
        label: 'Modern Tasarım Liderlik Açıklaması',
        placeholder: 'Örn. Yüksek performans',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Yüksek performans',
      },
      {
        key: 'strategyLabel',
        label: 'Modern Tasarım Strateji Başlığı',
        placeholder: 'Örn. Strateji',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Strateji',
      },
      {
        key: 'strategyDesc',
        label: 'Modern Tasarım Strateji Açıklaması',
        placeholder: 'Örn. Güçlü vizyon',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Güçlü vizyon',
      },
      {
        key: 'downloadUrl',
        label: 'Klasik Tasarım Buton Linki',
        placeholder: 'https://...',
        type: 'input',
        required: false,
        maxLength: 200,
      },
      {
        key: 'certificateLabel',
        label: 'Klasik Tasarım Sertifika Etiketi',
        placeholder: 'Örn. Resmi Tebrik Sertifikası',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Resmi Tebrik Sertifikası',
      },
      {
        key: 'visionLabel',
        label: 'Klasik Tasarım Vizyon Başlığı',
        placeholder: 'Örn. Vizyon',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Vizyon',
      },
      {
        key: 'visionDesc',
        label: 'Klasik Tasarım Vizyon Açıklaması',
        placeholder: 'Örn. Yeni ufuklar',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Yeni ufuklar',
      },
      {
        key: 'successLabel',
        label: 'Klasik Tasarım Başarı Başlığı',
        placeholder: 'Örn. Başarı',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Başarı',
      },
      {
        key: 'successDesc',
        label: 'Klasik Tasarım Başarı Açıklaması',
        placeholder: 'Örn. Sürdürülebilir',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Sürdürülebilir',
      },
      {
        key: 'newRoleLabel',
        label: 'Minimal Tasarım "Yeni rol" Etiketi',
        placeholder: 'Örn. Yeni rol',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Yeni rol',
      },
      {
        key: 'startLabel',
        label: 'Minimal Tasarım "Başlangıç" Etiketi',
        placeholder: 'Örn. Başlangıç',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Başlangıç',
      },
      {
        key: 'professionalNote',
        label: 'Minimal Tasarım Alt Notu',
        placeholder: 'Örn. Profesyonel dayanışma',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Profesyonel dayanışma',
      },
      {
        key: 'positionLabel',
        label: 'Dinamik Tasarım "Pozisyon" Etiketi',
        placeholder: 'Örn. Pozisyon',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Pozisyon',
      },
      {
        key: 'teamLabel',
        label: 'Dinamik Tasarım "Takım" Etiketi',
        placeholder: 'Örn. Takım',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Takım',
      },
      {
        key: 'preparerLabel',
        label: 'Dinamik Tasarım "Hazırlayan" Etiketi',
        placeholder: 'Örn. Hazırlayan',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Hazırlayan',
      },
      {
        key: 'officeSceneLabel',
        label: 'Dinamik Tasarım Ofis Sahne Etiketi',
        placeholder: 'Örn. Ofis Sahnesi',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Ofis Sahnesi',
      },
      {
        key: 'teamGuruLabel',
        label: 'Dinamik Tasarım Takım Guru Etiketi',
        placeholder: 'Örn. Takım Guru',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Takım Guru',
      },
      {
        key: 'inspiringMomentLabel',
        label: 'Dinamik Tasarım İlham Veren An Etiketi',
        placeholder: 'Örn. İlham Veren An',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'İlham Veren An',
      },
      {
        key: 'successChartLabel',
        label: 'Dinamik Tasarım Başarı Grafiği Etiketi',
        placeholder: 'Örn. Başarı Grafiği',
        type: 'input',
        required: false,
        maxLength: 50,
        defaultValue: 'Başarı Grafiği',
      },
      {
        key: 'headline',
        label: 'Dinamik Tasarım Başlığı',
        placeholder: 'Örn. Tebrikler [İsim]!',
        type: 'input',
        required: false,
        maxLength: 140,
      },
      {
        key: 'subHeadline',
        label: 'Dinamik Tasarım Alt Başlığı',
        placeholder: 'Örn. Yeni görevinde başarılar diliyoruz',
        type: 'input',
        required: false,
        maxLength: 160,
      },
      {
        key: 'teamName',
        label: 'Dinamik Tasarım Takım Adı',
        placeholder: 'Örn. Strateji ve Analiz',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Strateji ve Analiz',
      },
      {
        key: 'secondaryMessage',
        label: 'Dinamik Tasarım Ek Mesajı',
        placeholder: 'Örn. Yeni takım ruhu: İnovasyon...',
        type: 'textarea',
        required: false,
        maxLength: 320,
        defaultValue: 'Yeni takım ruhu: İnovasyon, işbirliği ve yüksek enerji!',
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ],
  },
  'affet-beni-classic': {
    slug: 'affet-beni-classic',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'subtitle',
        label: 'Alt Başlık',
        placeholder: 'Başlığın altında görünecek metin',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: '🌹 Affet Beni 🌹'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Özür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Biliyorum ki seni üzdüm ve bunun için çok pişmanım. Yaptığım hatalar için senden özür diliyorum. Sen benim için çok değerlisin ve seni kaybetmek istemiyorum. Lütfen beni affet. 🙏💕'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında görünecek mesaj',
        type: 'input',
        required: false,
        maxLength: 150,
        defaultValue: 'Seni çok seviyorum ve özür diliyorum! 💝'
      },
      {
        key: 'quoteMessage',
        label: 'Alıntı Mesajı',
        placeholder: 'En altta görünecek alıntı mesajı',
        type: 'input',
        required: false,
        maxLength: 200,
        defaultValue: '"Gerçek aşk, hatalarımızı kabul etmek ve affedilmeyi umut etmektir."'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'evlilik-teklifi-elegant': {
    slug: 'evlilik-teklifi-elegant',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Evlilik teklifi mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Seninle geçirdiğim her an hayatımın en güzel anları. Artık hayatımın geri kalanını da seninle geçirmek istiyorum. Benimle evlenir misin?'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında görünecek mesaj',
        type: 'input',
        required: false,
        maxLength: 150,
        defaultValue: 'Seni sonsuza kadar seviyorum! 💍💕'
      },
      {
        key: 'specialMessage',
        label: 'Özel Mesaj',
        placeholder: 'Ek bir özel mesaj eklemek isterseniz...',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: 'Sen benim hayatımın aşkısın, ruhuma dokunduğun ilk günden beri seni seviyorum.'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'ozur-dilerim-classic': {
    slug: 'ozur-dilerim-classic',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Özür Mesajınız',
        placeholder: 'Özür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Biliyorum ki seni üzdüm ve bunun için çok pişmanım. Yaptığım hatalar için senden özür diliyorum. Sen benim için çok değerlisin ve seni kaybetmek istemiyorum. Lütfen beni affet. 🙏💕'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'dogum-gunu-fun': {
    slug: 'dogum-gunu-fun',
    fields: [
      {
        key: 'recipientName',
        label: 'Doğum Günü Sahibinin Adı',
        placeholder: 'Doğum günü kutlanacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'age',
        label: 'Yaş',
        placeholder: 'Kaç yaşına girdiğini yazın (ör: 25)',
        type: 'input',
        required: false,
        maxLength: 3
      },
      {
        key: 'mainMessage',
        label: 'Doğum Günü Mesajınız',
        placeholder: 'Doğum günü mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Doğum günün kutlu olsun! Bu özel günde sana en güzel dilekleri gönderiyorum. Yeni yaşın sana sağlık, mutluluk ve başarı getirsin! 🎉🎂'
      },
      {
        key: 'wishMessage',
        label: 'Dilek Mesajı',
        placeholder: 'Özel bir dileğiniz varsa yazın...',
        type: 'input',
        required: false,
        maxLength: 150,
        defaultValue: 'Tüm hayallerin gerçek olsun! 🌟'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında görünecek mesaj',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Nice mutlu yıllara! 🎈🎊'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'tesekkur-adult': {
    slug: 'tesekkur-adult',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'message',
        label: 'Teşekkür Mesajınız',
        placeholder: 'Teşekkür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Hayatımda olduğun için çok şanslıyım. Bana verdiğin destek, sevgi ve anlayış için sana ne kadar teşekkür etsem az. Sen gerçekten çok özelsin ve seni ne kadar takdir ettiğimi bilmeni istiyorum. 🙏💕'
      },
      {
        key: 'creatorName',
        label: 'İsminiz',
        placeholder: 'İsminizi girin',
        type: 'input',
        required: false,
        maxLength: 50
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'mutlu-yillar-fun': {
    slug: 'mutlu-yillar-fun',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Yeni Yıl Mesajınız',
        placeholder: 'Yeni yıl mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Yeni yılın sana sağlık, mutluluk ve başarı getirmesini diliyorum! Bu yıl tüm hayallerin gerçek olsun. Mutlu yıllar! 🎉✨'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'romantik-mesaj-elegant': {
    slug: 'romantik-mesaj-elegant',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50,
        defaultValue: 'Kalbimin Sahibi'
      },
      {
        key: 'headline',
        label: 'Neon Başlık',
        placeholder: 'Neon efektli başlık için kısa bir cümle',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Seninle her şey daha anlamlı ❤️'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Sayfada yer alacak ana romantik mesajınızı yazın',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Şehrin neon ışıkları bile senin parıltın yanında sönük kalıyor. Kalbimin ritmi, senin adını her attığında yeniden yazıyor.'
      },
      {
        key: 'subtext',
        label: 'Neon Alt Metin',
        placeholder: 'Kısa tamamlayıcı metin',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Şehrin ışıkları arasında bile senin gülüşün en parlak olanı.'
      },
      {
        key: 'ctaText',
        label: 'Neon Buton Metni',
        placeholder: 'Örn. Birlikte Parlıyoruz ✨',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Birlikte Parlıyoruz ✨'
      },
      {
        key: 'letterTitle',
        label: 'Mektup Başlığı',
        placeholder: 'Örn. Seni Seviyorum',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Seni Seviyorum'
      },
      {
        key: 'letterBody',
        label: 'Mektup Metni',
        placeholder: 'Zarfın içinden çıkacak mektup metni',
        type: 'textarea',
        required: false,
        maxLength: 900,
        defaultValue: 'Bu mektubun her satırında kalbimin en sıcak duyguları saklı. Sen yanımdayken her an hatıra, her bakış bir mucize oluyor. Sevgim sana hep en güzel kelimeleri arıyor.'
      },
      {
        key: 'letterSignature',
        label: 'Mektup İmzası',
        placeholder: 'Örn. Sevgiyle, ...',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Sevgiyle'
      },
      {
        key: 'letterButtonLabel',
        label: 'Mektup Buton Metni',
        placeholder: 'Örn. Mektubu Kapat',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mektubu Kapat'
      },
      {
        key: 'minimalMessage',
        label: 'Minimal Ana Mesaj',
        placeholder: 'Örn. Sen olunca her şey tamam.',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Sen olunca her şey tamam.'
      },
      {
        key: 'minimalAlternate',
        label: 'Minimal Kalp Mesajı',
        placeholder: 'Kalp butonuna tıklanınca gösterilecek mesaj',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Seni Seviyorum'
      },
      {
        key: 'minimalSignature',
        label: 'Minimal İmza',
        placeholder: 'Kısa bir imza veya not',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Kalbimin en saf köşesi seninle.'
      },
      {
        key: 'minimalTagline',
        label: 'Minimal Başlık',
        placeholder: 'Örn. Pure Love',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Pure Love'
      },
      {
        key: 'minimalNote',
        label: 'Minimal Not',
        placeholder: 'Örn. Sessiz bir mutluluk...',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Sessiz bir mutluluk ve kalbimden düşen sade bir ışık... her şey seninle tamamlanıyor.'
      },
      {
        key: 'minimalToggleIcon',
        label: 'Minimal Buton İkonu',
        placeholder: 'Örn. ❤️',
        type: 'input',
        required: false,
        maxLength: 10,
        defaultValue: '❤️'
      },
      {
        key: 'gameIntro',
        label: 'Oyun Başlığı',
        placeholder: 'Örn. Beni Bulabilir misin?',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Beni Bulabilir misin?'
      },
      {
        key: 'gameHelper',
        label: 'Oyun Açıklaması',
        placeholder: 'Kalpleri tıklayınca ne olacağını anlatan kısa metin',
        type: 'textarea',
        required: false,
        maxLength: 280,
        defaultValue: 'Uçuşan kalpleri yakala, sonuncu seni bekliyor! Her kalp seni büyük sürprize bir adım daha yaklaştıracak.'
      },
      {
        key: 'gameWinMessage',
        label: 'Oyun Sonu Mesajı',
        placeholder: 'Tüm kalpler bulununca gösterilecek mesaj',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Seni Seviyorum'
      },
      {
        key: 'gameButtonText',
        label: 'Oyun Buton Metni',
        placeholder: 'Örn. Kalp Avını Başlat ❤️',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Kalp Avını Başlat ❤️'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'yil-donumu': {
    slug: 'yil-donumu',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'mainMessage',
        label: 'Genel Mesaj',
        placeholder: 'Şablonun farklı bölümlerinde kullanılacak mesaj',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Birlikte yazdığımız hikaye, zaman çizelgesinin her noktasında yeniden parlıyor.'
      },
      {
        key: 'headlineMessage',
        label: 'Modern Başlık',
        placeholder: 'Zamanda Yolculuk',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Zamanda Yolculuk'
      },
      {
        key: 'timelineIntro',
        label: 'Modern Giriş Mesajı',
        placeholder: 'Timeline için giriş metni',
        type: 'textarea',
        required: false,
        maxLength: 500,
        defaultValue: 'Birlikte geçirdiğimiz her an, yıldızlarla dans eden sonsuz bir hikaye.'
      },
      {
        key: 'timelineEvents',
        label: 'Timeline Olayları',
        placeholder: 'Tarih|Başlık|Kısa açıklama (her satıra bir olay)',
        type: 'textarea',
        required: false,
        maxLength: 1000,
        defaultValue: '2015-06-12|İlk karşılaştığımız gün|O yaz akşamında kalbimin sana ait olduğunu anladım.\n2017-09-03|İlk tatilimiz|Birlikte yeni yerler keşfetmenin heyecanını yaşadık.\n2020-02-14|Evet dediğin an|Gözlerinin içine bakarken dünyamız güzelleşti.\n2023-11-20|Yeni bir başlangıç|Hayallerimizi aynı sayfada büyütmeye devam ettik.'
      },
      {
        key: 'timelineCta',
        label: 'Timeline Buton Metni',
        placeholder: 'Birlikte Geçen Yıllarımız',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Birlikte Geçen Yıllarımız'
      },
      {
        key: 'timelineClosing',
        label: 'Timeline Kapanış Başlığı',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'timelineFinalMessage',
        label: 'Timeline Kapanış Mesajı',
        placeholder: 'Final mesajı',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Geçmişten geleceğe uzanan bu yolculukta, her anı birlikte yeniden yazmaya devam edelim.'
      },
      {
        key: 'hatiraHeadline',
        label: 'Hatıra Kutusu Başlığı',
        placeholder: 'Klasik Hatıra Kutusu',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Klasik Hatıra Kutusu'
      },
      {
        key: 'hatiraSubtitle',
        label: 'Hatıra Kutusu Alt Başlık',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'hatiraLetter',
        label: 'Hatıra Mektubu',
        placeholder: 'Hatıra kutusundaki mektup metni',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Sevgili aşkım, her hatıranın bir köşesinde senin ışığın var. Bu kutunun içindeki her küçük detay, paylaştığımız büyük anıların bir yansıması. Birlikte attığımız her adım için minnettarım.'
      },
      {
        key: 'hatiraMemories',
        label: 'Hatıra Öğeleri',
        placeholder: 'Başlık|Açıklama|Yıl|Fotoğraf URL (her satıra bir hatıra)',
        type: 'textarea',
        required: false,
        maxLength: 1200,
        defaultValue: 'Polaroid Fotoğraf|Gülen yüzünün arkasında saklanan heyecanın ilk anı.|2016|https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80\nSinema Bileti|İlk film gecemiz; popcorn, kahkahalar ve kalp çarpıntıları.|2018|https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80\nEl Yazısı Not|"Sonsuza dek" dediğin o satırlar, kalbime mühür oldu.|2020|https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80\nMinik Deniz Kabuğu|Birlikte topladığımız o gün, güneş kadar parlaktın.|2022|https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'
      },
      {
        key: 'hatiraBackgroundUrl',
        label: 'Hatıra Albümü Arka Plan Fotoğrafı',
        placeholder: 'https://... şeklinde görsel bağlantısı',
        type: 'input',
        required: false,
        maxLength: 300,
        defaultValue: 'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?w=1280&q=80'
      },
      {
        key: 'hatiraButtonLabel',
        label: 'Hatıra Butonu Metni',
        placeholder: 'Hatıraları Gör',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Hatıraları Gör'
      },
      {
        key: 'minimalistTitle',
        label: 'Minimalist Başlık',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'minimalistSubtitle',
        label: 'Minimalist Alt Başlık',
        placeholder: 'Şifreli Hatıra',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Şifreli Hatıra'
      },
      {
        key: 'minimalistLockMessage',
        label: 'Kilit Mesajı',
        placeholder: 'Kilidi açmadan önce gösterilecek metin',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Sırlarımızı hatırlıyor musun? Kilidi aç ve birlikte yazdığımız hikayeyi tekrar yaşa.'
      },
      {
        key: 'minimalistRevealMessage',
        label: 'Kilit Açıldı Mesajı',
        placeholder: 'Kilidi açınca gösterilecek metin',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'İlk gülüşünden beri kalbime çizdiğin kavis, bugün hâlâ aynı sıcaklıkta. Birlikte geçen her yıl, özenle saklanmış bir sır gibi kıymetli.'
      },
      {
        key: 'minimalistHighlights',
        label: 'Minimalist Öne Çıkanlar',
        placeholder: 'Başlık|Açıklama (her satıra bir adet)',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'İlk buluşmamız|Şehrin ışıkları altında kaybolmuştuk.\nPaylaşılan sırlar|Göz göze geldiğimiz anda her şeyi anladık.\nSonsuz sözler|Her yıl, kalbimize yeni bir söz ekledik.'
      },
      {
        key: 'minimalistFooter',
        label: 'Minimalist Alt Mesaj',
        placeholder: 'Açığa çıkan her sır...',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Açığa çıkan her sır, birlikte büyüttüğümüz sevgiye ait.'
      },
      {
        key: 'quizHeadline',
        label: 'Quiz Başlığı',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'quizIntro',
        label: 'Quiz Giriş Mesajı',
        placeholder: 'Mini oyun için açıklama',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Mini bir aşk quizine hazır mısın? Her doğru cevap yeni bir hatırayı gün yüzüne çıkaracak!'
      },
      {
        key: 'quizButtonLabel',
        label: 'Quiz Başlat Butonu',
        placeholder: 'Kutlamayı Başlat',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Kutlamayı Başlat'
      },
      {
        key: 'quizItems',
        label: 'Quiz Soruları',
        placeholder: 'Soru|Doğru cevap|Hatıra notu|İpucu (her satıra bir soru)',
        type: 'textarea',
        required: false,
        maxLength: 1000,
        defaultValue: 'İlk nerede tanıştık?|Üniversite kütüphanesi|Sessizliğin arasında göz göze geldiğimiz an.|Kütüphane\nEn sevdiğimiz film?|Amélie|Her sahnesinde birbirimize gülümsediğimiz film.|Fransız film\nİlk ortak şarkımız?|Yellow|Konserde ellerimiz kenetlenmişti.|Coldplay\nEn unutulmaz seyahatimiz?|Kapadokya|Gün doğarken balonlardan selam vermiştik.|Balonlar'
      },
      {
        key: 'quizHintLabel',
        label: 'Quiz İpucu Etiketi',
        placeholder: 'İpucu',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'İpucu'
      },
      {
        key: 'quizCompletionTitle',
        label: 'Quiz Tamamlama Başlığı',
        placeholder: 'Harikasın!',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Harikasın!'
      },
      {
        key: 'quizCompletionMessage',
        label: 'Quiz Tamamlama Mesajı',
        placeholder: 'Tüm soruların ardından gösterilecek mesaj',
        type: 'textarea',
        required: false,
        maxLength: 500,
        defaultValue: 'Soruların hepsini yanıtladın ve hatıra kutumuz parladı! İşte tüm soruların altında saklanan özel mesaj:'
      },
      {
        key: 'quizFinalMessage',
        label: 'Quiz Final Mesajı',
        placeholder: 'Gösterilecek alıntı',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Birlikte her sorunun yanıtını bulduk ve her yanıt bizi yeniden birbirimize getirdi. Mutlu Yıl Dönümü!'
      },
      {
        key: 'quizReplay',
        label: 'Quiz Tekrar Oyna Butonu',
        placeholder: 'Tekrar Oyna',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Tekrar Oyna'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  },
  'cikma-teklifi': {
    slug: 'cikma-teklifi',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50
      },
      {
        key: 'proposalQuestion',
        label: 'Teklif Sorusu',
        placeholder: 'Örn: Benimle çıkar mısın?',
        type: 'input',
        required: true,
        maxLength: 80,
        defaultValue: 'Benimle çıkar mısın?'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Duygularınızı paylaşmak için özel mesajınız...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Kalbim her gün seninle daha da hızlanıyor. Bu anı birlikte büyülü kılmak için sana kalbimin en içten sorusunu soruyorum...'
      },
      {
        key: 'secondaryMessage',
        label: 'Ek Mesaj',
        placeholder: 'Örn: Bu anı sonsuza dek hatırlayalım.',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Bu anı sonsuza dek hatırlayalım. 💫'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      }
    ]
  }
};

// Template konfigürasyonu alma fonksiyonu
export function getTemplateConfig(slug: string): TemplateConfig | null {
  return templateConfigs[slug] || null;
}

// Default değerleri alma fonksiyonu
export function getDefaultTextFields(slug: string): TemplateTextFields {
  const config = getTemplateConfig(slug);
  if (!config) return {};
  
  const defaults: TemplateTextFields = {};
  config.fields.forEach(field => {
    if (field.defaultValue) {
      defaults[field.key] = field.defaultValue;
    }
  });
  
  return defaults;
}

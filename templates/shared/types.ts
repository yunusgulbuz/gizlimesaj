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
  'affet-beni-signature': {
    slug: 'affet-beni-signature',
    fields: [
      {
        key: 'greetingPrefix',
        label: 'Hitap Metni',
        placeholder: 'Sevgili, Canım, Değerlim...',
        type: 'input',
        required: false,
        maxLength: 40,
        defaultValue: 'Sevgili'
      },
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 60
      },
      {
        key: 'mainTitle',
        label: 'Ana Başlık',
        placeholder: 'Sayfanın ana başlığını yazın',
        type: 'input',
        required: true,
        maxLength: 80,
        defaultValue: 'Affet Beni'
      },
      {
        key: 'subtitle',
        label: 'Kısa Spot Mesaj',
        placeholder: 'Başlığın altında yer alacak etkileyici cümle',
        type: 'textarea',
        required: false,
        maxLength: 180,
        defaultValue: 'Kalbimdeki ağırlık, senden bir özür dilemeden hafiflemiyor.'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Özür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Seni kırdığımın farkındayım ve bu düşünce içimi sızlatıyor. Gözlerine tekrar güvenle bakabilmek için içtenlikle senden af diliyorum.'
      },
      {
        key: 'secondaryMessage',
        label: 'Destekleyici Mesaj',
        placeholder: 'Ana mesaja eşlik edecek ek not',
        type: 'textarea',
        required: false,
        maxLength: 320,
        defaultValue: 'Bir şans daha verirsen kalbini yeniden gülümsetmek için elimden geleni yapacağım.'
      },
      {
        key: 'quoteMessage',
        label: 'Alıntı / Motto',
        placeholder: 'Öne çıkarmak istediğiniz kısa alıntı',
        type: 'input',
        required: false,
        maxLength: 200,
        defaultValue: 'Gerçek bağlar, affedildiğimiz anlarda daha da güçlenir.'
      },
      {
        key: 'buttonPrompt',
        label: 'Buton Öncesi Soru / Not',
        placeholder: 'Butonların üzerinde yer alacak çağrı metni',
        type: 'input',
        required: false,
        maxLength: 200,
        defaultValue: 'Kalbini yeniden kazanabilmek için bir fırsat verir misin?'
      },
      {
        key: 'buttonAcceptLabel',
        label: 'Onay Butonu Metni',
        placeholder: 'Kabul butonunda yazacak metin',
        type: 'input',
        required: true,
        maxLength: 60,
        defaultValue: 'Kabul Et'
      },
      {
        key: 'buttonRejectLabel',
        label: 'Reddetme Butonu Metni',
        placeholder: 'Eğlenceli tasarım için ikinci buton metni',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Henüz Hazır Değilim'
      },
      {
        key: 'footerMessage',
        label: 'Alt Mesaj',
        placeholder: 'Sayfanın altında yer alacak kapanış mesajı',
        type: 'input',
        required: false,
        maxLength: 180,
        defaultValue: 'Sevgiyle bekliyorum... 💗'
      },
      {
        key: 'letterPSS',
        label: 'P.S. Mesajı',
        placeholder: 'Klasik tasarımda mektubun altına eklenecek satır',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'P.S. Bu sayfayı hazırlarken her satırda seni düşündüm.'
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
  'tesekkur-ederim-askim': {
    slug: 'tesekkur-ederim-askim',
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
        label: 'Ana Mesajınız',
        placeholder: 'Genel teşekkür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Seninle geçen her an kalbimde mor bir parıltı bırakıyor. Varlığın, günümü aydınlatan en güzel neon ışığı gibi. Tüm desteklerin, sevgin ve sabrın için minnettarım. 💜'
      },
      {
        key: 'creatorName',
        label: 'İsminiz (opsiyonel)',
        placeholder: 'Mesajın hazırlayanı olarak isminizi yazabilirsiniz',
        type: 'input',
        required: false,
        maxLength: 60
      },
      {
        key: 'modernTitle',
        label: 'Modern Başlık',
        placeholder: 'Örn. Teşekkür Ederim Aşkım 💜',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Teşekkür Ederim Aşkım 💜'
      },
      {
        key: 'modernSubtitle',
        label: 'Modern Alt Metin',
        placeholder: 'Kısa duygusal cümlenizi yazın',
        type: 'input',
        required: false,
        maxLength: 140,
        defaultValue: 'Neon ışıklar kadar büyülü bir minnet duygusu.'
      },
      {
        key: 'modernSecondaryLine',
        label: 'Modern Neon Alt Satır',
        placeholder: 'Örn. Birlikte parlamaya devam edelim 💫',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Birlikte parlamaya devam edelim 💫'
      },
      {
        key: 'modernButtonLabel',
        label: 'Modern Buton Metni',
        placeholder: 'Örn. Söylemek İstediklerim 💬',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Söylemek İstediklerim 💬'
      },
      {
        key: 'modernDrawerMessage',
        label: 'Modern Açılır Mesaj',
        placeholder: 'Butona tıklanınca görünen mesaj',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Seninle paylaştığım her an, mor neon ışıklar gibi kalbimde yumuşacık bir iz bırakıyor. Her gülüşün geceyi aydınlatan bir parıltı gibi. İyi ki varsın.'
      },
      {
        key: 'modernPhotoUrl',
        label: 'Modern Stil Fotoğraf URL',
        placeholder: 'https://... (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'classicTitle',
        label: 'Klasik Başlık',
        placeholder: 'Örn. Teşekkür Ederim Aşkım',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Teşekkür Ederim Aşkım'
      },
      {
        key: 'classicSubtitle',
        label: 'Klasik Alt Metin',
        placeholder: 'Örn. Kalbimin en zarif mektubunu sana gönderiyorum.',
        type: 'input',
        required: false,
        maxLength: 160,
        defaultValue: 'Kalbimin en zarif mektubunu sana gönderiyorum.'
      },
      {
        key: 'classicButtonLabel',
        label: 'Klasik Buton Metni',
        placeholder: 'Örn. Mektubu Aç ✉️',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Mektubu Aç ✉️'
      },
      {
        key: 'classicLetterMessage',
        label: 'Klasik Mektup Mesajı',
        placeholder: 'Zarf açıldığında gösterilecek uzun mesaj',
        type: 'textarea',
        required: false,
        maxLength: 700,
        defaultValue: 'Sevgili aşkım, seninle geçen her an bana hayatın en güzel armağanı gibi geliyor. Nazik gülüşünü, sabrını ve sevgini her hissettiğimde kalbim yeniden çiçek açıyor. İyi ki varsın, iyi ki kalbimin ortağısın.'
      },
      {
        key: 'classicLetterSignature',
        label: 'Klasik İmza / Kapanış',
        placeholder: 'Örn. Sonsuz sevgiyle 💌',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Sonsuz sevgiyle 💌'
      },
      {
        key: 'classicPhotoUrl',
        label: 'Klasik Stil Fotoğraf URL',
        placeholder: 'https://... (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'minimalMainText',
        label: 'Minimal Ana Metin',
        placeholder: 'Örn. Teşekkür Ederim',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Teşekkür Ederim'
      },
      {
        key: 'minimalAccentText',
        label: 'Minimal Vurgu Metni',
        placeholder: 'Örn. Aşkım',
        type: 'input',
        required: false,
        maxLength: 40,
        defaultValue: 'Aşkım'
      },
      {
        key: 'minimalBodyText',
        label: 'Minimal Açıklama Satırı',
        placeholder: 'Kısa açıklayıcı not',
        type: 'textarea',
        required: false,
        maxLength: 280,
        defaultValue: 'Sıradan bir gün, seninle olağanüstü bir ana dönüşüyor.'
      },
      {
        key: 'minimalButtonLabel',
        label: 'Minimal Buton Metni',
        placeholder: 'Örn. ❤️',
        type: 'input',
        required: false,
        maxLength: 10,
        defaultValue: '❤️'
      },
      {
        key: 'minimalPopupText',
        label: 'Minimal Pop-up Mesajı',
        placeholder: 'Butona basınca görünen metin',
        type: 'textarea',
        required: false,
        maxLength: 350,
        defaultValue: 'Sen her şeyin en güzeline layıksın.'
      },
      {
        key: 'funTitle',
        label: 'Eğlenceli Başlık',
        placeholder: 'Örn. Teşekkür Ederim Aşkım!',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Teşekkür Ederim Aşkım!'
      },
      {
        key: 'funSubtitle',
        label: 'Eğlenceli Alt Metin',
        placeholder: 'Kısa enerjik mesaj',
        type: 'input',
        required: false,
        maxLength: 160,
        defaultValue: 'Kalbimi rengârenk baloncuklarla doldurduğun için.'
      },
      {
        key: 'funButtonLabel',
        label: 'Eğlenceli Buton Metni',
        placeholder: 'Örn. Balonları Patlat 🎈',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Balonları Patlat 🎈'
      },
      {
        key: 'funBubbleMessage1',
        label: 'Balon Mesajı 1',
        placeholder: 'İlk teşekkür notu',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'İyi ki varsın!'
      },
      {
        key: 'funBubbleMessage2',
        label: 'Balon Mesajı 2',
        placeholder: 'İkinci teşekkür notu',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Her günün kahramanı sensin 💖'
      },
      {
        key: 'funBubbleMessage3',
        label: 'Balon Mesajı 3',
        placeholder: 'Üçüncü teşekkür notu',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Sevgin her şeyi güzelleştiriyor ✨'
      },
      {
        key: 'funBubbleMessage4',
        label: 'Balon Mesajı 4',
        placeholder: 'Dördüncü teşekkür notu',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Sonsuz teşekkürler!'
      },
      {
        key: 'funPhotoUrl',
        label: 'Eğlenceli Stil Fotoğraf URL',
        placeholder: 'https://... (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
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
  'surpriz-randevu-daveti': {
    slug: 'surpriz-randevu-daveti',
    fields: [
      {
        key: 'recipientName',
        label: 'Gönderilecek Kişi Adı',
        placeholder: 'Mesajı alacak kişinin adını girin',
        type: 'input',
        required: true,
        maxLength: 50,
        defaultValue: 'Aşkım'
      },
      {
        key: 'mainMessage',
        label: 'Ana Mesajınız',
        placeholder: 'Tüm stillerde kullanılacak ana mesajınızı yazın',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Seninle geçireceğimiz sürpriz akşam için sabırsızlanıyorum. Her detay senin için planlandı ve bu davet, birlikte yaratacağımız yeni hatıraların başlangıcı. ❤️'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      },
      {
        key: 'modernTitle',
        label: 'Modern Başlık',
        placeholder: 'Soft glass davet başlığınızı yazın',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Birlikte Olmak İster misin?'
      },
      {
        key: 'modernSubtitle',
        label: 'Modern Alt Metin',
        placeholder: 'Tarih ve kısa mesajınızı yazın',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Lavanta tonlarında bir akşam planladım. 14 Şubat 19.30, favori kafemizde buluşalım mı?'
      },
      {
        key: 'modernButtonLabel',
        label: 'Modern Buton Metni',
        placeholder: 'Örn. Detayları Gör 💫',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Detayları Gör 💫'
      },
      {
        key: 'modernPanelTitle',
        label: 'Modern Panel Başlığı',
        placeholder: 'Panel başlığınızı yazın',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Cam Panelin Ardındaki Sürpriz'
      },
      {
        key: 'modernPanelMessage',
        label: 'Modern Panel Mesajı',
        placeholder: 'Butona tıklanınca açılan panel metnini yazın',
        type: 'textarea',
        required: false,
        maxLength: 500,
        defaultValue: 'Önce seni mor ışıklarla karşılayacak ufak bir galeriye götürüyorum. Sonra gizli terasta senin için hazırladığım menü var.'
      },
      {
        key: 'modernPanelSecondary',
        label: 'Modern Panel Alt Notu',
        placeholder: 'Ek notunuzu yazın (ör. Dress code)',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'Dress code: Lavanta & beyaz. Rahat ayakkabı getir.'
      },
      {
        key: 'modernPhotoUrl',
        label: 'Modern Fotoğraf URL',
        placeholder: "Soft glass tasarımda kullanılacak fotoğraf URL'si",
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'modernPhotoHint',
        label: 'Modern Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı Göster butonu metni',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Fotoğrafı Görüntüle'
      },
      {
        key: 'modernSignatureLabel',
        label: 'Modern İmza Etiketi',
        placeholder: 'Örn. Sevgilerle,',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Sevgilerle,'
      },
      {
        key: 'classicTitle',
        label: 'Klasik Başlık',
        placeholder: 'Romantik davet başlığı',
        type: 'input',
        required: false,
        maxLength: 90,
        defaultValue: 'Seni Özel Bir Akşama Davet Ediyorum 🌙'
      },
      {
        key: 'classicSubtitle',
        label: 'Klasik Alt Metin',
        placeholder: 'Tarih, mekan ve kısa açıklama',
        type: 'textarea',
        required: false,
        maxLength: 220,
        defaultValue: "18 Şubat Cumartesi | 20.00 | Galata'da buluşma noktası"
      },
      {
        key: 'classicButtonLabel',
        label: 'Klasik Buton Metni',
        placeholder: 'Örn. Davetiyeyi Aç ✨',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Davetiyeyi Aç ✨'
      },
      {
        key: 'classicEnvelopeHeading',
        label: 'Zarf Başlığı',
        placeholder: 'Zarf açılınca görülecek başlık',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Altın Zarfı Aç'
      },
      {
        key: 'classicEnvelopeMessage',
        label: 'Zarf Mesajı',
        placeholder: 'Zarfın içindeki davet metni',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Seni zarif bir akşam yemeğine davet ediyorum. Şehrin ışıkları altında yalnızca ikimizin paylaşacağı bir masa ayırttım. Gecenin her detayı seninle daha da güzel olacak.'
      },
      {
        key: 'classicEnvelopeFooter',
        label: 'Zarf Alt Notu',
        placeholder: 'Kısa kapanış notu',
        type: 'input',
        required: false,
        maxLength: 120,
        defaultValue: 'El ele yıldızları izlemeye ne dersin?'
      },
      {
        key: 'classicPhotoUrl',
        label: 'Klasik Fotoğraf URL',
        placeholder: "Zarf tasarımındaki fotoğraf URL'si",
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'classicPhotoHint',
        label: 'Klasik Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı gösteren buton metni',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Fotoğrafı Gör'
      },
      {
        key: 'classicSignatureLabel',
        label: 'Klasik İmza Etiketi',
        placeholder: 'Örn. Kalpten davetle,',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Kalpten davetle,'
      },
      {
        key: 'minimalTitle',
        label: 'Minimal Başlık',
        placeholder: 'Minimalist davet başlığı',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Küçük Bir Planım Var 💙'
      },
      {
        key: 'minimalSubtitle',
        label: 'Minimal Alt Metin',
        placeholder: 'Kısa not veya tarih',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Cumartesi seni şaşırtacağım... Rahat bir şeyler giy lütfen.'
      },
      {
        key: 'minimalButtonLabel',
        label: 'Minimal Buton Metni',
        placeholder: 'Örn. Spoiler Verme 🙈',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Spoiler Verme 🙈'
      },
      {
        key: 'minimalBubbleText',
        label: 'Minimal Balon Metni',
        placeholder: 'Butona tıklayınca çıkan metin',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: 'Sadece küçük bir ipucu: kısa bir yürüyüş ve ardından sıcak bir kahve molası.'
      },
      {
        key: 'minimalPhotoUrl',
        label: 'Minimal Fotoğraf URL',
        placeholder: "Polaroid efektli fotoğraf URL'si",
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'minimalPhotoHint',
        label: 'Minimal Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı açan buton metni',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Polaroidi Aç'
      },
      {
        key: 'minimalSignatureLabel',
        label: 'Minimal İmza Etiketi',
        placeholder: 'Örn. Buluşma ortağın:',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Buluşma ortağın:'
      },
      {
        key: 'funTitle',
        label: 'Eğlenceli Başlık',
        placeholder: 'Oyunlaştırılmış başlık metni',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Sürprizi Bulabilir misin? 🎁'
      },
      {
        key: 'funSubtitle',
        label: 'Eğlenceli Alt Metin',
        placeholder: 'Kutular için ipucu metni',
        type: 'textarea',
        required: false,
        maxLength: 220,
        defaultValue: 'Kutulardan biri akşamki planı saklıyor. Hazır mısın?'
      },
      {
        key: 'funButtonOneLabel',
        label: '1. Kutu Etiketi',
        placeholder: 'Örn. 1️⃣',
        type: 'input',
        required: false,
        maxLength: 10,
        defaultValue: '1️⃣'
      },
      {
        key: 'funButtonTwoLabel',
        label: '2. Kutu Etiketi',
        placeholder: 'Örn. 2️⃣',
        type: 'input',
        required: false,
        maxLength: 10,
        defaultValue: '2️⃣'
      },
      {
        key: 'funButtonThreeLabel',
        label: '3. Kutu Etiketi',
        placeholder: 'Örn. 3️⃣',
        type: 'input',
        required: false,
        maxLength: 10,
        defaultValue: '3️⃣'
      },
      {
        key: 'funButtonOneMessage',
        label: '1. Kutu Mesajı',
        placeholder: 'Yanlış seçimde gösterilecek mesaj',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: 'Bu kutu sıcak bir hazırlık ipucu veriyor: çikolata molası!'
      },
      {
        key: 'funButtonTwoMessage',
        label: '2. Kutu Mesajı',
        placeholder: 'Yanlış seçimde gösterilecek mesaj',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: 'Yaklaştın! Rahat ayakkabıları hazırlamayı unutma.'
      },
      {
        key: 'funButtonThreeMessage',
        label: '3. Kutu Mesajı',
        placeholder: 'Doğru seçimde gösterilecek mesaj',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: "Doğru kutu! Rooftop'ta senin için sakladığım bir masa var."
      },
      {
        key: 'funSuccessMessage',
        label: 'Başarı Mesajı',
        placeholder: 'Doğru kutuya tıklanınca çıkan mesaj',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: 'Tebrikler! Yarın akşam buluşuyoruz ❤️'
      },
      {
        key: 'funPhotoUrl',
        label: 'Eğlenceli Fotoğraf URL',
        placeholder: "Kazanan kutudan sonra gösterilecek fotoğraf URL'si",
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'funPhotoHint',
        label: 'Eğlenceli Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı açan buton metni',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Sürpriz Fotoğrafı Gör'
      },
      {
        key: 'funSignatureLabel',
        label: 'Eğlenceli İmza Etiketi',
        placeholder: 'Örn. Planın kahramanı:',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Planın kahramanı:'
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
  'yil-donumu-luxe': {
    slug: 'yil-donumu-luxe',
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
        placeholder: 'Tüm tasarımlarda kullanılacak ana mesaj',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Seninle geçen her yıldönümü, ışığın camdan süzülüşü gibi zarif ve özel hissettiriyor.'
      },
      {
        key: 'glassHeading',
        label: 'Modern Cam Başlığı',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'glassSubheading',
        label: 'Modern Cam Alt Başlığı',
        placeholder: 'Cam panel içinde görünecek kısa metin',
        type: 'textarea',
        required: false,
        maxLength: 220,
        defaultValue: 'Bu özel gün, camın içinden süzülen ışık gibi zarifçe parlasın.'
      },
      {
        key: 'glassBody',
        label: 'Modern Cam Gövde Mesajı',
        placeholder: 'Detaylı mesajı buraya yazın',
        type: 'textarea',
        required: false,
        maxLength: 600,
        defaultValue: 'Seninle geçen her yıldönümü, ışığın camdan süzülüşü gibi zarif ve özel hissettiriyor.'
      },
      {
        key: 'glassButtonLabel',
        label: 'Modern Cam Buton Metni',
        placeholder: 'Hatıralarımızı Gör',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Hatıralarımızı Gör'
      },
      {
        key: 'glassLightNote',
        label: 'Modern Cam Üst Not',
        placeholder: 'Işığımız hiç sönmesin.',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Işığımız hiç sönmesin.'
      },
      {
        key: 'glassPhotoInitial',
        label: 'Modern Cam Fotoğraf Yer Tutucusu',
        placeholder: '♥',
        type: 'input',
        required: false,
        maxLength: 4,
        defaultValue: '♥'
      },
      {
        key: 'glassPhotoUrl',
        label: 'Modern Cam Fotoğraf Bağlantısı',
        placeholder: 'https://... şeklinde fotoğraf adresi',
        type: 'input',
        required: false,
        maxLength: 400
      },
      {
        key: 'timelineHeading',
        label: 'Zaman Tüneli Başlığı',
        placeholder: 'Zaman Tünelimiz',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Zaman Tünelimiz'
      },
      {
        key: 'timelineIntro',
        label: 'Zaman Tüneli Giriş Mesajı',
        placeholder: 'Hatıraların giriş metni',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Hatıralarımızı kaydırırken her anı yeniden yaşıyoruz.'
      },
      {
        key: 'timelineEntries',
        label: 'Zaman Tüneli Olayları',
        placeholder: 'Yıl|Başlık|Kısa mesaj|Fotoğraf bağlantısı (her satıra bir olay)',
        type: 'textarea',
        required: false,
        maxLength: 1200,
        defaultValue: '2015|İlk Buluşmamız|O yaz akşamında kalbimin sana ait olduğunu anladım.|https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&q=80\n2017|İlk Tatilimiz|Birlikte yeni yerler keşfetmenin heyecanını yaşadık.|https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=640&q=80\n2020|Evet Dediğin An|Gözlerinin içine bakarken dünyamız güzelleşti.|https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=640&q=80\n2023|Yeni Başlangıç|Hayallerimizi aynı sayfada büyütmeye devam ettik.|https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=640&q=80'
      },
      {
        key: 'timelineButtonLabel',
        label: 'Zaman Tüneli Buton Metni',
        placeholder: 'Birlikte Geri Sar',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Birlikte Geri Sar'
      },
      {
        key: 'timelineOutroHeading',
        label: 'Zaman Tüneli Final Başlığı',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'timelineOutroMessage',
        label: 'Zaman Tüneli Final Mesajı',
        placeholder: 'Final mesajınızı yazın',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Seninle geçen her yıldönümü, ışığın camdan süzülüşü gibi zarif ve özel hissettiriyor.'
      },
      {
        key: 'minimalHeading',
        label: 'Minimal Başlık',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'minimalMessage',
        label: 'Minimal Mesaj',
        placeholder: 'Kısa ve anlamlı mesajınız',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Seninle geçen her yıldönümü, ışığın camdan süzülüşü gibi zarif ve özel hissettiriyor.'
      },
      {
        key: 'minimalDateLabel',
        label: 'Minimal Tarih',
        placeholder: '14 Şubat 2024',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: '14 Şubat 2024'
      },
      {
        key: 'minimalButtonLabel',
        label: 'Minimal Buton Metni',
        placeholder: 'Kutlamayı Paylaş',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Kutlamayı Paylaş'
      },
      {
        key: 'minimalFooter',
        label: 'Minimal Alt Mesaj',
        placeholder: 'Bugün, bizim hikayemizin en sevdiğim sayfası.',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Bugün, bizim hikayemizin en sevdiğim sayfası.'
      },
      {
        key: 'minimalCelebrationBadge',
        label: 'Minimal Kutlama Rozeti',
        placeholder: 'Kutlama',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Kutlama'
      },
      {
        key: 'minimalCelebrationTitle',
        label: 'Minimal Kutlama Başlığı',
        placeholder: 'Kutlama Başlıyor!',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Kutlama Başlıyor!'
      },
      {
        key: 'minimalCelebrationSubtitle',
        label: 'Minimal Kutlama Notu',
        placeholder: 'Kutlama sırasında görünecek kısa not',
        type: 'textarea',
        required: false,
        maxLength: 240,
        defaultValue: 'Sevgiyle dolu bu anı birlikte kutluyoruz.'
      },
      {
        key: 'minimalPhotoUrl',
        label: 'Minimal Fotoğraf Bağlantısı',
        placeholder: 'https://... şeklinde kare/yuvarlak fotoğraf adresi',
        type: 'input',
        required: false,
        maxLength: 400
      },
      {
        key: 'funHeading',
        label: 'Kutlama Başlığı',
        placeholder: 'Mutlu Yıl Dönümü',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Mutlu Yıl Dönümü'
      },
      {
        key: 'funSubheading',
        label: 'Kutlama Alt Başlık',
        placeholder: 'Sen + Ben',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Sen + Ben'
      },
      {
        key: 'funMessage',
        label: 'Kutlama Mesajı',
        placeholder: 'Eğlenceli kutlama mesajınız',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Seninle geçen her yıldönümü, ışığın camdan süzülüşü gibi zarif ve özel hissettiriyor.'
      },
      {
        key: 'funPhotoUrl',
        label: 'Kutlama Fotoğrafı Bağlantısı',
        placeholder: 'https://... kutlama fotoğrafı',
        type: 'input',
        required: false,
        maxLength: 400
      },
      {
        key: 'funButtonLabel',
        label: 'Kutlama Buton Metni',
        placeholder: 'Kutlamayı Gör',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Kutlamayı Gör'
      },
      {
        key: 'funConfettiMessage',
        label: 'Konfeti Mesajı',
        placeholder: 'Aşkımız gökyüzünü konfetiye boğuyor!',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Aşkımız gökyüzünü konfetiye boğuyor!'
      },
      {
        key: 'funCelebrationTitle',
        label: 'Kutlama Başlığı (Overlay)',
        placeholder: 'Parti Başlıyor!',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Parti Başlıyor!'
      },
      {
        key: 'funFloatingNote',
        label: 'Yüzen Not',
        placeholder: 'Birlikte nice senelere!',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Birlikte nice senelere!'
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
  'dogum-gunu-kutlama': {
    slug: 'dogum-gunu-kutlama',
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
        key: 'mainMessage',
        label: 'Ana Kutlama Mesajınız',
        placeholder: 'Tüm stillerde kullanılacak ana kutlama mesajınızı yazın',
        type: 'textarea',
        required: true,
        maxLength: 600,
        defaultValue: 'Doğum günün kutlu olsun! Hayatının en güzel yılına giriyor olman muhteşem. Nice mutlu senelere! 🎂✨'
      },
      {
        key: 'musicUrl',
        label: 'YouTube Müzik Linki (İsteğe Bağlı)',
        placeholder: 'https://www.youtube.com/watch?v=... veya video ID',
        type: 'input',
        required: false,
        maxLength: 200
      },
      {
        key: 'pastelTitle',
        label: 'Modern Pastel - Ana Başlık',
        placeholder: 'Örn: Doğum Günün Kutlu Olsun 🎉',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Doğum Günün Kutlu Olsun 🎉'
      },
      {
        key: 'pastelSubtitle',
        label: 'Modern Pastel - Alt Metin',
        placeholder: 'Kısa tebrik mesajınızı yazın',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Bugün senin günün! Tüm dileklerin gerçek olsun 🎂'
      },
      {
        key: 'pastelButtonLabel',
        label: 'Modern Pastel - Buton Metni',
        placeholder: 'Örn: Kutlamayı Başlat 🎂',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Kutlamayı Başlat 🎂'
      },
      {
        key: 'pastelWishText',
        label: 'Modern Pastel - Dilek Metni',
        placeholder: 'Buton sonrası görünecek yazı',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Dileğini Tut! ✨'
      },
      {
        key: 'pastelPhotoUrl',
        label: 'Modern Pastel - Fotoğraf URL',
        placeholder: 'Doğum günü fotoğrafı URL (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'pastelPhotoHint',
        label: 'Modern Pastel - Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı göster butonu metni',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Özel Anıyı Gör'
      },
      {
        key: 'klasikTitle',
        label: 'Klasik Altın - Ana Başlık',
        placeholder: 'Örn: Doğum Günün Kutlu Olsun',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Doğum Günün Kutlu Olsun'
      },
      {
        key: 'klasikSubtitle',
        label: 'Klasik Altın - Alt Metin',
        placeholder: 'Kısa tebrik cümlesi',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Bugün senin günün 💫'
      },
      {
        key: 'klasikButtonLabel',
        label: 'Klasik Altın - Buton Metni',
        placeholder: 'Örn: Sürprizi Gör ✨',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Sürprizi Gör ✨'
      },
      {
        key: 'klasikModalMessage',
        label: 'Klasik Altın - Sürpriz Mesajı',
        placeholder: 'Modal içinde görünecek mesaj',
        type: 'textarea',
        required: false,
        maxLength: 400,
        defaultValue: 'Nice mutlu senelere! Hayatın hep güzel sürprizlerle dolu olsun. 🎂✨'
      },
      {
        key: 'klasikPhotoUrl',
        label: 'Klasik Altın - Fotoğraf URL',
        placeholder: 'Doğum günü fotoğrafı URL (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'klasikPhotoHint',
        label: 'Klasik Altın - Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı göster butonu metni',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Hatırayı Gör'
      },
      {
        key: 'minimalTitle',
        label: 'Minimalist - Ana Başlık',
        placeholder: 'Örn: Doğum Günün Kutlu Olsun 🎂',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Doğum Günün Kutlu Olsun 🎂'
      },
      {
        key: 'minimalSubtitle',
        label: 'Minimalist - Alt Metin',
        placeholder: 'Kısa tebrik satırı',
        type: 'input',
        required: false,
        maxLength: 100,
        defaultValue: 'Mutlu yıllar dilerim!'
      },
      {
        key: 'minimalButtonLabel',
        label: 'Minimalist - Buton İkonu',
        placeholder: 'Örn: 🎈',
        type: 'input',
        required: false,
        maxLength: 10,
        defaultValue: '🎈'
      },
      {
        key: 'minimalWishText',
        label: 'Minimalist - Dilek Metni',
        placeholder: 'Buton sonrası görünecek yazı',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Dileğini tuttun mu?'
      },
      {
        key: 'minimalPhotoUrl',
        label: 'Minimalist - Fotoğraf URL',
        placeholder: 'Polaroid fotoğraf URL (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'minimalPhotoHint',
        label: 'Minimalist - Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı göster butonu metni',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Fotoğraf'
      },
      {
        key: 'partyTitle',
        label: 'Eğlenceli - Ana Başlık',
        placeholder: 'Örn: Sürprizini Aç 🎁',
        type: 'input',
        required: false,
        maxLength: 80,
        defaultValue: 'Sürprizini Aç 🎁'
      },
      {
        key: 'partySubtitle',
        label: 'Eğlenceli - İpucu Metni',
        placeholder: 'Kutunun içindeki sürpriz hakkında ipucu',
        type: 'textarea',
        required: false,
        maxLength: 200,
        defaultValue: 'Kutunun içinde seni bekleyen bir mesaj var!'
      },
      {
        key: 'partyButtonLabel',
        label: 'Eğlenceli - Buton Metni',
        placeholder: 'Örn: Kutuyu Aç 🎉',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Kutuyu Aç 🎉'
      },
      {
        key: 'partyRevealMessage',
        label: 'Eğlenceli - Sürpriz Mesajı',
        placeholder: 'Kutu açıldığında görünecek mesaj',
        type: 'textarea',
        required: false,
        maxLength: 300,
        defaultValue: 'Doğum Günün Kutlu Olsun!'
      },
      {
        key: 'partyPhotoUrl',
        label: 'Eğlenceli - Fotoğraf URL',
        placeholder: 'Sürpriz fotoğraf URL (opsiyonel)',
        type: 'input',
        required: false,
        maxLength: 300
      },
      {
        key: 'partyPhotoHint',
        label: 'Eğlenceli - Fotoğraf Buton Metni',
        placeholder: 'Fotoğrafı göster butonu metni',
        type: 'input',
        required: false,
        maxLength: 60,
        defaultValue: 'Sürpriz Fotoğraf'
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

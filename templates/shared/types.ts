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
        key: 'mainMessage',
        label: 'Teşekkür Mesajınız',
        placeholder: 'Teşekkür mesajınızı yazın...',
        type: 'textarea',
        required: true,
        maxLength: 500,
        defaultValue: 'Hayatımda olduğun için çok şanslıyım. Bana verdiğin destek, sevgi ve anlayış için sana ne kadar teşekkür etsem az. Sen gerçekten çok özelsin ve seni ne kadar takdir ettiğimi bilmeni istiyorum. 🙏💕'
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

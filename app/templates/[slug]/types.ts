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
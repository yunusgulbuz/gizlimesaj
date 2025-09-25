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
        placeholder: 'Başlık|Açıklama|Yıl (her satıra bir hatıra)',
        type: 'textarea',
        required: false,
        maxLength: 800,
        defaultValue: 'Polaroid Fotoğraf|Gülen yüzünün arkasında saklanan heyecanın ilk anı.|2016\nSinema Bileti|İlk film gecemiz; popcorn, kahkahalar ve kalp çarpıntıları.|2018\nEl Yazısı Not|"Sonsuza dek" dediğin o satırlar, kalbime mühür oldu.|2020\nMinik Deniz Kabuğu|Birlikte topladığımız o gün, güneş kadar parlaktın.|2022'
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

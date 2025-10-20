# Template Thumbnails

Bu klasör AI template seçim ekranında gösterilecek thumbnail görsellerini içerir.

## Gerekli Thumbnails

Her base template için bir thumbnail gerekli:

1. `romantic-letter.jpg` - Romantik Mektup (zarflı, gül yaprakları)
2. `glass-modern.jpg` - Cam Efektli Modern (glassmorphism, gradient)
3. `professional-frame.jpg` - Profesyonel Çerçeve (minimalist, beyaz)
4. `gradient-celebration.jpg` - Gradient Kutlama (canlı renkler, konfeti)
5. `elegant-classic.jpg` - Klasik Şık (altın detaylar, çiçekler)
6. `minimalist-modern.jpg` - Minimalist Modern (beyaz arka plan)
7. `playful-fun.jpg` - Eğlenceli Oyunlu (parlak renkler, interaktif)

## Boyut ve Format

- **Boyut:** 360x480px (aspect ratio 3:4)
- **Format:** JPG veya PNG
- **Kalite:** Optimize edilmiş (max 100KB)

## Nasıl Oluşturulur?

### Seçenek 1: Manuel Screenshot
1. Her template'i localhost'ta render edin
2. Browser dev tools ile 360x480 viewport ayarlayın
3. Screenshot alın ve optimize edin

### Seçenek 2: Playwright/Puppeteer
```bash
# Otomatik screenshot script çalıştırın (eğer varsa)
npm run generate-thumbnails
```

### Seçenek 3: Geçici Placeholder
Şimdilik gradient placeholder'lar kullanılıyor (UI'da Sparkles ikonu).
Gerçek screenshot'lar eklenene kadar bu yeterli olacaktır.

## Placeholder Kullanımı

Eğer thumbnail yoksa, UI otomatik olarak gradient + icon gösterir.
Bu yüzden thumbnaillar opsiyoneldir ancak UX için önerilir.

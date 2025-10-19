# 🤖 Yapay Zeka ile Şablon Üretme - Dokümantasyon

Bu özellik, kullanıcıların ChatGPT API kullanarak kendi özel şablon tasarımlarını oluşturmasına olanak tanır.

## 📋 Özellikler

- ✅ ChatGPT API entegrasyonu
- ✅ Kullanıcıya özel şablon oluşturma
- ✅ HTML/CSS/TailwindCSS ile dinamik şablon render
- ✅ Editable text fields (contentEditable)
- ✅ Renk/stil düzenleme desteği
- ✅ Rate limiting (günde 5 şablon)
- ✅ HTML sanitization (XSS koruması)
- ✅ Veritabanında güvenli saklama
- ✅ Preview ve düzenleme sayfası
- ✅ Mevcut ödeme sistemi ile entegrasyon
- ✅ **YENİ:** Creator name şablonun içinde gösterilme (overlay değil)
- ✅ **YENİ:** AI ile şablon iyileştirme/refine özelliği

## 🚀 Kurulum

### 1. Database Migration

Migration dosyası `supabase/migrations/20251019184929_create_ai_generated_templates.sql` konumunda oluşturuldu.

Supabase Dashboard'dan çalıştırın:

```bash
# Veya Supabase CLI ile:
supabase db push
```

### 2. Environment Variables

`.env.local` dosyanıza aşağıdaki değişkeni ekleyin:

```bash
# OpenAI API Key
# https://platform.openai.com/api-keys adresinden alabilirsiniz
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Dependencies

Gerekli paketler zaten kuruldu:
- `openai` - OpenAI SDK
- `isomorphic-dompurify` - HTML sanitization

## 📁 Dosya Yapısı

```
gizlimesaj/
├── app/
│   ├── ai-template-creator/
│   │   └── page.tsx                    # AI şablon oluşturma sayfası
│   ├── api/
│   │   └── ai-templates/
│   │       ├── generate/
│   │       │   └── route.ts            # OpenAI API endpoint
│   │       └── refine/
│   │           └── route.ts            # NEW: Şablon iyileştirme endpoint
│   ├── templates/
│   │   └── [slug]/
│   │       └── preview/
│   │           ├── page.tsx            # Updated: AI template desteği
│   │           └── ai-template-preview.tsx  # AI template preview component (refine UI)
│   └── page.tsx                        # Updated: AI butonu eklendi
├── components/
│   └── ai-template-renderer.tsx        # AI template renderer (creator name injection)
├── lib/
│   ├── ai-prompts.ts                   # ChatGPT prompt library (creator name placeholder)
│   └── sanitize-html.ts                # HTML sanitization utilities
└── supabase/
    └── migrations/
        └── 20251019184929_create_ai_generated_templates.sql
```

## 🎯 Kullanım

### 1. Kullanıcı Akışı

1. Ana sayfada "✨ Yapay Zeka ile Sürpriz Oluştur" butonuna tıkla
2. Kategori seç (romantic, birthday, thank-you, vb.)
3. Şablon başlığı otomatik oluşturulur
4. Detaylı prompt yaz (renkler, stil, duygular, vb.)
5. ChatGPT şablonu oluşturur (20-30 saniye, progress bar ile)
6. `/templates/ai-[slug]/preview` sayfasına yönlendirilir
7. **YENİ:** "İyileştir" butonuna tıklayarak şablonu rafine et
8. Metinleri düzenle (contentEditable)
9. "Kaydet" ile değişiklikleri kaydet
10. Beğendiysen satın al!

### 2. Rate Limiting

- Her kullanıcı günde maksimum **5 AI şablon** oluşturabilir
- 24 saat sonra sıfırlanır
- GET `/api/ai-templates/generate` endpoint'i ile kalan hak sorgulanabilir

### 3. Güvenlik

- ✅ HTML sanitization (DOMPurify)
- ✅ XSS koruması
- ✅ Script tag filtreleme
- ✅ Event handler filtreleme
- ✅ RLS policies (Row Level Security)
- ✅ Kullanıcı ownership kontrolü

## 🔧 API Referansı

### POST `/api/ai-templates/generate`

Yeni AI şablon oluşturur.

**Request Body:**
```json
{
  "title": "Romantik Doğum Günü",
  "category": "romantic",
  "userPrompt": "Sevgilime sürpriz doğum günü mesajı. Kırmızı ve pembe renkler, kalpler ve çiçekler olsun..."
}
```

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "uuid",
    "slug": "ai-abc12345-romantik-dogum-gunu-xyz",
    "title": "Romantik Doğum Günü",
    "category": "romantic"
  },
  "message": "AI template generated successfully!"
}
```

**Errors:**
- `401` - Unauthorized (giriş yapılmamış)
- `429` - Rate limit aşıldı
- `400` - Validation hatası
- `500` - Server/AI hatası

### GET `/api/ai-templates/generate`

Kullanıcının kalan şablon oluşturma hakkını döner.

**Response:**
```json
{
  "limit": 5,
  "used": 2,
  "remaining": 3,
  "canGenerate": true
}
```

### POST `/api/ai-templates/refine` (YENİ)

Mevcut AI şablonunu iyileştirir/rafine eder.

**Request Body:**
```json
{
  "templateId": "uuid",
  "refinePrompt": "Arka plan rengini daha romantik yap, kalp animasyonları ekle"
}
```

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "uuid",
    "slug": "ai-abc12345-romantik-dogum-gunu-xyz",
    "title": "Romantik Doğum Günü",
    "template_code": "<refined HTML>",
    "metadata": { ... }
  },
  "message": "Template refined successfully!"
}
```

**Errors:**
- `401` - Unauthorized (giriş yapılmamış)
- `404` - Template bulunamadı veya kullanıcı sahibi değil
- `400` - Validation hatası (prompt çok kısa/uzun)
- `500` - Server/AI hatası

**Rate Limit:** Refine işlemi rate limit'e dahil değil, kullanıcı kendi şablonlarını istediği kadar iyileştirebilir.

## 📊 Database Schema

### `ai_generated_templates` Table

```sql
- id: UUID (primary key)
- user_id: UUID (foreign key -> auth.users)
- slug: TEXT (unique)
- title: TEXT
- category: TEXT (enum)
- user_prompt: TEXT
- template_code: TEXT (sanitized HTML)
- metadata: JSONB
  {
    "recipientName": "Sevgilim",
    "mainMessage": "...",
    "footerMessage": "...",
    "colorScheme": {
      "primary": "bg-rose-500",
      "secondary": "bg-purple-500",
      ...
    },
    "editableFields": ["recipientName", "mainMessage", ...]
  }
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- is_active: BOOLEAN
```

## 🎨 Prompt Engineering

`lib/ai-prompts.ts` dosyasında her kategori için özel sistem promptları tanımlanmıştır:

```typescript
const CATEGORY_PROMPTS = {
  romantic: "Beautiful, elegant, pink/red colors...",
  birthday: "Festive, balloons, confetti...",
  // ...
}
```

ChatGPT'ye gönderilen final prompt:
```
[SYSTEM_PROMPT]
+ [CATEGORY_PROMPT]
+ [USER_PROMPT]
```

## ⚙️ Customization

### Yeni Kategori Eklemek

`lib/ai-prompts.ts` dosyasında:

```typescript
export const CATEGORY_PROMPTS: Record<string, string> = {
  // ...mevcut kategoriler
  'new-category': `You are creating a ... template. The design should be:
- ...
- ...
  `,
}
```

### Rate Limit Değiştirmek

`app/api/ai-templates/generate/route.ts` dosyasında:

```typescript
const RATE_LIMIT_PER_DAY = 10; // 5'ten 10'a çıkarıldı
```

### ChatGPT Model Değiştirmek

`app/api/ai-templates/generate/route.ts` dosyasında:

**GPT-5 kullanıyorsanız (yeni API):**
```typescript
const response = await openai.responses.create({
  model: 'gpt-5',
  input: fullPrompt,
});
const generatedHTML = response.output_text;
```

**Eski modeller için (GPT-4, GPT-3.5):**
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o', // veya 'gpt-4o-mini', 'gpt-3.5-turbo'
  messages: [{ role: 'user', content: fullPrompt }],
  temperature: 0.8,
  max_tokens: 4000,
});
const generatedHTML = completion.choices[0]?.message?.content;
```

## 🐛 Troubleshooting

### "AI service authentication failed"

- OpenAI API key'inizi kontrol edin
- `.env.local` dosyasında `OPENAI_API_KEY` olduğundan emin olun
- API key'in geçerli olduğunu doğrulayın

### "Rate limit exceeded"

- Kullanıcı 24 saat içinde 5 şablon oluşturmuş
- Beklemesi gerekiyor veya rate limit artırılmalı

### "Template validation failed"

- ChatGPT'den gelen HTML geçersiz olabilir
- `lib/sanitize-html.ts` dosyasındaki validation kurallarını kontrol edin

### Migration hatası

- Supabase Dashboard'dan manuel olarak migration'ı çalıştırın
- `supabase/migrations/20251019184929_create_ai_generated_templates.sql` dosyasını kopyalayıp SQL Editor'e yapıştırın

## 💰 Maliyet

OpenAI API kullanımı:

- **Model**: gpt-5 (varsayılan, en yeni model)
- **API**: Yeni `responses.create()` interface
- **Alternatifler**:
  - gpt-4o (eski chat completions API)
  - gpt-4o-mini (cost-effective)
  - gpt-3.5-turbo (en ucuz)
- **Ortalama input**: ~3000-4000 tokens per request
- **Maliyet**: GPT-5 pricing henüz netleşmedi, test modunda olabilir
- **Günlük maliyet tahmini**: Kullanıma göre değişir

## 🚦 Next Steps

- [x] ~~AI şablon regenerate butonu~~ → **TAMAMLANDI:** Refine/İyileştir özelliği eklendi
- [x] ~~Creator name template içinde gösterilme~~ → **TAMAMLANDI**
- [ ] Admin panelinde AI şablon listesi
- [ ] Template gallery (public AI templates)
- [ ] AI template pricing ayrımı
- [ ] Advanced customization (font selection, animations)
- [ ] Template versioning
- [ ] A/B testing different prompts
- [ ] Refine geçmişi (undo/redo)
- [ ] Rate limit refine için de eklenebilir

## 📝 Notlar

- AI ile oluşturulan şablonlar **kullanıcıya özeldir** (private)
- Ödeme sistemi mevcut şablonlarla aynı şekilde çalışır
- Tek tasarım stili vardır (4 stil değil)
- **YENİ:** "Hazırlayan kişi" şablonun içinde gösterilir ({{CREATOR_NAME}} placeholder ile)
- **YENİ:** Kullanıcı isterse "İyileştir" butonu ile şablonu rafine edebilir
- Preview sayfasında tüm text alanları contentEditable
- HTML sanitization ile XSS koruması sağlanır
- Refine işlemi rate limit'e dahil değil

## 🆘 Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Network tab'de API isteklerini inceleyin
3. Supabase logs'u kontrol edin (`/api/ai-templates/generate` ve `/api/ai-templates/refine` için)
4. `AI_TEMPLATE_README.md` dokümantasyonunu tekrar okuyun

---

## 🔄 Changelog

### v1.1.0 (19 Ekim 2025)
- ✨ **YENİ:** Şablon iyileştirme/refine özelliği eklendi
- ✨ **YENİ:** Creator name şablonun içinde gösterilme (overlay yerine)
- 🐛 Progress bar ile timeout sorunları çözüldü
- 📝 API endpoint: `/api/ai-templates/refine` eklendi
- 🎨 Preview sayfasında collapsible refine panel

### v1.0.0 (19 Ekim 2025)
- 🎉 İlk release
- AI template generation
- Rate limiting
- HTML sanitization
- contentEditable text fields
- Payment integration

---

**Son Güncelleme**: 19 Ekim 2025
**Versiyon**: 1.1.0

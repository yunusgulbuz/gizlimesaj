import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Geçerli bir e-posta adresi giriniz');

export const phoneSchema = z.string().regex(
  /^(\+90|0)?[5][0-9]{9}$/,
  'Geçerli bir telefon numarası giriniz (örn: 05xxxxxxxxx)'
);

export const slugSchema = z.string()
  .min(3, 'Slug en az 3 karakter olmalıdır')
  .max(50, 'Slug en fazla 50 karakter olabilir')
  .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir');

// Personal page validation
export const personalPageSchema = z.object({
  name: z.string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf ve boşluk içerebilir'),
  
  message: z.string()
    .min(10, 'Mesaj en az 10 karakter olmalıdır')
    .max(1000, 'Mesaj en fazla 1000 karakter olabilir'),
  
  templateId: z.string().uuid('Geçerli bir şablon seçiniz'),
  
  duration: z.number()
    .min(1, 'Süre en az 1 gün olmalıdır')
    .max(365, 'Süre en fazla 365 gün olabilir'),
  
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
});

// Template validation
export const templateSchema = z.object({
  title: z.string()
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(100, 'Başlık en fazla 100 karakter olabilir'),
  
  description: z.string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(500, 'Açıklama en fazla 500 karakter olabilir'),
  
  content: z.string()
    .min(50, 'İçerik en az 50 karakter olmalıdır')
    .max(5000, 'İçerik en fazla 5000 karakter olabilir'),
  
  audience: z.enum(['romantic', 'friendship', 'family', 'professional'], {
    message: 'Geçerli bir hedef kitle seçiniz'
  }),
  
  category: z.string()
    .min(2, 'Kategori en az 2 karakter olmalıdır')
    .max(50, 'Kategori en fazla 50 karakter olabilir'),
  
  tags: z.array(z.string().max(30, 'Etiket en fazla 30 karakter olabilir'))
    .max(10, 'En fazla 10 etiket ekleyebilirsiniz'),
  
  slug: slugSchema,
  
  isActive: z.boolean().default(true),
  isPremium: z.boolean().default(false),
});

// Payment validation
export const paymentSchema = z.object({
  personalPageId: z.string().uuid('Geçerli bir sayfa ID\'si gereklidir'),
  amount: z.number()
    .min(1, 'Tutar en az 1 TL olmalıdır')
    .max(10000, 'Tutar en fazla 10.000 TL olabilir'),
  currency: z.enum(['TRY', 'USD', 'EUR']).default('TRY'),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir'),
  
  email: emailSchema,
  
  subject: z.string()
    .min(5, 'Konu en az 5 karakter olmalıdır')
    .max(100, 'Konu en fazla 100 karakter olabilir'),
  
  message: z.string()
    .min(20, 'Mesaj en az 20 karakter olmalıdır')
    .max(1000, 'Mesaj en fazla 1000 karakter olabilir'),
});

// Sanitization functions
export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Validation helper function
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Geçersiz veri formatı'] };
  }
}
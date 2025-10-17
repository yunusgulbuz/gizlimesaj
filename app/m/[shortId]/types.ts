export interface PersonalPageShareMeta {
  title?: string;
  description?: string;
  siteName?: string;
  image?: string;
}

export interface PersonalPageData {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  template_title: string;
  template_slug: string;
  template_audience: string | string[];
  template_preview_url: string | null;
  template_bg_audio_url: string | null;
  bg_audio_url: string | null;
  design_style: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  text_fields: Record<string, string>;
  expires_at: string;
  special_date: string | null;
  is_active: boolean;
  duration_days?: number;
  share_preview_meta?: PersonalPageShareMeta | null;
}

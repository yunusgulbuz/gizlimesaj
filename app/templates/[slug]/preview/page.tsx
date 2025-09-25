import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import PreviewClient from './preview-client';

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
  preview_url: string | null;
  bg_audio_url: string | null;
  description: string | null;
}

async function getTemplate(slug: string): Promise<Template | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !template) {
    return null;
  }

  return template;
}

interface TemplatePreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TemplatePage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient();
  
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (error || !template) {
    notFound();
  }

  return (
    <PreviewClient template={template} />
  );
}

export async function generateMetadata({ params }: TemplatePreviewPageProps) {
  const { slug } = await params;
  const template = await getTemplate(slug);
  
  if (!template) {
    return {
      title: 'Şablon Bulunamadı',
    };
  }

  return {
    title: `${template.title} - Tam Ekran Önizleme | Gizli Mesaj`,
    description: template.description || `${template.title} şablonunun tam ekran önizlemesi`,
  };
}
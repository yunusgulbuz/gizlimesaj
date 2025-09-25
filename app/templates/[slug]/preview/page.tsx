import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getTemplateEntry } from '@/templates';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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

export default async function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const templateEntry = getTemplateEntry(slug);

  if (!templateEntry) {
    notFound();
  }

  const template = await getTemplate(slug);

  if (!template) {
    notFound();
  }

  const PreviewComponent = templateEntry.preview;

  return <PreviewComponent template={template} />;
}

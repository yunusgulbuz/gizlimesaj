import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getTemplateEntry } from '@/templates';
import AITemplatePreview from './ai-template-preview';

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

async function getDurations() {
  const supabase = await createServerSupabaseClient();

  const { data: durations } = await supabase
    .from('durations')
    .select('id, label, days')
    .eq('is_active', true)
    .order('days', { ascending: true });

  return durations || [];
}

async function getTemplatePricing(templateId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: pricing } = await supabase
    .from('template_pricing')
    .select('*')
    .eq('template_id', templateId)
    .eq('is_active', true);

  return pricing || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Check if it's an AI template
  if (slug.startsWith('ai-')) {
    return {
      title: 'AI Şablon Önizleme - Tam Ekran | Gizli Mesaj',
      description: 'Yapay zeka ile oluşturulan şablonun tam ekran önizlemesi',
    };
  }

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

  // Check if it's an AI-generated template
  if (slug.startsWith('ai-')) {
    return <AITemplatePreview slug={slug} />;
  }

  // Regular template handling
  const templateEntry = getTemplateEntry(slug);

  if (!templateEntry) {
    notFound();
  }

  const template = await getTemplate(slug);

  if (!template) {
    notFound();
  }

  const durations = await getDurations();
  const templatePricing = await getTemplatePricing(template.id);

  const PreviewComponent = templateEntry.preview;

  return (
    <PreviewComponent
      template={template}
      durations={durations}
      templatePricing={templatePricing}
    />
  );
}

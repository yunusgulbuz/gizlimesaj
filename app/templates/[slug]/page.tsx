import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateTemplateMetadata } from "@/lib/seo";
import { getTemplateEntry } from "@/templates";

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant' | string[];
  preview_url: string | null;
  bg_audio_url: string | null;
  description: string | null;
}

interface Duration {
  id: number;
  label: string;
  days: number;
}

interface TemplatePricing {
  id: number;
  template_id: string;
  duration_id: number;
  price_try: string;
  is_active: boolean;
}

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
};



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

async function getDurations(): Promise<Duration[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data: durations, error } = await supabase
    .from('durations')
    .select('id, label, days')
    .eq('is_active', true)
    .order('days', { ascending: true });

  if (error) {
    console.error('Error fetching durations:', error);
    return [];
  }

  return durations || [];
}

async function getTemplatePricing(templateId: string): Promise<TemplatePricing[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data: pricing, error } = await supabase
    .from('template_pricing')
    .select('*')
    .eq('template_id', templateId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching template pricing:', error);
    return [];
  }

  return pricing || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await getTemplate(slug);
  
  if (!template) {
    return {
      title: 'Şablon Bulunamadı',
    };
  }

  const audienceKey = Array.isArray(template.audience)
    ? (template.audience.find((item): item is keyof typeof audienceLabels => item in audienceLabels) ?? 'adult')
    : (template.audience as keyof typeof audienceLabels | undefined);

  const audienceLabel = audienceLabels[audienceKey ?? 'adult']?.label ?? 'Özel';

  return generateTemplateMetadata(
    template.title,
    audienceLabel,
    template.preview_url || undefined
  );
}

export default async function TemplateDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const templateEntry = getTemplateEntry(slug);

  if (!templateEntry) {
    notFound();
  }

  const template = await getTemplate(slug);
  const durations = await getDurations();
  const templatePricing = template ? await getTemplatePricing(template.id) : [];
  
  if (!template) {
    notFound();
  }

  const isPreview = searchParamsResolved?.preview === 'true';

  const FormComponent = templateEntry.form;

  return (
    <FormComponent 
      template={template}
      durations={durations}
      templatePricing={templatePricing}
      isPreview={isPreview}
    />
  );
}

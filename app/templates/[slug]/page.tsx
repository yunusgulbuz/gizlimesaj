import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateTemplateMetadata } from "@/lib/seo";
import ClientTemplatePage from "./client-page";

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
  preview_url: string | null;
  bg_audio_url: string | null;
  description: string | null;
}

interface Duration {
  id: string;
  name: string;
  hours: number;
  price: number;
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
    .select('*')
    .eq('is_active', true)
    .order('hours', { ascending: true });

  if (error) {
    console.error('Error fetching durations:', error);
    return [];
  }

  return durations || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await getTemplate(slug);
  
  if (!template) {
    return {
      title: 'Şablon Bulunamadı',
    };
  }

  return generateTemplateMetadata(
    template.title,
    audienceLabels[template.audience].label
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
  const template = await getTemplate(slug);
  const durations = await getDurations();
  
  if (!template) {
    notFound();
  }

  const isPreview = searchParamsResolved?.preview === 'true';

  return <ClientTemplatePage template={template} durations={durations} isPreview={isPreview} />;
}
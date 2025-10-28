import PricingContent from './_components/pricing-content';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch active credit packages from database
  const { data: packages } = await supabase
    .from('ai_credit_packages')
    .select('*')
    .eq('is_active', true)
    .order('credits', { ascending: true });

  return <PricingContent packages={packages || []} />;
}

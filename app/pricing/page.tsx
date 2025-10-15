import { createServerSupabaseClient } from '@/lib/supabase-server';
import PricingContent from './_components/pricing-content';

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PricingContent initialUser={user} />;
}

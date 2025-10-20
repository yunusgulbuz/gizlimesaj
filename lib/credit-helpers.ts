import { createServerSupabaseClient } from './supabase-server';

export interface UserCredits {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  canUseAI: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  subtitle: string;
  credits: number;
  price: number;
  isPopular: boolean;
}

/**
 * Get user's AI credit balance
 */
export async function getUserCredits(userId: string): Promise<UserCredits> {
  const supabase = await createServerSupabaseClient();

  // Get user's credit balance
  let { data: credits, error } = await supabase
    .from('user_ai_credits')
    .select('total_credits, used_credits, remaining_credits')
    .eq('user_id', userId)
    .single();

  // If user doesn't have a credit record yet, create one with 1 free credit
  if (error || !credits) {
    const { error: insertError } = await supabase
      .from('user_ai_credits')
      .insert({
        user_id: userId,
        total_credits: 1,
        used_credits: 0,
        remaining_credits: 1,
      });

    if (insertError) {
      console.error('Failed to initialize user credits:', insertError);
      // Return zero credits if we can't initialize
      return {
        totalCredits: 0,
        usedCredits: 0,
        remainingCredits: 0,
        canUseAI: false,
      };
    }

    // Record the free credit transaction
    await supabase
      .from('user_credit_transactions')
      .insert({
        user_id: userId,
        type: 'bonus',
        credits: 1,
        description: 'Ücretsiz başlangıç kredisi',
      });

    credits = {
      total_credits: 1,
      used_credits: 0,
      remaining_credits: 1,
    };
  }

  return {
    totalCredits: credits.total_credits || 0,
    usedCredits: credits.used_credits || 0,
    remainingCredits: credits.remaining_credits || 0,
    canUseAI: (credits.remaining_credits || 0) > 0,
  };
}

/**
 * Check if user can use AI (has credits)
 */
export async function canUseAI(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const credits = await getUserCredits(userId);

  if (!credits.canUseAI) {
    return {
      allowed: false,
      reason: `AI kullanım krediniz kalmadı. Yeni kredi paketi satın alarak devam edebilirsiniz. (Kalan: ${credits.remainingCredits})`,
    };
  }

  return { allowed: true };
}

/**
 * Use one AI credit (for generate or refine)
 */
export async function useAICredit(
  userId: string,
  templateId?: string,
  description?: string
): Promise<{ success: boolean; remainingCredits: number }> {
  const supabase = await createServerSupabaseClient();

  // Call the database function to use credit
  const { data, error } = await supabase.rpc('use_user_credit', {
    p_user_id: userId,
    p_template_id: templateId || null,
    p_description: description || 'AI template işlemi',
  });

  if (error || !data) {
    console.error('Failed to use credit:', error);
    return { success: false, remainingCredits: 0 };
  }

  // Get updated balance
  const credits = await getUserCredits(userId);

  return {
    success: true,
    remainingCredits: credits.remainingCredits,
  };
}

/**
 * Add credits to user account (after purchase)
 */
export async function addCredits(
  userId: string,
  credits: number,
  orderId?: string,
  description?: string
): Promise<{ success: boolean; newBalance: number }> {
  const supabase = await createServerSupabaseClient();

  // Call the database function to add credits
  const { error } = await supabase.rpc('add_user_credits', {
    p_user_id: userId,
    p_credits: credits,
    p_order_id: orderId || null,
    p_description: description || `${credits} AI kredisi satın alındı`,
  });

  if (error) {
    console.error('Failed to add credits:', error);
    return { success: false, newBalance: 0 };
  }

  // Get updated balance
  const userCredits = await getUserCredits(userId);

  return {
    success: true,
    newBalance: userCredits.remainingCredits,
  };
}

/**
 * Get available credit packages
 */
export async function getCreditPackages(): Promise<CreditPackage[]> {
  const supabase = await createServerSupabaseClient();

  const { data: packages, error } = await supabase
    .from('ai_credit_packages')
    .select('id, name, subtitle, credits, price, is_popular')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error || !packages) {
    console.error('Failed to get credit packages:', error);
    return [];
  }

  return packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    subtitle: pkg.subtitle || '',
    credits: pkg.credits,
    price: pkg.price,
    isPopular: pkg.is_popular || false,
  }));
}

/**
 * Get credit transaction history for a user
 */
export async function getCreditTransactions(userId: string, limit: number = 50) {
  const supabase = await createServerSupabaseClient();

  const { data: transactions, error } = await supabase
    .from('user_credit_transactions')
    .select('id, type, credits, description, created_at, order_id, template_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to get credit transactions:', error);
    return [];
  }

  return transactions || [];
}

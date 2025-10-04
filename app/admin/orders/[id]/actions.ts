'use server';

import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(
  orderId: string,
  newStatus: 'pending' | 'completed' | 'failed' | 'canceled'
) {
  try {
    const supabase = await createAuthSupabaseClient();

    // Update the order status
    const { error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }

    // Revalidate the admin orders pages
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Beklenmeyen bir hata oluştu' };
  }
}

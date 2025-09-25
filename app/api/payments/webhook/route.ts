import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

interface WebhookPayload {
  order_id: string;
  status: 'success' | 'failed' | 'cancelled';
  payment_id?: string;
  amount?: number;
  currency?: string;
  provider?: string;
}

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would verify the webhook signature here
    // to ensure it's coming from your payment provider
    
    const body: WebhookPayload = await request.json();
    const { order_id, status, payment_id, amount, currency = 'TRY', provider = 'stripe' } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'Missing required webhook data' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (status === 'success') {
      // Payment successful - create personal page and update order
      const { error: personalPageError } = await supabase
        .from('personal_pages')
        .insert({
          short_id: order.short_id,
          template_id: order.template_id,
          recipient_name: order.recipient_name,
          sender_name: order.sender_name,
          message: order.message,
          special_date: order.special_date,
          expires_at: order.expires_at,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (personalPageError) {
        console.error('Personal page creation error:', personalPageError);
        return NextResponse.json(
          { error: 'Failed to create personal page' },
          { status: 500 }
        );
      }

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          payment_id,
          paid_amount: amount,
          paid_currency: currency,
          payment_provider: provider,
          completed_at: new Date().toISOString()
        })
        .eq('id', order_id);

      if (updateError) {
        console.error('Order update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }

      // TODO: Send confirmation email to sender
      // TODO: Send notification email to recipient (optional)

    } else {
      // Payment failed or cancelled
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: status === 'failed' ? 'failed' : 'cancelled',
          payment_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', order_id);

      if (updateError) {
        console.error('Order update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
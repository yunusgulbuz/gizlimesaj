import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAdmin } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Get all durations to process pricing
    const { data: durations, error: durationsError } = await supabase
      .from('durations')
      .select('id, label')
      .eq('is_active', true);

    if (durationsError || !durations) {
      return NextResponse.json(
        { error: 'Failed to fetch durations' },
        { status: 500 }
      );
    }

    // Process each duration's pricing
    const updates = [];
    for (const duration of durations) {
      const price = formData.get(`price_${duration.id}`);
      const oldPrice = formData.get(`old_price_${duration.id}`);

      if (!price) continue;

      const pricingData = {
        duration_id: duration.id,
        price_try: parseFloat(price as string),
        old_price: oldPrice && (oldPrice as string).trim() !== '' ? parseFloat(oldPrice as string) : null,
        is_active: true,
      };

      // Upsert (insert or update)
      const { error: upsertError } = await supabase
        .from('ai_template_pricing')
        .upsert(pricingData, {
          onConflict: 'duration_id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('Error upserting pricing:', upsertError);
        return NextResponse.json(
          { error: `Failed to update pricing for ${duration.label}` },
          { status: 500 }
        );
      }

      updates.push(duration.label);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Pricing updated for ${updates.length} durations`,
        updated: updates,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating AI template pricing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: pricing, error } = await supabase
      .from('ai_template_pricing')
      .select(`
        *,
        duration:durations(label, days)
      `)
      .eq('is_active', true)
      .order('duration_id');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch pricing' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { pricing },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching AI template pricing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

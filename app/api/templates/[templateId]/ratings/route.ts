import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { apiRateLimit } from '@/lib/rateLimit';

// GET - Belirli bir şablonun puanlamalarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { templateId } = await params;
    const supabase = await createServerSupabaseClient();

    // Şablon istatistiklerini getir
    const { data: stats, error: statsError } = await supabase
      .from('template_stats')
      .select('*')
      .eq('id', templateId)
      .single();

    if (statsError) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Kullanıcının bu şablona verdiği puanı kontrol et
    const { data: { user } } = await supabase.auth.getUser();
    let userRating = null;

    if (user) {
      const { data: userRatingData } = await supabase
        .from('template_ratings')
        .select('rating')
        .eq('template_id', templateId)
        .eq('user_id', user.id)
        .single();

      userRating = userRatingData?.rating || null;
    }

    return NextResponse.json({
      templateId,
      averageRating: parseFloat(stats.average_rating) || 0,
      totalRatings: stats.total_ratings || 0,
      userRating
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Yeni puan ver veya mevcut puanı güncelle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { templateId } = await params;
    const body = await request.json();
    const { rating } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Kullanıcı authentication kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Şablonun var olup olmadığını kontrol et
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id')
      .eq('id', templateId)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Puanı ekle veya güncelle (upsert)
    const { data, error } = await supabase
      .from('template_ratings')
      .upsert({
        template_id: templateId,
        user_id: user.id,
        rating: rating
      }, {
        onConflict: 'template_id,user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving rating:', error);
      return NextResponse.json(
        { error: 'Failed to save rating' },
        { status: 500 }
      );
    }

    // Güncellenmiş istatistikleri getir
    const { data: updatedStats } = await supabase
      .from('template_stats')
      .select('*')
      .eq('id', templateId)
      .single();

    return NextResponse.json({
      success: true,
      rating: data.rating,
      averageRating: parseFloat(updatedStats?.average_rating) || 0,
      totalRatings: updatedStats?.total_ratings || 0
    });

  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Puanı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { templateId } = await params;
    const supabase = await createServerSupabaseClient();

    // Kullanıcı authentication kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Puanı sil
    const { error } = await supabase
      .from('template_ratings')
      .delete()
      .eq('template_id', templateId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting rating:', error);
      return NextResponse.json(
        { error: 'Failed to delete rating' },
        { status: 500 }
      );
    }

    // Güncellenmiş istatistikleri getir
    const { data: updatedStats } = await supabase
      .from('template_stats')
      .select('*')
      .eq('id', templateId)
      .single();

    return NextResponse.json({
      success: true,
      averageRating: parseFloat(updatedStats?.average_rating) || 0,
      totalRatings: updatedStats?.total_ratings || 0
    });

  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
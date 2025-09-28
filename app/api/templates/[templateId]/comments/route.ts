import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { apiRateLimit } from '@/lib/rateLimit';

// GET - Belirli bir şablonun yorumlarını getir
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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;

    const supabase = await createServerSupabaseClient();

    // Yorumları getir (kullanıcı bilgileri ve beğeni sayısı ile birlikte)
    const { data: comments, error } = await supabase
      .from('template_comments_with_user')
      .select('*')
      .eq('template_id', templateId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    // Toplam yorum sayısını getir
    const { count, error: countError } = await supabase
      .from('template_comments_with_user')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', templateId);

    if (countError) {
      console.error('Error counting comments:', countError);
    }

    return NextResponse.json({
      comments: comments || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Yeni yorum ekle
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
    const { comment } = body;

    // Validation
    if (!comment || typeof comment !== 'string') {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    const trimmedComment = comment.trim();
    if (trimmedComment.length < 10 || trimmedComment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 1000 characters' },
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

    // Kullanıcının bu şablona daha önce yorum yapıp yapmadığını kontrol et
    const { data: existingComment } = await supabase
      .from('template_comments')
      .select('id')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .single();

    if (existingComment) {
      return NextResponse.json(
        { error: 'Bu şablona zaten yorum yapmışsınız. Her şablona sadece bir yorum yapabilirsiniz.' },
        { status: 409 }
      );
    }

    // Yorumu ekle
    const { data, error } = await supabase
      .from('template_comments')
      .insert({
        template_id: templateId,
        user_id: user.id,
        comment: trimmedComment
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving comment:', error);
      return NextResponse.json(
        { error: 'Failed to save comment' },
        { status: 500 }
      );
    }

    // Kullanıcı bilgileri ile birlikte yorumu getir
    const { data: commentWithUser } = await supabase
      .from('template_comments_with_user')
      .select('*')
      .eq('id', data.id)
      .single();

    return NextResponse.json({
      success: true,
      comment: commentWithUser
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
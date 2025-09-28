import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { apiRateLimit } from '@/lib/rateLimit';

// POST - Yorumu beğen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; commentId: string }> }
) {
  try {
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { commentId } = await params;
    const supabase = await createServerSupabaseClient();

    // Kullanıcı authentication kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Yorumun var olup olmadığını kontrol et
    const { data: comment, error: commentError } = await supabase
      .from('template_comments')
      .select('id')
      .eq('id', commentId)
      .eq('is_approved', true)
      .single();

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Beğeniyi ekle (eğer zaten beğenmişse hata vermez, unique constraint sayesinde)
    const { data, error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      // Eğer zaten beğenmişse
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Comment already liked' },
          { status: 409 }
        );
      }
      console.error('Error liking comment:', error);
      return NextResponse.json(
        { error: 'Failed to like comment' },
        { status: 500 }
      );
    }

    // Güncellenmiş beğeni sayısını getir
    const { count } = await supabase
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    return NextResponse.json({
      success: true,
      liked: true,
      likeCount: count || 0
    });

  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Yorumu beğenmekten vazgeç
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; commentId: string }> }
) {
  try {
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { commentId } = await params;
    const supabase = await createServerSupabaseClient();

    // Kullanıcı authentication kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Beğeniyi sil
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error unliking comment:', error);
      return NextResponse.json(
        { error: 'Failed to unlike comment' },
        { status: 500 }
      );
    }

    // Güncellenmiş beğeni sayısını getir
    const { count } = await supabase
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    return NextResponse.json({
      success: true,
      liked: false,
      likeCount: count || 0
    });

  } catch (error) {
    console.error('Error unliking comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
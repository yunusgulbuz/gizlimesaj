import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { apiRateLimit } from '@/lib/rateLimit';

// PUT - Yorumu güncelle
export async function PUT(
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

    // Yorumu güncelle (RLS policy otomatik olarak sadece kendi yorumunu güncellemesine izin verir)
    const { data, error } = await supabase
      .from('template_comments')
      .update({
        comment: trimmedComment
      })
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Comment not found or unauthorized' },
        { status: 404 }
      );
    }

    // Güncellenmiş yorumu kullanıcı bilgileri ile birlikte getir
    const { data: commentWithUser } = await supabase
      .from('template_comments_with_user')
      .select('*')
      .eq('id', commentId)
      .single();

    return NextResponse.json({
      success: true,
      comment: commentWithUser
    });

  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Yorumu sil
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

    // Yorumu sil (RLS policy otomatik olarak sadece kendi yorumunu silmesine izin verir)
    const { error } = await supabase
      .from('template_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json(
        { error: 'Comment not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
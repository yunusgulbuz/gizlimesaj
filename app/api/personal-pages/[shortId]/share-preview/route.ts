import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;
    const supabase = await createServerSupabaseClient();

    // Get the personal page
    const { data: personalPage, error: pageError } = await supabase
      .from('personal_pages')
      .select('id, order_id, share_preview_meta')
      .eq('short_id', shortId)
      .single();

    if (pageError || !personalPage) {
      return NextResponse.json(
        { error: 'Personal page not found' },
        { status: 404 }
      );
    }

    // Optional: Check if the user owns this page (only if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // User is logged in, verify ownership
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', personalPage.order_id)
        .single();

      if (!orderError && order && order.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden - You do not own this page' },
          { status: 403 }
        );
      }
    }
    // If user is not logged in, allow update (for users accessing from success page without login)

    // Parse the request body
    const body = await request.json();
    const {
      sharePreviewTitle,
      sharePreviewDescription,
      sharePreviewSiteName,
      sharePreviewImage,
      sharePreviewCategory,
      sharePreviewPresetId,
      sharePreviewCustom
    } = body;

    // Validate required fields
    if (!sharePreviewTitle || !sharePreviewDescription) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Update the share_preview_meta with new data
    const sharePreviewMeta = {
      title: sharePreviewTitle,
      description: sharePreviewDescription,
      siteName: sharePreviewSiteName,
      image: sharePreviewImage,
      category: sharePreviewCategory,
      presetId: sharePreviewPresetId,
      isCustom: sharePreviewCustom,
      updatedAt: new Date().toISOString()
    };

    console.log('📝 Updating personal page:', {
      id: personalPage.id,
      shortId,
      oldMeta: personalPage.share_preview_meta,
      newMeta: sharePreviewMeta
    });

    // Update ONLY the share_preview_meta column
    const { data: updateData, error: updateError } = await supabase
      .from('personal_pages')
      .update({ share_preview_meta: sharePreviewMeta })
      .eq('id', personalPage.id)
      .select();

    console.log('💾 Update result:', {
      data: updateData,
      error: updateError
    });

    if (updateError) {
      console.error('❌ Failed to update personal page:', updateError);
      return NextResponse.json(
        { error: 'Failed to update share preview settings', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Share preview settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating share preview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

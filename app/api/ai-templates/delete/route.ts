import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to delete AI templates.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { templateId } = body;

    // Validate input
    if (!templateId || typeof templateId !== 'string') {
      return NextResponse.json(
        { error: 'Template ID is required.' },
        { status: 400 }
      );
    }

    // Check if template exists and belongs to user
    const { data: template, error: fetchError } = await supabase
      .from('ai_generated_templates')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !template) {
      return NextResponse.json(
        { error: 'Template not found or you do not have permission to delete it.' },
        { status: 404 }
      );
    }

    // Soft delete: Mark as deleted instead of hard delete
    const { error: deleteError } = await supabase
      .from('ai_generated_templates')
      .update({
        status: 'deleted',
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete template. Please try again.' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully. You can now create a new template.',
    });

  } catch (error: any) {
    console.error('AI template deletion error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

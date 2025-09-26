import { NextResponse } from 'next/server';
import type { Session } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

interface AuthCallbackBody {
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';
  session: Session | null;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { event, session }: AuthCallbackBody = await request.json();

  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
    await supabase.auth.setSession(session);
  }

  if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ success: true });
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import SignOutButton from './sign-out-button';

export default async function HeaderAuthButton() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link href="/login">Giriş Yap</Link>
      </Button>
    );
  }

  const displayName =
    session.user.user_metadata?.name || session.user.email || 'Profil';

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[12rem] truncate text-sm text-gray-600 md:inline">
        {displayName}
      </span>
      <SignOutButton variant="ghost" />
    </div>
  );
}

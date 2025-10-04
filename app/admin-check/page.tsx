import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

export default async function AdminCheckPage() {
  const supabase = await createAuthSupabaseClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  let adminData = null;
  let adminError = null;

  if (user) {
    const result = await supabase
      .from('admins')
      .select('user_id, role')
      .eq('user_id', user.id)
      .single();

    adminData = result.data;
    adminError = result.error;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Check Debug</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">User Data:</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">User Error:</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(userError, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Admin Data:</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(adminData, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Admin Error:</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(adminError, null, 2)}</pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-bold">Is Admin?</h2>
          <p className="text-lg">{user && adminData && adminData.role === 'admin' ? '✅ YES' : '❌ NO'}</p>
        </div>
      </div>
    </div>
  );
}

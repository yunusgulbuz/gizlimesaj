import { createAuthSupabaseClient } from './supabase-auth-server';

/**
 * Checks if the current user is an admin
 * @returns boolean - true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createAuthSupabaseClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return false;
    }

    // Check if user is in admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('user_id, role')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminData) {
      return false;
    }

    return adminData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Gets the current admin user details
 * @returns Admin user data or null
 */
export async function getAdminUser() {
  try {
    const supabase = await createAuthSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('user_id, role')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminData) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: adminData.role
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let userProfile = null;
  if (authUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single();

    userProfile = {
      id: authUser.id,
      email: authUser.email ?? '',
      name: authUser.user_metadata?.full_name ?? '',
      role: profile?.role ?? 'viewer',
    };
  }

  return (
    <AdminLayoutClient user={userProfile}>
      {children}
    </AdminLayoutClient>
  );
}

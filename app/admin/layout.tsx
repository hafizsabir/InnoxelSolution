// @ts-nocheck
import { Box } from '@mui/material';
import { createClient } from '@/lib/supabase/server';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader user={userProfile} pageTitle="Admin Panel" />
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

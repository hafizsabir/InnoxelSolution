// @ts-nocheck
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar, { SIDEBAR_WIDTH } from '@/components/admin/AdminSidebar';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: { id: string; email: string; name: string; role: string } | null;
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader
        user={user}
        pageTitle="Admin Panel"
        onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
      />
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

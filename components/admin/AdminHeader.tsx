// @ts-nocheck
'use client';

import {
  AppBar, Toolbar, Typography, Box, Avatar, Chip, IconButton, Tooltip,
} from '@mui/material';
import { FlashOn, LogoutOutlined, LightMode, DarkMode, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useColorMode } from '@/theme/ThemeRegistry';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  user: { email: string; name: string; role: string } | null;
  pageTitle?: string;
  onMobileMenuToggle?: () => void;
}

export default function AdminHeader({ user, pageTitle = 'Admin', onMobileMenuToggle }: AdminHeaderProps) {
  const { toggleColorMode, mode } = useColorMode();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        {/* Mobile menu button */}
        {onMobileMenuToggle && (
          <IconButton
            onClick={onMobileMenuToggle}
            color="inherit"
            size="small"
            sx={{ mr: 1, display: { md: 'none' }, color: 'text.primary' }}
            aria-label="Open admin menu"
          >
            <MenuIcon />
          </IconButton>
        )}

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, background: 'linear-gradient(135deg, #4361ee, #7209b7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlashOn sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #4361ee, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: { xs: 'none', sm: 'block' } }}>
            Innoxel
          </Typography>
        </Link>

        <Box sx={{ mx: 2, height: 20, width: 1, bgcolor: 'divider', display: { xs: 'none', sm: 'block' } }} />

        <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleColorMode} size="small">
              {mode === 'dark' ? <LightMode sx={{ fontSize: 20, color: 'text.secondary' }} /> : <DarkMode sx={{ fontSize: 20, color: 'text.secondary' }} />}
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Avatar
                sx={{ width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700, background: 'linear-gradient(135deg, #4361ee, #7209b7)', cursor: 'default' }}
              >
                {(user.name || user.email).slice(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="caption" fontWeight={700} color="text.primary" display="block" sx={{ lineHeight: 1.2 }}>
                  {user.name || user.email}
                </Typography>
                <Chip label={user.role} size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(67,97,238,0.1)', color: 'primary.main' }} />
              </Box>
              <Tooltip title="Sign out">
                <IconButton onClick={handleLogout} size="small">
                  <LogoutOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

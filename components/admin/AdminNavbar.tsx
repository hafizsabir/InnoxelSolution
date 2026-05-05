// @ts-nocheck
'use client';

import {
  AppBar, Toolbar, Typography, Button, Box, Chip, IconButton, Tooltip,
} from '@mui/material';
import {
  FlashOn, DashboardOutlined, AddCircle, OpenInNew, LightMode, DarkMode,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useColorMode } from '@/theme/ThemeRegistry';

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: <DashboardOutlined sx={{ fontSize: 16 }} /> },
  { label: 'New Post', href: '/admin/new', icon: <AddCircle sx={{ fontSize: 16 }} /> },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const { toggleColorMode, mode } = useColorMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, background: 'linear-gradient(135deg, #4361ee, #7209b7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlashOn sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #4361ee, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Innoxel
          </Typography>
        </Link>

        <Chip label="Admin" size="small" sx={{ ml: 1.5, fontWeight: 700, fontSize: '0.65rem', background: 'linear-gradient(135deg, #4361ee22, #7209b722)', color: 'primary.main', border: '1px solid rgba(67,97,238,0.3)' }} />

        <Box sx={{ flexGrow: 1 }} />

        {/* Admin nav links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {adminLinks.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              startIcon={link.icon}
              sx={{
                color: pathname === link.href ? 'primary.main' : 'text.secondary',
                fontWeight: pathname === link.href ? 700 : 500,
                fontSize: '0.875rem',
                bgcolor: pathname === link.href ? 'rgba(67,97,238,0.08)' : 'transparent',
                '&:hover': { color: 'primary.main', bgcolor: 'rgba(67,97,238,0.06)' },
              }}
            >
              {link.label}
            </Button>
          ))}

          <Tooltip title="View site">
            <Button
              component={Link}
              href="/techblog"
              target="_blank"
              startIcon={<OpenInNew sx={{ fontSize: 15 }} />}
              sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.875rem', ml: 1 }}
            >
              View Site
            </Button>
          </Tooltip>

          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleColorMode} size="small" sx={{ ml: 0.5 }}>
              {mode === 'dark' ? <LightMode sx={{ color: 'text.secondary', fontSize: 20 }} /> : <DarkMode sx={{ color: 'text.secondary', fontSize: 20 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

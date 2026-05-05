// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Slide,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  LightMode,
  DarkMode,
  FlashOn,
  AdminPanelSettings,
  LogoutOutlined,
} from '@mui/icons-material';
import { useColorMode } from '@/theme/ThemeRegistry';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'TechBlog', href: '/techblog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleColorMode, mode } = useColorMode();
  const pathname = usePathname();
  const trigger = useScrollTrigger({ threshold: 50 });
  const [user, setUser] = useState<{ role: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: trigger
            ? (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(13, 15, 26, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)'
            : 'transparent',
          backdropFilter: trigger ? 'blur(20px)' : 'none',
          borderBottom: trigger ? '1px solid' : 'none',
          borderColor: 'divider',
          transition: 'all 0.35s ease',
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexGrow: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FlashOn sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.01em',
              }}
            >
              Innoxel
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  color: pathname === link.href ? 'primary.main' : 'text.secondary',
                  fontWeight: pathname === link.href ? 700 : 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: pathname === link.href ? '60%' : '0%',
                    height: 2,
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': { width: '60%' },
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                {link.label}
              </Button>
            ))}

            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleColorMode} sx={{ ml: 1 }} color="inherit">
                {mode === 'dark' ? (
                  <LightMode sx={{ color: 'text.secondary' }} />
                ) : (
                  <DarkMode sx={{ color: 'text.secondary' }} />
                )}
              </IconButton>
            </Tooltip>

            {user?.role === 'admin' && (
              <Tooltip title="Admin Panel">
                <IconButton component={Link} href="/admin" sx={{ ml: 0.5 }}>
                  <AdminPanelSettings sx={{ color: 'primary.main', fontSize: 24 }} />
                </IconButton>
              </Tooltip>
            )}

            {user ? (
              <Tooltip title={`Sign out (${user.email})`}>
                <IconButton onClick={handleLogout} sx={{ ml: 0.5 }}>
                  <LogoutOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="small"
                  sx={{ px: 2.5, fontWeight: 600 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  size="small"
                  sx={{ px: 2.5, fontWeight: 600 }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile controls */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleColorMode} color="inherit" size="small">
                {mode === 'dark' ? (
                  <LightMode sx={{ color: 'text.secondary' }} />
                ) : (
                  <DarkMode sx={{ color: 'text.secondary' }} />
                )}
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <MenuIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            px: 2,
            py: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Innoxel
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton
                component={Link}
                href={link.href}
                onClick={handleDrawerToggle}
                selected={pathname === link.href}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #4361ee22, #7209b722)',
                    color: 'primary.main',
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button variant="outlined" fullWidth component={Link} href="/admin" onClick={handleDrawerToggle} startIcon={<AdminPanelSettings />}>
                  Admin Panel
                </Button>
              )}
              <Button variant="outlined" color="error" fullWidth onClick={() => { handleLogout(); handleDrawerToggle(); }} startIcon={<LogoutOutlined />}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" fullWidth component={Link} href="/login" onClick={handleDrawerToggle}>
                Login
              </Button>
              <Button variant="contained" fullWidth component={Link} href="/signup" onClick={handleDrawerToggle}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}

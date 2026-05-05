// @ts-nocheck
'use client';

import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider,
} from '@mui/material';
import {
  DashboardOutlined, AddCircle, ArticleOutlined, OpenInNew, AdminPanelSettings,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SIDEBAR_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: <DashboardOutlined /> },
  { label: 'New Article', href: '/admin/new', icon: <AddCircle /> },
  { label: 'All Articles', href: '/admin', icon: <ArticleOutlined /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        minHeight: 'calc(100vh - 64px)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 2.5, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AdminPanelSettings sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing="0.08em" textTransform="uppercase">
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, pt: 1.5 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href + item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(67,97,238,0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(67,97,238,0.07)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />

      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/techblog" target="_blank" sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(67,97,238,0.07)' } }}>
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
              <OpenInNew fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View Blog" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export { SIDEBAR_WIDTH };

// @ts-nocheck
'use client';

import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider,
  Drawer,
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

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AdminPanelSettings sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
                onClick={onNavClick}
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
                  slotProps={{
                    primary: {
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'primary.main' : 'text.primary',
                    }
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
          <ListItemButton
            component={Link}
            href="/techblog"
            target="_blank"
            onClick={onNavClick}
            sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(67,97,238,0.07)' } }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
              <OpenInNew fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View Blog" slotProps={{ primary: { fontSize: '0.875rem', fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
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
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        keepMounted
        slotProps={{
          paper: {
            sx: {
              width: SIDEBAR_WIDTH,
              bgcolor: 'background.paper',
            },
          },
        }}
        sx={{ display: { md: 'none' } }}
      >
        <SidebarContent onNavClick={onMobileClose} />
      </Drawer>
    </>
  );
}

export { SIDEBAR_WIDTH };

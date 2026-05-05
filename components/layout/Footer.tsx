// @ts-nocheck
'use client';

import {
  Box, Container, Grid, Typography, Link as MuiLink,
  Divider, IconButton, Stack, Chip,
} from '@mui/material';
import {
  LinkedIn, Twitter, GitHub, Instagram,
  FlashOn, Email, Phone, LocationOn,
} from '@mui/icons-material';
import Link from 'next/link';

const footerLinks = {
  Company: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Web Development', href: '/services' },
    { label: 'Mobile Apps', href: '/services' },
    { label: 'AI / ML Solutions', href: '/services' },
    { label: 'Cloud Services', href: '/services' },
    { label: 'UI/UX Design', href: '/services' },
  ],
};

const socials = [
  { icon: <LinkedIn />, href: '#', label: 'LinkedIn' },
  { icon: <Twitter />, href: '#', label: 'Twitter' },
  { icon: <GitHub />, href: '#', label: 'GitHub' },
  { icon: <Instagram />, href: '#', label: 'Instagram' },
];

const contactItems = [
  { icon: <Email fontSize="small" />, text: 'hello@innoxelsolutions.com' },
  { icon: <Phone fontSize="small" />, text: '+1 (800) 123-4567' },
  { icon: <LocationOn fontSize="small" />, text: '42 Innovation Drive, Tech Valley, CA 94025' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 8, md: 10 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ mb: 6 }}>
          {/* Brand column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: 2,
                  background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <FlashOn sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box
                sx={{
                  fontWeight: 800, fontSize: '1.15rem',
                  background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Innoxel Solutions
              </Box>
            </Link>

            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
              Building tomorrow's digital experiences today. We partner with forward-thinking businesses
              to create software that drives real growth.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {socials.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  aria-label={s.label}
                  size="small"
                  sx={{
                    border: '1px solid', borderColor: 'divider', color: 'text.secondary',
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(67,97,238,0.08)' },
                    transition: 'all 0.25s ease',
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <Grid size={{ xs: 6, md: 2 }} key={section}>
              <Box
                sx={{
                  fontWeight: 700, color: 'text.primary', mb: 2.5,
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {section}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box
                      sx={{
                        color: 'text.secondary', fontSize: '0.875rem',
                        '&:hover': { color: 'primary.main', pl: 0.5 },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Box>
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                fontWeight: 700, color: 'text.primary', mb: 2.5,
                textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Contact Us
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactItems.map((item) => (
                <Box key={item.text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ color: 'primary.main', mt: 0.25, flexShrink: 0 }}>{item.icon}</Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 3, gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Innoxel Solutions. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <Box
                key={label}
                component="a"
                href="#"
                sx={{
                  color: 'text.secondary', fontSize: '0.75rem', textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }, transition: 'color 0.2s ease',
                }}
              >
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

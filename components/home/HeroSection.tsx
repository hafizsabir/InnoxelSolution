// @ts-nocheck
'use client';

import { Box, Container, Grid, Typography, Button, Stack, Chip } from '@mui/material';
import { ArrowForward, PlayCircleOutlined, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50+', label: 'Expert Team' },
  { value: '8+', label: 'Years of Excellence' },
];

const floatingBadges = [
  { text: 'Next.js', color: '#4361ee' },
  { text: 'React Native', color: '#7209b7' },
  { text: 'AI / ML', color: '#f72585' },
  { text: 'Cloud Native', color: '#4cc9f0' },
];

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '90vh', md: '92vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 8, md: 4 },
        pb: { xs: 10, md: 8 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(67,97,238,0.2), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(114,9,183,0.15), transparent)'
              : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(67,97,238,0.1), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(114,9,183,0.08), transparent)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute', inset: 0,
          backgroundImage: (theme) =>
            `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.4,
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Chip
                label="🚀 Trusted by 100+ companies worldwide"
                size="small"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, rgba(67,97,238,0.15), rgba(114,9,183,0.15))',
                  border: '1px solid rgba(67,97,238,0.3)',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              />

              <Box
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.75rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  color: 'text.primary',
                  fontFamily: 'Inter, sans-serif',
                }}
                component="h1"
              >
                We Build{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #4361ee 0%, #f72585 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Digital Products
                </Box>{' '}
                That Drive Growth
              </Box>

              <Box
                component="p"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 560,
                  fontSize: '1.2rem',
                  fontFamily: 'Inter, sans-serif',
                  m: 0,
                  mb: 4,
                }}
              >
                Innoxel Solutions engineers world-class software — from AI-powered platforms to
                stunning mobile apps — that helps ambitious businesses scale faster.
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  component={Link}
                  href="/contact"
                  sx={{ fontSize: '1rem', py: 1.75, px: 4 }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleOutlined />}
                  component={Link}
                  href="/services"
                  sx={{ fontSize: '1rem', py: 1.75, px: 4 }}
                >
                  Explore Services
                </Button>
              </Stack>

              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
                {['ISO 27001 Certified', 'GDPR Compliant', '24/7 Support'].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CheckCircle sx={{ color: 'primary.main', fontSize: 18 }} />
                    <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
                      {item}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Grid container spacing={2}>
                {stats.map((stat, i) => (
                  <Grid size={{ xs: 6 }} key={stat.label}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                      <Box
                        sx={{
                          p: 3, borderRadius: 3, bgcolor: 'background.paper',
                          border: '1px solid', borderColor: 'divider', textAlign: 'center',
                          backdropFilter: 'blur(10px)',
                          '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box
                          sx={{
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '2rem', md: '2.25rem' },
                            lineHeight: 1.1,
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Box>
                        <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
                          {stat.label}
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5, mt: 3, justifyContent: 'center' }}>
                {floatingBadges.map((badge, i) => (
                  <motion.div
                    key={badge.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.08 }}
                  >
                    <Chip
                      label={badge.text}
                      sx={{
                        bgcolor: `${badge.color}18`,
                        color: badge.color,
                        border: `1px solid ${badge.color}44`,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

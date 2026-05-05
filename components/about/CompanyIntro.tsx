// @ts-nocheck
'use client';

import { Box, Container, Grid, Typography, Chip, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward, Star, People, WorkspacePremium } from '@mui/icons-material';
import Link from 'next/link';

export default function CompanyIntro() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'radial-gradient(ellipse 70% 50% at 100% 0%, rgba(67,97,238,0.15), transparent)'
              : 'radial-gradient(ellipse 70% 50% at 100% 0%, rgba(67,97,238,0.07), transparent)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Chip
                label="About Innoxel"
                size="small"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, rgba(67,97,238,0.15), rgba(114,9,183,0.15))',
                  border: '1px solid rgba(67,97,238,0.3)',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              />
              <Typography
                variant="h2"
                color="text.primary"
                sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.2 }}
              >
                Pioneering the Future of{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Digital Innovation
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2.5 }}>
                Founded in 2016, Innoxel Solutions was born from a bold idea: that technology, when
                done right, can fundamentally transform businesses and create lasting impact. Over
                8 years, we've grown from a scrappy startup to a team of 50+ world-class engineers,
                designers, and strategists.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                We partner with startups, scale-ups, and Fortune 500 enterprises across 20+ countries
                to build software that isn't just functional — it's transformative.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                component={Link}
                href="/contact"
                size="large"
              >
                Partner With Us
              </Button>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Grid container spacing={2}>
                {[
                  { icon: <Star sx={{ fontSize: 28 }} />, label: '150+ Projects', sublabel: 'Delivered Globally', color: '#4361ee' },
                  { icon: <People sx={{ fontSize: 28 }} />, label: '50+ Experts', sublabel: 'Across 8 Disciplines', color: '#7209b7' },
                  { icon: <WorkspacePremium sx={{ fontSize: 28 }} />, label: '98% Satisfaction', sublabel: 'Client Retention Rate', color: '#f72585' },
                  { icon: <Star sx={{ fontSize: 28 }} />, label: '20+ Countries', sublabel: 'Global Footprint', color: '#4cc9f0' },
                ].map((item) => (
                  <Grid size={{ xs: 6 }} key={item.label}>
                    <motion.div whileHover={{ scale: 1.04 }}>
                      <Box
                        sx={{
                          p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                          bgcolor: 'background.paper', textAlign: 'center',
                          '&:hover': { borderColor: item.color }, transition: 'border-color 0.25s ease',
                        }}
                      >
                        <Box sx={{ color: item.color, mb: 1.5 }}>{item.icon}</Box>
                        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.sublabel}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

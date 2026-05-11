// @ts-nocheck
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Container, Grid, Typography, Button, Stack, Chip } from '@mui/material';
import { ArrowForward, PlayCircleOutlined, CheckCircle, FlashOn } from '@mui/icons-material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

/* ─── Tech stack items for the 3-D scene ─── */
const techItems = [
  { label: 'Next.js', icon: '⬡', color: '#6776ceff', bg: 'rgba(224, 46, 46, 0.08)', border: 'rgba(180, 81, 81, 0.18)', x: '12%', y: '14%', size: 1.0 },
  { label: 'React Native', icon: '⚛', color: '#4cc9f0', bg: 'rgba(76,201,240,0.1)', border: 'rgba(76,201,240,0.35)', x: '68%', y: '8%', size: 0.9 },
  { label: 'AI / ML', icon: '🧠', color: '#f72585', bg: 'rgba(247,37,133,0.1)', border: 'rgba(247,37,133,0.35)', x: '78%', y: '60%', size: 1.1 },
  { label: 'Cloud Native', icon: '☁', color: '#4361ee', bg: 'rgba(67,97,238,0.12)', border: 'rgba(67,97,238,0.4)', x: '6%', y: '65%', size: 0.95 },
  { label: 'TypeScript', icon: 'TS', color: '#7209b7', bg: 'rgba(114,9,183,0.1)', border: 'rgba(114,9,183,0.35)', x: '42%', y: '82%', size: 0.85 },
  { label: 'GraphQL', icon: '◈', color: '#e040fb', bg: 'rgba(224,64,251,0.1)', border: 'rgba(224,64,251,0.35)', x: '82%', y: '28%', size: 0.8 },
];

const stats = [
  { value: '150+', label: 'Projects Delivered', color: '#4361ee' },
  { value: '98%', label: 'Client Satisfaction', color: '#f72585' },
  { value: '50+', label: 'Expert Engineers', color: '#7209b7' },
  { value: '8+', label: 'Years of Excellence', color: '#4cc9f0' },
];

/* ─── Mouse-tracking 3-D scene ─── */
function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-14, 14]), springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: 480,
        mx: 'auto',
        position: 'relative',
        perspective: '900px',
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        userSelect: 'none',
      }}
    >
      {/* ── 3-D rotating shell ── */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
      >


        {/* ── Orbit rings ── */}
        {[{ size: '88%', delay: '0s', dur: '18s', rx: '72deg', ry: '20deg' },
        { size: '88%', delay: '-6s', dur: '14s', rx: '55deg', ry: '-15deg' },
        { size: '88%', delay: '-3s', dur: '10s', rx: '30deg', ry: '45deg' }].map((ring, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: `calc(50% - ${ring.size} / 2)`,
              left: `calc(50% - ${ring.size} / 2)`,
              width: ring.size,
              height: ring.size,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: i === 0 ? 'rgba(67,97,238,0.4)' : i === 1 ? 'rgba(247,37,133,0.35)' : 'rgba(76,201,240,0.35)',
              animation: `orbit${i} ${ring.dur} linear infinite`,
              transform: `rotateX(${ring.rx}) rotateY(${ring.ry})`,
              [`@keyframes orbit${i}`]: {
                from: { transform: `rotateX(${ring.rx}) rotateY(${ring.ry}) rotateZ(0deg)` },
                to: { transform: `rotateX(${ring.rx}) rotateY(${ring.ry}) rotateZ(360deg)` },
              },
            }}
          >
            {/* Dot on ring */}
            <Box sx={{
              position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
              width: 8, height: 8, borderRadius: '50%',
              bgcolor: i === 0 ? '#4361ee' : i === 1 ? '#f72585' : '#4cc9f0',
              boxShadow: `0 0 10px ${i === 0 ? '#4361ee' : i === 1 ? '#f72585' : '#4cc9f0'}`,
            }} />
          </Box>
        ))}

        {/* ── Central sphere ── */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36%', height: '36%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), rgba(67,97,238,0.6) 50%, rgba(114,9,183,0.8) 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <FlashOn sx={{ color: '#fff', fontSize: '2.4rem' }} />
        </Box>

        {/* ── Floating tech badges ── */}
        {techItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.5, type: 'spring' }}
            style={{
              position: 'absolute',
              left: item.x, top: item.y,
              animation: `float${i} ${3.5 + i * 0.4}s ease-in-out infinite`,
            }}
            whileHover={{ scale: 1.15, zIndex: 10 }}
          >
            <style>{`
              @keyframes float${i} {
                0%, 100% { transform: translateY(0px) translateZ(${20 + i * 8}px); }
                50%       { transform: translateY(${i % 2 === 0 ? '-8px' : '8px'}) translateZ(${20 + i * 8}px); }
              }
            `}</style>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.75,
                px: 1.5, py: 0.75,
                borderRadius: '10px',
                background: item.bg,
                border: `1px solid ${item.border}`,
                backdropFilter: 'blur(12px)',
                whiteSpace: 'nowrap',
                scale: item.size,
              }}
            >
              <Box sx={{ fontSize: '0.8rem', lineHeight: 1 }}>{item.icon}</Box>
              <Box sx={{
                fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Inter, sans-serif',
                color: item.color, letterSpacing: '0.02em',
              }}>
                {item.label}
              </Box>
            </Box>
          </motion.div>
        ))}

        {/* ── Particle dots scattered around ── */}
        {Array.from({ length: 14 }).map((_, i) => (
          <Box
            key={`dot-${i}`}
            sx={{
              position: 'absolute',
              width: i % 3 === 0 ? 4 : 2,
              height: i % 3 === 0 ? 4 : 2,
              borderRadius: '50%',
              bgcolor: ['#4361ee', '#f72585', '#7209b7', '#4cc9f0'][i % 4],
              opacity: 0.6,
              left: `${8 + (i * 37) % 84}%`,
              top: `${5 + (i * 53) % 90}%`,
              animation: `twinkle${i} ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              [`@keyframes twinkle${i}`]: {
                '0%,100%': { opacity: 0.2, transform: 'scale(1)' },
                '50%': { opacity: 0.9, transform: 'scale(1.5)' },
              },
            }}
          />
        ))}
      </motion.div>

      {/* ── Stats row below the 3D scene ── */}
      <Box
        sx={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1.5, mt: 3,
        }}
      >
        {/* {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <Box
              sx={{
                textAlign: 'center', py: 1.5, px: 1,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid', borderColor: 'divider',
                transition: 'all 0.25s',
                '&:hover': { borderColor: stat.color, transform: 'translateY(-3px)', boxShadow: `0 8px 24px ${stat.color}22` },
              }}
            >
              <Box sx={{
                fontWeight: 900, fontSize: { xs: '1.1rem', md: '1.35rem' }, lineHeight: 1,
                background: `linear-gradient(135deg, ${stat.color}, #7209b7)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {stat.value}
              </Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 600, mt: 0.4, lineHeight: 1.3 }}>
                {stat.label}
              </Box>
            </Box>
          </motion.div>
        ))} */}
      </Box>
    </Box>
  );
}

/* ─── Hero Section ─── */
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
      {/* Grid texture */}
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
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>

          {/* ── Left: text ── */}
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
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.75rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  color: 'text.primary',
                  fontFamily: 'Inter, sans-serif',
                }}
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
                  maxWidth: 560,
                  fontSize: '1.2rem',
                  fontFamily: 'Inter, sans-serif',
                  m: 0, mb: 4,
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

          {/* ── Right: 3-D scene ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Scene3D />
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

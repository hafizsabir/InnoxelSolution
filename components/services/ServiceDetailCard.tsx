// @ts-nocheck
'use client';

import { useRef, useState } from 'react';
import { Box, Typography, Grid, Button, Chip } from '@mui/material';
import { CheckCircle, ArrowForward, East } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import { Service } from '@/data/services';
import Link from 'next/link';

interface ServiceDetailCardProps {
  service: Service;
  index: number;
}

// Stagger container
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

// Each feature chip
const featureVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

export default function ServiceDetailCard({ service, index }: ServiceDetailCardProps) {
  const IconComponent = (Icons as Record<string, SvgIconComponent>)[service.icon] ?? Icons.Code;
  const isEven = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  /* ── 3-D tilt on mouse move ────────────────────────────────────────────── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  /* ── Extract two colours from gradient for glow ────────────────────────── */
  const glowColour = service.gradient.match(/#[0-9a-f]{6}/gi)?.[0] ?? '#4361ee';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      {/* ── Animated gradient border wrapper ─────────────────────────────── */}
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', borderRadius: 24 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >

        {/* Card surface */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '24px',
            overflow: 'hidden',
            mb: 5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(18,20,38,0.92)' : 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            boxShadow: hovered
              ? '0 8px 20px rgba(0,0,0,0.07)'
              : '0 2px 10px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* ── Animated top gradient bar ───────────────────────────────── */}
          <motion.div
            animate={{ backgroundPosition: hovered ? '100% 50%' : '0% 50%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              height: 5,
              background: service.gradient,
              backgroundSize: '200% 200%',
            }}
          />

          {/* ── Floating decorative orbs ────────────────────────────────── */}
          <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glowColour}04 0%, transparent 70%)`,
                top: isEven ? '-60px' : 'auto',
                bottom: isEven ? 'auto' : '-60px',
                right: '-60px',
              }}
            />
            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              style={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glowColour}03 0%, transparent 70%)`,
                bottom: isEven ? '-40px' : 'auto',
                top: isEven ? 'auto' : '-40px',
                left: '-40px',
              }}
            />
          </Box>

          {/* ── Main content ────────────────────────────────────────────── */}
          <Box sx={{ p: { xs: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
            <Grid
              container
              spacing={{ xs: 4, md: 6 }}
              alignItems="center"
              direction={isEven ? 'row' : 'row-reverse'}
            >
              {/* Left column — icon, title, CTA */}
              <Grid size={{ xs: 12, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.1 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Animated icon box */}
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 20,
                      background: service.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 24,
                      boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                      marginLeft: !isEven ? 'auto' : undefined,
                    }}
                  >
                    <IconComponent sx={{ color: 'white', fontSize: 44 }} />
                  </motion.div>

                  {/* Service number tag */}
                  <Chip
                    label={`0${index + 1}`}
                    size="small"
                    sx={{
                      mb: 1.5,
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      background: service.gradient,
                      color: '#fff',
                      border: 'none',
                      height: 24,
                    }}
                  />

                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color="text.primary"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '1.8rem' },
                      lineHeight: 1.2,
                      mb: 1.5,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, mb: 3, maxWidth: 260 }}
                  >
                    {service.shortDesc}
                  </Typography>

                  {/* CTA button with shimmer */}
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      component={Link}
                      href="/contact"
                      variant="contained"
                      endIcon={<East />}
                      sx={{
                        borderRadius: 99,
                        px: 3,
                        py: 1,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: service.gradient,
                        boxShadow: `0 2px 8px rgba(0,0,0,0.18)`,
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          background: service.gradient,
                          boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                          backgroundSize: '200% 100%',
                          backgroundPosition: '-100%',
                          transition: 'background-position 0.5s ease',
                        },
                        '&:hover::after': { backgroundPosition: '200%' },
                      }}
                    >
                      Get a Quote
                    </Button>
                  </motion.div>
                </motion.div>
              </Grid>

              {/* Right column — description + features */}
              <Grid size={{ xs: 12, md: 8 }}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.1 + 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Long description */}
                  <Box
                    sx={{
                      position: 'relative',
                      pl: 2.5,
                      mb: 4,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        borderRadius: 2,
                        background: service.gradient,
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.85, fontSize: '1.02rem' }}
                    >
                      {service.longDesc}
                    </Typography>
                  </Box>

                  {/* Features label */}
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: 'text.disabled',
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    What's included
                  </Typography>

                  {/* Staggered feature chips */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
                  >
                    {service.features.map((feature, fi) => (
                      <motion.div key={feature} variants={featureVariants}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.75,
                            py: 0.85,
                            borderRadius: 99,
                            border: '1px solid',
                            borderColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.08)',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.04)'
                                : 'rgba(0,0,0,0.02)',
                            transition: 'all 0.25s ease',
                            cursor: 'default',
                            '&:hover': {
                              borderColor: glowColour + '60',
                              bgcolor: glowColour + '10',
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${glowColour}20`,
                            },
                          }}
                        >
                          <CheckCircle
                            sx={{
                              fontSize: 15,
                              background: service.gradient,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="text.primary"
                            sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

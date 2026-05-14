// @ts-nocheck
// components/ui/Scene3D.tsx
// Reusable 3-D animated scene — extracted from HeroSection.
// variant="hero"   → full version with mouse tracking, floating tech badges, particles (homepage)
// variant="loader" → lean version (orb + orbit rings + particles only — no text badges) for the page loader

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { FlashOn } from '@mui/icons-material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─── Hero badge items ────────────────────────────────────────────── */
const techItems = [
  { label: 'Next.js',       icon: '⬡',  color: '#6776ceff', bg: 'rgba(224,46,46,0.08)',    border: 'rgba(180,81,81,0.18)',    x: '12%', y: '14%', size: 1.0 },
  { label: 'React Native',  icon: '⚛',  color: '#4cc9f0',   bg: 'rgba(76,201,240,0.1)',    border: 'rgba(76,201,240,0.35)',   x: '68%', y: '8%',  size: 0.9 },
  { label: 'AI / ML',       icon: '🧠', color: '#f72585',   bg: 'rgba(247,37,133,0.1)',    border: 'rgba(247,37,133,0.35)',   x: '78%', y: '60%', size: 1.1 },
  { label: 'Cloud Native',  icon: '☁',  color: '#4361ee',   bg: 'rgba(67,97,238,0.12)',    border: 'rgba(67,97,238,0.4)',    x: '6%',  y: '65%', size: 0.95 },
  { label: 'TypeScript',    icon: 'TS', color: '#7209b7',   bg: 'rgba(114,9,183,0.1)',     border: 'rgba(114,9,183,0.35)',   x: '42%', y: '82%', size: 0.85 },
  { label: 'GraphQL',       icon: '◈',  color: '#e040fb',   bg: 'rgba(224,64,251,0.1)',    border: 'rgba(224,64,251,0.35)',  x: '82%', y: '28%', size: 0.8 },
];

/* ─── Orbit ring config ───────────────────────────────────────────── */
const RINGS = [
  { size: '88%', delay: '0s',  dur: '18s', rx: '72deg',  ry: '20deg',  color: 'rgba(67,97,238,0.4)' },
  { size: '88%', delay: '-6s', dur: '14s', rx: '55deg',  ry: '-15deg', color: 'rgba(247,37,133,0.35)' },
  { size: '88%', delay: '-3s', dur: '10s', rx: '30deg',  ry: '45deg',  color: 'rgba(76,201,240,0.35)' },
];

const DOT_COLORS = ['#4361ee', '#f72585', '#7209b7', '#4cc9f0'];

/* ─── Orbit rings (shared) ────────────────────────────────────────── */
function OrbitRings() {
  return (
    <>
      {RINGS.map((ring, i) => (
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
            borderColor: ring.color,
            animation: `orbit3d_${i} ${ring.dur} linear infinite`,
            transform: `rotateX(${ring.rx}) rotateY(${ring.ry})`,
            [`@keyframes orbit3d_${i}`]: {
              from: { transform: `rotateX(${ring.rx}) rotateY(${ring.ry}) rotateZ(0deg)` },
              to:   { transform: `rotateX(${ring.rx}) rotateY(${ring.ry}) rotateZ(360deg)` },
            },
          }}
        >
          <Box sx={{
            position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, borderRadius: '50%',
            bgcolor: DOT_COLORS[i] ?? '#4361ee',
            boxShadow: `0 0 10px ${DOT_COLORS[i] ?? '#4361ee'}`,
          }} />
        </Box>
      ))}
    </>
  );
}

/* ─── Central sphere (shared) ─────────────────────────────────────── */
function CentralSphere({ size = '36%' }: { size?: string }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size, height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), rgba(67,97,238,0.6) 50%, rgba(114,9,183,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'spherePulse 3s ease-in-out infinite',
        '@keyframes spherePulse': {
          '0%,100%': { boxShadow: '0 0 20px rgba(67,97,238,0.4), 0 0 60px rgba(114,9,183,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(67,97,238,0.7), 0 0 100px rgba(114,9,183,0.4)' },
        },
      }}
    >
      <FlashOn sx={{ color: '#fff', fontSize: '2.4rem' }} />
    </Box>
  );
}

/* ─── Particle dots (shared) ──────────────────────────────────────── */
function Particles({ count = 14 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={`p-${i}`}
          sx={{
            position: 'absolute',
            width: i % 3 === 0 ? 4 : 2,
            height: i % 3 === 0 ? 4 : 2,
            borderRadius: '50%',
            bgcolor: DOT_COLORS[i % 4],
            opacity: 0.6,
            left: `${8 + (i * 37) % 84}%`,
            top:  `${5 + (i * 53) % 90}%`,
            animation: `twinkle3d_${i} ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            [`@keyframes twinkle3d_${i}`]: {
              '0%,100%': { opacity: 0.2, transform: 'scale(1)' },
              '50%':     { opacity: 0.9, transform: 'scale(1.5)' },
            },
          }}
        />
      ))}
    </>
  );
}

/* ─── Floating Tech Badges (hero only) ───────────────────────────── */
function TechBadges() {
  return (
    <>
      {techItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.5, type: 'spring' }}
          style={{
            position: 'absolute',
            left: item.x, top: item.y,
            animation: `floatBadge_${i} ${3.5 + i * 0.4}s ease-in-out infinite`,
          }}
          whileHover={{ scale: 1.15, zIndex: 10 }}
        >
          <style>{`
            @keyframes floatBadge_${i} {
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
            <Box sx={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: item.color, letterSpacing: '0.02em' }}>
              {item.label}
            </Box>
          </Box>
        </motion.div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main exported component
   ═══════════════════════════════════════════════════════════════════ */
interface Scene3DProps {
  /** "hero" → full interactive version (default). "loader" → lean version for the page loader. */
  variant?: 'hero' | 'loader';
  /** Override max-width (default: 480px for hero, 300px for loader) */
  maxWidth?: number;
}

export default function Scene3D({ variant = 'hero', maxWidth }: Scene3DProps) {
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
    mouseX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || variant === 'loader') return; // no mouse tracking in loader variant
    el.addEventListener('mousemove',  handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove',  handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [variant, handleMouseMove, handleMouseLeave]);

  const defaultMax = variant === 'loader' ? 300 : 480;

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: maxWidth ?? defaultMax,
        mx: 'auto',
        position: 'relative',
        perspective: '900px',
        cursor: variant === 'hero' ? 'grab' : 'default',
        '&:active': variant === 'hero' ? { cursor: 'grabbing' } : {},
        userSelect: 'none',
      }}
    >
      <motion.div
        style={{
          rotateX: variant === 'hero' ? rotateX : 0,
          rotateY: variant === 'hero' ? rotateY : 0,
          transformStyle: 'preserve-3d',
          width: '100%', height: '100%',
          position: 'relative',
        }}
      >
        <OrbitRings />
        <CentralSphere />
        <Particles count={variant === 'loader' ? 10 : 14} />
        {variant === 'hero' && <TechBadges />}
      </motion.div>
    </Box>
  );
}

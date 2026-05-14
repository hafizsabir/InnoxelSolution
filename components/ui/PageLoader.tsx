// @ts-nocheck
// components/ui/PageLoader.tsx
// Full-screen branded 3-D loading screen shown while pages load.
// Uses the lean Scene3D variant="loader" — no heavy text badges.

'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Scene3D (client-only, ssr:false avoids 3D on server)
const Scene3D = dynamic(() => import('@/components/ui/Scene3D'), { ssr: false });

export default function PageLoader() {
  return (
    <motion.div
      key="page-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d0f1a 0%, #12083a 55%, #0d0f1a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient blobs ────────────────────────────────────────── */}
      {[
        { color: '#4361ee', top: '-15%', left: '-10%' },
        { color: '#7209b7', bottom: '-20%', right: '-10%' },
        { color: '#f72585', top: '40%',  left: '60%'  },
      ].map((blob, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 400, height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color}33 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
            ...blob,
          }}
        />
      ))}

      {/* ── 3-D scene (loader variant) ───────────────────────────── */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80, damping: 18 }}
        style={{ width: '100%', maxWidth: 280, position: 'relative', zIndex: 1 }}
      >
        <Scene3D variant="loader" maxWidth={280} />
      </motion.div>

      {/* ── Brand name ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ textAlign: 'center', marginTop: 28, position: 'relative', zIndex: 1 }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.3rem',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
          }}
        >
          Innoxel Solutions
        </Typography>

        {/* ── Shimmer loading bar ───────────────────────────────── */}
        <Box
          sx={{
            width: 160,
            height: 3,
            borderRadius: 99,
            mx: 'auto',
            mt: 1.5,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, #4361ee 40%, #7209b7 60%, transparent 100%)',
              animation: 'shimmerBar 1.4s ease-in-out infinite',
              '@keyframes shimmerBar': {
                '0%':   { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(200%)' },
              },
            }}
          />
        </Box>

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.72rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            mt: 1.5,
            animation: 'fadeText 1.8s ease-in-out infinite',
            '@keyframes fadeText': {
              '0%,100%': { opacity: 0.35 },
              '50%':     { opacity: 0.7 },
            },
          }}
        >
          Loading…
        </Typography>
      </motion.div>
    </motion.div>
  );
}

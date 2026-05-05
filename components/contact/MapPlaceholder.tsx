'use client';

import { Box, Typography } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

export default function MapPlaceholder() {
  return (
    <Box
      sx={{
        width: '100%', height: 300, borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider', position: 'relative',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #13162b, #1a1d3d)'
            : 'linear-gradient(135deg, #eef0ff, #e8eaf6)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}
    >
      {/* Decorative grid */}
      <Box
        sx={{
          position: 'absolute', inset: 0,
          backgroundImage: (theme) =>
            `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)`,
          backgroundSize: '40px 40px', opacity: 0.5,
        }}
      />

      {/* Pulsing pin */}
      <Box
        sx={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4361ee, #7209b7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1,
          boxShadow: '0 8px 24px rgba(67,97,238,0.4)',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(67,97,238,0.4)' },
            '70%': { boxShadow: '0 0 0 16px rgba(67,97,238,0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(67,97,238,0)' },
          },
        }}
      >
        <LocationOn sx={{ color: 'white', fontSize: 28 }} />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 700 }}>
          Innoxel Solutions HQ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          42 Innovation Drive, Tech Valley, CA 94025
        </Typography>
      </Box>
    </Box>
  );
}

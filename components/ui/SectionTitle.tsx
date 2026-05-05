'use client';

import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  chip?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

export default function SectionTitle({
  chip,
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: align, marginBottom: '3rem' }}
    >
      {chip && (
        <Chip
          label={chip}
          size="small"
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #4361ee22, #7209b722)',
            color: light ? '#7b90f5' : 'primary.main',
            border: '1px solid',
            borderColor: light ? 'rgba(123,144,245,0.3)' : 'rgba(67,97,238,0.3)',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        />
      )}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '2rem', md: '2.75rem', lg: '3rem' },
          fontWeight: 800,
          color: light ? 'white' : 'text.primary',
          mb: 2,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: light ? 'rgba(255,255,255,0.75)' : 'text.secondary',
            fontSize: { xs: '1rem', md: '1.125rem' },
            maxWidth: 640,
            mx: align === 'center' ? 'auto' : 0,
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </motion.div>
  );
}

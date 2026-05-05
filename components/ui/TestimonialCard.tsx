'use client';

import { Card, CardContent, Box, Typography, Rating } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
}

export default function TestimonialCard({ testimonial, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          p: 1,
        }}
      >
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Quote icon */}
          <Box
            sx={{
              width: 48, height: 48, borderRadius: 2,
              background: 'linear-gradient(135deg, #4361ee22, #7209b722)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 2.5,
            }}
          >
            <FormatQuote sx={{ color: 'primary.main', fontSize: 28 }} />
          </Box>

          {/* Rating */}
          <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 2, color: '#f72585' }} />

          {/* Quote */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.8, fontStyle: 'italic', flexGrow: 1, mb: 3 }}
          >
            &ldquo;{testimonial.quote}&rdquo;
          </Typography>

          {/* Author */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: '50%',
                bgcolor: testimonial.avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: 700, color: 'white', flexShrink: 0,
              }}
            >
              {testimonial.avatarInitials}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700 }}>
                {testimonial.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {testimonial.role} · {testimonial.company}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

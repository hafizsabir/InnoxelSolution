// @ts-nocheck
'use client';

import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  compact?: boolean;
}

export default function ServiceCard({
  icon,
  title,
  description,
  gradient,
  delay = 0,
  compact = false,
}: ServiceCardProps) {
  // Dynamically resolve the MUI icon
  const IconComponent = (Icons as Record<string, SvgIconComponent>)[icon] ?? Icons.Code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
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
          overflow: 'hidden',
          '&:hover .icon-box': {
            transform: 'scale(1.1) rotate(-5deg)',
          },
        }}
      >
        {/* Top gradient accent */}
        <Box sx={{ height: 4, background: gradient }} />

        <CardContent sx={{ p: compact ? 3 : 4, flexGrow: 1 }}>
          {/* Icon */}
          <Box
            className="icon-box"
            sx={{
              width: compact ? 52 : 64,
              height: compact ? 52 : 64,
              borderRadius: 3,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
              transition: 'transform 0.3s ease',
              boxShadow: '0 8px 20px rgba(67,97,238,0.3)',
            }}
          >
            <IconComponent sx={{ color: 'white', fontSize: compact ? 26 : 32 }} />
          </Box>

          <Typography
            variant={compact ? 'h6' : 'h5'}
            fontWeight={700}
            mb={1.5}
            color="text.primary"
          >
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}

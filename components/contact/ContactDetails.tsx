'use client';

import { Box, Typography, Stack, Paper } from '@mui/material';
import { Email, Phone, LocationOn, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';

const details = [
  {
    icon: <Email />, label: 'Email Us',
    value: 'hello@innoxelsolutions.com', sub: 'We respond within 2-4 hours', color: '#4361ee',
  },
  {
    icon: <Phone />, label: 'Call Us',
    value: '+1 (800) 123-4567', sub: 'Mon–Fri, 9am–6pm PST', color: '#7209b7',
  },
  {
    icon: <LocationOn />, label: 'Visit Us',
    value: '42 Innovation Drive', sub: 'Tech Valley, CA 94025, USA', color: '#f72585',
  },
  {
    icon: <AccessTime />, label: 'Business Hours',
    value: 'Mon – Fri: 9am – 6pm', sub: '24/7 Emergency Support Available', color: '#4cc9f0',
  },
];

export default function ContactDetails() {
  return (
    <Stack spacing={2.5}>
      {details.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.5, display: 'flex', gap: 2, alignItems: 'center',
              border: '1px solid', borderColor: 'divider', borderRadius: 2.5,
              bgcolor: 'background.paper',
              '&:hover': { borderColor: item.color, transform: 'translateX(4px)' },
              transition: 'all 0.25s ease',
            }}
          >
            <Box
              sx={{
                width: 48, height: 48, borderRadius: 2,
                bgcolor: `${item.color}18`, color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}
              >
                {item.label}
              </Typography>
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.sub}
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      ))}
    </Stack>
  );
}

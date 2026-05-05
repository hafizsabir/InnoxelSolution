// @ts-nocheck
'use client';

import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Speed,
  Security,
  Groups,
  AutoGraph,
  SupportAgent,
  Lightbulb,
} from '@mui/icons-material';
import SectionTitle from '@/components/ui/SectionTitle';

const reasons = [
  {
    icon: <Speed sx={{ fontSize: 32 }} />,
    title: 'Rapid Delivery',
    desc: 'Agile sprints and proven processes mean faster time-to-market without sacrificing quality.',
    color: '#4361ee',
  },
  {
    icon: <Security sx={{ fontSize: 32 }} />,
    title: 'Security-First',
    desc: 'Every solution is architected with enterprise-grade security and compliance built in from day one.',
    color: '#7209b7',
  },
  {
    icon: <Groups sx={{ fontSize: 32 }} />,
    title: 'Expert Team',
    desc: 'Our team of 50+ senior engineers, designers, and product strategists bring decades of experience.',
    color: '#f72585',
  },
  {
    icon: <AutoGraph sx={{ fontSize: 32 }} />,
    title: 'Scalable Solutions',
    desc: 'We build with scale in mind — your platform grows seamlessly as your business expands.',
    color: '#4cc9f0',
  },
  {
    icon: <SupportAgent sx={{ fontSize: 32 }} />,
    title: '24/7 Support',
    desc: 'Round-the-clock dedicated support ensures your systems are always running at peak performance.',
    color: '#3a0ca3',
  },
  {
    icon: <Lightbulb sx={{ fontSize: 32 }} />,
    title: 'Innovation-Driven',
    desc: 'We stay ahead of the curve, integrating the latest technologies to give your business a competitive edge.',
    color: '#560bad',
  },
];

export default function WhyChooseUs() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0d0f1a 0%, #131630 50%, #0d0f1a 100%)'
            : 'linear-gradient(180deg, #f8f9ff 0%, #eef0ff 50%, #f8f9ff 100%)',
      }}
    >
      {/* Decorative blob */}
      <Box
        sx={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,97,238,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <SectionTitle
          chip="Why Innoxel"
          title="Why Industry Leaders Choose Us"
          subtitle="We don't just write code — we build long-term technology partnerships that accelerate your success."
        />

        <Grid container spacing={3}>
          {reasons.map((reason, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reason.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    gap: 2.5,
                    alignItems: 'flex-start',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: reason.color,
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 30px ${reason.color}20`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      bgcolor: `${reason.color}18`,
                      color: reason.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {reason.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={0.75}>
                      {reason.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {reason.desc}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

'use client';

import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { Visibility, TrackChanges } from '@mui/icons-material';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/ui/SectionTitle';

export default function MissionVision() {
  const cards = [
    {
      icon: <TrackChanges sx={{ fontSize: 36 }} />,
      label: 'Our Mission',
      title: 'To Empower Businesses Through Technology',
      body: 'We exist to turn complex business challenges into elegant software solutions. Our mission is to deliver technology that creates measurable impact — whether that means accelerating growth, reducing costs, or transforming the user experience.',
      gradient: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
    },
    {
      icon: <Visibility sx={{ fontSize: 36 }} />,
      label: 'Our Vision',
      title: 'A World Where Technology Unlocks Human Potential',
      body: 'We envision a future where every business — regardless of size or industry — has access to world-class technology. By 2030, we aim to be the most trusted digital transformation partner for 500+ companies globally.',
      gradient: 'linear-gradient(135deg, #7209b7, #f72585)',
    },
  ];

  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <SectionTitle
          chip="Our Purpose"
          title="Mission & Vision"
          subtitle="The principles and aspirations that guide every decision we make."
        />
        <Grid container spacing={4}>
          {cards.map((card, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={card.label}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                style={{ height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 5 }, height: '100%', border: '1px solid',
                    borderColor: 'divider', borderRadius: 4, overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                      height: 4, background: card.gradient,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64, height: 64, borderRadius: 3,
                      background: card.gradient, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      mb: 3, color: 'white',
                      boxShadow: '0 8px 20px rgba(67,97,238,0.25)',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    variant="overline"
                    sx={{
                      background: card.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {card.body}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

'use client';

import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import {
  Handshake, EmojiObjects, Gavel, FavoriteBorder, Groups, EmojiNature,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/ui/SectionTitle';

const values = [
  {
    icon: <Handshake sx={{ fontSize: 30 }} />,
    title: 'Integrity',
    desc: 'We say what we mean and do what we say. Transparency and honesty are the foundation of every client relationship.',
    gradient: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
  },
  {
    icon: <EmojiObjects sx={{ fontSize: 30 }} />,
    title: 'Innovation',
    desc: 'We embrace new ideas, experiment boldly, and are never afraid to challenge the status quo.',
    gradient: 'linear-gradient(135deg, #7209b7, #560bad)',
  },
  {
    icon: <Gavel sx={{ fontSize: 30 }} />,
    title: 'Excellence',
    desc: 'We hold ourselves to the highest standards in code quality, design, and client service.',
    gradient: 'linear-gradient(135deg, #f72585, #7209b7)',
  },
  {
    icon: <FavoriteBorder sx={{ fontSize: 30 }} />,
    title: 'Empathy',
    desc: 'We design with users in mind and lead with compassion in every team interaction.',
    gradient: 'linear-gradient(135deg, #4cc9f0, #4361ee)',
  },
  {
    icon: <Groups sx={{ fontSize: 30 }} />,
    title: 'Collaboration',
    desc: 'Great software is a team sport. We thrive on collective intelligence and shared ownership.',
    gradient: 'linear-gradient(135deg, #3a0ca3, #4361ee)',
  },
  {
    icon: <EmojiNature sx={{ fontSize: 30 }} />,
    title: 'Sustainability',
    desc: 'We build solutions that stand the test of time — for businesses, communities, and the planet.',
    gradient: 'linear-gradient(135deg, #4cc9f0, #7209b7)',
  },
];

export default function CompanyValues() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <SectionTitle
          chip="Core Values"
          title="The Principles That Drive Us"
          subtitle="Our values aren't just words on a wall — they're the cultural fabric of how we operate, hire, and build."
        />
        <Grid container spacing={3}>
          {values.map((value, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={value.title}>
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
                    p: 3.5, height: '100%', border: '1px solid', borderColor: 'divider',
                    borderRadius: 3, bgcolor: 'background.paper',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.light' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 52, height: 52, borderRadius: 2.5,
                      background: value.gradient, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      mb: 2.5, color: 'white', boxShadow: '0 8px 20px rgba(67,97,238,0.25)',
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {value.desc}
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

// @ts-nocheck
'use client';

import { Box, Container, Grid, Typography, Button, Avatar } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SectionTitle from '@/components/ui/SectionTitle';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Testimonials() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, mb: { xs: 5, md: 8 } }}>
          <SectionTitle
            chip="Client Stories"
            title={'What Our Clients\nSay About Us'}
            subtitle="Real results from real businesses. Here's what our partners have to say."
            align="left"
          />
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            component={Link}
            href="/contact"
            sx={{ flexShrink: 0, mb: { xs: 0, md: 4 } }}
          >
            Work With Us
          </Button>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((testimonial, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} delay={i * 0.08} />
            </Grid>
          ))}
        </Grid>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box
            sx={{
              mt: 8,
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(67,97,238,0.08) 0%, rgba(114,9,183,0.08) 100%)',
              border: '1px solid rgba(67,97,238,0.2)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800} color="text.primary" mb={0.5}>
                Ready to join 100+ satisfied clients?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Let's discuss how we can build something extraordinary together.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <Box sx={{ display: 'flex' }}>
                {['MC', 'ZK', 'HR', 'AT'].map((initials, i) => (
                  <Avatar
                    key={i}
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '2px solid',
                      borderColor: 'background.paper',
                      ml: i === 0 ? 0 : -1,
                      bgcolor: ['#4361ee', '#7209b7', '#f72585', '#4cc9f0'][i],
                    }}
                  >
                    {initials}
                  </Avatar>
                ))}
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                component={Link}
                href="/contact"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Start a Project
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

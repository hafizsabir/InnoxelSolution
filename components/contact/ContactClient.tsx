// @ts-nocheck
// components/contact/ContactClient.tsx
'use client';

import dynamic from 'next/dynamic';
import { Box, Container, Grid, Typography, Chip, Paper } from '@mui/material';

const ContactForm    = dynamic(() => import('@/components/contact/ContactForm'),    { ssr: false });
const MapPlaceholder = dynamic(() => import('@/components/contact/MapPlaceholder'), { ssr: false });
const ContactDetails = dynamic(() => import('@/components/contact/ContactDetails'), { ssr: false });

export default function ContactClient() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Chip
            label="Let's Talk"
            size="small"
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, rgba(67,97,238,0.15), rgba(114,9,183,0.15))',
              border: '1px solid rgba(67,97,238,0.3)',
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          />
          <Typography
            variant="h1"
            color="text.primary"
            sx={{ fontWeight: 900, mb: 2.5, fontSize: { xs: '2.25rem', md: '3.25rem' }, lineHeight: 1.15 }}
          >
            Start Your Project Today
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 580, mx: 'auto', lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            Have an idea? Let's bring it to life. Fill out the form and our team will get back
            to you within 24 hours with a tailored proposal.
          </Typography>
        </Box>

        {/* Main grid */}
        <Grid container spacing={5} sx={{ alignItems: 'flex-start' }}>
          {/* Contact form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider',
                borderRadius: 4, bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800, mb: 0.75 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                We typically respond within 2–4 business hours.
              </Typography>
              <ContactForm />
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 2.5 }}>
                Our Location
              </Typography>
              <MapPlaceholder />
            </Box>
            <Box>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 2.5 }}>
                Contact Information
              </Typography>
              <ContactDetails />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

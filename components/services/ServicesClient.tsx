// @ts-nocheck
// components/services/ServicesClient.tsx
'use client';

import dynamic from 'next/dynamic';
import { Box, Container, Typography, Chip } from '@mui/material';
import { services } from '@/data/services';

const ServiceDetailCard = dynamic(
  () => import('@/components/services/ServiceDetailCard'),
  { ssr: false }
);

export default function ServicesClient() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Page header */}
        <Box sx={{ mb: { xs: 8, md: 10 }, textAlign: 'center' }}>
          <Chip
            label="What We Offer"
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
            Our Services
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 640, mx: 'auto', lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            End-to-end technology solutions engineered for performance, security, and scale.
            From ideation to deployment — we handle it all.
          </Typography>
        </Box>

        {/* Service detail cards */}
        {services.map((service, index) => (
          <ServiceDetailCard key={service.id} service={service} index={index} />
        ))}
      </Container>
    </Box>
  );
}

'use client';

import { Box, Container, Grid } from '@mui/material';
import SectionTitle from '@/components/ui/SectionTitle';
import ServiceCard from '@/components/ui/ServiceCard';
import { services } from '@/data/services';

export default function ServicesOverview() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <SectionTitle
          chip="What We Do"
          title="Our Core Services"
          subtitle="From concept to deployment, we deliver end-to-end software solutions engineered for performance, security, and scale."
        />
        <Grid container spacing={3}>
          {services.map((service, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.shortDesc}
                gradient={service.gradient}
                delay={i * 0.08}
                compact
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

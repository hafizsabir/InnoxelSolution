// @ts-nocheck
'use client';

import { Box, Card, CardContent, Typography, Grid, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { CheckCircle, ArrowForward } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Service } from '@/data/services';
import Link from 'next/link';

interface ServiceDetailCardProps {
  service: Service;
  index: number;
}

export default function ServiceDetailCard({ service, index }: ServiceDetailCardProps) {
  const IconComponent = (Icons as Record<string, SvgIconComponent>)[service.icon] ?? Icons.Code;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        {/* Gradient top bar */}
        <Box sx={{ height: 5, background: service.gradient }} />

        <CardContent sx={{ p: { xs: 4, md: 5 } }}>
          <Grid container spacing={5} alignItems="center" direction={isEven ? 'row' : 'row-reverse'}>
            {/* Icon + Title */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: isEven ? 'left' : 'right' } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 4,
                  background: service.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 12px 30px rgba(67,97,238,0.25)',
                  ml: { xs: 0, md: isEven ? 0 : 'auto' },
                }}
              >
                <IconComponent sx={{ color: 'white', fontSize: 40 }} />
              </Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color="text.primary"
                mb={2}
                sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
              >
                {service.title}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForward />}
                component={Link}
                href="/contact"
                sx={{ borderRadius: 2 }}
              >
                Get a Quote
              </Button>
            </Grid>

            {/* Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="body1" color="text.secondary" lineHeight={1.8} mb={3}>
                {service.longDesc}
              </Typography>
              <List dense disablePadding>
                <Grid container spacing={1}>
                  {service.features.map((feature) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={feature}>
                      <ListItem disablePadding sx={{ mb: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: 'text.primary' }}
                        />
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// @ts-nocheck
'use client';

import {
  Box, Container, Grid, Typography,
  Card, CardContent, IconButton, Stack,
} from '@mui/material';
import { LinkedIn, GitHub } from '@mui/icons-material';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/ui/SectionTitle';
import { teamMembers } from '@/data/team';

export default function TeamSection() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <SectionTitle
          chip="Our People"
          title="Meet the Team"
          subtitle="The brilliant minds behind Innoxel — a diverse group of engineers, designers, and strategists united by a love of building great products."
        />
        <Grid container spacing={3}>
          {teamMembers.map((member, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ height: '100%' }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%', border: '1px solid', borderColor: 'divider',
                    textAlign: 'center',
                    '&:hover .team-avatar': {
                      transform: 'scale(1.08)',
                      boxShadow: `0 12px 30px ${member.avatarColor}50`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="team-avatar"
                      sx={{
                        width: 80, height: 80, borderRadius: '50%',
                        bgcolor: member.avatarColor, mx: 'auto', mb: 2.5,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 800, color: 'white',
                        transition: 'all 0.35s ease',
                        boxShadow: `0 8px 20px ${member.avatarColor}40`,
                      }}
                    >
                      {member.avatarInitials}
                    </Box>
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600, mb: 2,
                        background: `linear-gradient(135deg, ${member.avatarColor}, #7209b7)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                      {member.bio}
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <IconButton
                        href={member.linkedin}
                        size="small"
                        aria-label={`${member.name} LinkedIn`}
                        sx={{
                          border: '1px solid', borderColor: 'divider',
                          '&:hover': { borderColor: member.avatarColor, color: member.avatarColor },
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <LinkedIn fontSize="small" />
                      </IconButton>
                      <IconButton
                        href={member.github}
                        size="small"
                        aria-label={`${member.name} GitHub`}
                        sx={{
                          border: '1px solid', borderColor: 'divider',
                          '&:hover': { borderColor: member.avatarColor, color: member.avatarColor },
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <GitHub fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

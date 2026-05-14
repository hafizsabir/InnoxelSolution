// components/careers/CareersClient.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Code,
  DesignServices,
  Cloud,
  Psychology,
  Work,
  LocationOn,
  AccessTime,
  TrendingUp,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';

/* ─── Data ──────────────────────────────────────────────────────────────── */

const JOBS = [
  {
    id: 1,
    icon: Code,
    title: 'Full-Stack Developer',
    type: 'Full-Time',
    location: 'Remote / Karachi',
    level: 'Mid–Senior',
    color: '#4361ee',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL'],
    description:
      'Build scalable web applications end-to-end. You will own features from database schema to pixel-perfect UI, work in an agile team, and ship production-grade code every sprint.',
    responsibilities: [
      'Architect and develop full-stack features using React + Next.js',
      'Design robust REST/GraphQL APIs with Node.js or ASP.NET Core',
      'Optimise PostgreSQL queries and database schema design',
      'Participate in code reviews and maintain high test coverage',
      'Collaborate with design and product to ship fast and right',
    ],
    perks: ['Competitive salary', 'Remote-first', 'Learning budget', 'Equity options'],
  },
  {
    id: 2,
    icon: DesignServices,
    title: 'UI/UX Designer',
    type: 'Full-Time',
    location: 'Remote / Lahore',
    level: 'Mid-Level',
    color: '#7209b7',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research', 'Motion'],
    description:
      'Craft delightful, research-driven experiences for our products. You will own the entire design process — from discovery workshops to pixel-perfect Figma handoff.',
    responsibilities: [
      'Lead end-to-end UX research and design for web and mobile',
      'Build and maintain our Design System in Figma',
      'Create wireframes, interactive prototypes, and final specs',
      'Conduct usability testing and iterate based on real feedback',
      'Collaborate with engineering to ensure design quality in production',
    ],
    perks: ['Competitive salary', 'Tool allowance', 'Remote-first', 'Flexible hours'],
  },
  {
    id: 3,
    icon: Cloud,
    title: 'DevOps / Cloud Engineer',
    type: 'Full-Time',
    location: 'Remote',
    level: 'Senior',
    color: '#06b6d4',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    description:
      'Own our cloud infrastructure and make deployments invisible. You will design fault-tolerant systems on AWS, automate everything, and ensure 99.9% uptime for our clients.',
    responsibilities: [
      'Design and manage scalable AWS/GCP infrastructure with Terraform',
      'Build and optimise CI/CD pipelines (GitHub Actions, ArgoCD)',
      'Manage Kubernetes clusters and containerised workloads',
      'Implement monitoring, alerting and incident response workflows',
      'Drive security hardening and compliance across all environments',
    ],
    perks: ['Top-tier salary', 'AWS certification sponsorship', 'Remote-first', 'On-call bonus'],
  },
  {
    id: 4,
    icon: Psychology,
    title: 'AI/ML Engineer',
    type: 'Contract / Full-Time',
    location: 'Remote',
    level: 'Senior',
    color: '#f72585',
    skills: ['Python', 'PyTorch', 'LangChain', 'OpenAI API', 'Vector DBs'],
    description:
      'Build the AI layer that powers our next-gen products. You will develop LLM-powered features, fine-tune models, and ship AI to production at scale.',
    responsibilities: [
      'Design and implement LLM-powered features using LangChain / OpenAI',
      'Build RAG pipelines with vector databases (Pinecone, pgvector)',
      'Fine-tune open-source models for domain-specific tasks',
      'Ensure AI outputs are safe, tested, and production-ready',
      'Research and prototype cutting-edge AI capabilities',
    ],
    perks: ['Research time', 'GPU budget', 'Conference budget', 'High compensation'],
  },
];

const STATS = [
  { Icon: Work,       label: '4 Open Roles'    },
  { Icon: LocationOn, label: 'Remote First'     },
  { Icon: AccessTime, label: 'Flexible Hours'   },
  { Icon: TrendingUp, label: 'Fast Growth'      },
];

/* ─── Animation variants ────────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden:   { opacity: 0, y: 40 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function CareersClient() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 8,  md: 12 },
          background: isDark
            ? 'linear-gradient(160deg, #0d0f1a 0%, #1a1040 50%, #0d0f1a 100%)'
            : 'linear-gradient(160deg, #f0f4ff 0%, #e8d5ff 50%, #f0f4ff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        {['#4361ee', '#7209b7'].map((c, i) => (
          <Box
            key={c}
            sx={{
              position: 'absolute',
              width: 400, height: 400,
              borderRadius: '50%',
              background: alpha(c, 0.08),
              filter: 'blur(80px)',
              top:    i === 0 ? -100 : 'auto',
              bottom: i === 1 ? -80  : 'auto',
              left:   i === 0 ? -100 : 'auto',
              right:  i === 1 ? -100 : 'auto',
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Chip
              label="We're Hiring"
              size="small"
              sx={{
                mb: 3,
                sx: { fontWeight: 700 },
                fontSize: '0.75rem',
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            />

            {/* ── Title: fontWeight inside sx to satisfy MUI v9 ── */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Build the Future With Us
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.7 }}
            >
              Join a team of passionate engineers, designers, and problem-solvers who
              are shipping world-class products for ambitious clients worldwide.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: isDark ? alpha('#4361ee', 0.08) : alpha('#4361ee', 0.04),
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {STATS.map(({ Icon, label }) => (
              <Grid key={label} size={{ xs: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Job Cards ─────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={4}>
            {JOBS.map((job) => {
              const Icon   = job.icon;
              const isOpen = expanded === job.id;

              return (
                <Grid key={job.id} size={{ xs: 12, md: 6 }}>
                  <motion.div variants={cardVariants} style={{ height: '100%' }}>
                    <Box
                      onClick={() => setExpanded(isOpen ? null : job.id)}
                      sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: isOpen ? job.color : 'divider',
                        borderRadius: 4,
                        p: 3.5,
                        bgcolor: isDark ? alpha(job.color, 0.04) : alpha(job.color, 0.02),
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: job.color,
                          boxShadow: `0 8px 32px ${alpha(job.color, 0.15)}`,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 52, height: 52, borderRadius: 3, flexShrink: 0,
                            background: `linear-gradient(135deg, ${alpha(job.color, 0.2)}, ${alpha(job.color, 0.35)})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Icon sx={{ color: job.color, fontSize: 26 }} />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, lineHeight: 1.3 }}
                          >
                            {job.title}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 0.8 }}>
                            <Chip
                              label={job.type}
                              size="small"
                              sx={{
                                fontSize: '0.72rem',
                                bgcolor: alpha(job.color, 0.12),
                                color: job.color,
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label={job.location}
                              size="small"
                              icon={<LocationOn sx={{ fontSize: '0.85rem !important' }} />}
                              sx={{ fontSize: '0.72rem' }}
                            />
                            <Chip label={job.level} size="small" sx={{ fontSize: '0.72rem' }} />
                          </Box>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7, mb: 2 }}
                      >
                        {job.description}
                      </Typography>

                      {/* Skills */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
                        {job.skills.map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.72rem',
                              borderColor: alpha(job.color, 0.4),
                              color: job.color,
                            }}
                          />
                        ))}
                      </Box>

                      {/* Expandable details */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="expand"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <Divider sx={{ mb: 2 }} />

                            <Typography
                              sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1 }}
                              color="text.primary"
                            >
                              Responsibilities
                            </Typography>

                            {job.responsibilities.map((r) => (
                              <Box key={r} sx={{ display: 'flex', gap: 1, mb: 0.8 }}>
                                <CheckCircle
                                  sx={{ color: job.color, fontSize: 16, mt: 0.3, flexShrink: 0 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.6 }}
                                >
                                  {r}
                                </Typography>
                              </Box>
                            ))}

                            <Typography
                              sx={{ fontWeight: 700, fontSize: '0.85rem', mt: 2, mb: 1 }}
                              color="text.primary"
                            >
                              Perks
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
                              {job.perks.map((p) => (
                                <Chip
                                  key={p}
                                  label={p}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(job.color, 0.1),
                                    color: job.color,
                                    fontWeight: 600,
                                    fontSize: '0.72rem',
                                  }}
                                />
                              ))}
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForward />}
                        href="mailto:careers@innoxel.io"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          background: `linear-gradient(135deg, ${job.color}, ${job.color}cc)`,
                          fontWeight: 700,
                          borderRadius: 2,
                          mt: 0.5,
                          '&:hover': { opacity: 0.9 },
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              mt: 10,
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }} color="white">
              Don&apos;t see your role?
            </Typography>
            <Typography color="rgba(255,255,255,0.8)" sx={{ mb: 3, fontSize: '1.05rem' }}>
              We&apos;re always looking for exceptional talent. Send us your CV and tell us
              what you&apos;re great at.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              href="mailto:careers@innoxel.io"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                fontWeight: 700,
                px: 4,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Send Open Application
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

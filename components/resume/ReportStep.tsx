// components/resume/ReportStep.tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  Box, Typography, Grid, Button, Chip, Divider,
  LinearProgress, useTheme, alpha, Tooltip,
} from '@mui/material';
import {
  CheckCircle, Warning, Cancel, ArrowBack,
  EditNote, TipsAndUpdates, LightbulbOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import type { ATSResult, SectionResult } from '@/lib/ats-scoring';
import type { ParsedCVData } from '@/lib/cv-parser';

interface Props {
  result: ATSResult;
  parsedCV: ParsedCVData;
  onEditCV: () => void;
  onBack: () => void;
}

function scoreColor(score: number) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function gradeColor(grade: string) {
  if (grade === 'A') return '#10b981';
  if (grade === 'B') return '#06b6d4';
  if (grade === 'C') return '#f59e0b';
  if (grade === 'D') return '#f97316';
  return '#ef4444';
}

function StatusIcon({ status }: { status: SectionResult['status'] }) {
  if (status === 'good')    return <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />;
  if (status === 'warning') return <Warning     sx={{ color: '#f59e0b', fontSize: 20 }} />;
  return                           <Cancel       sx={{ color: '#ef4444', fontSize: 20 }} />;
}

function SectionCard({ section, index }: { section: SectionResult; index: number }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const color  = scoreColor(section.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Box
        sx={{
          border: '1px solid',
          borderColor: `${color}44`,
          borderRadius: 3,
          p: 2.5,
          bgcolor: isDark ? alpha(color, 0.04) : alpha(color, 0.03),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StatusIcon status={section.status} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{section.name}</Typography>
          </Box>
          <Chip
            label={`${section.score}/100`}
            size="small"
            sx={{
              fontWeight: 800, fontSize: '0.82rem',
              bgcolor: alpha(color, 0.15),
              color,
            }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={section.score}
          sx={{
            height: 6, borderRadius: 3, mb: 2,
            bgcolor: alpha(color, 0.12),
            '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
          }}
        />

        {section.feedback.map((f) => (
          <Typography key={f} variant="body2" color="text.secondary" sx={{ mb: 0.4, lineHeight: 1.6, fontSize: '0.82rem' }}>
            {f}
          </Typography>
        ))}

        {section.tips.length > 0 && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            {section.tips.map((tip) => (
              <Box key={tip} sx={{ display: 'flex', gap: 0.8, mb: 0.6 }}>
                <LightbulbOutlined sx={{ color: '#f59e0b', fontSize: 15, mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                  {tip}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

export default function ReportStep({ result, parsedCV, onEditCV, onBack }: Props) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const color  = scoreColor(result.totalScore);
  const gColor = gradeColor(result.grade);

  return (
    <Box>
      {/* ── Score Summary ──────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box
          sx={{
            p: { xs: 3, md: 5 }, mb: 5, borderRadius: 4,
            background: isDark
              ? 'linear-gradient(135deg, #1a1040 0%, #0d0f1a 100%)'
              : 'linear-gradient(135deg, #f0f4ff 0%, #ede0ff 100%)',
            border: '1px solid', borderColor: alpha(color, 0.3),
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            {/* Gauge */}
            <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 160, mx: 'auto' }}>
                <CircularProgressbar
                  value={result.totalScore}
                  text={`${result.totalScore}`}
                  styles={buildStyles({
                    pathColor: color,
                    textColor: color,
                    trailColor: isDark ? '#ffffff15' : '#00000010',
                    textSize: '22px',
                  })}
                />
              </Box>
              <Typography color="text.secondary" sx={{ fontSize: '0.85rem', mt: 1 }}>ATS Score</Typography>
              <Chip
                label={`Grade: ${result.grade}`}
                sx={{ mt: 0.8, fontWeight: 800, bgcolor: alpha(gColor, 0.15), color: gColor }}
              />
            </Grid>

            {/* Summary stats */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                {result.totalScore >= 75
                  ? '🎉 Strong CV — Minor tweaks needed'
                  : result.totalScore >= 55
                  ? '⚡ Good foundation — Several improvements will help'
                  : '🔧 Needs significant improvements to pass ATS filters'}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                {result.totalScore >= 75
                  ? `Your resume scores well. It matches ${result.matchedSkills.length} key skills and has solid structure.`
                  : `Your resume is missing important keywords and structure that ATS systems look for. Follow the fixes below to boost your score.`}
              </Typography>

              <Grid container spacing={2}>
                {[
                  { label: 'Skills Matched', value: result.matchedSkills.length, color: '#10b981' },
                  { label: 'Skills Missing', value: result.missingSkills.length, color: '#ef4444' },
                  { label: 'Keyword Density', value: `${result.keywordDensity}%`, color: '#4361ee' },
                  { label: 'JD Similarity', value: `${result.jdSimilarity}%`, color: '#7209b7' },
                ].map(({ label, value, color: c }) => (
                  <Grid key={label} size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 3, bgcolor: alpha(c, 0.08), border: '1px solid', borderColor: alpha(c, 0.2) }}>
                       <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: c }}>{value}</Typography>
                       <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* ── Left Column ─────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Matched Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircle sx={{ color: '#10b981' }} />
                <Typography sx={{ fontWeight: 700 }}>Matched Skills</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {result.matchedSkills.length > 0
                  ? result.matchedSkills.map((s) => (
                      <Chip key={s} label={s} size="small"
                        sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }} />
                    ))
                  : <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>Upload a JD to see skill matches</Typography>}
              </Box>
            </Box>
          </motion.div>

          {/* Missing Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Cancel sx={{ color: '#ef4444' }} />
                <Typography sx={{ fontWeight: 700 }}>Missing Skills</Typography>
              </Box>
              {result.missingSkills.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {result.missingSkills.map((s) => (
                    <Tooltip key={s} title="Add this skill to your CV if you have it">
                      <Chip label={s} size="small"
                        sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', fontWeight: 600, fontSize: '0.75rem', cursor: 'help' }} />
                    </Tooltip>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>No critical skills missing 🎉</Typography>
              )}
            </Box>
          </motion.div>

          {/* Weak Areas */}
          {result.weakAreas.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Box sx={{ p: 3, border: '1px solid', borderColor: alpha('#f59e0b', 0.4), borderRadius: 3, bgcolor: alpha('#f59e0b', 0.03) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Warning sx={{ color: '#f59e0b' }} />
                  <Typography sx={{ fontWeight: 700 }}>Weak Areas</Typography>
                </Box>
                {result.weakAreas.map((a) => (
                  <Typography key={a} variant="body2" color="text.secondary" sx={{ mb: 0.6, fontSize: '0.82rem' }}>
                    • {a}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          )}

          {/* Top Suggestions */}
          {result.suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Box sx={{ p: 3, border: '1px solid', borderColor: alpha('#4361ee', 0.3), borderRadius: 3, mt: 3, bgcolor: alpha('#4361ee', 0.03) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TipsAndUpdates sx={{ color: '#4361ee' }} />
                  <Typography sx={{ fontWeight: 700 }}>Top Suggestions</Typography>
                </Box>
                {result.suggestions.map((s, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 0.8, mb: 0.8 }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#4361ee', fontWeight: 700, minWidth: 16 }}>{i + 1}.</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>{s}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          )}
        </Grid>

        {/* ── Right Column — Section Cards ──────────────────── */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Section-by-Section Analysis</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {result.sections.map((section, i) => (
              <SectionCard key={section.name} section={section} index={i} />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* ── Actions ────────────────────────────────────────────── */}
      <Divider sx={{ my: 5 }} />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack} sx={{ borderRadius: 3, px: 3 }}>
          Upload Different CV
        </Button>
        <Button
          variant="contained"
          startIcon={<EditNote />}
          onClick={onEditCV}
          size="large"
          sx={{
            borderRadius: 3, px: 5, fontWeight: 700,
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
          }}
        >
          Edit & Improve My CV →
        </Button>
      </Box>
    </Box>
  );
}

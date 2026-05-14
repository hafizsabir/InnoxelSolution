// components/resume/ATSAnalyzer.tsx
'use client';

import { useState, useCallback } from 'react';
import { Box, Container, Typography, useTheme, alpha, Stepper, Step, StepLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ATSResult } from '@/lib/ats-scoring';
import type { ParsedCVData } from '@/lib/cv-parser';
import PageLoader from '@/components/ui/PageLoader';

// Lazy-load heavy sub-components
const UploadStep   = dynamic(() => import('./UploadStep'),   { ssr: false });
const ReportStep   = dynamic(() => import('./ReportStep'),   { ssr: false });
const EditorStep   = dynamic(() => import('./CVEditorStep'), { ssr: false });

const STEPS = ['Upload CV', 'ATS Score Report', 'Edit & Download'];

export default function ATSAnalyzer() {
  const theme     = useTheme();
  const isDark    = theme.palette.mode === 'dark';
  const [activeStep, setActiveStep] = useState(0);
  const [atsResult,  setAtsResult]  = useState<ATSResult | null>(null);
  const [parsedCV,   setParsedCV]   = useState<ParsedCVData | null>(null);
  // Shows the 3D PageLoader for 1.5 s after analysis completes
  const [analysing,  setAnalysing]  = useState(false);

  const handleAnalysed = useCallback((result: ATSResult, parsed: ParsedCVData) => {
    setAtsResult(result);
    setParsedCV(parsed);
    setAnalysing(true);
    setTimeout(() => {
      setAnalysing(false);
      setActiveStep(1);
    }, 1500);
  }, []);

  const handleEditCV = useCallback(() => setActiveStep(2), []);
  const handleBack   = useCallback(() => setActiveStep((s) => Math.max(0, s - 1)), []);

  return (
    <>
    {/* ── 3D analysis loader (shown for 1.5 s after CV is processed) ── */}
    <AnimatePresence>
      {analysing && (
        <motion.div
          key="analyse-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
        >
          <PageLoader />
        </motion.div>
      )}
    </AnimatePresence>

    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          pt: { xs: 9, md: 12 },
          pb: { xs: 5, md: 7 },
          background: isDark
            ? 'linear-gradient(160deg, #0d0f1a 0%, #120830 60%, #0d0f1a 100%)'
            : 'linear-gradient(160deg, #f0f4ff 0%, #ede0ff 60%, #f0f4ff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative blobs */}
        {['#4361ee', '#7209b7', '#06b6d4'].map((c, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute', borderRadius: '50%',
              width: 350, height: 350,
              background: alpha(c, 0.07),
              filter: 'blur(80px)',
              top: i % 2 === 0 ? -80 : 'auto',
              bottom: i === 1 ? -60 : 'auto',
              left: i === 0 ? -80 : 'auto',
              right: i !== 0 ? -80 : 'auto',
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '3rem' },
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              ATS Resume Analyzer
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
              Upload your CV, compare against a job description, get an instant ATS score with actionable improvements — then download your optimized resume.
            </Typography>
          </motion.div>

          {/* Stepper */}
          <Box sx={{ mt: 5 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {STEPS.map((label, i) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': { fontWeight: 600, fontSize: '0.82rem' },
                      '& .MuiStepIcon-root.Mui-active':    { color: '#4361ee' },
                      '& .MuiStepIcon-root.Mui-completed': { color: '#7209b7' },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Container>
      </Box>

      {/* ── Step Content ─────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4 }}>
              <UploadStep onAnalysed={handleAnalysed} />
            </motion.div>
          )}
          {activeStep === 1 && atsResult && parsedCV && (
            <motion.div key="report" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4 }}>
              <ReportStep result={atsResult} parsedCV={parsedCV} onEditCV={handleEditCV} onBack={handleBack} />
            </motion.div>
          )}
          {activeStep === 2 && parsedCV && (
            <motion.div key="editor" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4 }}>
              <EditorStep parsedCV={parsedCV} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
    </>
  );
}

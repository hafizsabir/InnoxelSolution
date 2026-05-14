// components/resume/UploadStep.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import { CloudUpload, Description, PictureAsPdf, Work } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ATSResult } from '@/lib/ats-scoring';
import type { ParsedCVData } from '@/lib/cv-parser';

interface Props {
  onAnalysed: (result: ATSResult, parsed: ParsedCVData) => void;
}

async function extractTextFromFile(file: File): Promise<{ text: string; fileType: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'pdf') {
    const pdfjsLib = await import('pdfjs-dist');
    // Use the locally bundled worker (copied to /public at build time)
    // avoids CDN dependency and version mismatch issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items
        .filter((item): item is import('pdfjs-dist/types/src/display/api').TextItem =>
          'str' in item && typeof (item as { str?: unknown }).str === 'string'
        )
        .map((item) => item.str)
        .join(' ') + '\n';
    }
    return { text: text.trim(), fileType: 'pdf' };
  }

  if (ext === 'docx' || ext === 'doc') {
    const mammoth    = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result     = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value.trim(), fileType: 'docx' };
  }

  throw new Error('Unsupported file type. Please upload a PDF or Word (.docx) file.');
}

export default function UploadStep({ onAnalysed }: Props) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [file,    setFile]    = useState<File | null>(null);
  const [jdText,  setJdText]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    maxSize:  10 * 1024 * 1024,
    onDropRejected: () => setError('File rejected. Please upload a PDF or DOCX under 10 MB.'),
  });

  const handleAnalyse = async () => {
    if (!file) { setError('Please upload your CV first.'); return; }
    setLoading(true);
    setError('');
    try {
      const { text, fileType } = await extractTextFromFile(file);
      if (text.length < 100)
        throw new Error('Could not extract enough text. Please try a text-based PDF or .docx.');
      const { analyseCV } = await import('@/lib/ats-scoring');
      const { parseCV }   = await import('@/lib/cv-parser');
      const result = analyseCV(text, jdText, fileType);
      const parsed = parseCV(text);
      onAnalysed(result, parsed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ext   = file?.name.split('.').pop()?.toLowerCase();
  const isPDF = ext === 'pdf';

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto' }}>

      {/* ── Dropzone ──────────────────────────────────────────────── */}
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : file ? 'success.main' : 'divider',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive
              ? alpha('#4361ee', 0.06)
              : file
              ? alpha('#10b981', 0.05)
              : isDark ? alpha('#fff', 0.02) : alpha('#4361ee', 0.02),
            transition: 'all 0.3s ease',
            '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#4361ee', 0.05) },
          }}
        >
          <input {...getInputProps()} />

          {file ? (
            <Box>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2,
                  background: isPDF
                    ? 'linear-gradient(135deg,#ff4444,#cc0000)'
                    : 'linear-gradient(135deg,#4361ee,#7209b7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {isPDF
                  ? <PictureAsPdf sx={{ color: '#fff', fontSize: 32 }} />
                  : <Description  sx={{ color: '#fff', fontSize: 32 }} />}
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                {file.name}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {(file.size / 1024).toFixed(0)} KB · Click or drag to replace
              </Typography>
              <Chip
                label="✓ File Ready"
                color="success"
                size="small"
                sx={{ mt: 1.5, fontWeight: 700 }}
              />
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  width: 72, height: 72, borderRadius: 4, mx: 'auto', mb: 2,
                  background: 'linear-gradient(135deg,#4361ee22,#7209b722)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <CloudUpload sx={{ fontSize: 36, color: 'primary.main' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', mb: 0.5 }}>
                {isDragActive ? 'Drop your CV here' : 'Drag & Drop your CV'}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                or click to browse · PDF or DOCX · Max 10 MB
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>

      {/* ── Job Description Input ─────────────────────────────────── */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          {/* Work replaces the removed WorkOutline icon in MUI v9 */}
          <Work sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700 }}>
            Paste Job Description{' '}
            <Typography
              component="span"
              color="text.secondary"
              sx={{ fontWeight: 400, fontSize: '0.85rem' }}
            >
              (optional but recommended — enables keyword matching)
            </Typography>
          </Typography>
        </Box>
        <TextField
          multiline
          rows={5}
          fullWidth
          placeholder="Paste the job description here to get targeted ATS keyword analysis and skills matching score..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        {jdText && (
          <Typography color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
            {jdText.split(' ').length} words · ATS matching enabled ✓
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Analyse Button ────────────────────────────────────────── */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disabled={!file || loading}
          onClick={handleAnalyse}
          sx={{
            px: 6, py: 1.6, fontWeight: 800, fontSize: '1rem', borderRadius: 3,
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            '&:hover':   { opacity: 0.9 },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={20} color="inherit" />
              Analysing your CV...
            </Box>
          ) : (
            '🔍  Analyze My CV'
          )}
        </Button>
        <Typography color="text.secondary" sx={{ fontSize: '0.8rem', mt: 1.5 }}>
          100% private — your CV is processed in your browser only, never uploaded to any server.
        </Typography>
      </Box>

      {/* ── Feature Hints ─────────────────────────────────────────── */}
      <Box
        sx={{
          mt: 5,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3,1fr)' },
          gap: 2,
        }}
      >
        {[
          { emoji: '📊', title: 'ATS Score',       desc: 'Strict 0–100 score using real ATS logic' },
          { emoji: '🎯', title: 'Skills Match',     desc: 'Keyword overlap against job description' },
          { emoji: '✏️',  title: 'Edit & Download', desc: 'Update your CV, download as PDF or Word' },
        ].map(({ emoji, title, desc }) => (
          <Box
            key={title}
            sx={{
              p: 2.5, borderRadius: 3, textAlign: 'center',
              border: '1px solid', borderColor: 'divider',
              bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#4361ee', 0.02),
            }}
          >
            <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>{emoji}</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{title}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.8rem' }}>{desc}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

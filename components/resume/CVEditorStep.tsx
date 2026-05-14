// components/resume/CVEditorStep.tsx
'use client';

import { useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Divider,
  Chip, IconButton, Accordion, AccordionSummary, AccordionDetails,
  Alert, useTheme, alpha, CircularProgress,
} from '@mui/material';
import {
  ExpandMore, Add, Delete, ArrowBack,
  PictureAsPdf, Description as WordIcon, Person,
  Work, School, Build, EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ParsedCVData, ExperienceEntry, EducationEntry } from '@/lib/cv-parser';

interface Props {
  parsedCV: ParsedCVData;
  onBack: () => void;
}

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function CVEditorStep({ parsedCV, onBack }: Props) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ─── State ───────────────────────────────────────────────────────────────
  const [name,      setName]      = useState(parsedCV.name);
  const [email,     setEmail]     = useState(parsedCV.email);
  const [phone,     setPhone]     = useState(parsedCV.phone);
  const [linkedin,  setLinkedIn]  = useState(parsedCV.linkedin);
  const [github,    setGitHub]    = useState(parsedCV.github);
  const [location,  setLocation]  = useState(parsedCV.location);
  const [summary,   setSummary]   = useState(parsedCV.summary);
  const [skills,    setSkills]    = useState<string[]>(parsedCV.skills.length ? parsedCV.skills : []);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState<ExperienceEntry[]>(
    parsedCV.experience.length ? parsedCV.experience : [{ id: uid(), company: '', title: '', startDate: '', endDate: '', bullets: [''] }]
  );
  const [education, setEducation] = useState<EducationEntry[]>(
    parsedCV.education.length ? parsedCV.education : [{ id: uid(), institution: '', degree: '', field: '', year: '' }]
  );
  const [certs, setCerts]  = useState<string[]>(parsedCV.certifications.length ? parsedCV.certifications : []);
  const [certInput, setCertInput] = useState('');
  const [dlLoading, setDlLoading] = useState<'pdf' | 'docx' | null>(null);
  const [dlError,   setDlError]   = useState('');

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const buildCV = (): ParsedCVData => ({
    name, email, phone, linkedin, github, location, summary,
    skills, experience, education, certifications: certs, rawText: parsedCV.rawText,
  });

  // ── Skills ───────────────────────────────────────────────────────────────
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
  };

  // ── Experience ───────────────────────────────────────────────────────────
  const addExp = () => setExperience([...experience, { id: uid(), company: '', title: '', startDate: '', endDate: '', bullets: [''] }]);
  const removeExp = (id: string) => setExperience(experience.filter((e) => e.id !== id));
  const updateExp = (id: string, field: keyof ExperienceEntry, value: string | string[]) =>
    setExperience(experience.map((e) => e.id === id ? { ...e, [field]: value } : e));
  const updateBullet = (expId: string, bi: number, value: string) =>
    setExperience(experience.map((e) => e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => i === bi ? value : b) } : e));
  const addBullet = (expId: string) =>
    setExperience(experience.map((e) => e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e));
  const removeBullet = (expId: string, bi: number) =>
    setExperience(experience.map((e) => e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bi) } : e));

  // ── Education ────────────────────────────────────────────────────────────
  const addEdu = () => setEducation([...education, { id: uid(), institution: '', degree: '', field: '', year: '' }]);
  const removeEdu = (id: string) => setEducation(education.filter((e) => e.id !== id));
  const updateEdu = (id: string, field: keyof EducationEntry, value: string) =>
    setEducation(education.map((e) => e.id === id ? { ...e, [field]: value } : e));

  // ── Downloads ────────────────────────────────────────────────────────────
  const handleDownload = async (type: 'pdf' | 'docx') => {
    setDlLoading(type);
    setDlError('');
    try {
      const cv = buildCV();
      if (type === 'pdf') {
        const { downloadAsPDF } = await import('@/lib/cv-generator');
        await downloadAsPDF(cv);
      } else {
        const { downloadAsWord } = await import('@/lib/cv-generator');
        await downloadAsWord(cv);
      }
    } catch (err) {
      setDlError('Download failed. Please try again.');
      console.error(err);
    } finally {
      setDlLoading(null);
    }
  };

  const sectionHeader = (icon: React.ReactNode, title: string) => (
    <AccordionSummary expandIcon={<ExpandMore />} sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5 } }}>
      {icon}
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
    </AccordionSummary>
  );

  const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: 2 } };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Edit Your CV</Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Update your details below, then download as PDF or Word</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={dlLoading === 'docx' ? <CircularProgress size={16} /> : <WordIcon />}
              disabled={!!dlLoading}
              onClick={() => handleDownload('docx')}
              sx={{ borderRadius: 2.5, fontWeight: 700, borderColor: '#4361ee', color: '#4361ee' }}
            >
              {dlLoading === 'docx' ? 'Generating...' : 'Download Word'}
            </Button>
            <Button
              variant="contained"
              startIcon={dlLoading === 'pdf' ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdf />}
              disabled={!!dlLoading}
              onClick={() => handleDownload('pdf')}
              sx={{
                borderRadius: 2.5, fontWeight: 700,
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
              }}
            >
              {dlLoading === 'pdf' ? 'Generating...' : 'Download PDF'}
            </Button>
          </Box>
        </Box>

        {dlError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{dlError}</Alert>}

        {/* ── Personal Info ──────────────────────────────────────── */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
          {sectionHeader(<Person sx={{ color: '#4361ee' }} />, 'Personal Information')}
          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                { label: 'Full Name',         value: name,     setter: setName,     xs: 12, md: 6 },
                { label: 'Email',             value: email,    setter: setEmail,    xs: 12, md: 6 },
                { label: 'Phone',             value: phone,    setter: setPhone,    xs: 12, md: 6 },
                { label: 'Location',          value: location, setter: setLocation, xs: 12, md: 6 },
                { label: 'LinkedIn URL',      value: linkedin, setter: setLinkedIn, xs: 12, md: 6 },
                { label: 'GitHub URL',        value: github,   setter: setGitHub,   xs: 12, md: 6 },
              ].map(({ label, value, setter, xs, md }) => (
                <Grid key={label} size={{ xs, md }}>
                  <TextField label={label} fullWidth size="small" value={value}
                    onChange={(e) => setter(e.target.value)} sx={inputSx} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* ── Summary ────────────────────────────────────────────── */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
          {sectionHeader(<Work sx={{ color: '#7209b7' }} />, 'Professional Summary')}
          <AccordionDetails>
            <TextField
              multiline rows={4} fullWidth value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a 3–5 sentence summary: years of experience, key skills, and what value you bring..."
              helperText={`${summary.split(' ').filter(Boolean).length} words · Aim for 80–120 words`}
              sx={inputSx}
            />
          </AccordionDetails>
        </Accordion>

        {/* ── Skills ─────────────────────────────────────────────── */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
          {sectionHeader(<Build sx={{ color: '#06b6d4' }} />, `Skills (${skills.length})`)}
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {skills.map((s) => (
                <Chip key={s} label={s} onDelete={() => setSkills(skills.filter((sk) => sk !== s))}
                  sx={{ bgcolor: alpha('#4361ee', 0.1), color: '#4361ee', fontWeight: 600 }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Add a skill (e.g. React, Docker, Python...)"
                value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                sx={{ flex: 1, ...inputSx }} />
              <Button variant="contained" startIcon={<Add />} onClick={addSkill}
                sx={{ borderRadius: 2, bgcolor: '#4361ee', '&:hover': { bgcolor: '#3451d4' } }}>
                Add
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Experience ─────────────────────────────────────────── */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
          {sectionHeader(<Work sx={{ color: '#f72585' }} />, 'Work Experience')}
          <AccordionDetails>
            {experience.map((exp, ei) => (
              <Box key={exp.id} sx={{
                p: 2.5, mb: 2, borderRadius: 3,
                bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#f8f9ff', 0.8),
                border: '1px solid', borderColor: 'divider',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }} color="text.secondary">Position {ei + 1}</Typography>
                  {experience.length > 1 && (
                    <IconButton size="small" onClick={() => removeExp(exp.id)} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Job Title" fullWidth size="small" value={exp.title}
                      onChange={(e) => updateExp(exp.id, 'title', e.target.value)} sx={inputSx} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Company Name" fullWidth size="small" value={exp.company}
                      onChange={(e) => updateExp(exp.id, 'company', e.target.value)} sx={inputSx} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Start Date (e.g. Jan 2022)" fullWidth size="small" value={exp.startDate}
                      onChange={(e) => updateExp(exp.id, 'startDate', e.target.value)} sx={inputSx} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="End Date (or 'Present')" fullWidth size="small" value={exp.endDate}
                      onChange={(e) => updateExp(exp.id, 'endDate', e.target.value)} sx={inputSx} />
                  </Grid>
                </Grid>
                <Typography color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mt: 2, mb: 1 }}>
                  Achievements / Bullets (use action verbs + metrics):
                </Typography>
                {exp.bullets.map((bullet, bi) => (
                  <Box key={bi} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField fullWidth size="small" value={bullet}
                      placeholder={`e.g. Developed X using Y, reducing Z by 40%`}
                      onChange={(e) => updateBullet(exp.id, bi, e.target.value)} sx={inputSx} />
                    {exp.bullets.length > 1 && (
                      <IconButton size="small" onClick={() => removeBullet(exp.id, bi)} sx={{ color: 'error.main', flexShrink: 0 }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button size="small" startIcon={<Add />} onClick={() => addBullet(exp.id)}
                  sx={{ mt: 0.5, color: '#4361ee', textTransform: 'none', fontWeight: 600 }}>
                  Add bullet point
                </Button>
              </Box>
            ))}
            <Button variant="outlined" startIcon={<Add />} onClick={addExp} fullWidth
              sx={{ borderRadius: 3, borderStyle: 'dashed', borderColor: '#4361ee', color: '#4361ee', fontWeight: 600, mt: 1 }}>
              Add Another Position
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* ── Education ──────────────────────────────────────────── */}
        <Accordion sx={{ borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
          {sectionHeader(<School sx={{ color: '#10b981' }} />, 'Education')}
          <AccordionDetails>
            {education.map((edu, ei) => (
              <Box key={edu.id} sx={{ p: 2.5, mb: 2, borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#f8fff8', 0.8), border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }} color="text.secondary">Entry {ei + 1}</Typography>
                  {education.length > 1 && (
                    <IconButton size="small" onClick={() => removeEdu(edu.id)} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  {[
                    { label: 'Institution / University', field: 'institution' as const, xs: 12, md: 12 },
                    { label: 'Degree (e.g. Bachelor)',   field: 'degree'      as const, xs: 12, md: 4 },
                    { label: 'Field of Study',           field: 'field'       as const, xs: 12, md: 4 },
                    { label: 'Graduation Year',          field: 'year'        as const, xs: 12, md: 4 },
                  ].map(({ label, field, xs, md }) => (
                    <Grid key={field} size={{ xs, md }}>
                      <TextField label={label} fullWidth size="small" value={edu[field]}
                        onChange={(e) => updateEdu(edu.id, field, e.target.value)} sx={inputSx} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
            <Button variant="outlined" startIcon={<Add />} onClick={addEdu} fullWidth
              sx={{ borderRadius: 3, borderStyle: 'dashed', borderColor: '#10b981', color: '#10b981', fontWeight: 600 }}>
              Add Education Entry
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* ── Certifications ─────────────────────────────────────── */}
        <Accordion sx={{ borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
          {sectionHeader(<EmojiEvents sx={{ color: '#f59e0b' }} />, `Certifications (${certs.length})`)}
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {certs.map((c, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                  <TextField fullWidth size="small" value={c}
                    onChange={(e) => setCerts(certs.map((x, j) => j === i ? e.target.value : x))} sx={inputSx} />
                  <IconButton size="small" onClick={() => setCerts(certs.filter((_, j) => j !== i))} sx={{ color: 'error.main' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="e.g. AWS Solutions Architect — Associate (2024)"
                value={certInput} onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && certInput.trim()) { setCerts([...certs, certInput.trim()]); setCertInput(''); }}}
                sx={{ flex: 1, ...inputSx }} />
              <Button variant="contained" startIcon={<Add />}
                onClick={() => { if (certInput.trim()) { setCerts([...certs, certInput.trim()]); setCertInput(''); }}}
                sx={{ borderRadius: 2, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}>
                Add
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Bottom Download Bar ────────────────────────────────── */}
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            p: 3.5, borderRadius: 4, textAlign: 'center',
            background: isDark
              ? 'linear-gradient(135deg, #1a1040, #120830)'
              : 'linear-gradient(135deg, #f0f4ff, #ede0ff)',
            border: '1px solid', borderColor: alpha('#4361ee', 0.2),
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Ready to Download?</Typography>
          <Typography color="text.secondary" sx={{ fontSize: '0.9rem', mb: 3 }}>
            Your CV is formatted in an ATS-friendly single-column layout.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined" size="large"
              startIcon={dlLoading === 'docx' ? <CircularProgress size={18} /> : <WordIcon />}
              disabled={!!dlLoading}
              onClick={() => handleDownload('docx')}
              sx={{ px: 4, borderRadius: 3, fontWeight: 700, borderColor: '#4361ee', color: '#4361ee' }}
            >
              {dlLoading === 'docx' ? 'Generating...' : '⬇ Download as Word (.docx)'}
            </Button>
            <Button
              variant="contained" size="large"
              startIcon={dlLoading === 'pdf' ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdf />}
              disabled={!!dlLoading}
              onClick={() => handleDownload('pdf')}
              sx={{ px: 4, borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #4361ee, #7209b7)' }}
            >
              {dlLoading === 'pdf' ? 'Generating...' : '⬇ Download as PDF'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ color: 'text.secondary' }}>
            Back to Score Report
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}

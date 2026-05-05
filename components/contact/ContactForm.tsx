'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Send, CheckCircle } from '@mui/icons-material';

const services = [
  'Web Application Development',
  'Mobile App Development',
  'AI / Machine Learning',
  'Cloud Solutions',
  'UI/UX Design',
  'Custom Software Development',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          px: 4,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: '0 12px 30px rgba(67,97,238,0.35)',
          }}
        >
          <CheckCircle sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800, mb: 1.5 }}>
          Message Sent!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 360 }}>
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 4 }}
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', service: '', message: '' }); }}
        >
          Send Another Message
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="name"
            id="contact-name"
            value={form.name}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Email Address"
            name="email"
            id="contact-email"
            type="email"
            value={form.email}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Service Interested In"
            name="service"
            id="contact-service"
            value={form.service}
            onChange={handleChange}
            variant="outlined"
          >
            {services.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            multiline
            rows={5}
            label="Your Message"
            name="message"
            id="contact-message"
            value={form.message}
            onChange={handleChange}
            variant="outlined"
            placeholder="Tell us about your project, goals, timeline, and budget..."
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={status === 'loading'}
            endIcon={status === 'loading' ? <CircularProgress size={18} color="inherit" /> : <Send />}
            sx={{ py: 1.75, fontSize: '1rem' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

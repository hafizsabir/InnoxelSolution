// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Box, Container, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Alert, Stack, Divider,
} from '@mui/material';
import { Email, Lock, Person, Visibility, VisibilityOff, FlashOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      setSuccess('Account created! Check your email to confirm, then log in.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(67,97,238,0.06) 0%, rgba(114,9,183,0.06) 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack alignItems="center" spacing={1} sx={{ mb: 5 }}>
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: 3,
                  background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <FlashOn sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" fontWeight={900} sx={{ background: 'linear-gradient(135deg, #4361ee, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join the Innoxel admin panel
              </Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSignup}>
              <TextField
                fullWidth label="Full name" value={name}
                onChange={(e) => setName(e.target.value)} required sx={{ mb: 2.5 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Email address" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2.5 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Password" type={showPass ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3.5 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading || !!success} sx={{ py: 1.75, fontSize: '1rem', mb: 3 }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.disabled">OR</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Box component={Link} href="/login" sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Sign in
                </Box>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

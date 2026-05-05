// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Container, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Alert, Divider, Stack,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, FlashOn, Shield } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: '🚫 Access denied. Only administrators can access that page.',
  session_expired: '⏱ Your session has expired. Please sign in again.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorParam ? (ERROR_MESSAGES[errorParam] ?? errorParam) : '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        return;
      }

      // Redirect admins → /admin (or their original destination), others → home
      if (data.user?.role === 'admin') {
        router.push(redirect.startsWith('/admin') ? redirect : '/admin');
      } else {
        router.push('/');
      }
      router.refresh();
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
            {/* Logo */}
            <Stack alignItems="center" spacing={1} sx={{ mb: 5 }}>
              <Box
                sx={{
                  width: 56, height: 56, borderRadius: 3,
                  background: 'linear-gradient(135deg, #4361ee, #7209b7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(67,97,238,0.35)',
                }}
              >
                <FlashOn sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography variant="h5" fontWeight={900} sx={{ background: 'linear-gradient(135deg, #4361ee, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Innoxel Portal
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Shield sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">
                  JWT-secured • Role-based access
                </Typography>
              </Box>
            </Stack>

            {error && (
              <Alert severity={errorParam === 'forbidden' ? 'warning' : 'error'} sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth label="Email address" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth label="Password" type={showPass ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                required sx={{ mb: 3.5 }}
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

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.75, fontSize: '1rem', mb: 1.5 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>

              <Typography variant="caption" color="text.disabled" display="block" textAlign="center">
                Admins are redirected to the Admin Panel automatically
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.disabled">OR</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Box component={Link} href="/signup" sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Create one
                </Box>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
      <LoginForm />
    </Suspense>
  );
}

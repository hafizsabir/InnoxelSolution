'use client';

import { createTheme, PaletteMode } from '@mui/material/styles';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#4361ee',
      light: '#7b90f5',
      dark: '#2a3eb1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7209b7',
      light: '#a447e0',
      dark: '#4a0080',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f8f9ff' : '#0d0f1a',
      paper: mode === 'light' ? '#ffffff' : '#13162b',
    },
    text: {
      primary: mode === 'light' ? '#1a1a2e' : '#e8eaf6',
      secondary: mode === 'light' ? '#4a4a6a' : '#9e9ec8',
    },
    divider: mode === 'light' ? 'rgba(67,97,238,0.12)' : 'rgba(123,144,245,0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none' as const,
          padding: '10px 24px',
          transition: 'all 0.25s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)',
          boxShadow: '0 4px 20px rgba(67,97,238,0.35)',
          '&:hover': {
            boxShadow: '0 6px 28px rgba(67,97,238,0.55)',
            transform: 'translateY(-2px)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 40px rgba(67,97,238,0.18)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export const createAppTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));

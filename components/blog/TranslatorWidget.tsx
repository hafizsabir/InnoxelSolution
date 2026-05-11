'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Tooltip,
  Fade,
  Typography,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import { Translate, Close, Language } from '@mui/icons-material';

/* ─── Language shortcuts for quick-pick ─── */
const quickLangs = [
  { code: 'ur', label: 'اردو', name: 'Urdu' },
  { code: 'ar', label: 'العربية', name: 'Arabic' },
  { code: 'zh-CN', label: '中文', name: 'Chinese' },
  { code: 'es', label: 'Español', name: 'Spanish' },
  { code: 'fr', label: 'Français', name: 'French' },
  { code: 'de', label: 'Deutsch', name: 'German' },
  { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { code: 'ja', label: '日本語', name: 'Japanese' },
  { code: 'pt', label: 'Português', name: 'Portuguese' },
  { code: 'ru', label: 'Русский', name: 'Russian' },
  { code: 'tr', label: 'Türkçe', name: 'Turkish' },
  { code: 'ko', label: '한국어', name: 'Korean' },
];

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean },
          element: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function TranslatorWidget() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [translated, setTranslated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Load Google Translate script once ── */
  useEffect(() => {
    if (document.getElementById('gt-script')) {
      setLoaded(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
      setLoaded(true);
    };

    const script = document.createElement('script');
    script.id = 'gt-script';
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  /* ── Close panel on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* ── Quick-pick: trigger Google Translate programmatically ── */
  const triggerLang = (code: string) => {
    const select = document.querySelector<HTMLSelectElement>(
      '.goog-te-combo'
    );
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      setTranslated(true);
      setOpen(false);
    }
  };

  /* ── Restore original ── */
  const restoreOriginal = () => {
    const iframe = document.getElementById(
      ':1.container'
    ) as HTMLIFrameElement | null;
    // Standard Google Translate restore mechanism
    const bar = document.querySelector<HTMLIFrameElement>('.goog-te-banner-frame');
    if (bar) {
      const doc = bar.contentDocument || bar.contentWindow?.document;
      const btn = doc?.querySelector<HTMLElement>('#\\:1\\.restore');
      btn?.click();
    }
    setTranslated(false);
  };

  return (
    <>
      {/* Hidden Google Translate element (invisible, but required) */}
      <Box
        id="google_translate_element"
        sx={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }}
      />

      {/* ── Floating FAB ── */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 24, md: 32 },
          right: { xs: 20, md: 32 },
          zIndex: 1300,
        }}
      >
        {/* ── Popover panel ── */}
        <Fade in={open}>
          <Paper
            ref={panelRef}
            elevation={0}
            sx={{
              position: 'absolute',
              bottom: 64,
              right: 0,
              width: 300,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #4361ee, #7209b7)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Language sx={{ color: '#fff', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>
                  Translate Article
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.8)', p: 0.4 }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            {/* Quick-pick languages */}
            <Box sx={{ p: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}
              >
                Quick select
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {quickLangs.map((lang) => (
                  <Tooltip key={lang.code} title={lang.name} placement="top">
                    <Chip
                      label={lang.label}
                      size="small"
                      onClick={() => triggerLang(lang.code)}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(67,97,238,0.12), rgba(114,9,183,0.12))',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>

              {/* Google Translate native dropdown (visible for full language list) */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}
                >
                  All languages
                </Typography>
                {/* The native Google Translate combo lives here — styled via global CSS */}
                <Box
                  sx={{
                    '& .goog-te-combo': {
                      width: '100%',
                      p: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer',
                      '&:focus': { borderColor: 'primary.main' },
                    },
                  }}
                >
                  {loaded && (
                    <select
                      className="goog-te-combo"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          triggerLang(e.target.value);
                          setTranslated(true);
                        }
                      }}
                    >
                      <option value="" disabled>
                        Choose a language…
                      </option>
                      {quickLangs.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name} — {l.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Box>
              </Box>

              {/* Restore original */}
              {translated && (
                <Box
                  component="button"
                  onClick={restoreOriginal}
                  sx={{
                    mt: 1.5,
                    width: '100%',
                    py: 0.75,
                    border: '1px solid',
                    borderColor: 'error.main',
                    borderRadius: 2,
                    color: 'error.main',
                    bgcolor: 'transparent',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(211,47,47,0.06)' },
                  }}
                >
                  Restore Original (English)
                </Box>
              )}

              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', display: 'block', mt: 1.5, textAlign: 'center', fontSize: '0.7rem' }}
              >
                Powered by Google Translate
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* ── FAB button ── */}
        <Tooltip title={open ? '' : 'Translate this article'} placement="left">
          <Box
            component="button"
            id="translator-fab"
            onClick={() => setOpen((v) => !v)}
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: 'none',
              background: open
                ? 'linear-gradient(135deg, #7209b7, #4361ee)'
                : 'linear-gradient(135deg, #4361ee, #7209b7)',
              boxShadow: '0 4px 20px rgba(67,97,238,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              '&:hover': {
                transform: open ? 'rotate(180deg) scale(1.08)' : 'scale(1.08)',
                boxShadow: '0 6px 28px rgba(67,97,238,0.55)',
              },
            }}
          >
            {open ? (
              <Close sx={{ color: '#fff', fontSize: 22 }} />
            ) : (
              <Translate sx={{ color: '#fff', fontSize: 22 }} />
            )}
          </Box>
        </Tooltip>
      </Box>
    </>
  );
}
